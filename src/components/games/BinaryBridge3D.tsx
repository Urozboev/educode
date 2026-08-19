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
  CheckCircle2,
  Sparkles,
  Layers,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n, type Locale } from "@/lib/i18n";

/* ================= 3D BIT CUBE ================= */

function BitCube({
  value,
  bitIndex,
  isActive,
  onToggle,
}: {
  value: number; // 128, 64, 32, 16, 8, 4, 2, 1
  bitIndex: number;
  isActive: boolean;
  onToggle: () => void;
}) {
  const mesh = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // Position from left to right: bit 7 (128) to bit 0 (1)
  const xPos = (3.5 - bitIndex) * 1.05;
  const targetY = isActive ? 0.3 : -0.3;

  useFrame((state, delta) => {
    if (!mesh.current) return;
    mesh.current.position.y = THREE.MathUtils.lerp(
      mesh.current.position.y,
      targetY,
      delta * 8
    );
    // Subtle float
    mesh.current.position.y += Math.sin(state.clock.elapsedTime * 3 + bitIndex) * 0.02;
  });

  return (
    <group
      ref={mesh}
      position={[xPos, targetY, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* 3D Box Block */}
      <mesh>
        <boxGeometry args={[0.85, 0.85, 0.85]} />
        <meshStandardMaterial
          color={isActive ? "#00E676" : hovered ? "#2D3748" : "#1A202C"}
          emissive={isActive ? "#00E676" : "#000000"}
          emissiveIntensity={isActive ? 0.6 : 0}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Bit State Label (0 or 1) */}
      <Text
        position={[0, 0, 0.44]}
        fontSize={0.4}
        color={isActive ? "#FFFFFF" : "#718096"}
        anchorX="center"
        anchorY="middle"
      >
        {isActive ? "1" : "0"}
      </Text>

      {/* Power Value Label (e.g. 128, 64, 32...) */}
      <Text
        position={[0, -0.65, 0]}
        fontSize={0.22}
        color={isActive ? "#00E676" : "#A0AEC0"}
        anchorX="center"
        anchorY="middle"
      >
        {value.toString()}
      </Text>
    </group>
  );
}

function SpaceStationPlatform() {
  return (
    <group position={[0, -1, 0]}>
      {/* Base Grid */}
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[10, 0.2, 3]} />
        <meshStandardMaterial color="#0D1117" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Neon Runway Lines */}
      <mesh position={[0, 0.02, 1.2]}>
        <boxGeometry args={[9.5, 0.02, 0.05]} />
        <meshBasicMaterial color="#6C5CE7" />
      </mesh>
      <mesh position={[0, 0.02, -1.2]}>
        <boxGeometry args={[9.5, 0.02, 0.05]} />
        <meshBasicMaterial color="#00D2FF" />
      </mesh>
    </group>
  );
}

/* ================= LEVEL DATA ================= */
interface BinaryTarget {
  targetNumber: number;
  label: string;
}

const TARGETS: BinaryTarget[] = [
  { targetNumber: 5, label: "5 (00000101)" },
  { targetNumber: 12, label: "12 (00001100)" },
  { targetNumber: 42, label: "42 (00101010)" },
  { targetNumber: 85, label: "85 (01010101)" },
  { targetNumber: 130, label: "130 (10000010)" },
  { targetNumber: 170, label: "170 (10101010)" },
  { targetNumber: 200, label: "200 (11001000)" },
  { targetNumber: 255, label: "255 (11111111)" },
];

const BIT_VALUES = [128, 64, 32, 16, 8, 4, 2, 1];

