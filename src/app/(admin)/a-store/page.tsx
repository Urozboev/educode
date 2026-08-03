import StoreManager from "@/components/store/StoreManager";

export const metadata = {
  title: "Do'kon boshqaruvi",
  description: "Platforma sovg'alari va barcha buyurtmalar",
};

export default function AdminStorePage() {
  return <StoreManager scope="admin" />;
}
