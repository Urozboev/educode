/**
 * Vizual tajribalar uchun Python semantikasining kichik nusxasi.
 *
 * Maqsad — o'quvchi ekranda ko'rgan natija haqiqiy Python bergani bilan
 * AYNAN bir xil bo'lishi. Shuning uchun `//` va `%` manfiy sonlarda
 * pastga yaxlitlaydi, butun sonlar BigInt bilan hisoblanadi (2 ** 100
 * ham to'g'ri chiqadi), float esa Python kabi `.0` bilan yoziladi.
 */

export type PyValue =
  | { type: "int"; v: bigint }
  | { type: "float"; v: number }
  | { type: "str"; v: string }
  | { type: "bool"; v: boolean };

export type PyResult = { ok: true; value: PyValue } | { ok: false; error: string };

// ---------------------------------------------------------------
// Ko'rsatish (repr)
// ---------------------------------------------------------------

export function floatRepr(x: number): string {
  if (Number.isNaN(x)) return "nan";
  if (!Number.isFinite(x)) return x > 0 ? "inf" : "-inf";
  if (Object.is(x, -0)) return "-0.0";
  const abs = Math.abs(x);
  if (abs !== 0 && (abs >= 1e16 || abs < 1e-4)) {
    // Python: 1e+16, 1e-05
    const [m, e] = x.toExponential().split("e");
    const exp = Number(e);
    const sign = exp < 0 ? "-" : "+";
    const digits = String(Math.abs(exp)).padStart(2, "0");
    return `${m}e${sign}${digits}`;
  }
  const s = String(x);
  return s.includes(".") ? s : `${s}.0`;
}

export function repr(val: PyValue): string {
  switch (val.type) {
    case "int": return val.v.toString();
    case "float": return floatRepr(val.v);
    case "bool": return val.v ? "True" : "False";
    case "str": return strRepr(val.v);
  }
}

/**
 * Python `repr(str)`: odatda bittalik tirnoq, lekin matnda `'` bo'lsa-yu
 * `"` bo'lmasa — qo'shtirnoq (`"it's"`).
 */
export function strRepr(s: string): string {
  const esc = s.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/\t/g, "\\t");
  if (s.includes("'") && !s.includes('"')) return `"${esc}"`;
  return `'${esc.replace(/'/g, "\\'")}'`;
}

// ---------------------------------------------------------------
// Arifmetika
// ---------------------------------------------------------------

export type ArithOp = "+" | "-" | "*" | "/" | "//" | "%" | "**";

function floorDivBig(a: bigint, b: bigint): bigint {
  const q = a / b; // nolga qarab kesadi
  return (a % b !== 0n) && ((a < 0n) !== (b < 0n)) ? q - 1n : q;
}

function modBig(a: bigint, b: bigint): bigint {
  const r = a % b;
  return r !== 0n && ((r < 0n) !== (b < 0n)) ? r + b : r;
}

/** Sonli qiymatni o'qish: "7" → int, "7.0" yoki "3.5" → float. */
export function parseNumber(text: string): PyValue | null {
  const s = text.trim();
  if (/^-?\d+$/.test(s)) return { type: "int", v: BigInt(s) };
  if (/^-?(\d+\.\d*|\.\d+)$/.test(s)) return { type: "float", v: Number(s) };
  return null;
}

