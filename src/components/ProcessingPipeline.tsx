import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, FileSearch, FlaskConical, Sparkles, Check } from "lucide-react";

const steps = [
  { icon: ShieldCheck, label: "Removing personal identifiers", color: "text-primary" },
  { icon: FileSearch, label: "Reading document contents", color: "text-accent" },
  { icon: FlaskConical, label: "Extracting test parameters", color: "text-status-attention" },
  { icon: Sparkles, label: "Generating explanations", color: "text-status-normal" },
];

const ProcessingPipeline = () => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timers = steps.map((_, i) =>
      setTimeout(() => setActiveStep(i), i * 800 + 400)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="space-y-3 py-2">
      {steps.map((step, i) => {
        const Icon = step.icon;
        const isActive = i === activeStep;
        const isDone = i < activeStep;

        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15, duration: 0.4 }}
            className={`flex items-center gap-3 p-2.5 rounded-xl transition-all duration-300 ${
              isActive
                ? "bg-primary/10 border border-primary/20"
                : isDone
                ? "bg-status-normal/5 border border-status-normal/10"
                : "bg-secondary/30 border border-transparent"
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
              isDone ? "bg-status-normal/20" : isActive ? "bg-primary/20" : "bg-muted"
            }`}>
              {isDone ? (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
                  <Check className="w-4 h-4 text-status-normal" />
                </motion.div>
              ) : (
                <Icon className={`w-4 h-4 ${isActive ? step.color : "text-muted-foreground"}`} />
              )}
            </div>
            <span className={`text-xs font-medium transition-colors ${
              isActive ? "text-foreground" : isDone ? "text-status-normal" : "text-muted-foreground"
            }`}>
              {step.label}
            </span>
            {isActive && (
              <motion.div
                className="ml-auto w-4 h-4 border-2 border-primary border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
              />
            )}
          </motion.div>
        );
      })}

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mt-2">
        <motion.div
          className="h-full rounded-full hero-gradient"
          initial={{ width: "0%" }}
          animate={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

export default ProcessingPipeline;
