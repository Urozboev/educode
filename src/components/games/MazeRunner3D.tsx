"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox, Stars, Float, Text } from "@react-three/drei";
import * as THREE from "three";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import {
  Play,
  RotateCcw,
  Trophy,
  Coins,
  Zap,
  ArrowUp,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Trash2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
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

  useFrame((state) => {
    if (!group.current) return;
    // Gentle floating bob
    group.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 4) * 0.05;
  });

  return (
    <group ref={group} position={position} rotation={[0, rotation, 0]}>
      {/* Robot Body */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[0.6, 0.6, 0.6]} />
        <meshStandardMaterial color="#6C5CE7" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Robot Head */}
      <mesh position={[0, 0.85, 0]}>
        <boxGeometry args={[0.4, 0.35, 0.4]} />
        <meshStandardMaterial color="#A29BFE" roughness={0.2} metalness={0.9} />
      </mesh>

      {/* Glowing Eyes */}
      <mesh position={[0.1, 0.9, 0.21]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshBasicMaterial color="#00E676" />
      </mesh>
      <mesh position={[-0.1, 0.9, 0.21]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshBasicMaterial color="#00E676" />
      </mesh>

      {/* Antenna */}
      <mesh position={[0, 1.1, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.2]} />
        <meshBasicMaterial color="#FFD600" />
      </mesh>
      <mesh position={[0, 1.22, 0]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshBasicMaterial color="#FF5252" />
      </mesh>
    </group>
  );
}

function GemMesh({ position }: { position: [number, number, number] }) {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((state, delta) => {
    if (mesh.current) {
      mesh.current.rotation.y += delta * 2;
      mesh.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 3) * 0.08;
    }
  });

  return (
    <mesh ref={mesh} position={position}>
      <octahedronGeometry args={[0.25]} />
      <meshStandardMaterial
        color="#00D2FF"
        emissive="#00D2FF"
        emissiveIntensity={0.6}
        roughness={0.1}
      />
    </mesh>
  );
}

function PortalMesh({ position }: { position: [number, number, number] }) {
  const ring = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ring.current) {
      ring.current.rotation.z += delta * 2;
    }
  });

  return (
    <group position={position}>
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.1, 32]} />
        <meshBasicMaterial color="#00E676" opacity={0.5} transparent />
      </mesh>
      <mesh ref={ring} position={[0, 0.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.4, 0.05, 16, 32]} />
        <meshBasicMaterial color="#00E676" />
      </mesh>
    </group>
  );
}

function WallMesh({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position}>
      <boxGeometry args={[0.95, 0.8, 0.95]} />
      <meshStandardMaterial color="#1E1E2F" roughness={0.5} metalness={0.5} />
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
    <mesh position={position}>
      <boxGeometry args={[0.98, 0.1, 0.98]} />
      <meshStandardMaterial
        color={isPath ? "#121324" : "#0A0A14"}
        roughness={0.8}
      />
    </mesh>
  );
}

/* ================= LEVEL DATA ================= */
interface LevelData {
  grid: number[][]; // 0: empty, 1: wall, 2: gem, 3: portal
  start: [number, number]; // [row, col]
  startDir: number; // 0: North, 1: East, 2: South, 3: West
  title: Record<Locale, string>;
  hint: Record<Locale, string>;
}

