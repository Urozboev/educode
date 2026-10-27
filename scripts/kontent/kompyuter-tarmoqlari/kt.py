"""
"Kompyuter tarmoqlari" kursi uchun migratsiya generatori — umumiy qism.

Kontent Python ma'lumoti sifatida yoziladi (m*.py, a*.py, l*.py), bu
fayl esa uni tekshiradi va SQL ga aylantiradi. Nega qo'lda SQL emas:

  * Hisob-kitob javoblari (tarmoq manzili, xostlar soni, kechikish)
    qo'lda emas, `ipaddress` va formulalar bilan hisoblanadi.
  * Kod topshiriqlarining yechimi haqiqiy Python'da testlardan
    o'tkaziladi — o'tmasa SQL yozilmaydi.
  * Test variantlari deterministik aralashtiriladi: to'g'ri javob
    doim "a" bo'lib qolmaydi, lekin qayta generatsiyada o'zgarmaydi.
  * Test va topshiriq ID lari slug'dan hosil qilinadi (uuid5). Migratsiya
    qayta ishga tushirilsa, yozuvlar YANGILANADI, o'chirib qayta
    yaratilmaydi — talabalar yuborgan javoblar bog'lanishini yo'qotmaydi.

Ishga tushirish:  py scripts/kontent/kompyuter-tarmoqlari/build.py
"""

from __future__ import annotations

import hashlib
import json
import random
import re
import subprocess
import sys
import uuid
from dataclasses import dataclass, field
from typing import Any

NS = uuid.UUID("6f1c2a54-8b1e-4c3e-9d7a-3b0c1e5a7f21")


def det_uuid(*parts: Any) -> str:
    return str(uuid.uuid5(NS, "/".join(str(p) for p in parts)))


def _perm(n: int, seed: str) -> list[int]:
    rnd = random.Random(hashlib.sha256(seed.encode()).hexdigest())
    idx = list(range(n))
    rnd.shuffle(idx)
    return idx


TAG_RE = re.compile(r"</?(b|i|br|code|p|div|span|strong|em|sup|sub)(\s[^<>]*)?/?>", re.I)


class ContentError(Exception):
    pass


def _plain(s: str, where: str) -> str:
    """Oddiy matn maydonlarida HTML bo'lmasligi kerak — teg ko'rinib qoladi."""
    if TAG_RE.search(s):
        raise ContentError(f"{where}: oddiy matn maydonida HTML teg: {s[:80]!r}")
    return s


# ----------------------------------------------------------------------
# TESTLAR
# ----------------------------------------------------------------------
@dataclass
class Quiz:
    question: str
    options: list[str]
    correct: list[int]
    explain: str
    multiple: bool = False
    points: int = 1


def Q(question: str, options: list[str], correct: int | list[int], explain: str, points: int | None = None) -> Quiz:
    corr = [correct] if isinstance(correct, int) else list(correct)
    multiple = len(corr) > 1
    return Quiz(question, options, corr, explain, multiple, points or (2 if multiple else 1))


def validate_quiz(q: Quiz, where: str) -> None:
    _plain(q.question, where)
    _plain(q.explain, where)
    if not 3 <= len(q.options) <= 6:
        raise ContentError(f"{where}: variantlar soni {len(q.options)}")
    if len(set(q.options)) != len(q.options):
        raise ContentError(f"{where}: takroriy variant")
    for o in q.options:
        _plain(o, where)
    if not q.correct or any(not 0 <= c < len(q.options) for c in q.correct):
        raise ContentError(f"{where}: to'g'ri javob indeksi noto'g'ri")
    if len(set(q.correct)) != len(q.correct):
        raise ContentError(f"{where}: to'g'ri javob takrorlangan")
    if not q.explain.strip():
        raise ContentError(f"{where}: izoh bo'sh")


def quiz_json(q: Quiz, seed: str) -> list[dict]:
    order = _perm(len(q.options), seed + q.question + "|".join(q.options))
    letters = "abcdef"
    return [
        {"id": letters[i], "text": q.options[src], "is_correct": src in q.correct}
        for i, src in enumerate(order)
    ]


# ----------------------------------------------------------------------
# SLAYDLAR
# ----------------------------------------------------------------------
def S_title(title: str, subtitle: str = "", emoji: str = "") -> dict:
    d: dict = {"t": "title", "title": title}
    if subtitle:
        d["subtitle"] = subtitle
    if emoji:
        d["emoji"] = emoji
    return d


def S_idea(title: str, text: str, emoji: str = "") -> dict:
    d: dict = {"t": "idea", "title": title, "text": text}
    if emoji:
        d["emoji"] = emoji
    return d


