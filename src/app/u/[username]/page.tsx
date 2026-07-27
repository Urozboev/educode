"use client";

import { useParams } from "next/navigation";
import { PortfolioView } from "@/components/portfolio/PortfolioView";

export default function Page() {
  const { username } = useParams<{ username: string }>();
  return <PortfolioView username={username} />;
}
