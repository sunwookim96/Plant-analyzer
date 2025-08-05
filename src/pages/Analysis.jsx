
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
      "2 mL 튜브에 2 mL의 90% MeOH과 시료 20 mg 넣기",
      "20℃에서 중간 강도로 sonication 20분간 추출",
      "15,000 RPM, 4℃, 10 min 조건으로 centrifuge",
      "상층액 1.5 mL 추출 후 냉장보관",
      "96-well에 추출물 200 μL 분주하여 흡광도 측정"
    ],
    reagents: [
      "90% MeOH: 90 mL 메탄올 + 10 mL 증류수"
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
    title: "총 페놀 함량",
    subtitle: "Total Phenolic Content",
    wavelengths: ["765"],
    protocol: [
      "2 mL 튜브에 2 mL의 90% MeOH과 시료 20 mg 넣기",
      "20℃에서 중간 강도로 sonication 20분간 추출",
      "15,000 RPM, 4℃, 10 min 조건으로 centrifuge",
      "상층액 1.5 mL 추출 후 냉장보관",
      "상층액 100 μL + Folin-Ciocalteu reagent 100 μL + 증류수 1500 μL 넣기",
      "5분간 방치",
      <span>7.5% Na<sub>2</sub>CO<sub>3</sub> 용액 300 μL 넣기</span>,
      "40분간 상온에서 반응",
      "765 nm에서 흡광도 측정"
    ],
    reagents: [
      "7.5% Na₂CO₃: 100 mL 증류수에 7.5 g Sodium Carbonate 용해",
      "Folin-Ciocalteu reagent: 상업적으로 구입 (Sigma-Aldrich 등)",
      "Gallic acid 표준곡선: 1 mg/mL stock 제조 후, 0, 20, 40, 60, 80, 100 μg/mL 농도로 희석하여 시료와 동일 조건(40분, 상온)에서 반응"
    ],
    storage_conditions: [
      "TCA, PBS 등 완충액: 냉장 보관 (제조 후) - 오염 주의, 장기 보관 시 filter-sterilize 권장"
    ],
    formulas: [
      "Gallic acid standard curve 사용하여 함량 계산",
      "농도 = (흡광도 - b) / a"
    ],
    unit: "mg GAE/g DW",
    icon: <Beaker className="h-4 w-4 sm:h-5 sm:w-5" />,
    references: [
      {
        citation: "Severo, J.; Tiecher, A.; Chaves, F.C.; Silva, J.A.; Rombaldi, C.V. Gene transcript accumulation associated with physiological and chemical changes during developmental stages of strawberry cv. Camarosa. Food Chem. 2011, 126, 995–1000.",
        doi: "10.1016/j.foodchem.2010.11.107"
      }
    ]
  },
  total_flavonoid: {
    title: "총 플라보노이드",
    subtitle: "Total Flavonoid",
    wavelengths: ["415"],
    protocol: [
      "2 mL 튜브에 2 mL의 90% MeOH과 시료 20 mg 넣기",
      "20℃에서 중간 강도로 sonication 20분간 추출",
      "15,000 RPM, 4℃, 10 min 조건으로 centrifuge",
      "상층액 1.5 mL 추출 후 냉장보관",
      <span>2ml 튜브에 상층액 100 μL + 95% EtOH 300 μL + 10% AlCl<sub>3</sub> 20 μL + 1 M potassium acetate 20 μL + 증류수 600 μL 넣기</span>,
      "상온에서 40분간 반응",
      "415 nm에서 흡광도 측정"
    ],
    reagents: [
      "95% EtOH: 95 mL 에탄올 + 5 mL 증류수",
      "10% AlCl₃: 100 mL 증류수에 10 g Aluminum Chloride 용해",
      "1 M Potassium acetate: 100 mL 증류수에 9.82 g CH₃COOK 용해",
      "Quercetin 표준곡선: 1 mg/mL stock 제조 후, 0, 20, 40, 60, 80, 100 μg/mL 농도로 희석하여 시료와 동일 조건(40분, 상온)에서 반응"
    ],
    formulas: [
      "Quercetin standard curve 사용하여 함량 계산",
      "농도 = (흡광도 - b) / a"
    ],
    unit: "mg QE/g DW",
    icon: <FlaskConical className="h-4 w-4 sm:h-5 sm:w-5" />,
    references: [
      {
        citation: "Chang, C.-C.; Yang, M.-H.; Wen, H.-M.; Chern, J.-C. Estimation of total flavonoid content in propolis by two complementary colometric methods. J. Food Drug Anal. 2002, 10, 3.",
        doi: "10.38212/2224-6614.2748"
      }
    ]
  },
  glucosinolate: {
    title: "글루코시놀레이트",
    subtitle: "Total Glucosinolate",
    wavelengths: ["425"],
    protocol: [
      "2 mL 튜브에 2 mL의 90% MeOH과 시료 20 mg 넣기",
      "20℃에서 중간 강도로 sonication 20분간 추출",
      "15,000 RPM, 4℃, 10 min 조건으로 centrifuge",
      "상층액 1.5 mL 추출 후 냉장보관",
      "2ml 튜브에 상층액 50 μL + 2 mM sodium tetrachloropalladate 1.5 mL + 증류수 150 μL 넣기",
      "1시간 동안 상온에서 반응",
      "425 nm에서 흡광도 측정"
    ],
    reagents: [
      "2 mM Sodium tetrachloropalladate: 100 mL 증류수에 36.5 mg Na₂PdCl₄ 용해"
    ],
    formulas: [
      <span>Total glucosinolate (μmol/g) = 1.40 + 118.86 × A<sub>425</sub></span>
    ],
    unit: "μmol/g DW",
    icon: <Microscope className="h-4 w-4 sm:h-5 sm:w-5" />,
    references: [
      {
        citation: "Mawlong, I., M. Sujith Kumar, B. Gurung, K. Singh, and D. Singh. 2017. \"A Simple Spectrophotometric Method for Estimating Total Glucosinolates in Mustard de-Oiled Cake.\" International Journal of Food Properties 20 (12): 3274–81",
        doi: "10.1080/10942912.2017.1286353"
      }
    ]
  },
  dpph_scavenging: {
    title: "DPPH 라디칼 소거능",
    subtitle: "DPPH Radical Scavenging",
    wavelengths: ["517"],
    protocol: [
      "2 mL 튜브에 2 mL의 90% MeOH과 시료 20 mg 넣기",
      "20℃에서 중간 강도로 sonication 20분간 추출",
      "15,000 RPM, 4℃, 10 min 조건으로 centrifuge",
      "상층액 1.5 mL 추출 후 냉장보관",
      "96-well plate에 90% MeOH 170 μL + DPPH 용액 10 μL + 상층액 20 μL 순서대로 넣기",
      "Control(Blank)는 상층액 대신 90% MeOH 20uL를 사용합니다.",
      "Parafilm으로 밀봉 후 암조건에서 1시간 동안 반응",
      "517 nm에서 흡광도 측정"
    ],
    reagents: [
      "90% MeOH: 90 mL 메탄올 + 10 mL 증류수",
      "DPPH 용액: 50 mL 90% MeOH에 200 mg DPPH (최종농도 4 mg/mL) 용해 후 호일로 포장하여 냉장보관 (4℃)"
    ],
    storage_conditions: [
      "DPPH: 냉장 보관 (4℃), 호일 포장, 사용 직전까지 암조건 보관"
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
    title: "안토시아닌",
    subtitle: "Total Anthocyanin",
    wavelengths: ["530", "600"],
    protocol: [
      <span>2 mL 튜브에 1% HCl-MeOH 용액 2 mL + 시료 20 mg 넣기</span>,
      "40℃에서 중간 강도로 sonication 1시간 추출",
      "15,000 RPM, 4℃, 10 min 조건으로 centrifuge",
      "상층액 1.5 mL 추출 후 냉장보관",
      "530 nm, 600 nm에서 흡광도 측정"
    ],
    reagents: [
      "1% HCl-MeOH: 99 mL 메탄올에 1 mL 진한 염산(37%, 약 12 M)을 천천히 가하여 혼합",
      "1 M HCl: 100 mL 증류수에 진한 염산(37%, 12 M) 약 8.3 mL를 천천히 첨가하여 혼합"
    ],
    formulas: [
      <span>Anthocyanin (mg/g) = (A<sub>530</sub> - A<sub>600</sub>) × V × n × Mw / (ε × m)</span>,
      "V = 추출부피(mL), n = 희석배수, Mw = 449.2, ε = 26900, m = 시료무게(g)"
    ],
    unit: "mg/g DW",
    icon: <TestTube className="h-4 w-4 sm:h-5 sm:w-5" />,
    references: [
      {
        citation: "Yang, Y.-C., D.-W. Sun, H. Pu, N.-N. Wang, and Z. Zhu. 2015. \"Rapid Detection of Anthocyanin Content in Lychee Pericarp During Storage Using Hyperspectral Imaging Coupled with Model Fusion.\" Postharvest Biology and Technology 103: 55–65.",
        doi: "10.1016/j.postharvbio.2015.02.008"
      }
    ]
  },
  cat: {
    title: "카탈라아제 활성",
    subtitle: "Catalase (CAT) Activity",
    wavelengths: ["240"],
    protocol: [
      "시료 20 mg + pH 7.0 50 mM PBS 2 mL로 효소 추출",
      "액체질소 5분 + sonication 10분 (3회 반복)",
      "15,000 RPM, 4℃, 10 min centrifuge",
      "Centrifuge 후 상층액 (1.5 mL) 뽑고 박스에 넣어 deep freezer에 보관",
      <span>반응 혼합물 제조 후 효소 3 μL 넣기</span>,
      "240 nm에서 10초마다 10분간 흡광도 측정"
    ],
    reagents: [
      "50 mM PBS (pH 7.0): 100 mL 증류수에 0.68 g KH₂PO₄ + 0.87 g K₂HPO₄ 용해, 냉장보관",
      "3% H₂O₂: 30% H₂O₂ 1 mL + 증류수 9 mL, 냉장보관 (4℃), 갈색병 보관",
      "반응 혼합물: 3% H₂O₂ 3.4 μL + 50 mM PBS 193.6 μL"
    ],
    storage_conditions: [
        "H₂O₂: 냉장 보관 (4℃), 밀봉, 갈색병 보관 - 희석 후 즉시 사용, 공기 노출 최소화",
        "PBS 완충액: 냉장 보관 (제조 후) - 오염 주의, 장기 보관 시 filter-sterilize 권장"
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
    title: "퍼옥시다아제 활성",
    subtitle: "Peroxidase (POD) Activity",
    wavelengths: ["470"],
    protocol: [
      "시료 20 mg + pH 7.0 50 mM PBS 2 mL로 효소 추출",
      "액체질소 5분 + sonication 10분 (3회 반복)",
      "15,000 RPM, 4℃, 10 min centrifuge",
      "Centrifuge 후 상층액 (1.5 mL) 뽑고 박스에 넣어 deep freezer에 보관",
      <span>반응 혼합물 제조 후 sample 20 μL 넣기</span>,
      "470 nm에서 10초마다 흡광도 측정"
    ],
    reagents: [
      "50 mM PBS (pH 7.0): 100 mL 증류수에 0.68 g KH₂PO₄ + 0.87 g K₂HPO₄ 용해, 냉장보관",
      "40 mM Phosphate buffer: 100 mL 증류수에 0.54 g KH₂PO₄ + 0.70 g K₂HPO₄ 용해, 냉장보관",
      "20 mM Guaiacol: 100 mL 증류수에 248 mg guaiacol (20 mM) 용해, 실온보관 가능 (장기보관 시 냉장), 밀폐 보관",
      "3% H₂O₂: 30% H₂O₂ 1 mL + 증류수 9 mL, 냉장보관 (4℃), 갈색병 보관",
      "반응 혼합물: 40 mM phosphate buffer 66.6 μL + 20 mM guaiacol 80 μL + 3% H₂O₂ 33.3 μL"
    ],
    storage_conditions: [
        "H₂O₂: 냉장 보관 (4℃), 밀봉, 갈색병 보관 - 희석 후 즉시 사용, 공기 노출 최소화",
        "Guaiacol: 실온 보관 가능 (장기 보관 시 냉장), 휘발성 강하므로 밀폐",
        "PBS 완충액: 냉장 보관 (제조 후) - 오염 주의, 장기 보관 시 filter-sterilize 권장"
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
    title: "슈퍼옥사이드 디스뮤타아제 활성",
    subtitle: "Superoxide Dismutase (SOD) Activity",
    wavelengths: ["560"],
    protocol: [
      "시료 20 mg + pH 7.0 50 mM PBS 2 mL로 효소 추출",
      "액체질소 5분 + sonication 10분 (3회 반복)",
      "15,000 RPM, 4℃, 10 min centrifuge",
      "Centrifuge 후 상층액 (1.5 mL) 뽑고 박스에 넣어 deep freezer에 보관",
      "반응 혼합물을 순서대로 넣고 마지막에 riboflavin 첨가",
      <span>PPFD 50 μmol m<sup>-2</sup>s<sup>-1</sup>의 LED 광에 15분간 노출시킨 후 빛을 차단</span>,
      "560 nm에서 흡광도 측정"
    ],
    reagents: [
      "50 mM PBS (pH 7.0): 100 mL 증류수에 0.68 g KH₂PO₄ + 0.87 g K₂HPO₄ 용해, 냉장보관",
      "0.1 M Methionine: 100 mL 증류수에 1.49 g methionine 용해, 냉장보관 (산화 방지를 위해 밀봉)",
      "2.5 mM NBT: 100 mL 증류수에 205 mg nitro blue tetrazolium 용해, 냉장보관 (4℃), 호일 포장 권장, 즉시 조제 후 사용",
      "10 mM EDTA: 100 mL 증류수에 372 mg EDTA 용해, 냉장보관 (조제 후)",
      "0.5 mM Riboflavin: 100 mL 증류수에 18.8 mg riboflavin 용해, 냉장보관 (4℃), 반드시 호일 포장, 광분해 민감하므로 즉시 사용 권장"
    ],
    storage_conditions: [
        "Riboflavin: 냉장 보관 (4℃), 반드시 호일 포장, 광분해 민감, 즉시 사용 권장",
        "NBT: 냉장 보관 (4℃), 호일 포장 권장, 즉시 조제 후 사용, 암조건 유지",
        "Methionine: 냉장 보관, 산화 방지 위해 밀봉",
        "EDTA, PBS 완충액: 냉장 보관 (제조 후) - 오염 주의, 장기 보관 시 filter-sterilize 권장"
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
    title: "과산화수소 함량",
    subtitle: "Hydrogen Peroxide (H₂O₂) Content",
    wavelengths: ["390"],
    protocol: [
      "시료 20 mg + 0.1% TCA 2 mL 혼합 후 vortex",
      "액체질소 5분 + sonication 10분 (3회 반복)",
      "15,000 RPM, 4℃, 10 min centrifuge",
      "상등액 1.5 mL 추출",
      "반응 혼합물 제조 후 1시간 암실에서 반응",
      "390 nm에서 측정"
    ],
    reagents: [
      "0.1% TCA: 100 mL 증류수에 100 mg trichloroacetic acid 용해, 냉장보관 (제조 후)",
      "10 mM Potassium phosphate buffer (pH 7.0): 100 mL 증류수에 136 mg KH₂PO₄ + 174 mg K₂HPO₄ 용해, 냉장보관 (제조 후)",
      "1 M KI: 100 mL 증류수에 16.6 g potassium iodide 용해, 냉장보관",
      "1 mM H₂O₂ Stock: 35% H₂O₂ 원액 5.1 μL + 0.1% TCA 49.995 mL (35% H₂O₂는 약 9.89 M), 냉장보관 (4℃), 갈색병 보관, 즉시 사용",
      <span>H₂O₂ 표준곡선 (예): 1 mM stock을 이용하여 다음 농도로 희석: 0, 0.05, 0.1, 0.2, 0.4, 0.6, 0.8, 1.0 mM. 시료와 동일 조건(1시간 암반응)에서 반응. (농도는 사용자에 따라 달라질 수 있음)</span>
    ],
    storage_conditions: [
      "H₂O₂: 냉장 보관 (4℃), 밀봉, 갈색병 보관 - 희석 후 즉시 사용, 공기 노출 최소화",
      "KI: 냉장 보관 - 오염 주의, 장기 보관 시 filter-sterilize 권장",
      "TCA, PBS 등 완충액: 냉장 보관 (제조 후) - 오염 주의, 장기 보관 시 filter-sterilize 권장"
    ],
    formulas: [
      <span>H<sub>2</sub>O<sub>2</sub> standard curve 사용하여 함량 계산</span>,
      "농도 = (흡광도 - b) / a"
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

export default function Analysis() {
  const [selectedAnalysis, setSelectedAnalysis] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // URL에서 선택된 분석 타입 확인
  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const selected = params.get("selected");
    if (selected) {
      setSelectedAnalysis(selected);
    } else {
      setSelectedAnalysis("");
    }
  }, [location.search]);

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
              {/* 흡광도 신뢰성 가이드 - 엽록소 및 카로티노이드만 표시 */}
              {selectedAnalysis === 'chlorophyll_a_b' && (
                <Card className="bg-white/80 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-xl border-0 overflow-hidden mb-6">
                  <CardHeader className="p-4 sm:p-6 pb-3">
                    <CardTitle className="text-gray-900 text-lg sm:text-xl font-bold flex items-center space-x-2">
                      <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>흡광도 측정 신뢰성 가이드</span>
                    </CardTitle>
                    <p className="text-gray-600 text-sm">측정값의 정확성을 위해 아래 범위를 참고하세요.</p>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 pt-0">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm border-collapse">
                        <thead>
                          <tr className="border-b-2 border-gray-200">
                            <th className="text-left py-3 px-4 font-bold text-gray-800 bg-gray-50/50">범위 (AU)</th>
                            <th className="text-left py-3 px-4 font-bold text-gray-800 bg-gray-50/50">신뢰성</th>
                            <th className="text-left py-3 px-4 font-bold text-gray-800 bg-gray-50/50">비고</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-gray-100 bg-green-50/30">
                            <td className="py-3 px-4 font-mono font-semibold text-gray-900">0.1 ~ 0.5</td>
                            <td className="py-3 px-4">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                                가장 이상적
                              </span>
                            </td>
                            <td className="py-3 px-4 text-gray-700">정밀도 매우 높음</td>
                          </tr>
                          <tr className="border-b border-gray-100 bg-blue-50/20">
                            <td className="py-3 px-4 font-mono font-semibold text-gray-900">0.5 ~ 1.0</td>
                            <td className="py-3 px-4">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                                좋음
                              </span>
                            </td>
                            <td className="py-3 px-4 text-gray-700">대부분 측정 조건에서 타당</td>
                          </tr>
                          <tr className="border-b border-gray-100 bg-yellow-50/30">
                            <td className="py-3 px-4 font-mono font-semibold text-gray-900">1.0 ~ 1.5</td>
                            <td className="py-3 px-4">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                                허용 가능
                              </span>
                            </td>
                            <td className="py-3 px-4 text-gray-700">calibration curve 유지 시 참고 가능</td>
                          </tr>
                          <tr className="border-b border-gray-100 bg-orange-50/30">
                            <td className="py-3 px-4 font-mono font-semibold text-gray-900">1.5 ~ 2.0</td>
                            <td className="py-3 px-4">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800">
                                경고 상태
                              </span>
                            </td>
                            <td className="py-3 px-4 text-gray-700">stray light로 인해 비선형 가능성 있음</td>
                          </tr>
                          <tr className="border-b border-gray-100 bg-red-50/30">
                            <td className="py-3 px-4 font-mono font-semibold text-gray-900">&gt; 2.0</td>
                            <td className="py-3 px-4">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                                비추천
                              </span>
                            </td>
                            <td className="py-3 px-4 text-gray-700">투과광량 극히 작고 측정 오차 커짐</td>
                          </tr>
                          <tr className="bg-red-100/50">
                            <td className="py-3 px-4 font-mono font-bold text-gray-900">≥ 3.0</td>
                            <td className="py-3 px-4">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-200 text-red-900">
                                절대 희석 필요
                              </span>
                            </td>
                            <td className="py-3 px-4 text-gray-700 font-medium">Beer–Lambert 법칙 범위 벗어나므로 무효화됨</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-200">
                      <p className="text-blue-800 text-sm">
                        <strong>💡 팁:</strong> 흡광도가 권장 범위를 벗어나는 경우, 시료를 적절히 희석하거나 농축하여 0.1~1.0 범위 내에서 측정하시는 것을 권장합니다.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

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
                    {/* 왼쪽: 실험 프로토콜 + 계산 공식 + 측정 파장 */}
                    <div className="space-y-4 sm:space-y-6">
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

                      <div className="bg-white/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-0">
                        <h3 className="text-gray-900 font-semibold mb-4 flex items-center space-x-2 text-sm sm:text-base">
                          <Calculator className="h-4 w-4" />
                          <span>계산 공식</span>
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

                    {/* 오른쪽: 시약 제조법 + 시약별 보관조건 주의 */}
                    <div className="space-y-4 sm:space-y-6">
                      {/* 시약 제조법 섹션 */}
                      {analysisProtocols[selectedAnalysis].reagents && (
                        <div className="bg-white/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-0">
                          <h3 className="text-gray-900 font-semibold mb-4 flex items-center space-x-2 text-sm sm:text-base">
                            <Beaker className="h-4 w-4" />
                            <span>시약 제조법</span>
                          </h3>
                          <div className="space-y-3">
                            {analysisProtocols[selectedAnalysis].reagents.map((reagent, index) => (
                              <div key={index} className="p-3 sm:p-4 bg-blue-50 rounded-lg sm:rounded-xl border border-blue-200">
                                <div className="text-gray-800 text-xs sm:text-sm leading-relaxed">
                                  {typeof reagent === 'string' ? (
                                    <>
                                      <strong>{reagent.split(':')[0]}:</strong> {reagent.split(':').slice(1).join(':')}
                                    </>
                                  ) : (
                                    reagent
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 시약별 보관조건 주의 섹션 */}
                      {analysisProtocols[selectedAnalysis].storage_conditions && (
                        <div className="bg-white/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-0">
                          <h3 className="text-gray-900 font-semibold mb-4 flex items-center space-x-2 text-sm sm:text-base">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.98-.833-2.75 0L4.064 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            <span>시약별 보관조건 주의</span>
                          </h3>
                          <div className="space-y-3">
                            {analysisProtocols[selectedAnalysis].storage_conditions.map((condition, index) => (
                              <div key={index} className="p-3 sm:p-4 bg-yellow-50 rounded-lg sm:rounded-xl border border-yellow-200">
                                <div className="text-gray-800 text-xs sm:text-sm leading-relaxed">
                                  <strong>{condition.split(':')[0]}:</strong> {condition.split(':').slice(1).join(':')}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  
                    {/* 참고문헌 섹션 - 맨 아래 전체 너비 */}
                    {analysisProtocols[selectedAnalysis].references && analysisProtocols[selectedAnalysis].references.length > 0 && (
                      <div className="lg:col-span-2 mt-6 sm:mt-8 bg-white/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-0">
                        <h3 className="text-gray-900 font-semibold mb-4 flex items-center space-x-2 text-sm sm:text-base">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                          <span>참고문헌</span>
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
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 00-2 2v10a2 2 002 2h10a2 2 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                  </svg>
                                  <span>DOI: {ref.doi}</span>
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
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
