"use client";

import { Story, Console, type SceneNode, type SceneLink, type Step } from "../scene/Story";

/** Brauzerga manzil yozilganda: DNS → TCP → (TLS) → HTTP so'rov va javob. */

const nodes: SceneNode[] = [
  { id: "b", kind: "laptop", x: 90, y: 200, label: "Brauzer", sub: "tatu.uz" },
  { id: "r", kind: "router", x: 250, y: 200, label: "Uy routeri" },
  { id: "dns", kind: "server", x: 430, y: 80, label: "DNS server" },
  { id: "net", kind: "cloud", x: 450, y: 250, label: "Internet" },
  { id: "web", kind: "server", x: 670, y: 200, label: "Web server", sub: "195.158.1.5:443" },
];
const links: SceneLink[] = [{ a: "b", b: "r" }, { a: "r", b: "dns" }, { a: "r", b: "net" }, { a: "net", b: "web" }];

const steps: Step[] = [
  {
    say: "Talaba brauzerga tatu.uz deb yozdi. Kompyuter faqat raqamli manzillar bilan ishlaydi, shuning uchun avval DNS dan so'raydi: «tatu.uz ning IP si qanday?»",
    flights: [{ from: "b", to: "dns", label: "tatu.uz?", tone: "amber" }, { from: "dns", to: "b", label: "195.158.1.5", tone: "amber", delay: 2.4 }],
  },
  {
    say: "Manzil ma'lum. Endi server bilan TCP ulanish (SYN, SYN-ACK, ACK) va HTTPS bo'lgani uchun shifrlash kalitlari kelishiladi (TLS).",
    flights: [{ from: "b", to: "web", label: "SYN", tone: "purple" }, { from: "web", to: "b", label: "SYN-ACK", tone: "purple", delay: 3.3 }, { from: "b", to: "web", label: "🔒 TLS", tone: "purple", delay: 6.6 }],
    ask: { q: "HTTPS uchun standart port qaysi?", options: ["80", "443", "53", "25"], answer: 1, explain: "HTTPS — 443, oddiy HTTP — 80, DNS — 53, SMTP — 25." },
  },
  {
    say: "Brauzer so'rov yubordi: GET / — «bosh sahifani ber». So'rovda brauzer nomi, til, cookie'lar ham bor.",
    flights: [{ from: "b", to: "web", label: "GET /" }],
    panel: <Console lines={["GET / HTTP/1.1", "Host: tatu.uz", "User-Agent: Chrome/130", "Accept-Language: uz"]} />,
  },
  {
    say: "Server javob qaytardi: «200 OK» va HTML matn. Brauzer HTML ni o'qib, unda ko'rsatilgan rasm, CSS, JS fayllarini ham alohida so'rovlar bilan oladi.",
    flights: [{ from: "web", to: "b", label: "200 OK + HTML", tone: "green" }, { from: "b", to: "web", label: "GET /logo.png", delay: 3.6 }, { from: "web", to: "b", label: "200 rasm", tone: "green", delay: 6.9 }],
    panel: <Console lines={["HTTP/1.1 200 OK", "Content-Type: text/html; charset=utf-8", "", "<html> ... </html>"]} />,
    ask: { q: "Sahifa ochilishi uchun brauzer jami nechta so'rov yuboradi?", options: ["Har doim bitta", "HTML uchun bitta + har rasm, CSS, JS uchun alohida", "Faqat DNS so'rovi"], answer: 1, explain: "Odatdagi sahifa o'nlab so'rovdan yig'iladi: HTML, so'ng uning ichidagi barcha fayllar." },
  },
  {
    say: "Talaba yo'q sahifani ochdi: tatu.uz/eski. Server topolmadi va 404 qaytardi.",
    flights: [{ from: "b", to: "web", label: "GET /eski" }, { from: "web", to: "b", label: "404", tone: "red", delay: 3.3 }],
    marks: { b: { text: "404 Not Found", tone: "drop", at: 6.4 } },
    ask: { q: "Server dasturida xato chiqsa qaysi kod qaytadi?", options: ["200", "301", "404", "500"], answer: 3, explain: "5xx — server xatosi (500 Internal Server Error). 4xx — mijoz xatosi (404 — topilmadi), 3xx — yo'naltirish, 2xx — muvaffaqiyat." },
  },
  { say: "Xulosa: DNS → TCP → TLS → HTTP so'rov → javob. Kodlar: 2xx — muvaffaqiyat, 3xx — boshqa joyga yo'naltirish, 4xx — mijoz xatosi, 5xx — server xatosi. HTTPS da hammasi shifrlangan — yo'ldagilar ichini ko'rmaydi." },
];

export default function HttpStory() {
  return <Story nodes={nodes} links={links} steps={steps} height={340} title="Sahifa qanday ochiladi?" />;
}
