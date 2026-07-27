"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils";
import type { Certificate } from "@/types";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ArrowLeft, Download, Printer, Loader2, Pencil, Check, FileText } from "lucide-react";

/**
 * Sertifikat qat'iy o'lchamda chiziladi.
 * Ichidagi hamma narsa (padding, shrift, medal) px'da berilgani uchun
 * konteyner kichrayganda kontent sig'may qolib, `overflow:hidden` uni kesib
 * tashlaydi. Shuning uchun blok doim CERT_W×CERT_H bo'lib qoladi va ekranga
 * faqat CSS `scale` bilan moslashtiriladi — capture esa har doim to'liq
 * o'lchamda, ekran kengligidan qat'i nazar bir xil natija beradi.
 * Nisbat 1.414:1 — aynan A4 landshaft.
 */
const CERT_W = 900;
const CERT_H = Math.round(CERT_W / 1.414);

export default function CertificatePage() {
  const { id } = useParams<{ id: string }>();
  const supabase = createClient();
  const [cert, setCert] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  // Sertifikatda ko'rinadigan ism — Gmail'dan kelgan ism boshqacha bo'lishi mumkin,
  // shuning uchun foydalanuvchi tahrirlashi mumkin
  const [name, setName] = useState("");
  const [savingName, setSavingName] = useState(false);
  const certRef = useRef<HTMLDivElement>(null);
  // Ekranga sig'dirish koeffitsienti (capture'ga ta'sir qilmaydi)
  const shellRef = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState(1);

  useEffect(() => {
    const el = shellRef.current;
    if (!el) return;
    const update = () => setFit(Math.min(1, el.clientWidth / CERT_W));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [loading]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("certificates").select("*").eq("id", id).single();
      if (data) {
        setCert(data as Certificate);
        setName((data as Certificate).full_name || "");
      }
      setLoading(false);
    })();
  }, [id]);

  // Ismni hisobga saqlash (keyingi tashrifda ham ko'rinishi uchun) — RLS ruxsat bermasa xatolikni yutamiz
  async function saveName() {
    const trimmed = name.trim();
    if (!cert || !trimmed || trimmed === cert.full_name) return;
    setSavingName(true);
    const { error } = await supabase
      .from("certificates")
      .update({ full_name: trimmed })
      .eq("id", cert.id);
    if (!error) {
      setCert({ ...cert, full_name: trimmed });
      toast.success("Ism saqlandi");
    } else {
      // DB'ga yozib bo'lmasa ham, yuklab olinadigan PNG'da to'g'ri ism ko'rinadi
      toast.message("Ism shu tashrif uchun qo'llanildi");
    }
    setSavingName(false);
  }

  /** A4 landshaft 300 dpi uchun kerakli kenglik (297mm × 300/25.4) */
  const TARGET_PX = 3508;

  // Sertifikatni yuqori sifatli canvas'ga aylantirish (PNG va PDF uchun umumiy)
  async function captureCanvas(): Promise<HTMLCanvasElement> {
    const node = certRef.current!;
    const html2canvas = (await import("html2canvas")).default;

    // Shriftlar yuklanmasdan capture qilinsa, matn zaxira shrift bilan
    // o'lchanadi va qatorlar boshqa joyga tushadi
    if (document.fonts?.ready) await document.fonts.ready;

    // Ekrandagi `scale` capture'ga ta'sir qilmasligi uchun qat'iy o'lcham
    const w = CERT_W;
    const h = CERT_H;

    // Natija har doim A4 300 dpi ga yetadi (ekran kengligiga bog'liq emas)
    const scale = Math.min(6, Math.max(2, TARGET_PX / w));

    return html2canvas(node, {
      scale,
      backgroundColor: "#fffdf7",
      useCORS: true,
      logging: false,
      width: w,
      height: h,
      windowWidth: w,
      windowHeight: h,
      onclone: (_doc, clone) => {
        clone.style.width = `${w}px`;
        clone.style.height = `${h}px`;
        // Ota-elementlardagi sig'dirish transformini bekor qilamiz, aks holda
        // html2canvas kichraytirilgan holatda rasmga oladi
        let p = clone.parentElement;
        while (p) {
          p.style.transform = "none";
          p.style.height = "auto";
          p = p.parentElement;
        }
      },
    });
  }

  async function handleDownload() {
    if (!certRef.current) return;
    setDownloading(true);
    try {
      const canvas = await captureCanvas();
      const link = document.createElement("a");
      link.download = `EduCode-Sertifikat-${cert?.certificate_number || "cert"}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast.success("PNG yuklab olindi!");
    } catch (err) {
      console.error("PNG download error:", err);
      toast.error("Yuklab olishda xatolik. Chop etish funksiyasidan foydalaning.");
    }
    setDownloading(false);
  }

  async function handleDownloadPdf() {
    if (!certRef.current) return;
    setDownloadingPdf(true);
    try {
      const canvas = await captureCanvas();
      const { jsPDF } = await import("jspdf");
      // Sertifikat nisbati 1.414:1 — aynan A4 landshaft (297×210mm)
      const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      const pw = pdf.internal.pageSize.getWidth();
      const ph = pdf.internal.pageSize.getHeight();
      /**
       * PDF uchun JPEG: shu o'lchamdagi PNG data-URL o'nlab megabayt bo'lib,
       * jsPDF'ni sekinlashtiradi yoki xotira yetmay fayl buzilib chiqadi.
       * 0.92 sifatda bosma uchun farq sezilmaydi.
       */
      pdf.addImage(canvas.toDataURL("image/jpeg", 0.92), "JPEG", 0, 0, pw, ph, undefined, "FAST");
      pdf.save(`EduCode-Sertifikat-${cert?.certificate_number || "cert"}.pdf`);
      toast.success("PDF yuklab olindi!");
    } catch (err) {
      console.error("PDF download error:", err);
      toast.error("PDF yaratishda xatolik. Chop etish funksiyasidan foydalaning.");
    }
    setDownloadingPdf(false);
  }

  function handlePrint() {
    window.print();
  }

  if (loading) return <div className="max-w-4xl mx-auto"><div className="glass-card h-96 animate-pulse" /></div>;
  if (!cert) return <div className="text-center py-20"><p className="text-muted-foreground">Sertifikat topilmadi</p></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div className="flex items-center justify-between flex-wrap gap-3 print:hidden" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Link href="/my-results" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" /> Natijalarimga qaytish
        </Link>
        <div className="flex gap-2">
          <button onClick={handleDownloadPdf} disabled={downloadingPdf || downloading}
            className="btn-primary py-2.5 px-5 flex items-center gap-2 text-sm disabled:opacity-50">
            {downloadingPdf ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
            PDF yuklab olish
          </button>
          <button onClick={handleDownload} disabled={downloading || downloadingPdf}
            className="btn-ghost py-2.5 px-5 flex items-center gap-2 text-sm disabled:opacity-50">
            {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            PNG
          </button>
          <button onClick={handlePrint} className="btn-ghost py-2.5 px-5 flex items-center gap-2 text-sm">
            <Printer className="w-4 h-4" /> Chop etish
          </button>
        </div>
      </motion.div>

      {/* Ism tahrirlash — Gmail'dan kelgan ism boshqacha bo'lsa, yuklab olishdan oldin to'g'irlash */}
      <motion.div className="glass-card p-4 print:hidden" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <label className="flex items-center gap-2 text-sm font-medium mb-2">
          <Pencil className="w-4 h-4 text-neon-purple" />
          Sertifikatdagi ism-familiya
        </label>
        <div className="flex gap-2 flex-wrap">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ism Familiya"
            maxLength={60}
            className="input-field flex-1 min-w-[220px]"
          />
          <button
            onClick={saveName}
            disabled={savingName || !name.trim() || name.trim() === cert.full_name}
            className="btn-ghost py-2.5 px-5 flex items-center gap-2 text-sm disabled:opacity-40"
          >
            {savingName ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            Saqlash
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Yozganingiz sertifikatda va yuklab olinadigan faylda darhol ko&apos;rinadi.
        </p>
      </motion.div>

      {/* Certificate */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        {/* Sig'dirish qobig'i: ichidagi blok doim CERT_W×CERT_H, faqat vizual kichrayadi */}
        <div ref={shellRef} className="w-full overflow-hidden" style={{ height: CERT_H * fit }}>
          <div style={{ width: CERT_W, height: CERT_H, transform: `scale(${fit})`, transformOrigin: "top left" }}>
        <div ref={certRef} className="relative overflow-hidden shadow-2xl" style={{ width: CERT_W, height: CERT_H, background: "#fffdf7", borderRadius: "8px" }}>
          {/* Fon: nozik guilloche naqsh + burchak gradientlari */}
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 15% 15%, rgba(108,92,231,0.06), transparent 45%), radial-gradient(circle at 85% 85%, rgba(0,120,200,0.06), transparent 45%), #fffdf7" }} />
          <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "repeating-linear-gradient(45deg, #6C5CE7 0, #6C5CE7 1px, transparent 1px, transparent 11px)" }} />

          {/* Oltin ikki qavatli ramka */}
          <div style={{ position: "absolute", inset: "18px", border: "2px solid #c9a227", borderRadius: "4px" }} />
          <div style={{ position: "absolute", inset: "24px", border: "1px solid #e3c96b", borderRadius: "2px" }} />

          {/* Burchak bezaklari (oltin) */}
          {[
            { t: "26px", l: "26px", r: "rotate(0deg)" },
            { t: "26px", right: "26px", r: "rotate(90deg)" },
            { bottom: "26px", l: "26px", r: "rotate(270deg)" },
            { bottom: "26px", right: "26px", r: "rotate(180deg)" },
          ].map((c, i) => (
            <svg key={i} width="46" height="46" viewBox="0 0 46 46" style={{ position: "absolute", top: c.t as any, left: c.l as any, right: (c as any).right, bottom: (c as any).bottom, transform: c.r }}>
              <path d="M2 2 L2 22 M2 2 L22 2 M2 2 Q22 6 24 24" stroke="#c9a227" strokeWidth="1.5" fill="none" />
              <circle cx="2" cy="2" r="2.5" fill="#c9a227" />
            </svg>
          ))}

          {/* Kontent */}
          <div className="relative flex flex-col items-center h-full text-center" style={{ padding: "52px 64px 40px" }}>
            {/* Brend */}
            <div className="flex items-center gap-2" style={{ marginBottom: "18px" }}>
              <div style={{ width: "34px", height: "34px", borderRadius: "9px", background: "linear-gradient(135deg,#6C5CE7,#00A8E8)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
              </div>
              <span style={{ fontFamily: "Georgia, serif", fontSize: "17px", fontWeight: "bold", letterSpacing: "1px", color: "#1a1a2e" }}>EduCode</span>
            </div>

            {/* Sarlavha */}
            <h1 style={{ fontFamily: "Georgia, serif", fontSize: "40px", fontWeight: "bold", color: "#1a1a2e", letterSpacing: "8px", marginBottom: "4px" }}>
              SERTIFIKAT
            </h1>
            <p style={{ fontSize: "11px", color: "#c9a227", letterSpacing: "4px", fontWeight: 600, marginBottom: "20px" }}>MUVAFFAQIYATLI TUGATGANLIK</p>

            <p style={{ fontSize: "13px", color: "#777", marginBottom: "10px" }}>Ushbu sertifikat</p>

            {/* Ism */}
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: "34px", fontWeight: "bold", color: "#6C5CE7", marginBottom: "6px", lineHeight: 1.1 }}>
              {name || cert.full_name}
            </h2>
            <div style={{ width: "260px", height: "1.5px", background: "linear-gradient(90deg, transparent, #c9a227, transparent)", marginBottom: "16px" }} />

            <p style={{ fontSize: "13px", color: "#777", marginBottom: "8px" }}>quyidagi kursni muvaffaqiyatli tamomlaganini tasdiqlaydi:</p>
            <h3 style={{ fontFamily: "Georgia, serif", fontSize: "22px", fontWeight: 600, color: "#1a1a2e", marginBottom: "14px", maxWidth: "80%" }}>
              &ldquo;{cert.course_title}&rdquo;
            </h3>

            {cert.score_percentage != null && cert.score_percentage > 0 && (
              <div style={{ background: "linear-gradient(135deg, #6C5CE710, #00A8E810)", border: "1px solid #6C5CE730", borderRadius: "999px", padding: "5px 20px", marginBottom: "auto" }}>
                <span style={{ fontSize: "13px", color: "#6C5CE7", fontWeight: 700 }}>O&apos;rtacha ball: {cert.score_percentage}%</span>
              </div>
            )}

            {/* Pastki qator: sana | muhr | imzo */}
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", width: "100%", maxWidth: "560px", marginTop: "auto", paddingTop: "20px" }}>
              {/* Sana */}
              <div style={{ textAlign: "center", flex: 1 }}>
                <p style={{ fontSize: "13px", color: "#333", fontWeight: 600, fontFamily: "Georgia, serif", borderBottom: "1px solid #999", paddingBottom: "3px", marginBottom: "4px" }}>{formatDate(cert.completion_date)}</p>
                <p style={{ fontSize: "10px", color: "#999", letterSpacing: "1px" }}>SANA</p>
              </div>

              {/* Oltin muhr-medal */}
              <div style={{ flex: "0 0 auto", margin: "0 24px" }}>
                <svg width="76" height="76" viewBox="0 0 76 76">
                  <circle cx="38" cy="34" r="26" fill="none" stroke="#c9a227" strokeWidth="1" strokeDasharray="2 3" />
                  <circle cx="38" cy="34" r="22" fill="url(#gold)" />
                  <circle cx="38" cy="34" r="22" fill="none" stroke="#a5811a" strokeWidth="1.5" />
                  <circle cx="38" cy="34" r="16" fill="none" stroke="#fff5d6" strokeWidth="1" opacity="0.7" />
                  <text x="38" y="41" textAnchor="middle" fill="#7a5c10" fontSize="20" fontWeight="bold">★</text>
                  {/* Lenta */}
                  <path d="M28 52 L28 72 L38 65 L48 72 L48 52 Z" fill="#6C5CE7" />
                  <path d="M28 52 L28 60 L38 55 L48 60 L48 52 Z" fill="#5847c4" />
                  <defs>
                    <radialGradient id="gold" cx="0.4" cy="0.35">
                      <stop offset="0%" stopColor="#ffe89a" />
                      <stop offset="60%" stopColor="#e3c96b" />
                      <stop offset="100%" stopColor="#c9a227" />
                    </radialGradient>
                  </defs>
                </svg>
              </div>

              {/* Imzo */}
              <div style={{ textAlign: "center", flex: 1 }}>
                <p style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "17px", color: "#1a1a2e", borderBottom: "1px solid #999", paddingBottom: "3px", marginBottom: "4px" }}>EduCode</p>
                <p style={{ fontSize: "10px", color: "#999", letterSpacing: "1px" }}>PLATFORMA</p>
              </div>
            </div>

            {/* Footer: raqam + verifikatsiya */}
            <div style={{ width: "100%", borderTop: "1px solid #e8e2cf", paddingTop: "10px", marginTop: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={{ fontSize: "10px", color: "#999", fontFamily: "monospace" }}>№ {cert.certificate_number}</p>
              <p style={{ fontSize: "10px", color: "#aaa" }}>malla.uz — Raqamli intellektual ta&apos;lim platformasi</p>
            </div>
          </div>
        </div>
          </div>
        </div>
      </motion.div>

      {/* Info */}
      <div className="glass-card p-4 flex items-center justify-between text-sm text-muted-foreground print:hidden">
        <span>Sertifikat raqami: <strong className="text-foreground font-mono">{cert.certificate_number}</strong></span>
        <span>Berilgan sana: {formatDate(cert.issued_at)}</span>
      </div>
    </div>
  );
}
