"use client";

import { useParams } from "next/navigation";
import { HostScreen } from "@/components/games/live/HostScreen";

export default function Page() {
  const { sessionId } = useParams<{ sessionId: string }>();
  return <HostScreen sessionId={sessionId} />;
}
