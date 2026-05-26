export const HPLC_PROTOCOLS = {
  phenol: {
    group: "general",
    ko: {
      title: "페놀 화합물",
      subtitle: "Phenolic compounds",
      badge: "DAD/UV",
      overview: "식물 추출물 내 주요 phenolic acids와 flavonoids를 HPLC 피크 면적과 표준곡선으로 정량합니다.",
      matrix: "건조 분말 또는 동결건조 분말",
      compounds: [
        "Arbutin", "Gallic acid", "Catechin hydrate", "4-Hydroxybenzoic acid",
        "Chlorogenic acid", "Caffeic acid", "(-)-Epicatechin", "4-Hydroxy-3-benzoic acid",
        "p-Coumaric acid", "trans-Ferulic acid", "Benzoic acid", "Rutin",
        "trans-Cinnamic acid", "Quercetin", "Kaempferol"
      ],
      samplePrep: [
        "시료는 동결건조 또는 저온 열풍건조 후 균질하게 분쇄하고, 흡습을 피해서 보관합니다.",
        "분말 시료 0.1 g에 80% MeOH 또는 90% MeOH 10 mL를 넣고 vortex합니다.",
        "초음파 추출 30~60분 후 15,000 rpm, 4℃, 10분 원심분리합니다.",
        "상층액을 0.22 또는 0.45 μm PTFE/PVDF membrane filter로 여과 후 HPLC vial에 옮깁니다."
      ],
      chromatographic: [
        "Column: C18 reverse-phase column, 4.6 × 250 mm, 5 μm 또는 동등품",
        "Mobile phase: A = water + 0.1% formic acid, B = acetonitrile 또는 methanol",
        "Flow rate: 0.8~1.0 mL/min, injection volume: 10~20 μL, column temperature: 30℃ 권장",
        "Detection: 280 nm 중심, hydroxycinnamic acid류는 320~330 nm 보조 확인 가능"
      ],
      calculation: [
        "각 표준품으로 Area = a × C + b 표준곡선을 작성합니다.",
        "C(μg/mL) = (Area − b) / a",
        "Content(mg/g DW) = C × 추출부피(mL) × DF / 시료무게(g) / 1000"
      ],
      storage: [
        "건조 분말은 밀봉·차광·방습 조건에서 −20℃ 또는 4℃ 단기 보관합니다.",
        "MeOH 추출액은 amber vial에서 4℃ 보관하고 가능하면 24~48시간 내 분석합니다.",
        "표준용액은 갈색 vial에 소분하여 −20℃ 보관하고 반복 동결융해를 피합니다."
      ],
      notes: [
        "피크 동정은 RT만으로 확정하지 말고 표준품 spiking 또는 PDA spectrum을 함께 확인하는 것이 안전합니다.",
        "표준곡선 절편 b가 0이어도 계산 가능해야 하며, a는 반드시 양수여야 합니다."
      ]
    },
    en: {
      title: "Phenolic Compounds",
      subtitle: "Phenolic compounds",
      badge: "DAD/UV",
      overview: "Quantifies major phenolic acids and flavonoids in plant extracts using HPLC peak areas and calibration curves.",
      matrix: "Dry or freeze-dried plant powder",
      compounds: [
        "Arbutin", "Gallic acid", "Catechin hydrate", "4-Hydroxybenzoic acid",
        "Chlorogenic acid", "Caffeic acid", "(-)-Epicatechin", "4-Hydroxy-3-benzoic acid",
        "p-Coumaric acid", "trans-Ferulic acid", "Benzoic acid", "Rutin",
        "trans-Cinnamic acid", "Quercetin", "Kaempferol"
      ],
      samplePrep: [
        "Dry or freeze-dry the plant material, grind it uniformly, and keep it protected from moisture.",
        "Add 10 mL of 80% or 90% MeOH to 0.1 g of powder and vortex.",
        "Sonicate for 30–60 min, then centrifuge at 15,000 rpm, 4℃, for 10 min.",
        "Filter the supernatant through a 0.22 or 0.45 μm PTFE/PVDF membrane into an HPLC vial."
      ],
      chromatographic: [
        "Column: C18 reversed-phase column, 4.6 × 250 mm, 5 μm or equivalent",
        "Mobile phase: A = water + 0.1% formic acid, B = acetonitrile or methanol",
        "Flow rate: 0.8–1.0 mL/min; injection volume: 10–20 μL; column temperature: around 30℃",
        "Detection: mainly 280 nm; hydroxycinnamic acids can also be checked at 320–330 nm"
      ],
      calculation: [
        "Prepare a calibration curve for each standard: Area = a × C + b.",
        "C(μg/mL) = (Area − b) / a",
        "Content(mg/g DW) = C × extraction volume(mL) × DF / sample weight(g) / 1000"
      ],
      storage: [
        "Store dried powder sealed, protected from light and moisture, at −20℃ or short-term at 4℃.",
        "Keep MeOH extracts in amber vials at 4℃ and analyze within 24–48 h when possible.",
        "Aliquot standards in amber vials at −20℃ and avoid repeated freeze-thaw cycles."
      ],
      notes: [
        "Do not identify peaks by RT alone; confirm using standard spiking or PDA spectra when possible.",
        "The intercept b may be zero; the slope a must be positive."
      ]
    }
  },
  glucosinolate: {
    group: "general",
    ko: {
      title: "글루코시놀레이트",
      subtitle: "Glucosinolates",
      badge: "HPLC-UV",
      overview: "십자화과 시료의 desulfo-glucosinolate 또는 총 glucosinolate 계열 피크를 정량합니다.",
      matrix: "동결건조 또는 열풍건조 분말",
      compounds: [
        "Progoitrin", "Sinigrin", "Glucoalyssin", "Gluconapoleiferin",
        "Gluconapin", "4-Hydroxyglucobrassicin", "Glucobrassicanapin", "Glucoerucin",
        "Glucobrassicin", "4-Methoxyglucobrassicin", "Gluconasturtiin", "Neoglucobrassicin"
      ],
      samplePrep: [
        "시료는 건조 후 곱게 분쇄하고 myrosinase 활성을 줄이기 위해 추출 전까지 냉동·건조 상태로 보관합니다.",
        "분말 시료를 70% MeOH로 고온 추출하여 내인성 myrosinase를 불활성화합니다.",
        "원심분리 후 상층액을 정제 컬럼에 통과시키고 필요 시 sulfatase 처리 후 여과합니다."
      ],
      chromatographic: [
        "Column: C18 reverse-phase column",
        "Mobile phase: water/acetonitrile gradient",
        "Detection: 229 nm 중심",
        "각 glucosinolate는 표준품 또는 response factor로 보정합니다."
      ],
      calculation: [
        "표준품 또는 response factor 기반 계산식을 사용합니다.",
        "앱의 HPLC 계산기는 RT matching과 peak area 정리를 지원하며, 최종 함량식은 실험실 표준식에 맞춰 입력값을 조정하세요."
      ],
      storage: [
        "건조 분말은 −20℃, 방습 조건에서 보관합니다.",
        "추출액은 4℃ 차광 보관하고 장기 보관은 피합니다."
      ],
      notes: ["myrosinase 불활성화가 늦으면 glucosinolate가 분해될 수 있습니다."]
    },
    en: {
      title: "Glucosinolates",
      subtitle: "Glucosinolates",
      badge: "HPLC-UV",
      overview: "Quantifies desulfo-glucosinolates or total glucosinolate peaks in Brassicaceae samples.",
      matrix: "Freeze-dried or oven-dried powder",
      compounds: [
        "Progoitrin", "Sinigrin", "Glucoalyssin", "Gluconapoleiferin",
        "Gluconapin", "4-Hydroxyglucobrassicin", "Glucobrassicanapin", "Glucoerucin",
        "Glucobrassicin", "4-Methoxyglucobrassicin", "Gluconasturtiin", "Neoglucobrassicin"
      ],
      samplePrep: [
        "Dry and grind the sample; keep it frozen and dry until extraction to minimize myrosinase activity.",
        "Extract powder with hot 70% MeOH to inactivate endogenous myrosinase.",
        "Centrifuge, purify the supernatant on a column, apply sulfatase if required, and filter before HPLC."
      ],
      chromatographic: [
        "Column: C18 reversed-phase column",
        "Mobile phase: water/acetonitrile gradient",
        "Detection: mainly 229 nm",
        "Correct individual glucosinolates using standards or response factors."
      ],
      calculation: [
        "Use standard-based or response-factor-based equations.",
        "The app supports RT matching and peak-area organization; adjust the final equation to your laboratory standard method."
      ],
      storage: [
        "Store dry powder at −20℃ under moisture-proof conditions.",
        "Keep extracts protected from light at 4℃ and avoid long storage."
      ],
      notes: ["Delayed myrosinase inactivation can degrade glucosinolates."]
    }
  },
  lamiaceae_markers: {
    group: "new",
    ko: {
      title: "로즈마린산·아카세틴·틸리아닌",
      subtitle: "Rosmarinic acid / Acacetin / Tilianin",
      badge: "HPLC-DAD",
      overview: "사용자가 제공한 분석법을 기준으로 80% MeOH 추출 후 C18-HPLC에서 로즈마린산, 아카세틴, 틸리아닌을 동시 정량합니다.",
      matrix: "세척 후 건조한 식물체 분말",
      compounds: ["Rosmarinic acid", "Acacetin", "Tilianin"],
      samplePrep: [
        "세척한 생시료는 50℃ 열풍건조기에서 충분히 건조한 뒤 균일하게 분쇄합니다.",
        "분말 시료 0.1 g에 80% MeOH 10 mL를 넣고 vortex합니다.",
        "초음파 추출을 약 60분 수행한 뒤 15,000 rpm, 4℃, 10분 원심분리합니다.",
        "상층액을 0.45 μm membrane filter로 여과하여 HPLC vial에 옮깁니다."
      ],
      chromatographic: [
        "Column: C18 column, 4.6 × 250 mm, 5 μm 또는 동등품",
        "Mobile phase: A = 0.1% formic acid in water, B = acetonitrile",
        "Gradient 예: B 10% 시작 → 15% → 35% → 70% 세척 → 10% 재평형",
        "Flow rate: 1.0 mL/min, injection volume: 10~20 μL, column temperature: 30℃",
        "Detection: 330 nm 권장; acacetin은 330~350 nm 범위에서 PDA spectrum 확인"
      ],
      calculation: [
        "각 표준품으로 Area = a × C + b 표준곡선을 작성합니다.",
        "C(μg/mL) = (Area − b) / a",
        "Content(mg/g DW) = C × 10 mL × DF / 0.1 g / 1000 = C × 0.1 × DF"
      ],
      storage: [
        "건조 분말은 차광·방습 상태로 −20℃ 보관합니다.",
        "80% MeOH 추출액은 갈색 vial에 담아 4℃에서 보관하고 가급적 당일 또는 48시간 내 분석합니다.",
        "로즈마린산·아카세틴·틸리아닌 표준용액은 MeOH에 조제 후 소분하여 −20℃ 차광 보관합니다."
      ],
      notes: [
        "열풍건조는 조건 차이에 따라 phenolic/flavone glycoside 함량에 영향을 줄 수 있으므로 모든 처리구에 동일하게 적용하세요.",
        "제공된 이미지 기준을 앱에 반영했으며, 실제 장비 컬럼/용매 조성에 맞춰 gradient는 미세 조정할 수 있습니다."
      ]
    },
    en: {
      title: "Rosmarinic Acid / Acacetin / Tilianin",
      subtitle: "Rosmarinic acid / Acacetin / Tilianin",
      badge: "HPLC-DAD",
      overview: "Based on the user-provided method: 80% MeOH extraction followed by C18-HPLC quantification of rosmarinic acid, acacetin, and tilianin.",
      matrix: "Washed and dried plant powder",
      compounds: ["Rosmarinic acid", "Acacetin", "Tilianin"],
      samplePrep: [
        "Dry washed fresh material thoroughly at 50℃, then grind it uniformly.",
        "Add 10 mL of 80% MeOH to 0.1 g of powder and vortex.",
        "Sonicate for about 60 min, then centrifuge at 15,000 rpm, 4℃, for 10 min.",
        "Filter the supernatant through a 0.45 μm membrane into an HPLC vial."
      ],
      chromatographic: [
        "Column: C18 column, 4.6 × 250 mm, 5 μm or equivalent",
        "Mobile phase: A = 0.1% formic acid in water, B = acetonitrile",
        "Example gradient: start at 10% B → 15% → 35% → 70% wash → 10% re-equilibration",
        "Flow rate: 1.0 mL/min; injection volume: 10–20 μL; column temperature: 30℃",
        "Detection: 330 nm recommended; confirm acacetin using the PDA spectrum around 330–350 nm"
      ],
      calculation: [
        "Prepare a calibration curve for each standard: Area = a × C + b.",
        "C(μg/mL) = (Area − b) / a",
        "Content(mg/g DW) = C × 10 mL × DF / 0.1 g / 1000 = C × 0.1 × DF"
      ],
      storage: [
        "Store dried powder at −20℃ protected from light and moisture.",
        "Keep 80% MeOH extracts in amber vials at 4℃ and analyze the same day or within 48 h when possible.",
        "Prepare standards in MeOH, aliquot them, and store at −20℃ protected from light."
      ],
      notes: [
        "Oven-drying conditions may affect phenolic and flavone glycoside contents; apply the same drying protocol to all treatments.",
        "The method from the supplied image was incorporated; minor gradient tuning may be needed for your exact column and system."
      ]
    }
  },
  artemisinin: {
    group: "new",
    ko: {
      title: "쑥 아르테미시닌",
      subtitle: "Artemisia artemisinin content",
      badge: "HPLC-UV",
      overview: "쑥/Artemisia 건조 분말에서 artemisinin을 추출하고, UV 검출을 위해 필요 시 유도체화 후 C18-HPLC로 정량합니다.",
      matrix: "쑥 또는 Artemisia spp. 건조 분말",
      compounds: ["Artemisinin"],
      samplePrep: [
        "시료는 저온 건조 또는 동결건조 후 균질하게 분쇄하고 차광·방습 상태로 보관합니다.",
        "분말 시료 0.1~0.5 g에 MeOH 또는 acetonitrile 10 mL를 넣고 30~60분 초음파 추출합니다.",
        "원심분리 후 상층액을 취하고, UV 260 nm 방법을 사용할 경우 알칼리 유도체화 과정을 동일하게 적용합니다.",
        "유도체화 예: 추출액 aliquot에 NaOH 용액을 넣어 45~50℃에서 반응시킨 후 acetic acid로 중화하고 0.45 μm filter로 여과합니다."
      ],
      chromatographic: [
        "Column: C18 column, 4.6 × 250 mm, 5 μm 또는 동등품",
        "Mobile phase: acetonitrile:water = 60:40(v/v) 등 isocratic 조건을 우선 검토",
        "Flow rate: 1.0 mL/min, injection volume: 20 μL, column temperature: 30℃",
        "Detection: 유도체화 UV 방법은 260 nm 사용; ELSD/CAD/MS 장비가 있으면 비유도체화 분석도 가능"
      ],
      calculation: [
        "Artemisinin 표준품으로 Area = a × C + b 표준곡선을 작성합니다.",
        "C(μg/mL) = (Area − b) / a",
        "Content(mg/g DW) = C × 추출부피(mL) × DF / 시료무게(g) / 1000"
      ],
      storage: [
        "건조 분말은 −20℃, 차광·방습 조건에서 보관합니다.",
        "Artemisinin 표준용액과 유도체화 시약은 갈색 vial에 소분하고 반복 동결융해를 피합니다.",
        "유도체화한 시료는 안정성이 제한될 수 있으므로 가능한 한 당일 분석합니다."
      ],
      notes: [
        "Artemisinin은 UV chromophore가 약하므로 UV 분석에서는 유도체화 여부와 반응시간을 표준품과 시료에 동일하게 적용해야 합니다.",
        "사용자가 제공한 쑥 HPLC 분석 항목을 새 분석 카드와 계산 항목에 추가했습니다."
      ]
    },
    en: {
      title: "Artemisia Artemisinin",
      subtitle: "Artemisia artemisinin content",
      badge: "HPLC-UV",
      overview: "Extracts artemisinin from dried Artemisia powder and quantifies it by C18-HPLC, with derivatization when using UV detection.",
      matrix: "Dried Artemisia spp. powder",
      compounds: ["Artemisinin"],
      samplePrep: [
        "Dry or freeze-dry the sample, grind uniformly, and store protected from light and moisture.",
        "Extract 0.1–0.5 g powder with 10 mL MeOH or acetonitrile by sonication for 30–60 min.",
        "Centrifuge and collect the supernatant; apply the same derivatization to standards and samples when using the 260 nm UV method.",
        "Example derivatization: react an aliquot with NaOH at 45–50℃, neutralize with acetic acid, and filter through a 0.45 μm membrane."
      ],
      chromatographic: [
        "Column: C18 column, 4.6 × 250 mm, 5 μm or equivalent",
        "Mobile phase: acetonitrile:water = 60:40(v/v) as an initial isocratic condition",
        "Flow rate: 1.0 mL/min; injection volume: 20 μL; column temperature: 30℃",
        "Detection: 260 nm for derivatized UV methods; ELSD/CAD/MS can be used for non-derivatized analysis"
      ],
      calculation: [
        "Prepare an artemisinin calibration curve: Area = a × C + b.",
        "C(μg/mL) = (Area − b) / a",
        "Content(mg/g DW) = C × extraction volume(mL) × DF / sample weight(g) / 1000"
      ],
      storage: [
        "Store dry powder at −20℃ protected from light and moisture.",
        "Aliquot artemisinin standards and derivatization reagents in amber vials; avoid repeated freeze-thaw cycles.",
        "Analyze derivatized samples on the same day when possible because derivative stability may be limited."
      ],
      notes: [
        "Artemisinin has weak native UV absorbance; use identical derivatization conditions for standards and samples in UV methods.",
        "The Artemisia HPLC item from the supplied images has been added as a new protocol and calculator option."
      ]
    }
  },
  cannabinoid: {
    group: "new",
    ko: {
      title: "대마 성분",
      subtitle: "Cannabinoid profiling",
      badge: "HPLC-DAD/LC-MS",
      overview: "허가된 시료에서 cannabinoids를 추출하여 CBD/CBDA/THC/THCA 등 주요 성분을 HPLC-DAD 또는 LC-MS 조건으로 정량합니다.",
      matrix: "허가된 Cannabis/Hemp 건조 분말",
      compounds: ["CBDA", "CBD", "THCA", "Δ9-THC", "CBN", "CBG", "CBC"],
      samplePrep: [
        "법적 취급 권한이 있는 시료만 사용하고, 건조 시료를 균일하게 분쇄합니다.",
        "분말 시료 0.05~0.1 g에 MeOH 또는 MeOH:acetonitrile 혼합용매 10 mL를 넣고 vortex합니다.",
        "초음파 추출 15~30분 후 원심분리하고 상층액을 필요 농도로 희석합니다.",
        "0.22 또는 0.45 μm PTFE membrane filter로 여과하여 amber HPLC vial에 옮깁니다."
      ],
      chromatographic: [
        "Column: C18 column 또는 UHPLC C18, 예: 100 × 2.1 mm, 1.7~3 μm",
        "Mobile phase: A = water + 0.1% formic acid, B = acetonitrile + 0.1% formic acid",
        "Gradient: B를 약 60%에서 시작해 90~95%까지 증가시켜 중성/산성 cannabinoids를 분리합니다.",
        "Flow rate: 0.3~0.5 mL/min(UHPLC) 또는 1.0 mL/min(HPLC), column temperature: 35~40℃",
        "Detection: DAD 220 nm 중심, MS 사용 시 표준품 기반 ion transition/accurate mass 확인"
      ],
      calculation: [
        "각 cannabinoid 표준품으로 Area = a × C + b 표준곡선을 작성합니다.",
        "C(μg/mL) = (Area − b) / a",
        "Content(mg/g DW) = C × 추출부피(mL) × DF / 시료무게(g) / 1000"
      ],
      storage: [
        "시료와 추출액은 법적 보관 규정을 따르고, 차광·밀봉 상태로 4℃ 단기 또는 −20℃ 장기 보관합니다.",
        "산성 cannabinoid(CBDA, THCA)는 열과 장시간 노출에서 decarboxylation될 수 있으므로 고온 건조/장시간 방치를 피합니다.",
        "표준용액은 amber vial에 소분하여 −20℃ 보관하고 반복 동결융해를 피합니다."
      ],
      notes: [
        "이 항목은 허가된 연구·품질관리 목적의 정량 분석용입니다. 규제물질 취급과 폐기는 반드시 기관 및 지역 법규를 따르세요.",
        "중성형과 산성형을 분리해서 보고하고, 총 THC/CBD 환산은 실험실 보고 기준에 맞춰 별도로 계산하세요."
      ]
    },
    en: {
      title: "Cannabinoid Profiling",
      subtitle: "Cannabinoid profiling",
      badge: "HPLC-DAD/LC-MS",
      overview: "Quantifies major cannabinoids such as CBD, CBDA, THC, and THCA in authorized cannabis/hemp samples by HPLC-DAD or LC-MS.",
      matrix: "Authorized dried Cannabis/Hemp powder",
      compounds: ["CBDA", "CBD", "THCA", "Δ9-THC", "CBN", "CBG", "CBC"],
      samplePrep: [
        "Use only legally authorized material and grind the dried sample uniformly.",
        "Add 10 mL MeOH or MeOH:acetonitrile solvent to 0.05–0.1 g powder and vortex.",
        "Sonicate for 15–30 min, centrifuge, and dilute the supernatant as needed.",
        "Filter through a 0.22 or 0.45 μm PTFE membrane into an amber HPLC vial."
      ],
      chromatographic: [
        "Column: C18 or UHPLC C18, e.g., 100 × 2.1 mm, 1.7–3 μm",
        "Mobile phase: A = water + 0.1% formic acid, B = acetonitrile + 0.1% formic acid",
        "Gradient: increase B from about 60% to 90–95% to separate acidic and neutral cannabinoids.",
        "Flow rate: 0.3–0.5 mL/min for UHPLC or 1.0 mL/min for HPLC; column temperature: 35–40℃",
        "Detection: DAD around 220 nm; for MS, confirm transitions or accurate masses using standards"
      ],
      calculation: [
        "Prepare a calibration curve for each cannabinoid standard: Area = a × C + b.",
        "C(μg/mL) = (Area − b) / a",
        "Content(mg/g DW) = C × extraction volume(mL) × DF / sample weight(g) / 1000"
      ],
      storage: [
        "Follow all legal storage rules; keep samples and extracts sealed and protected from light at 4℃ short-term or −20℃ long-term.",
        "Acidic cannabinoids such as CBDA and THCA may decarboxylate with heat or long exposure; avoid high-temperature drying and extended standing.",
        "Aliquot standards in amber vials at −20℃ and avoid repeated freeze-thaw cycles."
      ],
      notes: [
        "This entry is for authorized research and quality-control analysis only. Handling and disposal must follow institutional and local regulations.",
        "Report neutral and acidic forms separately; total THC/CBD conversions should be calculated according to your laboratory reporting standard."
      ]
    }
  }
};

