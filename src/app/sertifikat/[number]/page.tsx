"use client";

import { useParams } from "next/navigation";
import { VerifyView } from "@/components/certificate/VerifyView";

export default function Page() {
  const { number } = useParams<{ number: string }>();
  return <VerifyView number={decodeURIComponent(number || "")} />;
}
