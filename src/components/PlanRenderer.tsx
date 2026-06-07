import React, { useState } from "react";
import { HealthPlan } from "../types";
import {
  Heart,
  Flame,
  Apple,
  Shield,
  Printer,
  ChevronRight,
  AlertTriangle,
  Award,
  BookOpen,
  Coffee,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Copy,
  Check,
  ExternalLink
} from "lucide-react";
import { motion } from "motion/react";

function getPranayamaFallbackSteps(name: string): string[] {
  const norm = name.toLowerCase();
  if (norm.includes("anulom") || norm.includes("vilom") || norm.includes("nadi") || norm.includes("nostril")) {
    return [
      "Sit in a comfortable cross-legged posture with spine erect and shoulders completely relaxed.",
      "Close the right nostril with the right thumb, and inhale deeply through the left nostril.",
      "Close the left nostril with your ring finger, release the thumb, and exhale slowly via the right nostril.",
      "Inhale through the right, close it, and exhale smoothly through the left nostril to complete one cycle."
    ];
  }
  if (norm.includes("kapalb") || norm.includes("skull")) {
    return [
      "Sit comfortably with your spine erect, resting your hands on your knees in Gyan Mudra.",
      "Take a deep inhalation, then exhale sharply and forcefully through your nose while drawing your navel in.",
      "Let the inhalation happen naturally and passively as your abdominal muscles relax.",
      "Maintain a rhythmic pace of active, sharp exhalations and passive quiet inhalations."
    ];
  }
  if (norm.includes("bhramari") || norm.includes("humming") || norm.includes("bee")) {
    return [
      "Sit straight, close your eyes, and gently place your thumbs over the ear cartilage to block sounds.",
      "Place your index fingers lightly above eyes/eyebrows and remaining fingers resting on your face.",
      "Inhale deeply through both nostrils, filling the lungs fully.",
      "Exhale slowly and smoothly through your nose while making a uniform, soothing humming sound like a bee."
    ];
  }
  if (norm.includes("sheetali") || norm.includes("sitali") || norm.includes("cooling")) {
    return [
      "Sit in a comfortable position, extend your tongue and fold the sides up to shape it like a tube.",
      "Inhale deeply through this folded tube of the tongue, feeling a cold, refreshing sensation.",
      "Close your mouth, rest the tongue normal, and exhale slowly and completely through your nostrils."
    ];
  }
  // Generic fallback steps
  return [
    "Sit in a comfortable meditative posture keeping your neck and back properly aligned.",
    "Breathe naturally for a few cycles to quiet and stabilize the nervous system.",
    "Follow a balanced rhythm of uniform inhalation (Puraka) and smooth exhalation (Rechaka).",
    "Maintain focused awareness on the movement of the breath at the nostrils or abdomen."
  ];
}

function getAsanaFallbackSteps(name: string): string[] {
  const norm = name.toLowerCase();
  if (norm.includes("bhujanga") || norm.includes("cobra")) {
    return [
      "Lie face down on the mat with your forehead resting gently on the floor and feet together.",
      "Place your hands flat beneath your shoulders, keeping your elbows tucked close to your torso.",
      "Inhale and slowly lift your head, chest, and upper abdomen using your back muscles, keeping pubic bone on floor.",
      "Roll your shoulders back, keep elbows slightly bent, look forward, and breathe calmly before lowering."
    ];
  }
  if (norm.includes("shavasana") || norm.includes("corpse")) {
    return [
      "Lie flat on your back, feet separated comfortably, and legs relaxed with toes falling outward.",
      "Keep arms slightly away from sides, palms facing upward, and close your eyelids softly.",
      "Take slow, abdominal breaths, allowing your entire body to become heavy and sink into gravity.",
      "Focus your mind on relaxing each muscle group from toes to crown, holding complete silence."
    ];
  }
  if (norm.includes("paschimott") || norm.includes("forward bend")) {
    return [
      "Sit with your legs extended straight forward, spine erect, toes flexed toward you.",
      "Inhale and lift both arms overhead, lengthening your entire chimney of vertebrae.",
      "Exhale and fold forward from the hip joints, reaching to hold your feet, ankles, or shins.",
      "Keep your heart lifting forward and spine straight; do not force your head to touch the knees."
    ];
  }
  if (norm.includes("tadasana") || norm.includes("mountain")) {
    return [
      "Stand tall with feet together or hip-width apart, distributing weight equally between both legs.",
      "Engage your thigh muscles, roll your shoulders back and down, and let your arms hang at your sides.",
      "Inhale and stretch your spine up to lift the crown of your head toward the ceiling.",
      "Breathe slowly, establishing a solid, grounded posture like a tall stable mountain."
    ];
  }
  if (norm.includes("vriksh") || norm.includes("tree")) {
    return [
      "Stand straight, shift your body weight onto your left foot, and lift your right knee.",
      "Place the sole of your right foot high on the left inner thigh (avoid resting directly on the knee joint).",
      "Bring hands together in front of your chest, or extend them up above your head in a salutation.",
      "Find a single point to focus your gaze to stabilize your physical and mental balance."
    ];
  }
  if (norm.includes("balasana") || norm.includes("child")) {
    return [
      "Kneel on the floor, touch your big toes together and sit comfortably back on your heels.",
      "Exhale and bend your torso forward, resting your forehead gently on the mat in front of you.",
      "Extend your arms forward on the ground or lay them back alongside your hips, palms facing skyward.",
      "Breathe deeply into your back ribs, allowing your spine and shoulders to soften fully."
    ];
  }
  // Generic fallback steps
  return [
    "Assume the starting position slowly, aligning your joints without strain.",
    "Coordinate your movement with gentle, continuous breathing cycles.",
    "Exhale as you enter the stretch and hold the final posture with relaxation and ease.",
    "Release the posture gently, returning to the neutral resting state to notice the benefits."
  ];
}

