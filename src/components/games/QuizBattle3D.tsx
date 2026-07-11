"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, RoundedBox, Stars, Float } from "@react-three/drei";
import * as THREE from "three";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Trophy, Zap, RotateCcw, Coins, Play } from "lucide-react";

/* ================= SAVOLLAR BANKI ================= */
interface Q { q: string; opts: string[]; correct: number; }
const QUESTIONS: Q[] = [
  { q: "Python'da ro'yxat qanday belgilanadi?", opts: ["[1, 2, 3]", "(1, 2, 3)", "{1, 2, 3}", "<1, 2, 3>"], correct: 0 },
  { q: "HTML nimaning qisqartmasi?", opts: ["HyperText Markup Language", "High Tech Modern Lang", "Home Tool Markup", "Hyperlink Text Mode"], correct: 0 },
  { q: "5 % 2 natijasi nechchi?", opts: ["1", "2", "2.5", "0"], correct: 0 },
  { q: "CSS nima uchun ishlatiladi?", opts: ["Sahifa dizayni", "Ma'lumotlar bazasi", "Server logikasi", "Fayl saqlash"], correct: 0 },
  { q: "Python'da izoh qaysi belgi bilan boshlanadi?", opts: ["#", "//", "/*", "--"], correct: 0 },
  { q: "len('salom') nechchi qaytaradi?", opts: ["5", "4", "6", "xato"], correct: 0 },
  { q: "Qaysi biri sikl operatori?", opts: ["for", "if", "def", "try"], correct: 0 },
  { q: "JavaScript'da o'zgaruvchi qanday e'lon qilinadi?", opts: ["let x = 5", "int x = 5", "var: x = 5", "x := 5"], correct: 0 },
  { q: "2 ** 3 natijasi (Python)?", opts: ["8", "6", "9", "5"], correct: 0 },
  { q: "Bool tipida nechta qiymat bor?", opts: ["2", "1", "3", "cheksiz"], correct: 0 },
  { q: "Qaysi biri ma'lumotlar bazasi?", opts: ["PostgreSQL", "Photoshop", "Chrome", "Figma"], correct: 0 },
  { q: "'abc' + 'def' natijasi?", opts: ["'abcdef'", "'abc def'", "xato", "'adbecf'"], correct: 0 },
  { q: "if x == 5: bu nima?", opts: ["Shart operatori", "Sikl", "Funksiya", "Import"], correct: 0 },
  { q: "print(10 // 3) nechchi chiqaradi?", opts: ["3", "3.33", "4", "1"], correct: 0 },
  { q: "Git nima uchun kerak?", opts: ["Versiya nazorati", "Rasm tahrirlash", "Video montaj", "Musiqa"], correct: 0 },
  { q: "Qaysi biri to'g'ri funksiya e'loni (Python)?", opts: ["def salom():", "function salom():", "func salom():", "salom() def:"], correct: 0 },
  { q: "RAM nima?", opts: ["Operativ xotira", "Doimiy xotira", "Protsessor", "Videokarta"], correct: 0 },
  { q: "range(3) qaysi sonlarni beradi?", opts: ["0, 1, 2", "1, 2, 3", "0, 1, 2, 3", "1, 2"], correct: 0 },
  { q: "Qaysi kengaytma Python fayli?", opts: [".py", ".js", ".html", ".css"], correct: 0 },
  { q: "OS nima?", opts: ["Operatsion tizim", "Ofis dasturi", "Brauzer", "Antivirus"], correct: 0 },
  { q: "'5' + '5' JavaScript'da nechchi?", opts: ["'55'", "10", "xato", "'10'"], correct: 0 },
  { q: "Qaysi biri massiv metodi (JS)?", opts: ["push()", "print()", "input()", "len()"], correct: 0 },
  { q: "Ctrl+C nima qiladi?", opts: ["Nusxa oladi", "Kesadi", "Joylaydi", "O'chiradi"], correct: 0 },
  { q: "URL'da https nimani bildiradi?", opts: ["Xavfsiz protokol", "Sayt nomi", "Server turi", "Fayl format"], correct: 0 },
  { q: "not True natijasi?", opts: ["False", "True", "None", "xato"], correct: 0 },
  { q: "Qaysi biri kompilyatsiya qilinadigan til?", opts: ["C++", "Python", "JavaScript", "HTML"], correct: 0 },
  { q: "dict = {'a': 1} — 'a' bu nima?", opts: ["Kalit (key)", "Qiymat", "Indeks", "Metod"], correct: 0 },
  { q: "1 KB nechchi bayt?", opts: ["1024", "1000", "100", "512"], correct: 0 },
  { q: "while True: nima qiladi?", opts: ["Cheksiz sikl", "Bir marta ishlaydi", "Xato beradi", "Hech narsa"], correct: 0 },
  { q: "Qaysi biri IDE?", opts: ["VS Code", "Gmail", "YouTube", "Telegram"], correct: 0 },
];

