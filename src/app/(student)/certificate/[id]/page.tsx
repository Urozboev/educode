"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils";
import type { Certificate } from "@/types";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ArrowLeft, Download, Printer, Share2, Loader2 } from "lucide-react";

export default function CertificatePage() {
  const { id } = useParams<{ id: string }>();
  const supabase = createClient();
  const [cert, setCert] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const certRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("certificates").select("*").eq("id", id).single();
      if (data) setCert(data as Certificate);
      setLoading(false);
    })();
  }, [id]);

  async function handleDownload() {
    if (!certRef.current) return;
    setDownloading(true);

    try {
      // html2canvas dinamik import
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(certRef.current, {
        scale: 2,
        backgroundColor: null,
        useCORS: true,
        logging: false,
      });

      const link = document.createElement("a");
      link.download = `EduCode-Sertifikat-${cert?.certificate_number || "cert"}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast.success("Sertifikat yuklab olindi!");
    } catch (err) {
      console.error("Download error:", err);
      toast.error("Yuklab olishda xatolik. Print funksiyasidan foydalaning.");
    }
    setDownloading(false);
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
          <button onClick={handleDownload} disabled={downloading}
            className="btn-primary py-2.5 px-5 flex items-center gap-2 text-sm disabled:opacity-50">
            {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            PNG yuklab olish
          </button>
          <button onClick={handlePrint} className="btn-ghost py-2.5 px-5 flex items-center gap-2 text-sm">
            <Printer className="w-4 h-4" /> Chop etish
          </button>
        </div>
      </motion.div>

      {/* Certificate */}
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
        <div ref={certRef} className="relative bg-white rounded-2xl overflow-hidden shadow-2xl" style={{ aspectRatio: "1.414/1" }}>
          {/* Background pattern */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50" />
            {/* Border decoration */}
            <div className="absolute inset-4 border-2 border-gray-200 rounded-xl" />
            <div className="absolute inset-5 border border-gray-100 rounded-lg" />
            {/* Corner decorations */}
            <svg className="absolute top-6 left-6 w-16 h-16 text-purple-200" viewBox="0 0 64 64"><path d="M0 0 L64 0 L64 8 L8 8 L8 64 L0 64 Z" fill="currentColor" /></svg>
            <svg className="absolute top-6 right-6 w-16 h-16 text-blue-200" viewBox="0 0 64 64"><path d="M0 0 L64 0 L64 64 L56 64 L56 8 L0 8 Z" fill="currentColor" /></svg>
            <svg className="absolute bottom-6 left-6 w-16 h-16 text-blue-200" viewBox="0 0 64 64"><path d="M0 0 L8 0 L8 56 L64 56 L64 64 L0 64 Z" fill="currentColor" /></svg>
            <svg className="absolute bottom-6 right-6 w-16 h-16 text-purple-200" viewBox="0 0 64 64"><path d="M56 0 L64 0 L64 64 L0 64 L0 56 L56 56 Z" fill="currentColor" /></svg>
          </div>

          {/* Content */}
          <div className="relative flex flex-col items-center justify-center h-full px-12 py-10 text-center">
            {/* Logo */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
                </svg>
              </div>
              <span style={{ fontFamily: "Georgia, serif", fontSize: "18px", fontWeight: "bold", color: "#6C5CE7" }}>EduCode</span>
            </div>

            {/* Title */}
            <h1 style={{ fontFamily: "Georgia, serif", fontSize: "36px", fontWeight: "bold", color: "#1a1a2e", marginBottom: "8px", letterSpacing: "3px" }}>
              SERTIFIKAT
            </h1>
            <div style={{ width: "200px", height: "2px", background: "linear-gradient(90deg, transparent, #6C5CE7, transparent)", marginBottom: "24px" }} />

            {/* Description */}
            <p style={{ fontSize: "14px", color: "#666", marginBottom: "12px" }}>Ushbu sertifikat</p>

            {/* Name */}
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: "32px", fontWeight: "bold", color: "#6C5CE7", marginBottom: "12px", borderBottom: "2px solid #6C5CE7", paddingBottom: "8px", display: "inline-block" }}>
              {cert.full_name}
            </h2>

            {/* Course info */}
            <p style={{ fontSize: "14px", color: "#666", marginBottom: "6px" }}>tomonidan</p>
            <h3 style={{ fontFamily: "Georgia, serif", fontSize: "22px", fontWeight: "600", color: "#1a1a2e", marginBottom: "24px" }}>
              &ldquo;{cert.course_title}&rdquo;
            </h3>
            <p style={{ fontSize: "14px", color: "#666", marginBottom: "6px" }}>kursi muvaffaqiyatli tugatilganligini tasdiqlaydi</p>

            {/* Score */}
            {cert.score_percentage && (
              <div style={{ background: "#f0f0ff", borderRadius: "12px", padding: "8px 24px", marginTop: "8px", marginBottom: "16px" }}>
                <span style={{ fontSize: "14px", color: "#6C5CE7", fontWeight: "600" }}>
                  O'rtacha ball: {cert.score_percentage}%
                </span>
              </div>
            )}

            {/* Date and Number */}
            <div style={{ display: "flex", justifyContent: "space-between", width: "100%", maxWidth: "500px", marginTop: "auto", paddingTop: "24px" }}>
              <div style={{ textAlign: "left" }}>
                <p style={{ fontSize: "11px", color: "#999", marginBottom: "4px" }}>SANA</p>
                <p style={{ fontSize: "14px", color: "#333", fontWeight: "500" }}>{formatDate(cert.completion_date)}</p>
              </div>
              <div style={{ textAlign: "center" }}>
                {/* Medal */}
                <svg width="48" height="48" viewBox="0 0 48 48">
                  <circle cx="24" cy="20" r="16" fill="#FFD600" opacity="0.15" />
                  <circle cx="24" cy="20" r="12" fill="#FFD600" opacity="0.25" />
                  <circle cx="24" cy="20" r="8" fill="#FFD600" opacity="0.4" />
                  <text x="24" y="24" textAnchor="middle" fill="#b8860b" fontSize="12" fontWeight="bold">★</text>
                  <polygon points="20,32 24,36 28,32 26,44 24,40 22,44" fill="#6C5CE7" opacity="0.3" />
                </svg>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: "11px", color: "#999", marginBottom: "4px" }}>SERTIFIKAT RAQAMI</p>
                <p style={{ fontSize: "12px", color: "#333", fontFamily: "monospace" }}>{cert.certificate_number}</p>
              </div>
            </div>

            {/* Footer */}
            <div style={{ width: "100%", borderTop: "1px solid #e0e0e0", paddingTop: "12px", marginTop: "16px" }}>
              <p style={{ fontSize: "10px", color: "#aaa" }}>
                EduCode Platform — Raqamli intellektual ta'lim platformasi · malla.uz
              </p>
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
