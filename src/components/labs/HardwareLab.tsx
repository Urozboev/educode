"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import {
  Monitor, Keyboard, Mouse, Headphones, Network, Plug, Printer,
  Check, RotateCcw, Info, X as XIcon,
} from "lucide-react";
import type { Dictionary } from "@/lib/i18n/dictionaries/uz";

/**
 * Kompyuter qurilmalarini ulash laboratoriyasi.
 *
 * Maqsad — o'quvchi qaysi qurilma qaysi portga ulanishini va nima uchun
 * shundayligini bilib olsin. Shuning uchun xato bosilganda shunchaki
 * "noto'g'ri" deyilmaydi, balki port nima uchun mo'ljallangani tushuntiriladi.
 */

type PortType = "hdmi" | "usb" | "audio" | "lan" | "power";

type Device = {
  id: string;
  name: string;
  Icon: React.ElementType;
  port: PortType;
  /** Ulangandan keyin ko'rsatiladigan qisqa fakt */
  fact: string;
};

type Port = {
  id: string;
  type: PortType;
  label: string;
  /** Xato ulanganda ko'rsatiladigan izoh */
  purpose: string;
  color: string;
};

const DEVICES = (t: Dictionary): Device[] => [
  { id: "monitor", name: t.labs.devMonitor, Icon: Monitor, port: "hdmi",
    fact: t.labs.factHdmi },
  { id: "keyboard", name: t.labs.devKeyboard, Icon: Keyboard, port: "usb",
    fact: t.labs.factUsb },
  { id: "mouse", name: t.labs.devMouse, Icon: Mouse, port: "usb",
    fact: t.labs.factMouse },
  { id: "printer", name: t.labs.devPrinter, Icon: Printer, port: "usb",
    fact: t.labs.factPrinter },
  { id: "headphones", name: t.labs.devHeadphones, Icon: Headphones, port: "audio",
    fact: t.labs.factAudio },
  { id: "lan", name: t.labs.devLan, Icon: Network, port: "lan",
    fact: t.labs.factLan },
  { id: "power", name: t.labs.devPower, Icon: Plug, port: "power",
    fact: t.labs.factPower },
];

const PORTS = (t: Dictionary): Port[] => [
  { id: "usb-3", type: "usb", label: "USB", color: "text-neon-blue",
    purpose: t.labs.portUsb },
  { id: "audio-1", type: "audio", label: "Audio", color: "text-neon-green",
    purpose: t.labs.portAudio },
  { id: "lan-1", type: "lan", label: "LAN", color: "text-neon-yellow",
    purpose: t.labs.portLan },
  { id: "power-1", type: "power", label: "220V", color: "text-neon-red",
    purpose: t.labs.portPower },
];

type Feedback = { ok: boolean; text: string } | null;

