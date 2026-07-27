import type { MethodGroupSize, MethodStage } from "@/types";

/**
 * Metod ma'lumotnomalari — admin formasi va ommaviy sahifa uchun umumiy.
 * (Next.js page fayllaridan qo'shimcha eksport qilish mumkin emas.)
 */

export const GROUP_SIZES: { value: MethodGroupSize; label: string }[] = [
  { value: "individual", label: "Yakka tartibda" },
  { value: "small", label: "Kichik guruh (2-6)" },
  { value: "class", label: "Butun sinf (10-30)" },
  { value: "any", label: "Har qanday" },
];

export const STAGES: { value: MethodStage; label: string; hint: string }[] = [
  { value: "warmup", label: "Kirish", hint: "Qiziqish uyg'otish, mavzuga kirish" },
  { value: "explain", label: "Bayon", hint: "Yangi materialni tushuntirish" },
  { value: "practice", label: "Mustahkamlash", hint: "Amaliy mashq va takrorlash" },
  { value: "assess", label: "Baholash", hint: "O'zlashtirishni tekshirish" },
  { value: "reflect", label: "Refleksiya", hint: "Xulosa va o'z-o'zini baholash" },
];

export const groupSizeLabel = (v: MethodGroupSize) =>
  GROUP_SIZES.find(g => g.value === v)?.label ?? v;

export const stageLabel = (v: MethodStage) =>
  STAGES.find(s => s.value === v)?.label ?? v;