const GAME_SECONDS = 45;
const CUBE_COLORS = ["#6C5CE7", "#00D2FF", "#00E676", "#FFD600"];

/** Savol variantlarini aralashtirish */
function shuffle(q: Q): Q {
  const idx = [0, 1, 2, 3].sort(() => Math.random() - 0.5);
  return { q: q.q, opts: idx.map(i => q.opts[i]), correct: idx.indexOf(q.correct) };
}

/* ================= 3D KOMPONENTLAR ================= */

/** Javob kubi — aylanadi, hover'da kattaradi, bosilganda javob beradi */
function AnswerCube({
  position, text, color, onPick, disabled, flash,
}: {
  position: [number, number, number];
  text: string;
  color: string;
  onPick: () => void;
  disabled: boolean;
  flash: "correct" | "wrong" | null;
}) {
  const mesh = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    if (!mesh.current) return;
    mesh.current.rotation.y += delta * (hovered ? 1.6 : 0.35);
    const target = hovered && !disabled ? 1.15 : 1;
    mesh.current.scale.lerp(new THREE.Vector3(target, target, target), 0.12);
  });

  const displayColor = flash === "correct" ? "#00E676" : flash === "wrong" ? "#FF5252" : color;

  return (
    <Float speed={2} rotationIntensity={0.15} floatIntensity={0.5}>
      <group
        ref={mesh}
        position={position}
        onClick={(e) => { e.stopPropagation(); if (!disabled) onPick(); }}
        onPointerOver={() => { setHovered(true); document.body.style.cursor = "pointer"; }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = "auto"; }}
      >
        <RoundedBox args={[2.4, 1.5, 0.6]} radius={0.12}>
          <meshStandardMaterial
            color={displayColor}
            metalness={0.35}
            roughness={0.25}
            emissive={displayColor}
            emissiveIntensity={flash ? 0.9 : hovered ? 0.4 : 0.15}
          />
        </RoundedBox>
        <Text
          position={[0, 0, 0.35]}
          fontSize={text.length > 18 ? 0.16 : 0.22}
          maxWidth={2.1}
          textAlign="center"
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.012}
          outlineColor="#00000055"
        >
          {text}
        </Text>
      </group>
    </Float>
  );
}

/** To'g'ri javobda portlash zarralari */
function Particles({ trigger }: { trigger: number }) {
  const points = useRef<THREE.Points>(null);
  const velocities = useMemo(() => {
    const v = new Float32Array(80 * 3);
    for (let i = 0; i < 80 * 3; i++) v[i] = (Math.random() - 0.5) * 6;
    return v;
  }, [trigger]);
  const positions = useMemo(() => new Float32Array(80 * 3), [trigger]);
  const life = useRef(0);

  useEffect(() => { life.current = 1; }, [trigger]);

  useFrame((_, delta) => {
    if (!points.current || life.current <= 0) return;
    life.current -= delta * 0.9;
    const pos = points.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < 80; i++) {
      pos[i * 3] += velocities[i * 3] * delta;
      pos[i * 3 + 1] += velocities[i * 3 + 1] * delta;
      pos[i * 3 + 2] += velocities[i * 3 + 2] * delta;
    }
    points.current.geometry.attributes.position.needsUpdate = true;
    (points.current.material as THREE.PointsMaterial).opacity = Math.max(0, life.current);
  });

  if (trigger === 0) return null;
  return (
    <points ref={points} key={trigger}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={80} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.09} color="#00E676" transparent opacity={1} />
    </points>
  );
}