def S_points(title: str, items: list[str | tuple[str, str]]) -> dict:
    out = []
    for it in items:
        if isinstance(it, tuple):
            out.append({"e": it[0], "text": it[1]})
        else:
            out.append({"text": it})
    return {"t": "points", "title": title, "items": out}


def S_table(title: str, head: list[str], rows: list[list[str]], note: str = "") -> dict:
    d: dict = {"t": "table", "title": title, "head": head, "rows": rows}
    if note:
        d["note"] = note
    return d


def S_compare(title: str, left: tuple[str, str], right: tuple[str, str]) -> dict:
    return {"t": "compare", "title": title,
            "left": {"label": left[0], "text": left[1]},
            "right": {"label": right[0], "text": right[1]}}


def S_code(title: str, code: str, output: str = "", note: str = "") -> dict:
    """Buyruq qatori yoki kod namunasi. `output` — ko'rsatiladigan natija."""
    d: dict = {"t": "code", "title": title, "code": code}
    if output:
        d["output"] = output
    if note:
        d["note"] = note
    return d


def S_quiz(question: str, options: list[str], answer: int, explain: str, title: str = "Tekshiramiz") -> dict:
    return {"t": "quiz", "title": title, "question": question, "options": options, "answer": answer, "explain": explain}


def S_summary(title: str, items: list[str]) -> dict:
    return {"t": "summary", "title": title, "items": items}


def finalize_slides(slides: list[dict], seed: str, where: str) -> list[dict]:
    out = []
    for i, s in enumerate(slides):
        w = f"{where} slayd {i + 1}"
        t = s.get("t")
        if t not in {"title", "idea", "points", "code", "compare", "table", "quiz", "task", "summary"}:
            raise ContentError(f"{w}: noma'lum tur {t}")
        for k, v in s.items():
            if isinstance(v, str) and k not in ("code", "output"):
                _plain(v, w)
        if t == "quiz":
            opts = s["options"]
            if not 0 <= s["answer"] < len(opts) or len(set(opts)) != len(opts):
                raise ContentError(f"{w}: savol javobi noto'g'ri")
            order = _perm(len(opts), seed + s["question"] + "|".join(opts))
            s = dict(s)
            s["options"] = [opts[j] for j in order]
            s["answer"] = order.index(s["answer"])
        if t == "table":
            n = len(s["head"])
            if any(len(r) != n for r in s["rows"]):
                raise ContentError(f"{w}: jadval ustunlari mos emas")
        out.append(s)
    if not out or out[0]["t"] != "title":
        raise ContentError(f"{where}: taqdimot sarlavha slaydi bilan boshlanishi kerak")
    return out


# ----------------------------------------------------------------------
# TOPSHIRIQLAR
# ----------------------------------------------------------------------
APOS = re.compile("[’‘`ʼʻ]")


def norm_text(s: str) -> str:
    return re.sub(r"\s+", " ", APOS.sub("'", s).lower()).strip()


def norm_ip(s: str) -> str:
    return re.sub(r"\s+", "", s).lower()


def parse_num(s: str) -> float | None:
    c = re.sub(r"\s+", "", s).replace(",", ".", 1)
    if not re.fullmatch(r"[-+]?\d*\.?\d+(e[-+]?\d+)?", c, re.I):
        return None
    return float(c)


@dataclass
class Field:
    label: str
    type: str
    accept: list[str]
    tol: float | None = None
    options: list[str] | None = None
    placeholder: str | None = None
    unit: str | None = None
    reject: list[str] = field(default_factory=list)


def F(label: str, type: str, accept: Any, *, tol: float | None = None, options: list[str] | None = None,
      placeholder: str | None = None, unit: str | None = None, reject: list[str] | None = None) -> Field:
    acc = accept if isinstance(accept, list) else [accept]
    return Field(label, type, [str(a) for a in acc], tol, options, placeholder, unit, [str(r) for r in (reject or [])])


def check_field(f: Field, value: str) -> bool:
    """src/lib/task-answers.ts dagi checkField bilan bir xil qoida."""
    if value.strip() == "":
        return False
    if f.type == "number":
        got = parse_num(value)
        if got is None:
            return False
        tol = f.tol or 0
        return any((w := parse_num(a)) is not None and abs(got - w) <= tol + 1e-9 for a in f.accept)
    if f.type == "ip":
        return any(norm_ip(a) == norm_ip(value) for a in f.accept)
    return any(norm_text(a) == norm_text(value) for a in f.accept)


