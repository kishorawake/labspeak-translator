import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import {
  ChevronDown,
  ChevronUp,
  Sparkles,
  Volume2,
  VolumeX,
  Play,
  MessageSquare,
  Zap,
  Shield,
  Activity,
} from "lucide-react";
import aiDoctorAvatar from "@/assets/ai-doctor-avatar.png";
import type { AnalysisResult } from "@/services/labAnalyzer";
import { LANGUAGES, type LangCode, translate, translateAsync, getBcp47 } from "@/services/translate";
import { useLang } from "@/contexts/LangContext";

/* ─── types ─── */
interface HolographicAvatarProps {
  results: AnalysisResult;
}

type SummaryMode = "full" | "critical" | "lifestyle";

/* ─── message generator (same logic, HIPAA-safe) ─── */
function generateMessages(results: AnalysisResult, mode: SummaryMode): string[] {
  const msgs: string[] = [];
  const { healthScore, abnormalTests, totalTests, tests, recommendedActions } = results;

  if (mode === "critical") {
    const criticalTests = tests.filter((t) => t.status.includes("critical"));
    const slightlyTests = tests.filter((t) => t.status.includes("slightly"));

    if (criticalTests.length === 0 && slightlyTests.length === 0) {
      msgs.push("Great news — no critical or borderline findings in your report! All values are within safe ranges.");
    } else {
      if (criticalTests.length > 0) {
        msgs.push(`⚠️ You have ${criticalTests.length} critical findings that need immediate attention.`);
        criticalTests.forEach((t) => {
          msgs.push(
            `🔴 ${t.name}: ${t.rawValue} — critically ${t.status.includes("high") ? "high" : "low"} (normal: ${t.normalRange}). See a doctor right away.`
          );
        });
      }
      if (slightlyTests.length > 0) {
        msgs.push(`🟡 You also have ${slightlyTests.length} borderline findings that are slightly outside normal range.`);
        slightlyTests.forEach((t) => {
          msgs.push(
            `🟠 ${t.name}: ${t.rawValue} — slightly ${t.status.includes("high") ? "high" : "low"} (normal: ${t.normalRange}). Monitor and consider lifestyle changes.`
          );
        });
      }
    }
    // Always include recommended actions in narration
    if (recommendedActions?.length) {
      msgs.push("Here are the recommended next steps:");
      recommendedActions.forEach((a) => {
        msgs.push(`Step ${a.step}: ${a.title}. ${a.description}`);
      });
    }
    return msgs;
  }

  if (mode === "lifestyle") {
    msgs.push("Here are some lifestyle tips based on your results:");
    if (tests.some((t) => t.panel === "Blood Sugar" && t.status !== "normal"))
      msgs.push("🍎 Your blood sugar needs attention. Reduce refined carbs, increase fiber, and walk after meals.");
    if (tests.some((t) => t.panel === "Lipid Profile" && t.status !== "normal"))
      msgs.push("❤️ Focus on heart health: healthy fats, omega-3 foods, and 30 min exercise daily.");
    if (tests.some((t) => t.name === "Iron" && t.status !== "normal"))
      msgs.push("🥬 Boost iron with spinach, lentils, and vitamin C for better absorption.");
    if (tests.some((t) => t.panel === "Electrolytes" && t.status !== "normal"))
      msgs.push("💧 Stay hydrated — bananas, coconut water, and leafy greens help electrolyte balance.");
    if (msgs.length === 1) msgs.push("✅ Results look good! Keep up balanced diet, exercise, and sleep.");
    if (recommendedActions?.length) {
      msgs.push("And here are the recommended next steps:");
      recommendedActions.forEach((a) => {
        msgs.push(`Step ${a.step}: ${a.title}. ${a.description}`);
      });
    }
    return msgs;
  }

  if (healthScore >= 80) msgs.push("Great news! Your overall health looks really good. Let me walk you through.");
  else if (healthScore >= 60) msgs.push("Most things look fine, but there are a few areas that need attention.");
  else msgs.push("I need to flag some important findings. Please review carefully and consult your doctor soon.");

  msgs.push(
    `I analyzed ${totalTests} tests across ${results.panels.length} panels. ${results.normalTests} normal, ${abnormalTests} need attention.`
  );

  const criticalTests = tests.filter((t) => t.status.includes("critical"));
  const slightlyOff = tests.filter((t) => t.status.includes("slightly"));
  if (criticalTests.length > 0)
    msgs.push(`⚠️ Critical: ${criticalTests.map((t) => t.name).join(", ")} — need immediate medical attention.`);
  if (slightlyOff.length > 0)
    msgs.push(`${slightlyOff.map((t) => t.name).join(", ")} are slightly outside normal — worth monitoring.`);

  if (recommendedActions?.length) {
    msgs.push("Here are the recommended next steps for you:");
    recommendedActions.forEach((a) => {
      msgs.push(`Step ${a.step}: ${a.title}. ${a.description}`);
    });
  }

  msgs.push("Scroll down for detailed panels, recommendations, and doctor advice. I'm AI — not a replacement for your doctor! 😊");
  return msgs;
}

