import React, { useState, useEffect } from "react";
import { HealthPlan, HistoryItem } from "./types";
import UploadQueryArea from "./components/UploadQueryArea";
import PlanRenderer from "./components/PlanRenderer";
import HistorySidebar from "./components/HistorySidebar";
import GuideModal from "./components/GuideModal";
import { motion, AnimatePresence } from "motion/react";
import {
  Heart,
  Sparkles,
  Shield,
  Compass,
  Sprout,
  AlertCircle,
  Clock,
  BookOpen,
  Flower,
  Lightbulb,
  ChevronLeft,
  ChevronRight,
  Share2,
  Check
} from "lucide-react";

const AYURVEDIC_TIPS = [
  {
    title: "The Golden Rule of Eating (Ahara)",
    content: "Eat only when you are truly hungry. Wait at least 4 to 6 hours between meals to allow the previous meal to be completely digested (Agni Pradeepbhava).",
    source: "Charaka Samhita"
  },
  {
    title: "Ushapan (Morning Hydration)",
    content: "Drink a glass of warm water right after waking up. It gently stimulates bowel movement, clears toxins (Ama) from the digestive tract, and balances Vata dosha.",
    source: "Ashtanga Hridaya"
  },
  {
    title: "Noontime is Peak Agni Peak",
    content: "Make lunch your primary, largest meal. The solar force is strongest between 12 PM and 2 PM, mirroring your internal digestive fire.",
    source: "Sushruta Samhita"
  },
  {
    title: "Golden Milk for Rejuvenation",
    content: "Drink warm dairy or plant milk with turmeric, a pinch of black pepper, and nutmeg before bed. It promotes restorative sleep (Ojas) and reduces tissue inflammation.",
    source: "Traditional Formulary"
  },
  {
    title: "Nadi Shodhana for Stress Relief",
    content: "Practice 5-10 minutes of Alternate Nostril Breathing (Nadi Shodhana) daily. It purifies channels, balances masculine & feminine energies, and clears mental fog.",
    source: "Hatha Yoga Pradipika"
  },
  {
    title: "Seasonal Adaptation (Ritucharya)",
    content: "Adjust your life practices according to seasons. Favor warm, oiled, cooked meals in winter (Vata season) versus light, cooling foods in summer (Pitta season).",
    source: "Charaka Samhita"
  }
];