def validate_field(f: Field, where: str) -> None:
    _plain(f.label, where)
    if f.type not in {"text", "number", "ip", "choice"}:
        raise ContentError(f"{where}: maydon turi {f.type}")
    if not f.accept:
        raise ContentError(f"{where}: accept bo'sh")
    if f.type == "number" and any(parse_num(a) is None for a in f.accept):
        raise ContentError(f"{where}: son emas: {f.accept}")
    if f.type == "ip":
        for a in f.accept:
            if not re.fullmatch(r"\d{1,3}(\.\d{1,3}){3}(/\d{1,2})?", a):
                raise ContentError(f"{where}: IP emas: {a}")
    if f.type == "choice":
        if not f.options or any(a not in f.options for a in f.accept):
            raise ContentError(f"{where}: choice javobi variantlarda yo'q")
    for a in f.accept:
        if not check_field(f, a):
            raise ContentError(f"{where}: o'z javobidan o'tmadi: {a}")
    for r in f.reject:
        if check_field(f, r):
            raise ContentError(f"{where}: noto'g'ri javob qabul qilinib qoldi: {r}")


@dataclass
class Task:
    kind: str
    title: str
    description: str
    difficulty: str = "easy"
    hints: list[str] = field(default_factory=list)
    instruction_html: str | None = None
    # answer
    fields: list[Field] = field(default_factory=list)
    # report
    steps: list[str] = field(default_factory=list)
    prompt: str = ""
    min_images: int = 1
    max_images: int = 4
    min_chars: int = 80
    # code
    starter: str = ""
    solution: str = ""
    tests: list[tuple[str, str]] = field(default_factory=list)
    hidden_from: int = 2


def answer_task(title: str, description: str, fields: list[Field], *, hints: list[str] | None = None,
                difficulty: str = "easy", instruction_html: str | None = None) -> Task:
    return Task("answer", title, description, difficulty, hints or [], instruction_html, fields=fields)


def report_task(title: str, description: str, steps: list[str], prompt: str, *, min_images: int = 1,
                max_images: int = 4, min_chars: int = 80, hints: list[str] | None = None,
                difficulty: str = "medium", instruction_html: str | None = None) -> Task:
    return Task("report", title, description, difficulty, hints or [], instruction_html,
                steps=steps, prompt=prompt, min_images=min_images, max_images=max_images, min_chars=min_chars)


def code_task(title: str, description: str, starter: str, solution: str, tests: list[tuple[str, str | None]], *,
              hints: list[str] | None = None, difficulty: str = "medium", hidden_from: int = 2,
              instruction_html: str | None = None) -> Task:
    return Task("code", title, description, difficulty, hints or [], instruction_html,
                starter=starter, solution=solution, tests=tests, hidden_from=hidden_from)  # type: ignore[arg-type]


def run_python(code: str, stdin: str) -> str:
    r = subprocess.run([sys.executable, "-I", "-c", code], input=stdin, capture_output=True, text=True, timeout=10)
    if r.returncode != 0:
        raise ContentError(f"yechim xato berdi:\n{r.stderr}")
    return r.stdout


def validate_task(t: Task, where: str) -> None:
    _plain(t.title, where)
    _plain(t.description, where)
    for h in t.hints:
        _plain(h, where)
    if t.difficulty not in {"easy", "medium", "hard"}:
        raise ContentError(f"{where}: qiyinlik {t.difficulty}")
    if t.kind == "answer":
        if not t.fields:
            raise ContentError(f"{where}: maydon yo'q")
        for i, f in enumerate(t.fields):
            validate_field(f, f"{where} maydon {i + 1}")
    elif t.kind == "report":
        if len(t.steps) < 3:
            raise ContentError(f"{where}: qadamlar kam")
        for s in t.steps:
            _plain(s, where)
        _plain(t.prompt, where)
        if not 1 <= t.min_images <= t.max_images <= 6:
            raise ContentError(f"{where}: rasm chegaralari")
    elif t.kind == "code":
        # Pyodide 0.25 = Python 3.11: 3.12 f-string sintaksisini tutib qolamiz
        if re.search(r"f\"[^\"]*\{[^}]*\"[^\"]*\}", t.solution) or re.search(r"f'[^']*\{[^}]*'[^']*\}", t.solution):
            raise ContentError(f"{where}: f-string ichida bir xil qo'shtirnoq (3.12+)")
        fixed = []
        for inp, exp in t.tests:
            got = run_python(t.solution, inp).rstrip("\n")
            got = "\n".join(line.rstrip() for line in got.split("\n"))
            if exp is not None and got != exp:
                raise ContentError(f"{where}: kutilgan {exp!r}, yechim {got!r} (kirish {inp!r})")
            fixed.append((inp, got))
        t.tests = fixed
        if len(t.tests) < 3:
            raise ContentError(f"{where}: testlar kam")
    else:
        raise ContentError(f"{where}: tur {t.kind}")


