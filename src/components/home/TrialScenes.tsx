"use client";

import { useRef } from "react";
import { motion, useAnimationFrame, useReducedMotion } from "framer-motion";

/**
 * Buca Yıldız — Ücretsiz Deneme sahneleri (framer-motion).
 * Her sahne kendi içinde bütün bir SVG kompozisyonudur (520×300, .tj-scene
 * kabuğu içinde). Uzuv dönüşleri SVG `rotate(a cx cy)` özniteliğiyle
 * useAnimationFrame üzerinden sürülür (CSS transform-origin tuzaklarına
 * girmeden eklem etrafında kusursuz dönüş). Kaydırma/opaklık koreografileri
 * motion keyframe'leriyle yapılır. prefers-reduced-motion'da tüm döngüler
 * durur, sahne son karesinde sabit kalır.
 */

const TAU = Math.PI * 2;

/* ---------- palet ---------- */
const C = {
  skin: "#E8B285",
  skinDim: "#C79468",
  shirt: "#F2F5FB",
  shirtDim: "#C6D0E4",
  shorts: "#1D3765",
  shortsDim: "#152A4F",
  sock: "#E9C860",
  boot: "#0E1D3A",
  gold: "#C9A227",
  gold300: "#DDBB4E",
  white: "#FFFFFF",
  line: "rgba(255,255,255,0.35)",
};

/* ---------- animasyon ilkelleri (öznitelik tabanlı, origin-güvenli) ---------- */

/** Eklem etrafında sinüs salınımı: rotate(a px py). */
function RotG({
  pivot = [0, 0] as [number, number],
  center = 0,
  amp = 0,
  period = 1,
  phase = 0,
  paused = false,
  children,
}: {
  pivot?: [number, number];
  center?: number;
  amp?: number;
  period?: number;
  phase?: number;
  paused?: boolean;
  children: React.ReactNode;
}) {
  const ref = useRef<SVGGElement>(null);
  useAnimationFrame((t) => {
    if (paused || !ref.current) return;
    const a = center + amp * Math.sin(((t / 1000) * TAU) / period + phase);
    ref.current.setAttribute("transform", `rotate(${a.toFixed(2)} ${pivot[0]} ${pivot[1]})`);
  });
  return <g ref={ref} transform={`rotate(${center} ${pivot[0]} ${pivot[1]})`}>{children}</g>;
}

/** Sürekli dönüş (saat ibresi, ışınlar, top). */
function SpinG({
  cx = 0,
  cy = 0,
  period = 4,
  paused = false,
  children,
}: {
  cx?: number;
  cy?: number;
  period?: number;
  paused?: boolean;
  children: React.ReactNode;
}) {
  const ref = useRef<SVGGElement>(null);
  useAnimationFrame((t) => {
    if (paused || !ref.current) return;
    const a = (((t / 1000) / period) * 360) % 360;
    ref.current.setAttribute("transform", `rotate(${a.toFixed(1)} ${cx} ${cy})`);
  });
  return <g ref={ref}>{children}</g>;
}

/** Dikey zıplama/nefes (translate y). */
function BobG({
  amp = 0,
  period = 1,
  phase = 0,
  jump = false,
  paused = false,
  children,
}: {
  amp?: number;
  period?: number;
  phase?: number;
  /** true: |sin| — yere basıp sıçrama hissi */
  jump?: boolean;
  paused?: boolean;
  children: React.ReactNode;
}) {
  const ref = useRef<SVGGElement>(null);
  useAnimationFrame((t) => {
    if (paused || !ref.current) return;
    const s = Math.sin(((t / 1000) * TAU) / period + phase);
    const y = jump ? -Math.abs(s) * amp : s * amp;
    ref.current.setAttribute("transform", `translate(0 ${y.toFixed(2)})`);
  });
  return <g ref={ref}>{children}</g>;
}

/** İki nokta arasında mekik (gidiş-dönüş + yön çevirme). */
function ShuttleG({
  x0,
  x1,
  y,
  period,
  paused = false,
  children,
}: {
  x0: number;
  x1: number;
  y: number;
  period: number;
  paused?: boolean;
  children: React.ReactNode;
}) {
  const ref = useRef<SVGGElement>(null);
  useAnimationFrame((t) => {
    if (paused || !ref.current) return;
    const p = ((t / 1000) % period) / period; // 0..1
    const tri = p < 0.5 ? p * 2 : 2 - p * 2; // 0→1→0
    const e = tri * tri * (3 - 2 * tri); // smoothstep
    const x = x0 + (x1 - x0) * e;
    const dir = p < 0.5 ? 1 : -1;
    ref.current.setAttribute("transform", `translate(${x.toFixed(1)} ${y}) scale(${dir} 1)`);
  });
  return <g ref={ref} transform={`translate(${x0} ${y})`}>{children}</g>;
}

