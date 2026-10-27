"use client";

import { Story, Console, type SceneNode, type SceneLink, type Step } from "../scene/Story";

/** Soket: dastur tarmoqqa "IP + port" eshigi orqali chiqadi. Python misolida server va mijoz. */

const nodes: SceneNode[] = [
  { id: "c", kind: "laptop", x: 110, y: 170, label: "Mijoz dasturi", sub: "client.py" },
  { id: "sw", kind: "switch", x: 380, y: 170, label: "Lokal tarmoq" },
  { id: "s", kind: "server", x: 650, y: 170, label: "Server dasturi", sub: "192.168.1.5 : ?" },
];
const links: SceneLink[] = [{ a: "c", b: "sw" }, { a: "sw", b: "s" }];

const SRV = ["import socket", "s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)  # TCP"];

const steps: Step[] = [
  {
    say: "Soket — dasturning tarmoqdagi «eshigi». Uning manzili ikki qismli: IP (qaysi kompyuter) + port (shu kompyuterdagi qaysi dastur). Avval server o'z eshigini ochadi.",
    panel: <Console lines={SRV} />,
  },
  {
    say: "bind — eshikka raqam qo'yish: server 5000-portni egallaydi. listen — eshik oldida kutish.",
    subs: { s: "192.168.1.5 : 5000" },
    marks: { s: { text: "5000-portda kutyapman…", tone: "info" } },
    panel: <Console lines={[...SRV, "s.bind(('0.0.0.0', 5000))", "s.listen()", "conn, addr = s.accept()   # mijoz kelguncha shu yerda turadi"]} />,
    ask: { q: "Mijoz serverga ulanishi uchun nimani bilishi kerak?", options: ["Faqat IP manzilni", "IP manzil va portni", "Serverning MAC manzilini"], answer: 1, explain: "IP — kompyuterni, port — undagi aniq dasturni topadi: 192.168.1.5:5000." },
  },
  {
    say: "Mijoz connect() qiladi — ichida TCP ning uch qadamli salomlashuvi bajariladi. Server accept() dan qaytadi: endi ular orasida ulanish bor.",
    subs: { s: "192.168.1.5 : 5000" },
    flights: [{ from: "c", to: "s", label: "SYN", tone: "amber" }, { from: "s", to: "c", label: "SYN-ACK", tone: "amber", delay: 2.4 }, { from: "c", to: "s", label: "ACK", tone: "amber", delay: 4.8 }],
    marks: { s: { text: "accept(): ulandi", tone: "ok", at: 7 } },
    panel: <Console lines={["# client.py", "c = socket.socket(socket.AF_INET, socket.SOCK_STREAM)", "c.connect(('192.168.1.5', 5000))"]} />,
  },
  {
    say: "Mijoz matn yuboradi: send(). Tarmoq faqat baytlarni tashiydi, shuning uchun matn avval baytga aylantiriladi (encode). Server recv() bilan oladi va javob qaytaradi.",
    subs: { s: "192.168.1.5 : 5000" },
    flights: [{ from: "c", to: "s", label: "b'Salom'" }, { from: "s", to: "c", label: "b'SALOM'", tone: "green", delay: 2.6 }],
    panel: <Console lines={["c.send('Salom'.encode())          # mijoz", "data = conn.recv(1024)            # server: b'Salom'", "conn.send(data.upper())            # server javobi", "print(c.recv(1024).decode())      # mijoz: SALOM"]} />,
    ask: { q: "send() ga nega 'Salom'.encode() beriladi?", options: ["Shifrlash uchun", "Tarmoq orqali faqat baytlar uzatiladi", "Tezroq bo'lishi uchun"], answer: 1, explain: "Soket bayt oqimi bilan ishlaydi: encode() matnni baytga, decode() esa qaytarib matnga aylantiradi." },
  },
  {
    say: "Agar server ishga tushirilmagan bo'lsa, 5000-port yopiq: kompyuter mijozga darhol «rad etildi» (RST) deb javob beradi.",
    subs: { s: "192.168.1.5 : (yopiq)" },
    flights: [{ from: "c", to: "s", label: "SYN", tone: "amber" }, { from: "s", to: "c", label: "RST", tone: "red", delay: 2.4 }],
    marks: { c: { text: "ConnectionRefusedError", tone: "drop", at: 4.6 } },
    ask: { q: "ConnectionRefusedError chiqdi. Eng birinchi nimani tekshirasiz?", options: ["Server dasturi ishga tushganmi va portlar mosmi", "Monitorni", "Mijoz kompyuterida antivirus"], answer: 0, explain: "Port yopiq — demak shu portni tinglayotgan dastur yo'q: server ishlamayapti yoki port raqami boshqa." },
  },
  { say: "Xulosa: server — socket → bind → listen → accept → recv/send; mijoz — socket → connect → send/recv. SOCK_STREAM — TCP (ulanishli), SOCK_DGRAM — UDP (sendto/recvfrom, ulanishsiz).", subs: { s: "192.168.1.5 : 5000" } },
];

export default function SocketStory() {
  return <Story nodes={nodes} links={links} steps={steps} height={300} title="Soket: ikki dastur tarmoq orqali gaplashadi" />;
}
