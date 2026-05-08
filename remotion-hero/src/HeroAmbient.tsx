import {
  AbsoluteFill,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React from "react";

/**
 * Ambient backdrop loop for the AI newsletter hero (right-side visual).
 *
 * Renders three pastel circles with organic morphing + a slow rotating
 * conic-gradient halo + drifting micro-dots. No text or chips — those stay
 * as real DOM in the page so they remain hover/click interactive.
 *
 * Designed to loop seamlessly: the closing 30 frames mirror the opening
 * so a video tag with autoplay loop gives an endless ambient feel.
 */

type Blob = {
  baseX: number; // 0..1
  baseY: number; // 0..1
  size: number; // 0..1 of canvas
  hue: string;
  driftAmp: number; // px
  driftSpeed: number; // cycles per loop
  phase: number; // 0..2π
};

const BLOBS: Blob[] = [
  {
    baseX: 0.42,
    baseY: 0.46,
    size: 0.62,
    hue: "rgba(186, 218, 215, 0.55)", // teal pastel
    driftAmp: 18,
    driftSpeed: 0.6,
    phase: 0,
  },
  {
    baseX: 0.66,
    baseY: 0.36,
    size: 0.42,
    hue: "rgba(245, 222, 179, 0.50)", // amber pastel
    driftAmp: 22,
    driftSpeed: 0.8,
    phase: Math.PI / 2,
  },
  {
    baseX: 0.58,
    baseY: 0.66,
    size: 0.38,
    hue: "rgba(247, 200, 188, 0.55)", // coral pastel
    driftAmp: 16,
    driftSpeed: 0.5,
    phase: Math.PI,
  },
];

// 28 micro-particles seeded deterministically so the loop is stable.
const PARTICLES = Array.from({ length: 28 }, (_, i) => {
  const r = (n: number) => {
    const x = Math.sin(n * 9301 + 49297) * 233280;
    return x - Math.floor(x);
  };
  return {
    x: r(i + 1),
    y: r(i + 100),
    size: 2 + r(i + 50) * 4,
    speed: 0.3 + r(i + 200) * 0.7,
    phase: r(i + 300) * Math.PI * 2,
    opacity: 0.25 + r(i + 400) * 0.35,
  };
});

export const HeroAmbient: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames, width, height } = useVideoConfig();

  // 0..1 progress through the loop
  const t = (frame % durationInFrames) / durationInFrames;
  const tau = t * Math.PI * 2;

  // Intro fade-in over first 18 frames so the ambience eases in.
  const introOpacity = spring({
    frame,
    fps: 30,
    config: { damping: 200, stiffness: 60 },
    durationInFrames: 36,
  });

  // Slow halo rotation — full rotation per loop for seamless wrap.
  const haloAngle = t * 360;

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse at center, #fefcf8 0%, #faf5ec 70%, #f4ecd9 100%)",
      }}
    >
      {/* Conic halo — large, soft, slowly rotating */}
      <AbsoluteFill
        style={{
          opacity: 0.35 * introOpacity,
          background: `conic-gradient(from ${haloAngle}deg at 50% 50%,
            rgba(15, 123, 118, 0.10),
            rgba(232, 150, 15, 0.08),
            rgba(232, 97, 74, 0.10),
            rgba(15, 123, 118, 0.10))`,
          filter: "blur(60px)",
        }}
      />

      {/* Three morphing pastel circles */}
      {BLOBS.map((b, i) => {
        const dx = Math.sin(tau * b.driftSpeed + b.phase) * b.driftAmp;
        const dy = Math.cos(tau * b.driftSpeed + b.phase) * b.driftAmp;
        const breathe =
          1 + 0.04 * Math.sin(tau * 1.2 + b.phase); // gentle pulse
        const cx = b.baseX * width + dx;
        const cy = b.baseY * height + dy;
        const r = b.size * Math.min(width, height) * 0.5 * breathe;

        // Organic morph via dynamic borderRadius percentages.
        const a = 50 + 12 * Math.sin(tau * 1.3 + i);
        const c = 50 + 12 * Math.cos(tau * 1.1 + i);
        const e = 50 + 10 * Math.sin(tau * 0.9 + i + 1);
        const g = 50 + 10 * Math.cos(tau * 1.0 + i + 2);

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: cx - r,
              top: cy - r,
              width: r * 2,
              height: r * 2,
              borderRadius: `${a}% ${100 - a}% ${c}% ${100 - c}% / ${e}% ${g}% ${100 - g}% ${100 - e}%`,
              background: b.hue,
              filter: "blur(30px)",
              opacity: introOpacity,
              mixBlendMode: "multiply",
            }}
          />
        );
      })}

      {/* Drifting micro-dots */}
      {PARTICLES.map((p, i) => {
        const px = (p.x + p.speed * t) % 1;
        const py =
          p.y + 0.04 * Math.sin(tau * 2 + p.phase);
        const opacity =
          p.opacity *
          introOpacity *
          (0.6 + 0.4 * Math.sin(tau * 2 + p.phase));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: px * width,
              top: py * height,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              background: "rgba(15, 123, 118, 0.6)",
              opacity,
              boxShadow: "0 0 12px rgba(15, 123, 118, 0.3)",
            }}
          />
        );
      })}

      {/* Soft vignette */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(232, 150, 15, 0.06) 80%, rgba(232, 97, 74, 0.10) 100%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
