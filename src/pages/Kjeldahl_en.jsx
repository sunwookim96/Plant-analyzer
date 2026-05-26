import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FlaskConical, Beaker, Microscope, Calculator, AlertTriangle,
  ArrowLeft, CheckCircle2, Languages, ShieldAlert
} from "lucide-react";

const GlassCard = ({ children, className = "" }) => (
  <div className={`rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-xl overflow-hidden ${className}`}>{children}</div>
);

const GlassBadge = ({ children, className = "" }) => (
  <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${className}`}>{children}</span>
);

export default function KjeldahlEn() {
  const navigate = useNavigate();
  const [selectedProtocol, setSelectedProtocol] = useState("step1");

  const img = (file) => {
    try { return new URL(`../images/${file}`, import.meta.url).href; }
    catch (e) { return `/images/${file}`; }
  };

  const protocols = {
    step1: {
      title: "Step 1. Digestion",
      subtitle: "Organic nitrogen → ammonium",
      tags: ["Heat block", "H₂SO₄", "270℃ → 400℃"],
      icon: <FlaskConical className="h-5 w-5" />,
      protocol: [
        "Place 0.1 g dry, finely ground sample in a Kjeldahl tube and label it clearly.",
        "Add concentrated H₂SO₄ slowly down the inner wall of the tube inside a fume hood.",
        "Insert the tube into a preheated 270℃ block for about 5 min to carbonize the sample and reduce bumping.",
        "Cool briefly, add about 2 g catalyst tablet or catalyst mixture, then increase to 400℃.",
        "Digest for 15–30 min or until the solution becomes clear green/blue, depending on the catalyst system."
      ],
      settings: ["Sample: 0.1 g dry powder", "Catalyst: about 2 g", "Initial carbonization: 270℃, 5 min", "Main digestion: 400℃ until clear"],
      notes: [
        "Concentrated sulfuric acid fumes are highly hazardous; perform the step only in a working fume hood.",
        "Do not look directly into the tube during early digestion because bumping can occur.",
        "After cooling, cover tubes with foil to prevent dust contamination."
      ],
      visual: ["Step_1-1.png", "Step_1-3.png", "Step_1-5.png"]
    },
    step2: {
      title: "Step 2. Distillation",
      subtitle: "Ammonium → ammonia gas",
      tags: ["NaOH", "Steam", "Boric acid trap"],
      icon: <Beaker className="h-5 w-5" />,
      protocol: [
        "Add about 20 mL distilled water to the cooled digest and dissolve the residue completely.",
        "Set up the distillation unit, check the boiling flask water, and turn on cooling water.",
        "Prepare 50 mL of 2% boric acid with indicator in an Erlenmeyer flask and place it under the condenser outlet.",
        "Mount the Kjeldahl tube and add 15 mL of 45% NaOH carefully.",
        "Start distillation and collect distillate until the receiving solution reaches about 100 mL."
      ],
      settings: ["NaOH: 45%", "NaOH volume: 15 mL", "Boric acid receiver: 2%, 50 mL", "Final receiver volume: about 100 mL"],
      notes: [
        "Close the stopcock immediately after NaOH enters the tube to prevent ammonia loss.",
        "The condenser tip should remain below the receiving solution surface during capture.",
        "Add warm water to the boiling flask when refilling; cold water can disturb pressure balance."
      ],
      visual: ["Step_2-1.png", "Step_2-2.png", "Step_2-4.png"]
    },
    step3: {
      title: "Step 3. Titration",
      subtitle: "Quantification of total nitrogen",
      tags: ["0.05 N H₂SO₄", "Endpoint", "Total N"],
      icon: <Microscope className="h-5 w-5" />,
      protocol: [
        "Turn on the burette or automatic titrator and remove air bubbles from the line.",
        "Fill the device with standardized 0.05 N H₂SO₄.",
        "Add a magnetic bar to the receiver flask and stir at a moderate speed.",
        "Titrate slowly until the indicator changes from blue/green to pale pink-orange endpoint.",
        "Record the acid volume and calculate total nitrogen."
      ],
      settings: ["Titrant: 0.05 N H₂SO₄", "Stirring: moderate, no splashing", "For 0.1 g sample: total N (%) ≈ H₂SO₄ volume(mL) × 0.7"],
      notes: [
        "Air bubbles in the burette line cause systematic volume errors.",
        "Use a reference endpoint flask when possible.",
        "Record blank titration volume and subtract it when your lab protocol requires blank correction."
      ],
      visual: ["Step_3-1.png", "Step_3-4.png", "Step_3-6.png"]
    }
  };

  const selected = protocols[selectedProtocol];

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-900 text-gray-100 font-sans">
      <div className="absolute inset-0 z-0 w-full h-full">
        <img src={img("kjeldahl_background.jpg")} alt="Kjeldahl background" className="w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/55 via-slate-950/35 to-slate-950/90" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-32 pb-12 space-y-8">
        <div className="flex items-center justify-between gap-3">
          <motion.button initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} onClick={() => navigate("/home_en")} className="flex items-center text-gray-400 hover:text-white transition-colors group">
            <div className="p-2 rounded-full bg-white/5 border border-white/10 group-hover:bg-white/10 mr-3"><ArrowLeft className="w-4 h-4" /></div>
            <span className="text-sm font-medium">Back</span>
          </motion.button>
          <button onClick={() => navigate("/kjeldahl")} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-sm text-gray-200 transition-colors">
            <Languages className="w-4 h-4" /> 한국어
          </button>
        </div>

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 drop-shadow-lg">Kjeldahl Nitrogen Analysis</h1>
          <p className="text-gray-300 text-sm sm:text-base">A stepwise guide from digestion and distillation to titration and total nitrogen calculation.</p>
        </motion.div>

        <GlassCard>
          <div className="p-6 border-b border-white/10 bg-white/5">
            <h2 className="text-xl font-bold text-white flex items-center gap-2"><ShieldAlert className="w-5 h-5 text-red-300" /> Essential reagents and safety</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-200">
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20"><strong>Concentrated H₂SO₄:</strong> corrosive; use fume hood, acid gloves, face shield, and acid-resistant apron.</div>
            <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20"><strong>45% NaOH:</strong> strong base; add carefully and avoid splashing during distillation setup.</div>
            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20"><strong>Boric acid + indicator:</strong> prepare fresh or verify endpoint color before titration.</div>
          </div>
        </GlassCard>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(protocols).map(([key, protocol]) => (
            <button key={key} onClick={() => setSelectedProtocol(key)} className={`p-5 rounded-2xl border text-left transition-all ${selectedProtocol === key ? "bg-blue-600/20 border-blue-500" : "bg-white/5 border-white/10 hover:bg-white/10"}`}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-blue-200">{protocol.icon}</div>
                <div><h3 className="text-white font-bold">{protocol.title}</h3><p className="text-gray-400 text-xs">{protocol.subtitle}</p></div>
              </div>
              <div className="flex flex-wrap gap-2">{protocol.tags.map(tag => <GlassBadge key={tag} className="bg-white/5 text-gray-300 border-white/10">{tag}</GlassBadge>)}</div>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={selectedProtocol} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.25 }}>
            <GlassCard>
              <div className="p-6 border-b border-white/10 flex items-center gap-4 bg-white/5">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-200">{selected.icon}</div>
                <div><h2 className="text-2xl font-bold text-white">{selected.title}</h2><p className="text-blue-200 text-sm">{selected.subtitle}</p></div>
              </div>
              <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-green-300" /> Procedure</h3>
                    <ol className="space-y-3">{selected.protocol.map((step, idx) => <li key={idx} className="flex gap-3 text-sm text-gray-300 leading-relaxed"><span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-200 flex items-center justify-center flex-shrink-0 text-xs font-bold">{idx + 1}</span>{step}</li>)}</ol>
                  </div>
                  <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Calculator className="w-5 h-5 text-blue-300" /> Settings / calculation</h3>
                    <ul className="space-y-2">{selected.settings.map(item => <li key={item} className="text-sm text-gray-300">• {item}</li>)}</ul>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="rounded-2xl bg-amber-500/10 border border-amber-500/20 p-5">
                    <h3 className="font-bold text-amber-100 mb-4 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-amber-300" /> Notes</h3>
                    <ul className="space-y-2">{selected.notes.map(item => <li key={item} className="text-sm text-amber-100/90">• {item}</li>)}</ul>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {selected.visual.map(file => <img key={file} src={img(file)} alt={file} className="rounded-xl border border-white/10 object-cover h-36 w-full bg-black/20" />)}
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