export function arith(a: PyValue, op: ArithOp, b: PyValue): PyResult {
  const bothInt = a.type === "int" && b.type === "int";
  const an = a.type === "int" ? Number(a.v) : Number(a.v);
  const bn = b.type === "int" ? Number(b.v) : Number(b.v);

  const zero = bothInt ? (b as { v: bigint }).v === 0n : bn === 0;
  if ((op === "/" || op === "//" || op === "%") && zero) {
    const msg = op === "/" ? "division by zero"
      : op === "//" ? (bothInt ? "integer division or modulo by zero" : "float floor division by zero")
      : (bothInt ? "integer modulo by zero" : "float modulo");
    return { ok: false, error: `ZeroDivisionError: ${msg}` };
  }

  if (bothInt) {
    const x = (a as { v: bigint }).v;
    const y = (b as { v: bigint }).v;
    switch (op) {
      case "+": return { ok: true, value: { type: "int", v: x + y } };
      case "-": return { ok: true, value: { type: "int", v: x - y } };
      case "*": return { ok: true, value: { type: "int", v: x * y } };
      case "/": return { ok: true, value: { type: "float", v: Number(x) / Number(y) } };
      case "//": return { ok: true, value: { type: "int", v: floorDivBig(x, y) } };
      case "%": return { ok: true, value: { type: "int", v: modBig(x, y) } };
      case "**":
        if (y < 0n) {
          if (x === 0n) return { ok: false, error: "ZeroDivisionError: zero to a negative power" };
          return { ok: true, value: { type: "float", v: Math.pow(Number(x), Number(y)) } };
        }
        // Python buni ham hisoblaydi, lekin ekranga sig'maydigan son chiqadi
        if (y > 2000n) return { ok: false, error: TOO_BIG };
        return { ok: true, value: { type: "int", v: x ** y } };
    }
  }

  switch (op) {
    case "+": return { ok: true, value: { type: "float", v: an + bn } };
    case "-": return { ok: true, value: { type: "float", v: an - bn } };
    case "*": return { ok: true, value: { type: "float", v: an * bn } };
    case "/": return { ok: true, value: { type: "float", v: an / bn } };
    case "//": return { ok: true, value: { type: "float", v: floatDivmod(an, bn)[0] } };
    case "%": return { ok: true, value: { type: "float", v: floatDivmod(an, bn)[1] } };
    case "**": {
      if (an === 0 && bn < 0) return { ok: false, error: "ZeroDivisionError: zero to a negative power" };
      // Manfiy son kasr darajaga — Python kompleks son qaytaradi
      if (an < 0 && !Number.isInteger(bn)) return { ok: false, error: COMPLEX };
      // Kvadrat ildiz: Math.sqrt aniq yaxlitlanadi, Math.pow esa oxirgi
      // raqamda Python'dan farq qilishi mumkin
      if (bn === 0.5) return { ok: true, value: { type: "float", v: Math.sqrt(an) } };
      return { ok: true, value: { type: "float", v: Math.pow(an, bn) } };
    }
  }
}

/** UI tarjima qiladigan maxsus natijalar (Python xatosi emas). */
export const COMPLEX = "__complex__";
export const TOO_BIG = "__too_big__";

const copysign = (x: number, y: number) =>
  (y < 0 || Object.is(y, -0)) ? -Math.abs(x) : Math.abs(x);

/**
 * CPython `float_divmod` ning aynan nusxasi. Oddiy `Math.floor(a / b)`
 * 0.1 kabi aniq ifodalanmaydigan sonlarda boshqa natija berardi:
 * Python'da `2 // 0.1 == 19.0` va `2 % 0.1 == 0.0999...`.
 */
function floatDivmod(vx: number, wx: number): [number, number] {
  let mod = vx % wx; // JS `%` — C'dagi fmod bilan bir xil
  let div = (vx - mod) / wx;
  if (mod) {
    if ((wx < 0) !== (mod < 0)) {
      mod += wx;
      div -= 1.0;
    }
  } else {
    mod = copysign(0.0, wx);
  }
  let floordiv: number;
  if (div) {
    floordiv = Math.floor(div);
    if (div - floordiv > 0.5) floordiv += 1.0;
  } else {
    floordiv = copysign(0.0, vx / wx);
  }
  return [floordiv, mod];
}

// ---------------------------------------------------------------
// Turlarni aylantirish
// ---------------------------------------------------------------

