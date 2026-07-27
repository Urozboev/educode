"use client";

import {
  Document, Page, View, Text, Image, StyleSheet, Svg, Path, Circle, Defs,
} from "@react-pdf/renderer";
import { formatDate } from "@/lib/utils";

/**
 * Sertifikatning PDF varianti.
 *
 * Ilgari PDF html2canvas bilan olinar edi: sahifadan surat olinib, o'sha
 * surat PDF ichiga qo'yilardi. Bu ikki muammoni keltirardi — matn rasm
 * bo'lgani uchun yaqinlashtirilganda loyqalanardi, va brauzer bilan
 * html2canvas layoutni bir xil hisoblamagani uchun elementlar siljirdi.
 *
 * Endi PDF vektor sifatida chiziladi: matn — haqiqiy matn (nusxalash va
 * qidirish mumkin), joylashuv esa PDF'ning o'z tartiblagichi bilan
 * hisoblanadi. Siljish ehtimoli yo'q.
 *
 * Shrift: o'rnatilgan Times-Roman/Helvetica. Tashqi shrift yuklab olish
 * internetga bog'lanishni talab qiladi va offline'da PDF buziladi.
 */

const GOLD = "#c9a227";
const GOLD_LIGHT = "#e3c96b";
const INK = "#1a1a2e";
const PURPLE = "#6C5CE7";
const MUTED = "#777777";
const FAINT = "#999999";

const s = StyleSheet.create({
  page: { backgroundColor: "#fffdf7", position: "relative" },

  // Ikki qavatli oltin ramka
  frameOuter: {
    position: "absolute", top: 18, left: 18, right: 18, bottom: 18,
    borderWidth: 2, borderColor: GOLD, borderStyle: "solid", borderRadius: 4,
  },
  frameInner: {
    position: "absolute", top: 24, left: 24, right: 24, bottom: 24,
    borderWidth: 1, borderColor: GOLD_LIGHT, borderStyle: "solid", borderRadius: 2,
  },

  body: {
    paddingTop: 46, paddingBottom: 34, paddingHorizontal: 62,
    height: "100%", alignItems: "center",
  },

  brandRow: { flexDirection: "row", alignItems: "center", marginBottom: 14 },
  brandMark: {
    width: 26, height: 26, borderRadius: 7, backgroundColor: PURPLE,
    alignItems: "center", justifyContent: "center", marginRight: 6,
  },
  brandMarkText: { color: "#ffffff", fontSize: 13, fontFamily: "Helvetica-Bold" },
  brandName: { fontSize: 14, fontFamily: "Times-Bold", color: INK, letterSpacing: 1 },

  title: {
    fontSize: 34, fontFamily: "Times-Bold", color: INK,
    letterSpacing: 7, marginBottom: 4,
  },
  subtitle: {
    fontSize: 9, color: GOLD, letterSpacing: 3.5,
    fontFamily: "Helvetica-Bold", marginBottom: 18,
  },

  lead: { fontSize: 11, color: MUTED, marginBottom: 8 },
  name: {
    fontSize: 28, fontFamily: "Times-Bold", color: PURPLE,
    marginBottom: 6, textAlign: "center",
  },
  rule: { width: 220, height: 1, backgroundColor: GOLD_LIGHT, marginBottom: 14 },
  course: {
    fontSize: 18, fontFamily: "Times-Bold", color: INK,
    textAlign: "center", marginBottom: 12, maxWidth: "82%",
  },
  scorePill: {
    borderWidth: 1, borderColor: "#d5cff5", borderStyle: "solid",
    borderRadius: 999, paddingVertical: 4, paddingHorizontal: 16,
  },
  scoreText: { fontSize: 11, color: PURPLE, fontFamily: "Helvetica-Bold" },

  bottomRow: {
    flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between",
    width: "100%", maxWidth: 500, marginTop: "auto",
  },
  sideCol: { alignItems: "center", width: 150 },
  sideValue: {
    fontSize: 11, color: "#333333", fontFamily: "Times-Bold",
    borderBottomWidth: 1, borderBottomColor: FAINT, borderBottomStyle: "solid",
    paddingBottom: 3, marginBottom: 4, width: "100%", textAlign: "center",
  },
  sideValueItalic: {
    fontSize: 14, color: INK, fontFamily: "Times-Italic",
    borderBottomWidth: 1, borderBottomColor: FAINT, borderBottomStyle: "solid",
    paddingBottom: 3, marginBottom: 4, width: "100%", textAlign: "center",
  },
  sideLabel: { fontSize: 8, color: FAINT, letterSpacing: 1 },

  footer: {
    width: "100%", borderTopWidth: 1, borderTopColor: "#e8e2cf", borderTopStyle: "solid",
    paddingTop: 8, marginTop: 14,
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
  },
  footerText: { fontSize: 8, color: FAINT, fontFamily: "Courier" },
  footerNote: { fontSize: 8, color: "#aaaaaa" },

  qrBox: { alignItems: "center" },
  qrImage: { width: 58, height: 58 },
  qrCaption: { fontSize: 6.5, color: FAINT, marginTop: 3 },
});

