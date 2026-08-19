import type { Locale } from "@/lib/i18n";

export interface MisconceptionRule {
  id: string;
  category: "syntax" | "scope" | "data_structures" | "control_flow" | "types" | "functions";
  title: Record<Locale, string>;
  description: Record<Locale, string>;
  socraticHint: Record<Locale, string>;
  whyItHappens: Record<Locale, string>;
  howToFix: Record<Locale, string>;
  badExample: string;
  goodExample: string;
  detect: (code: string, error?: string) => boolean;
}

export interface MisconceptionDiagnostic {
  rule: MisconceptionRule;
  matchedLine?: number;
}

export const MISCONCEPTION_RULES: MisconceptionRule[] = [
  {
    id: "MISCON_MUTATING_ITERATION",
    category: "data_structures",
    title: {
      uz: "Aylanayotgan ro'yxatni sikl ichida o'zgartirish",
      ru: "Модификация списка во время итерации",
      en: "Modifying List During Iteration",
      kaa: "Aylanıp turǵan dizimdi cikl ishinde ózgertiw",
    },
    description: {
      uz: "for sikli aylanayotgan ro'yxatdan element o'chirish yoki unga qo'shish indeks siljishiga olib keladi.",
      ru: "Удаление или добавление элементов в список во время его перебора циклом for приводит к пропуску элементов.",
      en: "Mutating a list while iterating over it with a for loop shifts internal indices and causes skipped elements.",
      kaa: "for cikli aylanıp turǵan dizimnen element óshiriw yamasa qosıw indeksler jılıwına sebep boladı.",
    },
    socraticHint: {
      uz: "O'ylab ko'ring: siz qatorda turgan odamlarni sanayotib, ulardan birini safdan chiqarsangiz, keyingi odamning o'rni nima bo'ladi?",
      ru: "Подумайте: если вы пересчитываете людей в очереди и убираете одного, что произойдет с номером следующего человека?",
      en: "Consider this: if you count people in a queue and remove one, what happens to the next person's position?",
      kaa: "Oylap kóriń: qatarda turǵan adamlardı sanap atırıp, birin shıǵarıp jiberseńiz, kelesi adamnıń ornı qalay boladı?",
    },
    whyItHappens: {
      uz: "Sikl xotiradagi ro'yxat ko'rsatkichini (pointer) qadamma-qadam oshirib boradi. Element o'chirilganda keyingi elementlar chapga suriladi va bir element tekshirilmasdan o'tib ketadi.",
      ru: "Цикл сдвигает внутренний указатель на +1. При удалении элемента оставшиеся сдвигаются влево, и следующий элемент пропускается.",
      en: "The loop increments an internal pointer. When an item is removed, following items shift left, causing the next item to be skipped.",
      kaa: "Cikl kórsetkishin qádemme-qádem asırıp baradı. Element óshirilgende qalǵanları shepke jıladı hám bir element tekserilmey qaladı.",
    },
    howToFix: {
      uz: "Asl ro'yxatning nusxasidan nusxa oling (`for x in arr[:]:`) yoki yangi ro'yxatga filtrlang (`[x for x in arr if ...]`).",
      ru: "Итерируйтесь по срезу-копии (`for x in arr[:]:`) или используйте генератор списка (`[x for x in arr if ...]`).",
      en: "Iterate over a shallow copy (`for x in arr[:]:`) or build a new list using a list comprehension (`[x for x in arr if ...]`).",
      kaa: "Dizim kóshirmesi boyınsha aylanıń (`for x in arr[:]:`) yamasa jańa dizimge filtrleń (`[x for x in arr if ...]`).",
    },
    badExample: "for x in sonlar:\n    if x % 2 == 0:\n        sonlar.remove(x)",
    goodExample: "toqlar = [x for x in sonlar if x % 2 != 0]",
    detect: (code) => {
      const lines = code.split("\n");
      for (let i = 0; i < lines.length; i++) {
        const forMatch = lines[i].match(/for\s+\w+\s+in\s+(\w+)\s*:/);
        if (forMatch) {
          const listName = forMatch[1];
          for (let j = i + 1; j < lines.length; j++) {
            if (lines[j].trim() === "" || lines[j].startsWith("    ") || lines[j].startsWith("\t")) {
              if (
                lines[j].includes(`${listName}.remove(`) ||
                lines[j].includes(`${listName}.pop(`) ||
                lines[j].includes(`del ${listName}[`)
              ) {
                return true;
              }
            } else {
              break;
            }
          }
        }
      }
      return false;
    },
  },
  {
    id: "MISCON_ASSIGNMENT_AS_EQUALITY",
    category: "syntax",
    title: {
      uz: "Shartda tenglik (==) o'rniga qiymat berish (=)",
      ru: "Присваивание (=) вместо сравнения (==)",
      en: "Assignment (=) Instead of Equality (==)",
      kaa: "Shártte teńlik (==) ornına mánis beriw (=)",
    },
    description: {
      uz: "if shartida ikkita qiymatni taqqoslash uchun `==` ishlatiladi, `=` esa o'zgaruvchiga qiymat o'zlashtiradi.",
      ru: "В условии if для проверки равенства используется `==`, тогда как `=` выполняет присваивание значения.",
      en: "In conditional statements, `==` tests for equality, whereas `=` assigns a new value to a variable.",
      kaa: "if shártinde eki mánisti salıstırıw ushın `==` isletiledi, `=` bolsa mánis beriw operatorı.",
    },
    socraticHint: {
      uz: "'Tengmi?' deb savol berish bilan 'Teng bo'lsin!' deb buyruq berish o'rtasidagi farqni eslang.",
      ru: "Вспомните разницу между вопросом 'Они равны?' и утверждением/командой 'Сделать равным!'.",
      en: "Recall the distinction between asking 'Are these equal?' vs commanding 'Make this equal!'.",
      kaa: "'Teńbe?' dep soraw menen 'Teń bolsın!' dep buyrıq beriw arasındaǵı parıqtı esleń.",
    },
    whyItHappens: {
      uz: "Matematikadagi bitta tenglik belgisi dasturlashda ikki xil vazifaga bo'lingan: `=` (saqlash) va `==` (tekshirish).",
      ru: "Математический знак равенства в программировании разделен на присваивание (`=`) и проверку (`==`).",
      en: "Mathematical equality is split into assignment (`=`) and logical comparison (`==`) in programming.",
      kaa: "Matematikadaǵı bir teńlik belgisi dastúrlewde eki túrli amalǵa bólingen: `=` hám `==`.",
    },
    howToFix: {
      uz: "Shart ichida taqqoslash uchun qo'shaloq tenglik `==` belgisini qo'ying.",
      ru: "Замените знак `=` внутри условия на двойной знак `==`.",
      en: "Use double equals `==` inside conditional expressions.",
      kaa: "Shárt ishinde salıstırıw ushın qos teńlik `==` belgisin qoyıń.",
    },
    badExample: "if yosh = 18:\n    print('Voyaga yetgan')",
    goodExample: "if yosh == 18:\n    print('Voyaga yetgan')",
    detect: (code, error) => {
      if (error && error.includes("SyntaxError") && /invalid syntax/i.test(error)) {
        if (/if\s+[\w.]+\s*=\s*[^=]/g.test(code)) return true;
      }
      return /if\s+[\w.]+\s*=\s*[^=]/g.test(code);
    },
  },
  {
    id: "MISCON_SCOPE_LEAKAGE",
    category: "scope",
    title: {
      uz: "Lokal o'zgaruvchiga funksiyadan tashqarida murojaat",
      ru: "Обращение к локальной переменной вне функции",
      en: "Accessing Local Variable Outside Function Scope",
      kaa: "Lokal ózgeriwshige funktsiyadan tısqarı múrájat",
    },
    description: {
      uz: "Funksiya ichida yaratilgan o'zgaruvchilar faqat shu funksiya ichida yashaydi va tashqariga ko'rinmaydi.",
      ru: "Переменные, объявленные внутри функции, локальны и недоступны за пределами этой функции.",
      en: "Variables created inside a function are local to its scope and cannot be accessed from the outer module.",
      kaa: "Funktsiya ishinde jaratılǵan ózgeriwshiler tek sol funktsiya ishinde jasaydı hám sırtqa kórinbeydi.",
    },
    socraticHint: {
      uz: "Xonaning ichidagi buyum eshik yopiq bo'lganda ko'chadan ko'rinadimi? Funksiyani ham alohida xona deb tasavvur qiling.",
      ru: "Видна ли вещь внутри комнаты с улицы при закрытой двери? Представьте функцию как изолированную комнату.",
      en: "Can an item inside a closed room be seen from the street? Think of functions as self-contained rooms.",
      kaa: "Bólme ishindegi buyım esik jabıq bolǵanda kósheden kórinedime? Funktsiyanı da bólek bólme dep elesletiń.",
    },
    whyItHappens: {
      uz: "Funksiya ishlashi tugagach, uning lokal steki (Call Stack freymi) tozalanadi va xotiradan o'chiriladi.",
      ru: "После завершения работы функции ее локальный фрейм в стеке вызовов очищается, и переменные удаляются.",
      en: "When a function execution completes, its Call Stack frame is destroyed along with all local references.",
      kaa: "Funktsiya jumısı juwmaqlanǵannan keyin, onıń lokal stegi tazalanadı hám yaddan óshiriledi.",
    },
    howToFix: {
      uz: "Funksiyadan kerakli qiymatni `return` orqali qaytaring va chaqirgan joyingizda yangi o'zgaruvchiga oling.",
      ru: "Возвращайте значение через `return` и сохраняйте его в переменную при вызове функции.",
      en: "Return the needed value with `return` and assign it upon calling the function.",
      kaa: "Funktsiyadan kerekli mánisti `return` arqalı qaytarıń hám shaqırǵan jerde jańa ózgeriwshige alıń.",
    },
    badExample: "def hisobla():\n    jami = 100\nhisobla()\nprint(jami)  # NameError",
    goodExample: "def hisobla():\n    jami = 100\n    return jami\nnatija = hisobla()\nprint(natija)",
    detect: (code, error) => {
      if (error && error.includes("NameError")) {
        return /def\s+\w+\([^)]*\):/.test(code);
      }
      return false;
    },
  },
  {
    id: "MISCON_OFF_BY_ONE_INDEXING",
    category: "control_flow",
    title: {
      uz: "1-asosli va 0-asosli indeks chalkashligi (Off-by-one)",
      ru: "Путаница с индексами от 0 и от 1 (Off-by-one)",
      en: "Off-by-one Indexing Confusion (0-based vs 1-based)",
      kaa: "1-tiykarlı hám 0-tiykarlı indeks shatasıwı (Off-by-one)",
    },
    description: {
      uz: "Pythonda indekslar 0 dan boshlanadi. n ta elementli ro'yxatning oxirgi indeksi n emas, balki n-1 dir.",
      ru: "В Python индексация начинается с 0. Последний индекс списка из n элементов равен n-1, а не n.",
      en: "Python uses 0-based indexing. The last valid index in a list of length n is n-1, not n.",
      kaa: "Pythonda indeksler 0 den baslanadı. n elementli dizimniń aqırǵı indeksi n emes, n-1 boladı.",
    },
    socraticHint: {
      uz: "Agar 5 qavatli uyda '0-qavat' (yer to'la) bo'lsa, eng yuqori qavat qaysi raqamda bo'ladi?",
      ru: "Если в 5-этажном доме есть 'нулевой этаж' (цоколь), какой номер будет у самого верхнего этажа?",
      en: "If a 5-story building starts with 'floor 0' (ground floor), what number is the top floor?",
      kaa: "Eger 5 qabatlı jayda '0-qabat' bolsa, eń joqarı qabat qaysı san menen belgilenedi?",
    },
    whyItHappens: {
      uz: "Kundalik hayotda 1 dan sanashga o'rganganmiz, kompyuter xotirasida esa manzil masofasi (offset) 0 dan hisoblanadi.",
      ru: "Мы привыкли считать с единицы, тогда как в памяти компьютера смещение (offset) от начала массива начинается с 0.",
      en: "Human counting begins at 1, whereas computer memory offsets count from 0.",
      kaa: "Turmısta 1 den sanawǵa úyrengenbiz, kompyuter yadında bolsa baslanıw noqatınan aralıq 0 den baslanadı.",
    },
    howToFix: {
      uz: "`range(len(arr))` ishlating yoki to'g'ridan-to'g'ri `for element in arr:` deb elementlarni oling.",
      ru: "Используйте `range(len(arr))` или перебирайте элементы напрямую через `for element in arr:`.",
      en: "Use `range(len(arr))` or iterate over values directly with `for element in arr:`.",
      kaa: "`range(len(arr))` isletıń yamasa elementlerdiń ózin `for element in arr:` dep alıń.",
    },
    badExample: "for i in range(len(arr) + 1):\n    print(arr[i])  # IndexError",
    goodExample: "for i in range(len(arr)):\n    print(arr[i])",
    detect: (code, error) => {
      if (error && error.includes("IndexError")) return true;
      return /range\(len\([^)]+\)\s*\+\s*1\)/.test(code);
    },
  },
  {
    id: "MISCON_TYPE_COERCION_STRING_INT",
    category: "types",
    title: {
      uz: "Matn (str) va sonni (int) to'g'ridan-to'g'ri qo'shish",
      ru: "Сложение строки (str) и числа (int) без приведения",
      en: "Implicit String & Integer Concatenation",
      kaa: "Tekst (str) hám sandı (int) tuwrıdan-tuwrı qosıw",
    },
    description: {
      uz: "Python qat'iy tiplashtirilgan til: matn va sonni avtomatik bir-biriga aylantirmaydi, TypeError beradi.",
      ru: "Python — язык со строгой типизацией: он не складывает автоматически строку с числом, вызывая TypeError.",
      en: "Python is strongly typed and will not implicitly cast integers to strings or vice versa during concatenation.",
      kaa: "Python qatań tiplestirilgen til: tekst hám sandı avtomat túrde qospaydı, TypeError keltirip shıǵaradı.",
    },
    socraticHint: {
      uz: "'5' so'zi bilan 5 sonini qo'shganda kompyuter nima qilishi kerak: 55 deb yozsinmi yoki 10 deb hisoblasinmi?",
      ru: "При сложении слова '5' и числа 5 что должен сделать компьютер: соединить в '55' или сложить как 10?",
      en: "When adding the text '5' and the number 5, should Python create '55' or compute 10?",
      kaa: "'5' teksti menen 5 sanın qosqanda kompyuter ne etiwi kerek: 55 dep jazsınba yamasa 10 dep esaplasınba?",
    },
    whyItHappens: {
      uz: "`input()` funksiyasi har doim matn qaytaradi. Uni `int()` orqali songa aylantirish yoddan ko'tariladi.",
      ru: "Функция `input()` всегда возвращает строку. Забывается явное преобразование через `int()`.",
      en: "`input()` always returns a string, requiring explicit conversion using `int()` or `float()`.",
      kaa: "`input()` funktsiyası hárdayım tekst qaytaradı. Onı `int()` arqalı sanǵa aylandırıw umıtıladı.",
    },
    howToFix: {
      uz: "Sonlarni kiritishda `int(input())` deb yozing yoki matn bilan chiqarishda f-string `f'{son}'` ishlating.",
      ru: "Используйте `int(input())` при чтении чисел или f-строки `f'{число}'` при выводе.",
      en: "Wrap input with `int(input())` or use f-strings `f'{num}'` for formatted printing.",
      kaa: "Sanlardı kirgiziwde `int(input())` dep jazıń yamasa f-string `f'{san}'` qollanıń.",
    },
    badExample: "yosh = input()\nkeyingi_yil = yosh + 1  # TypeError",
    goodExample: "yosh = int(input())\nkeyingi_yil = yosh + 1",
    detect: (code, error) => {
      if (error && (error.includes("can only concatenate str (not \"int\") to str") || error.includes("unsupported operand type(s) for +: 'int' and 'str'"))) {
        return true;
      }
      return false;
    },
  },
  {
    id: "MISCON_IMMUTABLE_STRING_MUTATION",
    category: "data_structures",
    title: {
      uz: "O'zgarmas satrni (str) joyida o'zgartirishga urinish",
      ru: "Попытка изменения неизменяемой строки (str)",
      en: "Attempting to Mutate Immutable String In-Place",
      kaa: "Ózgermeytuǵın qatardı (str) ornında ózgertiwge urınıw",
    },
    description: {
      uz: "Pythonda satrlar (str) o'zgarmas (immutable) turdir. `s[0] = 'A'` kabi qilib harfni to'g'ridan-to'g'ri o'zgartirib bo'lmaydi.",
      ru: "В Python строки (str) неизменяемы (immutable). Нельзя изменить символ напрямую через `s[0] = 'A'`.",
      en: "Python strings are immutable. You cannot modify a character in-place using item assignment `s[0] = 'A'`.",
      kaa: "Pythonda qatarlar (str) ózgermeytuǵın maǵlıwmat túri. `s[0] = 'A'` dep háripti ornında ózgertip bolmaydı.",
    },
    socraticHint: {
      uz: "Qog'ozga ruchka bilan yozilgan harfni o'chirib bo'lmaydi, lekin yangi qog'ozga to'g'rilab yozish mumkin.",
      ru: "Написанную ручкой букву нельзя стереть на месте, но можно переписать слово на новом листе бумаги.",
      en: "Ink on paper cannot be erased in-place, but you can write a corrected version on a fresh sheet.",
      kaa: "Ruchka menen jazılǵan háripti óshirip bolmaydı, biraq jańa qaǵazǵa durıslap jazıw múmkin.",
    },
    whyItHappens: {
      uz: "Ro'yxat (list) va satr (str) sintaksisi o'xshash bo'lgani uchun o'quvchilar satrni ham ro'yxatdek o'zgaruvchan deb o'ylashadi.",
      ru: "Сходство синтаксиса списков и строк вводит в заблуждение: строки кажутся изменяемыми.",
      en: "Similar indexing syntax leads beginners to assume strings are mutable like lists.",
      kaa: "Dizim hám qatar sintaksisi uqsas bolǵanlıqtan, qatardı da dizimdey ózgeriwshi dep oylaw boladı.",
    },
    howToFix: {
      uz: "Satrni qirqimlar (`s[:i] + 'A' + s[i+1:]`) yoki `replace()` orqali yangi satr sifatida hosil qiling.",
      ru: "Формируйте новую строку через срезы (`s[:i] + 'A' + s[i+1:]`) или метод `replace()`.",
      en: "Construct a new string using slicing (`s[:i] + 'A' + s[i+1:]`) or `replace()`.",
      kaa: "Qatardı kesindiler (`s[:i] + 'A' + s[i+1:]`) yamasa `replace()` arqalı jańa qatar etip jaratıń.",
    },
    badExample: "s = 'salom'\ns[0] = 'S'  # TypeError: 'str' object does not support item assignment",
    goodExample: "s = 'salom'\ns = 'S' + s[1:]",
    detect: (code, error) => {
      if (error && error.includes("does not support item assignment")) return true;
      return /\b\w+\[\d+\]\s*=\s*['"]/.test(code);
    },
  },
  {
    id: "MISCON_UNREACHABLE_AFTER_RETURN",
    category: "functions",
    title: {
      uz: "return dan keyin kod yozish (Yetib bo'lmas kod)",
      ru: "Код после оператора return (Недостижимый код)",
      en: "Unreachable Code After return Statement",
      kaa: "return nen keyin kod jazıw (Jetip bolmaytuǵın kod)",
    },
    description: {
      uz: "`return` bajarilishi bilan funksiya o'z ishini darhol yakunlaydi. Undan keyingi kodlar hech qachon ishlamaydi.",
      ru: "Как только выполняется `return`, функция немедленно завершает работу. Код после него никогда не выполнится.",
      en: "Executing `return` terminates the function immediately; any subsequent statements in the block are dead code.",
      kaa: "`return` orınlanıwı menen funktsiya jumısın tezde toqtatadı. Odan keyingi kodlar hesh qashan islemeydi.",
    },
    socraticHint: {
      uz: "Agar siz xonadan chiqib eshikni yopsangiz, xona ichida qolgan ishni bajara olasizmi?",
      ru: "Если вы вышли из комнаты и заперли дверь, сможете ли вы доделать дела внутри комнаты?",
      en: "If you leave a room and lock the door, can you continue doing tasks inside that room?",
      kaa: "Eger siz bólmeden shıǵıp esikti japsańız, bólme ishindegi jumıstı dawam ettire alasızba?",
    },
    whyItHappens: {
      uz: "O'quvchi `return` ni shunchaki bitta o'zgaruvchini saqlash amali deb tasavvur qiladi.",
      ru: "Ученик воспринимает `return` как простое сохранение значения, а не выход из подпрограммы.",
      en: "Beginners often mistake `return` for a variable assignment rather than an exit point.",
      kaa: "Oqıwshı `return` di tek mánisti saqlaw dep oylaydı hám funktsiyadan shıǵıwdı túsine almaydı.",
    },
    howToFix: {
      uz: "Barcha hisob-kitob va chop etish amallarini `return` qatoridan oldin bajaring.",
      ru: "Переместите все вычисления и действия выше строки с `return`.",
      en: "Move all calculations and logging prior to the `return` statement.",
      kaa: "Barlıq esap-kitap hám shıǵarıw ámellerin `return` qatarınan aldın orınlań.",
    },
    badExample: "def f(x):\n    return x * 2\n    print('Hisoblandi')  # Hech qachon ishlamaydi",
    goodExample: "def f(x):\n    print('Hisoblandi')\n    return x * 2",
    detect: (code) => {
      const lines = code.split("\n");
      for (let i = 0; i < lines.length - 1; i++) {
        const line = lines[i].trim();
        const nextLine = lines[i + 1].trim();
        if (/^return\b/.test(line) && nextLine && !/^(elif|else|except|finally|def|class)\b/.test(nextLine)) {
          const currentIndent = lines[i].match(/^\s*/)?.[0].length || 0;
          const nextIndent = lines[i + 1].match(/^\s*/)?.[0].length || 0;
          if (currentIndent > 0 && currentIndent === nextIndent) {
            return true;
          }
        }
      }
      return false;
    },
  },
];