/** Soldan sağa akan döngü (merdiven koşusu). */
function ConveyorG({
  x0,
  x1,
  y,
  period,
  paused = false,
  children,
}: {
  x0: number;
  x1: number;
  y: number;
  period: number;
  paused?: boolean;
  children: React.ReactNode;
}) {
  const ref = useRef<SVGGElement>(null);
  useAnimationFrame((t) => {
    if (paused || !ref.current) return;
    const p = ((t / 1000) % period) / period;
    const x = x0 + (x1 - x0) * p;
    const fade = p < 0.06 ? p / 0.06 : p > 0.94 ? (1 - p) / 0.06 : 1;
    ref.current.setAttribute("transform", `translate(${x.toFixed(1)} ${y})`);
    ref.current.setAttribute("opacity", fade.toFixed(2));
  });
  return <g ref={ref} transform={`translate(${x0} ${y})`}>{children}</g>;
}

/* ---------- sporcu figürü ---------- */

type Pose = "run" | "sprint" | "skip" | "stand" | "celebrate";

type LimbProps = { pose: Pose; phase: number; dim?: boolean; paused: boolean };

function poseParams(pose: Pose) {
  const run = pose === "run" || pose === "sprint" || pose === "skip";
  const period = pose === "sprint" ? 0.42 : pose === "skip" ? 0.5 : 0.56;
  return {
    run,
    period,
    thighAmp: pose === "skip" ? 50 : run ? 36 : 0,
    lean: pose === "sprint" ? -12 : pose === "run" ? -8 : pose === "skip" ? -4 : 0,
    armAmp: run ? 34 : pose === "celebrate" ? 9 : 4,
    armCenter: pose === "celebrate" ? 168 : run ? 4 : 7,
    elbow: run ? -78 : pose === "celebrate" ? -18 : -10,
    bobAmp: run ? 2 : pose === "celebrate" ? 9 : 1.1,
    bobPeriod: run ? period / 2 : pose === "celebrate" ? 0.85 : 3.2,
  };
}

function AthleteLeg({ pose, phase, dim, paused }: LimbProps) {
  const p = poseParams(pose);
  return (
    <g transform="translate(0 -40)">
      <RotG amp={p.thighAmp} period={p.period} phase={phase} center={pose === "celebrate" ? (phase === 0 ? -10 : 10) : 0} paused={paused}>
        {/* uyluk */}
        <line x1="0" y1="2" x2="0" y2="22" stroke={dim ? C.skinDim : C.skin} strokeWidth="7.5" strokeLinecap="round" />
        {/* diz altı — koşuda faz kaymalı bükülme */}
        <g transform="translate(0 22)">
          <RotG amp={p.run ? 34 : 0} period={p.period} phase={phase + 1.05} center={p.run ? 26 : 2} paused={paused}>
            <line x1="0" y1="0" x2="0" y2="14" stroke={dim ? C.skinDim : C.skin} strokeWidth="6.2" strokeLinecap="round" />
            <line x1="0" y1="9" x2="0" y2="15" stroke={dim ? "#C7A64A" : C.sock} strokeWidth="6.6" strokeLinecap="round" />
            <ellipse cx="3.4" cy="17.4" rx="5" ry="2.6" fill={C.boot} />
          </RotG>
        </g>
      </RotG>
    </g>
  );
}

function AthleteArm({ pose, phase, dim, paused }: LimbProps) {
  const p = poseParams(pose);
  return (
    <g transform="translate(0 -70)">
      <RotG
        amp={p.armAmp}
        period={pose === "celebrate" ? 0.85 : p.period}
        phase={phase}
        center={pose === "celebrate" ? (phase === 0 ? p.armCenter : -p.armCenter) : p.armCenter * (phase === 0 ? 1 : -1)}
        paused={paused}
      >
        <line x1="0" y1="2" x2="0" y2="16" stroke={dim ? C.shirtDim : C.shirt} strokeWidth="6" strokeLinecap="round" />
        <g transform="translate(0 16)">
          <RotG amp={p.run ? 10 : 3} period={p.period} phase={phase} center={p.elbow} paused={paused}>
            <line x1="0" y1="0" x2="0" y2="12" stroke={dim ? C.skinDim : C.skin} strokeWidth="5.2" strokeLinecap="round" />
            <circle cx="0" cy="13.6" r="2.9" fill={dim ? C.skinDim : C.skin} />
          </RotG>
        </g>
      </RotG>
    </g>
  );
}

