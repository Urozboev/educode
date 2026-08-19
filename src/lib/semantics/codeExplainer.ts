import type { Locale } from "@/lib/i18n";

export interface LineSemanticExplanation {
  lineNumber: number;
  rawCode: string;
  explanation: Record<Locale, string>;
  category: "input" | "output" | "loop" | "condition" | "function" | "assignment" | "import" | "other";
}

export function explainPythonCode(code: string): LineSemanticExplanation[] {
  if (!code || code.trim().length === 0) return [];
  const lines = code.split("\n");
  const result: LineSemanticExplanation[] = [];

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const trimmed = raw.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const lineNo = i + 1;
    let category: LineSemanticExplanation["category"] = "other";
    let expUz = "";
    let expRu = "";
    let expEn = "";
    let expKaa = "";

    // 1. Input statements
    if (/input\s*\(/.test(trimmed)) {
      category = "input";
      if (/int\s*\(\s*input/.test(trimmed)) {
        expUz = "Foydalanuvchidan butun son kiritishni so'raydi va uni o'zgaruvchiga saqlaydi.";
        expRu = "Запрашивает у пользователя ввод целого числа и сохраняет его в переменную.";
        expEn = "Prompts the user to input an integer and stores it in a variable.";
        expKaa = "Paydalanıwshıdan pútin san kiritudi soraydı hám onı ózgeriwshige saqlaydı.";
      } else if (/map\s*\(\s*int\s*,\s*input/.test(trimmed)) {
        expUz = "Bir qatorda kiritilgan bir nechta sonlarni bo'shliq bo'yicha ajratib, sonlarga aylantiradi.";
        expRu = "Считывает несколько чисел, введенных в одной строке через пробел, и преобразует их в числа.";
        expEn = "Reads multiple space-separated integers on a single line and parses them.";
        expKaa = "Bir qatarda kiritilgen bir neshe sanlardı bos orın boyınsha ajıratıp, sanlarǵa aylandıradı.";
      } else {
        expUz = "Foydalanuvchidan matn kiritishni so'raydi.";
        expRu = "Считывает введенную пользователем строку текста.";
        expEn = "Reads a line of text entered by the user.";
        expKaa = "Paydalanıwshıdan tekst kiritudi soraydı.";
      }
    }
    // 2. Output statements
    else if (/^print\s*\(/.test(trimmed)) {
      category = "output";
      expUz = "Natijani konsol ekraniga chop etadi.";
      expRu = "Выводит результат на экран консоли.";
      expEn = "Prints the specified expression or value to standard console output.";
      expKaa = "Nátiyjeni konsol ekranına shıǵaradı.";
    }
    // 3. For Loops
    else if (/^for\s+(\w+)\s+in\s+(.+):$/.test(trimmed)) {
      category = "loop";
      const m = trimmed.match(/^for\s+(\w+)\s+in\s+(.+):$/);
      const varName = m ? m[1] : "element";
      expUz = `'${varName}' o'zgaruvchisi bilan to'plamdagi har bir elementni navbatma-navbat olib aylanadi.`;
      expRu = `Последовательно перебирает каждый элемент коллекции с помощью переменной '${varName}'.`;
      expEn = `Iterates sequentially through each item in the sequence using variable '${varName}'.`;
      expKaa = `'${varName}' ózgeriwshisi menen toplamdaǵı hár bir elementti gezekpe-gezek alıp aylanadı.`;
    }
    // 4. While Loops
    else if (/^while\s+(.+):$/.test(trimmed)) {
      category = "loop";
      expUz = "Ko'rsatilgan shart to'g'ri (True) bo'lib turgangacha ichki kodni qayta-qayta takrorlaydi.";
      expRu = "Повторяет тело цикла до тех пор, пока условие остается истинным (True).";
      expEn = "Executes the enclosed loop block repeatedly as long as the condition evaluates to True.";
      expKaa = "Kórsetilgen shárt durıs (True) bolıp turǵansha ishki kodtı tákirarlaydı.";
    }
    // 5. Conditions
    else if (/^(if|elif|else)\b/.test(trimmed)) {
      category = "condition";
      if (trimmed.startsWith("if")) {
        expUz = "Agar berilgan shart bajarilsa, uning ichidagi kod blokini ishga tushiradi.";
        expRu = "Проверяет условие: если оно истинно, выполняет вложенный блок кода.";
        expEn = "Evaluates the condition: if true, executes the nested branch.";
        expKaa = "Eger berilgen shárt orınlansa, onıń ishindegi kod blokın iske qosadı.";
      } else if (trimmed.startsWith("elif")) {
        expUz = "Oldingi shart bajarilmagan bo'lsa, yangi muqobil shartni tekshiradi.";
        expRu = "Если предыдущее условие ложно, проверяет альтернативное условие.";
        expEn = "If prior conditions were false, evaluates this alternative branch.";
        expKaa = "Aldınǵı shárt orınlanbaǵan bolsa, jańa qosımsha shártti tekseredi.";
      } else {
        expUz = "Yuqoridagi barcha shartlar bajarilmaganda eng so'nggi zaxira yo'l sifatida ishlaydi.";
        expRu = "Выполняется как ветка по умолчанию, если ни одно из условий выше не сработало.";
        expEn = "Fallback default branch executed when all preceding conditions evaluate to false.";
        expKaa = "Joqarıdaǵı barlıq shártler orınlanbaǵanda sońǵı jol retinde isleydi.";
      }
    }
    // 6. Function definition
    else if (/^def\s+(\w+)\s*\((.*)\):$/.test(trimmed)) {
      category = "function";
      const m = trimmed.match(/^def\s+(\w+)\s*\((.*)\):$/);
      const fnName = m ? m[1] : "funksiya";
      expUz = `'${fnName}' nomli yangi mustaqil funksiyani e'lon qiladi.`;
      expRu = `Объявляет новую функцию с именем '${fnName}'.`;
      expEn = `Declares a reusable function named '${fnName}'.`;
      expKaa = `'${fnName}' atlı jańa funktsiyanı járiyalaǵan.`;
    }
    // 7. Return statement
    else if (/^return\b/.test(trimmed)) {
      category = "function";
      expUz = "Funksiyaning hisoblangan natijasini qaytaradi va funksiya ishini tugatadi.";
      expRu = "Возвращает вычисленный результат и завершает выполнение функции.";
      expEn = "Returns the computed value to the caller and terminates function execution.";
      expKaa = "Funktsiyanıń esaplanǵan nátiyjesin qaytaradı hám jumısın juwmaqlaydı.";
    }
    // 8. Import statement
    else if (/^(import|from)\b/.test(trimmed)) {
      category = "import";
      expUz = "Dasturga qo'shimcha tayyor kutubxona yoki modulni ulaydi.";
      expRu = "Подключает внешнюю библиотеку или модуль для расширения возможностей.";
      expEn = "Imports an external library or standard module into the current namespace.";
      expKaa = "Dastúrge qosımsha tayın kitaphana yamasa moduldi jalǵaydı.";
    }
    // 9. Assignment & Calculations
    else if (/=/.test(trimmed)) {
      category = "assignment";
      expUz = "O'ng tomondagi ifodani hisoblab, chap tomondagi o'zgaruvchi qutisiga saqlaydi.";
      expRu = "Вычисляет выражение справа и сохраняет результат в переменную слева.";
      expEn = "Evaluates the right-hand expression and assigns the result to the target variable.";
      expKaa = "Oń táreptegi ańlatpanı esaplap, shep táreptegi ózgeriwshi qutısına saqlaydı.";
    } else {
      expUz = "Kod qatori bajariladi.";
      expRu = "Выполняется инструкция программы.";
      expEn = "Executes program statement.";
      expKaa = "Kod qatarı orınlanadı.";
    }

    result.push({
      lineNumber: lineNo,
      rawCode: raw,
      explanation: {
        uz: expUz,
        ru: expRu,
        en: expEn,
        kaa: expKaa,
      },
      category,
    });
  }

  return result;
}
