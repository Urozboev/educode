import StoreManager from "@/components/store/StoreManager";

export const metadata = {
  title: "Mening sovg'alarim",
  description: "O'quvchilaringiz uchun sovg'a qo'shing va buyurtmalarni boshqaring",
};

export default function TeacherStorePage() {
  return <StoreManager scope="teacher" />;
}
