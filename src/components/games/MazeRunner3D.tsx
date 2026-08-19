"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import {
  RotateCcw,
  Trophy,
  Coins,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Flag,
  Bot,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n, type Locale } from "@/lib/i18n";

/* ================= 3D TILES & MODELS ================= */

function RobotMesh({
  position,
  rotation,
}: {
  position: [number, number, number];
  rotation: number;
}) {
  const group = useRef<THREE.Group>(null);
  const curPos = useRef(new THREE.Vector3(position[0], position[1], position[2]));
  const curRot = useRef(rotation);

  useFrame((state, delta) => {
    if (!group.current) return;
    // Smooth lerp to target position
    curPos.current.x = THREE.MathUtils.lerp(curPos.current.x, position[0], delta * 12);
    curPos.current.z = THREE.MathUtils.lerp(curPos.current.z, position[2], delta * 12);
    curRot.current = THREE.MathUtils.lerp(curRot.current, rotation, delta * 10);

    group.current.position.x = curPos.current.x;
    group.current.position.z = curPos.current.z;
    // Little jump bob while moving
    group.current.position.y =
      position[1] + Math.sin(state.clock.elapsedTime * 5) * 0.05 + 0.2;
    group.current.rotation.y = curRot.current;
  });

  return (
    <group ref={group} position={position}>
      {/* Robot Body */}
      <mesh position={[0, 0.35, 0]}>
        <boxGeometry args={[0.6, 0.55, 0.6]} />
        <meshStandardMaterial color="#6C5CE7" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Robot Head */}
      <mesh position={[0, 0.75, 0]}>
        <boxGeometry args={[0.45, 0.35, 0.45]} />
        <meshStandardMaterial color="#A29BFE" roughness={0.2} metalness={0.8} />
      </mesh>

      {/* Glowing Eyes */}
      <mesh position={[0.12, 0.78, 0.24]}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshBasicMaterial color="#00E676" />
      </mesh>
      <mesh position={[-0.12, 0.78, 0.24]}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshBasicMaterial color="#00E676" />
      </mesh>

      {/* Antenna */}
      <mesh position={[0, 1.0, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.2]} />
        <meshBasicMaterial color="#FFD600" />
      </mesh>
      <mesh position={[0, 1.12, 0]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshBasicMaterial color="#FF5252" />
      </mesh>
    </group>
  );
}

function CoinMesh({ position }: { position: [number, number, number] }) {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((state, delta) => {
    if (mesh.current) {
      mesh.current.rotation.y += delta * 3;
      mesh.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 4) * 0.08 + 0.3;
    }
  });

  return (
    <mesh ref={mesh} position={position}>
      <cylinderGeometry args={[0.22, 0.22, 0.06, 24]} />
      <meshStandardMaterial
        color="#FFD600"
        emissive="#FFD600"
        emissiveIntensity={0.5}
        metalness={0.9}
        roughness={0.1}
      />
    </mesh>
  );
}

function ExitPortalMesh({ position }: { position: [number, number, number] }) {
  const flag = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (flag.current) {
      flag.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.2;
    }
  });

  return (
    <group position={position}>
      {/* Base Landing Pad */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.48, 0.48, 0.1, 32]} />
        <meshStandardMaterial color="#00E676" emissive="#00E676" emissiveIntensity={0.4} />
      </mesh>
      {/* Flag Pole */}
      <group ref={flag} position={[0, 0.1, 0]}>
        <mesh position={[0, 0.6, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 1.2]} />
          <meshStandardMaterial color="#FFFFFF" metalness={0.8} />
        </mesh>
        {/* Flag Cloth */}
        <mesh position={[0.25, 1.0, 0]}>
          <boxGeometry args={[0.5, 0.3, 0.02]} />
          <meshStandardMaterial color="#00E676" emissive="#00E676" emissiveIntensity={0.6} />
        </mesh>
      </group>
    </group>
  );
}

function WallMesh({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={[position[0], 0.45, position[2]]}>
      <boxGeometry args={[0.95, 0.9, 0.95]} />
      <meshStandardMaterial color="#1A1C30" roughness={0.4} metalness={0.6} />
    </mesh>
  );
}

function FloorTile({
  position,
  isPath,
}: {
  position: [number, number, number];
  isPath: boolean;
}) {
  return (
    <mesh position={[position[0], 0, position[2]]}>
      <boxGeometry args={[0.98, 0.08, 0.98]} />
      <meshStandardMaterial
        color={isPath ? "#12142B" : "#080914"}
        roughness={0.8}
      />
    </mesh>
  );
}