interface PlanRendererProps {
  plan: HealthPlan;
}

export default function PlanRenderer({ plan }: PlanRendererProps) {
  const [activeTab, setActiveTab] = useState<"all" | "breath" | "yoga" | "diet" | "remedies">("all");
  const [copiedText, setCopiedText] = useState(false);
  const [showSandboxDisclaimer, setShowSandboxDisclaimer] = useState(false);

  const printReport = () => {
    setShowSandboxDisclaimer(true);
    try {
      window.print();
    } catch (err) {
      console.warn("Print trigger error:", err);
    }
  };

  const copyToClipboard = () => {
    // Construct a beautiful rich text layout
    let text = `========================================================\n`;
    text += `🌿 AYUSH PLAN - AYURVEDIC & YOGA THERAPY RECOVERY GUIDE\n`;
    text += `========================================================\n\n`;
    text += `📌 CONDITION: ${plan.disease || "Holistic Wellness Profile"}\n\n`;

    text += `✨ PRANAYAMA (VITAL FORCE BREATH):\n`;
    plan.pranayama.forEach((p, idx) => {
      text += `  [${idx + 1}] ${p.name}\n`;
      text += `      Benefits: ${p.benefits}\n`;
      text += `      Contraindications/Caution: ${p.caution}\n\n`;
    });

    text += `🧘 YOGA ASANAS (POSTURE PRACTICES):\n`;
    plan.asanas.forEach((a, idx) => {
      text += `  [${idx + 1}] ${a.name}\n`;
      text += `      Recommended for: ${a.benefits}\n`;
      text += `      Precautions: ${a.caution}\n\n`;
    });

    text += `🍎 DIETARY DIRECTIVES (PATHYA & APATHYA):\n`;
    text += `  ✓ RECOMMENDATIONS (What to Eat / Pathya):\n`;
    plan.diet.what_to_eat.forEach(item => {
      text += `    - ${item}\n`;
    });
    text += `\n  ✗ STRICT RESTRICTIONS (What to Avoid / Apathya):\n`;
    plan.diet.what_to_avoid.forEach(item => {
      text += `    - ${item}\n`;
    });

    text += `\n🍵 CLASSICAL AYURVEDIC HOME REMEDIES & HERBS:\n`;
    plan.home_remedies.forEach((remedy, idx) => {
      text += `  - ${remedy}\n`;
    });

    text += `\n⚖️ MEDICAL CLINCIAL DIRECTIVE:\n`;
    text += `  ${plan.medical_advice}\n\n`;
    text += `--------------------------------------------------------\n`;
    text += `Generated securely via Ayush Plan VedaAI system. Always consult a general physician.\n`;

    navigator.clipboard.writeText(text).then(() => {
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    });
  };

  const downloadAsTextFile = () => {
    let text = `========================================================\n`;
    text += `🌿 AYUSH PLAN - AYURVEDIC & YOGA THERAPY RECOVERY GUIDE\n`;
    text += `========================================================\n\n`;
    text += `📌 CONDITION: ${plan.disease || "Holistic Wellness Profile"}\n\n`;

    text += `✨ PRANAYAMA (VITAL FORCE BREATH):\n`;
    plan.pranayama.forEach((p, idx) => {
      text += `   * ${p.name}\n`;
      text += `     Benefits: ${p.benefits}\n`;
      text += `     Caution: ${p.caution}\n\n`;
    });

    text += `🧘 YOGA ASANAS (POSTURE PRACTICES):\n`;
    plan.asanas.forEach((a, idx) => {
      text += `   * ${a.name}\n`;
      text += `     Benefits: ${a.benefits}\n`;
      text += `     Caution: ${a.caution}\n\n`;
    });

    text += `🍎 DIETARY DIRECTIVES (PATHYA & APATHYA):\n`;
    text += `   FAVORED FOODS (Pathya):\n`;
    plan.diet.what_to_eat.forEach(item => {
      text += `     - ${item}\n`;
    });
    text += `\n   AVOID FOODS (Apathya):\n`;
    plan.diet.what_to_avoid.forEach(item => {
      text += `     - ${item}\n`;
    });

    text += `\n🍵 CLASSICAL AYURVEDIC HOME REMEDIES & FORMULAS:\n`;
    plan.home_remedies.forEach((remedy) => {
      text += `   - ${remedy}\n`;
    });

    text += `\n⚖️ MEDICAL DIRECTIVE & DISCLAIMER:\n`;
    text += `   ${plan.medical_advice}\n\n`;
    text += `--------------------------------------------------------\n`;
    text += `Generated on ${new Date().toLocaleDateString()} via Ayush Plan.\n`;

    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    // Format descriptive file name
    const safeName = (plan.disease || "wellness_plan").toLowerCase().replace(/[^a-z0-9]/g, "_").substring(0, 30);
    link.download = `ayush_plan_${safeName}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggeredChildren: 0.1, duration: 0.4 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  const listContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 14
      }
    }
  };

  return (
    <motion.div
      key={plan.disease || "wellness-plan"}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 print:p-0 font-sans"
      id="wellness-plan-display-root"
    >
      {/* Sandbox Iframe Directive Prompt */}
      {showSandboxDisclaimer && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-stone-700 leading-relaxed print:hidden flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold text-amber-900">Is the Print window blocked?</p>
            <p className="mt-0.5">
              Standard browsers block printing requests triggered inside sandboxed iframes. If the print dialog didn't show up, you can:
            </p>
            <ul className="list-disc list-inside mt-1 space-y-1 font-medium text-amber-800">
              <li>Click the <strong>"Open in New Tab"</strong> icon at the top-right of your screen to print directly from a standard tab.</li>
              <li>Or click <strong>"Download Plan"</strong> below to save this report as a robust local text file right now!</li>
            </ul>
            <button
              onClick={() => setShowSandboxDisclaimer(false)}
              className="mt-2 text-[10px] text-amber-800 hover:text-amber-950 font-bold underline cursor-pointer"
            >
              Dismiss warning
            </button>
          </div>
        </div>
      )}

      {/* Title Header Block */}
      <div className="bg-stone-900 text-white rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-md">
        <div className="absolute right-0 bottom-0 translate-x-10 translate-y-10 opacity-10">
          <Heart className="w-56 h-56 text-stone-300" />
        </div>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 z-10 relative">
          <div>
            <span className="text-emerald-400 text-xs font-semibold tracking-wider uppercase bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              Personalized Healing Plan
            </span>
            <h1 className="text-2xl md:text-3.5xl font-bold tracking-tight text-stone-100 mt-3">
              {plan.disease || "Holistic Wellness Analysis"}
            </h1>
            <p className="text-stone-400 text-sm mt-1 max-w-xl">
              Authentic wellness consultation compiled from physical notes, symptoms, and classical texts.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 shrink-0 print:hidden">
            {/* Copy Button */}
            <button
              onClick={copyToClipboard}
              id="btn-copy-plan"
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl transition-all shadow-2xs cursor-pointer select-none border ${
                copiedText
                  ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
                  : "bg-stone-800 hover:bg-stone-700 text-stone-200 border-stone-700"
              }`}
            >
              {copiedText ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  Copied Text!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy Plan
                </>
              )}
            </button>

            {/* Download Button */}
            <button
              onClick={downloadAsTextFile}
              id="btn-download-plan"
              className="flex items-center gap-1.5 px-3 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 text-xs font-semibold rounded-xl transition-all shadow-2xs cursor-pointer select-none"
            >
              <Download className="w-3.5 h-3.5" />
              Download (.txt)
            </button>

            {/* Print Button */}
            <button
              onClick={printReport}
              id="btn-print-plan"
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800 text-white font-semibold text-xs rounded-xl transition-all shadow-md shadow-emerald-950/20 cursor-pointer select-none"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Report
            </button>
          </div>
        </div>
      </div>

      {/* Navigation tabs for focused viewing */}
      <div className="flex overflow-x-auto pb-1 gap-2 border-b border-stone-200 print:hidden scrollbar-none">
        {[
          { id: "all", label: "Full Report", icon: BookOpen },
          { id: "breath", label: "Pranayama & Breath", icon: Flame },
          { id: "yoga", label: "Yoga Asanas", icon: Award },
          { id: "diet", label: "Yogic Diet (Pathya)", icon: Apple },
          { id: "remedies", label: "Ayurvedic Remedies", icon: Coffee }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              id={`tab-btn-${tab.id}`}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? "bg-emerald-800 text-white shadow-xs"
                  : "text-stone-600 hover:text-stone-900 bg-stone-50 hover:bg-stone-100/70"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>


      {/* Structured report pieces */}
      <div className="space-y-8">
        {/* SECTION FOR PRANAYAMA: BREATHING */}
        {(activeTab === "all" || activeTab === "breath") && (
          <motion.section variants={itemVariants} className="space-y-4">
            <div className="flex items-center gap-2 border-b border-stone-100 pb-2">
              <Flame className="w-5 h-5 text-amber-600" />
              <h3 className="text-lg font-bold text-stone-800">Pranayama (Vital Force Breathing)</h3>
            </div>

            {plan.pranayama && plan.pranayama.length > 0 ? (
              <motion.div
                variants={listContainerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {plan.pranayama.map((p, idx) => (
                  <motion.div
                    key={idx}
                    variants={cardVariants}
                    id={`pranayama-card-${idx}`}
                    className="p-5 rounded-xl border border-stone-100 bg-white shadow-2xs space-y-3 relative overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <h4 className="font-bold text-stone-800 text-base">{p.name}</h4>
                      </div>
                      <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                        <strong className="text-stone-700">Benefits:</strong> {p.benefits}
                      </p>

                      {/* Steps of performance */}
                      <div className="mt-3 bg-stone-50/50 border border-stone-100 rounded-lg p-3 space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
                          How to Practice / कृती
                        </span>
                        <ol className="list-decimal list-inside space-y-1">
                          {(p.steps && p.steps.length > 0 ? p.steps : getPranayamaFallbackSteps(p.name)).map((step, sIdx) => (
                            <li key={sIdx} className="text-[11px] text-stone-600 leading-relaxed pl-0.5">
                              <span className="text-stone-700">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>

                    {p.caution && (
                      <div className="mt-3 p-3 bg-amber-50/70 border border-amber-100 rounded-lg flex items-start gap-2.5">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Caution</p>
                          <p className="text-[11px] text-amber-700 font-medium leading-relaxed mt-0.5">{p.caution}</p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <p className="text-sm text-stone-400 italic">No specific pranayama details declared in prescription report.</p>
            )}
          </motion.section>
        )}

        {/* SECTION FOR ASANAS */}
        {(activeTab === "all" || activeTab === "yoga") && (
          <motion.section variants={itemVariants} className="space-y-4">
            <div className="flex items-center gap-2 border-b border-stone-100 pb-2">
              <Award className="w-5 h-5 text-emerald-600" />
              <h3 className="text-lg font-bold text-stone-800">Cure Yoga Asanas (Posture Practices)</h3>
            </div>

            {plan.asanas && plan.asanas.length > 0 ? (
              <motion.div
                variants={listContainerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {plan.asanas.map((a, idx) => (
                  <motion.div
                    key={idx}
                    variants={cardVariants}
                    id={`asana-card-${idx}`}
                    className="p-5 rounded-xl border border-stone-100 bg-white shadow-2xs space-y-3 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <h4 className="font-bold text-stone-800 text-base">{a.name}</h4>
                      </div>
                      <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                        <strong className="text-stone-700">Why Recommended:</strong> {a.benefits}
                      </p>

                      {/* Steps of performance */}
                      <div className="mt-3 bg-stone-50/50 border border-stone-100 rounded-lg p-3 space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                          How to Practice / कृती
                        </span>
                        <ol className="list-decimal list-inside space-y-1">
                          {(a.steps && a.steps.length > 0 ? a.steps : getAsanaFallbackSteps(a.name)).map((step, sIdx) => (
                            <li key={sIdx} className="text-[11px] text-stone-600 leading-relaxed pl-0.5">
                              <span className="text-stone-700">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>

                    {a.caution && (
                      <div className="mt-3 p-3 bg-stone-50 border border-stone-200 rounded-lg flex items-start gap-2.5">
                        <Shield className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[11px] font-bold text-stone-700 uppercase tracking-wider">Precautions</p>
                          <p className="text-[11px] text-stone-600 leading-relaxed mt-0.5">{a.caution}</p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <p className="text-sm text-stone-400 italic">No specific yoga asanas declared in the document notes.</p>
            )}
          </motion.section>
        )}

        {/* SECTION FOR DIET */}
        {(activeTab === "all" || activeTab === "diet") && (
          <motion.section variants={itemVariants} className="space-y-4">
            <div className="flex items-center gap-2 border-b border-stone-100 pb-2">
              <Apple className="w-5 h-5 text-emerald-700" />
              <h3 className="text-lg font-bold text-stone-800">Yogic Diet & Nutrition Chart (Pathya / Apathya)</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pathya - What to Eat */}
              <div className="bg-emerald-50/30 border border-emerald-100 rounded-xl p-5" id="diet-favorable-card">
                <div className="flex items-center gap-2 text-emerald-800 border-b border-emerald-100 pb-3 mb-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <h4 className="font-bold text-sm tracking-wide uppercase">Foods to Favor (Pathya / योग्य आहार)</h4>
                </div>
                {plan.diet?.what_to_eat && plan.diet.what_to_eat.length > 0 ? (
                  <ul className="space-y-2">
                    {plan.diet.what_to_eat.map((item, idx) => (
                      <li key={idx} className="text-xs text-stone-700 flex items-start gap-2">
                        <span className="text-emerald-500 font-bold shrink-0 mt-0.5">✓</span>
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-stone-400 italic">No items recommended explicitly.</p>
                )}
              </div>

              {/* Apathya - What to Avoid */}
              <div className="bg-rose-50/25 border border-rose-100 rounded-xl p-5" id="diet-avoid-card">
                <div className="flex items-center gap-2 text-rose-800 border-b border-rose-100 pb-3 mb-3">
                  <XCircle className="w-5 h-5 text-rose-600" />
                  <h4 className="font-bold text-sm tracking-wide uppercase">Foods to Avoid (Apathya / वर्ज्य आहार)</h4>
                </div>
                {plan.diet?.what_to_avoid && plan.diet.what_to_avoid.length > 0 ? (
                  <ul className="space-y-2">
                    {plan.diet.what_to_avoid.map((item, idx) => (
                      <li key={idx} className="text-xs text-stone-700 flex items-start gap-2">
                        <span className="text-rose-500 font-bold shrink-0 mt-0.5">✗</span>
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-stone-400 italic">No restrictions declared explicitly.</p>
                )}
              </div>
            </div>
          </motion.section>
        )}

        {/* SECTION FOR HOME REMEDIES */}
        {(activeTab === "all" || activeTab === "remedies") && (
          <motion.section variants={itemVariants} className="space-y-4">
            <div className="flex items-center gap-2 border-b border-stone-100 pb-2">
              <Coffee className="w-5 h-5 text-stone-700" />
              <h3 className="text-lg font-bold text-stone-800">Ayurvedic Remedies & Formulary</h3>
            </div>

            {plan.home_remedies && plan.home_remedies.length > 0 ? (
              <div className="bg-stone-50/50 border border-stone-200/80 rounded-xl p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {plan.home_remedies.map((remedy, idx) => (
                    <div
                      key={idx}
                      id={`remedy-item-${idx}`}
                      className="flex items-start gap-3 bg-white p-3 rounded-lg border border-stone-100 shadow-3xs"
                    >
                      <ChevronRight className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-xs text-stone-700 font-medium leading-relaxed">
                        {remedy}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-stone-400 italic">No home remedies suggested for this query.</p>
            )}
          </motion.section>
        )}

        {/* SECTION FOR DISCLAIMER */}
        {activeTab === "all" && plan.medical_advice && (
          <motion.div
            variants={itemVariants}
            id="medical-advice-disclaimer-card"
            className="p-5 rounded-xl border border-stone-200 bg-stone-50/60"
          >
            <div className="flex gap-3">
              <Shield className="w-5 h-5 text-stone-500 shrink-0 mt-0.5" />
              <div>
                <h5 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Important Medical Directive & Transcription Notes
                </h5>
                <p className="text-xs text-stone-600 leading-relaxed mt-1.5">
                  {plan.medical_advice}
                </p>
                <div className="mt-3.5 pt-3.5 border-t border-stone-200 text-[11px] text-stone-400">
                  Disclaimer: AI-generated holistic consults do not replace professional physician checkups. Please consult with certified medical staff or registered yoga guides prior to attempting high-intensity breath cycles or core asanas if blood arterial pressure is irregular.
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
