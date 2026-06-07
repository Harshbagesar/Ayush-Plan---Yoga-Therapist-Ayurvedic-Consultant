import React, { useState, useRef } from "react";
import { Upload, Sparkles, Activity, FileText, Image as ImageIcon, Heart, Search, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface UploadQueryAreaProps {
  onAnalyze: (textQuery: string, imageBase64?: string, mimeType?: string) => void;
  isLoading: boolean;
}

const COMMON_DISEASES = [
  { label: "Cardiac / Heart Disease (हृदयरोग)", text: "हृदयरोग (Heart Disease) - recommended pranayama and cautions" },
  { label: "Diabetes (मधुमेह)", text: "मधुमेह (Diabetes) - Ayurvedic remedies, diet and asanas" },
  { label: "Ayurvedic Sleep Aid (निद्रानाश)", text: "निद्रानाश (Insomnia / Sleep issues) - calming pranayama and cooling diet" },
  { label: "Asthma / Breathing (दमा)", text: "दमा / श्वास कोंडणे (Asthma & Respiratory issues) - remedies and cautions" },
  { label: "Arthritis / Joint Pain (सांधेदुखी)", text: "सांधेदुखी (Arthritis) - warming ayurvedic herbs and gentle asanas" },
];

const BREATHING_QUOTES = [
  "Inhale courage, exhale doubt... Let your prana flow.",
  "Yoga is the journey of the self, through the self, to the self.",
  "Ayurveda teaches us that wellness is a continuous dance of body, mind, and spirit.",
  "Deep belly breathing triggers calm and balances the Vata-Pitta dosha.",
  "Let food be your medicine; let classical herbs restore your natural rhythm.",
];

export default function UploadQueryArea({ onAnalyze, isLoading }: UploadQueryAreaProps) {
  const [textQuery, setTextQuery] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<{
    base64: string;
    mimeType: string;
    preview: string;
    name: string;
  } | null>(null);

  const [activeQuoteIndex, setActiveQuoteIndex] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Rotate breathing quotes every 4 seconds when loading
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        setActiveQuoteIndex((prev) => (prev + 1) % BREATHING_QUOTES.length);
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file (PNG, JPG, or JPEG) containing wellness notes or prescriptions.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setUploadedImage({
        base64: result,
        mimeType: file.type,
        preview: URL.createObjectURL(file),
        name: file.name,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const removeUploadedImage = () => {
    setUploadedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textQuery && !uploadedImage) {
      alert("Please enter a health condition or upload an Ayurvedic note image to analyze.");
      return;
    }
    onAnalyze(textQuery, uploadedImage?.base64, uploadedImage?.mimeType);
  };

  const selectSuggested = (text: string) => {
    setTextQuery(text);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-emerald-100/80 p-6 md:p-8" id="workspace-input-area">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-700">
          <Activity className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-stone-800 tracking-tight">Therapeutic Search & Analysis</h2>
          <p className="text-xs text-stone-500">Provide an Ayurvedic/Yogic query or upload prescription handwritten images</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Text Input Row */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2" htmlFor="text-query-input">
            What symptoms or diseases would you like to plan for?
          </label>
          <div className="relative rounded-xl shadow-xs">
            <input
              id="text-query-input"
              type="text"
              value={textQuery}
              onChange={(e) => setTextQuery(e.target.value)}
              placeholder="e.g. हृदयरोग, Heart Disease, Diabetes, Insomnia..."
              disabled={isLoading}
              className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all text-sm pr-10"
            />
            <div className="absolute right-3 top-3.5 text-stone-400">
              <Search className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Suggestion Shortcuts */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-stone-500 tracking-wider uppercase block">
            Quick selection shortcuts (Marathi & English):
          </span>
          <div className="flex flex-wrap gap-2">
            {COMMON_DISEASES.map((disease, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => selectSuggested(disease.text)}
                disabled={isLoading}
                id={`disease-shortcut-${idx}`}
                className="text-xs px-3 py-1.5 bg-stone-50 hover:bg-emerald-50 text-stone-600 hover:text-emerald-700 font-medium rounded-lg border border-stone-200 hover:border-emerald-200 transition-colors cursor-pointer"
              >
                {disease.label}
              </button>
            ))}
          </div>
        </div>

        {/* Drag and Drop Upload Box */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-stone-500 tracking-wider uppercase block">
            Image Upload (Handwritten Notes / Prescriptions / Queries (Marathi / Hindi / English)):
          </span>

          {!uploadedImage ? (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={triggerFileSelect}
              id="drop-target-area"
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                dragActive
                  ? "border-emerald-500 bg-emerald-50/40"
                  : "border-stone-200 hover:border-emerald-400 bg-stone-50 hover:bg-emerald-50/20"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={isLoading}
              />
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="p-3 bg-white rounded-full shadow-xs border border-stone-100 text-stone-400">
                  <Upload className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-stone-700">
                    Drag and drop your healing notes or prescription image here
                  </p>
                  <p className="text-xs text-stone-400 mt-1">
                    Supports PNG, JPG, JPEG up to 10MB
                  </p>
                </div>
                <button
                  type="button"
                  className="px-4 py-2 bg-white border border-stone-200 hover:border-emerald-300 text-stone-700 hover:text-emerald-800 text-xs font-semibold rounded-lg shadow-2xs hover:shadow-sm transition-all"
                >
                  Choose File
                </button>
              </div>
            </div>
          ) : (
            <div className="border border-emerald-100 rounded-xl p-4 bg-emerald-50/10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={uploadedImage.preview}
                  alt="Thumbnail"
                  className="w-16 h-16 object-cover rounded-lg border border-emerald-100 shadow-3xs"
                />
                <div className="text-left">
                  <p className="text-sm font-semibold text-stone-700 max-w-[200px] sm:max-w-xs truncate">
                    {uploadedImage.name}
                  </p>
                  <p className="text-xs text-stone-400">
                    Ready to analyze • {uploadedImage.mimeType}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={removeUploadedImage}
                disabled={isLoading}
                className="p-1 px-2.5 text-xs text-red-600 hover:bg-red-50 font-medium rounded-md transition-colors"
                id="btn-remove-image"
              >
                Remove
              </button>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="pt-2">
          {!isLoading ? (
            <button
              type="submit"
              disabled={isLoading}
              id="btn-analyze-health"
              className="w-full py-4 bg-emerald-700 hover:bg-emerald-800 text-white font-medium rounded-xl flex items-center justify-center gap-2 shadow-md shadow-emerald-700/10 hover:shadow-lg transition-all cursor-pointer text-sm font-semibold"
            >
              <Sparkles className="w-4 h-4" />
              Analyze & Generate Ayurvedic Yoga Plan
            </button>
          ) : (
            <div className="space-y-4">
              <div className="w-full h-11 relative rounded-xl overflow-hidden bg-stone-100 border border-stone-200 flex items-center justify-center">
                <motion.div
                  initial={{ left: "-100%" }}
                  animate={{ left: "100%" }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute top-0 bottom-0 w-1/3 bg-linear-to-r from-transparent via-emerald-600/20 to-transparent"
                />
                <span className="text-xs font-semibold text-emerald-800 z-10 flex items-center gap-2">
                  <span className="animate-spin text-sm text-emerald-600 font-bold">&#x21BB;</span>
                  Consulting ancient ayurvedic & yoga systems...
                </span>
              </div>

              {/* Soothing breathing quote carousel */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeQuoteIndex}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.5 }}
                  className="text-center bg-stone-50 rounded-lg p-3 border border-stone-100"
                >
                  <p className="text-xs italic text-stone-600">
                    "{BREATHING_QUOTES[activeQuoteIndex]}"
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
