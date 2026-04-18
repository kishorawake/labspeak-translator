import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, XCircle, ChevronDown, ChevronUp, Lightbulb, TrendingDown, Search, ExternalLink, BookOpen } from "lucide-react";
import { useState } from "react";
import type { AbnormalFinding } from "@/services/labAnalyzer";
import { useLang } from "@/contexts/LangContext";
import { useTranslated, useTranslatedList } from "@/services/translate";

interface AbnormalFindingsProps {
  findings: AbnormalFinding[];
}

const FindingDetail = ({ finding }: { finding: AbnormalFinding }) => {
  const [expanded, setExpanded] = useState(false);
  const isCritical = finding.status.includes("critical");
  const { lang } = useLang();
  const tExplanation = useTranslated(finding.explanation, lang);
  const tCauses = useTranslatedList(finding.possibleCauses, lang);
  const tConsequences = useTranslatedList(finding.consequences, lang);
  const tTips = useTranslatedList(finding.reductionTips, lang);
  const tWhy = useTranslated("Why This Could Be High/Low", lang);
  const tCons = useTranslated("Possible Consequences", lang);
  const tImprove = useTranslated("How to Improve", lang);
  const tRefs = useTranslated("Verified Medical References", lang);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`rounded-xl border transition-all duration-200 overflow-hidden ${
        isCritical
          ? "bg-status-critical/5 border-status-critical/20 hover:border-status-critical/40"
          : "bg-status-attention/5 border-status-attention/20 hover:border-status-attention/40"
      }`}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 text-left"
      >
        <div className="flex items-center gap-2 mb-2">
          {isCritical ? (
            <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 2, repeat: Infinity }}>
              <XCircle className="w-4 h-4 text-status-critical" />
            </motion.div>
          ) : (
            <AlertTriangle className="w-4 h-4 text-status-attention" />
          )}
          <h4 className="font-display font-semibold text-sm text-foreground">{finding.testName}</h4>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              isCritical
                ? "bg-status-critical/10 text-status-critical"
                : "bg-status-attention/10 text-status-attention"
            }`}
          >
            {finding.status.replace("_", " ")}
          </span>
          <div className="ml-auto">
            {expanded ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
        </div>
        <p className="text-sm text-foreground/70 leading-relaxed">{tExplanation}</p>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3 border-t border-border/30 pt-3">
              {/* Possible Causes */}
              <div>
                <h5 className="text-xs font-semibold text-foreground flex items-center gap-1.5 mb-1.5">
                  <Search className="w-3 h-3 text-primary" />
                  {tWhy}
                </h5>
                <ul className="space-y-1">
                  {tCauses.map((cause, i) => (
                    <li key={i} className="text-xs text-foreground/70 flex items-start gap-1.5">
                      <span className="text-primary mt-0.5">•</span>
                      {cause}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Consequences */}
              <div>
                <h5 className="text-xs font-semibold text-foreground flex items-center gap-1.5 mb-1.5">
                  <TrendingDown className="w-3 h-3 text-status-critical" />
                  {tCons}
                </h5>
                <ul className="space-y-1">
                  {tConsequences.map((consequence, i) => (
                    <li key={i} className="text-xs text-foreground/70 flex items-start gap-1.5">
                      <span className="text-status-critical mt-0.5">•</span>
                      {consequence}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Reduction Tips */}
              <div className={`p-3 rounded-lg ${isCritical ? "bg-status-critical/5" : "bg-primary/5"} border ${isCritical ? "border-status-critical/10" : "border-primary/10"}`}>
                <h5 className="text-xs font-semibold text-foreground flex items-center gap-1.5 mb-1.5">
                  <Lightbulb className="w-3 h-3 text-status-attention" />
                  {tImprove}
                </h5>
                <ul className="space-y-1">
                  {tTips.map((tip, i) => (
                    <li key={i} className="text-xs text-foreground/70 flex items-start gap-1.5">
                      <span className="text-status-attention mt-0.5">✦</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Verified References */}
              {finding.references && finding.references.length > 0 && (
                <div className="p-3 rounded-lg bg-muted/40 border border-border/40">
                  <h5 className="text-xs font-semibold text-foreground flex items-center gap-1.5 mb-2">
                    <BookOpen className="w-3 h-3 text-primary" />
                    {tRefs}
                  </h5>
                  <ul className="space-y-1.5">
                    {finding.references.map((ref, i) => (
                      <li key={i} className="text-xs">
                        <a
                          href={ref.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-start gap-1.5 text-primary hover:underline break-words"
                        >
                          <ExternalLink className="w-3 h-3 mt-0.5 shrink-0" />
                          <span>
                            <span className="font-medium">{ref.source}:</span>{" "}
                            <span className="text-foreground/70">{ref.label}</span>
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const AbnormalFindings = ({ findings }: AbnormalFindingsProps) => {
  const { lang } = useLang();
  const tHeader = useTranslated("Abnormal Findings — AI Clinical Analysis", lang);
  const tHelp = useTranslated("Click on each finding to see AI-generated correlations, consequences, and lifestyle tips.", lang);
  if (findings.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="panel-card p-6 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-40 h-40 bg-status-attention/5 rounded-full blur-3xl" />

      <h3 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2 relative z-10">
        <div className="w-8 h-8 rounded-lg bg-status-attention/10 flex items-center justify-center">
          <AlertTriangle className="w-4 h-4 text-status-attention" />
        </div>
        {tHeader}
        <span className="text-xs px-2 py-0.5 rounded-full bg-status-attention/10 text-status-attention font-medium">
          {findings.length}
        </span>
      </h3>
      <p className="text-xs text-muted-foreground mb-4 relative z-10">
        {tHelp}
      </p>
      <div className="space-y-3 relative z-10">
        {findings.map((finding, i) => (
          <FindingDetail key={finding.testName} finding={finding} />
        ))}
      </div>
    </motion.div>
  );
};

export default AbnormalFindings;
