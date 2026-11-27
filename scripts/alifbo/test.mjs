/**
 * Konvertor testlari:  node scripts/alifbo/test.mjs
 * Har bir qator: [kirish, kutilgan natija].
 */
import { convertPlain, convertHtml, toOld } from "./converter.mjs";

const plain = [
  // asosiy harflar
  ["O'zbekiston", "Özbekiston"],
  ["o'qituvchi bog'cha", "öqituvçi boğça"],
  ["Shahar va choy", "Şahar va çoy"],
  ["SHAXS CHO'L", "ŞAXS ÇÖL"],
  ["G'alaba", "Ğalaba"],
  // Chiziqchali inglizcha atamalar va buyruqlar o'zgarmaydi
  ["Cache-Control va If-None-Match sarlavhalari", "Cache-Control va If-None-Match sarlavhalari"],
  ["pre-shared kalit, echo-server, ESTABLISHED holati", "pre-shared kalit, echo-server, ESTABLISHED holati"],
  ["netsh va ipconfig /flushdns buyruqlari, Apache", "netsh va ipconfig /flushdns buyruqlari, Apache"],
  ["Veb-dasturlash bosqichma-bosqich", "Veb-dasturlaş bosqiçma-bosqiç"],
  // apostrof shakllari
  ["o‘rganish oʻqish o’rin o`yin", "örganiş öqiş örin öyin"],
  // tutuq
  ["ma'lumot san'at ta'lim", "maʼlumot sanʼat taʼlim"],
  ["mo''jiza", "möʼjiza"],
  ["Is'hoq As'hob", "Isʼhoq Asʼhob"],
  ["Playground'da", "Playgroundʼda"],
  // ng o'zgarmaydi
  ["tong ming keng", "tong ming keng"],
  // tirnoqlar — tutuq emas
  ["'salom' deb yozing", "'salom' deb yozing"],
  ['"Nolga bo\'lib bo\'lmaydi"', '"Nolga bölib bölmaydi"'],
  // himoyalangan so'zlar
  ["ChatGPT va Chrome", "ChatGPT va Chrome"],
  ["Machine Learning", "Machine Learning"],
  ["PyTorch, GitHub", "PyTorch, GitHub"],
  ["Bash va Shell", "Bash va Shell"],
  ["is_published sha256", "is_published sha256"],
  // kod, havola, o'rin belgisi, HTML belgisi
  ["`print('o'zgar')` ni yozing", "`print('o'zgar')` ni yozing"],
  ["https://t.me/miracademy_uz sahifasi", "https://t.me/miracademy_uz sahifasi"],
  ["{chars} ta belgi", "{chars} ta belgi"],
  ["a&shy;b", "a&shy;b"],
  ["salom.sh faylini oching", "salom.sh faylini oçing"],
  // yopuvchi tirnoq o' emas; g' so'z oxirida qoladi
  ["'JetBrains Mono', monospace", "'JetBrains Mono', monospace"],
  ["tog' va bog'", "toğ va boğ"],
  ["Aisha TTS", "Aisha TTS"],
  // qoraqalpoqcha matnga tegilmaydi; inglizcha so'zlar tanib olinadi
  ["Ózgeriwshiler hám sheshiw", "Ózgeriwshiler hám sheshiw"],
  ["shallow copy, should reach", "shallow copy, should reach"],
  // raqamli tartib
  ["2026-yil 3-chorak", "2026-yil 3-çorak"],
  // takroran o'girish hech narsani o'zgartirmaydi
  ["Özbekiston şahar çoy maʼlumot", "Özbekiston şahar çoy maʼlumot"],
];

const html = [
  ['<p class="shadow">Shartlar</p>', '<p class="shadow">Şartlar</p>'],
  ["<p>O'zgaruvchi <code>ism = 'o'g'il'</code> deb yoziladi</p>", "<p>Özgaruvçi <code>ism = 'o'g'il'</code> deb yoziladi</p>"],
  ["<pre><code>print(\"Bo'sh\")\n# sharh</code></pre><p>Sharh</p>", "<pre><code>print(\"Bo'sh\")\n# sharh</code></pre><p>Şarh</p>"],
  ['<a href="https://ch.example/shop">Do\'kon</a>', '<a href="https://ch.example/shop">Dökon</a>'],
  ["<td><code>sh</code></td><td>sh</td>", "<td><code>sh</code></td><td>ş</td>"],
];

let xato = 0;
for (const [inp, kut] of plain) {
  const got = convertPlain(inp);
  if (got !== kut) { xato++; console.log(`PLAIN  ${JSON.stringify(inp)}\n  kutilgan ${JSON.stringify(kut)}\n  chiqdi   ${JSON.stringify(got)}`); }
}
for (const [inp, kut] of html) {
  const got = convertHtml(inp);
  if (got !== kut) { xato++; console.log(`HTML   ${JSON.stringify(inp)}\n  kutilgan ${JSON.stringify(kut)}\n  chiqdi   ${JSON.stringify(got)}`); }
}
// teskari o'girish yo'qotishsiz bo'lishi kerak (apostrof shakli bir xillashadi)
for (const w of ["Özbekiston şahar çoy maʼlumot ĞALABA", "Isʼhoq"]) {
  const back = convertPlain(toOld(w));
  if (back !== w) { xato++; console.log(`TESKARI ${w} -> ${toOld(w)} -> ${back}`); }
}
console.log(`${plain.length + html.length + 2} ta test, ${xato} ta xato`);
process.exit(xato ? 1 : 0);