/* ================= LEVELS CONFIG ================= */
interface MazeLevel {
  title: Record<Locale, string>;
  subtitle: Record<Locale, string>;
  grid: number[][]; // 0: path, 1: wall, 2: coin, 3: exit
  start: [number, number]; // [row, col]
}

const MAZE_LEVELS: MazeLevel[] = [
  {
    title: {
      uz: "1-bosqich: To'g'ri Yo'l",
      ru: "Уровень 1: Прямой путь",
      en: "Level 1: Straight Walk",
      kaa: "1-basqısh: Tuwrı jol",
    },
    subtitle: {
      uz: "Klaviatura tugmalari yoki pastdagi ko'rsatkichlar bilan robotni yashil bayroqqa olib boring.",
      ru: "Управляйте роботом с клавиатуры или стрелками на экране до зеленого флага.",
      en: "Steer the robot to the green flag using arrow keys or on-screen buttons.",
      kaa: "Klaviatura yamasa tómendegi kórsetkishler menen robotqa jol kórsetiń.",
    },
    grid: [
      [1, 1, 1, 1, 1, 1, 1],
      [1, 0, 2, 0, 2, 3, 1],
      [1, 1, 1, 1, 1, 1, 1],
    ],
    start: [1, 1],
  },
  {
    title: {
      uz: "2-bosqich: Burilishli Yo'l",
      ru: "Уровень 2: Повороты",
      en: "Level 2: Turning Path",
      kaa: "2-basqısh: Burılıslar",
    },
    subtitle: {
      uz: "Barcha tangalarni yig'ing va marraga yeting.",
      ru: "Соберите все монеты и доберитесь до финиша.",
      en: "Collect all coins along the way and reach the goal.",
      kaa: "Barlıq teńgelerdi jıynań hám márege jetiń.",
    },
    grid: [
      [1, 1, 1, 1, 1, 1],
      [1, 0, 2, 1, 1, 1],
      [1, 1, 0, 2, 0, 1],
      [1, 1, 1, 1, 3, 1],
      [1, 1, 1, 1, 1, 1],
    ],
    start: [1, 1],
  },
  {
    title: {
      uz: "3-bosqich: Mini Labirint",
      ru: "Уровень 3: Мини-Лабиринт",
      en: "Level 3: Mini Maze",
      kaa: "3-basqısh: Mini Labirint",
    },
    subtitle: {
      uz: "To'g'ri yo'lni tanlab, devorlar orasidan chiqish eshigini toping.",
      ru: "Найдите правильный путь через стены к выходу.",
      en: "Find the correct path through the walls to the exit.",
      kaa: "Durıs joldı tańlap, qapıǵa jetip barıń.",
    },
    grid: [
      [1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 1, 2, 3, 1],
      [1, 1, 2, 0, 0, 1, 1],
      [1, 1, 1, 1, 0, 2, 1],
      [1, 1, 1, 1, 1, 1, 1],
    ],
    start: [1, 1],
  },
];

