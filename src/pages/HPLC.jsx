import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FlaskConical, ArrowRight, ArrowLeft, Beaker, CheckCircle2, FileText,
  Microscope, Snowflake, Calculator, AlertTriangle, Languages
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createPageUrl } from "@/utils";
import { getHplcProtocolEntries, getHplcProtocol } from "@/data/hplcProtocols";

const GlassCard = ({ children, className = "" }) => (
  <div className={`rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-xl overflow-hidden ${className}`}>
    {children}
  </div>
);

const SectionCard = ({ icon, title, children, tone = "blue" }) => {
  const toneMap = {
    blue: "text-blue-300 bg-blue-500/10 border-blue-500/20",
    green: "text-green-300 bg-green-500/10 border-green-500/20",
    amber: "text-amber-300 bg-amber-500/10 border-amber-500/20",
    purple: "text-purple-300 bg-purple-500/10 border-purple-500/20",
    red: "text-red-300 bg-red-500/10 border-red-500/20"
  };
  return (
    <div className="bg-white/5 rounded-2xl p-5 border border-white/10 h-full">
      <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-base">
        <span className={`w-8 h-8 rounded-xl border flex items-center justify-center ${toneMap[tone] || toneMap.blue}`}>
          {React.cloneElement(icon, { className: "h-4 w-4" })}
        </span>
        {title}
      </h3>
      {children}
    </div>
  );
};

const NumberedList = ({ items }) => (
  <ol className="space-y-3">
    {items.map((item, index) => (
      <li key={index} className="flex items-start gap-3 text-sm leading-relaxed text-gray-300">
        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-bold flex items-center justify-center">
          {index + 1}
        </span>
        <span>{item}</span>
      </li>
    ))}
  </ol>
);

