import type { Locale } from "@/lib/i18n";

export interface ConceptMetaphor {
  id: string;
  category: "basics" | "structures" | "logic" | "functions" | "oop" | "algorithms";
  title: Record<Locale, string>;
  analogy: Record<Locale, string>;
  exampleCode: string;
  inAction: Record<Locale, string>;
  keyTakeaway: Record<Locale, string>;
}

export interface KeywordExplanation {
  keyword: string;
  role: Record<Locale, string>;
  analogy: Record<Locale, string>;
}

export const CONCEPT_METAPHORS: ConceptMetaphor[] = [
  {
    id: "variable",
    category: "basics",
    title: {
      uz: "O'zgaruvchi (Variable)",
      ru: "Переменная (Variable)",
      en: "Variable",
      kaa: "Ózgeriwshi (Variable)",
    },
    analogy: {
      uz: "Ustiga yorliq yopishtirilgan quticha. Siz qutiga nom berasiz (masalan, 'yosh') va ichiga kerakli qiymatni solib qo'yasiz. Istalgan vaqtda qutidagi narsani yangisiga almashtirish mumkin.",
      ru: "Коробочка с наклеенной этикеткой. Вы даете коробке имя (например, 'yosh') и кладете внутрь значение. В любой момент содержимое можно заменить.",
      en: "A labeled storage box. You give it a name (e.g. 'age') and store a value inside. You can inspect or replace the contents anytime.",
      kaa: "Ústine etiketka jabıstırılǵan qutısha. Siz qutıǵa at beresiz (mısalı, 'yosh') hám ishine mánis salasız. Qálegen waqıtta ishindegi mánisti jańasına almastırıw múmkin.",
    },
    exampleCode: "yosh = 15\nyosh = 16  # Quti ichidagi qiymat yangilandi",
    inAction: {
      uz: "Kompyuter xotirasidan (RAM) joy ajratib, unga nom berib boshqarish.",
      ru: "Выделение ячейки в оперативной памяти (RAM) и обращение к ней по имени.",
      en: "Allocating a memory slot in RAM and referencing it by human-readable label.",
      kaa: "Kompyuter yadınan (RAM) orın ajıratıp, oǵan at berip basqarıw.",
    },
    keyTakeaway: {
      uz: "O'zgaruvchi qiymatning o'zi emas, balki xotiradagi manzilga ko'rsatkichdir.",
      ru: "Переменная — это не само значение, а ссылка на него в памяти.",
      en: "A variable is a named reference pointing to an object in memory.",
      kaa: "Ózgeriwshi mánistiń ózi emes, al yaddaǵı kórsetkish.",
    },
  },
  {
    id: "function",
    category: "functions",
    title: {
      uz: "Funksiya (Function)",
      ru: "Функция (Function)",
      en: "Function",
      kaa: "Funktsiya (Function)",
    },
    analogy: {
      uz: "Oshxona konveyeri yoki qahva tayyorlaydigan avtomat. Siz unga masalliq (argument) berasiz, u retsept (kod) bo'yicha ishlaydi va tayyor mahsulotni (`return`) qaytaradi.",
      ru: "Кухонный комбайн или кофемашина. Вы даете ингредиенты (аргументы), аппарат выполняет рецепт (код) и выдает готовый напиток (`return`).",
      en: "A smart coffee machine. You provide ingredients (arguments), it executes the recipe (code), and delivers the finished beverage (`return`).",
      kaa: "Kofe tayarlaytuǵın avtomat. Siz oǵan ónimler (argumentler) beresiz, ol retsept (kod) boyınsha isleydi hám tayar kofeni (`return`) qaytaradı.",
    },
    exampleCode: "def qahva_tayyorla(shakar_soni):\n    return f'{shakar_soni} qoshiq shakarli qahva tayyor!'",
    inAction: {
      uz: "Bir marta yozilgan kodni qayta-qayta chaqirish orqali ortiqcha takrorlanishdan saqlanish.",
      ru: "Многократное использование одного и того же алгоритма без дублирования кода.",
      en: "Encapsulating logic for modular, repeatable, and maintainable execution.",
      kaa: "Bir márte jazılǵan kodtı qayta-qayta shaqırıw arqalı tákirarlanıwlardan qutılıw.",
    },
    keyTakeaway: {
      uz: "Yaxshi funksiya faqat bitta aniq vazifani bajarishi kerak (Single Responsibility).",
      ru: "Хорошая функция должна решать ровно одну четкую задачу.",
      en: "A well-designed function should have one single well-defined purpose.",
      kaa: "Jaqsı funktsiya tek bir anıq wazıypanı orınlawı kerek.",
    },
  },
  {
    id: "loop_for",
    category: "logic",
    title: {
      uz: "For Sikli (For Loop)",
      ru: "Цикл For (For Loop)",
      en: "For Loop",
      kaa: "For Cikli (For Loop)",
    },
    analogy: {
      uz: "Po'chtachi ko'chadagi har bir xonadonga birma-bir maktub tashlab chiqishiga o'xshaydi. Xonadonlar ro'yxati tugamaguncha u keyingisiga o'taveradi.",
      ru: "Почтальон, который обходит каждый дом на улице по очереди, пока не доставит все письма.",
      en: "A mail carrier visiting every house along a street sequentially until all deliveries are complete.",
      kaa: "Xat tasıwshı hár bir úyge gezekpe-gezek xat taslap shıǵıwına uqsas. Úyler dizimi pitkenshe ol kelesisine óteberedi.",
    },
    exampleCode: "mevalar = ['olma', 'anor', 'anjir']\nfor m in mevalar:\n    print(m)",
    inAction: {
      uz: "Elementlar to'plami bo'yicha ketma-ket yurib chiqish (iteratsiya).",
      ru: "Последовательный перебор элементов коллекции (итерация).",
      en: "Sequential iteration across elements of a collection or generator.",
      kaa: "Elementler toplamı boyınsha izbe-iz júrip shıǵıw (iteraciya).",
    },
    keyTakeaway: {
      uz: "Qadamlar soni oldindan ma'lum bo'lganda `for` eng qulay tanlovdir.",
      ru: "Используйте `for`, когда количество повторений или размер коллекции известны.",
      en: "Prefer `for` loops when iterating over known collections or sequences.",
      kaa: "Qádemler sanı aldınnan belgili bolǵanda `for` eń qolaylısı.",
    },
  },
  {
    id: "loop_while",
    category: "logic",
    title: {
      uz: "While Sikli (While Loop)",
      ru: "Цикл While (While Loop)",
      en: "While Loop",
      kaa: "While Cikli (While Loop)",
    },
    analogy: {
      uz: "Telefoningiz quvvati tugamaguncha video tomosha qilish. Har daqiqada 'quvvat bormi?' deb tekshiriladi; quvvat 0 bo'lishi bilan video to'xtaydi.",
      ru: "Просмотр видео на смартфоне, пока не разрядится аккумулятор. Каждую минуту проверяется уровень заряда; при 0% экран гаснет.",
      en: "Streaming a video while battery level is above 0%. Every minute it checks the condition; the moment it fails, it stops.",
      kaa: "Telefonıńızdıń quwatı pitkenshe video kóriw. Hár minutta 'quwat barma?' dep tekseriledi; quwat 0 bolǵanda toqtaydı.",
    },
    exampleCode: "quvvat = 100\nwhile quvvat > 0:\n    quvvat -= 20",
    inAction: {
      uz: "Amalni aniq bir shart bajarilib turgangacha takrorlash.",
      ru: "Повторение действий до тех пор, пока истинно заданное логическое условие.",
      en: "Repeating actions conditionally until a termination state is reached.",
      kaa: "Amaldı anıq bir shárt orınlanıp turǵansha tákirarlaw.",
    },
    keyTakeaway: {
      uz: "Sikl ichida shartni False ga yaqinlashtiruvchi o'zgarish bo'lishi shart, aks holda cheksiz sikl paydo bo'ladi.",
      ru: "Внутри цикла переменная условия обязательно должна изменяться, иначе возникнет бесконечный цикл.",
      en: "Ensure loop variables progress toward the termination condition to prevent infinite loops.",
      kaa: "Cikl ishinde shártti False qa jaqınlastıratuǵın ózgeris bolıwı shárt, bolmasa sheksiz cikl payda boladı.",
    },
  },
  {
    id: "recursion",
    category: "algorithms",
    title: {
      uz: "Rekursiya (Recursion)",
      ru: "Рекурсия (Recursion)",
      en: "Recursion",
      kaa: "Rekursiya (Recursion)",
    },
    analogy: {
      uz: "Ichma-ich joylashgan Matryoshka qo'g'irchoqlari. Eng oxirgi kichkina qo'g'irchoqqa (baza holati) yetguncha kattasining ichidan kichkinasi ochilaveradi, keyin teskari tartibda yig'iladi.",
      ru: "Русская матрешка. Кукла открывается, внутри меньшая, пока не дойдем до самой маленькой (базовый случай), после чего все закрывается обратно.",
      en: "Russian Matryoshka nesting dolls. You open each outer doll to find a smaller one until reaching the base doll, then fold back.",
      kaa: "Ishpe-ish jaylasqan Matryoshka oyınshıqları. Eń kishi oyınshıqqa (baza jaǵdayı) jetkenshe úlkeniniń ishinen kishisi ashılaveredi.",
    },
    exampleCode: "def faktorial(n):\n    if n <= 1: return 1\n    return n * faktorial(n - 1)",
    inAction: {
      uz: "Murakkab masalani o'zining kichikroq nusxalariga bo'lib yechish.",
      ru: "Разбиение комплексной задачи на самоподобные подзадачи меньшего размера.",
      en: "Solving complex divide-and-conquer problems through self-similar sub-problems.",
      kaa: "Quramalı máseleni óziniń kishirek nusqalarına bólip sheshiw.",
    },
    keyTakeaway: {
      uz: "Har bir rekursiv funksiyada 'Baza holati' (to'xtash sharti) bo'lishi shart!",
      ru: "У любой рекурсивной функции обязательно должно быть базовое условие остановки.",
      en: "Every recursive function must define a base case to halt execution.",
      kaa: "Hár bir rekursiv funktsiyada toqtatıw shárti (baza) bolıwı kerek!",
    },
  },
  {
    id: "dictionary",
    category: "structures",
    title: {
      uz: "Lug'at (Dictionary / Key-Value)",
      ru: "Словарь (Dictionary)",
      en: "Dictionary (Hash Map)",
      kaa: "Sózlik (Dictionary)",
    },
    analogy: {
      uz: "Telefon kontaktlar daftari. Siz do'stingizning ismini (kalit) qidirasiz va unga mos telefon raqamini (qiymat) darhol topasiz.",
      ru: "Телефонная книга контактов. Вы ищете имя друга (ключ) и моментально получаете его номер телефона (значение).",
      en: "A phone contacts directory. You look up a contact name (key) to instantly retrieve their phone number (value).",
      kaa: "Telefon kontaktlar dápteri. Siz dosıńızdıń atın (gilt) izleysiz hám oǵan sáykes telefon nomerin (mánis) tez tabasız.",
    },
    exampleCode: "kontaktlar = {'Ali': '+998901234567', 'Vali': '+998907654321'}\nprint(kontaktlar['Ali'])",
    inAction: {
      uz: "O(1) o'zgarmas vaqtda kalit bo'yicha ma'lumotni tezkor topish.",
      ru: "Мгновенный поиск данных по ключу со сложностью O(1).",
      en: "Instant O(1) average lookup, insertion, and deletion by key.",
      kaa: "O(1) turaqlı waqıtta gilt boyınsha maǵlıwmattı tez tabıw.",
    },
    keyTakeaway: {
      uz: "Kalitlar takrorlanmas (unique) va o'zgarmas tur (str, int, tuple) bo'lishi kerak.",
      ru: "Ключи словаря обязаны быть уникальными и неизменяемыми типами.",
      en: "Dictionary keys must be unique and immutable (hashable).",
      kaa: "Giltler qaytalanbas hám ózgermeytuǵın túr bolıwı kerek.",
    },
  },
];

