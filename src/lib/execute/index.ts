/**
 * EduCode — kod ijrosi (Judge0, Piston fallback bilan).
 *
 * Ilgari bu mantiq `/api/playground/execute` route ichida yozilgan
 * edi. Agent ham kod topshiriqlarini tekshirishi kerak bo'lgani
 * uchun shu yerga ko'chirildi: ikkita joyda ikki xil ijro mantig'i
 * bo'lsa, ular vaqt o'tib bir-biridan farq qila boshlaydi
 * (til versiyalari, timeout, xato formati).
 *
 * ENV:
 *   JUDGE0_RAPIDAPI_KEY — RapidAPI key
 *   JUDGE0_HOST         — default "judge0-ce.p.rapidapi.com"
 */

const JUDGE0_HOST = process.env.JUDGE0_HOST || "judge0-ce.p.rapidapi.com";
const JUDGE0_KEY =
  process.env.JUDGE0_RAPIDAPI_KEY ||
  "cf111325bfmsh670b85640838d3ap1d0acdjsnab7e9738ec84";

/** Judge0 CE language_id xaritasi (eng barqaror versiyalar) */
export const JUDGE0_LANG: Record<string, number> = {
  python: 71,       // Python 3.8.1
  javascript: 63,   // Node.js 12.14.0
  typescript: 74,   // TypeScript 3.7.4
  "c++": 54,        // C++ (GCC 9.2.0)
  cpp: 54,
  java: 62,         // Java (OpenJDK 13.0.1)
  csharp: 51,       // C# (Mono 6.6.0.161)
};

const PISTON_LANG: Record<string, { language: string; version: string }> = {
  python: { language: "python", version: "3.10.0" },
  javascript: { language: "javascript", version: "18.15.0" },
  typescript: { language: "typescript", version: "5.0.3" },
  "c++": { language: "c++", version: "10.2.0" },
  cpp: { language: "c++", version: "10.2.0" },
  java: { language: "java", version: "15.0.2" },
  csharp: { language: "csharp.net", version: "6.12.0" },
};

export const SUPPORTED_LANGUAGES = Object.keys(JUDGE0_LANG);

export type ExecStatus = "ok" | "error" | "timeout";

export interface ExecResult {
  stdout: string;
  stderr: string;
  status: ExecStatus;
  provider: "judge0" | "piston" | "none";
  time?: string;
  memory?: number;
  warning?: string;
}

function b64encode(s: string) {
  return Buffer.from(s, "utf-8").toString("base64");
}

function b64decode(s: string | null | undefined) {
  if (!s) return "";
  try {
    return Buffer.from(s, "base64").toString("utf-8");
  } catch {
    return "";
  }
}

async function runOnJudge0(language: string, code: string, stdin: string): Promise<ExecResult> {
  const language_id = JUDGE0_LANG[language];
  if (!language_id) throw new Error("judge0: unsupported language");
  if (!JUDGE0_KEY) throw new Error("judge0: missing api key");

  const body = JSON.stringify({
    source_code: b64encode(code),
    stdin: b64encode(stdin || ""),
    language_id,
  });

  // wait=true — sinxron javob olish (8s gacha Judge0 ushlab turadi)
  const url = `https://${JUDGE0_HOST}/submissions?base64_encoded=true&wait=true&fields=stdout,stderr,compile_output,message,status,time,memory`;
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 15000);

  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-rapidapi-key": JUDGE0_KEY,
        "x-rapidapi-host": JUDGE0_HOST,
      },
      body,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(t);
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`judge0 http ${res.status}: ${text.slice(0, 200)}`);
  }

  const data = await res.json();
  const stdout = b64decode(data.stdout);
  const stderr =
    b64decode(data.stderr) || b64decode(data.compile_output) || b64decode(data.message);
  const statusId = data.status?.id ?? 3;
  // Judge0 status ID: 3 = Accepted. Boshqalari — xato/limit
  const ok = statusId === 3 && !stderr;

  return {
    stdout,
    stderr,
    status: ok ? "ok" : statusId === 5 ? "timeout" : "error",
    provider: "judge0",
    time: data.time,
    memory: data.memory,
  };
}

async function runOnPiston(language: string, code: string, stdin: string): Promise<ExecResult> {
  const cfg = PISTON_LANG[language];
  if (!cfg) throw new Error("piston: unsupported language");

  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 15000);

  let res: Response;
  try {
    res = await fetch("https://emkc.org/api/v2/piston/execute", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        language: cfg.language,
        version: cfg.version,
        files: [{ content: code }],
        stdin,
      }),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(t);
  }

  if (!res.ok) throw new Error(`piston http ${res.status}`);

  const data = await res.json();
  const stdout = data.run?.stdout || "";
  const stderr = data.run?.stderr || data.compile?.stderr || "";
  const ok = !stderr && data.run?.code === 0;

  return { stdout, stderr, status: ok ? "ok" : "error", provider: "piston" };
}

/**
 * Kodni ishga tushiradi. Avval Judge0, u ishlamasa Piston.
 *
 * Hech qachon exception tashlamaydi: ikkala provayder ham
 * ishlamasa `provider: "none"` va xato matni qaytadi. Chaqiruvchi
 * kod uchun bu qulayroq — topshiriq tekshiruvi o'rtada uzilib
 * qolmaydi, "test o'tmadi" deb hisoblanadi.
 */
export async function runCode(
  language: string,
  code: string,
  stdin = "",
): Promise<ExecResult> {
  const lang = language.toLowerCase();

  try {
    return await runOnJudge0(lang, code, stdin);
  } catch (e: any) {
    try {
      const r = await runOnPiston(lang, code, stdin);
      return {
        ...r,
        warning: `judge0 unavailable (${e?.message || "unknown"}), used piston fallback`,
      };
    } catch (e2: any) {
      return {
        stdout: "",
        stderr: `Ikkala serverda ham xato:\nJudge0: ${e?.message}\nPiston: ${e2?.message}`,
        status: "error",
        provider: "none",
      };
    }
  }
}

/** Chiqishni solishtirishdan oldin normallashtirish */
export function normalizeOutput(s: string): string {
  return String(s ?? "")
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n")
    .trim();
}