const modeConfig: Record<SummaryMode, { label: string; icon: typeof Zap }> = {
  full: { label: "Full Summary", icon: Activity },
  critical: { label: "Critical Only", icon: Shield },
  lifestyle: { label: "Lifestyle Tips", icon: Sparkles },
};

/* ─── Holographic Particles ─── */
const HoloParticles = ({ count = 12 }: { count?: number }) => {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: `${10 + Math.random() * 80}%`,
        delay: Math.random() * 3,
        duration: 2 + Math.random() * 2,
        size: 2 + Math.random() * 3,
      })),
    [count]
  );

  return (
    <>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="holo-particle"
          style={{ left: p.left, bottom: "10%", width: p.size, height: p.size }}
          animate={{
            y: [0, -30, -60],
            x: [0, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 10],
            opacity: [0, 0.7, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}
    </>
  );
};

/* ─── Data stream lines ─── */
const DataStreams = () => (
  <>
    {[15, 35, 65, 85].map((left, i) => (
      <div
        key={i}
        className="holo-data-stream"
        style={{ left: `${left}%`, animationDelay: `${i * 0.5}s`, opacity: 0.3 }}
      />
    ))}
  </>
);

/* ─── Holographic Ring ─── */
const HoloRing = ({ delay = 0 }: { delay?: number }) => (
  <div className="holo-ring" style={{ animationDelay: `${delay}s` }} />
);

/* ─── MAIN COMPONENT ─── */
const HolographicAvatar = ({ results }: HolographicAvatarProps) => {
  const [mode, setMode] = useState<SummaryMode>("full");
  const { lang, setLang } = useLang();
  const baseMessages = useMemo(() => generateMessages(results, mode), [results, mode]);
  // Optimistic sync translation, then upgrade asynchronously via Google Translate.
  const [messages, setMessages] = useState<string[]>(() => baseMessages.map((m) => translate(m, lang)));
  useEffect(() => {
    setMessages(baseMessages.map((m) => translate(m, lang)));
    if (lang === "en") return;
    let cancelled = false;
    Promise.all(baseMessages.map((m) => translateAsync(m, lang))).then((res) => {
      if (!cancelled) setMessages(res);
    });
    return () => { cancelled = true; };
  }, [baseMessages, lang]);
  const [currentMsg, setCurrentMsg] = useState(0);
  const [isExpanded, setIsExpanded] = useState(true);
  const [displayedText, setDisplayedText] = useState("");
  // Audio is OPT-IN (muted by default). Toggling unmute primes the speech engine.
  const [isMuted, setIsMuted] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [isProjected, setIsProjected] = useState(false);
  const [sparkBurst, setSparkBurst] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const speakTokenRef = useRef(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  /* Projection animation on mount */
  useEffect(() => {
    const timer = setTimeout(() => setIsProjected(true), 300);
    return () => clearTimeout(timer);
  }, []);

  /* Preload voices (Chrome loads them asynchronously — first call often fails silently) */
  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const synth = window.speechSynthesis;
    const prime = () => synth.getVoices();
    prime();
    synth.addEventListener?.("voiceschanged", prime);
    return () => synth.removeEventListener?.("voiceschanged", prime);
  }, []);

  /* GSAP glow pulse on avatar */
  useEffect(() => {
    if (!avatarRef.current) return;
    const ctx = gsap.context(() => {
      gsap.to(avatarRef.current, {
        boxShadow: isSpeaking
          ? "0 0 40px hsl(185 85% 60% / 0.6), 0 0 80px hsl(185 85% 60% / 0.3)"
          : "0 0 20px hsl(185 85% 60% / 0.3), 0 0 40px hsl(185 85% 60% / 0.1)",
        duration: 0.6,
        ease: "power2.out",
      });
    });
    return () => ctx.revert();
  }, [isSpeaking]);

  /* Reset msg index on mode change */
  useEffect(() => setCurrentMsg(0), [mode]);

  /* Show full message instantly */
  useEffect(() => {
    setDisplayedText(messages[currentMsg] ?? "");
  }, [currentMsg, messages]);

  /* Robust TTS — cancels previous utterance, uses token to ignore stale callbacks */
  const stopSpeaking = useCallback(() => {
    speakTokenRef.current += 1;
    if (typeof window !== "undefined") {
      try {
        window.speechSynthesis?.cancel();
      } catch {
        /* noop */
      }
    }
    if (audioRef.current) {
      try {
        audioRef.current.pause();
        audioRef.current.src = "";
      } catch {
        /* noop */
      }
      audioRef.current = null;
    }
    utteranceRef.current = null;
    setIsSpeaking(false);
  }, []);

  /* Wait for voices to load (Chrome loads them asynchronously) */
  const getVoicesAsync = useCallback((): Promise<SpeechSynthesisVoice[]> => {
    return new Promise((resolve) => {
      if (typeof window === "undefined" || !window.speechSynthesis) {
        resolve([]);
        return;
      }
      const synth = window.speechSynthesis;
      let voices = synth.getVoices();
      if (voices && voices.length > 0) {
        resolve(voices);
        return;
      }
      let attempts = 0;
      const interval = setInterval(() => {
        voices = synth.getVoices();
        attempts++;
        if (voices.length > 0 || attempts > 20) {
          clearInterval(interval);
          resolve(voices);
        }
      }, 100);
    });
  }, []);

  const speak = useCallback(async (text: string, langCode: LangCode) => {
    if (typeof window === "undefined" || !text) return;
    const synth = window.speechSynthesis;
    if (!synth) {
      console.warn("[TTS] Speech synthesis not supported in this browser");
      return;
    }
    speakTokenRef.current += 1;
    const myToken = speakTokenRef.current;
    try { synth.cancel(); } catch { /* noop */ }
    if (audioRef.current) {
      try { audioRef.current.pause(); } catch { /* noop */ }
      audioRef.current = null;
    }

    const cleanText = text.replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, "").trim();
    if (!cleanText) return;

    const targetLang = getBcp47(langCode);
    const langPrefix = langCode.toLowerCase();

    const voices = await getVoicesAsync();
    if (myToken !== speakTokenRef.current) return;

    const exactVoice = voices.find((v) => v.lang?.toLowerCase() === targetLang.toLowerCase());
    const prefixVoice = voices.find((v) => v.lang?.toLowerCase().startsWith(langPrefix + "-"));
    const langOnlyVoice = voices.find((v) => v.lang?.toLowerCase() === langPrefix);
    const chosenVoice = exactVoice || prefixVoice || langOnlyVoice;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.volume = 1;
    utterance.lang = targetLang;

    if (chosenVoice) {
      utterance.voice = chosenVoice;
      console.info(`[TTS] Using voice "${chosenVoice.name}" (${chosenVoice.lang}) for ${langCode}`);
    } else {
      console.warn(
        `[TTS] No installed voice matches ${targetLang}. Available:`,
        Array.from(new Set(voices.map((v) => v.lang))).join(", ")
      );
    }

    utterance.onstart = () => { if (myToken === speakTokenRef.current) setIsSpeaking(true); };
    utterance.onend = () => { if (myToken === speakTokenRef.current) setIsSpeaking(false); };
    utterance.onerror = (e) => {
      console.warn("[TTS] Speech error:", e.error);
      if (myToken === speakTokenRef.current) setIsSpeaking(false);
    };
    utteranceRef.current = utterance;

    setTimeout(() => {
      if (myToken !== speakTokenRef.current) return;
      try { synth.speak(utterance); }
      catch (err) {
        console.warn("[TTS] synth.speak threw:", err);
        setIsSpeaking(false);
      }
    }, 80);
  }, [getVoicesAsync]);

  /* Cleanup any ongoing speech on unmount */
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, [stopSpeaking]);

  const toggleMute = () => {
    if (!isMuted) {
      stopSpeaking();
      setIsMuted(true);
    } else {
      // Prime audio context with a silent utterance (browsers need a user gesture)
      if (typeof window !== "undefined" && window.speechSynthesis) {
        try {
          const ping = new SpeechSynthesisUtterance(" ");
          ping.volume = 0;
          window.speechSynthesis.speak(ping);
        } catch {
          /* noop */
        }
      }
      setIsMuted(false);
      // Auto-play current message immediately on unmute
      setTimeout(() => speak(messages[currentMsg] ?? "", lang), 120);
    }
    setSparkBurst((n) => n + 1);
  };

  const handleReplay = () => {
    setSparkBurst((n) => n + 1);
    speak(messages[currentMsg] ?? "", lang);
  };

  const goToMsg = (i: number) => {
    setCurrentMsg(i);
    setSparkBurst((n) => n + 1);
    if (!isMuted) setTimeout(() => speak(messages[i] ?? "", lang), 100);
  };

  // Re-speak current message when language changes (if unmuted)
  useEffect(() => {
    if (!isMuted) {
      const t = setTimeout(() => speak(messages[currentMsg] ?? "", lang), 150);
      return () => clearTimeout(t);
    }
  }, [lang]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="lg:sticky lg:top-24 holo-container"
    >
      {/* ─── Hologram Card ─── */}
      <div className="relative rounded-2xl overflow-hidden holo-glow">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-holo/5 via-transparent to-holo/10 pointer-events-none" />

        {/* Scan lines overlay */}
        <div className="holo-scanlines rounded-2xl" />

        {/* Data streams */}
        <DataStreams />

        <div className="relative z-10 p-5">
          {/* ─── Avatar Section ─── */}
          <div className="flex items-center gap-3 mb-4">
            <div className="relative">
              {/* Orbital rings */}
              <HoloRing />
              <HoloRing delay={4} />

              {/* Avatar figure */}
              <motion.div
                ref={avatarRef}
                className={`relative w-16 h-16 rounded-full overflow-hidden holo-figure ${!isProjected ? "projecting" : ""}`}
                animate={
                  isSpeaking
                    ? { y: [0, -3, 0, -2, 0], scale: [1, 1.02, 1] }
                    : { y: [0, -4, 0] }
                }
                transition={
                  isSpeaking
                    ? { duration: 0.5, repeat: Infinity }
                    : { duration: 4, repeat: Infinity, ease: "easeInOut" }
                }
              >
                <img
                  src={aiDoctorAvatar}
                  alt="Holographic AI Doctor"
                  className="w-full h-full object-cover"
                  style={{ filter: "saturate(0.7) brightness(1.2) hue-rotate(10deg)" }}
                  width={512}
                  height={512}
                />

                {/* Hologram color tint */}
                <div className="absolute inset-0 bg-holo/20 mix-blend-overlay" />

                {/* Lip-sync overlay (active while speaking) */}
                {isSpeaking && <div className="holo-lip-overlay" />}

                {/* Scanlines on avatar */}
                <div className="holo-scanlines" />
              </motion.div>

              {/* Status indicator */}
              <motion.div
                className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-background"
                style={{ backgroundColor: "hsl(var(--holo-primary))" }}
                animate={
                  isSpeaking
                    ? { scale: [1, 1.5, 1], boxShadow: ["0 0 0 0 hsl(185 85% 60% / 0)", "0 0 12px 4px hsl(185 85% 60% / 0.5)", "0 0 0 0 hsl(185 85% 60% / 0)"] }
                    : { scale: [1, 1.2, 1] }
                }
                transition={{ duration: isSpeaking ? 0.6 : 2, repeat: Infinity }}
              />

              {/* Particles around avatar */}
              <HoloParticles count={8} />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-display font-bold text-sm text-holo">Dr. AI</span>
                <motion.div
                  animate={{ rotate: [0, 180, 360] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-3.5 h-3.5 text-holo" />
                </motion.div>
              </div>
              <span className="text-[10px] text-holo/60 font-mono tracking-wider">
                {isSpeaking ? "◉ TRANSMITTING..." : "◎ HOLOGRAM ACTIVE"}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={toggleMute}
                className="p-1.5 rounded-lg hover:bg-holo/10 transition-colors"
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? (
                  <VolumeX className="w-3.5 h-3.5 text-holo/50" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5 text-holo" />
                )}
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 rounded-lg hover:bg-holo/10 transition-colors"
              >
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-holo/50" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-holo/50" />
                )}
              </button>
            </div>
          </div>

          {/* ─── Expanded Content ─── */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                {/* Language Selector */}
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-[9px] uppercase tracking-wider text-holo/50 font-mono">Voice</span>
                  <div className="flex gap-1 flex-1 bg-holo/5 border border-holo/10 rounded-lg p-0.5">
                    {LANGUAGES.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => setLang(l.code)}
                        title={`Narrate in ${l.label}`}
                        className={`flex-1 text-[9px] font-medium py-1 px-1 rounded-md transition-all ${
                          lang === l.code
                            ? "bg-holo/20 text-holo shadow-[0_0_8px_hsl(185_85%_60%/0.25)]"
                            : "text-holo/40 hover:text-holo/70"
                        }`}
                      >
                        {l.native}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mode Switcher */}
                <div className="flex gap-1 mb-3 bg-holo/5 border border-holo/10 rounded-lg p-0.5">
                  {(Object.keys(modeConfig) as SummaryMode[]).map((m) => {
                    const Icon = modeConfig[m].icon;
                    return (
                      <button
                        key={m}
                        onClick={() => setMode(m)}
                        className={`flex-1 text-[9px] font-medium py-1.5 px-1.5 rounded-md transition-all flex items-center justify-center gap-1 ${
                          mode === m
                            ? "bg-holo/20 text-holo shadow-[0_0_12px_hsl(185_85%_60%/0.2)]"
                            : "text-holo/40 hover:text-holo/70"
                        }`}
                      >
                        <Icon className="w-2.5 h-2.5" />
                        {modeConfig[m].label}
                      </button>
                    );
                  })}
                </div>

                {/* Subtitle / Chat Bubble — animated gradient sweep + sparkle burst */}
                <motion.div
                  key={`${mode}-${currentMsg}`}
                  initial={{ opacity: 0, y: 8, scale: 0.96, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="relative holo-subtitle-bar rounded-xl rounded-tl-sm p-3.5 mb-3 overflow-hidden"
                >
                  <motion.div
                    aria-hidden
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(110deg, transparent 30%, hsl(185 85% 60% / 0.18) 50%, transparent 70%)",
                    }}
                    animate={{ x: ["-100%", "120%"] }}
                    transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.2 }}
                  />
                  <AnimatePresence>
                    {[...Array(6)].map((_, i) => (
                      <motion.span
                        key={`spark-${sparkBurst}-${i}`}
                        className="absolute w-1 h-1 rounded-full bg-holo pointer-events-none"
                        style={{ left: `${20 + i * 12}%`, top: "50%" }}
                        initial={{ opacity: 0, scale: 0, y: 0 }}
                        animate={{
                          opacity: [0, 1, 0],
                          scale: [0, 1.4, 0],
                          y: [0, -16 - i * 2, -28],
                          x: [(i - 3) * 4, (i - 3) * 8],
                        }}
                        transition={{ duration: 0.9, delay: i * 0.04, ease: "easeOut" }}
                      />
                    ))}
                  </AnimatePresence>
                  {showSubtitles && (
                    <p className="relative text-xs text-holo/90 leading-relaxed min-h-[3rem] font-light">
                      {displayedText}
                      {isSpeaking && (
                        <span className="inline-flex gap-0.5 ml-1.5 align-middle">
                          {[0, 1, 2].map((i) => (
                            <motion.span
                              key={i}
                              className="inline-block w-1 h-1 rounded-full bg-holo"
                              animate={{ y: [0, -3, 0], opacity: [0.4, 1, 0.4] }}
                              transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.12 }}
                            />
                          ))}
                        </span>
                      )}
                    </p>
                  )}
                </motion.div>

                {/* Navigation */}
                <div className="flex items-center justify-between">
                  <div className="flex gap-1.5">
                    {messages.map((_, i) => (
                      <motion.button
                        key={i}
                        onClick={() => goToMsg(i)}
                        whileHover={{ scale: 1.3 }}
                        whileTap={{ scale: 0.85 }}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          i === currentMsg
                            ? "w-5 bg-holo shadow-[0_0_8px_hsl(185_85%_60%/0.5)]"
                            : "w-1.5 bg-holo/20 hover:bg-holo/40"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex gap-1">
                    <motion.button
                      onClick={handleReplay}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-holo/10 hover:bg-holo/20 text-holo transition-colors flex items-center gap-1"
                      title={isMuted ? "Unmute first to hear audio" : "Replay narration"}
                    >
                      <Play className="w-2.5 h-2.5" />
                      Replay
                    </motion.button>
                    <motion.button
                      onClick={() => goToMsg(Math.max(0, currentMsg - 1))}
                      disabled={currentMsg === 0}
                      whileHover={{ scale: 1.08, x: -2 }}
                      whileTap={{ scale: 0.92 }}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-holo/5 hover:bg-holo/10 text-holo/60 disabled:opacity-30 transition-colors"
                    >
                      Prev
                    </motion.button>
                    <motion.button
                      onClick={() => goToMsg(Math.min(messages.length - 1, currentMsg + 1))}
                      disabled={currentMsg === messages.length - 1}
                      whileHover={{ scale: 1.08, x: 2 }}
                      whileTap={{ scale: 0.92 }}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-holo/10 hover:bg-holo/20 text-holo disabled:opacity-30 transition-colors"
                    >
                      Next
                    </motion.button>
                  </div>
                </div>

                {/* Subtitle toggle */}
                <div className="flex items-center gap-2 mt-3 pt-2 border-t border-holo/10">
                  <button
                    onClick={() => setShowSubtitles(!showSubtitles)}
                    className={`text-[9px] px-2 py-0.5 rounded-md transition-colors flex items-center gap-1 ${
                      showSubtitles ? "bg-holo/15 text-holo" : "bg-holo/5 text-holo/40"
                    }`}
                  >
                    <MessageSquare className="w-2.5 h-2.5" />
                    Subtitles
                  </button>
                  <span className="text-[8px] text-holo/30 font-mono ml-auto">HIPAA-ALIGNED • NO PHI STORED</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Particles in card background */}
        <HoloParticles count={6} />
      </div>

      {/* ─── Quick Stats (holographic style) ─── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="mt-3 rounded-xl p-4 space-y-2.5 relative overflow-hidden holo-glow"
      >
        <div className="holo-scanlines rounded-xl" style={{ opacity: 0.3 }} />
        <div className="relative z-10">
          <h4 className="text-[10px] uppercase tracking-widest font-bold text-holo/60 font-mono">
            ◈ Quick Summary
          </h4>
          <div className="space-y-2 mt-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-holo/50">Health Score</span>
              <span
                className={`text-xs font-bold font-mono ${
                  results.healthScore >= 80
                    ? "text-status-normal"
                    : results.healthScore >= 60
                    ? "text-status-attention"
                    : "text-status-critical"
                }`}
              >
                {results.healthScore}/100
              </span>
            </div>
            <div className="w-full h-1.5 bg-holo/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${results.healthScore}%` }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 1.5 }}
                className="h-full rounded-full"
                style={{
                  background: `linear-gradient(90deg, hsl(var(--holo-primary)), hsl(var(--holo-accent)))`,
                  boxShadow: "0 0 12px hsl(var(--holo-primary) / 0.5)",
                }}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-2">
            <div className="text-center p-2 rounded-lg bg-status-normal/10 border border-status-normal/20">
              <div className="text-sm font-bold text-status-normal font-mono">{results.normalTests}</div>
              <div className="text-[9px] text-holo/40">Normal</div>
            </div>
            <div className="text-center p-2 rounded-lg bg-status-critical/10 border border-status-critical/20">
              <div className="text-sm font-bold text-status-critical font-mono">{results.abnormalTests}</div>
              <div className="text-[9px] text-holo/40">Flagged</div>
            </div>
          </div>
        </div>
      </motion.div>

    </motion.div>
  );
};

export default HolographicAvatar;