export function HardwareLab() {
  const { t } = useI18n();
  const [selected, setSelected] = useState<string | null>(null);
  // portId → deviceId
  const [connected, setConnected] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [mistakes, setMistakes] = useState(0);

  const connectedDevices = useMemo(
    () => new Set(Object.values(connected)),
    [connected]
  );
  const done = connectedDevices.size === DEVICES.length;

  function pickPort(port: Port) {
    if (!selected) {
      setFeedback({ ok: false, text: t.labs.pickDeviceFirst });
      return;
    }
    if (connected[port.id]) {
      setFeedback({ ok: false, text: t.labs.portBusy });
      return;
    }

    const device = DEVICES(t).find(d => d.id === selected)!;

    if (device.port === port.type) {
      setConnected(c => ({ ...c, [port.id]: device.id }));
      setSelected(null);
      setFeedback({ ok: true, text: `${device.name} ulandi. ${device.fact}` });
    } else {
      setMistakes(m => m + 1);
      const right = PORTS(t).find(p => p.type === device.port);
      setFeedback({
        ok: false,
        text: `${device.name} bu portga ulanmaydi. ${port.purpose} ${device.name} uchun ${right?.label} kerak.`,
      });
    }
  }

  function disconnect(portId: string) {
    setConnected(c => {
      const n = { ...c };
      delete n[portId];
      return n;
    });
    setFeedback(null);
  }

  function reset() {
    setConnected({});
    setSelected(null);
    setFeedback(null);
    setMistakes(0);
  }

  return (
    <div className="space-y-6">
      {/* Holat */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <span className="eyebrow">
          Ulangan <span className="numeric">{connectedDevices.size}</span>/<span className="numeric">{DEVICES.length}</span>
        </span>
        <div className="flex items-center gap-4">
          {mistakes > 0 && (
            <span className="text-sm text-muted-foreground">
              Xato: <span className="numeric">{mistakes}</span>
            </span>
          )}
          <button onClick={reset} className="btn-ghost py-2 px-4 text-sm inline-flex items-center gap-2">
            <RotateCcw className="w-4 h-4" /> Boshidan
          </button>
        </div>
      </div>

      <div className="h-1.5 rounded-full bg-surface overflow-hidden">
        <motion.div className="h-full progress-gradient"
          animate={{ width: `${(connectedDevices.size / DEVICES.length) * 100}%` }}
          transition={{ duration: 0.3 }} />
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {/* Qurilmalar */}
        <div>
          <p className="eyebrow mb-3">Qurilmalar</p>
          <div className="grid grid-cols-2 gap-2.5">
            {DEVICES(t).map(d => {
              const isConnected = connectedDevices.has(d.id);
              const isSelected = selected === d.id;
              return (
                <button
                  key={d.id}
                  disabled={isConnected}
                  onClick={() => setSelected(isSelected ? null : d.id)}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                    isConnected && "bg-neon-green/[0.07] border-neon-green/30 text-neon-green",
                    !isConnected && isSelected && "border-neon-purple bg-neon-purple/[0.08] ring-2 ring-neon-purple/25",
                    !isConnected && !isSelected && "border-border bg-card hover:border-neon-purple/40"
                  )}
                >
                  <d.Icon className="w-6 h-6" />
                  <span className="text-sm font-medium text-center leading-tight">{d.name}</span>
                  {isConnected && <Check className="w-3.5 h-3.5" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tizim bloki */}
        <div>
          <p className="eyebrow mb-3">Tizim bloki — portlar</p>
          <div className="rounded-xl border-2 border-border bg-surface/40 p-4">
            <div className="space-y-2">
              {PORTS(t).map(p => {
                const devId = connected[p.id];
                const dev = devId ? DEVICES(t).find(d => d.id === devId) : null;
                return (
                  <div
                    key={p.id}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg border transition-all",
                      dev ? "bg-neon-green/[0.06] border-neon-green/25" : "bg-card border-border"
                    )}
                  >
                    {/* Port uyasi */}
                    <span className={cn(
                      "w-9 h-6 rounded border-2 flex items-center justify-center flex-shrink-0",
                      dev ? "border-neon-green/40" : "border-border"
                    )}>
                      <span className={cn("w-4 h-1.5 rounded-sm bg-current", dev ? "text-neon-green" : p.color)} />
                    </span>

                    <span className={cn("font-mono text-xs font-semibold w-12 flex-shrink-0", dev ? "text-neon-green" : p.color)}>
                      {p.label}
                    </span>

                    {dev ? (
                      <>
                        <span className="flex-1 min-w-0 text-sm truncate inline-flex items-center gap-2">
                          <dev.Icon className="w-4 h-4 flex-shrink-0" /> {dev.name}
                        </span>
                        <button
                          onClick={() => disconnect(p.id)}
                          className="p-1.5 rounded text-muted-foreground hover:text-neon-red hover:bg-neon-red/10 flex-shrink-0"
                          title={t.labs.disconnect}
                        >
                          <XIcon className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => pickPort(p)}
                        className="flex-1 text-left text-sm text-muted-foreground hover:text-foreground py-1"
                      >
                        {selected ? t.labs.connectHere : "Bo'sh"}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Izoh */}
      <AnimatePresence mode="wait">
        {feedback && (
          <motion.div
            key={feedback.text}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={cn(
              "flex items-start gap-2.5 p-4 rounded-xl border text-sm leading-relaxed",
              feedback.ok
                ? "bg-neon-green/[0.06] border-neon-green/25"
                : "bg-neon-yellow/[0.07] border-neon-yellow/25"
            )}
          >
            {feedback.ok
              ? <Check className="w-4 h-4 flex-shrink-0 mt-0.5 text-neon-green" />
              : <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-neon-yellow" />}
            <span>{feedback.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {!selected && !done && !feedback && (
        <p className="text-center text-sm text-muted-foreground">
          {t.labs.pickDeviceThenPort}
        </p>
      )}

      <AnimatePresence>
        {done && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-xl bg-neon-green/[0.06] border border-neon-green/25 text-center"
          >
            <p className="font-display font-bold text-neon-green mb-1">
              Kompyuter to&apos;liq yig&apos;ildi
            </p>
            <p className="text-sm text-muted-foreground">
              {mistakes === 0
                ? t.labs.noMistakes
                : `${mistakes} ta xato bilan yakunladingiz — qaytadan urinib ko'ring.`}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
