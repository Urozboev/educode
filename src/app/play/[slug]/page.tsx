"use client";

import { useParams } from "next/navigation";
import { GamePlayer } from "@/components/games/lesson/GamePlayer";

export default function Page() {
  const { slug } = useParams<{ slug: string }>();
  return <GamePlayer slug={slug} />;
}
