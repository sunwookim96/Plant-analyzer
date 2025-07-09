
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TestTube, Beaker, FlaskConical, Microscope, Calculator, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createPageUrl } from "@/utils";
import { motion, AnimatePresence } from "framer-motion";

const analysisProtocols = {
  chlorophyll_a_b: {
    title: "Chlorophyll & Carotenoid",
    subtitle: "Total Chlorophyll & Total Carotenoid",
    wavelengths: ["652.4", "665.2", "470"],
    protocol: [
      <span>Add 20 mg sample and 2 mL of 90% MeOH to a 2 mL tube</span>,
      <span>Extract by sonication for 20 minutes at 20℃ (medium intensity)</span>,
      <span>Centrifuge at 15,000 RPM, 4℃ for 10 min</span>,
      <span>Extract 1.5 mL of the supernatant and store refrigerated</span>,
      <span>Dispense 200 μL of the extract into a 96-well plate and measure absorbance</span>
    ],
    formulas: [
      <span>Chl a (μg/mL) = 16.82 × A<sub>665.2</sub> - 9.28 × A<sub>652.4</sub></span>,
      <span>Chl b (μg/mL) = 36.92 × A<sub>652.4</sub> - 16.54 × A<sub>665.2</sub></span>,
      <span>Carotenoid (μg/mL) = (1000 × A<sub>470</sub> - 1.91 × Chl a - 95.15 × Chl b) / 225</span>
    ],
    unit: "μg/mL",
    icon: <TestTube className="h-4 w-4 sm:h-5 sm:w-5" />
  },
  total_phenol: {
    title: "Total Phenolic Content",
    subtitle: "Total Phenolic Content",
    wavelengths: ["765"],
    protocol: [
      <span>Use 100 μL of aliquot remaining from chlorophyll analysis</span>,
      <span>Add 100 μL of Folin-Ciocalteu reagent + 1500 μL of distilled water</span>,
      <span>Let it stand for 5 minutes, then add 300 μL of 7.5% Na<sub>2</sub>CO<sub>3</sub> solution</span>,
      <span>React for 40 minutes at room temperature</span>,
      <span>Measure absorbance at 765 nm</span>
    ],
    formulas: [
      <span>Calculate content using a Gallic acid standard curve</span>,
      <span>Concentration = (Absorbance - b) / a</span>
    ],
    unit: "mg GAE/g FW",
    icon: <Beaker className="h-4 w-4 sm:h-5 sm:w-5" />
  },
  total_flavonoid: {
    title: "Total Flavonoid",
    subtitle: "Total Flavonoid",
    wavelengths: ["415"],
    protocol: [
      <span>Use 100 μL of aliquot remaining from chlorophyll analysis</span>,
      <span>Add 300 μL of 95% EtOH + 20 μL of 10% AlCl<sub>3</sub></span>,
      <span>Add 20 μL of 1 M potassium acetate + 600 μL of distilled water</span>,
      <span>React for 40 minutes at room temperature</span>,
      <span>Measure absorbance at 415 nm</span>
    ],
    formulas: [
      <span>Calculate content using a Quercetin standard curve</span>,
      <span>Concentration = (Absorbance - b) / a</span>
    ],
    unit: "mg QE/g FW",
    icon: <FlaskConical className="h-4 w-4 sm:h-5 sm:w-5" />
  },
  glucosinolate: {
    title: "Total Glucosinolate",
    subtitle: "Total Glucosinolate",
    wavelengths: ["425"],
    protocol: [
      <span>Use 50 μL of aliquot remaining from chlorophyll analysis</span>,
      <span>Add 1.5 mL of 2 mM sodium tetrachloropalladate</span>,
      <span>Add 150 μL of distilled water and mix</span>,
      <span>React for 1 hour at room temperature</span>,
      <span>Measure absorbance at 425 nm</span>
    ],
    formulas: [
      <span>Total glucosinolate (μmol/g) = 1.40 + 118.86 × A<sub>425</sub></span>
    ],
    unit: "μmol/g FW",
    icon: <Microscope className="h-4 w-4 sm:h-5 sm:w-5" />
  },
  dpph_scavenging: {
    title: "DPPH Radical Scavenging",
    subtitle: "DPPH Radical Scavenging",
    wavelengths: ["517"],
    protocol: [
      <span>DPPH solution: 200 mg DPPH + 50 mL 90% MeOH (wrap in foil and refrigerate)</span>,
      <span>In a 96-well plate, add 170 μL 90% MeOH + 10 μL DPPH solution + 20 μL Sample</span>,
      <span>Seal with Parafilm and react for 1 hour in the dark</span>,
      <span>Measure absorbance at 517 nm</span>
    ],
    formulas: [
      <span>DPPH Inhibition (%) = ((Control - Sample) / Control) × 100%</span>
    ],
    unit: "% inhibition",
    icon: <Calculator className="h-4 w-4 sm:h-5 sm:w-5" />
  },
  anthocyanin: {
    title: "Total Anthocyanin",
    subtitle: "Total Anthocyanin",
    wavelengths: ["530", "600"],
    protocol: [
      <span>Add 20 mg sample and 2 mL of 1% HCl (90% MeOH + 10% HCl) to a 2 mL tube</span>,
      <span>Extract by sonication for 1 hour at 40℃ (medium intensity)</span>,
      <span>Centrifuge at 15,000 RPM, 4℃ for 10 min</span>,
      <span>Extract 1.5 mL of the supernatant and store refrigerated</span>,
      <span>Measure absorbance at 530 nm and 600 nm</span>
    ],
    formulas: [
      <span>Anthocyanin (mg/g) = (A<sub>530</sub> - A<sub>600</sub>) × V × n × Mw / (ε × m)</span>,
      <span>V = extraction vol(mL), n = dilution factor, Mw = 449.2, ε = 26900, m = sample weight(g)</span>
    ],
    unit: "mg/g FW",
    icon: <TestTube className="h-4 w-4 sm:h-5 sm:w-5" />
  },
  cat: {
    title: "Catalase (CAT) Activity",
    subtitle: "Catalase (CAT) Activity",
    wavelengths: ["240"],
    protocol: [
      <span>Extract enzyme with 20 mg sample + 2 mL of 50 mM PBS (pH 7.0)</span>,
      <span>Repeat 3 cycles of: 5 min in liquid nitrogen + 10 min sonication</span>,
      <span>Centrifuge at 15,000 RPM, 4℃ for 10 min</span>,
      <span>Collect 1.5 mL supernatant and store in a deep freezer</span>,
      <span>Add 3.4 μL of 3% H<sub>2</sub>O<sub>2</sub> + 193.6 μL of 50 mM phosphate buffer + 3 μL enzyme</span>,
      <span>Measure absorbance at 240 nm every 10 seconds for 10 min</span>
    ],
    formulas: [
      <span>CAT activity (μmol/min/mL) = (ΔA<sub>240</sub>/min) × total volume × 1000 / (39.4 × enzyme volume)</span>,
      <span>CAT activity (μmol/min/mg DW) = unit/mL / enzyme (mg/mL)</span>
    ],
    unit: "μmol/min/mg DW",
    icon: <FlaskConical className="h-4 w-4 sm:h-5 sm:w-5" />
  },
  pod: {
    title: "Peroxidase (POD) Activity",
    subtitle: "Peroxidase (POD) Activity",
    wavelengths: ["470"],
    protocol: [
      <span>Extract enzyme with 20 mg sample + 2 mL of 50 mM PBS (pH 7.0)</span>,
      <span>Repeat 3 cycles of: 5 min in liquid nitrogen + 10 min sonication</span>,
      <span>Centrifuge at 15,000 RPM, 4℃ for 10 min</span>,
      <span>Collect 1.5 mL supernatant and store in a deep freezer</span>,
      <span>Add 66.6 μL 40 mM phosphate buffer + 80 μL 20 mM guaiacol + 33.3 μL 3% H<sub>2</sub>O<sub>2</sub> + 20 μL sample</span>,
      <span>Measure absorbance at 470 nm every 10 seconds</span>
    ],
    formulas: [
      <span>POD activity (μmol/min/mL) = (ΔA<sub>470</sub>/min) × total volume × 1000 / (26.6 × enzyme volume)</span>,
      <span>POD activity (μmol/min/mg DW) = unit/mL / enzyme (mg/mL)</span>
    ],
    unit: "μmol/min/mg DW",
    icon: <Beaker className="h-4 w-4 sm:h-5 sm:w-5" />
  },
  sod: {
    title: "Superoxide Dismutase (SOD) Activity",
    subtitle: "Superoxide Dismutase (SOD) Activity",
    wavelengths: ["560"],
    protocol: [
      <span>Extract enzyme with 20 mg sample + 2 mL of 50 mM PBS (pH 7.0)</span>,
      <span>Repeat 3 cycles of: 5 min in liquid nitrogen + 10 min sonication</span>,
      <span>Centrifuge at 15,000 RPM, 4℃ for 10 min</span>,
      <span>Collect 1.5 mL supernatant and store in a deep freezer</span>,
      <span>In order, add 93.5 μL 50 mM phosphate buffer, 52 μL 0.1 M methionine, 24.5 μL 2.5 mM NBT, 2 μL 10 mM EDTA, 8 μL 0.5 mM riboflavin</span>,
      <span>Expose to LED light at PPFD 50 μmol m<sup>-2</sup>s<sup>-1</sup> for 15 min, then block light</span>,
      <span>Measure absorbance at 560 nm</span>
    ],
    formulas: [
      <span>SOD inhibition (%) = ((Control - Sample) / Control) × 100%</span>,
      <span>SOD activity (unit/mL) = (inhibition × total volume) / (50 × enzyme volume)</span>,
      <span>SOD activity (unit/mg DW) = unit/mL / enzyme (mg/mL)</span>
    ],
    unit: "unit/mg DW",
    icon: <Microscope className="h-4 w-4 sm:h-5 sm:w-5" />
  },
  h2o2: {
    title: "Hydrogen Peroxide (H₂O₂) Content",
    subtitle: "Hydrogen Peroxide (H₂O₂) Content",
    wavelengths: ["390"],
    protocol: [
      <span>Mix 20 mg sample + 2 mL of 0.1% TCA and vortex</span>,
      <span>Repeat 3 cycles of: 5 min in liquid nitrogen + 10 min sonication</span>,
      <span>Centrifuge at 15,000 RPM, 4℃ for 10 min</span>,
      <span>Extract 1.5 mL of supernatant</span>,
      <span>React using 10 mM potassium phosphate buffer + 1 M KI</span>,
      <span>React in the dark for 10 min, then measure at 390 nm</span>
    ],
    formulas: [
      <span>Calculate content using H<sub>2</sub>O<sub>2</sub> standard curve</span>,
      <span>Concentration = (Absorbance - b) / a</span>
    ],
    unit: "μmol/g DW",
    icon: <Calculator className="h-4 w-4 sm:h-5 sm:w-5" />
  }
};