export const KEYWORD_EXPLANATIONS: Record<string, KeywordExplanation> = {
  def: {
    keyword: "def",
    role: {
      uz: "Yangi funksiya yaratish (e'lon qilish) kalit so'zi.",
      ru: "Объявление новой пользовательской функции.",
      en: "Defines a new user-defined function.",
      kaa: "Jańa funktsiya jaratıw (járiyalaw) gilt sózi.",
    },
    analogy: {
      uz: "Oshxona daftariga yangi taom retseptini yozib qo'yish.",
      ru: "Запись нового кулинарного рецепта в поваренную книгу.",
      en: "Writing a new recipe into your cooking notebook.",
      kaa: "Aspan dápterine jańa awqat retseptin jazıp qoyıw.",
    },
  },
  return: {
    keyword: "return",
    role: {
      uz: "Funksiyadan natijani qaytarish va uning ishini yakunlash.",
      ru: "Возврат вычисленного значения из функции и выход из неё.",
      en: "Returns a computed value from a function and exits.",
      kaa: "Funktsiyadan nátiyjeni qaytarıw hám jumısın toqtatıw.",
    },
    analogy: {
      uz: "Buyurtma qilingan mahsulotni mijozning qo'liga topshirish.",
      ru: "Вручение готового заказа клиенту в руки.",
      en: "Handing the prepared order directly to the customer.",
      kaa: "Buyırtpa etilgen ónimdi tutınıwshınıń qolına tapsırıw.",
    },
  },
  lambda: {
    keyword: "lambda",
    role: {
      uz: "Nomsiz, bir qatorlik qisqa funksiya.",
      ru: "Анонимная однострочная мини-функция.",
      en: "An anonymous inline single-expression function.",
      kaa: "Atsız, bir qatarlı qısqa funktsiya.",
    },
    analogy: {
      uz: "Bir martalik kichik qulay vosita (masalan, stakan).",
      ru: "Одноразовый удобный инструмент для быстрой операции.",
      en: "A disposable single-use micro-tool for quick tasks.",
      kaa: "Bir márte isletiletuǵın qolaylı kishi ásbap.",
    },
  },
  yield: {
    keyword: "yield",
    role: {
      uz: "Generatorda qiymatni navbatma-navbat berish va holatni muzlatish.",
      ru: "Генерация очередного значения с сохранением состояния функции.",
      en: "Yields the next value from a generator and pauses state.",
      kaa: "Generatorda mánisti gezekpe-gezek beriw hám jaǵdaydı saqlaw.",
    },
    analogy: {
      uz: "Konveyerdan mahsulotlarni birma-bir uzatish (hammasini birdan to'kmasdan).",
      ru: "Выдача деталей по одной штуке с конвейера по требованию.",
      en: "Dispensing items one at a time on demand rather than loading all at once.",
      kaa: "Konveyerden ónimlerdi birme-bir uzatıw.",
    },
  },
};
