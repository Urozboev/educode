"use client";

import { useParams } from "next/navigation";
import { ContestPage } from "@/components/contests/ContestPage";

export default function Page() {
  const { slug } = useParams<{ slug: string }>();
  return <ContestPage slug={slug} />;
}