# ----------------------------------------------------------------------
# MAVZU
# ----------------------------------------------------------------------
@dataclass
class Topic:
    slug: str
    title: str
    html: str
    slides: list[dict]
    quiz: list[Quiz]
    tasks: list[Task]
    minutes: int = 80
    coin: int = 10
    xp: int = 25


def T(slug: str, title: str, html: str, slides: list[dict], quiz: list[Quiz], tasks: list[Task], **kw: Any) -> Topic:
    return Topic(slug, title, html, slides, quiz, tasks, **kw)


# ----------------------------------------------------------------------
# SQL
# ----------------------------------------------------------------------
def dq(s: str, tag: str = "kt") -> str:
    t = f"${tag}$"
    if t in s:
        raise ContentError(f"matnda {t} uchradi")
    return f"{t}{s}{t}"


def jq(obj: Any) -> str:
    return dq(json.dumps(obj, ensure_ascii=False), "j") + "::jsonb"


def lit(s: str) -> str:
    return "'" + s.replace("'", "''") + "'"


def topic_sql(tp: Topic, order: int, free: bool) -> str:
    where = tp.slug
    if not re.fullmatch(r"kt-[mal]\d\d-[a-z0-9-]+", tp.slug):
        raise ContentError(f"{where}: slug")
    if len(tp.quiz) < 5:
        raise ContentError(f"{where}: test kam ({len(tp.quiz)})")
    if not tp.tasks:
        raise ContentError(f"{where}: topshiriq yo'q")
    if "<h2" not in tp.html:
        raise ContentError(f"{where}: matnda h2 yo'q")
    for i, q in enumerate(tp.quiz):
        validate_quiz(q, f"{where} test {i + 1}")
    for i, t in enumerate(tp.tasks):
        validate_task(t, f"{where} topshiriq {i + 1}")
    slides = finalize_slides(tp.slides, tp.slug, where)

    out: list[str] = []
    out.append(f"  -- {'=' * 60}\n  -- {order}. {tp.title}\n  -- {'=' * 60}")
    out.append(
        "  INSERT INTO topics (course_id, title, slug, content_html, slides, order_index, coin_reward, xp_reward,"
        " estimated_minutes, is_published, is_free_preview)\n"
        f"  VALUES (v_course, {dq(tp.title)}, {lit(tp.slug)},\n{dq(tp.html.strip())},\n  {jq(slides)},\n"
        f"  {order}, {tp.coin}, {tp.xp}, {tp.minutes}, true, {'true' if free else 'false'})\n"
        "  ON CONFLICT (course_id, slug) DO UPDATE SET\n"
        "    title = EXCLUDED.title, content_html = EXCLUDED.content_html, slides = EXCLUDED.slides,\n"
        "    order_index = EXCLUDED.order_index, estimated_minutes = EXCLUDED.estimated_minutes,\n"
        "    coin_reward = EXCLUDED.coin_reward, xp_reward = EXCLUDED.xp_reward,\n"
        "    is_published = true, is_free_preview = EXCLUDED.is_free_preview\n"
        "  RETURNING id INTO t;"
    )

    qids = [det_uuid(tp.slug, "quiz", i) for i in range(len(tp.quiz))]
    out.append(f"  DELETE FROM quizzes WHERE topic_id = t AND id NOT IN ({', '.join(lit(x) for x in qids)});")
    rows = []
    for i, q in enumerate(tp.quiz):
        rows.append(
            f"  ({lit(qids[i])}, t, {dq(q.question)}, '{'multiple' if q.multiple else 'single'}',\n"
            f"   {jq(quiz_json(q, tp.slug))},\n   {dq(q.explain)}, {q.points}, {i})"
        )
    out.append(
        "  INSERT INTO quizzes (id, topic_id, question, question_type, options, explanation, points, order_index) VALUES\n"
        + ",\n".join(rows)
        + "\n  ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, question = EXCLUDED.question,\n"
        "    question_type = EXCLUDED.question_type, options = EXCLUDED.options,\n"
        "    explanation = EXCLUDED.explanation, points = EXCLUDED.points, order_index = EXCLUDED.order_index;"
    )

    tids = [det_uuid(tp.slug, "task", i) for i in range(len(tp.tasks))]
    out.append(f"  DELETE FROM topic_tasks WHERE topic_id = t AND id NOT IN ({', '.join(lit(x) for x in tids)});")
    trows = []
    for i, tk in enumerate(tp.tasks):
        hints = [{"order": j + 1, "text": h} for j, h in enumerate(tk.hints)]
        if tk.kind == "code":
            tests = [{"input": a, "expected_output": b, "is_hidden": j >= tk.hidden_from} for j, (a, b) in enumerate(tk.tests)]
            lang, starter, sol = "python", tk.starter, tk.solution
            answer_spec, report_spec = None, None
        elif tk.kind == "answer":
            tests, lang, starter, sol = [], "text", "", None
            answer_spec = {"fields": [
                {k: v for k, v in {
                    "label": f.label, "type": f.type, "accept": f.accept, "tol": f.tol,
                    "options": f.options, "placeholder": f.placeholder, "unit": f.unit,
                }.items() if v is not None}
                for f in tk.fields
            ]}
            report_spec = None
        else:
            tests, lang, starter, sol = [], "text", "", None
            answer_spec = None
            report_spec = {"steps": tk.steps, "prompt": tk.prompt, "min_images": tk.min_images,
                           "max_images": tk.max_images, "min_chars": tk.min_chars}
        trows.append(
            f"  ({lit(tids[i])}, t, {dq(tk.title)}, {dq(tk.description)},\n"
            f"   {dq(tk.instruction_html) if tk.instruction_html else 'NULL'},\n"
            f"   {dq(starter)}, {dq(sol) if sol is not None else 'NULL'}, {lit(lang)},\n"
            f"   {jq(tests)}, {jq(hints) if hints else 'NULL'}, {lit(tk.difficulty)}, 5, 15, {i},\n"
            f"   {lit(tk.kind)}, {jq(answer_spec) if answer_spec else 'NULL'}, {jq(report_spec) if report_spec else 'NULL'})"
        )
    out.append(
        "  INSERT INTO topic_tasks (id, topic_id, title, description, instruction_html, starter_code, solution_code,"
        " language, test_cases, hints, difficulty, coin_reward, xp_reward, order_index, task_kind, answer_spec,"
        " report_spec) VALUES\n"
        + ",\n".join(trows)
        + "\n  ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, title = EXCLUDED.title,\n"
        "    description = EXCLUDED.description, instruction_html = EXCLUDED.instruction_html,\n"
        "    starter_code = EXCLUDED.starter_code, solution_code = EXCLUDED.solution_code,\n"
        "    language = EXCLUDED.language, test_cases = EXCLUDED.test_cases, hints = EXCLUDED.hints,\n"
        "    difficulty = EXCLUDED.difficulty, order_index = EXCLUDED.order_index, task_kind = EXCLUDED.task_kind,\n"
        "    answer_spec = EXCLUDED.answer_spec, report_spec = EXCLUDED.report_spec;"
    )
    return "\n\n".join(out)


