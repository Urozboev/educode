import { redirect } from "next/navigation";

// Farzandlar ro'yxati bosh sahifada ko'rsatiladi
export default function ParentChildrenIndex() {
  redirect("/p-dashboard");
}