/** Eklemli sporcu: ayak tabanı y=0, kalça (0,-40). Yaklaşık 96 birim boy. */
function Athlete({ pose, paused = false }: { pose: Pose; paused?: boolean }) {
  const p = poseParams(pose);
  return (
    <BobG amp={p.bobAmp} period={p.bobPeriod} jump={pose === "celebrate" || p.run} paused={paused}>
      {/* gövde eğimi kalçadan */}
      <g transform={`rotate(${p.lean} 0 -40)`}>
        {/* arka uzuvlar */}
        <AthleteArm pose={pose} phase={0} dim paused={paused} />
        <AthleteLeg pose={pose} phase={Math.PI} dim paused={paused} />
        {/* gövde */}
        <line x1="0" y1="-72" x2="0" y2="-46" stroke={C.shirt} strokeWidth="14.5" strokeLinecap="round" />
        <line x1="0" y1="-49" x2="0" y2="-46" stroke={C.gold} strokeWidth="14.5" strokeLinecap="butt" opacity=".85" />
        <circle cx="-2.5" cy="-63" r="1.8" fill={C.gold} />
        {/* şort */}
        <line x1="0" y1="-45" x2="0" y2="-35" stroke={C.shorts} strokeWidth="15.5" strokeLinecap="round" />
        {/* boyun + baş */}
        <line x1="0" y1="-80" x2="0" y2="-74" stroke={C.skin} strokeWidth="4.6" />
        <circle cx="0.5" cy="-87" r="8.2" fill={C.skin} />
        <path d="M -7.6 -88.5 A 8.2 8.2 0 0 1 8.6 -88.5 L 8 -92.5 A 8.2 8.2 0 0 0 -7 -92.5 Z" fill="#20355C" />
        {/* ön uzuvlar */}
        <AthleteLeg pose={pose} phase={0} paused={paused} />
        <AthleteArm pose={pose} phase={Math.PI} paused={paused} />
      </g>
    </BobG>
  );
}

/* ---------- ortak sahne parçaları ---------- */

function Field({ id }: { id: string }) {
  return (
    <>
      <defs>
        <linearGradient id={`${id}-grass`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1E5B38" />
          <stop offset="1" stopColor="#123B23" />
        </linearGradient>
        <radialGradient id={`${id}-flood`} cx="0.5" cy="0" r="0.9">
          <stop offset="0" stopColor="rgba(233,200,96,0.14)" />
          <stop offset="0.55" stopColor="rgba(233,200,96,0.04)" />
          <stop offset="1" stopColor="rgba(233,200,96,0)" />
        </radialGradient>
      </defs>
      {/* projektör ışığı */}
      <rect x="0" y="0" width="520" height="300" fill={`url(#${id}-flood)`} />
      {/* çim */}
      <rect x="0" y="252" width="520" height="48" fill={`url(#${id}-grass)`} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} x={i * 90 - 20} y="252" width="45" height="48" fill="rgba(255,255,255,0.03)" />
      ))}
      <line x1="0" y1="252.5" x2="520" y2="252.5" stroke="rgba(255,255,255,0.28)" strokeWidth="1.5" />
      <path d="M 190 300 A 70 34 0 0 1 330 300" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="1.5" />
    </>
  );
}

function Cone({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="1.5" rx="10" ry="3" fill="rgba(0,0,0,0.35)" />
      <path d="M -8 0 L -2.6 -18 L 2.6 -18 L 8 0 Z" fill={C.gold} />
      <path d="M -5.4 -8.5 L 5.4 -8.5 L 4.4 -12 L -4.4 -12 Z" fill="#FFF6DC" opacity=".9" />
      <rect x="-10" y="-1.5" width="20" height="3" rx="1.5" fill="#9A7A1B" />
    </g>
  );
}

