
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
    title: "엽록소 및 카로티노이드",
    subtitle: "Total Chlorophyll & Total Carotenoid",
    wavelengths: ["652.4", "665.2", "470"],
    protocol: [
      "2mL 튜브에 2mL의 90% MeOH과 시료 20mg 넣기",
      "20℃에서 중간 강도로 sonication 20분간 추출",
      "15,000RPM, 4℃, 10min 조건으로 centrifuge",
      "상층액 1.5mL 추출 후 냉장보관",
      "96 well에 추출물 200μL 분주하여 흡광도 측정"
    ],
    formulas: [
      "Chl a (μg/ml) = 16.82 × A665.2 - 9.28 × A652.4",
      "Chl b (μg/ml) = 36.92 × A652.4 - 16.54 × A665.2",
      "Carotenoid (μg/ml) = (1000 × A470 - 1.91 × Chl a - 95.15 × Chl b) / 225"
    ],
    unit: "μg/ml",
    icon: <TestTube className="h-4 w-4 sm:h-5 sm:w-5" />
  },
  total_phenol: {
    title: "총 페놀 함량",
    subtitle: "Total Phenolic Content",
    wavelengths: ["765"],
    protocol: [
      "엽록소 분석 후 남은 aliquot 100μL 사용",
      "Folin-Ciocalteu reagent 100μL + 증류수 1500μL 넣기",
      "5분간 방치 후 7.5% Na2CO3 용액 300μL 넣기",
      "40분간 상온에서 반응",
      "765nm에서 흡광도 측정"
    ],
    formulas: [
      "Gallic acid standard curve 사용하여 함량 계산",
      "농도 = (흡광도 - b) / a"
    ],
    unit: "mg GAE/g FW",
    icon: <Beaker className="h-4 w-4 sm:h-5 sm:w-5" />
  },
  total_flavonoid: {
    title: "총 플라보노이드",
    subtitle: "Total Flavonoid",
    wavelengths: ["415"],
    protocol: [
      "엽록소 분석 후 남은 aliquot 100μL 사용",
      "95% EtOH 300μL + 10% AlCl3 20μL 넣기",
      "1M potassium acetate 20μL + 증류수 600μL 넣기",
      "상온에서 40분간 반응",
      "415nm에서 흡광도 측정"
    ],
    formulas: [
      "Quercetin standard curve 사용하여 함량 계산",
      "농도 = (흡광도 - b) / a"
    ],
    unit: "mg QE/g FW",
    icon: <FlaskConical className="h-4 w-4 sm:h-5 sm:w-5" />
  },
  glucosinolate: {
    title: "글루코시놀레이트",
    subtitle: "Total Glucosinolate",
    wavelengths: ["425"],
    protocol: [
      "엽록소 분석 후 남은 aliquot 50μL 사용",
      "2mM sodium tetrachloropalladate 1.5mL 넣기",
      "증류수 150μL 넣기 후 혼합",
      "1시간 동안 상온에서 반응",
      "425nm에서 흡광도 측정"
    ],
    formulas: [
      "Total glucosinolate (μmol/g) = 1.40 + 118.86 × A425"
    ],
    unit: "μmol/g FW",
    icon: <Microscope className="h-4 w-4 sm:h-5 sm:w-5" />
  },
  dpph_scavenging: {
    title: "DPPH 라디칼 소거능",
    subtitle: "DPPH Radical Scavenging",
    wavelengths: ["517"],
    protocol: [
      "DPPH 용액: DPPH 200mg + 90% MeOH 50mL (호일로 포장 후 냉장보관)",
      "96-well plate에 90% MeOH 170μL + DPPH 용액 10μL + Sample 20μL 넣기",
      "Parafilm으로 밀봉 후 암조건에서 1시간 반응",
      "517nm에서 흡광도 측정"
    ],
    formulas: [
      "DPPH Inhibition (%) = ((Control - Sample) / Control) × 100%"
    ],
    unit: "% inhibition",
    icon: <Calculator className="h-4 w-4 sm:h-5 sm:w-5" />
  },
  anthocyanin: {
    title: "안토시아닌",
    subtitle: "Total Anthocyanin",
    wavelengths: ["530", "600"],
    protocol: [
      "2mL 튜브에 1% HCl (90% MeOH + 10% HCl) 2mL + 시료 20mg 넣기",
      "40℃에서 중간 강도로 sonication 1시간 추출",
      "15,000RPM, 4℃, 10min 조건으로 centrifuge",
      "상층액 1.5mL 추출 후 냉장보관",
      "530nm, 600nm에서 흡광도 측정"
    ],
    formulas: [
      "Anthocyanin (mg/g) = (A530 - A600) × V × n × Mw / (ε × m)",
      "V = 추출부피(mL), n = 희석배수, Mw = 449.2, ε = 26900, m = 시료무게(g)"
    ],
    unit: "mg/g FW",
    icon: <TestTube className="h-4 w-4 sm:h-5 sm:w-5" />
  },
  cat: {
    title: "카탈라아제 활성",
    subtitle: "Catalase (CAT) Activity",
    wavelengths: ["240"],
    protocol: [
      "시료 20mg + pH 7.0 50mM PBS 2mL로 효소 추출",
      "액체질소 5분 + sonication 10분 (3회 반복)",
      "15,000RPM, 4℃, 10min centrifuge",
      "Centrifuge 후 상층액 (1.5mL) 뽑고 박스에 넣어 deep freezer에 보관",
      "3% H₂O₂ 3.4μL + 50mM phosphate buffer 193.6μL + enzyme 3μL 넣기",
      "240nm에서 10초마다 10분간 흡광도 측정"
    ],
    formulas: [
      "CAT activity (μmol/min/mL) = (ΔA240/min) × total volume × 1000 / (39.4 × enzyme volume)",
      "CAT activity (μmol/min/mg DW) = unit/mL / enzyme (mg/mL)"
    ],
    unit: "μmol/min/mg DW",
    icon: <FlaskConical className="h-4 w-4 sm:h-5 sm:w-5" />
  },
  pod: {
    title: "퍼옥시다아제 활성",
    subtitle: "Peroxidase (POD) Activity",
    wavelengths: ["470"],
    protocol: [
      "시료 20mg + pH 7.0 50mM PBS 2mL로 효소 추출",
      "액체질소 5분 + sonication 10분 (3회 반복)",
      "15,000RPM, 4℃, 10min centrifuge",
      "Centrifuge 후 상층액 (1.5mL) 뽑고 박스에 넣어 deep freezer에 보관",
      "40mM phosphate buffer 66.6μL + 20mM guaiacol 80μL + 3% H₂O₂ 33.3μL + sample 20μL 넣기",
      "470nm에서 10초마다 흡광도 측정"
    ],
    formulas: [
      "POD activity (μmol/min/mL) = (ΔA470/min) × total volume × 1000 / (26.6 × enzyme volume)",
      "POD activity (μmol/min/mg DW) = unit/mL / enzyme (mg/mL)"
    ],
    unit: "μmol/min/mg DW",
    icon: <Beaker className="h-4 w-4 sm:h-5 sm:w-5" />
  },
  sod: {
    title: "슈퍼옥사이드 디스뮤타아제 활성",
    subtitle: "Superoxide Dismutase (SOD) Activity",
    wavelengths: ["560"],
    protocol: [
      "시료 20mg + pH 7.0 50mM PBS 2mL로 효소 추출",
      "액체질소 5분 + sonication 10분 (3회 반복)",
      "15,000RPM, 4℃, 10min centrifuge",
      "Centrifuge 후 상층액 (1.5mL) 뽑고 박스에 넣어 deep freezer에 보관",
      "순서대로 50mM phosphate buffer 93.5μL, 0.1M methionine 52μL, 2.5mM NBT 24.5μL, 10mM EDTA 2μL, 0.5mM riboflavin 8μL 넣기",
      "PPFD 50 μmolm-2s-1의 LED 광에 15분간 노출시킨 후 빛을 차단",
      "560nm에서 흡광도 측정"
    ],
    formulas: [
      "SOD inhibition (%) = ((Control - Sample) / Control) × 100%",
      "SOD activity (unit/mL) = (inhibition × total volume) / (50 × enzyme volume)",
      "SOD activity (unit/mg DW) = unit/mL / enzyme (mg/mL)"
    ],
    unit: "unit/mg DW",
    icon: <Microscope className="h-4 w-4 sm:h-5 sm:w-5" />
  },
  h2o2: {
    title: "과산화수소 함량",
    subtitle: "Hydrogen Peroxide (H₂O₂) Content",
    wavelengths: ["390"],
    protocol: [
      "시료 20mg + 0.1% TCA 2mL 혼합 후 vortex",
      "액체질소 5분 + sonication 10분 (3회 반복)",
      "15,000RPM, 4℃, 10min centrifuge",
      "상등액 1.5mL 추출",
      "10mM potassium phosphate buffer + 1M KI 사용하여 반응",
      "암실에서 10분 반응 후 390nm에서 측정"
    ],
    formulas: [
      "H₂O₂ standard curve 사용하여 함량 계산",
      "농도 = (흡광도 - b) / a"
    ],
    unit: "μmol/g DW",
    icon: <Calculator className="h-4 w-4 sm:h-5 sm:w-5" />
  }
};

