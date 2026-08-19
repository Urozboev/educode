"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, RoundedBox, Stars } from "@react-three/drei";
import * as THREE from "three";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import {
  Play,
  RotateCcw,
  Trophy,
  Coins,
  Zap,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Shield,
} from "lucide-react";
import { useI18n, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/* ================= 3D CYBER DRONE & TUNNEL ================= */

function CyberDrone({ lane }: { lane: number }) {
  // lane: -1 (left), 1 (right)
  const group = useRef<THREE.Group>(null);
  const targetX = lane * 2;

  useFrame((state, delta) => {
    if (!group.current) return;
    // Smooth interpolation towards current lane
    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, targetX, delta * 8);
    // Slight banking tilt
    const tilt = (group.current.position.x - targetX) * 0.3;
    group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, tilt, delta * 8);
    // Idle hover
    group.current.position.y = -0.8 + Math.sin(state.clock.elapsedTime * 6) * 0.05;
  });

  return (
    <group ref={group} position={[0, -0.8, 3]}>
      {/* Central Drone Core */}
      <mesh>
        <octahedronGeometry args={[0.35]} />
        <meshStandardMaterial color="#00D2FF" emissive="#00D2FF" emissiveIntensity={0.5} roughness={0.1} />
      </mesh>

      {/* Jet Thruster Trail */}
      <mesh position={[0, -0.1, 0.4]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.01, 0.3, 16]} />
        <meshBasicMaterial color="#FF5252" />
      </mesh>

      {/* Drone Wings */}
      <mesh position={[0.45, 0, 0.1]}>
        <boxGeometry args={[0.5, 0.04, 0.2]} />
        <meshStandardMaterial color="#6C5CE7" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[-0.45, 0, 0.1]}>
        <boxGeometry args={[0.5, 0.04, 0.2]} />
        <meshStandardMaterial color="#6C5CE7" metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  );
}

function GateMesh({
  zPos,
  leftLabel,
  rightLabel,
}: {
  zPos: number;
  leftLabel: string;
  rightLabel: string;
}) {
  return (
    <group position={[0, 0, zPos]}>
      {/* Left Gate Arch */}
      <mesh position={[-2, 0, 0]}>
        <torusGeometry args={[1.3, 0.08, 16, 32]} />
        <meshStandardMaterial color="#A29BFE" emissive="#6C5CE7" emissiveIntensity={0.8} />
      </mesh>
      <Text
        position={[-2, 0.2, 0]}
        fontSize={0.25}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
        maxWidth={2.2}
      >
        {leftLabel}
      </Text>

      {/* Right Gate Arch */}
      <mesh position={[2, 0, 0]}>
        <torusGeometry args={[1.3, 0.08, 16, 32]} />
        <meshStandardMaterial color="#00E676" emissive="#00E676" emissiveIntensity={0.8} />
      </mesh>
      <Text
        position={[2, 0.2, 0]}
        fontSize={0.25}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
        maxWidth={2.2}
      >
        {rightLabel}
      </Text>
    </group>
  );
}

/* ================= FLIGHT CHALLENGE BANK ================= */
interface FlightGate {
  id: string;
  leftCondition: string;
  rightCondition: string;
  correctLane: -1 | 1; // -1: Left is True, 1: Right is True
}

const GATES_POOL: FlightGate[] = [
  { id: "1", leftCondition: "10 > 5  (True)", rightCondition: "5 == 8  (True)", correctLane: -1 },
  { id: "2", leftCondition: "'py' in 'python'", rightCondition: "'js' in 'python'", correctLane: -1 },
  { id: "3", leftCondition: "4 % 2 == 1", rightCondition: "4 % 2 == 0", correctLane: 1 },
  { id: "4", leftCondition: "len('edu') == 4", rightCondition: "len('code') == 4", correctLane: 1 },
  { id: "5", leftCondition: "type(5) == int", rightCondition: "type(5) == str", correctLane: -1 },
  { id: "6", leftCondition: "bool(0) == True", rightCondition: "bool(1) == True", correctLane: 1 },
  { id: "7", leftCondition: "3 ** 2 == 9", rightCondition: "3 ** 2 == 6", correctLane: -1 },
  { id: "8", leftCondition: "[1, 2][0] == 2", rightCondition: "[1, 2][0] == 1", correctLane: 1 },
  { id: "9", leftCondition: "not False == True", rightCondition: "not True == True", correctLane: -1 },
  { id: "10", leftCondition: "10 // 3 == 3", rightCondition: "10 / 3 == 3", correctLane: -1 },
];

