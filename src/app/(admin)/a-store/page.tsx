import type { Metadata } from "next";
import StoreManager from "@/components/store/StoreManager";
import { getServerDictionary } from "@/lib/i18n/server";

// Statik `metadata` obyekti lug'atga kira olmaydi — u modul yuklanganda
// hisoblanadi, til esa so'rov sarlavhasidan keladi. Shuning uchun
// `generateMetadata` ishlatiladi.
export async function generateMetadata(): Promise<Metadata> {
  const t = await getServerDictionary();
  return {
    title: t.admin.storeTitle,
    description: t.admin.abt.storeSubtitle2,
  };
}

export default function AdminStorePage() {
  return <StoreManager scope="admin" />;
}