/** Ölçüm çipi: sahne içinde cam-altın rozet. */
function Chip({ x, y, w = 104, big, small, delay = 0 }: { x: number; y: number; w?: number; big: string; small: string; delay?: number }) {
  return (
    <motion.g
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ type: "spring", stiffness: 300, damping: 22, delay }}
    >
      <motion.g
        animate={{ y: [0, -3.5, 0] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut", delay: delay + 0.6 }}
      >
        <rect x={x} y={y} width={w} height="42" rx="11" fill="rgba(8,15,33,0.72)" stroke="rgba(201,162,39,0.55)" strokeWidth="1" />
        <text x={x + 14} y={y + 19} fill={C.gold300} style={{ fontFamily: "var(--font-stat)", fontWeight: 700, fontSize: 15 }}>{big}</text>
        <text x={x + 14} y={y + 34} fill="rgba(255,255,255,0.6)" style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 9.5, letterSpacing: ".08em", textTransform: "uppercase" }}>{small}</text>
      </motion.g>
    </motion.g>
  );
}

function SceneSvg({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="tj-scene">
      <svg viewBox="0 0 520 300" role="img" aria-label={label} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        {children}
      </svg>
    </div>
  );
}

/* ============================================================
   SAHNE 01 — Vücut profili: tarama ışını + ölçüm çipleri
   ============================================================ */