const BulletList = ({ items, tone = "blue" }) => {
  const color = tone === "amber" ? "text-amber-300" : tone === "green" ? "text-green-300" : tone === "red" ? "text-red-300" : "text-blue-300";
  return (
    <ul className="space-y-3">
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-3 text-sm leading-relaxed text-gray-300">
          <CheckCircle2 className={`w-4 h-4 mt-0.5 flex-shrink-0 ${color}`} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
};

const getIconForProtocol = (key) => {
  if (key === "glucosinolate") return <Beaker className="h-5 w-5" />;
  if (key === "cannabinoid") return <Microscope className="h-5 w-5" />;
  if (key === "artemisinin") return <FlaskConical className="h-5 w-5" />;
  if (key === "lamiaceae_markers") return <FileText className="h-5 w-5" />;
  return <FlaskConical className="h-5 w-5" />;
};

export default function HPLC({ lang = "ko" }) {
  const [selectedAnalysis, setSelectedAnalysis] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const isEn = lang === "en";
  const protocolEntries = getHplcProtocolEntries(lang);
  const selectedProtocol = selectedAnalysis ? getHplcProtocol(selectedAnalysis, lang) : null;

  const img = (file) => {
    try {
      return new URL(`../images/${file}`, import.meta.url).href;
    } catch (e) {
      return `/images/${file}`;
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const selected = params.get("selected");
    if (selected && getHplcProtocol(selected, lang)) {
      setSelectedAnalysis(selected);
    } else {
      setSelectedAnalysis("");
    }
  }, [location.search, lang]);

  const handleAnalyzeClick = () => {
    if (!selectedAnalysis) return;
    const targetName = isEn ? "HPLC_Results_en" : "HPLC_Results";
    const targetPath = typeof createPageUrl === "function" ? createPageUrl(targetName) : (isEn ? "/hplc_results_en" : "/hplc_results");
    navigate(`${targetPath}?analysis_type=${selectedAnalysis}`);
  };

  const text = {
    back: isEn ? "Back" : "돌아가기",
    homePath: isEn ? "/home_en" : "/home",
    title: isEn ? "HPLC Analysis Protocols" : "HPLC 분석 프로토콜",
    subtitle: isEn
      ? "Select a target method, review sample preparation/storage, and move to the RT/area calculator."
      : "분석 항목을 선택하면 시료 제조·보관법, HPLC 조건, 계산식을 함께 확인할 수 있습니다.",
    newBadge: isEn ? "New" : "신규",
    start: isEn ? "Start quantification" : "정량 분석 시작",
    targets: isEn ? "Target compounds" : "분석 대상 화합물",
    samplePrep: isEn ? "Sample preparation" : "시료 제조 방법",
    chromatographic: isEn ? "HPLC conditions" : "HPLC 조건",
    calculation: isEn ? "Calculation" : "계산식",
    storage: isEn ? "Storage" : "시료·시약 보관법",
    notes: isEn ? "Important notes" : "주의사항",
    matrix: isEn ? "Matrix" : "시료 기준",
    langSwitch: isEn ? "한국어" : "English"
  };

  const switchLangPath = isEn ? createPageUrl("HPLC") : createPageUrl("HPLC_en");

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-900 text-gray-100 font-sans">
      <div className="absolute inset-0 z-0 w-full h-full">
        <img src={img("hplc_background.jpg")} alt="Lab Background" className="w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/40 to-slate-950/90" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-32 pb-12 space-y-8">
        <div className="flex items-center justify-between gap-3">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate(text.homePath)}
            className="flex items-center text-gray-400 hover:text-white transition-colors group"
          >
            <div className="p-2 rounded-full bg-white/5 border border-white/10 group-hover:bg-white/10 mr-3">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium">{text.back}</span>
          </motion.button>

          <button
            onClick={() => navigate(switchLangPath)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-sm text-gray-200 transition-colors"
          >
            <Languages className="w-4 h-4" />
            {text.langSwitch}
          </button>
        </div>

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3 drop-shadow-lg">{text.title}</h1>
          <p className="text-sm sm:text-base text-gray-300 max-w-3xl mx-auto leading-relaxed">{text.subtitle}</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {protocolEntries.map((analysis) => (
            <button
              key={analysis.key}
              onClick={() => setSelectedAnalysis(analysis.key)}
              className={`p-4 rounded-2xl border transition-all duration-300 text-left relative overflow-hidden group flex flex-col items-start gap-2 min-h-[154px] ${
                selectedAnalysis === analysis.key
                  ? "bg-blue-600/20 border-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.3)]"
                  : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
              }`}
            >
              <div className="flex items-start justify-between w-full gap-2">
                <div className={`p-2.5 rounded-xl ${selectedAnalysis === analysis.key ? "bg-blue-500/20 text-blue-300" : "bg-white/10 text-gray-400"}`}>
                  {getIconForProtocol(analysis.key)}
                </div>
                {analysis.group === "new" && (
                  <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-200 border border-emerald-400/20">
                    {text.newBadge}
                  </span>
                )}
              </div>
              <div>
                <h3 className={`font-bold text-sm leading-tight ${selectedAnalysis === analysis.key ? "text-white" : "text-gray-300 group-hover:text-white"}`}>
                  {analysis.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1">{analysis.subtitle}</p>
              </div>
              <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed mt-auto">{analysis.overview}</p>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {selectedProtocol && (
            <motion.div
              key={selectedAnalysis}
              className="space-y-6 sm:space-y-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
            >
              <GlassCard>
                <div className="p-6 border-b border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white/5">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                      {React.cloneElement(getIconForProtocol(selectedAnalysis), { className: "h-7 w-7 text-blue-300" })}
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-white">{selectedProtocol.title}</h2>
                      <p className="text-blue-200 text-sm font-medium">{selectedProtocol.subtitle}</p>
                      <p className="text-gray-400 text-xs mt-1">{text.matrix}: {selectedProtocol.matrix}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleAnalyzeClick}
                    className="group flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-900/50 hover:shadow-blue-600/50"
                  >
                    <span>{text.start}</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                <div className="p-6 lg:p-8 space-y-6">
                  <SectionCard icon={<FileText />} title={text.targets} tone="blue">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {selectedProtocol.compounds.map((compound, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-black/20 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                          <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
                          <span className="text-gray-200 text-sm font-medium">{compound}</span>
                        </div>
                      ))}
                    </div>
                  </SectionCard>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <SectionCard icon={<Beaker />} title={text.samplePrep} tone="green">
                      <NumberedList items={selectedProtocol.samplePrep} />
                    </SectionCard>
                    <SectionCard icon={<Microscope />} title={text.chromatographic} tone="purple">
                      <BulletList items={selectedProtocol.chromatographic} tone="blue" />
                    </SectionCard>
                    <SectionCard icon={<Calculator />} title={text.calculation} tone="blue">
                      <BulletList items={selectedProtocol.calculation} tone="green" />
                    </SectionCard>
                    <SectionCard icon={<Snowflake />} title={text.storage} tone="amber">
                      <BulletList items={selectedProtocol.storage} tone="amber" />
                    </SectionCard>
                  </div>

                  {selectedProtocol.notes?.length > 0 && (
                    <div className="rounded-2xl border border-amber-400/20 bg-amber-500/10 p-5">
                      <h3 className="text-amber-100 font-bold mb-3 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-amber-300" />
                        {text.notes}
                      </h3>
                      <BulletList items={selectedProtocol.notes} tone="amber" />
                    </div>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
