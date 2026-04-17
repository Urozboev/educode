import * as React from "react";

/**
 * Dasturlash tillari uchun rasmiy SVG logolar.
 * Emoji (🐍 📜 🔷) o'rniga ishlatiladi — jiddiy, bir xil uslub.
 */

type Props = React.SVGProps<SVGSVGElement> & {
  size?: number;
  lang: string;
};

export function LanguageLogo({ lang, size = 20, className, ...rest }: Props) {
  const s = size;
  const common = { width: s, height: s, className, ...rest };
  const key = (lang || "").toLowerCase().replace(/[.\s]/g, "");

  switch (key) {
    case "python":
    case "py":
      return <PythonLogo {...common} />;
    case "javascript":
    case "js":
      return <JSLogo {...common} />;
    case "typescript":
    case "ts":
      return <TSLogo {...common} />;
    case "c++":
    case "cpp":
      return <CppLogo {...common} />;
    case "java":
      return <JavaLogo {...common} />;
    case "csharp":
    case "cs":
    case "c#":
      return <CSharpLogo {...common} />;
    case "html":
    case "html/css":
    case "htmlcss":
      return <HtmlLogo {...common} />;
    case "react":
      return <ReactLogo {...common} />;
    case "ai":
    case "ml":
      return <AILogo {...common} />;
    default:
      return <GenericCode {...common} />;
  }
}

/* Python — rasmiy mavi/sariq quyruqli logo, stilize qilingan */
function PythonLogo(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" {...p}>
      <defs>
        <linearGradient id="py-blue" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#387EB8" />
          <stop offset="1" stopColor="#366994" />
        </linearGradient>
        <linearGradient id="py-yellow" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFE873" />
          <stop offset="1" stopColor="#FFD43B" />
        </linearGradient>
      </defs>
      <path
        fill="url(#py-blue)"
        d="M126.9 18c-24 0-22.5 10.4-22.5 10.4l.1 10.8h22.9v3.2H95.3s-15.4-1.7-15.4 22.3S93.4 87 93.4 87h8v-11.3s-.4-13.4 13.2-13.4h22.7s12.8.2 12.8-12.4V30.7S152 18 126.9 18zm-12.6 7.2a4.1 4.1 0 1 1 0 8.2 4.1 4.1 0 0 1 0-8.2z"
      />
      <path
        fill="url(#py-yellow)"
        d="M127.6 238c24 0 22.5-10.4 22.5-10.4l-.1-10.8h-22.9v-3.2h31.8s15.4 1.7 15.4-22.3-13.4-22.3-13.4-22.3h-8v11.3s.4 13.4-13.2 13.4h-22.7s-12.8-.2-12.8 12.4V225s-1.9 13 25.4 13zm12.6-7.2a4.1 4.1 0 1 1 0-8.2 4.1 4.1 0 0 1 0 8.2z"
      />
    </svg>
  );
}

/* JavaScript — sariq kvadrat + JS */
function JSLogo(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" {...p}>
      <rect width="256" height="256" rx="28" fill="#F7DF1E" />
      <path
        d="M165 197c4 7 10 12 21 12 9 0 15-4 15-11 0-7-6-10-16-14l-5-2c-16-7-26-15-26-32 0-15 12-27 30-27 13 0 23 4 29 16l-16 10c-3-6-7-9-13-9-6 0-10 4-10 9 0 6 4 9 13 13l5 2c19 8 29 16 29 34 0 18-15 28-34 28-19 0-31-9-37-21l16-8zm-70 1c3 5 6 9 12 9 5 0 9-2 9-10v-70h20v70c0 20-12 30-29 30-16 0-25-8-30-18l18-11z"
        fill="#1a1a1a"
      />
    </svg>
  );
}

/* TypeScript — ko'k kvadrat + TS */
function TSLogo(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" {...p}>
      <rect width="256" height="256" rx="28" fill="#3178C6" />
      <path
        d="M149 150v18h16v48h20v-48h16v-18zm74 0v50c0 12 6 20 22 20 7 0 13-2 16-5v-18c-2 1-5 2-8 2-6 0-9-3-9-10v-21h17v-18h-17v-18l-21 6v12z"
        fill="#fff"
      />
    </svg>
  );
}

