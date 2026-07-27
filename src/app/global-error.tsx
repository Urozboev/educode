"use client";

/**
 * Ildiz layout ishdan chiqqanda ishlaydi — bu holda globals.css ham,
 * shrift o'zgaruvchilari ham kafolatlanmaydi. Shuning uchun sahifa
 * to'liq inline uslublar bilan, hech narsaga bog'lanmagan holda yozilgan.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="uz">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          background: "#f9f9fc",
          color: "#111325",
          fontFamily:
            "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
        }}
      >
        <div style={{ width: "100%", maxWidth: "640px" }}>
          <div
            style={{
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 28px 70px -20px rgba(10,12,24,0.45)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 16px",
                background: "#161b22",
              }}
            >
              <span style={dot("#ff5f57")} />
              <span style={dot("#febc2e")} />
              <span style={dot("#28c840")} />
              <span
                style={{
                  marginLeft: "12px",
                  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                  fontSize: "12px",
                  color: "#7d8590",
                }}
              >
                educode — bash
              </span>
              <span
                style={{
                  marginLeft: "auto",
                  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#f0655c",
                }}
              >
                exit 500
              </span>
            </div>
            <div
              style={{
                background: "#0d1117",
                padding: "20px 24px",
                fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                fontSize: "13px",
                lineHeight: 1.9,
              }}
            >
              <p style={{ margin: 0, color: "#c9d1d9" }}>
                <span style={{ color: "#f0655c" }}>$</span>{" "}
                <span style={{ color: "#79c0ff" }}>educode boot</span>
              </p>
              <p style={{ margin: 0, color: "#7d8590" }}>
                → ilova ishga tushirilmoqda
              </p>
              <p
                style={{
                  margin: "8px 0 0",
                  color: "#f0655c",
                  fontWeight: 600,
                }}
              >
                ✖ 500 — APPLICATION_ERROR
              </p>
              {error.digest && (
                <p
                  style={{
                    margin: 0,
                    paddingLeft: "16px",
                    color: "#484f58",
                    wordBreak: "break-all",
                  }}
                >
                  digest: {error.digest}
                </p>
              )}
            </div>
          </div>

          <div style={{ marginTop: "32px", textAlign: "center" }}>
            <h1
              style={{
                margin: 0,
                fontSize: "30px",
                fontWeight: 800,
                letterSpacing: "-0.02em",
              }}
            >
              Ilova ishga tushmadi
            </h1>
            <p
              style={{
                margin: "12px auto 0",
                maxWidth: "440px",
                color: "#5b6076",
                lineHeight: 1.65,
              }}
            >
              Sahifani qayta yuklang. Muammo takrorlansa, bizga xabar bering.
            </p>
            <button
              type="button"
              onClick={reset}
              style={{
                marginTop: "28px",
                padding: "12px 28px",
                border: "none",
                borderRadius: "999px",
                background: "linear-gradient(135deg, #4A34D8 0%, #1189D6 100%)",
                color: "#fff",
                fontSize: "15px",
                fontWeight: 600,
                fontFamily: "inherit",
                cursor: "pointer",
              }}
            >
              Qayta yuklash
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}

const dot = (color: string): React.CSSProperties => ({
  width: "12px",
  height: "12px",
  borderRadius: "999px",
  background: color,
  display: "inline-block",
});