export function SceneBody() {
  const reduce = !!useReducedMotion();
  return (
    <SceneSvg label="Vücut profili ölçümü animasyonu">
      <Field id="tj1" />
      <defs>
        <linearGradient id="tj1-scan" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="rgba(233,200,96,0)" />
          <stop offset="0.75" stopColor="rgba(233,200,96,0.18)" />
          <stop offset="1" stopColor="rgba(233,200,96,0.75)" />
        </linearGradient>
      </defs>

      {/* boy cetveli */}
      <motion.g initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.35, duration: 0.6 }}>
        <line x1="150" y1="98" x2="150" y2="252" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <line key={i} x1="150" y1={98 + i * 22} x2={i % 2 === 0 ? 160 : 156} y2={98 + i * 22} stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
        ))}
        <line x1="144" y1="98" x2="290" y2="98" stroke="rgba(233,200,96,0.5)" strokeWidth="1" strokeDasharray="4 4" />
      </motion.g>

      {/* köşe braketleri */}
      {(
        [
          ["M 178 66 h -22 v 22", "M 342 66 h 22 v 22"],
          ["M 178 268 h -22 v -22", "M 342 268 h 22 v -22"],
        ] as const
      ).flat().map((d, i) => (
        <motion.path
          key={d}
          d={d}
          fill="none"
          stroke={C.gold}
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, delay: 0.15 + i * 0.08, ease: "easeOut" }}
        />
      ))}

      {/* sporcu */}
      <g transform="translate(260 254) scale(1.62)">
        <ellipse cx="0" cy="1" rx="26" ry="5" fill="rgba(0,0,0,0.35)" />
        <Athlete pose="stand" paused={reduce} />
      </g>

      {/* tarama ışını */}
      {!reduce && (
        <motion.g
          animate={{ y: [0, 178, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <rect x="162" y="30" width="196" height="46" fill="url(#tj1-scan)" />
          <line x1="162" y1="76" x2="358" y2="76" stroke={C.gold300} strokeWidth="2" opacity="0.9" />
        </motion.g>
      )}

      {/* ölçüm çipleri */}
      <Chip x={372} y={86} big="%12,4" small="Yağ Oranı" delay={0.25} />
      <Chip x={372} y={142} big="%41" small="Kas Oranı" delay={0.45} />
      <Chip x={372} y={198} big="19,8" small="VKİ" delay={0.65} />
      <Chip x={44} y={120} w={96} big="142 cm" small="Boy" delay={0.55} />
      <Chip x={44} y={176} w={96} big="36 kg" small="Kilo" delay={0.75} />
    </SceneSvg>
  );
}

/* ============================================================
   SAHNE 02 — Kondisyon & sürat: mekik koşusu + nabız + kronometre
   ============================================================ */
export function SceneSprint() {
  const reduce = !!useReducedMotion();
  return (
    <SceneSvg label="Sürat ve kondisyon testi animasyonu">
      <Field id="tj2" />
      {/* kulvar çizgileri */}
      <line x1="76" y1="264" x2="444" y2="264" stroke="rgba(255,255,255,0.22)" strokeWidth="2" strokeDasharray="10 12" />
      <line x1="76" y1="238" x2="76" y2="266" stroke="rgba(255,255,255,0.5)" strokeWidth="2.5" />
      <line x1="444" y1="238" x2="444" y2="266" stroke="rgba(255,255,255,0.5)" strokeWidth="2.5" />
      <Cone x={62} y={258} />
      <Cone x={458} y={258} />

      {/* koşucu — mekik */}
      <ShuttleG x0={116} x1={404} y={256} period={4.4} paused={reduce}>
        {/* hız izleri */}
        <motion.g animate={reduce ? undefined : { opacity: [0.15, 0.7, 0.15] }} transition={{ duration: 0.5, repeat: Infinity }}>
          <line x1="-44" y1="-64" x2="-20" y2="-64" stroke={C.gold300} strokeWidth="3" strokeLinecap="round" opacity="0.55" />
          <line x1="-52" y1="-46" x2="-24" y2="-46" stroke="rgba(255,255,255,0.5)" strokeWidth="3" strokeLinecap="round" />
          <line x1="-40" y1="-26" x2="-18" y2="-26" stroke={C.gold300} strokeWidth="3" strokeLinecap="round" opacity="0.4" />
        </motion.g>
        <ellipse cx="0" cy="1" rx="24" ry="4.6" fill="rgba(0,0,0,0.35)" />
        <g transform="scale(1.45)">
          <Athlete pose="sprint" paused={reduce} />
        </g>
      </ShuttleG>

      {/* kronometre çipi */}
      <motion.g initial={{ opacity: 0, y: -12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ type: "spring", stiffness: 280, damping: 22, delay: 0.2 }}>
        <rect x="34" y="26" width="150" height="46" rx="12" fill="rgba(8,15,33,0.72)" stroke="rgba(201,162,39,0.55)" />
        <circle cx="60" cy="49" r="13" fill="none" stroke={C.gold300} strokeWidth="2.5" />
        <rect x="57.5" y="30" width="5" height="4" rx="1" fill={C.gold300} />
        <SpinG cx={60} cy={49} period={4.4} paused={reduce}>
          <line x1="60" y1="49" x2="60" y2="39.5" stroke={C.gold300} strokeWidth="2.2" strokeLinecap="round" />
        </SpinG>
        <text x="84" y="45" fill="#fff" style={{ fontFamily: "var(--font-stat)", fontWeight: 700, fontSize: 15 }}>10-20-30 m</text>
        <text x="84" y="62" fill="rgba(255,255,255,0.6)" style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 10, letterSpacing: ".08em" }}>SÜRAT TESTİ</text>
      </motion.g>

      {/* nabız monitörü */}
      <motion.g initial={{ opacity: 0, y: -12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ type: "spring", stiffness: 280, damping: 22, delay: 0.35 }}>
        <rect x="342" y="26" width="144" height="46" rx="12" fill="rgba(8,15,33,0.72)" stroke="rgba(201,162,39,0.55)" />
        <motion.path
          d="M 366 49 c -6 -7 -9 -13 -3.5 -16.5 c 3 -1.8 6 0.4 6.9 2.4 c 0.9 -2 3.9 -4.2 6.9 -2.4 c 5.5 3.5 2.5 9.5 -3.5 16.5 l -3.4 3.6 z"
          fill="#E4574D"
          animate={reduce ? undefined : { scale: [1, 1.22, 1] }}
          transition={{ duration: 0.72, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        />
        <motion.polyline
          points="388,49 398,49 403,38 410,60 416,43 420,49 434,49"
          fill="none"
          stroke={C.gold300}
          strokeWidth="2.2"
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeDasharray="70"
          animate={reduce ? undefined : { strokeDashoffset: [140, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
        />
        <text x="443" y="45" fill="#fff" style={{ fontFamily: "var(--font-stat)", fontWeight: 700, fontSize: 16 }}>168</text>
        <text x="443" y="62" fill="rgba(255,255,255,0.6)" style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 10, letterSpacing: ".06em" }}>BPM</text>
      </motion.g>
    </SceneSvg>
  );
}

/* ============================================================
   SAHNE 03 — Koordinasyon: çeviklik merdiveni
   ============================================================ */
export function SceneLadder() {
  const reduce = !!useReducedMotion();
  const rungs = [90, 132, 174, 216, 258, 300, 342, 384, 426];
  const PERIOD = 5;
  return (
    <SceneSvg label="Koordinasyon merdiveni animasyonu">
      <Field id="tj3" />
      {/* merdiven (yerde) */}
      <g>
        <line x1="72" y1="242" x2="446" y2="242" stroke="rgba(255,255,255,0.55)" strokeWidth="3" strokeLinecap="round" />
        <line x1="72" y1="270" x2="446" y2="270" stroke="rgba(255,255,255,0.55)" strokeWidth="3" strokeLinecap="round" />
        {rungs.map((x) => (
          <line key={x} x1={x} y1="242" x2={x} y2="270" stroke="rgba(255,255,255,0.45)" strokeWidth="3" strokeLinecap="round" />
        ))}
        {/* koşucu geçerken parlayan basamaklar */}
        {!reduce && rungs.map((x, i) => (
          <motion.rect
            key={x}
            x={x - 19}
            y={243.5}
            width="38"
            height="25"
            rx="4"
            fill="rgba(233,200,96,0.38)"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.9, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: PERIOD - 0.5, delay: (i / rungs.length) * PERIOD * 0.92 + 0.2, ease: "easeOut" }}
          />
        ))}
      </g>

      {/* yüksek dizli koşucu merdiven boyunca akar */}
      <ConveyorG x0={70} x1={450} y={252} period={PERIOD} paused={reduce}>
        <ellipse cx="0" cy="1" rx="23" ry="4.4" fill="rgba(0,0,0,0.32)" />
        <g transform="scale(1.45)">
          <Athlete pose="skip" paused={reduce} />
        </g>
      </ConveyorG>

      {/* ritim noktaları */}
      <motion.g initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
        {[0, 1, 2].map((i) => (
          <motion.circle
            key={i}
            cx={236 + i * 24}
            cy={52}
            r="5"
            fill={C.gold300}
            animate={reduce ? undefined : { opacity: [0.25, 1, 0.25] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.3 }}
          />
        ))}
        <text x="260" y="82" textAnchor="middle" fill="rgba(255,255,255,0.55)" style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 10.5, letterSpacing: ".2em" }}>RİTİM · DENGE · KOORDİNASYON</text>
      </motion.g>
    </SceneSvg>
  );
}