export default function AnalysisEn() {
  const [selectedAnalysis, setSelectedAnalysis] = useState("");
  const navigate = useNavigate();

  const handleAnalyzeClick = () => {
    if (selectedAnalysis) {
      navigate(createPageUrl("Results_en") + `?analysis_type=${selectedAnalysis}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8 space-y-6 sm:space-y-8">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Select Analysis Protocol</h1>
          <p className="text-sm sm:text-base text-gray-600">Please select the biochemical analysis to perform.</p>
        </div>

        <div className="bg-white/70 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-xl border-0 p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {Object.entries(analysisProtocols).map(([key, protocol]) => (
              <button
                key={key}
                onClick={() => setSelectedAnalysis(key)}
                className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border transition-all duration-300 text-left ${
                  selectedAnalysis === key
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xl'
                    : 'bg-white/80 text-gray-700 border-gray-200 hover:bg-blue-50 hover:border-blue-300'
                }`}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center">
                    {selectedAnalysis === key ? React.cloneElement(protocol.icon, { className: protocol.icon.props.className + " text-white" }) : protocol.icon}
                  </div>
                  <span className="font-bold text-sm sm:text-base leading-tight">{protocol.title}</span>
                </div>
                <p className="text-xs sm:text-sm opacity-80 leading-relaxed">{protocol.subtitle}</p>
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {selectedAnalysis && (
            <motion.div
              className="space-y-6 sm:space-y-8"
              initial={{ opacity: 0, y: 20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <Card className="bg-white/80 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-xl border-0 overflow-hidden">
                <CardHeader className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                        {React.cloneElement(analysisProtocols[selectedAnalysis].icon, { className: analysisProtocols[selectedAnalysis].icon.props.className + " text-blue-600" })}
                      </div>
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-gray-900 text-lg sm:text-xl font-bold leading-tight">
                          {analysisProtocols[selectedAnalysis].title}
                        </CardTitle>
                        <p className="text-gray-600 text-sm sm:text-base mt-1 leading-relaxed">
                          {analysisProtocols[selectedAnalysis].subtitle}
                        </p>
                      </div>
                    </div>
                    <Button onClick={handleAnalyzeClick} className="bg-blue-600 hover:bg-blue-700 h-10 sm:h-12 text-sm sm:text-base rounded-xl w-full sm:w-auto">
                      Analyze <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                    <div className="bg-white/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-0">
                      <h3 className="text-gray-900 font-semibold mb-4 flex items-center space-x-2 text-sm sm:text-base">
                        <TestTube className="h-4 w-4" />
                        <span>Protocol</span>
                      </h3>
                      <ol className="space-y-3">
                        {analysisProtocols[selectedAnalysis].protocol.map((step, index) => (
                          <li key={index} className="flex items-start space-x-3">
                            <span className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold">
                              {index + 1}
                            </span>
                            <span className="text-gray-700  text-xs sm:text-sm leading-relaxed">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    <div className="space-y-4 sm:space-y-6">
                      <div className="bg-white/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-0">
                        <h3 className="text-gray-900 font-semibold mb-4 flex items-center space-x-2 text-sm sm:text-base">
                          <Calculator className="h-4 w-4" />
                          <span>Formulas</span>
                        </h3>
                        <div className="space-y-3 sm:space-y-4">
                          {analysisProtocols[selectedAnalysis].formulas.map((formula, index) => (
                            <div key={index} className="p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-200">
                              <div className="text-gray-800 text-xs sm:text-sm font-mono leading-relaxed break-all">
                                {formula}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="bg-white/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-0">
                        <h3 className="text-gray-900 font-semibold mb-4 flex items-center space-x-2 text-sm sm:text-base">
                          <Microscope className="h-4 w-4" />
                          <span>Wavelengths</span>
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {analysisProtocols[selectedAnalysis].wavelengths.map((wavelength) => (
                            <Badge key={wavelength} variant="default" className="bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm">
                              {wavelength} nm
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
