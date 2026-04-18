import { motion } from "framer-motion";
import type { TestStatus } from "@/services/normalRanges";

interface AnimatedMedicalIconProps {
  icon: string;
  status?: "normal" | "attention" | "critical";
  size?: "sm" | "md" | "lg";
}

const statusGlow: Record<string, string> = {
  normal: "shadow-[0_0_16px_hsl(var(--status-normal)/0.4)]",
  attention: "shadow-[0_0_16px_hsl(var(--status-attention)/0.4)]",
  critical: "shadow-[0_0_20px_hsl(var(--status-critical)/0.5)]",
};

const statusBg: Record<string, string> = {
  normal: "bg-status-normal/10 border-status-normal/20",
  attention: "bg-status-attention/10 border-status-attention/20",
  critical: "bg-status-critical/10 border-status-critical/20",
};

const sizeMap = {
  sm: "w-8 h-8 text-lg",
  md: "w-11 h-11 text-2xl",
  lg: "w-14 h-14 text-3xl",
};

export function getStatusFromPanel(normalCount: number, totalCount: number, abnormalCount: number): "normal" | "attention" | "critical" {
  if (abnormalCount === 0) return "normal";
  const abnormalRatio = abnormalCount / totalCount;
  if (abnormalRatio > 0.3) return "critical";
  return "attention";
}

const AnimatedMedicalIcon = ({ icon, status = "normal", size = "md" }: AnimatedMedicalIconProps) => {
  const pulseDelay = Math.random() * 2;

  return (
    <motion.div
      className={`rounded-xl border flex items-center justify-center ${sizeMap[size]} ${statusBg[status]} ${statusGlow[status]} transition-shadow duration-500`}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <motion.span
        animate={{
          scale: status === "critical" ? [1, 1.1, 1] : [1, 1.03, 1],
        }}
        transition={{
          duration: status === "critical" ? 1.5 : 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: pulseDelay,
        }}
      >
        {icon}
      </motion.span>
    </motion.div>
  );
};

export default AnimatedMedicalIcon;