/* ============================================================
   SAHNE 04 — Top becerisi: slalom + şut + GOL
   ============================================================ */
export function SceneDribble() {
  const reduce = !!useReducedMotion();
  const DUR = 6.4;
  // zaman payları: 0-0.58 slalom · 0.58-0.66 şut hazırlığı · 0.66-0.78 top ağlarda · 0.78-1 kutlama/reset
  const times = [0, 0.16, 0.32, 0.48, 0.58, 0.66, 0.95, 1];
  return (
    <SceneSvg label="Top sürme ve şut animasyonu">
      <Field id="tj4" />
      {/* kale */}
      <g>
        <rect x="428" y="128" width="78" height="126" fill="rgba(255,255,255,0.05)" />
        <path d="M 428 128 h 78 v 126" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
        {[0, 1, 2, 3, 4].map((i) => (
          <line key={`v${i}`} x1={438 + i * 15} y1="130" x2={438 + i * 15} y2="252" stroke="rgba(255,255,255,0.22)" strokeWidth="1" />
        ))}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <line key={`h${i}`} x1="430" y1={140 + i * 19} x2="504" y2={140 + i * 19} stroke="rgba(255,255,255,0.22)" strokeWidth="1" />
        ))}
        {/* gol anı ağ parlaması */}
        <motion.rect
          x="428" y="128" width="78" height="126" fill="rgba(233,200,96,0.5)"
          initial={{ opacity: 0 }}
          animate={reduce ? undefined : { opacity: [0, 0, 0, 0, 0, 0.85, 0, 0] }}
          transition={{ duration: DUR, times: [0, 0.6, 0.64, 0.66, 0.675, 0.7, 0.8, 1], repeat: Infinity }}
        />
      </g>

      <Cone x={170} y={256} s={0.9} />
      <Cone x={244} y={256} s={0.9} />
      <Cone x={318} y={256} s={0.9} />

      {/* koşucu: slalom → şut duruşu */}
      <motion.g
        initial={false}
        animate={reduce ? undefined : { x: [46, 152, 226, 300, 356, 372, 372, 46], y: [0, -13, 11, -13, 0, 0, 0, 0] }}
        transition={{ duration: DUR, times, repeat: Infinity, ease: "easeInOut" }}
        style={reduce ? { x: 356 } : undefined}
      >
        <g transform="translate(0 256)">
          <ellipse cx="0" cy="1" rx="23" ry="4.4" fill="rgba(0,0,0,0.32)" />
          <g transform="scale(1.45)">
            <Athlete pose="run" paused={reduce} />
          </g>
        </g>
      </motion.g>

      {/* top: sporcunun önünde slalom → ağlara */}
      <motion.g
        initial={false}
        animate={reduce ? undefined : {
          x: [72, 178, 252, 326, 384, 470, 470, 72],
          y: [0, -10, 8, -10, 0, -58, -58, 0],
          opacity: [1, 1, 1, 1, 1, 1, 0, 0],
        }}
        transition={{ duration: DUR, times, repeat: Infinity, ease: "easeInOut" }}
        style={reduce ? { x: 470, y: -58 } : undefined}
      >
        <g transform="translate(0 248)">
          <SpinG cx={0} cy={0} period={0.9} paused={reduce}>
            <circle cx="0" cy="0" r="7.5" fill="#fff" stroke="#0B1830" strokeWidth="1" />
            <path d="M 0 -3.4 L 3.2 -1 L 2 2.8 L -2 2.8 L -3.2 -1 Z" fill="#0B1830" />
            <line x1="0" y1="-3.4" x2="0" y2="-7.5" stroke="#0B1830" strokeWidth="1" />
            <line x1="3.2" y1="-1" x2="7.2" y2="-2.2" stroke="#0B1830" strokeWidth="1" />
            <line x1="-3.2" y1="-1" x2="-7.2" y2="-2.2" stroke="#0B1830" strokeWidth="1" />
          </SpinG>
        </g>
      </motion.g>

      {/* GOL! */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={reduce ? { opacity: 1 } : { opacity: [0, 0, 0.001, 1, 1, 0], y: [16, 16, 16, 0, 0, -8] }}
        transition={reduce ? undefined : { duration: DUR, times: [0, 0.66, 0.68, 0.72, 0.88, 0.97], repeat: Infinity, ease: "easeOut" }}
      >
        <text x="300" y="96" textAnchor="middle" fill={C.gold300} stroke="rgba(8,15,33,0.6)" strokeWidth="0.5" style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 46, letterSpacing: ".04em" }}>GOL!</text>
      </motion.g>
    </SceneSvg>
  );
}

