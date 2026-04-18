import { motion } from "framer-motion";
import { Lightbulb, Stethoscope, MessageSquare, ChevronRight } from "lucide-react";
import type { RecommendedAction } from "@/services/labAnalyzer";
import { useLang } from "@/contexts/LangContext";
import { useTranslated, useTranslatedList } from "@/services/translate";

interface AdviceSectionProps {
  practicalAdvice: string[];
  recommendedActions: RecommendedAction[];
  whenToConsultDoctor: string;
  talkingPoints: string[];
}

const AdviceSection = ({ practicalAdvice, recommendedActions, whenToConsultDoctor, talkingPoints }: AdviceSectionProps) => {
  const { lang } = useLang();
  const tPractical = useTranslated("Practical Advice", lang);
  const tRecommended = useTranslated("Recommended Actions", lang);
  const tWhen = useTranslated("When to Consult Doctor", lang);
  const tDiscuss = useTranslated("Discuss with Your Doctor", lang);
  const tWhenText = useTranslated(whenToConsultDoctor, lang);
  const tAdviceList = useTranslatedList(practicalAdvice, lang);
  const tTalking = useTranslatedList(talkingPoints, lang);
  const actionTitles = useTranslatedList(recommendedActions.map((a) => a.title), lang);
  const actionDescs = useTranslatedList(recommendedActions.map((a) => a.description), lang);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Practical Advice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="panel-card p-5 gradient-border"
      >
        <h3 className="font-display text-base font-semibold text-foreground mb-3 flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-status-attention/10 flex items-center justify-center">
            <Lightbulb className="w-3.5 h-3.5 text-status-attention" />
          </div>
          {tPractical}
        </h3>
        <ul className="space-y-2">
          {tAdviceList.map((advice, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.08 }}
              className="flex items-start gap-2 group"
            >
              <ChevronRight className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
              <span className="text-xs text-foreground/80 leading-relaxed">{advice}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {/* Recommended Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="panel-card p-5 gradient-border"
      >
        <h3 className="font-display text-base font-semibold text-foreground mb-3">{tRecommended}</h3>
        <div className="space-y-3">
          {recommendedActions.map((action, i) => (
            <motion.div
              key={action.step}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.12 }}
              whileHover={{ x: 4, transition: { duration: 0.15 } }}
              className="flex gap-3 group cursor-default"
            >
              <motion.div
                className="flex-shrink-0 w-7 h-7 rounded-lg hero-gradient flex items-center justify-center shadow-hero"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <span className="text-xs font-bold text-primary-foreground">{action.step}</span>
              </motion.div>
              <div>
                <h4 className="font-display font-semibold text-xs text-foreground">{actionTitles[i] ?? action.title}</h4>
                <p className="text-xs text-foreground/70 mt-0.5 leading-relaxed">{actionDescs[i] ?? action.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* When to Consult Doctor */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
        className="panel-card p-5 border-status-critical/20 bg-status-critical/5 relative overflow-hidden"
      >
        <div className="absolute -top-8 -right-8 w-20 h-20 bg-status-critical/10 rounded-full blur-2xl" />
        <h3 className="font-display text-base font-semibold text-foreground mb-2 flex items-center gap-2 relative z-10">
          <div className="w-7 h-7 rounded-lg bg-status-critical/10 flex items-center justify-center">
            <Stethoscope className="w-3.5 h-3.5 text-status-critical" />
          </div>
          {tWhen}
        </h3>
        <p className="text-xs text-foreground/80 leading-relaxed relative z-10">{tWhenText}</p>
      </motion.div>

      {/* Talking Points */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="panel-card p-5 gradient-border"
      >
        <h3 className="font-display text-base font-semibold text-foreground mb-2 flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
            <MessageSquare className="w-3.5 h-3.5 text-primary" />
          </div>
          {tDiscuss}
        </h3>
        <ol className="space-y-2">
          {tTalking.map((point, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + i * 0.08 }}
              className="flex items-start gap-2 group"
            >
              <span className="text-[10px] font-bold text-primary-foreground bg-primary/80 rounded-full w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5">
                {i + 1}
              </span>
              <span className="text-xs text-foreground/80 leading-relaxed">{point}</span>
            </motion.li>
          ))}
        </ol>
      </motion.div>
    </div>
  );
};

export default AdviceSection;