export function diagnoseMisconceptions(code: string, error?: string): MisconceptionDiagnostic | null {
  if (!code || code.trim().length === 0) return null;
  for (const rule of MISCONCEPTION_RULES) {
    if (rule.detect(code, error)) {
      return { rule };
    }
  }
  return null;
}

export interface KnowledgeGraphNode {
  id: string;
  label: Record<Locale, string>;
  category: "syntax" | "flow" | "structures" | "functions" | "algorithms";
  x: number;
  y: number;
  status: "mastered" | "needs_practice" | "unlocked" | "locked";
  prerequisites: string[];
}

export const KNOWLEDGE_GRAPH_NODES: KnowledgeGraphNode[] = [
  { id: "syntax_io", label: { uz: "Kirish / Chiqish (I/O)", ru: "Ввод / Вывод (I/O)", en: "Input / Output (I/O)", kaa: "Kiriw / Shıǵıw (I/O)" }, category: "syntax", x: 100, y: 80, status: "mastered", prerequisites: [] },
  { id: "types_vars", label: { uz: "O'zgaruvchilar va Turlar", ru: "Переменные и Типы", en: "Variables & Types", kaa: "Ózgeriwshiler hám Túrler" }, category: "syntax", x: 300, y: 80, status: "mastered", prerequisites: ["syntax_io"] },
  { id: "arithmetic", label: { uz: "Arifmetik Amallar", ru: "Арифметика", en: "Arithmetic Operations", kaa: "Arifmetikalıq Ámeller" }, category: "syntax", x: 500, y: 80, status: "mastered", prerequisites: ["types_vars"] },
  
  { id: "conditions", label: { uz: "Shartlar (if/else)", ru: "Условия (if/else)", en: "Conditionals (if/else)", kaa: "Shártler (if/else)" }, category: "flow", x: 200, y: 220, status: "needs_practice", prerequisites: ["arithmetic"] },
  { id: "loops_for", label: { uz: "For Sikllari", ru: "Циклы For", en: "For Loops & Range", kaa: "For Ciklları" }, category: "flow", x: 400, y: 220, status: "mastered", prerequisites: ["conditions"] },
  { id: "loops_while", label: { uz: "While Sikli", ru: "Цикл While", en: "While Loops", kaa: "While Cikli" }, category: "flow", x: 600, y: 220, status: "needs_practice", prerequisites: ["loops_for"] },
  
  { id: "lists", label: { uz: "Ro'yxatlar (Lists)", ru: "Списки (Lists)", en: "Lists & Arrays", kaa: "Dizimler (Lists)" }, category: "structures", x: 260, y: 360, status: "mastered", prerequisites: ["loops_for"] },
  { id: "strings_methods", label: { uz: "Satrlar Metodlari", ru: "Методы строк", en: "String Methods", kaa: "Qatarlar Metodları" }, category: "structures", x: 460, y: 360, status: "mastered", prerequisites: ["lists"] },
  { id: "dicts_sets", label: { uz: "Lug'atlar (Dicts)", ru: "Словари и Множества", en: "Dicts & Sets", kaa: "Sózlikler hám Kóplikler" }, category: "structures", x: 660, y: 360, status: "unlocked", prerequisites: ["lists"] },
  
  { id: "functions_basic", label: { uz: "Funksiyalar (def)", ru: "Функции (def/return)", en: "Functions & Scope", kaa: "Funktsiyalar (def/return)" }, category: "functions", x: 340, y: 500, status: "needs_practice", prerequisites: ["lists", "loops_while"] },
  { id: "modules", label: { uz: "Standart Modullar", ru: "Модули (math, random)", en: "Standard Modules", kaa: "Standart Moduller" }, category: "functions", x: 540, y: 500, status: "unlocked", prerequisites: ["functions_basic"] },
  
  { id: "recursion", label: { uz: "Rekursiya va Stek", ru: "Рекурсия и Стек", en: "Recursion & Stack", kaa: "Rekursiya hám Stek" }, category: "algorithms", x: 280, y: 640, status: "locked", prerequisites: ["functions_basic"] },
  { id: "binary_search", label: { uz: "Ikkilik Qidiruv", ru: "Бинарный поиск", en: "Binary Search", kaa: "Ekilik Izlew" }, category: "algorithms", x: 480, y: 640, status: "locked", prerequisites: ["lists", "functions_basic"] },
];