export default function CyberFlight3D() {
  const { locale } = useI18n();
  const supabase = createClient();

  const [gameState, setGameState] = useState<"ready" | "playing" | "gameover">("ready");
  const [lane, setLane] = useState<-1 | 1>(-1); // -1: Left, 1: Right
  const [gateIndex, setGateIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [coinsEarned, setCoinsEarned] = useState(0);
  const [timeLeft, setTimeLeft] = useState(35);

  const activeGate = GATES_POOL[gateIndex % GATES_POOL.length];

  // Steering via keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        setLane(-1);
      } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        setLane(1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Timer & Gate cycle
  useEffect(() => {
    if (gameState !== "playing") return;

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          endGame();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  // Gate check loop
  useEffect(() => {
    if (gameState !== "playing") return;

    const gateTimer = setInterval(() => {
      // Check if player is on correct lane
      if (lane === activeGate.correctLane) {
        // Success
        setScore((s) => s + 50 * (streak + 1));
        setStreak((st) => st + 1);
        setCoinsEarned((c) => c + 3);
        toast.success("To'g'ri darvoza! +50 ball");
      } else {
        // Crash / Wrong gate
        setStreak(0);
        toast.error("Noto'g'ri shart darvozasi! Streak uzildi.");
      }

      setGateIndex((i) => (i + 1) % GATES_POOL.length);
    }, 2800);

    return () => clearInterval(gateTimer);
  }, [gameState, lane, activeGate, streak]);

  const startGame = () => {
    setGameState("playing");
    setScore(0);
    setStreak(0);
    setCoinsEarned(0);
    setTimeLeft(35);
    setGateIndex(0);
  };

  const endGame = async () => {
    setGameState("gameover");
    toast.success(`Parvoz yakunlandi! Jami ball: ${score}`);

    if (coinsEarned > 0) {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          await supabase.rpc("increment_coins", {
            user_id: user.id,
            amount: coinsEarned,
          });
        }
      } catch (_e) {
        /* */
      }
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Top Header Status */}
      <div className="p-4 rounded-2xl bg-surface border border-border flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-neon-cyan/15 text-neon-cyan font-bold">
              3D CYBER FLIGHT
            </span>
            <h3 className="font-display font-bold text-base text-foreground">
              Algoritmik Portal Parvozi
            </h3>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            To&apos;g&apos;ri (True) shart yozilgan darvoza tomonga buriling (Chap / O&apos;ng)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-neon-yellow bg-neon-yellow/10 px-3 py-1.5 rounded-xl border border-neon-yellow/20">
            <Coins className="w-4 h-4" /> +{coinsEarned} coin
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-neon-green bg-neon-green/10 px-3 py-1.5 rounded-xl border border-neon-green/20">
            <Trophy className="w-4 h-4" /> {score} ball
          </div>
          <div className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-card border border-border">
            ⏱️ {timeLeft}s
          </div>
        </div>
      </div>

      {/* 3D Flight Viewport */}
      <div className="h-[480px] rounded-3xl bg-[#060710] border border-border overflow-hidden relative shadow-2xl">
        <Canvas camera={{ position: [0, 1.2, 7], fov: 50 }}>
          <ambientLight intensity={0.6} />
          <pointLight position={[0, 4, 2]} intensity={2} color="#00D2FF" />
          <Stars radius={40} depth={20} count={1200} factor={3} fade speed={3} />

          {/* 3D Cyber Tunnel Grid Floor */}
          <mesh position={[0, -1.2, -10]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[12, 40, 10, 30]} />
            <meshStandardMaterial color="#0c0d1e" wireframe />
          </mesh>

          {/* Cyber Drone */}
          <CyberDrone lane={lane} />

          {/* Approaching Gate Portal */}
          {gameState === "playing" && (
            <GateMesh
              zPos={-4}
              leftLabel={activeGate.leftCondition}
              rightLabel={activeGate.rightCondition}
            />
          )}
        </Canvas>

        {/* Ready / Game Over Overlays */}
        {gameState !== "playing" && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-neon-cyan/20 text-neon-cyan flex items-center justify-center mb-4 text-2xl shadow-lg shadow-neon-cyan/30 animate-pulse">
              🚀
            </div>
            <h3 className="font-display font-bold text-2xl text-foreground mb-2">
              {gameState === "gameover" ? "Parvoz Yakunlandi!" : "3D Cyber Flight"}
            </h3>
            <p className="text-sm text-muted-foreground max-w-md mb-6">
              {gameState === "gameover"
                ? `Siz to'plagan yakuniy ball: ${score} ball va ${coinsEarned} coin!`
                : "Dronni boshqaring: har safar ekranda ikkita dasturlash sharti chiqadi. Shulardan qaysi biri True bo'lsa, o'sha darvoza tomonga o'ting!"}
            </p>

            <button
              onClick={startGame}
              className="btn-primary py-3 px-8 text-sm font-bold flex items-center gap-2 shadow-xl shadow-neon-cyan/30"
            >
              <Play className="w-4 h-4 fill-current" />
              {gameState === "gameover" ? "Qayta Uchish" : "Boshlash"}
            </button>
          </div>
        )}

        {/* Interactive Steering Buttons for Mobile & Mouse */}
        {gameState === "playing" && (
          <div className="absolute bottom-6 inset-x-0 flex items-center justify-center gap-6 px-4">
            <button
              onClick={() => setLane(-1)}
              className={cn(
                "py-3.5 px-6 rounded-2xl border text-sm font-bold flex items-center gap-2 transition active:scale-95 backdrop-blur-md",
                lane === -1
                  ? "bg-neon-cyan/25 border-neon-cyan text-white shadow-lg shadow-neon-cyan/30"
                  : "bg-black/60 border-white/10 text-white/70 hover:bg-black/80"
              )}
            >
              <ArrowLeft className="w-4 h-4" /> Chap Darvoza (A)
            </button>

            <button
              onClick={() => setLane(1)}
              className={cn(
                "py-3.5 px-6 rounded-2xl border text-sm font-bold flex items-center gap-2 transition active:scale-95 backdrop-blur-md",
                lane === 1
                  ? "bg-neon-green/25 border-neon-green text-white shadow-lg shadow-neon-green/30"
                  : "bg-black/60 border-white/10 text-white/70 hover:bg-black/80"
              )}
            >
              O&apos;ng Darvoza (D) <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