const LEVELS: LevelData[] = [
  {
    title: {
      uz: "1-bosqich: To'g'ri yo'l",
      ru: "Уровень 1: Прямой путь",
      en: "Level 1: Straight Path",
      kaa: "1-basqısh: Tuwrı jol",
    },
    hint: {
      uz: "3 marta 'Oldinga' buyrug'ini bering va marraga yeting.",
      ru: "Используйте 3 команды 'Вперед' для достижения цели.",
      en: "Use 3 'Forward' commands to reach the destination portal.",
      kaa: "3 márte 'Alǵa' buyrıǵın beriń hám márege jetiń.",
    },
    grid: [
      [1, 1, 1, 1, 1],
      [1, 0, 2, 3, 1],
      [1, 1, 1, 1, 1],
    ],
    start: [1, 1],
    startDir: 1, // East
  },
  {
    title: {
      uz: "2-bosqich: Burilishlar va Kristallar",
      ru: "Уровень 2: Повороты и Кристаллы",
      en: "Level 2: Turns & Crystals",
      kaa: "2-basqısh: Burılıslar hám Kristallar",
    },
    hint: {
      uz: "Kristallni oling, o'ngga buriling va portalga kiring.",
      ru: "Соберите кристалл, поверните направо и войдите в портал.",
      en: "Collect the gem, turn right, and enter the exit portal.",
      kaa: "Kristallı alıń, ońǵa burılıń hám portalǵa kiriń.",
    },
    grid: [
      [1, 1, 1, 1, 1],
      [1, 0, 2, 1, 1],
      [1, 1, 0, 3, 1],
      [1, 1, 1, 1, 1],
    ],
    start: [1, 1],
    startDir: 1,
  },
  {
    title: {
      uz: "3-bosqich: Labirint Zigzagi",
      ru: "Уровень 3: Зигзаг Лабиринта",
      en: "Level 3: Maze Zigzag",
      kaa: "3-basqısh: Labirint Zigzagı",
    },
    hint: {
      uz: "Barcha kristallarni yig'ib to'g'ri marshrutni quring.",
      ru: "Соберите все кристаллы и проложите верный маршрут.",
      en: "Collect all gems and construct the complete algorithm.",
      kaa: "Barlıq kristallardı jıynap durıs marshruttı dúziń.",
    },
    grid: [
      [1, 1, 1, 1, 1, 1],
      [1, 0, 2, 1, 3, 1],
      [1, 1, 0, 0, 2, 1],
      [1, 1, 1, 1, 1, 1],
    ],
    start: [1, 1],
    startDir: 1,
  },
];

type CommandType = "FORWARD" | "TURN_LEFT" | "TURN_RIGHT";

