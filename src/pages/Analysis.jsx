import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import {
  TestTube, Beaker, FlaskConical, Microscope, Calculator,
  ArrowRight, TrendingUp, RefreshCw, Settings2, PenTool,
  BookOpen, ArrowLeft, Info
} from "lucide-react";
import { createPageUrl } from "@/utils";

// ✅ 이미지 경로 헬퍼
const img = (file) => {
  try {
    return new URL(`../images/${file}`, import.meta.url).href;
  } catch (e) {
    return `/images/${file}`;
  }
};

// --- [Reusable Components] ---
const GlassCard = ({ children, className = "" }) => (
  <div className={`rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-xl overflow-hidden ${className}`}>
    {children}
  </div>
);

const GlassBadge = ({ children, className = "" }) => (
  <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors ${className}`}>
    {children}
  </span>
);

// --- [Chart Component] Dark Mode Optimized ---
const SimpleLineChart = ({
  data, xKey, yKey, xLabel, yLabel,
  color = "#60a5fa",
  width = 520,
  height = 320,
}) => {
  if (!data || data.length < 2) return (
    <div className="h-full flex flex-col items-center justify-center text-gray-500 text-xs bg-black/20 rounded-lg border border-white/5">
      <span>데이터 부족</span>
      <span className="text-[10px] mt-1">2개 이상의 농도를 입력하세요</span>
    </div>
  );

  const padding = { top: 24, right: 34, bottom: 64, left: 78 };

  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  const xMax = Math.max(...data.map(d => d[xKey]));
  const yMax = Math.max(...data.map(d => d[yKey]));

  const xDomain = xMax === 0 ? 1 : xMax;
  const yDomain = yMax === 0 ? 1 : yMax;

  const points = data.map(d => {
    const x = padding.left + (d[xKey] / xDomain) * innerWidth;
    const y = height - padding.bottom - (d[yKey] / yDomain) * innerHeight;
    return `${x},${y}`;
  }).join(" ");

  return (
    <div className="w-full h-full flex flex-col items-center justify-center overflow-hidden">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full block"
        preserveAspectRatio="xMidYMid meet"
        style={{ overflow: "hidden" }} // ✅ 삐져나옴 방지
      >
        {[0, 0.25, 0.5, 0.75, 1].map((tick, i) => {
          const y = height - padding.bottom - (tick * innerHeight);
          return (
            <g key={i}>
              <line
                x1={padding.left}
                y1={y}
                x2={width - padding.right}
                y2={y}
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <text x={padding.left - 10} y={y + 4} textAnchor="end" fontSize="14" fill="#94a3b8">
                {Math.round(tick * yDomain)}
              </text>
            </g>
          );
        })}

        <line
          x1={padding.left}
          y1={height - padding.bottom}
          x2={width - padding.right}
          y2={height - padding.bottom}
          stroke="#475569"
          strokeWidth="2"
        />
        <line
          x1={padding.left}
          y1={padding.top}
          x2={padding.left}
          y2={height - padding.bottom}
          stroke="#475569"
          strokeWidth="2"
        />

        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          points={points}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {data.map((d, i) => {
          const x = padding.left + (d[xKey] / xDomain) * innerWidth;
          const y = height - padding.bottom - (d[yKey] / yDomain) * innerHeight;
          return (
            <g key={i} className="group">
              <circle
                cx={x}
                cy={y}
                r="4"
                fill="#1e293b"
                stroke={color}
                strokeWidth="2"
                className="cursor-pointer hover:r-5 transition-all"
              />
              <g className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <rect x={x - 35} y={y - 35} width="70" height="24" rx="4" fill="#0f172a" stroke="rgba(255,255,255,0.2)" />
                <text x={x} y={y - 19} textAnchor="middle" fontSize="10" fill="white" fontWeight="bold">
                  {d[xKey]} / {d[yKey]}
                </text>
              </g>
            </g>
          );
        })}

        {/* ✅ 축 제목(라벨) */}
        <text
          x={width / 2}
          y={height - 14}
          textAnchor="middle"
          fontSize="16"
          fontWeight="800"
          fill="#cbd5e1"
        >
          {xLabel}
        </text>

        <text
          x={26}
          y={height / 2}
          textAnchor="middle"
          transform={`rotate(-90, 26, ${height / 2})`} // ✅ 회전 기준점 일치
          fontSize="16"
          fontWeight="800"
          fill="#cbd5e1"
        >
          {yLabel}
        </text>
      </svg>
    </div>
  );
};

// --- [Data] Analysis Protocols ---
const analysisProtocols = {
  chlorophyll_a_b: {
    title: "엽록소 및 카로티노이드",
    subtitle: "Total Chlorophyll & Total Carotenoid",
    wavelengths: ["652.4", "665.2", "470"],
    protocol: [
      "2 mL 튜브에 시료 20 mg과 2 mL의 90% MeOH 순서대로 혼합 후 vortex",
      "20℃에서 중간 강도로 sonication 20분간 추출 후 vortex",
      "15,000 RPM, 4℃, 10 min 조건으로 centrifuge",
      "상층액 1~1.5 mL를 회수하고 색소 분해를 줄이기 위해 차광·냉장 상태로 보관",
      "96-well에 200 μL 분주하여 652.4, 665.2, 470 nm에서 흡광도 측정"
    ],
    reagents: ["90% MeOH: 90 mL 메탄올 + 10 mL 증류수"],
    storage_conditions: [
      "시료 분말: 동결건조 또는 저온건조 후 밀봉·차광·방습 상태로 −20℃ 보관 권장",
      "90% MeOH 추출액: 호일 또는 갈색 용기로 차광하고 4℃에서 보관, 가능하면 당일 측정"
    ],
    formulas: [
      <span key="c1">Chl a (mg/g) = (16.82 × A<sub>665.2</sub> - 9.28 × A<sub>652.4</sub>) / 10</span>,
      <span key="c2">Chl b (mg/g) = (36.92 × A<sub>652.4</sub> - 16.54 × A<sub>665.2</sub>) / 10</span>,
      <span key="c3">Carotenoid (mg/g) = (1000 × A<sub>470</sub> - 1.91 × Chl a - 95.15 × Chl b) / 2250</span>
    ],
    unit: "mg/g DW", // ✅ 단위 수정 완료
    icon: <TestTube className="h-4 w-4 sm:h-5 sm:w-5" />,
    references: [{ citation: "Lichtenthaler, H.K.; Buschmann, C. (2001).", doi: "10.1002/0471142913.faf0403s01" }]
  },
  total_phenol: {
    title: "총 페놀 함량",
    subtitle: "Total Phenolic Content",
    wavelengths: ["765"],
    protocol: [
      "2 mL 튜브에 시료 20 mg과 90% MeOH 2 mL 순서대로 혼합 후 vortex",
      "20℃에서 중간 강도로 sonication 20분간 추출 후 vortex",
      "15,000 RPM, 4℃, 10 min 조건으로 centrifuge",
      "상층액 1~1.5 mL를 회수하고 차광·냉장 상태에서 가능한 한 당일 반응",
      "상층액 & gallic acid stock 100 μL + Folin-Ciocalteu reagent 100 μL + 증류수 1500 μL 순서대로 넣은 후 5분 방치",
      <span key="tp1">7.5% Na<sub>2</sub>CO<sub>3</sub> 용액 300 μL 넣기</span>,
      "40분간 상온에서 반응",
      "96-well에 200 μL 분주",
      "표준곡선과 동시에 765 nm에서 흡광도 측정"
    ],
    reagents: [
      "7.5% Na₂CO₃: 100 mL 증류수에 7.5 g Sodium Carbonate 용해",
      "Folin-Ciocalteu reagent: 상업적으로 구입 (Sigma-Aldrich 등)",
      "Stock 용액: Gallic acid 10 mg + 90% MeOH 10 mL = 1 mg/mL"
    ],
    standard_curve_config: {
      title: "Gallic Acid 표준곡선 계산기",
      stock_name: "1 mg/mL Stock",
      solvent_name: "90% MeOH",
      stock_conc: 1000,
      unit: "μg/mL",
      default_total_vol: 1.0,
      default_concs: [0, 20, 40, 60, 80, 100]
    },
    storage_conditions: [
      "시료 분말: 동결건조 또는 저온건조 후 밀봉·차광·방습 상태로 −20℃ 보관 권장",
      "90% MeOH 추출액: 4℃ 차광 보관, 가능하면 24~48시간 내 측정",
      "Folin-Ciocalteu reagent 및 gallic acid 표준용액: 갈색 용기에 소분하여 냉장 또는 −20℃ 보관",
      "7.5% Na₂CO₃: 냉장 보관 (제조 후)"
    ],
    formulas: ["함량 (mg/g) = ((흡광도 - b) / a) / 10"],
    unit: "mg GAE/g DW",
    icon: <Beaker className="h-4 w-4 sm:h-5 sm:w-5" />,
    references: [{ citation: "Severo, J. et al. (2011).", doi: "10.1016/j.foodchem.2010.11.107" }]
  },
  total_flavonoid: {
    title: "총 플라보노이드",
    subtitle: "Total Flavonoid",
    wavelengths: ["415"],
    protocol: [
      "2 mL 튜브에 시료 20 mg과 90% MeOH 2 mL 순서대로 혼합 후 vortex",
      "20℃에서 중간 강도로 sonication 20분간 추출 후 vortex",
      "15,000 RPM, 4℃, 10 min 조건으로 centrifuge",
      "상층액 1~1.5 mL를 회수하고 차광·냉장 상태에서 가능한 한 당일 반응",
      <span key="tf1">상층액 & Quercetin stock 100 μL + 95% EtOH 300 μL + 10% AlCl<sub>3</sub> 20 μL + 1 M potassium acetate 20 μL + 증류수 600 μL 순서대로 넣기</span>,
      "상온에서 40분간 반응",
      "96-well에 200 μL 분주 후 표준곡선과 동시에 415 nm에서 흡광도 측정"
    ],
    reagents: [
      "95% EtOH: 95 mL 에탄올 + 5 mL 증류수",
      "10% AlCl₃: 100 mL 증류수에 10 g Aluminum Chloride 용해",
      "1 M Potassium acetate: 100 mL 증류수에 9.82 g CH₃COOK 용해",
      "Stock 용액: Quercetin 10 mg + 90% MeOH 10 mL = 1 mg/mL"
    ],
    standard_curve_config: {
      title: "Quercetin 표준곡선 계산기",
      stock_name: "1 mg/mL Stock",
      solvent_name: "90% MeOH",
      stock_conc: 1000,
      unit: "μg/mL",
      default_total_vol: 1.0,
      default_concs: [0, 10, 20, 40, 60, 80, 100]
    },
    storage_conditions: [
      "시료 분말: 동결건조 또는 저온건조 후 밀봉·차광·방습 상태로 −20℃ 보관 권장",
      "90% MeOH 추출액: 4℃ 차광 보관, 가능하면 24~48시간 내 측정",
      "Quercetin 표준용액: 갈색 용기에 소분하여 −20℃ 차광 보관",
      "AlCl₃ 및 potassium acetate 용액: 냉장 보관 (제조 후)"
    ],
    formulas: ["함량 (mg/g) = ((흡광도 - b) / a) / 10"],
    unit: "mg QE/g DW",
    icon: <FlaskConical className="h-4 w-4 sm:h-5 sm:w-5" />,
    references: [{ citation: "Chang, C.-C. et al. (2002).", doi: "10.38212/2224-6614.2748" }]
  },
  glucosinolate: {
    title: "글루코시놀레이트",
    subtitle: "Total Glucosinolate",
    wavelengths: ["425"],
    protocol: [
      "2 mL 튜브에 시료 20 mg과 90% MeOH 2 mL 순서대로 혼합 후 vortex",
      "20℃에서 중간 강도로 sonication 20분간 추출 후 vortex",
      "15,000 RPM, 4℃, 10 min 조건으로 centrifuge",
      "상층액 1~1.5 mL를 회수하고 차광·냉장 상태에서 가능한 한 당일 반응",
      "2 mL 튜브에 상층액 50 μL + 2 mM sodium tetrachloropalladate 1.5 mL + 증류수 150 μL 순서대로 넣기",
      "1시간 동안 상온에서 반응",
      "96-well에 200 μL 분주 후 425 nm에서 흡광도 측정"
    ],
    reagents: [
      "2 mM Sodium tetrachloropalladate: 100 mL 증류수에 36.5 mg Na₂PdCl₄ 용해"
    ],
    storage_conditions: [
      "시료 분말: 건조 후 방습 상태로 −20℃ 보관, myrosinase에 의한 분해를 줄이기 위해 장시간 실온 방치 금지",
      "MeOH 추출액: 4℃ 차광 보관, 장기 보관은 피하고 가능하면 24~48시간 내 측정",
      "Sodium tetrachloropalladate 용액: 4℃ 차광 보관, 침전 또는 변색 시 새로 제조"
    ],
    formulas: [<span key="g1">Total glucosinolate (μmol/g) = 1.40 + 118.86 × A<sub>425</sub></span>],
    unit: "μmol/g DW",
    icon: <Microscope className="h-4 w-4 sm:h-5 sm:w-5" />,
    references: [{ citation: "Mawlong, I. et al. (2017).", doi: "10.1080/10942912.2017.1286353" }]
  },
  dpph_scavenging: {
    title: "DPPH 라디칼 소거능",
    subtitle: "DPPH Radical Scavenging",
    wavelengths: ["517"],
    protocol: [
      "2 mL 튜브에 시료 20 mg과 90% MeOH 2 mL 순서대로 혼합 후 vortex",
      "20℃에서 중간 강도로 sonication 20분간 추출 후 vortex",
      "15,000 RPM, 4℃, 10 min 조건으로 centrifuge",
      "상층액 1~1.5 mL를 회수하고 차광·냉장 상태에서 가능한 한 당일 반응",
      "96-well plate에 90% MeOH 170 μL + DPPH 용액 10 μL + 상층액 20 μL 순서대로 넣기",
      "Control(Blank)의 경우 90% MeOH 20uL를 사용",
      "Parafilm으로 밀봉 후 암조건에서 1시간 동안 반응",
      "96-well에 200 μL 분주 후 517 nm에서 흡광도 측정"
    ],
    reagents: [
      "90% MeOH: 90 mL 메탄올 + 10 mL 증류수",
      "DPPH 용액: 50 mL 90% MeOH에 200 mg DPPH (최종농도 4 mg/mL) 용해 후 호일로 포장"
    ],
    storage_conditions: [
      "DPPH: 냉장보관 (4℃), 갈색병 또는 호일 포장 권장",
      "시료 추출액: 4℃ 차광 보관, 항산화 반응성 변화를 줄이기 위해 당일 측정 권장"
    ],
    formulas: ["DPPH Inhibition (%) = ((Control - Sample) / Control) × 100%"],
    unit: "% inhibition",
    icon: <Calculator className="h-4 w-4 sm:h-5 sm:w-5" />,
    references: [{ citation: "Blois, M.S. (1958).", doi: "10.1038/1811199a0" }]
  },
  anthocyanin: {
    title: "안토시아닌",
    subtitle: "Total Anthocyanin",
    wavelengths: ["530", "600"],
    protocol: [
      <span key="a1">2 mL 튜브에 시료 20 mg과 1% HCl-MeOH 2 mL 순서대로 혼합 후 vortex</span>,
      "40℃에서 중간 강도로 sonication 1시간 추출 후 vortex",
      "15,000 RPM, 4℃, 10 min 조건으로 centrifuge",
      "상층액 1~1.5 mL를 회수하고 산성 MeOH 추출액은 차광·냉장 상태로 보관",
      "96-well에 200 μL 분주 후 530, 600 nm에서 흡광도 측정"
    ],
    reagents: [
      "1% HCl-MeOH: 99 mL 메탄올에 1 mL 진한 염산(37%, 약 12 M)을 천천히 가하여 혼합",
      "1 M HCl: 100 mL 증류수에 진한 염산(37%, 12 M) 약 8.3 mL를 천천히 첨가하여 혼합"
    ],
    storage_conditions: [
      "시료 분말: 동결건조 또는 저온건조 후 −20℃ 차광·방습 보관",
      "1% HCl-MeOH 추출액: 색소 안정성을 위해 4℃ 차광 보관하고 가능한 당일 측정",
      "산성 MeOH는 휘발성·부식성이 있으므로 밀봉하여 냉장 보관하고 후드에서 취급"
    ],
    formulas: [
      <span key="a2">Anthocyanin (mg/g) = (A<sub>530</sub> - A<sub>600</sub>) × V × n × Mw / (ε × m)</span>,
      "V = 추출부피(mL), n = 희석배수, Mw = 449.2, ε = 26900, m = 시료무게(g)"
    ],
    unit: "mg/g DW",
    icon: <TestTube className="h-4 w-4 sm:h-5 sm:w-5" />,
    references: [{ citation: "Yang, Y.-C. et al. (2015).", doi: "10.1016/j.postharvbio.2015.02.008" }]
  },
  cat: {
    title: "카탈라아제 활성",
    subtitle: "Catalase (CAT) Activity",
    wavelengths: ["240"],
    protocol: [
      "2 mL 튜브에 시료 20 mg + 50 mM PBS (pH 7.0) 2 mL 순서대로 혼합 후 vortex",
      "액체질소 5분 → sonication 10분 (3회 반복) 후 vortex",
      "15,000 RPM, 4℃, 10 min centrifuge",
      "Centrifuge 후 상층액 1~1.5 mL를 회수하고 얼음 위에서 보관하며 가능한 한 즉시 분석. 장기 보관이 필요하면 소분하여 −80℃ 보관하고 반복 동결·해동 금지",
      <span key="cat1">Sample: 반응 혼합물 197 μL + 상층액 3 μL 혼합</span>,
      "H₂O₂ control: 상층액 대신 PBS 3 μL를 넣어 같은 조건에서 slope 측정",
      "96-well에 200 μL 분주 후 240 nm에서 10초마다 10분간 흡광도 측정"
    ],
    reagents: [
      "50 mM PBS (pH 7.0): 100 mL 증류수에 0.68 g KH₂PO₄ + 0.87 g K₂HPO₄ 용해",
      "3% H₂O₂: 30% H₂O₂ 1 mL + 증류수 9 mL",
      "반응 혼합물: 3% H₂O₂ 3.4 μL + 50 mM PBS 193.6 μL"
    ],
    storage_conditions: [
      "효소 추출액: 얼음 위에서 유지하고 즉시 분석. 장기 보관 시 소분하여 −80℃ 보관, 반복 동결·해동 금지",
      "H₂O₂: 냉장보관 (4℃), 갈색병 또는 호일 보관 권장, 공기 노출 최소화",
      "PBS 완충액: 냉장보관 (4℃) (제조 후) - 오염 주의"
    ],
    formulas: [
      <span key="cat2">ΔA<sub>corr</sub>/min = slope<sub>H₂O₂ control</sub> − slope<sub>sample</sub></span>,
      <span key="cat3">CAT activity (μmol/min/mg DW) = ΔA<sub>corr</sub>/min × 152.9 / l × DF</span>
    ],
    unit: "μmol/min/mg DW",
    icon: <FlaskConical className="h-4 w-4 sm:h-5 sm:w-5" />,
    references: [{ citation: "Aebi H. (1984).", doi: "10.1016/S0076-6879(84)05016-3" }]
  },
  pod: {
    title: "퍼옥시다아제 활성",
    subtitle: "Peroxidase (POD) Activity",
    wavelengths: ["470"],
    protocol: [
      "2 mL 튜브에 시료 20 mg + 50 mM PBS (pH 7.0) 2 mL 순서대로 혼합 후 vortex",
      "액체질소 5분 → sonication 10분 (3회 반복) 후 vortex",
      "15,000 RPM, 4℃, 10 min centrifuge",
      "Centrifuge 후 상층액 1~1.5 mL를 회수하고 얼음 위에서 보관하며 가능한 한 즉시 분석. 장기 보관이 필요하면 소분하여 −80℃ 보관하고 반복 동결·해동 금지",
      <span key="pod1">반응 혼합물 + 상층액 20 μL 혼합</span>,
      "Blank는 상층액 대신 PBS를 넣은 반응 혼합물로 준비",
      "96-well에 200 μL 분주 후 470 nm에서 10초마다 흡광도 측정하고 sample slope − blank slope로 보정"
    ],
    reagents: [
      "50 mM PBS (pH 7.0): 100 mL 증류수에 0.68 g KH₂PO₄ + 0.87 g K₂HPO₄ 용해",
      "40 mM Phosphate buffer: 100 mL 증류수에 0.54 g KH₂PO₄ + 0.70 g K₂HPO₄ 용해",
      "20 mM Guaiacol: 100 mL 증류수에 248 mg guaiacol (20 mM) 용해",
      "3% H₂O₂: 30% H₂O₂ 1 mL + 증류수 9 mL",
      "반응 혼합물: 40 mM phosphate buffer 66.6 μL + 20 mM guaiacol 80 μL + 3% H₂O₂ 33.3 μL"
    ],
    storage_conditions: [
      "효소 추출액: 얼음 위에서 유지하고 즉시 분석. 장기 보관 시 소분하여 −80℃ 보관, 반복 동결·해동 금지",
      "H₂O₂: 냉장보관 (4℃), 갈색병 또는 호일 보관 권장, 공기 노출 최소화",
      "Guaiacol: 실온 보관 가능 (장기 보관 시 냉장), 휘발성 강하므로 밀폐",
      "PBS 완충액(pH 7.0): 냉장보관 (4℃) (제조 후) - 오염 주의"
    ],
    formulas: [
      <span key="pod2">ΔA<sub>corr</sub>/min = slope<sub>sample</sub> − slope<sub>blank</sub></span>,
      <span key="pod3">POD activity (μmol/min/mg DW) = ΔA<sub>corr</sub>/min × 0.0376 / l × DF</span>,
      "ε = 26.6 mM⁻¹ cm⁻¹ 기준이므로 ×1000을 넣지 않음"
    ],
    unit: "μmol/min/mg DW",
    icon: <Beaker className="h-4 w-4 sm:h-5 sm:w-5" />,
    references: [{ citation: "Rao, M.V. et al. (1996).", doi: "10.1104/pp.110.1.125" }]
  },
  sod: {
    title: "슈퍼옥사이드 디스뮤타아제",
    subtitle: "Superoxide Dismutase (SOD) Activity",
    wavelengths: ["560"],
    protocol: [
      "2 mL 튜브에 시료 20 mg + 50 mM PBS (pH 7.0) 2 mL 순서대로 혼합 후 vortex",
      "액체질소 5분 → sonication 10분 (3회 반복) 후 vortex",
      "15,000 RPM, 4℃, 10 min centrifuge",
      "Centrifuge 후 상층액 1~1.5 mL를 회수하고 얼음 위에서 보관하며 가능한 한 즉시 분석. 장기 보관이 필요하면 소분하여 −80℃ 보관하고 반복 동결·해동 금지",
      "Sample: 시료 상층액 20 μL + SOD 반응혼합물 180 μL",
      "Light control: PBS 20 μL + SOD 반응혼합물 180 μL, LED 노출",
      "Dark blank: PBS 20 μL + SOD 반응혼합물 180 μL, 암조건",
      "Sample dark blank: 선택 사항, 시료 상층액 20 μL + 반응혼합물 180 μL, 암조건",
      <span key="sod1">PPFD 50 μmol m<sup>-2</sup>s<sup>-1</sup>의 LED 광에 15분간 노출시킨 후 빛을 차단</span>,
      "96-well에 200 μL 분주 후 560 nm에서 흡광도 측정"
    ],
    reagents: [
      "50 mM PBS (pH 7.0): 100 mL 증류수에 0.68 g KH₂PO₄ + 0.87 g K₂HPO₄ 용해",
      "0.1 M Methionine: 100 mL 증류수에 1.49 g methionine 용해",
      "2.5 mM NBT: 100 mL 증류수에 205 mg nitro blue tetrazolium 용해",
      "10 mM EDTA: 100 mL 증류수에 372 mg EDTA 용해",
      "0.5 mM Riboflavin: 100 mL 증류수에 18.8 mg riboflavin 용해",
      "반응 혼합물: 50mM pH 7.0 Sodium phosphate (93.5 μL) + 0.1M methionine (52 μL), 2.5 mM NBT (24.5 μL) + 10mM EDTA (2μL), 0.5mM riboflavin (8μL)"
    ],
    storage_conditions: [
      "효소 추출액: 얼음 위에서 유지하고 즉시 분석. 장기 보관 시 소분하여 −80℃ 보관, 반복 동결·해동 금지",
      "Riboflavin: 냉장보관 (4℃), 갈색병 또는 호일 보관 권장, 광분해 민감, 즉시 사용 권장",
      "NBT: 냉장보관 (4℃), 갈색병 또는 호일 보관 권장, 암조건 유지",
      "Methionine: 냉장보관 (4℃), 갈색병 또는 호일 보관 권장",
      "EDTA, PBS 완충액(pH 7.0): 냉장보관 (4℃) - 오염 주의"
    ],
    formulas: [
      "Controlcorr = Light control − Dark blank",
      "Samplecorr = Sample − Sample dark blank 또는 Dark blank",
      "SOD inhibition (%) = ((Controlcorr − Samplecorr) / Controlcorr) × 100",
      "SOD activity (unit/mg DW) = inhibition × 0.02 × DF"
    ],
    unit: "unit/mg DW",
    icon: <Microscope className="h-4 w-4 sm:h-5 sm:w-5" />,
    references: [{ citation: "Gupta, A.S. et al. (1993).", doi: "10.1104/pp.103.4.1067" }]
  },
  h2o2: {
    title: "과산화수소 함량",
    subtitle: "Hydrogen Peroxide Content",
    wavelengths: ["390"],
    protocol: [
      "2 mL 튜브에 시료 20 mg + 0.1% TCA 2 mL 혼합 후 vortex",
      "액체질소 5분 → sonication 10분 (3회 반복) 후 vortex",
      "15,000 RPM, 4℃, 10 min centrifuge",
      "상층액 1~1.5 mL를 회수하고 차광·냉장(4℃) 상태에서 가능한 한 당일 반응. 장기 보관 시 −20℃ 소분 보관",
      "96-well에 시료 50 μL 또는 H₂O₂ 표준곡선 50 μL + 10 mM Potassium phosphate buffer 50 μL + 1 M KI 100 μL 혼합",
      "암실에서 1시간 반응 후 390 nm에서 측정"
    ],
    reagents: [
      "0.1% TCA: 100 mL 증류수에 100 mg trichloroacetic acid 용해",
      "10 mM Potassium phosphate buffer (pH 7.0): 100 mL 증류수에 136 mg KH₂PO₄ + 174 mg K₂HPO₄ 용해",
      "1 M KI: 100 mL 증류수에 16.6 g potassium iodide 용해",
      "1 mM H₂O₂ Stock: 35% H₂O₂ 원액 5.1 μL + 0.1% TCA 49.995 mL(49,995 μL)"
    ],
    standard_curve_config: {
      title: "1 mM H₂O₂ 표준곡선 계산기",
      stock_name: "1 mM Stock",
      solvent_name: "0.1% TCA",
      stock_conc: 1.0,
      unit: "mM",
      default_total_vol: 2.0,
      default_concs: [0, 0.05, 0.10, 0.20, 0.40, 0.60, 0.80, 1.00]
    },
    storage_conditions: [
      "TCA 추출액: 4℃ 차광 보관 후 당일 반응 권장, 장기 보관 시 −20℃ 소분",
      "H₂O₂: 갈색병 또는 호일 보관 권장, 공기 노출 최소화",
      "KI: 냉장보관 (4℃)",
      "TCA, PBS 등 완충액: 냉장보관 (4℃) (제조 후) - 오염 주의"
    ],
    formulas: [
      <span key="h1">H<sub>2</sub>O<sub>2</sub> standard curve 사용하여 함량 계산</span>,
      "농도(mM) = (흡광도 - b) / a",
      "μmol/g DW = (농도(mM) × 2 mL) / 0.02 g",
      "μmol/g FW = μmol/g DW × (0.02 g / 측정한 FW g)"
    ],
    unit: "μmol/g DW",
    icon: <Calculator className="h-4 w-4 sm:h-5 sm:w-5" />,
    references: [{ citation: "Alexieva, V. et al. (2001).", doi: "10.1046/j.1365-3040.2001.00778.x" }],
    writing_guide: {
      title: "논문 작성 가이드 (Methods)",
      content: [
        { type: "intro", text: "Materials and Methods의 H₂O₂ determination 섹션 예시:" },
        { type: "option", text: `"Hydrogen peroxide (H₂O₂) content was determined according to the method of Velikova et al. (2000), with minor modifications for microplate analysis as described by Junglee et al. (2014)."`, note: "(해석: Velikova 등의 방법을 따르되, Junglee 등이 기술한 마이크로플레이트 분석법으로 변형하여 측정하였다.)" }
      ]
    }
  }
};
// --- [Component] Standard Curve Generator ---
const StandardCurveGenerator = ({ config }) => {
  const [inputStr, setInputStr] = useState("");
  const [totalVol, setTotalVol] = useState(1);

  useEffect(() => {
    if (config) {
      setInputStr(config.default_concs.join(", "));
      setTotalVol(config.default_total_vol || 1.0);
    }
  }, [config]);

  const { tableData, chartData, isValid, errorMessage } = useMemo(() => {
    if (!config) return { tableData: [], chartData: [], isValid: false, errorMessage: null };

    try {
      const concs = inputStr
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s !== "")
        .map((s) => parseFloat(s));

      const parsedTotalVol = parseFloat(totalVol);

      if (concs.some(isNaN)) return { isValid: false, errorMessage: "농도는 숫자만 입력해주세요.", tableData: [], chartData: [] };
      if (isNaN(parsedTotalVol) || parsedTotalVol <= 0) return { isValid: false, errorMessage: "총 부피는 0보다 커야 합니다.", tableData: [], chartData: [] };

      const uniqueConcs = Array.from(new Set(concs)).sort((a, b) => a - b);

      if (uniqueConcs.some((c) => c > config.stock_conc)) {
        return {
          isValid: false,
          errorMessage: `농도는 Stock 농도(${config.stock_conc} ${config.unit})보다 클 수 없습니다.`,
          tableData: [],
          chartData: [],
        };
      }

      const rows = uniqueConcs.map((targetConc) => {
        const stockVol = (targetConc * parsedTotalVol * 1000) / config.stock_conc; // μL
        const solventVol = (parsedTotalVol * 1000) - stockVol; // μL
        return {
          conc: targetConc,
          stockVol: Math.round(stockVol * 10) / 10,
          solventVol: Math.round(solventVol * 10) / 10,
          totalVol: parsedTotalVol,
        };
      });

      return { tableData: rows, chartData: rows, isValid: true, errorMessage: null };
    } catch (e) {
      return { isValid: false, errorMessage: "입력 형식을 확인해주세요.", tableData: [], chartData: [] };
    }
  }, [inputStr, totalVol, config]);

  return (
    <div className="bg-black/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/5 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
        <h3 className="text-white font-semibold flex items-center space-x-2 text-sm sm:text-base">
          <TrendingUp className="h-4 w-4 text-blue-400" />
          <span>{config.title}</span>
        </h3>
      </div>

      {/* ✅ 레이아웃: 상단(그래프/표 50:50) + 하단(입력 2개) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* LEFT: 그래프 */}
        <div className="bg-black/40 p-3 sm:p-4 rounded-xl border border-white/10 shadow-inner h-80 sm:h-96 flex flex-col">
          <span className="text-l font-bold text-white-400 mb-2 block w-full text-center border-b border-white/5 pb-2">
            시약 투입량 분포
          </span>

          <div className="flex-1 w-full overflow-hidden rounded-lg">
            <SimpleLineChart
              data={chartData}
              xKey="conc"
              yKey="stockVol"
              xLabel={`농도 (${config.unit})`}
              yLabel="Stock (μL)"
              color="#60a5fa"
              width={560}
              height={360}
            />
          </div>
        </div>

        {/* RIGHT: 표 (그래프와 같은 높이) */}
        {/* RIGHT: 표 (스크롤 없음 + 행 높이 자동 분배로 박스 꽉 채움) */}
<div className="bg-black/20 rounded-xl border border-white/10 shadow-sm h-80 sm:h-96 overflow-hidden flex flex-col">

  {/* 헤더 */}
  <div className="grid grid-cols-[22%_26%_32%_20%] text-sm text-center bg-slate-70 border-b border-white/15">
    <div className="py-3 px-1 font-bold text-gray-200">목표 농도</div>
    <div className="py-3 px-1 font-bold text-blue-300">{config.stock_name} (μL)</div>
    <div className="py-3 px-1 font-bold text-gray-200">{config.solvent_name} (μL)</div>
    <div className="py-3 px-1 font-bold text-gray-200">총 부피 (mL)</div>
  </div>

  {/* 바디 */}
  {isValid && tableData.length > 0 ? (
    <div
      className="flex-1 grid gap-px bg-b"
      style={{ gridTemplateRows: `repeat(${tableData.length}, minmax(0, 1fr))` }}
    >
      {tableData.map((row, idx) => (
        <div
          key={idx}
          className="grid grid-cols-[22%_26%_32%_20%] items-center text-sm text-center bg-black/10 hover:bg-white/5 transition-colors"
        >
          <div className="h-full flex items-center justify-center px-2 bg-white/5 font-semibold text-white">
            {row.conc}
          </div>

          <div className="h-full flex items-center justify-center px-2 bg-blue-500/10 text-blue-300 font-extrabold">
            {row.stockVol}
          </div>

          <div className="h-full flex items-center justify-center px-2 text-gray-200/90">
            {row.solventVol}
          </div>

          <div className="h-full flex items-center justify-center px-2 text-gray-200/90">
            {row.totalVol}
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="flex-1 flex flex-col items-center justify-center text-gray-500 space-y-2">
      <Calculator className="h-8 w-8 opacity-20" />
      <span>계산 결과가 여기에 표시됩니다.</span>
    </div>
  )}
</div>


        {/* ✅ 입력 2개: 아래로 내려서 전체폭 사용 */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-300 mb-1.5 flex items-center space-x-1">
              <Settings2 className="h-3.5 w-3.5" />
              <span>만들고자 하는 총 부피 (mL)</span>
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={totalVol}
                onChange={(e) => setTotalVol(e.target.value)}
                className="bg-black/30 border border-white/10 text-white rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 w-full [color-scheme:dark]"
                placeholder="예: 1.0"
              />
              <span className="text-sm text-gray-400 whitespace-nowrap">mL</span>
            </div>
            <p className="text-[11px] text-white-500 mt-1">* 2mL 튜브 사용 시 2.0 입력 권장</p>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-300 mb-1.5 block">
              목표 농도 입력 ({config.unit})
            </label>
            <div className="flex space-x-2">
              <input
                value={inputStr}
                onChange={(e) => setInputStr(e.target.value)}
                className="bg-black/30 border border-white/10 text-white rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 w-full"
                placeholder="예: 0, 20, 40"
              />
              <button
                onClick={() => {
                  setInputStr(config.default_concs.join(", "));
                  setTotalVol(config.default_total_vol || 1.0);
                }}
                title="초기화"
                className="p-2 border border-white/10 rounded-lg hover:bg-white/5 text-blue-400 shrink-0 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
            {errorMessage && <p className="text-red-400 text-xs mt-1 font-medium">{errorMessage}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};



// --- [Main Page Component] ---
export default function Analysis() {
  const [selectedAnalysis, setSelectedAnalysis] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const selected = params.get("selected");
    if (selected) setSelectedAnalysis(selected);
  }, [location.search]);

  const handleAnalyzeClick = () => {
    if (selectedAnalysis) {
      navigate(createPageUrl("Results") + `?analysis_type=${selectedAnalysis}`);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-900 text-gray-100 font-sans">
      {/* ✅ Background Layer (로컬 이미지) */}
      <div className="absolute inset-0 z-0 w-full h-full pointer-events-none">
        <img
          src={img("spectrophotometer.jpg")}
          alt="Background"
          className="w-full h-full object-cover opacity-20"
        />
      </div>

      {/* ✅ Fixed Padding for Header Offset */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-12 space-y-6 sm:space-y-8">

        {/* Back Navigation */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/')}
          className="flex items-center text-gray-400 hover:text-white transition-colors group mb-4"
        >
          <div className="p-2 rounded-full bg-white/5 border border-white/10 group-hover:bg-white/10 mr-3">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium">메인으로 돌아가기</span>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 sm:mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 drop-shadow-lg">분석 프로토콜 선택</h1>
          <p className="text-sm sm:text-base text-gray-300">수행할 생화학 분석 항목을 선택하세요.</p>
        </motion.div>

        {/* Protocol Selection Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {Object.entries(analysisProtocols).map(([key, protocol]) => (
            <button
              key={key}
              onClick={() => setSelectedAnalysis(key)}
              className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border transition-all duration-300 text-left relative overflow-hidden group ${
                selectedAnalysis === key
                  ? 'bg-blue-600/20 border-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.3)]'
                  : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center space-x-2 mb-2 relative z-10">
                <div className={`w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg ${
                  selectedAnalysis === key ? 'text-blue-300 bg-blue-500/20' : 'text-gray-400 bg-white/5'
                }`}>
                  {protocol.icon}
                </div>
                <span className={`font-bold text-sm sm:text-base leading-tight ${
                  selectedAnalysis === key ? 'text-white' : 'text-gray-300 group-hover:text-white'
                }`}>
                  {protocol.title}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 group-hover:text-gray-400 transition-colors leading-relaxed">
                {protocol.subtitle}
              </p>
              {selectedAnalysis === key && (
                <div className="absolute inset-0 bg-blue-500/5 z-0 animate-pulse"></div>
              )}
            </button>
          ))}
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
              {/* Absorbance Reliability Guide (Specific to Chlorophyll) */}
              {selectedAnalysis === 'chlorophyll_a_b' && (
                <GlassCard className="border-l-4 border-l-blue-500 mb-6">
                  <div className="p-4 sm:p-6 pb-3">
                    <h3 className="text-white text-lg sm:text-xl font-bold flex items-center space-x-2 mb-1">
                      <Info className="h-5 w-5 text-blue-400" />
                      <span>흡광도 측정 신뢰성 가이드</span>
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">측정값의 정확성을 위해 아래 범위를 참고하세요.</p>

                    <div className="overflow-x-auto rounded-lg border border-white/10">
                      <table className="w-full text-sm border-collapse text-left">
                        <thead>
                          <tr className="bg-white/10 text-gray-200">
                            <th className="py-3 px-4 font-bold">범위 (AU)</th>
                            <th className="py-3 px-4 font-bold">신뢰성</th>
                            <th className="py-3 px-4 font-bold">비고</th>
                          </tr>
                        </thead>
                        <tbody className="text-gray-300">
                          <tr className="border-b border-white/5 bg-green-500/10">
                            <td className="py-3 px-4 font-mono font-semibold text-white">0.1 ~ 0.5</td>
                            <td className="py-3 px-4"><span className="px-3 py-1 rounded-full bg-green-500/20 text-green-300 text-xs font-semibold">가장 이상적</span></td>
                            <td className="py-3 px-4">정밀도 매우 높음</td>
                          </tr>
                          <tr className="border-b border-white/5 bg-blue-500/10">
                            <td className="py-3 px-4 font-mono font-semibold text-white">0.5 ~ 1.0</td>
                            <td className="py-3 px-4"><span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold">좋음</span></td>
                            <td className="py-3 px-4">대부분 조건에서 타당</td>
                          </tr>
                          <tr className="border-b border-white/5 bg-yellow-500/10">
                            <td className="py-3 px-4 font-mono font-semibold text-white">1.0 ~ 1.5</td>
                            <td className="py-3 px-4"><span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-300 text-xs font-semibold">허용 가능</span></td>
                            <td className="py-3 px-4">Calibration curve 유지 시 참고 가능</td>
                          </tr>
                          <tr className="bg-red-500/10">
                            <td className="py-3 px-4 font-mono font-bold text-white">&gt; 2.0</td>
                            <td className="py-3 px-4"><span className="px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-semibold">비추천</span></td>
                            <td className="py-3 px-4">희석 필요 (오차 급증)</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </GlassCard>
              )}

              <GlassCard>
                <div className="p-4 sm:p-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500/20 rounded-xl sm:rounded-2xl flex items-center justify-center border border-blue-500/30 flex-shrink-0">
                      {React.cloneElement(analysisProtocols[selectedAnalysis].icon, { className: "h-6 w-6 text-blue-300" })}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="text-lg sm:text-xl font-bold text-white leading-tight">{analysisProtocols[selectedAnalysis].title}</h2>
                      <p className="text-gray-400 text-sm sm:text-base mt-1 leading-relaxed">{analysisProtocols[selectedAnalysis].subtitle}</p>
                    </div>
                  </div>

                  <button
                    onClick={handleAnalyzeClick}
                    className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white h-10 sm:h-12 px-6 rounded-xl transition-all shadow-lg shadow-blue-900/20 font-semibold w-full sm:w-auto text-sm sm:text-base"
                  >
                    <span>분석하기</span>
                    <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>

                <div className="p-4 sm:p-6 pt-0 sm:pt-0 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mt-4 sm:mt-6">
                  {/* Left Column */}
                  <div className="space-y-4 sm:space-y-6">
                    {/* Protocol */}
                    <div className="bg-white/5 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/10">
                      <h3 className="text-white font-semibold mb-4 flex items-center space-x-2 text-sm sm:text-base">
                        <TestTube className="h-4 w-4 text-gray-400" />
                        <span>실험 프로토콜</span>
                      </h3>
                      <ol className="space-y-3">
                        {analysisProtocols[selectedAnalysis].protocol.map((step, index) => (
                          <li key={index} className="flex items-start space-x-3">
                            <span className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-blue-500/20 text-blue-300 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold border border-blue-500/30">
                              {index + 1}
                            </span>
                            <span className="text-gray-300 text-xs sm:text-sm leading-relaxed">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Formulas */}
                    <div className="bg-white/5 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/10">
                      <h3 className="text-white font-semibold mb-4 flex items-center space-x-2 text-sm sm:text-base">
                        <Calculator className="h-4 w-4 text-gray-400" />
                        <span>계산 공식</span>
                      </h3>
                      <div className="space-y-3 sm:space-y-4">
                        {analysisProtocols[selectedAnalysis].formulas.map((formula, index) => (
                          <div key={index} className="p-3 sm:p-4 bg-black/20 rounded-lg sm:rounded-xl border border-white/5 text-gray-200 font-mono text-xs sm:text-sm leading-relaxed break-all">
                            {formula}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Wavelengths */}
                    <div className="bg-white/5 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/10">
                      <h3 className="text-white font-semibold mb-4 flex items-center space-x-2 text-sm sm:text-base">
                        <Microscope className="h-4 w-4 text-gray-400" />
                        <span>측정 파장</span>
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {analysisProtocols[selectedAnalysis].wavelengths.map((wavelength) => (
                          <GlassBadge key={wavelength} className="bg-blue-600 hover:bg-blue-500 text-white border-blue-500/30 text-xs sm:text-sm px-2.5 py-0.5">
                            {wavelength} nm
                          </GlassBadge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4 sm:space-y-6">
                    {/* Reagents */}
                    {analysisProtocols[selectedAnalysis].reagents && (
                      <div className="bg-white/5 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/10">
                        <h3 className="text-white font-semibold mb-4 flex items-center space-x-2 text-sm sm:text-base">
                          <Beaker className="h-4 w-4 text-gray-400" />
                          <span>시약 제조법</span>
                        </h3>
                        <div className="space-y-3">
                          {analysisProtocols[selectedAnalysis].reagents.map((reagent, index) => (
                            <div
                              key={index}
                              className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border ${
                                typeof reagent === 'string' && reagent.startsWith('반응 혼합물')
                                  ? 'bg-red-500/10 border-red-500/20 text-red-200'
                                  : 'bg-blue-500/10 border-blue-500/20 text-blue-200'
                              }`}
                            >
                              <div className="text-xs sm:text-sm leading-relaxed">
                                {typeof reagent === 'string' ? (
                                  <>
                                    <strong className="text-white/90">{reagent.split(':')[0]}:</strong> {reagent.split(':').slice(1).join(':')}
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

                    {/* Storage Conditions */}
                    {analysisProtocols[selectedAnalysis].storage_conditions && (
                      <div className="bg-white/5 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/10">
                        <h3 className="text-white font-semibold mb-4 flex items-center space-x-2 text-sm sm:text-base">
                          <Info className="h-4 w-4 text-yellow-400" />
                          <span>시약별 보관조건 주의</span>
                        </h3>
                        <div className="space-y-3">
                          {analysisProtocols[selectedAnalysis].storage_conditions.map((condition, index) => (
                            <div key={index} className="p-3 sm:p-4 bg-yellow-500/10 rounded-lg sm:rounded-xl border border-yellow-500/20 text-yellow-100 text-xs sm:text-sm leading-relaxed">
                              <strong>{condition.split(':')[0]}:</strong> {condition.split(':').slice(1).join(':')}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Standard Curve Generator */}
                  {analysisProtocols[selectedAnalysis].standard_curve_config && (
                    <div className="lg:col-span-2 mt-2">
                      <StandardCurveGenerator config={analysisProtocols[selectedAnalysis].standard_curve_config} />
                    </div>
                  )}

                  {/* Writing Guide */}
                  {analysisProtocols[selectedAnalysis].writing_guide && (
                    <div className="lg:col-span-2 mt-6 sm:mt-8 bg-indigo-500/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-indigo-500/20">
                      <h3 className="text-white font-semibold mb-4 flex items-center space-x-2 text-sm sm:text-base">
                        <PenTool className="h-4 w-4 text-indigo-400" />
                        <span>{analysisProtocols[selectedAnalysis].writing_guide.title}</span>
                      </h3>
                      <div className="space-y-4">
                        {analysisProtocols[selectedAnalysis].writing_guide.content.map((item, index) => (
                          <div key={index}>
                            {item.type === 'intro' ? (
                              <p className="text-indigo-200 text-sm font-medium mb-2">
                                {item.text}
                              </p>
                            ) : (
                              <div className="bg-black/30 p-4 rounded-xl border border-indigo-500/30">
                                {item.label && (
                                  <span className="inline-block px-2 py-1 bg-indigo-500/30 text-indigo-200 text-xs font-bold rounded mb-2">
                                    {item.label}
                                  </span>
                                )}
                                <p className="text-white text-sm font-medium mb-2 leading-relaxed italic">
                                  {item.text}
                                </p>
                                {item.note && (
                                  <p className="text-gray-500 text-xs">
                                    {item.note}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* References */}
                  {analysisProtocols[selectedAnalysis].references && (
                    <div className="lg:col-span-2 mt-6 sm:mt-8 bg-white/5 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/10">
                      <h3 className="text-white font-semibold mb-4 flex items-center space-x-2 text-sm sm:text-base">
                        <BookOpen className="h-4 w-4 text-gray-400" />
                        <span>참고문헌</span>
                      </h3>
                      <div className="space-y-4">
                        {analysisProtocols[selectedAnalysis].references.map((ref, index) => (
                          <div key={index} className="p-3 sm:p-4 bg-black/20 rounded-lg sm:rounded-xl border border-white/5">
                            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-2">
                              {ref.citation}
                            </p>
                            {ref.doi && (
                              <a
                                href={`https://doi.org/${ref.doi}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center space-x-1 text-blue-400 hover:text-blue-300 text-xs font-medium transition-colors"
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