export type CertificatePdfProps = {
  fullName: string;
  courseTitle: string;
  certificateNumber: string;
  completionDate: string;
  scorePercentage: number | null;
  /** QR kod PNG data-URL ko'rinishida */
  qrDataUrl: string | null;
  /** QR ostidagi tekshirish manzili */
  verifyUrl: string;
};

export function CertificatePdf({
  fullName, courseTitle, certificateNumber, completionDate,
  scorePercentage, qrDataUrl, verifyUrl,
}: CertificatePdfProps) {
  return (
    <Document
      title={`EduCode sertifikat — ${fullName}`}
      author="EduCode"
      subject={courseTitle}
    >
      {/* A4 landshaft — ekrandagi 1.414:1 nisbat bilan bir xil */}
      <Page size="A4" orientation="landscape" style={s.page}>
        <View style={s.frameOuter} />
        <View style={s.frameInner} />

        <View style={s.body}>
          {/* Brend */}
          <View style={s.brandRow}>
            <View style={s.brandMark}>
              <Text style={s.brandMarkText}>&lt;/&gt;</Text>
            </View>
            <Text style={s.brandName}>EduCode</Text>
          </View>

          <Text style={s.title}>SERTIFIKAT</Text>
          <Text style={s.subtitle}>MUVAFFAQIYATLI TUGATGANLIK</Text>

          <Text style={s.lead}>Ushbu sertifikat</Text>
          <Text style={s.name}>{fullName}</Text>
          <View style={s.rule} />

          <Text style={s.lead}>quyidagi kursni muvaffaqiyatli tamomlaganini tasdiqlaydi:</Text>
          <Text style={s.course}>&laquo;{courseTitle}&raquo;</Text>

          {scorePercentage != null && scorePercentage > 0 && (
            <View style={s.scorePill}>
              <Text style={s.scoreText}>O&apos;rtacha ball: {Math.round(scorePercentage)}%</Text>
            </View>
          )}

          {/* Sana | medal | imzo */}
          <View style={s.bottomRow}>
            <View style={s.sideCol}>
              <Text style={s.sideValue}>{formatDate(completionDate)}</Text>
              <Text style={s.sideLabel}>SANA</Text>
            </View>

            <Medal />

            <View style={s.sideCol}>
              <Text style={s.sideValueItalic}>EduCode</Text>
              <Text style={s.sideLabel}>PLATFORMA</Text>
            </View>
          </View>

          {/* Raqam | QR | manba */}
          <View style={s.footer}>
            <Text style={s.footerText}>№ {certificateNumber}</Text>

            {qrDataUrl && (
              <View style={s.qrBox}>
                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                <Image src={qrDataUrl} style={s.qrImage} />
                <Text style={s.qrCaption}>Haqiqiyligini tekshirish</Text>
              </View>
            )}

            <Text style={s.footerNote}>{verifyUrl.replace(/^https?:\/\//, "")}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}

/** Oltin medal — vektor, shuning uchun har qanday kattalashtirishda tiniq */
function Medal() {
  return (
    <Svg width={64} height={64} viewBox="0 0 76 76">
      <Defs />
      <Circle cx="38" cy="32" r="24" fill="none" stroke={GOLD} strokeWidth={1} />
      <Circle cx="38" cy="32" r="21" fill={GOLD_LIGHT} stroke="#a5811a" strokeWidth={1.5} />
      <Circle cx="38" cy="32" r="15" fill="none" stroke="#fff5d6" strokeWidth={1} />
      <Path
        d="M38 22 L41 30 L49 30 L43 35 L45 43 L38 38 L31 43 L33 35 L27 30 L35 30 Z"
        fill="#7a5c10"
      />
      <Path d="M28 50 L28 70 L38 63 L48 70 L48 50 Z" fill={PURPLE} />
      <Path d="M28 50 L28 58 L38 53 L48 58 L48 50 Z" fill="#5847c4" />
    </Svg>
  );
}
