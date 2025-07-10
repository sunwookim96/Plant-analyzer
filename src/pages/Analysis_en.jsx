
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
      "Add 2 mL of 90% MeOH and 20 mg sample to 2 mL tube",
      "Extract by sonication at medium intensity for 20 min at 20℃",
      "Centrifuge at 15,000 RPM, 4℃, 10 min",
      "Extract 1.5 mL supernatant and store refrigerated",
      "Dispense 200 μL extract in 96-well plate and measure absorbance"
    ],
    reagents: [
      "90% MeOH: 90 mL methanol + 10 mL distilled water"
    ],
    formulas: [
      <span>Chl a (μg/mL) = 16.82 × A<sub>665.2</sub> - 9.28 × A<sub>652.4</sub></span>,
      <span>Chl b (μg/mL) = 36.92 × A<sub>652.4</sub> - 16.54 × A<sub>665.2</sub></span>,
      <span>Carotenoid (μg/mL) = (1000 × A<sub>470</sub> - 1.91 × Chl a - 95.15 × Chl b) / 225</span>
    ],
    unit: "μg/mL",
    icon: <TestTube className="h-4 w-4 sm:h-5 sm:w-5" />,
    references: [
      {
        citation: "Lichtenthaler, H.K.; Buschmann, C. Chlorophylls and carotenoids: Measurement and characterization by UV-VIS spectroscopy. Curr. Protoc. Food Anal. Chem. 2001, 1, F4.3.1–F4.3.8.",
        doi: "10.1002/0471142913.faf0403s01"
      }
    ]
  },
  total_phenol: {
    title: "Total Phenolic Content",
    subtitle: "Total Phenolic Content",
    wavelengths: ["765"],
    protocol: [
      "Use 100 μL aliquot remaining from chlorophyll analysis",
      "Add 100 μL Folin-Ciocalteu reagent + 1500 μL distilled water",
      <span>Wait 5 min, then add 300 μL of 7.5% Na<sub>2</sub>CO<sub>3</sub> solution</span>,
      "React at room temperature for 40 min",
      "Measure absorbance at 765 nm"
    ],
    reagents: [
      "7.5% Na₂CO₃: Dissolve 7.5 g Sodium Carbonate in 100 mL distilled water",
      "Folin-Ciocalteu reagent: Commercial purchase (Sigma-Aldrich etc.)",
      "Gallic acid Standard Curve: Prepare 1 mg/mL stock, then dilute to 0, 20, 40, 60, 80, 100 µg/mL and react as per sample protocol."
    ],
    formulas: [
      "Calculate content using Gallic acid standard curve",
      "Concentration = (Absorbance - b) / a"
    ],
    unit: "mg GAE/g FW",
    icon: <Beaker className="h-4 w-4 sm:h-5 sm:w-5" />,
    references: [
      {
        citation: "Severo, J.; Tiecher, A.; Chaves, F.C.; Silva, J.A.; Rombaldi, C.V. Gene transcript accumulation associated with physiological and chemical changes during developmental stages of strawberry cv. Camarosa. Food Chem. 2011, 126, 995–1000.",
        doi: "10.1016/j.foodchem.2010.11.107"
      }
    ]
  },
  total_flavonoid: {
    title: "Total Flavonoid",
    subtitle: "Total Flavonoid",
    wavelengths: ["415"],
    protocol: [
      "Use 100 μL aliquot remaining from chlorophyll analysis",
      <span>Add 300 μL 95% EtOH + 20 μL 10% AlCl<sub>3</sub></span>,
      "Add 20 μL 1 M potassium acetate + 600 μL distilled water",
      "React at room temperature for 40 min",
      "Measure absorbance at 415 nm"
    ],
    reagents: [
      "95% EtOH: 95 mL ethanol + 5 mL distilled water",
      "10% AlCl₃: Dissolve 10 g Aluminum Chloride in 100 mL distilled water",
      "1 M Potassium acetate: Dissolve 9.82 g CH₃COOK in 100 mL distilled water",
      "Quercetin Standard Curve: Prepare 1 mg/mL stock, then dilute to 0, 20, 40, 60, 80, 100 µg/mL and react as per sample protocol."
    ],
    formulas: [
      "Calculate content using Quercetin standard curve",
      "Concentration = (Absorbance - b) / a"
    ],
    unit: "mg QE/g FW",
    icon: <FlaskConical className="h-4 w-4 sm:h-5 sm:w-5" />,
    references: [
      {
        citation: "Chang, C.-C.; Yang, M.-H.; Wen, H.-M.; Chern, J.-C. Estimation of total flavonoid content in propolis by two complementary colometric methods. J. Food Drug Anal. 2002, 10, 3.",
        doi: "10.38212/2224-6614.2748"
      }
    ]
  },
  glucosinolate: {
    title: "Glucosinolate",
    subtitle: "Total Glucosinolate",
    wavelengths: ["425"],
    protocol: [
      "Use 50 μL aliquot remaining from chlorophyll analysis",
      "Add 1.5 mL of 2 mM sodium tetrachloropalladate",
      "Add 150 μL distilled water and mix",
      "React at room temperature for 1 hour",
      "Measure absorbance at 425 nm"
    ],
    reagents: [
      "2 mM Sodium tetrachloropalladate: Dissolve 36.5 mg Na₂PdCl₄ in 100 mL distilled water"
    ],
    formulas: [
      <span>Total glucosinolate (μmol/g) = 1.40 + 118.86 × A<sub>425</sub></span>
    ],
    unit: "μmol/g FW",
    icon: <Microscope className="h-4 w-4 sm:h-5 sm:w-5" />,
    references: [
      {
        citation: `Mawlong, I., M. Sujith Kumar, B. Gurung, K. Singh, and D. Singh. 2017. "A Simple Spectrophotometric Method for Estimating Total Glucosinolates in Mustard de-Oiled Cake." International Journal of Food Properties 20 (12): 3274–81`,
        doi: "10.1080/10942912.2017.1286353"
      }
    ]
  },
  dpph_scavenging: {
    title: "DPPH Radical Scavenging",
    subtitle: "DPPH Radical Scavenging",
    wavelengths: ["517"],
    protocol: [
      "Prepare DPPH solution and store refrigerated",
      "Add to 96-well plate: 170 μL 90% MeOH + 10 μL DPPH solution + 20 μL Sample",
      "Seal with Parafilm and react in dark for 1 hour",
      "Measure absorbance at 517 nm"
    ],
    reagents: [
      "90% MeOH: 90 mL methanol + 10 mL distilled water",
      "DPPH solution: Dissolve 200 mg DPPH in 50 mL 90% MeOH, wrap with foil and store refrigerated"
    ],
    formulas: [
      "DPPH Inhibition (%) = ((Control - Sample) / Control) × 100%"
    ],
    unit: "% inhibition",
    icon: <Calculator className="h-4 w-4 sm:h-5 sm:w-5" />,
    references: [
      {
        citation: "Blois, M.S. Antioxidant determinations by the use of a stable free radical. Nature 1958, 181, 1199–1200.",
        doi: "10.1038/1811199a0"
      }
    ]
  },
  anthocyanin: {
    title: "Anthocyanin",
    subtitle: "Total Anthocyanin",
    wavelengths: ["530", "600"],
    protocol: [
      <span>Add 2 mL 1% HCl-MeOH solution and 20 mg sample to 2 mL tube</span>,
      "Extract by sonication at medium intensity for 1 hour at 40℃",
      "Centrifuge at 15,000 RPM, 4℃, 10 min",
      "Extract 1.5 mL supernatant and store refrigerated",
      "Measure absorbance at 530 nm and 600 nm"
    ],
    reagents: [
      "1% HCl-MeOH: 90 mL methanol + 10 mL 1 M HCl",
      "1 M HCl: Add 8.3 mL concentrated HCl (37%) to 100 mL distilled water"
    ],
    formulas: [
      <span>Anthocyanin (mg/g) = (A<sub>530</sub> - A<sub>600</sub>) × V × n × Mw / (ε × m)</span>,
      "V = extraction volume(mL), n = dilution factor, Mw = 449.2, ε = 26900, m = sample weight(g)"
    ],
    unit: "mg/g FW",
    icon: <TestTube className="h-4 w-4 sm:h-5 sm:w-5" />,
    references: [
      {
        citation: `Yang, Y.-C., D.-W. Sun, H. Pu, N.-N. Wang, and Z. Zhu. 2015. "Rapid Detection of Anthocyanin Content in Lychee Pericarp During Storage Using Hyperspectral Imaging Coupled with Model Fusion." Postharvest Biology and Technology 103: 55–65.`,
        doi: "10.1016/j.postharvbio.2015.02.008"
      }
    ]
  },
  cat: {
    title: "Catalase Activity",
    subtitle: "Catalase (CAT) Activity",
    wavelengths: ["240"],
    protocol: [
      "Extract enzyme with 20 mg sample + 2 mL pH 7.0 50 mM PBS",
      "Liquid nitrogen 5 min + sonication 10 min (3 times repeat)",
      "Centrifuge at 15,000 RPM, 4℃, 10 min",
      "Extract supernatant (1.5 mL) and store in deep freezer",
      <span>Prepare reaction mixture and add 3 μL enzyme</span>,
      "Measure absorbance at 240 nm every 10 seconds for 10 min"
    ],
    reagents: [
      "50 mM PBS (pH 7.0): Dissolve 0.68 g KH₂PO₄ + 0.87 g K₂HPO₄ in 100 mL distilled water",
      "3% H₂O₂: 1 mL 30% H₂O₂ + 9 mL distilled water",
      "Reaction mixture: 3.4 μL 3% H₂O₂ + 193.6 μL 50 mM PBS"
    ],
    formulas: [
      <span>CAT activity (μmol/min/mL) = (ΔA<sub>240</sub>/min) × total volume × 1000 / (39.4 × enzyme volume)</span>,
      "CAT activity (μmol/min/mg DW) = unit/mL / enzyme (mg/mL)"
    ],
    unit: "μmol/min/mg DW",
    icon: <FlaskConical className="h-4 w-4 sm:h-5 sm:w-5" />,
    references: [
      {
        citation: "Aebi H. Catalase in vitro. Meth Enzymol. 1984;105:121–6.",
        doi: "10.1016/S0076-6879(84)05016-3"
      }
    ]
  },
  pod: {
    title: "Peroxidase Activity",
    subtitle: "Peroxidase (POD) Activity",
    wavelengths: ["470"],
    protocol: [
      "Extract enzyme with 20 mg sample + 2 mL pH 7.0 50 mM PBS",
      "Liquid nitrogen 5 min + sonication 10 min (3 times repeat)",
      "Centrifuge at 15,000 RPM, 4℃, 10 min",
      "Extract supernatant (1.5 mL) and store in deep freezer",
      <span>Prepare reaction mixture and add 20 μL sample</span>,
      "Measure absorbance at 470 nm every 10 seconds"
    ],
    reagents: [
      "50 mM PBS (pH 7.0): Dissolve 0.68 g KH₂PO₄ + 0.87 g K₂HPO₄ in 100 mL distilled water",
      "40 mM Phosphate buffer: Dissolve 0.54 g KH₂PO₄ + 0.70 g K₂HPO₄ in 100 mL distilled water",
      "20 mM Guaiacol: Dissolve 248 mg guaiacol in 100 mL distilled water",
      "3% H₂O₂: 1 mL 30% H₂O₂ + 9 mL distilled water",
      "Reaction mixture: 66.6 μL 40 mM phosphate buffer + 80 μL 20 mM guaiacol + 33.3 μL 3% H₂O₂"
    ],
    formulas: [
      <span>POD activity (μmol/min/mL) = (ΔA<sub>470</sub>/min) × total volume × 1000 / (26.6 × enzyme volume)</span>,
      "POD activity (μmol/min/mg DW) = unit/mL / enzyme (mg/mL)"
    ],
    unit: "μmol/min/mg DW",
    icon: <Beaker className="h-4 w-4 sm:h-5 sm:w-5" />,
    references: [
      {
        citation: "Rao, M.V.; Paliyath, G.; Ormrod, D.P. Ultraviolet-B-and ozone-induced biochemical changes in antioxidant enzymes of Arabidopsis thaliana. Plant Physiol. 1996, 110, 125–136.",
        doi: "10.1104/pp.110.1.125"
      }
    ]
  },
  sod: {
    title: "Superoxide Dismutase Activity",
    subtitle: "Superoxide Dismutase (SOD) Activity",
    wavelengths: ["560"],
    protocol: [
      "Extract enzyme with 20 mg sample + 2 mL pH 7.0 50 mM PBS",
      "Liquid nitrogen 5 min + sonication 10 min (3 times repeat)",
      "Centrifuge at 15,000 RPM, 4℃, 10 min",
      "Extract supernatant (1.5 mL) and store in deep freezer",
      "Add reaction mixture in order and add riboflavin last",
      <span>Expose to LED light at PPFD 50 μmol m<sup>-2</sup>s<sup>-1</sup> for 15 min, then block light</span>,
      "Measure absorbance at 560 nm"
    ],
    reagents: [
      "50 mM PBS (pH 7.0): Dissolve 0.68 g KH₂PO₄ + 0.87 g K₂HPO₄ in 100 mL distilled water",
      "0.1 M Methionine: Dissolve 1.49 g methionine in 100 mL distilled water",
      "2.5 mM NBT: Dissolve 205 mg nitro blue tetrazolium in 100 mL distilled water",
      "10 mM EDTA: Dissolve 372 mg EDTA in 100 mL distilled water",
      "0.5 mM Riboflavin: Dissolve 18.8 mg riboflavin in 100 mL distilled water"
    ],
    formulas: [
      "SOD inhibition (%) = ((Control - Sample) / Control) × 100%",
      "SOD activity (unit/mL) = (inhibition × total volume) / (50 × enzyme volume)",
      "SOD activity (unit/mg DW) = unit/mL / enzyme (mg/mL)"
    ],
    unit: "unit/mg DW",
    icon: <Microscope className="h-4 w-4 sm:h-5 sm:w-5" />,
    references: [
      {
        citation: "Gupta, A.S.; Webb, R.P.; Holaday, A.S.; Allen, R.D. Overexpression of superoxide dismutase protects plants from oxidative stress (induction of ascorbate peroxidase in superoxide dismutase-overexpressing plants). Plant Physiol. 1993, 103, 1067–1073.",
        doi: "10.1104/pp.103.4.1067"
      }
    ]
  },
  h2o2: {
    title: "Hydrogen Peroxide Content",
    subtitle: "Hydrogen Peroxide (H₂O₂) Content",
    wavelengths: ["390"],
    protocol: [
      "Mix 20 mg sample + 2 mL 0.1% TCA and vortex",
      "Liquid nitrogen 5 min + sonication 10 min (3 times repeat)",
      "Centrifuge at 15,000 RPM, 4℃, 10 min",
      "Extract 1.5 mL supernatant",
      "Prepare reaction mixture and react for 10 min",
      "React in dark for 10 min, then measure at 390 nm"
    ],
    reagents: [
      "0.1% TCA: Dissolve 100 mg trichloroacetic acid in 100 mL distilled water",
      "10 mM Potassium phosphate buffer (pH 7.0): Dissolve 136 mg KH₂PO₄ + 174 mg K₂HPO₄ in 100 mL distilled water",
      "1 M KI: Dissolve 16.6 g potassium iodide in 100 mL distilled water",
      "1 mM H₂O₂ Stock: Dilute 9.8 µL of 35% H₂O₂ stock solution in 100 mL of distilled water.",
      "H₂O₂ Standard Curve: Using 1 mM stock, dilute to 0, 50, 100, 200, 400 µM and react as per sample protocol."
    ],
    formulas: [
      <span>Calculate content using H<sub>2</sub>O<sub>2</sub> standard curve</span>,
      "Concentration = (Absorbance - b) / a"
    ],
    unit: "μmol/g DW",
    icon: <Calculator className="h-4 w-4 sm:h-5 sm:w-5" />,
    references: [
      {
        citation: "Alexieva, V., Sergiev, I., Mapelli, S., & Karanov, E. (2001). The effect of drought and ultraviolet radiation on growth and stress markers in pea and wheat. Plant, Cell & Environment, 24(12), 1337-1344.",
        doi: "10.1046/j.1365-3040.2001.00778.x"
      },
      {
        citation: "Velikova, V., Yordanov, I., & Edreva, A. J. P. S. (2000). Oxidative stress and some antioxidant systems in acid rain-treated bean plants: protective role of exogenous polyamines. Plant science, 151(1), 59-66.",
        doi: "10.1016/S0168-9452(99)00197-1"
      },
      {
        citation: "Junglee, S., Urban, L., Sallanon, H., & Lopez-Lauri, F. (2014). Optimized assay for hydrogen peroxide determination in plant tissue using potassium iodide. American Journal of Analytical Chemistry, 5(11), 730-736.",
        doi: "10.4236/ajac.2014.511081"
      }
    ]
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
                    {/* Left: Experimental Protocol + Calculation Formula */}
                    <div className="space-y-4 sm:space-y-6">
                      <div className="bg-white/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-0">
                        <h3 className="text-gray-900 font-semibold mb-4 flex items-center space-x-2 text-sm sm:text-base">
                          <TestTube className="h-4 w-4" />
                          <span>Experimental Protocol</span>
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

                      <div className="bg-white/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-0">
                        <h3 className="text-gray-900 font-semibold mb-4 flex items-center space-x-2 text-sm sm:text-base">
                          <Calculator className="h-4 w-4" />
                          <span>Calculation Formula</span>
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
                    </div>

                    {/* Right: Reagent Preparation + Measurement Wavelengths */}
                    <div className="space-y-4 sm:space-y-6">
                      {/* Reagent Preparation Section */}
                      {analysisProtocols[selectedAnalysis].reagents && (
                        <div className="bg-white/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-0">
                          <h3 className="text-gray-900 font-semibold mb-4 flex items-center space-x-2 text-sm sm:text-base">
                            <Beaker className="h-4 w-4" />
                            <span>Reagent Preparation</span>
                          </h3>
                          <div className="space-y-3">
                            {analysisProtocols[selectedAnalysis].reagents.map((reagent, index) => (
                              <div key={index} className="p-3 sm:p-4 bg-blue-50 rounded-lg sm:rounded-xl border border-blue-200">
                                <div className="text-gray-800 text-xs sm:text-sm leading-relaxed">
                                  <strong>{reagent.split(':')[0]}:</strong> {reagent.split(':').slice(1).join(':')}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="bg-white/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-0">
                        <h3 className="text-gray-900 font-semibold mb-4 flex items-center space-x-2 text-sm sm:text-base">
                          <Microscope className="h-4 w-4" />
                          <span>Measurement Wavelengths</span>
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
                  
                  {/* References Section - Bottom Full Width */}
                  <div className="mt-6 sm:mt-8 bg-white/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-0">
                    <h3 className="text-gray-900 font-semibold mb-4 flex items-center space-x-2 text-sm sm:text-base">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <span>References</span>
                    </h3>
                    <div className="space-y-4">
                      {analysisProtocols[selectedAnalysis].references?.map((ref, index) => (
                        <div key={index} className="p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-200">
                          <p className="text-gray-800 text-xs sm:text-sm leading-relaxed mb-2">
                            {ref.citation}
                          </p>
                          {ref.doi && (
                            <a 
                              href={`https://doi.org/${ref.doi}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-xs font-medium transition-colors"
                            >
                              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                              <span>DOI: {ref.doi}</span>
                            </a>
                          )}
                        </div>
                      ))}
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