export default function BinaryBridge3D() {
  const { locale } = useI18n();
  const supabase = createClient();

  const [currentIdx, setCurrentIdx] = useState(0);
  const [activeBits, setActiveBits] = useState<boolean[]>([false, false, false, false, false, false, false, false]);
  const [score, setScore] = useState(0);
  const [coinsEarned, setCoinsEarned] = useState(0);
  const [bridgeCompleted, setBridgeCompleted] = useState(false);

  const target = TARGETS[currentIdx % TARGETS.length];

  // Calculate current sum from active bits
  const currentSum = useMemo(() => {
    return activeBits.reduce((acc, active, idx) => {
      return active ? acc + BIT_VALUES[idx] : acc;
    }, 0);
  }, [activeBits]);

  // Toggle single bit
  const handleToggleBit = (idx: number) => {
    if (bridgeCompleted) return;
    setActiveBits((prev) => {
      const next = [...prev];
      next[idx] = !next[idx];
      return next;
    });
  };

  // Check if target is achieved
  useEffect(() => {
    if (currentSum === target.targetNumber && !bridgeCompleted) {
      setBridgeCompleted(true);
      const bonus = 10;
      setScore((s) => s + 100);
      setCoinsEarned((c) => c + bonus);
      toast.success(`Ko'prik qurildi! +100 ball (+${bonus} coin) 🎉`);

      // Award coins in DB
      try {
        supabase.auth.getUser().then(({ data: { user } }) => {
          if (user) {
            supabase.rpc("increment_coins", {
              user_id: user.id,
              amount: bonus,
            });
          }
        });
      } catch (_e) {
        /* */
      }

      // Next level after brief animation
      setTimeout(() => {
        setCurrentIdx((i) => (i + 1) % TARGETS.length);
        setActiveBits([false, false, false, false, false, false, false, false]);
        setBridgeCompleted(false);
      }, 1500);
    }
  }, [currentSum, target, bridgeCompleted, supabase]);

  const resetBits = () => {
    setActiveBits([false, false, false, false, false, false, false, false]);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header Info */}
      <div className="p-4 rounded-2xl bg-surface border border-border flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-neon-purple/15 text-neon-purple font-bold">
              3D BINARY BRIDGE
            </span>
            <h3 className="font-display font-bold text-base text-foreground">
              Kosmik Bitlar Ko&apos;prigi
            </h3>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            3D kubiklarni bosib <code className="text-neon-cyan font-bold">1</code> (Yoqilgan) holatiga o&apos;tkazing va berilgan songa tenglang.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-neon-yellow bg-neon-yellow/10 px-3 py-1.5 rounded-xl border border-neon-yellow/20">
            <Coins className="w-4 h-4" /> +{coinsEarned} coin
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-neon-green bg-neon-green/10 px-3 py-1.5 rounded-xl border border-neon-green/20">
            <Trophy className="w-4 h-4" /> {score} ball
          </div>
        </div>
      </div>

      {/* Target Mission HUD Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-neon-purple/10 via-neon-cyan/10 to-transparent border border-neon-purple/30 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-neon-purple/20 text-neon-purple flex items-center justify-center font-display font-bold text-xl">
            {target.targetNumber}
          </div>
          <div>
            <div className="text-[11px] font-mono text-muted-foreground uppercase">
              Hosil qilinishi kerak bo&apos;lgan son (Target):
            </div>
            <div className="font-display font-bold text-lg text-foreground flex items-center gap-2">
              <span>{target.targetNumber}</span>
              <span className="text-xs text-neon-cyan font-mono">
                (O&apos;nlik son)
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-[11px] font-mono text-muted-foreground uppercase">
              Siz to&apos;plagan summa:
            </div>
            <div
              className={cn(
                "font-display font-bold text-xl font-mono",
                currentSum === target.targetNumber
                  ? "text-neon-green"
                  : currentSum > target.targetNumber
                  ? "text-neon-red"
                  : "text-neon-yellow"
              )}
            >
              {currentSum} / {target.targetNumber}
            </div>
          </div>

          <button
            onClick={resetBits}
            className="p-2.5 rounded-xl bg-surface border border-border text-xs font-semibold hover:bg-card text-muted-foreground hover:text-foreground transition"
            title="Qayta boshlash"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3D Viewport */}
      <div className="h-[440px] rounded-3xl bg-[#070814] border border-border overflow-hidden relative shadow-2xl">
        <Canvas camera={{ position: [0, 2.2, 6.5], fov: 48 }}>
          <ambientLight intensity={0.7} />
          <pointLight position={[0, 8, 4]} intensity={2} color="#00E676" />
          <directionalLight position={[-5, 5, 2]} intensity={1.2} color="#6C5CE7" />
          <Stars radius={50} depth={20} count={1000} factor={3} fade speed={1} />

          {/* 3D Space Station */}
          <SpaceStationPlatform />

          {/* 8 Interactive Bit Cubes */}
          {BIT_VALUES.map((val, idx) => (
            <BitCube
              key={val}
              value={val}
              bitIndex={idx}
              isActive={activeBits[idx]}
              onToggle={() => handleToggleBit(idx)}
            />
          ))}
        </Canvas>

        {/* Bridge completed celebratory banner */}
        {bridgeCompleted && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-300">
            <div className="w-14 h-14 rounded-2xl bg-neon-green/20 text-neon-green flex items-center justify-center text-3xl mb-3 shadow-lg shadow-neon-green/30">
              ⚡
            </div>
            <h3 className="font-display font-bold text-2xl text-foreground mb-1">
              Ko&apos;prik Muvaffaqiyatli Qurildi!
            </h3>
            <p className="text-xs text-muted-foreground">
              Keyingi son yuklanmoqda...
            </p>
          </div>
        )}
      </div>

      {/* Quick Binary Hint Footer */}
      <div className="p-3 rounded-xl bg-surface/50 border border-border flex items-center justify-between text-xs text-muted-foreground flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-neon-cyan" />
          <span>
            Maslahat: Har bir bit ikkining darajasidir: <code className="text-foreground font-mono">128 + 64 + 32 + 16 + 8 + 4 + 2 + 1</code>
          </span>
        </div>
        <div className="font-mono text-neon-purple font-bold">
          Byte: {activeBits.map((b) => (b ? "1" : "0")).join("")}
        </div>
      </div>
    </div>
  );
}