/** Sahna — savol paneli + 4 kub */
function Scene({
  question, onAnswer, locked, flashState, particleTrigger,
}: {
  question: Q;
  onAnswer: (i: number) => void;
  locked: boolean;
  flashState: { idx: number; kind: "correct" | "wrong" } | null;
  particleTrigger: number;
}) {
  const cubePos: [number, number, number][] = [
    [-1.6, -0.4, 0], [1.6, -0.4, 0], [-1.6, -2.2, 0], [1.6, -2.2, 0],
  ];

  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 6, 5]} intensity={1.1} />
      <pointLight position={[-4, -2, 3]} intensity={0.5} color="#6C5CE7" />
      <Stars radius={60} depth={40} count={1400} factor={3} fade speed={1.2} />

      {/* Savol paneli */}
      <Float speed={1.5} rotationIntensity={0.08} floatIntensity={0.3}>
        <group position={[0, 1.8, 0]}>
          <RoundedBox args={[6.4, 1.6, 0.25]} radius={0.15}>
            <meshStandardMaterial color="#16121f" metalness={0.5} roughness={0.4} emissive="#6C5CE7" emissiveIntensity={0.08} />
          </RoundedBox>
          <Text
            position={[0, 0, 0.18]}
            fontSize={question.q.length > 45 ? 0.24 : 0.3}
            maxWidth={5.8}
            textAlign="center"
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            {question.q}
          </Text>
        </group>
      </Float>

      {question.opts.map((opt, i) => (
        <AnswerCube
          key={`${question.q}-${i}`}
          position={cubePos[i]}
          text={opt}
          color={CUBE_COLORS[i]}
          disabled={locked}
          flash={flashState?.idx === i ? flashState.kind : null}
          onPick={() => onAnswer(i)}
        />
      ))}

      <Particles trigger={particleTrigger} />
    </>
  );
}

/* ================= ASOSIY O'YIN ================= */
type Phase = "start" | "playing" | "done";