def migration(course_slug: str, header: str, topics: list[tuple[int, Topic]]) -> str:
    body = "\n\n".join(topic_sql(tp, order, order == 1) for order, tp in topics)
    return (
        f"{header.strip()}\n\n"
        "DO $mig$\nDECLARE\n  v_course UUID;\n  t UUID;\nBEGIN\n"
        f"  SELECT id INTO v_course FROM courses WHERE slug = {lit(course_slug)};\n"
        "  IF v_course IS NULL THEN\n"
        f"    RAISE EXCEPTION 'Kurs topilmadi: {course_slug}. Avval 78_kompyuter_tarmoqlari_infra.sql ni ishga tushiring.';\n"
        "  END IF;\n\n"
        f"{body}\n\nEND $mig$;\n"
    )


# ----------------------------------------------------------------------
# Tarmoq hisob-kitob yordamchilari (javoblarni qo'lda yozmaslik uchun)
# ----------------------------------------------------------------------
import ipaddress as _ip  # noqa: E402


def net_of(ip_cidr: str) -> _ip.IPv4Network:
    return _ip.ip_interface(ip_cidr).network


def hosts_count(prefix: int) -> int:
    return 2 ** (32 - prefix) - 2 if prefix <= 30 else (2 if prefix == 31 else 1)


def mask_of(prefix: int) -> str:
    return str(_ip.IPv4Network(f"0.0.0.0/{prefix}").netmask)


def first_host(n: _ip.IPv4Network) -> str:
    return str(n.network_address + 1)


def last_host(n: _ip.IPv4Network) -> str:
    return str(n.broadcast_address - 1)


def to_bin(ip: str) -> str:
    return ".".join(f"{int(o):08b}" for o in ip.split("."))