/** Python literalini o'qish: 42, 3.5, "matn", 'matn', True, False. */
export function parseLiteral(text: string): PyValue | null {
  const s = text.trim();
  const num = parseNumber(s);
  if (num) return num;
  if (s === "True") return { type: "bool", v: true };
  if (s === "False") return { type: "bool", v: false };
  const m = s.match(/^(["'])(.*)\1$/s);
  if (m) return { type: "str", v: m[2] };
  return null;
}

export type Converter = "int" | "float" | "str" | "bool";

export function convert(fn: Converter, val: PyValue): PyResult {
  switch (fn) {
    case "int": {
      if (val.type === "int") return { ok: true, value: val };
      if (val.type === "bool") return { ok: true, value: { type: "int", v: val.v ? 1n : 0n } };
      if (val.type === "float") {
        if (!Number.isFinite(val.v)) return { ok: false, error: "OverflowError: cannot convert float infinity to integer" };
        return { ok: true, value: { type: "int", v: BigInt(Math.trunc(val.v)) } };
      }
      const s = val.v.trim().replace(/_/g, "");
      if (/^[+-]?\d+$/.test(s)) return { ok: true, value: { type: "int", v: BigInt(s) } };
      return { ok: false, error: `ValueError: invalid literal for int() with base 10: ${repr(val)}` };
    }
    case "float": {
      if (val.type === "float") return { ok: true, value: val };
      if (val.type === "int") return { ok: true, value: { type: "float", v: Number(val.v) } };
      if (val.type === "bool") return { ok: true, value: { type: "float", v: val.v ? 1 : 0 } };
      const s = val.v.trim().toLowerCase();
      if (/^[+-]?(\d+\.?\d*|\.\d+)(e[+-]?\d+)?$/.test(s)) return { ok: true, value: { type: "float", v: Number(s) } };
      if (/^[+-]?(inf|infinity)$/.test(s)) return { ok: true, value: { type: "float", v: s.startsWith("-") ? -Infinity : Infinity } };
      return { ok: false, error: `ValueError: could not convert string to float: ${repr(val)}` };
    }
    case "str":
      if (val.type === "str") return { ok: true, value: val };
      return { ok: true, value: { type: "str", v: repr(val) } };
    case "bool": {
      const falsy =
        (val.type === "int" && val.v === 0n) ||
        (val.type === "float" && val.v === 0) ||
        (val.type === "str" && val.v === "") ||
        (val.type === "bool" && !val.v);
      return { ok: true, value: { type: "bool", v: !falsy } };
    }
  }
}

// ---------------------------------------------------------------
// Matnlar
// ---------------------------------------------------------------

/** CPython'dagi PySlice_AdjustIndices bilan bir xil: tanlangan indekslar. */
export function sliceIndices(
  len: number,
  start: number | null,
  stop: number | null,
  step: number | null,
): number[] | { error: string } {
  const st = step ?? 1;
  if (st === 0) return { error: "ValueError: slice step cannot be zero" };

  const adjust = (v: number | null, dflt: number) => {
    if (v === null) return dflt;
    if (v < 0) {
      v += len;
      if (v < 0) v = st < 0 ? -1 : 0;
    } else if (v >= len) {
      v = st < 0 ? len - 1 : len;
    }
    return v;
  };

  const a = adjust(start, st < 0 ? len - 1 : 0);
  const b = adjust(stop, st < 0 ? -1 : len);
  const out: number[] = [];
  if (st > 0) for (let i = a; i < b; i += st) out.push(i);
  else for (let i = a; i > b; i += st) out.push(i);
  return out;
}

const isCased = (ch: string) => ch.toLowerCase() !== ch.toUpperCase();

export function pyTitle(s: string): string {
  let out = "";
  let prevCased = false;
  for (const ch of s) {
    if (isCased(ch)) {
      out += prevCased ? ch.toLowerCase() : ch.toUpperCase();
      prevCased = true;
    } else {
      out += ch;
      prevCased = false;
    }
  }
  return out;
}

export function pyCapitalize(s: string): string {
  if (!s) return s;
  const [first, ...rest] = [...s];
  return first.toUpperCase() + rest.join("").toLowerCase();
}

/** Python `str.strip()` — faqat bo'shliq belgilarini oladi. */
export function pyStrip(s: string): string {
  return s.replace(/^\s+|\s+$/g, "");
}

/** Python `str.count(sub)` — ustma-ust tushmaydigan uchrashuvlar. */
export function pyCount(s: string, sub: string): number {
  if (sub === "") return [...s].length + 1;
  let n = 0;
  let i = 0;
  while ((i = s.indexOf(sub, i)) !== -1) { n++; i += sub.length; }
  return n;
}
