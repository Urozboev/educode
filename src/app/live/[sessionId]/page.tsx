"use client";

import { useParams } from "next/navigation";
import { PlayerScreen } from "@/components/games/live/PlayerScreen";

export default function Page() {
  const { sessionId } = useParams<{ sessionId: string }>();
  return <PlayerScreen sessionId={sessionId} />;
}
