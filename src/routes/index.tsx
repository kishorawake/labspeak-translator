import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Activity, Shield, Upload, Zap, FileText, Heart } from "lucide-react";
import UploadSection from "@/components/UploadSection";
import PrivacyBadges from "@/components/PrivacyBadges";
import { analyzeLabReport, getDemoAnalysis, type AnalysisResult } from "@/services/labAnalyzer";

export const Route = createFileRoute("/")({
  component: IndexPage,
  head: () => ({
    meta: [
      { title: "AI Lab Analyzer — Understand Your Lab Results" },
      { name: "description", content: "Upload your lab report and get instant AI-powered analysis with clear explanations, health scores, and actionable recommendations." },
    ],
  }),
});

function IndexPage() {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileProcessed = async (text: string) => {
    setIsProcessing(true);
    try {
      let result: AnalysisResult;
      if (text === "__USE_DEMO__") {
        await new Promise((r) => setTimeout(r, 2000));
        result = getDemoAnalysis();
      } else {
        result = await analyzeLabReport(text);
        if (result.tests.length === 0) {
          result = getDemoAnalysis();
        }
      }
      if (typeof window !== "undefined") {
        sessionStorage.setItem("labResults", JSON.stringify(result));
      }
      navigate({ to: "/results" });
    } catch {
      setIsProcessing(false);
    }
  };

  const handleUseDemoData = async () => {
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 1500));
    const result = getDemoAnalysis();
    if (typeof window !== "undefined") {
      sessionStorage.setItem("labResults", JSON.stringify(result));
    }
    navigate({ to: "/results" });
  };

  return (
    <div className="min-h-screen animated-bg relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-20 left-1/3 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-20 right-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl animate-blob" style={{ animationDelay: "4s" }} />
      </div>

      <header className="border-b border-border/50 glass-card sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2.5"
          >
            <div className="w-9 h-9 rounded-xl hero-gradient flex items-center justify-center shadow-hero animate-pulse-glow">
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

      <section className="py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 rounded-2xl hero-gradient flex items-center justify-center mx-auto mb-6 shadow-hero"
            >
              <Heart className="w-8 h-8 text-primary-foreground" />
            </motion.div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 leading-tight">
              Understand Your
              <br />
              <span className="bg-clip-text text-transparent hero-gradient">Lab Results</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
              Upload your lab report and get instant AI-powered analysis with clear explanations,
              health scores, and actionable recommendations.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10"
          >
            {[
              { icon: Upload, title: "Upload Report", desc: "PDF, image, or text format" },
              { icon: Zap, title: "Instant Analysis", desc: "AI-powered extraction & comparison" },
              { icon: FileText, title: "Clear Results", desc: "Simple explanations & advice" },
            ].map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.2 } }}
                className="panel-card p-5 flex items-start gap-3 gradient-border"
              >
                <motion.div
                  className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0"
                  whileHover={{ rotate: 10, scale: 1.1 }}
                >
                  <Icon className="w-5 h-5 text-primary" />
                </motion.div>
                <div>
                  <h3 className="font-display font-semibold text-sm text-foreground">{title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <UploadSection
            onFileProcessed={handleFileProcessed}
            onUseDemoData={handleUseDemoData}
            isProcessing={isProcessing}
          />

          <div className="mt-10">
            <PrivacyBadges />
          </div>
        </div>
      </section>
    </div>
  );
}