export default function MazeRunner3D() {
  const { locale } = useI18n();
  const supabase = createClient();

  const [levelIdx, setLevelIdx] = useState(0);
  const [robotPos, setRobotPos] = useState<[number, number]>([1, 1]);
  const [robotRot, setRobotRot] = useState<number>(0);
  const [collectedCoins, setCollectedCoins] = useState<Set<string>>(new Set());
  const [stepsCount, setStepsCount] = useState(0);
  const [totalCoinsEarned, setTotalCoinsEarned] = useState(0);
  const [score, setScore] = useState(0);
  const [levelWon, setLevelWon] = useState(false);

  const level = MAZE_LEVELS[levelIdx % MAZE_LEVELS.length];

  // Initialize level
  const resetLevel = useCallback(() => {
    setRobotPos(level.start);
    setRobotRot(0);
    setCollectedCoins(new Set());
    setStepsCount(0);
    setLevelWon(false);
  }, [level]);

  useEffect(() => {
    resetLevel();
  }, [levelIdx, resetLevel]);

  // Move in direction: dr, dc
  const move = useCallback(
    (dr: number, dc: number, targetAngle: number) => {
      if (levelWon) return;

      setRobotRot(targetAngle);
      const [r, c] = robotPos;
      const nextR = r + dr;
      const nextC = c + dc;

      // Check boundary & walls
      if (
        nextR < 0 ||
        nextR >= level.grid.length ||
        nextC < 0 ||
        nextC >= level.grid[0].length ||
        level.grid[nextR][nextC] === 1
      ) {
        return; // blocked by wall
      }

      setRobotPos([nextR, nextC]);
      setStepsCount((s) => s + 1);

      // Collect Coin
      if (level.grid[nextR][nextC] === 2) {
        const key = `${nextR},${nextC}`;
        if (!collectedCoins.has(key)) {
          const nextSet = new Set(collectedCoins);
          nextSet.add(key);
          setCollectedCoins(nextSet);
          setScore((sc) => sc + 25);
          setTotalCoinsEarned((tc) => tc + 1);
          toast.success("+1 tanga yig'ildi! 🪙");
        }
      }

      // Check Exit Flag
      if (level.grid[nextR][nextC] === 3) {
        setLevelWon(true);
        const bonus = 10;
        setScore((sc) => sc + 100);
        setTotalCoinsEarned((tc) => tc + bonus);
        toast.success(`Bosqich yakunlandi! +${bonus} coin 🎉`);

        try {
          supabase.auth.getUser().then(({ data: { user } }) => {
            if (user) {
              supabase.rpc("increment_coins", {
                user_id: user.id,
                amount: bonus,
              });
            }
          });
        } catch (_err) {
          /* */
        }
      }
    },
    [robotPos, level, levelWon, collectedCoins, supabase]
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") {
        e.preventDefault();
        move(-1, 0, Math.PI); // Up (North)
      } else if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") {
        e.preventDefault();
        move(1, 0, 0); // Down (South)
      } else if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        e.preventDefault();
        move(0, -1, -Math.PI / 2); // Left (West)
      } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        e.preventDefault();
        move(0, 1, Math.PI / 2); // Right (East)
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [move]);

  const handleNextLevel = () => {
    if (levelIdx < MAZE_LEVELS.length - 1) {
      setLevelIdx((i) => i + 1);
    } else {
      toast.success("Barcha labirint bosqichlari yakunlandi! 🏆");
      setLevelIdx(0);
    }
  };

  // Convert 2D cell to centered 3D position
  const rows = level.grid.length;
  const cols = level.grid[0].length;
  const get3DCoords = (r: number, c: number): [number, number, number] => {
    return [(c - cols / 2 + 0.5) * 1.05, 0, (r - rows / 2 + 0.5) * 1.05];
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header Info */}
      <div className="p-4 rounded-2xl bg-surface border border-border flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-neon-yellow/15 text-neon-yellow font-bold">
              3D LABIRINT
            </span>
            <h3 className="font-display font-bold text-base text-foreground">
              {level.title[locale] || level.title.uz}
            </h3>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {level.subtitle[locale] || level.subtitle.uz}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-neon-yellow bg-neon-yellow/10 px-3 py-1.5 rounded-xl border border-neon-yellow/20">
            <Coins className="w-4 h-4" /> +{totalCoinsEarned} coin
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-neon-green bg-neon-green/10 px-3 py-1.5 rounded-xl border border-neon-green/20">
            <Trophy className="w-4 h-4" /> {score} ball
          </div>
          <button
            onClick={resetLevel}
            className="p-2 rounded-xl bg-card border border-border hover:bg-surface text-muted-foreground hover:text-foreground transition"
            title="Qayta boshlash"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main 3D Stage & Control Box */}
      <div className="grid lg:grid-cols-12 gap-4">
        {/* 3D Scene Viewport */}
        <div className="lg:col-span-8 h-[440px] rounded-3xl bg-[#070814] border border-border overflow-hidden relative shadow-2xl">
          <Canvas camera={{ position: [0, 5.5, 4.8], fov: 45 }}>
            <ambientLight intensity={0.7} />
            <pointLight position={[0, 8, 4]} intensity={1.8} color="#A29BFE" />
            <directionalLight position={[-4, 6, -3]} intensity={1} color="#00D2FF" />
            <Stars radius={40} depth={20} count={900} factor={3} fade speed={1} />

            {/* Grid Rendering */}
            {level.grid.map((row, r) =>
              row.map((cell, c) => {
                const [x, , z] = get3DCoords(r, c);
                const isWall = cell === 1;
                const isCoin = cell === 2 && !collectedCoins.has(`${r},${c}`);
                const isExit = cell === 3;

                return (
                  <group key={`${r}-${c}`}>
                    <FloorTile position={[x, 0, z]} isPath={!isWall} />
                    {isWall && <WallMesh position={[x, 0, z]} />}
                    {isCoin && <CoinMesh position={[x, 0, z]} />}
                    {isExit && <ExitPortalMesh position={[x, 0, z]} />}
                  </group>
                );
              })
            )}

            {/* 3D Robot */}
            <RobotMesh
              position={get3DCoords(robotPos[0], robotPos[1])}
              rotation={robotRot}
            />
          </Canvas>

          {/* Quick HUD overlay */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <div className="text-xs font-mono bg-black/60 px-3 py-1.5 rounded-xl border border-white/10 text-white/80 backdrop-blur-md flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5 text-neon-purple" />
              <span>Qadamlar: {stepsCount}</span>
            </div>
            <div className="text-xs font-mono bg-black/60 px-3 py-1.5 rounded-xl border border-white/10 text-white/80 backdrop-blur-md flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-neon-yellow" />
              <span>Tangalar: {collectedCoins.size}</span>
            </div>
          </div>

          {/* Victory Modal */}
          {levelWon && (
            <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-300">
              <div className="w-16 h-16 rounded-2xl bg-neon-green/20 text-neon-green flex items-center justify-center text-3xl mb-3 shadow-lg shadow-neon-green/30">
                🎉
              </div>
              <h3 className="font-display font-bold text-2xl text-foreground mb-1">
                G&apos;alaba! Marraga yetib kelindi!
              </h3>
              <p className="text-xs text-muted-foreground mb-6">
                Siz labirintni {stepsCount} ta qadamda bosib o&apos;tdingiz.
              </p>

              <button
                onClick={handleNextLevel}
                className="btn-primary py-3 px-8 text-sm font-bold flex items-center gap-2 shadow-xl shadow-neon-green/30"
              >
                <CheckCircle2 className="w-4 h-4" />
                Keyingi Bosqich
              </button>
            </div>
          )}
        </div>

        {/* Intuitive D-Pad Controller */}
        <div className="lg:col-span-4 rounded-3xl bg-card border border-border p-5 flex flex-col items-center justify-between">
          <div className="w-full text-center space-y-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Boshqaruv tugmalari
            </h4>
            <p className="text-[11px] text-muted-foreground">
              Klaviatura strelkalari yoki ekrandagi tugmalar orqali yuring
            </p>
          </div>

          {/* D-Pad Buttons */}
          <div className="my-6 grid grid-cols-3 gap-2.5 w-[200px]">
            <div />
            <button
              onClick={() => move(-1, 0, Math.PI)}
              className="w-14 h-14 rounded-2xl bg-surface border border-border hover:border-neon-purple hover:bg-neon-purple/10 flex items-center justify-center text-foreground transition active:scale-90 shadow-md"
              title="Yuqoriga (W)"
            >
              <ArrowUp className="w-6 h-6 text-neon-purple" />
            </button>
            <div />

            <button
              onClick={() => move(0, -1, -Math.PI / 2)}
              className="w-14 h-14 rounded-2xl bg-surface border border-border hover:border-neon-blue hover:bg-neon-blue/10 flex items-center justify-center text-foreground transition active:scale-90 shadow-md"
              title="Chapga (A)"
            >
              <ArrowLeft className="w-6 h-6 text-neon-blue" />
            </button>

            <button
              onClick={() => move(1, 0, 0)}
              className="w-14 h-14 rounded-2xl bg-surface border border-border hover:border-neon-yellow hover:bg-neon-yellow/10 flex items-center justify-center text-foreground transition active:scale-90 shadow-md"
              title="Pastga (S)"
            >
              <ArrowDown className="w-6 h-6 text-neon-yellow" />
            </button>

            <button
              onClick={() => move(0, 1, Math.PI / 2)}
              className="w-14 h-14 rounded-2xl bg-surface border border-border hover:border-neon-green hover:bg-neon-green/10 flex items-center justify-center text-foreground transition active:scale-90 shadow-md"
              title="O'ngga (D)"
            >
              <ArrowRight className="w-6 h-6 text-neon-green" />
            </button>
          </div>

          {/* Quick instructions */}
          <div className="w-full p-3 rounded-xl bg-surface/50 border border-border text-[11px] text-muted-foreground flex items-center justify-between">
            <span>🎯 Maqsad:</span>
            <span className="font-bold text-neon-green flex items-center gap-1">
              <Flag className="w-3.5 h-3.5" /> Yashil bayroq
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