export default function Analysis() {
  const [selectedAnalysis, setSelectedAnalysis] = useState("");
  const navigate = useNavigate();

  const handleAnalyzeClick = () => {
    if (selectedAnalysis) {
      navigate(createPageUrl("Results") + `?analysis_type=${selectedAnalysis}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8 space-y-6 sm:space-y-8">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">분석 프로토콜 선택</h1>
          <p className="text-sm sm:text-base text-gray-600">수행할 생화학 분석을 선택하세요.</p>
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
                      분석하기 <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                    <div className="bg-white/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-0">
                      <h3 className="text-gray-900 font-semibold mb-4 flex items-center space-x-2 text-sm sm:text-base">
                        <TestTube className="h-4 w-4" />
                        <span>실험 프로토콜</span>
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
                          <span>계산 공식</span>
                        </h3>
                        <div className="space-y-3 sm:space-y-4">
                          {analysisProtocols[selectedAnalysis].formulas.map((formula, index) => (
                            <div key={index} className="p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-200">
                              <code className="text-gray-800 text-xs sm:text-sm font-mono leading-relaxed break-all">
                                {formula}
                              </code>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="bg-white/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-0">
                        <h3 className="text-gray-900 font-semibold mb-4 flex items-center space-x-2 text-sm sm:text-base">
                          <Microscope className="h-4 w-4" />
                          <span>측정 파장</span>
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
