import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertTriangle, XCircle, ChevronDown } from "lucide-react";
import { useState } from "react";
import type { PanelSummary } from "@/services/labAnalyzer";
import type { TestStatus } from "@/services/normalRanges";
import AnimatedMedicalIcon, { getStatusFromPanel } from "./AnimatedMedicalIcon";

const statusConfig: Record<TestStatus, { icon: typeof CheckCircle; color: string; label: string }> = {
  normal: { icon: CheckCircle, color: "text-status-normal", label: "Normal" },
  slightly_low: { icon: AlertTriangle, color: "text-status-slightly-low", label: "Slightly Low" },
  slightly_high: { icon: AlertTriangle, color: "text-status-slightly-high", label: "Slightly High" },
  critical_low: { icon: XCircle, color: "text-status-critical", label: "Critical Low" },
  critical_high: { icon: XCircle, color: "text-status-critical", label: "Critical High" },
};

function StatusBadge({ status }: { status: TestStatus }) {
  const config = statusConfig[status];
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${config.color} bg-current/10`}>
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
}

interface TestPanelCardProps {
  panel: PanelSummary;
  index: number;
}

const panelIcons: Record<string, string> = {
  "Blood Health (Complete Blood Count)": "🩸",
  "Kidney Function": "🫘",
  "Liver Health": "🫁",
  "Blood Sugar": "🍬",
  "Lipid Profile": "❤️",
  "Anemia Profile": "💉",
  "Electrolytes": "⚡",
  "Inflammation": "🔥",
  "Thyroid Function": "🦋",
  "Urine Routine": "🧪",
};

const TestPanelCard = ({ panel, index }: TestPanelCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const icon = panelIcons[panel.name] || "📋";
  const percentage = (panel.normalCount / panel.totalCount) * 100;
  const panelStatus = getStatusFromPanel(panel.normalCount, panel.totalCount, panel.abnormalCount);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 * index, duration: 0.4 }}
      whileHover={{
        y: -2,
        boxShadow: "var(--shadow-card-hover)",
        borderColor: "hsl(199, 89%, 48%, 0.3)",
        transition: { duration: 0.2 },
      }}
      className="panel-card overflow-hidden card-3d"
      data-panel-card
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-secondary/30 transition-all duration-200"
      >
        <div className="flex items-center gap-3">
          <AnimatedMedicalIcon icon={icon} status={panelStatus} size="md" />
          <div className="text-left">
            <h4 className="font-display font-semibold text-foreground text-sm">{panel.name}</h4>
            <p className="text-xs text-muted-foreground">
              {panel.normalCount}/{panel.totalCount} Normal
              {panel.abnormalCount > 0 && (
                <span className="text-status-critical ml-1 font-medium">• {panel.abnormalCount} flagged</span>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-24 h-2.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 + 0.08 * index }}
              style={{
                backgroundColor: panel.abnormalCount === 0 ? "hsl(var(--status-normal))" : "hsl(var(--status-attention))",
              }}
            />
          </div>
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </motion.div>
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="border-t border-border overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-secondary/30">
                    <th className="text-left p-3 font-medium text-muted-foreground text-xs">Test Name</th>
                    <th className="text-left p-3 font-medium text-muted-foreground text-xs">Value</th>
                    <th className="text-left p-3 font-medium text-muted-foreground text-xs">Normal Range</th>
                    <th className="text-left p-3 font-medium text-muted-foreground text-xs">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {panel.tests.map((test, i) => (
                    <motion.tr
                      key={test.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className={`${i % 2 === 0 ? "bg-card" : "bg-secondary/10"} hover:bg-primary/5 transition-colors`}
                    >
                      <td className="p-3 text-foreground font-medium text-xs">{test.name}</td>
                      <td className="p-3 text-foreground text-xs font-mono">{test.rawValue}</td>
                      <td className="p-3 text-muted-foreground text-xs">{test.normalRange}</td>
                      <td className="p-3"><StatusBadge status={test.status} /></td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TestPanelCard;
