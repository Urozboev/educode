import type { Metadata } from "next";
import { NotFoundView } from "@/components/ui/NotFoundView";

export const metadata: Metadata = {
  title: "Sahifa topilmadi",
  description: "Bu manzilda sahifa yöq. Boş sahifadan yoki kurslar röyxatidan davom eting.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return <NotFoundView />;
}