export default function App() {
  const [currentPlan, setCurrentPlan] = useState<HealthPlan | null>(null);
  const [activeHistoryId, setActiveHistoryId] = useState<string | undefined>(undefined);
  const [historyList, setHistoryList] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Reset copied state when tip rotates
  useEffect(() => {
    setCopied(false);
  }, [currentTipIndex]);

  const handleCopyTip = () => {
    const activeTip = AYURVEDIC_TIPS[currentTipIndex];
    const textToCopy = `"${activeTip.title}"\n${activeTip.content}\n— Source: ${activeTip.source}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
      console.error("Failed to copy tip text: ", err);
    });
  };

  // Rotate daily Ayurvedic tips every 8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % AYURVEDIC_TIPS.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("ayush_consultation_history");
      if (stored) {
        setHistoryList(JSON.parse(stored));
      }
    } catch (err) {
      console.error("Failed to load search history", err);
    }
  }, []);

  // Save history to localStorage
  const saveToHistory = (newPlan: HealthPlan, queryText: string, imageBase64?: string) => {
    try {
      const newItem: HistoryItem = {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: new Date().toISOString(),
        queryText: queryText || `Note on ${newPlan.disease}`,
        image: imageBase64, // base64 representation if uploaded
        plan: newPlan
      };

      const updatedHistory = [newItem, ...historyList];
      setHistoryList(updatedHistory);
      localStorage.setItem("ayush_consultation_history", JSON.stringify(updatedHistory));
      setActiveHistoryId(newItem.id);
    } catch (err) {
      console.error("Could not write to localStorage history", err);
    }
  };

  const handleSelectItem = (item: HistoryItem) => {
    setCurrentPlan(item.plan);
    setActiveHistoryId(item.id);
    setErrorMessage(null);

    // Scroll smoothly to output workspace
    const element = document.getElementById("plan-viewport");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleDeleteItem = (id: string) => {
    const updated = historyList.filter((item) => item.id !== id);
    setHistoryList(updated);
    localStorage.setItem("ayush_consultation_history", JSON.stringify(updated));

    if (activeHistoryId === id) {
      setCurrentPlan(null);
      setActiveHistoryId(undefined);
    }
  };

  const handleClearAllHistory = () => {
    if (window.confirm("Are you sure you want to permanently delete all consultation history?")) {
      setHistoryList([]);
      localStorage.removeItem("ayush_consultation_history");
      setCurrentPlan(null);
      setActiveHistoryId(undefined);
    }
  };

  const triggerAnalyze = async (textQuery: string, imageBase64?: string, mimeType?: string) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          textQuery,
          image: imageBase64,
          mimeType
        })
      });

      if (!response.ok) {
        let errMessage = `Server responded with status ${response.status}`;
        try {
          const errData = await response.json();
          errMessage = errData.error || errMessage;
        } catch (_) {
          // If response is not JSON (e.g. standard Vercel HTML error or empty response)
          try {
            const bodyText = await response.text();
            if (bodyText && bodyText.trim().length > 0 && bodyText.length < 150) {
              errMessage = bodyText.trim();
            }
          } catch (_) {}
        }
        throw new Error(errMessage);
      }

      let planData: HealthPlan;
      try {
        planData = await response.json();
      } catch (jsonErr: any) {
        throw new Error("Received an invalid response format from the server. Please check your environment variables or try again later.");
      }

      setCurrentPlan(planData);
      saveToHistory(planData, textQuery, imageBase64);

      // Scroll smoothly to output
      setTimeout(() => {
        const element = document.getElementById("plan-viewport");
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 300);
    } catch (err: any) {
      console.error("Fetch Analysis Error:", err);
      setErrorMessage(err.message || "An error occurred while calling the Ayurvedic therapist oracle.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-20 font-sans print:bg-white text-stone-800" id="ayush-app-structure">
      {/* Healing Header Bar */}
      <header className="bg-white border-b border-stone-100 sticky top-0 z-40 print:hidden shadow-3xs" id="app-sticky-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-700 rounded-xl text-white shadow-xs">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-stone-900 leading-none">Ayush Plan</h1>
                <span className="hidden sm:inline bg-emerald-50 text-emerald-800 text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded border border-emerald-200">
                  VedaAI v3.5
                </span>
              </div>
              <p className="text-[11px] text-stone-500 font-medium">Ayurvedic Practice & Yoga therapist Oracle</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-medium text-stone-500">
            <div className="hidden md:flex items-center gap-1.5 bg-stone-50 px-3 py-1.5 rounded-lg border border-stone-200/60">
              <Compass className="w-3.5 h-3.5 text-stone-400" />
              <span>Authentic Vedic Principles • Self-Healing Guidance</span>
            </div>
            <button
              onClick={() => setIsGuideOpen(true)}
              id="top-right-guide-btn"
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
              title="Open Holistic Healing Guide"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Healing Guide</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8" id="application-body">
        {/* Intro Hero with clean alignment */}
        <div className="text-left mb-8 max-w-3xl print:hidden space-y-2">
          <span className="text-xs font-bold text-emerald-700 tracking-wider uppercase block">
            Holistic Healing Intelligence
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight leading-tight">
            Prescription Note Reading & Ayurvedic Recovery Guide
          </h2>
          <p className="text-stone-500 text-sm leading-relaxed max-w-2xl">
            Upload images containing handwritten prescription notes, specific diseases, wellness lists in Marathi/Hindi/English, or type a custom disease. Get a beautifully structured, highly secure diet chart (Pathya), therapeutic Pranayama guide, and Asanas.
          </p>
        </div>

        {/* Dynamic Warning Card if API key issue or server errors arise */}
        {errorMessage && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200/95 rounded-xl flex items-start gap-3" id="error-alert-wrapper">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-bold text-red-900">Oracle consultation interrupted</h4>
              <p className="text-xs text-red-700 mt-1 leading-relaxed">
                {errorMessage}
              </p>
              <button
                onClick={() => setErrorMessage(null)}
                className="text-xs text-red-800 font-semibold underline hover:text-red-950 mt-1 cursor-pointer"
              >
                Dismiss alert
              </button>
            </div>
          </div>
        )}

        {/* Grid Separation split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT PANEL: Workspace Inputs & Logs */}
          <div className="lg:col-span-5 space-y-8 print:hidden">
            <UploadQueryArea onAnalyze={triggerAnalyze} isLoading={isLoading} />
            <HistorySidebar
              items={historyList}
              onSelectItem={handleSelectItem}
              onDeleteItem={handleDeleteItem}
              onClearAll={handleClearAllHistory}
              currentActiveId={activeHistoryId}
            />
          </div>

          {/* RIGHT PANEL: Healing Plan Viewport */}
          <div className="lg:col-span-7" id="plan-viewport">
            {currentPlan ? (
              <PlanRenderer plan={currentPlan} />
            ) : (
              <div
                className="bg-white rounded-2xl border border-stone-200/70 p-12 text-center shadow-3xs flex flex-col items-center justify-center min-h-[450px]"
                id="empty-consultation-banner"
              >
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-700 mb-5 border border-emerald-100">
                  <Flower className="w-8 h-8 animate-pulse text-emerald-800" />
                </div>
                <h3 className="text-lg font-bold text-stone-800 tracking-tight">Active Therapist Consultation Window</h3>
                <p className="text-stone-500 text-xs mt-2 max-w-sm leading-relaxed">
                  Enter a physiological concern or upload your Ayurvedic prescription written notes on the left. The VedaAI system will transcribe it instantly and compose your holistic healing guidelines.
                </p>

                {/* Rotating Daily Ayurvedic Tip card */}
                <div className="mt-8 bg-emerald-50/40 border border-emerald-100 rounded-xl p-4.5 max-w-lg w-full text-left relative overflow-hidden" id="daily-tip-card">
                  {/* Timer Progress Bar */}
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-emerald-100/30">
                    <motion.div
                      key={currentTipIndex}
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 8, ease: "linear" }}
                      className="h-full bg-emerald-600/60"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-emerald-100/60">
                    <div className="flex items-center gap-1.5 text-emerald-800 text-xs font-bold">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                      <span>Daily Ayurvedic Tip</span>
                    </div>
                     <div className="flex items-center gap-1.5">
                      {/* Copy Tip Button wrapper with Tooltip */}
                      <div className="relative group">
                        <button
                          onClick={handleCopyTip}
                          className={`p-1 rounded-md transition-all cursor-pointer ${
                            copied
                              ? "bg-emerald-100 text-emerald-800"
                              : "hover:bg-emerald-100/50 text-emerald-700 hover:text-emerald-900"
                          }`}
                          title={copied ? "Copied!" : "Copy Ayurvedic Tip"}
                          id="btn-copy-tip"
                          type="button"
                          aria-label="Copy Ayurvedic Tip text to clipboard"
                        >
                          {copied ? (
                            <Check className="w-3.5 h-3.5" />
                          ) : (
                            <Share2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <span className="pointer-events-none absolute bottom-full mb-1 sm:mb-2 left-1/2 -translate-x-1/2 bg-stone-950 text-stone-100 text-[10px] font-semibold px-2 py-1.5 rounded-lg shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50">
                          {copied ? "Copied!" : "Copy Tip to Clipboard"}
                        </span>
                      </div>

                      <span className="w-px h-3 bg-emerald-200/50" />

                      {/* Previous button with Tooltip */}
                      <div className="relative group">
                        <button
                          onClick={() => setCurrentTipIndex((prev) => (prev - 1 + AYURVEDIC_TIPS.length) % AYURVEDIC_TIPS.length)}
                          className="p-1 rounded-md hover:bg-emerald-100/50 text-emerald-700 transition-colors cursor-pointer"
                          title="Previous tip"
                          type="button"
                          aria-label="View previous tip"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                        <span className="pointer-events-none absolute bottom-full mb-1 sm:mb-2 left-1/2 -translate-x-1/2 bg-stone-950 text-stone-100 text-[10px] font-semibold px-2 py-1.5 rounded-lg shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50">
                          Previous Tip
                        </span>
                      </div>

                      {/* Next button with Tooltip */}
                      <div className="relative group">
                        <button
                          onClick={() => setCurrentTipIndex((prev) => (prev + 1) % AYURVEDIC_TIPS.length)}
                          className="p-1 rounded-md hover:bg-emerald-100/50 text-emerald-700 transition-colors cursor-pointer"
                          title="Next tip"
                          type="button"
                          aria-label="View next tip"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                        <span className="pointer-events-none absolute bottom-full mb-1 sm:mb-2 left-1/2 -translate-x-1/2 bg-stone-950 text-stone-100 text-[10px] font-semibold px-2 py-1.5 rounded-lg shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50">
                          Next Tip
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="min-h-[72px] relative">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentTipIndex}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.35 }}
                      >
                        <h4 className="text-xs font-bold text-stone-800">{AYURVEDIC_TIPS[currentTipIndex].title}</h4>
                        <p className="text-stone-600 text-[11px] leading-relaxed mt-1">
                          {AYURVEDIC_TIPS[currentTipIndex].content}
                        </p>
                        <div className="mt-2 text-[9px] text-stone-400 font-semibold italic text-right">
                          — {AYURVEDIC_TIPS[currentTipIndex].source}
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg w-full text-left">
                  <div className="bg-stone-50 border border-stone-200 p-3.5 rounded-xl space-y-1.5">
                    <span className="text-[10px] font-extrabold uppercase text-emerald-800 tracking-wide">OCR Intelligence</span>
                    <p className="text-[10px] text-stone-500 leading-relaxed">Reads cursive scripts in Marathi, Hindi & English.</p>
                  </div>
                  <div className="bg-stone-50 border border-stone-200 p-3.5 rounded-xl space-y-1.5">
                    <span className="text-[10px] font-extrabold uppercase text-emerald-800 tracking-wide">Yoga Therapy</span>
                    <p className="text-[10px] text-stone-500 leading-relaxed">Tailors pranayama and asanas to prevent contraindications.</p>
                  </div>
                  <div className="bg-stone-50 border border-stone-200 p-3.5 rounded-xl space-y-1.5">
                    <span className="text-[10px] font-extrabold uppercase text-emerald-800 tracking-wide">Pathya Chart</span>
                    <p className="text-[10px] text-stone-500 leading-relaxed">Categorizes friendly (Pathya) vs restricted (Apathya) dietary items.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Small floating footer with information */}
      <footer className="mt-20 border-t border-stone-200 bg-white py-10 print:hidden text-center text-stone-400 text-[11px]" id="app-footer">
        <div className="max-w-7xl mx-auto px-4">
          <p>© 2026 Ayush Plan • Engineered with authentic Ayurvedic texts and Yoga practice standards.</p>
        </div>
      </footer>

      {/* Guide Modal Backdrop */}
      <GuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
    </div>
  );
}
