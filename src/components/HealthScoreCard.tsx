import { motion } from "framer-motion";
import { CheckCircle, AlertTriangle, XCircle, TrendingUp, Heart } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useLang } from "@/contexts/LangContext";
import { useTranslated } from "@/services/translate";

interface HealthScoreCardProps {
  score: number;
  grade: string;
  optimal: number;
  attention: number;
  critical: number;
}

const AnimatedCounter = ({ target, delay = 0 }: { target: number; delay?: number }) => {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => {
      const duration = 1200;
      const start = performance.now();
      const step = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplay(Math.round(eased * target));
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, delay);
    return () => clearTimeout(timer);
  }, [target, delay]);
  return <>{display}</>;
};

const HealthScoreCard = ({ score, grade, optimal, attention, critical }: HealthScoreCardProps) => {
  const { lang } = useLang();
  const tHealth = useTranslated("Health Score", lang);
  const tOptimal = useTranslated("Optimal", lang);
  const tAttention = useTranslated("Attention", lang);
  const tCritical = useTranslated("Critical", lang);
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const normalizedScore = Math.max(0, Math.min(100, score));
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  const scoreColor =
    normalizedScore >= 80 ? "hsl(var(--status-normal))" :
    normalizedScore >= 60 ? "hsl(var(--status-attention))" :
    "hsl(var(--status-critical))";

  const gradeColor =
    normalizedScore >= 80 ? "text-status-normal" :
    normalizedScore >= 60 ? "text-status-attention" :
    "text-status-critical";

  const bgGlow =
    normalizedScore >= 80 ? "from-status-normal/8 via-status-normal/3" :
    normalizedScore >= 60 ? "from-status-attention/8 via-status-attention/3" :
    "from-status-critical/8 via-status-critical/3";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="panel-card p-5 relative overflow-hidden gradient-border"
    >
      {/* Medical-themed animated bg — cardiac pulse gradient */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${bgGlow} to-transparent pointer-events-none`}
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating medical cross particles */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            backgroundColor: scoreColor,
            left: `${20 + i * 20}%`,
            top: `${15 + (i % 3) * 25}%`,
          }}
          animate={{
            y: [0, -8, 0],
            opacity: [0.15, 0.4, 0.15],
            scale: [1, 1.5, 1],
          }}
          transition={{ duration: 2.5 + i * 0.5, repeat: Infinity, delay: i * 0.6 }}
        />
      ))}

      <div className="flex items-center gap-2 mb-3 relative z-10">
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Heart className="w-4 h-4 text-primary" fill="currentColor" />
        </motion.div>
        <h3 className="font-display text-base font-semibold text-foreground">{tHealth}</h3>
      </div>

      <div className="flex items-center gap-6 relative z-10">
        {/* Circular gauge */}
        <div className="relative flex-shrink-0">
          <svg width="120" height="120" viewBox="0 0 120 120">
            {/* Segmented background track */}
            <circle
              cx="60" cy="60" r={radius}
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="8"
              strokeDasharray="4 2"
              opacity={0.5}
            />
            {/* Score arc with animated gradient feel */}
            <motion.circle
              cx="60" cy="60" r={radius}
              fill="none"
              stroke={scoreColor}
              strokeWidth="9"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 2, ease: [0.33, 1, 0.68, 1], delay: 0.3 }}
              transform="rotate(-90 60 60)"
              style={{ filter: `drop-shadow(0 0 6px ${scoreColor})` }}
            />
            {/* Tick marks at 25%, 50%, 75% */}
            {[25, 50, 75].map((pct) => {
              const angle = (pct / 100) * 360 - 90;
              const rad = (angle * Math.PI) / 180;
              const x1 = 60 + (radius - 5) * Math.cos(rad);
              const y1 = 60 + (radius - 5) * Math.sin(rad);
              const x2 = 60 + (radius + 5) * Math.cos(rad);
              const y2 = 60 + (radius + 5) * Math.sin(rad);
              return (
                <line key={pct} x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke="hsl(var(--muted-foreground))" strokeWidth="1" opacity={0.3}
                />
              );
            })}
            {/* Endpoint dot */}
            <motion.circle
              cx="60"
              cy={60 - radius}
              r="5"
              fill={scoreColor}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2.2, type: "spring" }}
              transform={`rotate(${(normalizedScore / 100) * 360} 60 60)`}
              style={{ filter: `drop-shadow(0 0 6px ${scoreColor})` }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              className="text-3xl font-display font-bold tabular-nums"
              style={{ color: scoreColor }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
            >
              <AnimatedCounter target={normalizedScore} delay={300} />
            </motion.span>
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">/ 100</span>
            <motion.span
              className={`text-sm font-display font-bold mt-0.5 ${gradeColor}`}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, type: "spring" }}
            >
              {grade}
            </motion.span>
          </div>
        </div>

        {/* Breakdown stats */}
        <div className="flex flex-col gap-2 flex-1">
          {[
            { icon: CheckCircle, color: "text-status-normal", bg: "bg-status-normal/10", border: "border-status-normal/20", count: optimal, label: tOptimal },
            { icon: AlertTriangle, color: "text-status-attention", bg: "bg-status-attention/10", border: "border-status-attention/20", count: attention, label: tAttention },
            { icon: XCircle, color: "text-status-critical", bg: "bg-status-critical/10", border: "border-status-critical/20", count: critical, label: tCritical },
          ].map(({ icon: Icon, color, bg, border, count, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.15, type: "spring", stiffness: 120 }}
              className={`flex items-center gap-2 p-2 rounded-lg ${bg} border ${border} group cursor-default`}
            >
              <Icon className={`w-3.5 h-3.5 ${color} group-hover:scale-110 transition-transform`} />
              <span className="text-sm text-foreground font-bold tabular-nums">
                <AnimatedCounter target={count} delay={600 + i * 150} />
              </span>
              <span className="text-xs text-muted-foreground">{label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default HealthScoreCard;