export default function QuizBattle3D() {
  const supabase = createClient();
  const [phase, setPhase] = useState<Phase>("start");
  const [deck, setDeck] = useState<Q[]>([]);
  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_SECONDS);
  const [locked, setLocked] = useState(false);
  const [flashState, setFlashState] = useState<{ idx: number; kind: "correct" | "wrong" } | null>(null);
  const [particleTrigger, setParticleTrigger] = useState(0);
  const [coinsAwarded, setCoinsAwarded] = useState<number | null>(null);

  // Taymer
  useEffect(() => {
    if (phase !== "playing") return;
    if (timeLeft <= 0) { finish(); return; }
    const t = setTimeout(() => setTimeLeft(v => v - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, timeLeft]);

  function start() {
    const shuffled = [...QUESTIONS].sort(() => Math.random() - 0.5).map(shuffle);
    setDeck(shuffled);
    setQIdx(0); setScore(0); setCombo(0); setBestCombo(0); setCorrect(0);
    setTimeLeft(GAME_SECONDS); setLocked(false); setFlashState(null);
    setCoinsAwarded(null);
    setPhase("playing");
  }

  const finish = useCallback(async () => {
    setPhase("done");
    // Coin mukofoti: har 3 to'g'ri javob = 1 coin (max 15)
    const coins = Math.min(15, Math.floor(correct / 3));
    if (coins > 0) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase.from("profiles").select("coins").eq("id", user.id).single();
          if (profile) {
            const newBalance = profile.coins + coins;
            await supabase.from("profiles").update({ coins: newBalance }).eq("id", user.id);
            await supabase.from("coin_transactions").insert({
              user_id: user.id, amount: coins, type: "quiz_bonus",
              description: `Quiz Battle 3D: ${correct} to'g'ri javob`, balance_after: newBalance,
            });
            setCoinsAwarded(coins);
          }
        }
      } catch { /* coin berilmasa ham o'yin natijasi ko'rinadi */ }
    } else {
      setCoinsAwarded(0);
    }
  }, [correct, supabase]);

  function answer(i: number) {
    if (locked || phase !== "playing") return;
    setLocked(true);
    const cur = deck[qIdx];
    const isCorrect = i === cur.correct;

    if (isCorrect) {
      const newCombo = combo + 1;
      const points = 10 * Math.min(4, 1 + Math.floor(newCombo / 3)); // combo multiplikator
      setScore(s => s + points);
      setCombo(newCombo);
      setBestCombo(b => Math.max(b, newCombo));
      setCorrect(c => c + 1);
      setFlashState({ idx: i, kind: "correct" });
      setParticleTrigger(t => t + 1);
    } else {
      setCombo(0);
      setFlashState({ idx: i, kind: "wrong" });
    }

    setTimeout(() => {
      setFlashState(null);
      setLocked(false);
      setQIdx(v => (v + 1) % deck.length);
    }, isCorrect ? 350 : 650);
  }

  const multiplier = Math.min(4, 1 + Math.floor(combo / 3));

  return (
    <div className="relative rounded-3xl border border-border/50 overflow-hidden bg-[#0a0a14]">
      {/* HUD */}
      {phase === "playing" && (
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-5 py-3 bg-gradient-to-b from-black/60 to-transparent">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-white font-display font-bold text-lg">
              <Trophy className="w-5 h-5 text-neon-yellow" /> {score}
            </div>
            {combo >= 3 && (
              <div className="flex items-center gap-1 text-neon-yellow text-sm font-bold animate-pulse">
                <Zap className="w-4 h-4" /> x{multiplier} combo!
              </div>
            )}
          </div>
          <div className={`font-mono font-bold text-xl ${timeLeft <= 10 ? "text-neon-red animate-pulse" : "text-white"}`}>
            {timeLeft}s
          </div>
        </div>
      )}

      {/* 3D Canvas */}
      <div className="h-[520px]">
        {phase === "playing" && deck.length > 0 ? (
          <Canvas camera={{ position: [0, 0, 7.5], fov: 50 }} dpr={[1, 1.75]}>
            <Scene
              question={deck[qIdx]}
              onAnswer={answer}
              locked={locked}
              flashState={flashState}
              particleTrigger={particleTrigger}
            />
          </Canvas>
        ) : phase === "start" ? (
          <div className="h-full flex flex-col items-center justify-center gap-5 p-8 text-center">
            <div className="text-6xl">⚔️</div>
            <h2 className="font-display font-extrabold text-3xl text-white">Quiz Battle <span className="text-neon-purple">3D</span></h2>
            <p className="text-white/60 max-w-md text-sm leading-relaxed">
              {GAME_SECONDS} soniyada maksimal to'g'ri javob bering! 3D kublardan to'g'risini tanlang.
              Ketma-ket to'g'ri javoblar <span className="text-neon-yellow font-semibold">combo multiplikator</span> beradi.
              Har 3 to'g'ri javob — 1 coin 🪙
            </p>
            <button
              onClick={start}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-neon-purple text-white font-display font-bold hover:bg-neon-purple/90 shadow-xl shadow-neon-purple/30 transition-all hover:scale-105"
            >
              <Play className="w-5 h-5" /> Boshlash
            </button>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="text-5xl">{correct >= 10 ? "🏆" : correct >= 5 ? "🎉" : "💪"}</div>
            <h2 className="font-display font-extrabold text-3xl text-white">{score} ball</h2>
            <div className="flex gap-6 text-sm text-white/70">
              <span>✅ {correct} to'g'ri</span>
              <span>⚡ eng katta combo: {bestCombo}</span>
            </div>
            {coinsAwarded !== null && coinsAwarded > 0 && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-yellow/10 border border-neon-yellow/30 text-neon-yellow font-bold">
                <Coins className="w-4 h-4" /> +{coinsAwarded} coin qo'shildi!
              </div>
            )}
            <button
              onClick={start}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-2xl bg-neon-purple text-white font-display font-bold hover:bg-neon-purple/90 shadow-xl shadow-neon-purple/30 transition-all hover:scale-105 mt-2"
            >
              <RotateCcw className="w-4.5 h-4.5" /> Yana o'ynash
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
