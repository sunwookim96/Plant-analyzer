import React from "react";
import { motion } from "framer-motion";
import { Beaker, Activity, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LiquidGlass from "@/components/LiquidGlass.jsx";

import backgroundVideo from "@/videos/main_background.mp4";

export default function MainHomeEn() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-900">
      <div className="absolute inset-0 z-0 w-full h-full">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="object-cover w-full h-full opacity-60"
          src={backgroundVideo}
        />
      </div>

      <button
        onClick={() => navigate('/')}
        className="absolute top-24 right-6 z-20 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm font-semibold backdrop-blur-xl hover:bg-white/20 transition-colors"
      >
        한국어
      </button>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-24 flex flex-col items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight mb-6 drop-shadow-2xl">
            Plant Analyzer
          </h1>
          <p className="text-xl sm:text-2xl text-gray-100 max-w-3xl mx-auto drop-shadow-md font-light">
            An integrated protocol platform for laboratory analysis and physiological measurement.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
          <div onClick={() => navigate('/home_en')} className="h-full cursor-pointer group">
            <LiquidGlass
              displacementScale={64}
              blurAmount={12}
              saturation={110}
              elasticity={0.3}
              cornerRadius={32}
              padding="40px"
              className="h-full pointer-events-none md:pointer-events-auto"
            >
              <div className="flex flex-col h-full text-left">
                <div className="flex items-center space-x-5 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                    <Beaker className="h-8 w-8 text-blue-300" />
                  </div>
                  <h3 className="text-3xl font-bold text-white drop-shadow-md">
                    Instrumental
                    <span className="block text-blue-200">Analysis</span>
                  </h3>
                </div>
                <p className="text-lg text-gray-100 font-medium leading-relaxed">
                  Spectrophotometry, HPLC, Kjeldahl, and other wet-lab biochemical analysis workflows.
                </p>
                <div className="mt-auto pt-8 flex items-center text-blue-200 font-semibold group-hover:text-white transition-colors">
                  <span>Open protocols</span>
                  <Play className="w-4 h-4 ml-2 fill-current" />
                </div>
              </div>
            </LiquidGlass>
          </div>

          <div onClick={() => navigate('/physiological_en')} className="h-full cursor-pointer group">
            <LiquidGlass
              displacementScale={64}
              blurAmount={12}
              saturation={110}
              elasticity={0.3}
              cornerRadius={32}
              padding="40px"
              className="h-full pointer-events-none md:pointer-events-auto"
            >
              <div className="flex flex-col h-full text-left">
                <div className="flex items-center space-x-5 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-green-500/20 border border-green-400/30 flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.5)]">
                    <Activity className="h-8 w-8 text-green-300" />
                  </div>
                  <h3 className="text-3xl font-bold text-white drop-shadow-md">
                    Physiological
                    <span className="block text-green-200">Measurement</span>
                  </h3>
                </div>
                <p className="text-lg text-gray-100 font-medium leading-relaxed">
                  LI-6800, LI-600, SPAD, and photosynthesis-related instrument operation guides.
                </p>
                <div className="mt-auto pt-8 flex items-center text-green-200 font-semibold group-hover:text-white transition-colors">
                  <span>Open manuals</span>
                  <Play className="w-4 h-4 ml-2 fill-current" />
                </div>
              </div>
            </LiquidGlass>
          </div>
        </div>
      </div>
    </div>
  );
}
