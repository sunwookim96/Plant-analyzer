import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Leaf, Sun, Activity, Settings, AlertTriangle, ArrowLeft, CheckCircle2,
  Gauge, Wind, Database, Languages, Droplet, Zap, FileSpreadsheet
} from "lucide-react";

const GlassCard = ({ children, className = "" }) => (
  <div className={`rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-xl overflow-hidden ${className}`}>{children}</div>
);

const Badge = ({ children }) => <span className="px-2.5 py-1 rounded-full bg-white/10 border border-white/10 text-xs text-gray-200 font-semibold">{children}</span>;

export default function Li6800En() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("startup");

  const img = (file) => {
    try { return new URL(`../images/${file}`, import.meta.url).href; }
    catch (e) { return `/images/${file}`; }
  };

  const sections = {
    startup: {
      title: "Startup and warm-up",
      icon: <Settings className="w-5 h-5" />,
      tags: ["Power", "Flow", "Warm-up"],
      desc: "Prepare the console, head, chamber, and gas lines before measurements.",
      steps: [
        "Check battery/power, desiccant/scrubber status, chamber gasket condition, and leaf chamber cleanliness.",
        "Connect the sensor head and chamber, then power on the console.",
        "Turn Flow ON and allow the system to warm up until IRGA and chamber readings stabilize.",
        "Keep the chamber open during storage to prevent gasket compression; close only during measurement."
      ],
      settings: ["Flow: commonly 500–700 µmol s⁻¹", "Fan: around 10,000 rpm", "Temperature control: T_air or T_leaf depending on protocol"],
      caution: "Do not begin measurements immediately after power-on. Most unstable readings come from insufficient warm-up or uncorrected drift."
    },
    zeroing: {
      title: "Zeroing and matching",
      icon: <Gauge className="w-5 h-5" />,
      tags: ["H₂O zero", "CO₂ zero", "Match"],
      desc: "Establish the instrument baseline and remove reference/sample IRGA drift.",
      steps: [
        "Perform H₂O zero with the H₂O scrubber on and wait until the reading is stable.",
        "Perform CO₂ zero after H₂O zero, again waiting for stable values.",
        "Before clamping a leaf, run Match with an empty chamber to align reference and sample IRGAs.",
        "After the leaf stabilizes, perform a second Match to remove drift before logging."
      ],
      settings: ["H₂O zero: typically 15–20 min stabilization", "CO₂ zero: typically 5–10 min stabilization", "Match: before leaf + after stabilization"],
      caution: "Skipping Match or matching while the system is unstable can shift A, gs, Ci, and E values."
    },
    spot: {
      title: "Spot photosynthesis",
      icon: <Leaf className="w-5 h-5" />,
      tags: ["A", "gs", "Ci", "Log"],
      desc: "Standard sequence for steady-state gas-exchange measurements.",
      steps: [
        "Confirm all control indicators are green: flow, CO₂, temperature, fan, and light source.",
        "Set leaf area correctly before logging. The default chamber area is often 9 cm² and may need correction.",
        "Clamp a healthy, flat leaf while avoiding the midrib where possible.",
        "Wait for A, gs, Ci, and E to stabilize, then Match again and log after the post-Match transient settles."
      ],
      settings: ["Reference CO₂: often 400 ppm", "Flow: 500 µmol s⁻¹", "PAR: treatment-specific or saturating light"],
      caution: "Incorrect leaf area is one of the most common causes of wrong photosynthetic rate values."
    },
    light: {
      title: "Light response curve",
      icon: <Sun className="w-5 h-5" />,
      tags: ["AQ curve", "LCP", "LSP"],
      desc: "Measure photosynthesis across a PPFD sequence to estimate light response parameters.",
      steps: [
        "Use a red:blue light mix such as 90:10 unless your experiment requires a different spectrum.",
        "Induce the leaf at high or saturating light until gas-exchange variables stabilize.",
        "Run the sequence from high light to low light when speed and stomatal stability are priorities.",
        "Use automatic Match at each light step if drift or long sequences are expected."
      ],
      settings: ["Example PPFD: 1500 → 1000 → 500 → 250 → 100 → 50 → 0", "CO₂_S target: 400 ppm", "Wait: adjust to stabilization"],
      caution: "If CO₂ is not controlled correctly, leaf assimilation can deplete chamber CO₂ and distort the curve."
    },
    aci: {
      title: "A/Ci curve",
      icon: <Activity className="w-5 h-5" />,
      tags: ["Vcmax", "Jmax", "Ci"],
      desc: "Measure assimilation across CO₂ concentrations for biochemical photosynthesis parameters.",
      steps: [
        "Induce the leaf at 400 ppm CO₂ and saturating light for about 15–20 min.",
        "Use a down-then-up sequence such as 400 → 50 → 400 → 1200 ppm to reduce hysteresis effects.",
        "Keep wait times long enough for stabilization but not so long that the leaf becomes stressed.",
        "Use Match at each point or at least at major concentration transitions."
      ],
      settings: ["Light: 1200–1500 µmol m⁻² s⁻¹", "Wait: 60–120 s typical", "CO₂ sequence: experiment-specific"],
      caution: "Starting from very high CO₂ can close stomata and bias the low-CO₂ part of the curve."
    },
    export: {
      title: "Data export and QC",
      icon: <Database className="w-5 h-5" />,
      tags: ["CSV", "QC", "Metadata"],
      desc: "Check logged data and export files with enough metadata for later analysis.",
      steps: [
        "Record sample ID, treatment, replicate, leaf area, chamber type, light, CO₂, flow, and temperature settings.",
        "Flag logs taken during unstable periods, immediately after Match, or with poor chamber sealing.",
        "Export CSV/XLSX and keep a raw backup before any filtering or calculations.",
        "For publications, report chamber type, leaf area correction, environmental settings, and curve-fitting criteria."
      ],
      settings: ["Keep raw logs", "Use consistent sample naming", "Document excluded points"],
      caution: "Unlabeled files are difficult to recover later; use structured names before field or chamber sessions begin."
    }
  };

  const current = sections[selected];

  return (
    <div className="relative min-h-screen bg-slate-900 text-gray-100 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src={img("li6800_background.jpeg")} alt="LI-6800 background" className="w-full h-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/35 to-slate-950/95" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-32 pb-12 space-y-8">
        <div className="flex items-center justify-between gap-3">
          <motion.button initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} onClick={() => navigate("/physiological_en")} className="flex items-center text-gray-400 hover:text-white transition-colors group">
            <div className="p-2 rounded-full bg-white/5 border border-white/10 group-hover:bg-white/10 mr-3"><ArrowLeft className="w-4 h-4" /></div>
            <span className="text-sm font-medium">Back</span>
          </motion.button>
          <button onClick={() => navigate("/li6800")} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-sm text-gray-200 transition-colors">
            <Languages className="w-4 h-4" /> 한국어
          </button>
        </div>

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-3 drop-shadow-lg">LI-6800 Guide</h1>
          <p className="text-gray-300 max-w-3xl mx-auto">Practical workflow for startup, zeroing, matching, spot photosynthesis, response curves, troubleshooting, and data export.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(sections).map(([key, section]) => (
            <button key={key} onClick={() => setSelected(key)} className={`text-left p-5 rounded-2xl border transition-all ${selected === key ? "bg-green-600/20 border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.18)]" : "bg-white/5 border-white/10 hover:bg-white/10"}`}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-green-200">{section.icon}</div>
                <div><h3 className="font-bold text-white">{section.title}</h3><p className="text-xs text-gray-400 line-clamp-1">{section.desc}</p></div>
              </div>
              <div className="flex flex-wrap gap-2">{section.tags.map(tag => <Badge key={tag}>{tag}</Badge>)}</div>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={selected} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.25 }}>
            <GlassCard>
              <div className="p-6 border-b border-white/10 bg-white/5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-green-500/20 border border-green-500/30 flex items-center justify-center text-green-200">{current.icon}</div>
                <div><h2 className="text-2xl font-bold text-white">{current.title}</h2><p className="text-green-200 text-sm">{current.desc}</p></div>
              </div>
              <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 rounded-2xl bg-white/5 border border-white/10 p-5">
                  <h3 className="font-bold text-white mb-4 flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-green-300" /> Procedure</h3>
                  <ol className="space-y-3">{current.steps.map((step, index) => <li key={index} className="flex gap-3 text-sm text-gray-300 leading-relaxed"><span className="w-6 h-6 rounded-full bg-green-500/20 text-green-200 flex-shrink-0 flex items-center justify-center text-xs font-bold">{index + 1}</span>{step}</li>)}</ol>
                </div>
                <div className="space-y-6">
                  <div className="rounded-2xl bg-blue-500/10 border border-blue-500/20 p-5">
                    <h3 className="font-bold text-blue-100 mb-4 flex items-center gap-2"><FileSpreadsheet className="w-5 h-5 text-blue-300" /> Settings</h3>
                    <ul className="space-y-2">{current.settings.map(item => <li key={item} className="text-sm text-blue-100/90">• {item}</li>)}</ul>
                  </div>
                  <div className="rounded-2xl bg-amber-500/10 border border-amber-500/20 p-5">
                    <h3 className="font-bold text-amber-100 mb-3 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-amber-300" /> Caution</h3>
                    <p className="text-sm text-amber-100/90 leading-relaxed">{current.caution}</p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </AnimatePresence>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <GlassCard className="p-5"><Wind className="w-6 h-6 text-blue-300 mb-3" /><h3 className="font-bold text-white mb-2">Seal and flow</h3><p className="text-sm text-gray-300">Leaks and unstable flow are common causes of noisy gas-exchange data.</p></GlassCard>
          <GlassCard className="p-5"><Droplet className="w-6 h-6 text-cyan-300 mb-3" /><h3 className="font-bold text-white mb-2">Humidity</h3><p className="text-sm text-gray-300">Monitor RH and VPD; extreme humidity can bias stomatal conductance and transpiration.</p></GlassCard>
          <GlassCard className="p-5"><Zap className="w-6 h-6 text-yellow-300 mb-3" /><h3 className="font-bold text-white mb-2">Light source</h3><p className="text-sm text-gray-300">Verify PPFD and spectrum settings before response curves and treatment comparisons.</p></GlassCard>
        </div>
      </div>
    </div>
  );
}
