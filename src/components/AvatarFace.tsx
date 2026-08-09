import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { VISEME_SHAPES, type Viseme } from "@/lib/visemes";

/**
 * Mouth calibration — tweak these to line the mouth up with a new photo.
 * Values are percentages of the portrait box.
 */
export const MOUTH_CALIBRATION = {
  centerX: 50, // % from left
  centerY: 72, // % from top
  width: 34, // % of box width
  height: 20, // % of box height
};

interface AvatarFaceProps {
  src: string;
  alt: string;
  viseme: Viseme;
  isSpeaking: boolean;
  /** Pixel size of the square portrait. */
  size?: number;
  className?: string;
}

/**
 * A still portrait with an animated SVG mouth overlay and eye blinks,
 * so an ordinary photo can lip-sync.
 */
export function AvatarFace({
  src,
  alt,
  viseme,
  isSpeaking,
  size = 160,
  className = "",
}: AvatarFaceProps) {
  const shape = VISEME_SHAPES[viseme] ?? VISEME_SHAPES.rest;
  const [blink, setBlink] = useState(false);

  /* Idle eye blink */
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const loop = () => {
      timeout = setTimeout(() => {
        setBlink(true);
        setTimeout(() => setBlink(false), 130);
        loop();
      }, 2600 + Math.random() * 3200);
    };
    loop();
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover select-none pointer-events-none"
        style={{ filter: "saturate(0.75) brightness(1.15) hue-rotate(8deg)" }}
        draggable={false}
      />

      {/* Mouth overlay */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute pointer-events-none"
        style={{
          left: `${MOUTH_CALIBRATION.centerX - MOUTH_CALIBRATION.width / 2}%`,
          top: `${MOUTH_CALIBRATION.centerY - MOUTH_CALIBRATION.height / 2}%`,
          width: `${MOUTH_CALIBRATION.width}%`,
          height: `${MOUTH_CALIBRATION.height}%`,
          opacity: isSpeaking ? 1 : 0.35,
          transition: "opacity 220ms ease",
        }}
      >
        {/* Lip ring */}
        <motion.ellipse
          cx={50}
          cy={50}
          animate={{ rx: shape.rx + 3, ry: shape.lipRy }}
          transition={{ type: "spring", stiffness: 700, damping: 26, mass: 0.4 }}
          fill="hsl(0 45% 28% / 0.55)"
        />
        {/* Mouth opening */}
        <motion.ellipse
          cx={50}
          cy={50}
          animate={{ rx: shape.rx, ry: shape.ry }}
          transition={{ type: "spring", stiffness: 800, damping: 24, mass: 0.35 }}
          fill="hsl(350 40% 12% / 0.92)"
        />
        {/* Upper teeth hint on open shapes */}
        <motion.rect
          x={50 - shape.rx * 0.7}
          animate={{
            y: 50 - shape.ry,
            width: shape.rx * 1.4,
            height: Math.min(2.6, shape.ry * 0.45),
            opacity: shape.ry > 4 ? 0.75 : 0,
          }}
          transition={{ duration: 0.08 }}
          rx={1}
          fill="hsl(0 0% 96% / 0.8)"
        />
      </svg>

      {/* Eyelid blink strips */}
      <div
        className="absolute inset-x-[18%] pointer-events-none"
        style={{
          top: "38%",
          height: blink ? "7%" : "0%",
          background: "hsl(20 25% 40% / 0.55)",
          filter: "blur(2px)",
          transition: "height 90ms ease",
          borderRadius: 4,
        }}
      />

      {/* Hologram tint */}
      <div className="absolute inset-0 bg-holo/20 mix-blend-overlay pointer-events-none" />
    </div>
  );
}

export default AvatarFace;
