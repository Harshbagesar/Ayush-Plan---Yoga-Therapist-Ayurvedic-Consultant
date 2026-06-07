import React from "react";
import { X, BookOpen, Heart, Flame, Apple, Sparkles, HelpCircle, AlertTriangle, ShieldCheck, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GuideModal({ isOpen, onClose }: GuideModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto print:hidden" id="guide-modal-overlay">
          {/* Backdrop blur effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
          />

          {/* Modal Container */}
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all w-full max-w-2xl border border-stone-100"
              id="guide-modal-content"
            >
              {/* Header block with elegant green banner */}
              <div className="bg-emerald-800 text-white p-6 relative overflow-hidden">
                <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-10">
                  <BookOpen className="w-36 h-36" />
                </div>
                <div className="flex items-center justify-between z-10 relative">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-300" />
                    <h3 className="text-lg md:text-xl font-bold tracking-tight">Ayush Holistic Healing Guide</h3>
                  </div>
                  <button
                    onClick={onClose}
                    className="rounded-full p-1.5 bg-emerald-900/40 hover:bg-emerald-900/80 transition-colors text-emerald-100 cursor-pointer"
                    id="btn-close-guide"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-emerald-100 text-xs mt-1.5 max-w-md">
                  A foundational handbook to understand Ayurvedic wellness, Yoga therapy prescriptions, and dietary rules.
                </p>
              </div>

              {/* Scrollable Body */}
              <div className="p-6 md:p-8 space-y-6 max-h-[70vh] overflow-y-auto scrollbar-thin">
                {/* How to use OCR note uploads */}
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 text-stone-800 border-b border-stone-100 pb-1.5">
                    <HelpCircle className="w-4 h-4 text-emerald-600" />
                    <h4 className="font-bold text-sm uppercase tracking-wide">1. Prescription Reading & OCR Guide</h4>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    This assistant reads handwritten and printed notes, formulas, or symptom logs in <strong>Marathi</strong> (e.g., हृदयरोग, सांधेदुखी), <strong>Hindi</strong>, or <strong>English</strong>.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                    <div className="bg-stone-50 p-3 rounded-lg border border-stone-100/80">
                      <p className="text-[11px] font-bold text-stone-700">Good Image Tips</p>
                      <p className="text-[10px] text-stone-500 mt-1">
                        Ensure clear lighting, capture the language legibly, and center the text clearly on the note card.
                      </p>
                    </div>
                    <div className="bg-stone-50 p-3 rounded-lg border border-stone-100/80">
                      <p className="text-[11px] font-bold text-stone-700">Languages</p>
                      <p className="text-[10px] text-stone-500 mt-1">
                        Input keywords in Marathi cursive script, and our intelligence translates them directly into matching Western anatomy terms.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Understanding Pathya and Apathya */}
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 text-stone-800 border-b border-stone-100 pb-1.5">
                    <Apple className="w-4 h-4 text-emerald-600" />
                    <h4 className="font-bold text-sm uppercase tracking-wide">2. Yogic Nutrition (Pathya & Apathya)</h4>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Ayurveda views food (Ahara) as the primary medicine.
                  </p>
                  <ul className="space-y-2 pl-1">
                    <li className="flex items-start gap-1.5 text-xs text-stone-600 leading-normal">
                      <span className="text-emerald-600 font-bold">✓ Pathya (Favor):</span>
                      <span>Whole grains, green leafy vegetables, steamed organic gourd, seasonal sweet fruits, warm clear soups, split mung dal, and freshly cooked kitchari.</span>
                    </li>
                    <li className="flex items-start gap-1.5 text-xs text-stone-600 leading-normal">
                      <span className="text-amber-700 font-bold">✗ Apathya (Avoid):</span>
                      <span>Stale or frozen meals, highly carbonated soda, excess sour/spicy marinades, fermented curds at night, deep-fried flours, and incompatible food combinations (Virudh Ahara).</span>
                    </li>
                  </ul>
                </div>

                {/* Classical Yoga Therapy Cautions */}
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 text-stone-800 border-b border-stone-100 pb-1.5">
                    <Flame className="w-4 h-4 text-emerald-600" />
                    <h4 className="font-bold text-sm uppercase tracking-wide">3. Yoga Therapy & Cautions</h4>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Breathing and movement must adapt to your safety limits:
                  </p>
                  <div className="p-3.5 bg-amber-50/70 border border-amber-100 rounded-xl space-y-1.5">
                    <div className="flex items-center gap-1.5 text-amber-800 text-xs font-bold uppercase tracking-wider">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Symptom Constraints</span>
                    </div>
                    <ul className="list-disc list-inside text-[10px] text-amber-700 space-y-1 leading-relaxed">
                      <li><strong>Cardiac issues/High Blood Pressure:</strong> Avoid vigorous, high-speed Kapalbhati, Bahya Kumbhaka, or extreme backbends. Favor slow Anulom Vilom and gentle Shavasana.</li>
                      <li><strong>Hernia or Post-operative states:</strong> Avoid strenuous core engagement or intense forward bends (like Paschimottanasana).</li>
                      <li><strong>Arthritis or severe Join damage:</strong> Avoid heavy load-bearing standing postures. Practice seated Sukshma Vyayama (joint rotations).</li>
                    </ul>
                  </div>
                </div>

                {/* Common Healing Herbals */}
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 text-stone-800 border-b border-stone-100 pb-1.5">
                    <Heart className="w-4 h-4 text-emerald-600" />
                    <h4 className="font-bold text-sm uppercase tracking-wide">4. Classical Ayurvedic Herbals</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-3" id="guide-herbal-matrix">
                    <div className="bg-stone-50/70 p-3 rounded-lg border border-stone-100 text-left">
                      <span className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-800 block">Tulsi (Holy Basil)</span>
                      <p className="text-[10px] text-stone-500 leading-normal mt-0.5">Clears respiratory channels (Pranavaha Srotas), balances Kapha dosha, and supports immunity.</p>
                    </div>
                    <div className="bg-stone-50/70 p-3 rounded-lg border border-stone-100 text-left">
                      <span className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-800 block">Haridra (Turmeric)</span>
                      <p className="text-[10px] text-stone-500 leading-normal mt-0.5">Incredible anti-inflammatory substance, purifies blood supply channels, and reduces tissue toxins.</p>
                    </div>
                    <div className="bg-stone-50/70 p-3 rounded-lg border border-stone-100 text-left">
                      <span className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-800 block">Ashwagandha</span>
                      <p className="text-[10px] text-stone-500 leading-normal mt-0.5">Soothes the endocrine nervous system, relieves anxiety (balances excessive Vata), and boosts vitality.</p>
                    </div>
                    <div className="bg-stone-50/70 p-3 rounded-lg border border-stone-100 text-left">
                      <span className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-800 block">Shunthi (Dry Ginger)</span>
                      <p className="text-[10px] text-stone-500 leading-normal mt-0.5">Acts as a direct stimulant for digestive fire (Agni), reduces flatulence, and relieves light cold.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Banner */}
              <div className="bg-stone-50 p-4 border-t border-stone-100 flex items-center justify-between text-stone-500 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span className="font-medium text-stone-600">Ayush Practice Companion Standard</span>
                </div>
                <button
                  onClick={onClose}
                  className="px-4 py-1.5 bg-emerald-800 hover:bg-emerald-950 text-white font-semibold rounded-lg text-[11px] transition-colors cursor-pointer"
                  id="btn-guide-got-it"
                >
                  Got It
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
