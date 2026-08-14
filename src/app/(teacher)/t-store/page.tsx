import type { Metadata } from "next";
import StoreManager from "@/components/store/StoreManager";
import { getServerDictionary } from "@/lib/i18n/server";

// Statik `metadata` lug'atga kira olmaydi — u modul yuklanganda
// hisoblanadi, til esa so'rov sarlavhasidan keladi.
export async function generateMetadata(): Promise<Metadata> {
  const t = await getServerDictionary();
  return {
    title: t.teacher.myGifts,
    description: t.teacher.storeSubtitle,
  };
}

export default function TeacherStorePage() {
  return <StoreManager scope="teacher" />;
}