/* ============================================================
   SAHNE 05 — Kişiye özel yol haritası
   ============================================================ */
export function SceneRoad() {
  const reduce = !!useReducedMotion();
  const PATH = "M60,252 C140,252 150,188 220,188 C290,188 300,120 360,140 C405,155 412,150 432,150";
  return (
    <SceneSvg label="Kişiye özel gelişim yol haritası animasyonu">
      <Field id="tj5" />
      {/* plan kartı */}
      <motion.g initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ type: "spring", stiffness: 260, damping: 24, delay: 0.2 }}>
        <rect x="44" y="42" width="150" height="98" rx="12" fill="rgba(8,15,33,0.72)" stroke="rgba(201,162,39,0.55)" />
        <text x="60" y="66" fill={C.gold300} style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 13, letterSpacing: ".1em" }}>GELİŞİM PLANI</text>
        {[0, 1, 2].map((i) => (
          <motion.line
            key={i}
            x1="60"
            y1={80 + i * 14}
            x2={60 + [104, 76, 92][i]}
            y2={80 + i * 14}
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.55, delay: 0.55 + i * 0.18, ease: "easeOut" }}
          />
        ))}
        <motion.g initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.4 }} transition={{ type: "spring", stiffness: 320, damping: 18, delay: 1.15 }}>
          <circle cx="172" cy="120" r="9" fill="#2F9E5B" />
          <path d="M 167.5 120 l 3.2 3.4 l 5.8 -7" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </motion.g>
      </motion.g>

      {/* rota */}
      <path d={PATH} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="5" strokeLinecap="round" strokeDasharray="1 10" />
      <motion.path
        d={PATH}
        fill="none"
        stroke={C.gold}
        strokeWidth="4"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1.7, ease: [0.4, 0, 0.2, 1], delay: 0.35 }}
      />
      {/* rota üzerinde ilerleyen ışık */}
      {!reduce && (
        <motion.circle
          r="5.5"
          fill="#fff"
          stroke={C.gold}
          strokeWidth="2"
          style={{ offsetPath: `path("${PATH}")` }}
          initial={{ offsetDistance: "0%", opacity: 0 }}
          whileInView={{ offsetDistance: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 2.6, repeat: Infinity, repeatDelay: 1.1, ease: "easeInOut", delay: 0.5 }}
        />
      )}

      {/* duraklar */}
      {[
        [60, 252, 0.5],
        [220, 188, 0.95],
        [360, 140, 1.5],
      ].map(([cx, cy, d]) => (
        <motion.circle
          key={cx}
          cx={cx}
          cy={cy}
          fill="#fff"
          stroke={C.gold}
          strokeWidth="3"
          initial={{ r: 0 }}
          whileInView={{ r: 7 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ type: "spring", stiffness: 380, damping: 16, delay: d as number }}
        />
      ))}

      {/* hedef yıldız */}
      <motion.g
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ type: "spring", stiffness: 300, damping: 15, delay: 2 }}
      >
        <motion.text
          x="432"
          y="163"
          textAnchor="middle"
          fontSize="42"
          fill={C.gold300}
          animate={reduce ? undefined : { opacity: [1, 0.55, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 2.4 }}
        >★</motion.text>
      </motion.g>
    </SceneSvg>
  );
}