const LEGACY_ALIASES = {
  rosmarinic_acid: "lamiaceae_markers",
  acacetin: "lamiaceae_markers",
  tilianin: "lamiaceae_markers",
  cannabis: "cannabinoid",
  cannabinoids: "cannabinoid"
};

export const resolveHplcType = (analysisType) => LEGACY_ALIASES[analysisType] || analysisType;

export const getHplcProtocol = (analysisType, lang = "ko") => {
  const resolved = resolveHplcType(analysisType);
  const protocol = HPLC_PROTOCOLS[resolved];
  if (!protocol) return null;
  return protocol[lang] || protocol.ko;
};

export const getHplcCompounds = (analysisType, lang = "ko") => {
  const protocol = getHplcProtocol(analysisType, lang);
  return protocol?.compounds || [];
};

export const calibrationCurveHplcTypes = new Set([
  "phenol",
  "lamiaceae_markers",
  "artemisinin",
  "cannabinoid",
  "rosmarinic_acid",
  "acacetin",
  "tilianin",
  "cannabis",
  "cannabinoids"
]);

export const isCalibrationCurveHplcType = (analysisType) => calibrationCurveHplcTypes.has(analysisType);

export const getHplcProtocolEntries = (lang = "ko") => Object.entries(HPLC_PROTOCOLS).map(([key, value]) => ({
  key,
  ...(value[lang] || value.ko),
  group: value.group
}));
