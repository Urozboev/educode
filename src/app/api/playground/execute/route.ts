import { NextRequest, NextResponse } from "next/server";
import { runCode } from "@/lib/execute";

/**
 * Playground code execution API.
 *
 * Ijro mantig'i `@/lib/execute` ga ko'chirildi — agentning kod
 * topshiriqlari ham o'sha ijrochidan foydalanadi. Bu route endi
 * faqat HTTP qatlami.
 */

export async function POST(req: NextRequest) {
  try {
    const { language, code, stdin } = (await req.json()) as {
      language: string;
      code: string;
      stdin?: string;
    };

    if (!language || typeof code !== "string") {
      return NextResponse.json(
        { error: "language va code majburiy" },
        { status: 400 }
      );
    }

    const result = await runCode(language, code, typeof stdin === "string" ? stdin : "");

    // Ikkala provayder ham ishlamasa — 502, ilgarigidek
    if (result.provider === "none") {
      return NextResponse.json(result, { status: 502 });
    }

    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "unknown error" },
      { status: 500 }
    );
  }
}
