import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Activity, ArrowLeft, Download, Shield, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AnalysisResult } from "@/services/labAnalyzer";
import Disclaimer from "@/components/Disclaimer";
import HealthScoreCard from "@/components/HealthScoreCard";
import OverallSummary from "@/components/OverallSummary";
import TestPanelCard from "@/components/TestPanelCard";
import AbnormalFindings from "@/components/AbnormalFindings";
import AdviceSection from "@/components/AdviceSection";
import PrivacyBadges from "@/components/PrivacyBadges";
import HolographicAvatar from "@/components/HolographicAvatar";
import { LangProvider, useLang } from "@/contexts/LangContext";
import { useTranslated } from "@/services/translate";

export const Route = createFileRoute("/results")({
  component: ResultsPage,
  head: () => ({
    meta: [
      { title: "Lab Report Analysis — AI Lab Analyzer" },
      { name: "description", content: "Your AI-powered lab report analysis with health scores, abnormal findings, and actionable recommendations." },
    ],
  }),
});

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

function ResultsPage() {
  return (
    <LangProvider>
      <ResultsPageInner />
    </LangProvider>
  );
}

function ResultsPageInner() {
  const navigate = useNavigate();
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const { lang } = useLang();

  const tBack = useTranslated("Back", lang);
  const tTitle = useTranslated("Your Lab Report Analysis", lang);
  const tPrint = useTranslated("Print Report", lang);
  const tPanels = useTranslated("Test Panels Detected", lang);
  const tAnalyze = useTranslated("Analyze Another", lang);
  const tUpload = useTranslated("Upload a new lab report for instant AI insights.", lang);
  const tNew = useTranslated("New Report", lang);

  useEffect(() => {
    const stored = sessionStorage.getItem("labResults");
    if (stored) {
      try {
        setResults(JSON.parse(stored));
      } catch {
        navigate({ to: "/" });
      }
    } else {
      navigate({ to: "/" });
    }
  }, [navigate]);

  if (!results) return null;

  const optimalCount = results.tests.filter((t) => t.status === "normal").length;
  const attentionCount = results.tests.filter((t) => t.status === "slightly_low" || t.status === "slightly_high").length;
  const criticalCount = results.tests.filter((t) => t.status === "critical_low" || t.status === "critical_high").length;

  return (
    <div className="min-h-screen animated-bg relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-40 left-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-blob" style={{ animationDelay: "4s" }} />
      </div>

      <header className="border-b border-border/50 glass-card sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2.5"
          >
            <div className="w-9 h-9 rounded-xl hero-gradient flex items-center justify-center shadow-hero">
              <Activity className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-foreground text-lg">AI Lab Analyzer</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-1.5 text-xs text-muted-foreground"
          >
            <Shield className="w-3.5 h-3.5" />
            HIPAA-Aligned
          </motion.div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start sm:items-center justify-between gap-3 mb-4 sm:mb-5"
        >
          <div className="min-w-0">
            <button
              onClick={() => navigate({ to: "/" })}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-1.5 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> {tBack}
            </button>
            <h1 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2 flex-wrap">
              {tTitle}
              <Sparkles className="w-5 h-5 text-primary" />
            </h1>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            className="hidden md:flex items-center gap-2 hover:shadow-card transition-shadow shrink-0"
          >
            <Download className="w-4 h-4" />
            {tPrint}
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[18rem_minmax(0,1fr)] xl:grid-cols-[20rem_minmax(0,1fr)] gap-4 sm:gap-5">
          <div className="min-w-0">
            <HolographicAvatar results={results} />
          </div>

          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="min-w-0 space-y-4 sm:space-y-5"
          >
            <motion.div variants={fadeUp}>
              <Disclaimer />
            </motion.div>

            <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <HealthScoreCard
                score={results.healthScore}
                grade={results.healthGrade}
                optimal={optimalCount}
                attention={attentionCount}
                critical={criticalCount}
              />
              <OverallSummary
                totalTests={results.totalTests}
                normalTests={results.normalTests}
                abnormalTests={results.abnormalTests}
                summary={results.overallSummary}
                panelCount={results.panels.length}
              />
            </motion.div>

            <motion.div variants={fadeUp}>
              <h2 className="font-display text-base sm:text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                <span className="w-1 h-5 rounded-full hero-gradient inline-block" />
                {tPanels}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {results.panels.map((panel, i) => (
                  <TestPanelCard key={panel.name} panel={panel} index={i} />
                ))}
              </div>
            </motion.div>

            <motion.div variants={fadeUp}>
              <AbnormalFindings findings={results.abnormalFindings} />
            </motion.div>

            <motion.div variants={fadeUp}>
              <AdviceSection
                practicalAdvice={results.practicalAdvice}
                recommendedActions={results.recommendedActions}
                whenToConsultDoctor={results.whenToConsultDoctor}
                talkingPoints={results.talkingPoints}
              />
            </motion.div>

            <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <PrivacyBadges />
              </div>
              <motion.div
                whileHover={{ y: -2, transition: { duration: 0.2 } }}
                className="panel-card p-6 flex flex-col items-center justify-center text-center shimmer"
              >
                <h3 className="font-display text-base font-semibold text-foreground mb-2">{tAnalyze}</h3>
                <p className="text-xs text-muted-foreground mb-3">
                  {tUpload}
                </p>
                <Button onClick={() => navigate({ to: "/" })} size="sm" className="shadow-hero hover:shadow-glow transition-shadow">
                  {tNew}
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
