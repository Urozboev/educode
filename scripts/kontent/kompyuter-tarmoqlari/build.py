"""
Kompyuter tarmoqlari kursi: barcha kontentni tekshiradi va 79–87
migratsiyalarni yozadi.

    py scripts/kontent/kompyuter-tarmoqlari/build.py          # tekshirish + yozish
    py scripts/kontent/kompyuter-tarmoqlari/build.py --check  # faqat tekshirish

Tekshiruvdan o'tmagan birorta mavzu bo'lsa, hech qaysi fayl yozilmaydi.
"""

from __future__ import annotations

import importlib
import pathlib
import sys

HERE = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))

from kt import ContentError, migration  # noqa: E402

ROOT = HERE.parents[2]
MIG = ROOT / "supabase" / "migrations"

# (fayl nomi, kurs slug'i, modul, birinchi mavzu tartib raqami, sarlavha)
PLAN = [
    ("79_kt_maruza_1_5.sql", "kompyuter-tarmoqlari-maruza", "m01_05", 1, "Ma'ruzalar 1–5"),
    ("80_kt_maruza_6_10.sql", "kompyuter-tarmoqlari-maruza", "m06_10", 6, "Ma'ruzalar 6–10"),
    ("81_kt_maruza_11_15.sql", "kompyuter-tarmoqlari-maruza", "m11_15", 11, "Ma'ruzalar 11–15"),
    ("82_kt_amaliyot_1_5.sql", "kompyuter-tarmoqlari-amaliyot", "a01_05", 1, "Amaliy mashg'ulotlar 1–5"),
    ("83_kt_amaliyot_6_10.sql", "kompyuter-tarmoqlari-amaliyot", "a06_10", 6, "Amaliy mashg'ulotlar 6–10"),
    ("84_kt_amaliyot_11_15.sql", "kompyuter-tarmoqlari-amaliyot", "a11_15", 11, "Amaliy mashg'ulotlar 11–15"),
    ("85_kt_laboratoriya_1_5.sql", "kompyuter-tarmoqlari-laboratoriya", "l01_05", 1, "Laboratoriya ishlari 1–5"),
    ("86_kt_laboratoriya_6_10.sql", "kompyuter-tarmoqlari-laboratoriya", "l06_10", 6, "Laboratoriya ishlari 6–10"),
    ("87_kt_laboratoriya_11_14.sql", "kompyuter-tarmoqlari-laboratoriya", "l11_14", 11, "Laboratoriya ishlari 11–14"),
]

HEADER = """-- ============================================================
-- MirAcademy — "Kompyuter tarmoqlari" fani: {title}
--
-- AVTOMATIK YARATILGAN — qo'lda tahrirlamang.
-- Manba: scripts/kontent/kompyuter-tarmoqlari/{module}.py
-- Qayta yaratish: py scripts/kontent/kompyuter-tarmoqlari/build.py
--
-- Har mavzuda: dars matni, taqdimot (slides), test va topshiriqlar.
-- Virtual simulyatsiya kodda: src/components/labs/net/registry.tsx
--
-- Avval 78_kompyuter_tarmoqlari_infra.sql ishga tushirilgan bo'lishi
-- kerak. Qayta ishga tushirish xavfsiz: test va topshiriq ID lari
-- doimiy, yozuvlar yangilanadi, talabalar javoblari saqlanadi.
-- ============================================================"""


def main() -> int:
    check_only = "--check" in sys.argv
    only = [a for a in sys.argv[1:] if not a.startswith("--")]
    outputs: list[tuple[pathlib.Path, str]] = []
    seen_slugs: set[str] = set()
    errors = 0
    total = {"topics": 0, "quiz": 0, "tasks": 0, "slides": 0}

    for fname, course, module, start, title in PLAN:
        if only and module not in only:
            continue
        try:
            mod = importlib.import_module(module)
        except ModuleNotFoundError:
            print(f"  -- {module}: hali yozilmagan, o'tkazib yuborildi")
            continue
        topics = list(mod.TOPICS)
        for tp in topics:
            if tp.slug in seen_slugs:
                print(f"XATO: takroriy slug {tp.slug}")
                errors += 1
            seen_slugs.add(tp.slug)
        try:
            sql = migration(course, HEADER.format(title=title, module=module), list(enumerate(topics, start)))
        except ContentError as e:
            print(f"XATO [{module}]: {e}")
            errors += 1
            continue
        for tp in topics:
            total["topics"] += 1
            total["quiz"] += len(tp.quiz)
            total["tasks"] += len(tp.tasks)
            total["slides"] += len(tp.slides)
        outputs.append((MIG / fname, sql))
        print(f"  ok  {fname}: {len(topics)} mavzu, {len(sql) // 1024} KB")

    print(f"\nJami: {total}")
    if errors:
        print(f"\n{errors} ta xato — fayllar YOZILMADI.")
        return 1
    if check_only:
        print("Faqat tekshiruv (--check): fayllar yozilmadi.")
        return 0
    for path, sql in outputs:
        path.write_text(sql, encoding="utf-8", newline="\n")
    print(f"{len(outputs)} ta migratsiya yozildi.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
