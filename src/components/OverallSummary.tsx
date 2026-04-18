import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useLang } from "@/contexts/LangContext";
import { useTranslated } from "@/services/translate";

interface OverallSummaryProps {
  totalTests: number;
  normalTests: number;
  abnormalTests: number;
  summary: string;
  panelCount: number;
}

const AnimatedNumber = ({ value, delay }: { value: number; delay: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 15 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.5, type: "spring" }}
      className="text-2xl font-display font-bold"
    >
      {value}
    </motion.div>
  );
};

const OverallSummary = ({ totalTests, normalTests, abnormalTests, summary, panelCount }: OverallSummaryProps) => {
  const { lang } = useLang();
  const tTitle = useTranslated("Overall Summary", lang);
  const tDetected = useTranslated("Test panels detected", lang);
  const tTotal = useTranslated("Total Tests", lang);
  const tNormal = useTranslated("Normal", lang);
  const tNeed = useTranslated("Need Attention", lang);
  const tSummary = useTranslated(summary, lang);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="panel-card p-6 gradient-border"
    >
      <h3 className="font-display text-lg font-semibold text-foreground mb-4">{tTitle}</h3>
      <div className="text-sm text-muted-foreground mb-4">{tDetected}: {panelCount}</div>

      <div className="grid grid-cols-3 gap-3 mb-5">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-secondary rounded-xl p-3 text-center cursor-default transition-colors"
        >
          <AnimatedNumber value={totalTests} delay={0.4} />
          <div className="text-xs text-muted-foreground mt-0.5">{tTotal}</div>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-status-normal/10 rounded-xl p-3 text-center cursor-default"
        >
          <div className="text-status-normal">
            <AnimatedNumber value={normalTests} delay={0.6} />
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">{tNormal}</div>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-status-critical/10 rounded-xl p-3 text-center cursor-default"
        >
          <div className="text-status-critical">
            <AnimatedNumber value={abnormalTests} delay={0.8} />
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">{tNeed}</div>
        </motion.div>
      </div>

      <p className="text-sm text-foreground/80 leading-relaxed">{tSummary}</p>
    </motion.div>
  );
};

export default OverallSummary;