export default function MazeRunner3D() {
  const { locale } = useI18n();
  const supabase = createClient();
  const [levelIdx, setLevelIdx] = useState(0);
  const [commands, setCommands] = useState<CommandType[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [coinsEarned, setCoinsEarned] = useState(0);

  const level = LEVELS[levelIdx];
  const [robotPos, setRobotPos] = useState<[number, number]>(level.start);
  const [robotDir, setRobotDir] = useState<number>(level.startDir);
  const [gemsCollected, setGemsCollected] = useState<Set<string>>(new Set());

  // Reset state on level change
  useEffect(() => {
    setRobotPos(level.start);
    setRobotDir(level.startDir);
    setCommands([]);
    setGemsCollected(new Set());
    setIsRunning(false);
  }, [levelIdx, level]);

  const addCommand = (cmd: CommandType) => {
    if (commands.length < 15 && !isRunning) {
      setCommands((prev) => [...prev, cmd]);
    }
  };

  const removeCommand = (idx: number) => {
    if (!isRunning) {
      setCommands((prev) => prev.filter((_, i) => i !== idx));
    }
  };

  const clearCommands = () => {
    if (!isRunning) {
      setCommands([]);
    }
  };

  // Run the algorithm step-by-step
  const handleRun = async () => {
    if (commands.length === 0 || isRunning) return;
    setIsRunning(true);

    let curR = level.start[0];
    let curC = level.start[1];
    let curDir = level.startDir;
    const collected = new Set<string>();

    setRobotPos([curR, curC]);
    setRobotDir(curDir);

    // Direction offsets: 0: North (-r), 1: East (+c), 2: South (+r), 3: West (-c)
    const dr = [-1, 0, 1, 0];
    const dc = [0, 1, 0, -1];

    for (let step = 0; step < commands.length; step++) {
      await new Promise((r) => setTimeout(r, 600));
      const cmd = commands[step];

      if (cmd === "TURN_LEFT") {
        curDir = (curDir + 3) % 4;
        setRobotDir(curDir);
      } else if (cmd === "TURN_RIGHT") {
        curDir = (curDir + 1) % 4;
        setRobotDir(curDir);
      } else if (cmd === "FORWARD") {
        const nextR = curR + dr[curDir];
        const nextC = curC + dc[curDir];

        // Check bounds & walls
        if (
          nextR < 0 ||
          nextR >= level.grid.length ||
          nextC < 0 ||
          nextC >= level.grid[0].length ||
          level.grid[nextR][nextC] === 1
        ) {
          toast.error("To'siqqa urildingiz! Algoritmni tekshiring.");
          setIsRunning(false);
          return;
        }

        curR = nextR;
        curC = nextC;
        setRobotPos([curR, curC]);

        // Check Gem
        if (level.grid[curR][curC] === 2) {
          collected.add(`${curR},${curC}`);
          setGemsCollected(new Set(collected));
        }

        // Check Portal (Goal)
        if (level.grid[curR][curC] === 3) {
          await new Promise((r) => setTimeout(r, 400));
          const bonus = 15;
          setScore((s) => s + 100);
          setCoinsEarned((c) => c + bonus);
          toast.success(`Tabriklaymiz! Bosqich yakunlandi! +${bonus} coin 🎉`);

          // Award coins in DB
          try {
            const {
              data: { user },
            } = await supabase.auth.getUser();
            if (user) {
              await supabase.rpc("increment_coins", {
                user_id: user.id,
                amount: bonus,
              });
            }
          } catch (_e) {
            /* */
          }

          if (levelIdx < LEVELS.length - 1) {
            setLevelIdx((i) => i + 1);
          } else {
            toast.success("Barcha 3D labirint bosqichlari muvaffaqiyatli yakunlandi!");
          }
          setIsRunning(false);
          return;
        }
      }
    }

    toast.info("Buyruqlar tugadi, lekin marraga yetib bormadingiz.");
    setIsRunning(false);
  };

  // Convert row, col to 3D coords centered on screen
  const rows = level.grid.length;
  const cols = level.grid[0].length;
  const get3DPos = (r: number, c: number, y = 0): [number, number, number] => {
    return [(c - cols / 2 + 0.5) * 1.1, y, (r - rows / 2 + 0.5) * 1.1];
  };

  // Direction to radians
  const dirAngles = [Math.PI, -Math.PI / 2, 0, Math.PI / 2];

  return (
    <div className="flex flex-col gap-4">
      {/* Top Level Bar */}
      <div className="p-4 rounded-2xl bg-surface border border-border flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-neon-yellow/15 text-neon-yellow font-bold">
              3D LABIRINT
            </span>
            <h3 className="font-display font-bold text-base text-foreground">
              {level.title[locale] || level.title.uz}
            </h3>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {level.hint[locale] || level.hint.uz}
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

      {/* Main 3D Viewport & Control Workspace */}
      <div className="grid lg:grid-cols-12 gap-4">
        {/* 3D Canvas Canvas */}
        <div className="lg:col-span-8 h-[450px] rounded-3xl bg-[#090A14] border border-border overflow-hidden relative shadow-2xl">
          <Canvas camera={{ position: [0, 6, 6], fov: 45 }}>
            <ambientLight intensity={0.7} />
            <pointLight position={[5, 10, 5]} intensity={1.5} color="#A29BFE" />
            <directionalLight position={[-5, 8, -5]} intensity={1} color="#00D2FF" />
            <Stars radius={50} depth={30} count={1000} factor={3} fade speed={1} />

            {/* Grid Elements */}
            {level.grid.map((row, r) =>
              row.map((cell, c) => {
                const pos = get3DPos(r, c);
                const isWall = cell === 1;
                const isGem = cell === 2 && !gemsCollected.has(`${r},${c}`);
                const isPortal = cell === 3;

                return (
                  <group key={`${r}-${c}`}>
                    <FloorTile position={[pos[0], -0.05, pos[2]]} isPath={!isWall} />
                    {isWall && <WallMesh position={[pos[0], 0.4, pos[2]]} />}
                    {isGem && <GemMesh position={[pos[0], 0.4, pos[2]]} />}
                    {isPortal && <PortalMesh position={[pos[0], 0, pos[2]]} />}
                  </group>
                );
              })
            )}

            {/* 3D Robot */}
            <RobotMesh
              position={get3DPos(robotPos[0], robotPos[1], 0)}
              rotation={dirAngles[robotDir]}
            />
          </Canvas>

          {/* Quick HUD overlay */}
          <div className="absolute top-4 left-4 text-xs font-mono bg-black/60 px-3 py-1.5 rounded-xl border border-white/10 text-white/80 backdrop-blur-md">
            Kristallar: {gemsCollected.size} dona
          </div>
        </div>

        {/* Command Workspace Panel */}
        <div className="lg:col-span-4 rounded-3xl bg-card border border-border p-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-neon-yellow" /> Buyruqlar palitrasi
            </h4>

            {/* Command Palette Buttons */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => addCommand("FORWARD")}
                disabled={isRunning}
                className="p-2.5 rounded-xl bg-surface border border-border hover:border-neon-purple text-xs font-semibold flex flex-col items-center gap-1 text-foreground transition active:scale-95 disabled:opacity-50"
              >
                <ArrowUp className="w-4 h-4 text-neon-green" />
                <span>Oldinga</span>
              </button>

              <button
                onClick={() => addCommand("TURN_LEFT")}
                disabled={isRunning}
                className="p-2.5 rounded-xl bg-surface border border-border hover:border-neon-purple text-xs font-semibold flex flex-col items-center gap-1 text-foreground transition active:scale-95 disabled:opacity-50"
              >
                <ArrowLeft className="w-4 h-4 text-neon-blue" />
                <span>Chapga</span>
              </button>

              <button
                onClick={() => addCommand("TURN_RIGHT")}
                disabled={isRunning}
                className="p-2.5 rounded-xl bg-surface border border-border hover:border-neon-purple text-xs font-semibold flex flex-col items-center gap-1 text-foreground transition active:scale-95 disabled:opacity-50"
              >
                <ArrowRight className="w-4 h-4 text-neon-yellow" />
                <span>O&apos;ngga</span>
              </button>
            </div>

            {/* Command Execution Queue */}
            <div className="pt-2">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-muted-foreground">
                  Algoritm navbati ({commands.length}/15):
                </span>
                {commands.length > 0 && (
                  <button
                    onClick={clearCommands}
                    disabled={isRunning}
                    className="text-[11px] text-neon-red hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" /> Tozalash
                  </button>
                )}
              </div>

              <div className="min-h-[140px] max-h-[180px] overflow-y-auto p-2.5 rounded-xl bg-black/40 border border-border space-y-1.5">
                {commands.length > 0 ? (
                  commands.map((cmd, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-lg bg-surface/80 border border-border text-xs font-mono"
                    >
                      <span className="text-muted-foreground w-5">{idx + 1}.</span>
                      <span className="font-bold flex-1 text-foreground">
                        {cmd === "FORWARD"
                          ? "robot.oldinga()"
                          : cmd === "TURN_LEFT"
                          ? "robot.chapga_buril()"
                          : "robot.ongga_buril()"}
                      </span>
                      {!isRunning && (
                        <button
                          onClick={() => removeCommand(idx)}
                          className="text-muted-foreground hover:text-neon-red px-1"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground italic text-center py-10">
                    Buyruqlarni tanlang...
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Action Run Button */}
          <div className="pt-3 border-t border-border mt-3">
            <button
              onClick={handleRun}
              disabled={isRunning || commands.length === 0}
              className="btn-primary w-full py-3 text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-neon-purple/20 disabled:opacity-50"
            >
              {isRunning ? (
                <span>Robot harakatlanmoqda...</span>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" /> Algoritmni ishga tushirish
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