/* C++ — ko'k shol + ++ */
function CppLogo(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" {...p}>
      <path
        d="M240 76L128 12 16 76v104l112 64 112-64z"
        fill="#00599C"
      />
      <path
        d="M128 34L36 87v82l92 53 92-53V87z"
        fill="#004482"
      />
      <path
        d="M128 195c-37 0-67-30-67-67s30-67 67-67c22 0 41 10 53 27l-29 17c-5-8-14-13-24-13-16 0-29 15-29 36s13 36 29 36c10 0 19-5 24-13l29 17c-12 17-31 27-53 27z"
        fill="#fff"
      />
      <path d="M200 124v-10h-8v10h-10v8h10v10h8v-10h10v-8z" fill="#fff" />
      <path d="M230 124v-10h-8v10h-10v8h10v10h8v-10h10v-8z" fill="#fff" />
    </svg>
  );
}

/* Java — qahva stakan + bug'i */
function JavaLogo(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" {...p}>
      <path
        fill="#E76F00"
        d="M102 180s-10 6 7 8c21 2 32 2 55-2 0 0 6 4 15 7-52 22-118-1-77-13zm-6-29s-11 8 6 10c22 3 40 3 70-3 0 0 4 4 11 6-63 19-134 1-87-13z"
      />
      <path
        fill="#E76F00"
        d="M147 101c13 14-3 28-3 28s33-17 18-39c-14-20-25-30 34-64 0 0-94 23-49 75z"
      />
      <path
        fill="#5382A1"
        d="M196 199s8 6-8 11c-30 9-126 12-153 0-10-4 9-11 15-12 6-2 9-2 9-2-11-7-70 15-30 22 110 18 201-8 167-19zm-93-82s-54 13-19 17c15 2 44 2 72-1 23-2 45-6 45-6s-8 3-14 7c-54 14-159 8-129-7 26-13 45-10 45-10zm111 67c55-29 29-56 12-53-4 1-6 2-6 2s2-3 5-4c33-12 58 34-12 57-1 0 1-1 1-2zM150 0s30 30-29 77c-47 38-11 60 0 85-27-25-47-46-33-67 20-31 75-46 62-95z"
      />
    </svg>
  );
}

/* C# — binafsha kvadrat + C# */
function CSharpLogo(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" {...p}>
      <rect width="256" height="256" rx="28" fill="#512BD4" />
      <path
        d="M98 174c-13 0-24-4-32-13-8-8-12-20-12-34s4-26 12-35c8-9 19-13 33-13 14 0 24 5 32 14l-14 13c-5-5-11-8-18-8-7 0-13 3-17 8-4 5-7 13-7 21 0 9 3 16 7 21 4 5 10 8 17 8 7 0 13-3 18-8l14 14c-8 8-19 12-33 12z"
        fill="#fff"
      />
      <path
        d="M175 138l3-19h-14l3-19h-7l-3 19h-11l3-19h-7l-3 19h-16v7h15l-2 14h-15v7h14l-3 19h7l3-19h11l-3 19h7l3-19h16v-7h-15l2-14h15v-7zm-22 14h-11l2-14h11z"
        fill="#fff"
      />
    </svg>
  );
}

/* HTML5 — qizil qalqon */
function HtmlLogo(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" {...p}>
      <path fill="#E34F26" d="M34 28l17 198 77 22 77-22 17-198z" />
      <path fill="#EF652A" d="M128 229l62-17 15-169h-77z" />
      <path
        fill="#EBEBEB"
        d="M128 108H97l-2-24h33V61H70l7 71h51zm0 61l-26-7-2-19H77l3 37 48 13z"
      />
      <path
        fill="#fff"
        d="M128 108v23h29l-3 30-26 7v24l48-13 7-71zm0-47v23h56l2-23z"
      />
    </svg>
  );
}

/* React — atom */
function ReactLogo(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="-10.5 -9.45 21 18.9" xmlns="http://www.w3.org/2000/svg" {...p}>
      <circle r="2" fill="#61DAFB" />
      <g stroke="#61DAFB" strokeWidth="1" fill="none">
        <ellipse rx="10" ry="4.5" />
        <ellipse rx="10" ry="4.5" transform="rotate(60)" />
        <ellipse rx="10" ry="4.5" transform="rotate(120)" />
      </g>
    </svg>
  );
}

/* AI/ML — neyron */
function AILogo(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...p}>
      <path
        d="M12 2l1.5 3L17 6l-3 2 1 3.5-3-1.5-3 1.5 1-3.5-3-2 3.5-1z"
        fill="currentColor"
        opacity="0.9"
      />
      <circle cx="12" cy="18" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 15v-3M9 18h-3M15 18h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/* Fallback — code brackets */
function GenericCode(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...p}>
      <path
        d="M8 6l-6 6 6 6M16 6l6 6-6 6M14 4l-4 16"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