/* ============================================================
   SAHNE 06 — Geleceğin yıldızı: kutlama
   ============================================================ */
export function SceneStar() {
  const reduce = !!useReducedMotion();
  const star = "M 0 -34 L 9.6 -10.6 L 34 -8.4 L 15.4 7.6 L 21 31 L 0 17.6 L -21 31 L -15.4 7.6 L -34 -8.4 L -9.6 -10.6 Z";
  return (
    <SceneSvg label="Geleceğin yıldızı kutlama animasyonu">
      <Field id="tj6" />
      <defs>
        <radialGradient id="tj6-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="rgba(233,200,96,0.5)" />
          <stop offset="1" stopColor="rgba(233,200,96,0)" />
        </radialGradient>
      </defs>

      {/* dönen ışınlar */}
      <SpinG cx={260} cy={118} period={26} paused={reduce}>
        {[0, 30, 60, 90, 120, 150].map((a) => (
          <line key={a} x1="260" y1="118" x2={260 + 190 * Math.cos((a * Math.PI) / 180)} y2={118 + 190 * Math.sin((a * Math.PI) / 180)} stroke="rgba(233,200,96,0.08)" strokeWidth="26" />
        ))}
      </SpinG>

      {/* ışıma */}
      <motion.circle
        cx="260" cy="118" r="86" fill="url(#tj6-glow)"
        animate={reduce ? undefined : { opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* yıldız */}
      <motion.g initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ type: "spring", stiffness: 220, damping: 15, delay: 0.25 }}>
        <g transform="translate(260 118) scale(1.5)">
          <motion.path
            d={star}
            fill={C.gold300}
            stroke="#8F6E14"
            strokeWidth="1.4"
            animate={reduce ? undefined : { scale: [1, 1.07, 1] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
          />
          <path d="M 0 -34 L 9.6 -10.6 L 34 -8.4 L 0 -8.4 Z" fill="rgba(255,255,255,0.35)" />
        </g>
      </motion.g>

      {/* kıvılcımlar */}
      {[
        [150, 70, 0],
        [372, 84, 0.5],
        [180, 176, 1],
        [348, 168, 1.5],
        [260, 40, 2],
      ].map(([x, y, d]) => (
        <motion.path
          key={`${x}-${y}`}
          d="M 0 -6 L 1.6 -1.6 L 6 0 L 1.6 1.6 L 0 6 L -1.6 1.6 L -6 0 L -1.6 -1.6 Z"
          fill="#fff"
          transform={`translate(${x} ${y})`}
          animate={reduce ? { opacity: 0.7 } : { opacity: [0, 1, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, delay: d as number, ease: "easeInOut" }}
        />
      ))}

      {/* kutlayan sporcu */}
      <g transform="translate(260 256) scale(1.5)">
        <ellipse cx="0" cy="1" rx="24" ry="4.6" fill="rgba(0,0,0,0.35)" />
        <Athlete pose="celebrate" paused={reduce} />
      </g>
    </SceneSvg>
  );
}
