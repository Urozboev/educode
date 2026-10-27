"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

/**
 * "Kompyuter tarmoqlari" mavzulari → interaktiv hikoya-simulyatsiya.
 *
 * Kalit — mavzu slug'i (79–87 migratsiyalar). Har hikoya (stories/) sahnada
 * qurilmalar va paketlarni qadamma-qadam ko'rsatadi, oraliqda talabaga savol
 * beradi. Bir hikoya bir nechta mavzuda boshqa boshlang'ich tab bilan ishlatiladi.
 * Har komponent alohida yuklanadi — faqat ochilgan mavzuniki.
 */

const loading = () => <div className="h-72 rounded-3xl border border-border/60 bg-card/40 animate-pulse" />;

const NetTypes = dynamic(() => import("./stories/NetTypesStory"), { ssr: false, loading });
const Topology = dynamic(() => import("./stories/TopologyStory"), { ssr: false, loading });
const Switch = dynamic(() => import("./stories/SwitchStory"), { ssr: false, loading });
const Osi = dynamic(() => import("./stories/OsiStory"), { ssr: false, loading });
const Signal = dynamic(() => import("./stories/SignalStory"), { ssr: false, loading });
const Delay = dynamic(() => import("./stories/DelayStory"), { ssr: false, loading });
const TokenRing = dynamic(() => import("./stories/TokenRingStory"), { ssr: false, loading });
const Wifi = dynamic(() => import("./stories/WifiStory"), { ssr: false, loading });
const Frame = dynamic(() => import("./stories/FrameStory"), { ssr: false, loading });
const Ip = dynamic(() => import("./stories/IpStory"), { ssr: false, loading });
const Subnet = dynamic(() => import("./stories/SubnetStory"), { ssr: false, loading });
const Ping = dynamic(() => import("./stories/PingStory"), { ssr: false, loading });
const Dhcp = dynamic(() => import("./stories/DhcpStory"), { ssr: false, loading });
const Routing = dynamic(() => import("./stories/RoutingStory"), { ssr: false, loading });
const StaticRoute = dynamic(() => import("./stories/StaticRouteStory"), { ssr: false, loading });
const Tcp = dynamic(() => import("./stories/TcpStory"), { ssr: false, loading });
const Socket = dynamic(() => import("./stories/SocketStory"), { ssr: false, loading });
const Http = dynamic(() => import("./stories/HttpStory"), { ssr: false, loading });
const Email = dynamic(() => import("./stories/EmailStory"), { ssr: false, loading });
const Dns = dynamic(() => import("./stories/DnsStory"), { ssr: false, loading });
const Domain = dynamic(() => import("./stories/DomainStory"), { ssr: false, loading });
const Share = dynamic(() => import("./stories/ShareStory"), { ssr: false, loading });
const Firewall = dynamic(() => import("./stories/FirewallStory"), { ssr: false, loading });
const Troubleshoot = dynamic(() => import("./stories/TroubleshootStory"), { ssr: false, loading });
const Emulator = dynamic(() => import("./stories/EmulatorStory"), { ssr: false, loading });
const Sniffer = dynamic(() => import("./stories/SnifferStory"), { ssr: false, loading });
const Server = dynamic(() => import("./stories/ServerStory"), { ssr: false, loading });

const Stack = ({ children }: { children: React.ReactNode }) => <div className="space-y-6">{children}</div>;

export const NET_VISUALS: Record<string, ComponentType> = {
  // ---------- Ma'ruzalar ----------
  "kt-m01-kirish": () => <NetTypes />,
  "kt-m02-tamoyillar": () => <Stack><Topology initial="star" /><Switch initial="hub" /></Stack>,
  "kt-m03-osi": () => <Osi />,
  "kt-m04-uzatish": () => <Stack><Signal initial="media" /><Delay /></Stack>,
  "kt-m05-ethernet": () => <Stack><Switch initial="switch" /><Frame /></Stack>,
  "kt-m06-token-ring-wifi": () => <Stack><TokenRing /><Wifi initial="air" /></Stack>,
  "kt-m07-tcp-ip": () => <Ip />,
  "kt-m08-protokollar-marshrutlash": () => <Stack><Ping /><Dhcp /><Routing /></Stack>,
  "kt-m09-transport": () => <Stack><Tcp initial="tcp" /><Socket /></Stack>,
  "kt-m10-amaliy-pogona": () => <Stack><Http /><Email /></Stack>,
  "kt-m11-internet-dns": () => <Dns />,
  "kt-m12-server-ot": () => <Domain initial="dom" />,
  "kt-m13-resurslar": () => <Share />,
  "kt-m14-xavfsizlik": () => <Firewall initial="fw" />,
  "kt-m15-diagnostika": () => <Troubleshoot />,

  // ---------- Amaliy mashg'ulotlar ----------
  "kt-a01-klassifikatsiya": () => <NetTypes />,
  "kt-a02-topologiya": () => <Topology initial="mesh" />,
  "kt-a03-osi-inkapsulyatsiya": () => <Osi />,
  "kt-a04-tezlik-kechikish": () => <Delay />,
  "kt-a05-kodlash-xatolar": () => <Signal initial="coding" />,
  "kt-a06-ethernet-kadr": () => <Frame />,
  "kt-a07-ipv4": () => <Ip />,
  "kt-a08-subnetting": () => <Subnet mode="flsm" />,
  "kt-a09-vlsm": () => <Subnet mode="vlsm" />,
  "kt-a10-marshrutlash": () => <Routing />,
  "kt-a11-tcp-udp": () => <Tcp initial="tcp" />,
  "kt-a12-http": () => <Http />,
  "kt-a13-dns": () => <Dns />,
  "kt-a14-firewall": () => <Firewall initial="fw" />,
  "kt-a15-diagnostika": () => <Troubleshoot />,

  // ---------- Laboratoriya ishlari ----------
  "kt-l01-qurilmalar": () => <Switch initial="hub" />,
  "kt-l02-emulyator": () => <Emulator />,
  "kt-l03-kodlash": () => <Signal initial="coding" />,
  "kt-l04-wireshark": () => <Sniffer />,
  "kt-l05-wifi": () => <Wifi initial="chan" />,
  "kt-l06-ip-manzil": () => <Stack><Ip /><Emulator /></Stack>,
  "kt-l07-marshrutizator": () => <StaticRoute />,
  "kt-l08-soketlar": () => <Socket />,
  "kt-l09-windows-server": () => <Server />,
  "kt-l10-server-xizmatlari": () => <Stack><Server /><Dhcp /></Stack>,
  "kt-l11-foydalanuvchilar": () => <Domain initial="dom" />,
  "kt-l12-umumiy-resurslar": () => <Share />,
  "kt-l13-brandmauer-vpn": () => <Firewall initial="vpn" />,
  "kt-l14-nosozliklar": () => <Troubleshoot />,
};
