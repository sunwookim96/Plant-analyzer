import React from "react";
import { motion } from "framer-motion";
import { Activity, Play, ArrowLeft, Languages } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LiquidGlass from "@/components/LiquidGlass.jsx";
import backgroundVideo from "@/videos/PM_background.mp4";

const CardContent = ({ icon, title, description }) => (
  <div className="flex flex-col h-full text-left">
    <div className="flex items-center space-x-4 mb-4">
      <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.15)]">
        {React.cloneElement(icon, { className: "h-6 w-6 text-green-200" })}
      </div>
      <h3 className="text-xl font-bold text-white drop-shadow-sm">{title}</h3>
    </div>
    <p className="text-sm leading-relaxed text-gray-200 mb-6 font-medium">{description}</p>
    <div className="mt-auto pt-4 flex items-center text-green-300 text-sm font-semibold group-hover:text-white transition-colors">
      <span>Open guide</span>
      <Play className="w-3 h-3 ml-2 fill-current" />
    </div>
  </div>
);

export default function PhysiologicalEn() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-900">
      <div className="absolute inset-0 z-0 w-full h-full">
        <video autoPlay loop muted playsInline className="object-cover w-full h-full opacity-80" src={backgroundVideo} />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/20 to-slate-950/80" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="flex items-center justify-between mb-12">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate("/")}
            className="flex items-center text-gray-400 hover:text-white transition-colors group"
          >
            <div className="p-2 rounded-full bg-white/5 border border-white/10 group-hover:bg-white/10 mr-3">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium">Back to main</span>
          </motion.button>
          <button
            onClick={() => navigate("/physiological")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-sm text-gray-200 transition-colors"
          >
            <Languages className="w-4 h-4" />
            한국어
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-4 drop-shadow-lg">
            Physiological Measurement
          </h1>
          <p className="text-lg sm:text-xl text-gray-200 max-w-3xl mx-auto font-light drop-shadow">
            Guides for plant physiology, photosynthesis, gas exchange, and chamber-based measurements.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <div onClick={() => navigate("/li6800_en")} className="h-full cursor-pointer group">
            <LiquidGlass displacementScale={40} blurAmount={12} saturation={110} elasticity={0.3} cornerRadius={24} padding="32px" className="h-full pointer-events-none md:pointer-events-auto">
              <CardContent
                icon={<Activity />}
                title="LI-6800"
                description="Photosynthesis, stomatal conductance, light response, A/Ci curve, matching, zeroing, and data export guide."
              />
            </LiquidGlass>
          </div>
        </div>
      </div>
    </div>
  );
}
