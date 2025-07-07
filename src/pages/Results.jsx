import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, BarChart3, Database, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import _ from "lodash";
import { motion, AnimatePresence } from "framer-motion";

import ManualInput from "../components/analysis/ManualInput";
import ExcelUpload from "../components/analysis/ExcelUpload";
import CalculationEngine from "../components/analysis/CalculationEngine";
import ChartVisualization from "../components/analysis/ChartVisualization";
import SampleResults from "../components/analysis/SampleResults";
import CalculationParams from "../components/analysis/CalculationParams";

// Helper function to get page URL, assuming you have a way to build it
const createPageUrl = (page) => `/${page.toLowerCase()}`;

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const [analysisType, setAnalysisType] = useState("");
  const [samples, setSamples] = useState([]);
  const [selectedSampleIds, setSelectedSampleIds] = useState(new Set());
  const [activeTab, setActiveTab] = useState("data_input_analysis");
  const [calculationParams, setCalculationParams] = useState({});

  // Get samples from localStorage
  const getSamplesFromStorage = (type) => {
    const allSamples = JSON.parse(localStorage.getItem("phyto_samples") || "[]");
    return allSamples.filter(s => s.analysis_type === type);
  };

  // Save samples to localStorage
  const saveSamplesToStorage = (newSamples) => {
    const allSamples = JSON.parse(localStorage.getItem("phyto_samples") || "[]");
    const otherSamples = allSamples.filter(s => s.analysis_type !== analysisType);
    localStorage.setItem("phyto_samples", JSON.stringify([...otherSamples, ...newSamples]));
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const type = params.get("analysis_type");
    if (type) {
      setAnalysisType(type);
      setSamples(getSamplesFromStorage(type));
    }
  }, [location.search]);

  const handleBackToAnalysis = () => {
    navigate(createPageUrl("Analysis"));
  };
  
  const loadSamples = () => {
      setSamples(getSamplesFromStorage(analysisType));
  };

  const handleAddOrUpdateSample = async (sampleData, isEditing) => {
    const currentSamples = getSamplesFromStorage(analysisType);
    let updatedSamples;
    if (isEditing) {
      updatedSamples = currentSamples.map(s => s.id === sampleData.id ? {...s, ...sampleData, updated_date: new Date().toISOString()} : s);
    } else {
      updatedSamples = [...currentSamples, { ...sampleData, id: Date.now().toString(), created_date: new Date().toISOString() }];
    }
    saveSamplesToStorage(updatedSamples);
    loadSamples();
  };

  const handleRemoveSample = async (sampleId) => {
    const currentSamples = getSamplesFromStorage(analysisType);
    const updatedSamples = currentSamples.filter(s => s.id !== sampleId);
    saveSamplesToStorage(updatedSamples);
    loadSamples();
    setSelectedSampleIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(sampleId);
        return newSet;
    });
  };

  const handleRemoveMultipleSamples = async (sampleIds) => {
    const currentSamples = getSamplesFromStorage(analysisType);
    const updatedSamples = currentSamples.filter(s => !sampleIds.includes(s.id));
    saveSamplesToStorage(updatedSamples);
    loadSamples();
    setSelectedSampleIds(new Set());
  };

  const handleSamplesUploaded = async (uploadedSamples) => {
    const newSamples = uploadedSamples.map(s => ({ 
        ...s, 
        id: `${Date.now()}-${Math.random()}`, 
        created_date: new Date().toISOString(),
        analysis_type: analysisType 
    }));
    const currentSamples = getSamplesFromStorage(analysisType);
    saveSamplesToStorage([...currentSamples, ...newSamples]);
    loadSamples();
  };

  const calculateSingleResult = (sample) => {
    const p = calculationParams;
    const values = sample.absorbance_values;
    
    switch (sample.analysis_type) {
        case "chlorophyll_a_b": {
            const a665 = values["665.2"] || 0;
            const a652 = values["652.4"] || 0;
            return { result: 16.82 * a665 - 9.28 * a652, unit: "μg/ml" };
        }
        case "carotenoid": {
            const a470 = values["470"] || 0;
            const a665 = values["665.2"] || 0;
            const a652 = values["652.4"] || 0;
            const chl_a = 16.82 * a665 - 9.28 * a652;
            const chl_b = 36.92 * a652 - 16.54 * a665;
            return { result: (1000 * a470 - 1.91 * chl_a - 95.15 * chl_b) / 225, unit: "μg/ml" };
        }
        case "total_phenol":
        case "total_flavonoid":
        case "h2o2": {
            if (!p.std_a || !p.std_b) return { result: 0, unit: "N/A" };
            const y = values[Object.keys(values)[0]] || 0;
            const result = (y - parseFloat(p.std_b)) / parseFloat(p.std_a);
            const unitMap = { total_phenol: "mg GAE/g FW", total_flavonoid: "mg QE/g FW", h2o2: "μmol/g FW" };
            return { result, unit: unitMap[sample.analysis_type] };
        }
        case "glucosinolate":
            return { result: 1.40 + 118.86 * (values["425"] || 0), unit: "μmol/g FW" };
        case "dpph_scavenging": {
            if (!p.dpph_control) return { result: 0, unit: "% inhibition" };
            const control = parseFloat(p.dpph_control);
            return { result: ((control - (values["517"] || 0)) / control) * 100, unit: "% inhibition" };
        }
        case "anthocyanin": {
            const { V=2, n=1, Mw=449.2, epsilon=26900, m=0.02 } = p.anthocyanin || {};
            const a530 = values["530"] || 0;
            const a600 = values["600"] || 0;
            return { result: (a530 - a600) * V * n * Mw / (epsilon * m), unit: "mg/g FW" };
        }
        case "cat": {
            const { delta_A, total_vol, enzyme_vol, enzyme_conc } = p.cat || {};
            if (!delta_A || !total_vol || !enzyme_vol || !enzyme_conc) return { result: 0, unit: "μmol/min/mg DW" };
            const activity_per_ml = (delta_A * total_vol * 1000) / (39.4 * enzyme_vol);
            return { result: activity_per_ml / enzyme_conc, unit: "μmol/min/mg DW" };
        }
        case "pod": {
             const { delta_A, total_vol, enzyme_vol, enzyme_conc } = p.pod || {};
            if (!delta_A || !total_vol || !enzyme_vol || !enzyme_conc) return { result: 0, unit: "μmol/min/mg DW" };
            const activity_per_ml = (delta_A * total_vol * 1000) / (26.6 * enzyme_vol);
            return { result: activity_per_ml / enzyme_conc, unit: "μmol/min/mg DW" };
        }
        case "sod": {
            const { control_abs, enzyme_vol, enzyme_conc, total_vol } = p.sod || {};
            if (!control_abs || !enzyme_vol || !enzyme_conc || !total_vol) return { result: 0, unit: "unit/mg DW" };
            const sample_abs = values["560"] || 0;
            const inhibition = ((control_abs - sample_abs) / control_abs) * 100;
            const activity_per_ml = (inhibition * total_vol) / (50 * enzyme_vol);
            return { result: activity_per_ml / enzyme_conc, unit: "unit/mg DW" };
        }
        default:
            return { result: 0, unit: "N/A" };
    }
  };
  
  const allCalculatedSamples = samples
    .map(sample => ({
      ...sample,
      ...calculateSingleResult(sample)
    }));

  const selectedSamples = allCalculatedSamples.filter(s => selectedSampleIds.has(s.id));

  const getAnalysisTitle = () => {
    const titles = {
      chlorophyll_a_b: "엽록소 및 카로티노이드 분석",
      total_phenol: "총 페놀 함량 분석",
      total_flavonoid: "총 플라보노이드 분석",
      glucosinolate: "글루코시놀레이트 분석",
      dpph_scavenging: "DPPH 라디칼 소거능 분석",
      anthocyanin: "안토시아닌 분석",
      cat: "카탈라아제 활성 분석",
      pod: "퍼옥시다아제 활성 분석",
      sod: "슈퍼옥사이드 디스뮤타아제 활성 분석",
      h2o2: "과산화수소 함량 분석"
    };
    return titles[analysisType] || "분석";
  };

  if (!analysisType) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center py-20">
            <h1 className="text-2xl font-semibold text-gray-900 mb-4">분석 항목을 선택해주세요</h1>
            <p className="text-gray-600">먼저 분석 프로토콜에서 수행할 분석을 선택하세요.</p>
            <Button 
              onClick={handleBackToAnalysis}
              className="ios-button mt-6 rounded-xl flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>분석 프로토콜로 돌아가기</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between"
        >
          <div className="text-center flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{getAnalysisTitle()}</h1>
            <p className="text-gray-600">
              데이터를 입력하고 분석 결과를 확인하세요.
            </p>
          </div>
          <Button 
            onClick={handleBackToAnalysis}
            variant="outline"
            className="ios-button-secondary rounded-xl flex items-center space-x-2 h-12"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>분석 선택</span>
          </Button>
        </motion.div>

        <AnimatePresence>
          {activeTab === 'data_input_analysis' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <CalculationParams analysisType={analysisType} onParamsChange={setCalculationParams} />
            </motion.div>
          )}
        </AnimatePresence>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 ios-card ios-blur rounded-2xl ios-shadow p-2 border-0 h-14">
            <TabsTrigger 
              value="data_input_analysis" 
              className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:ios-shadow data-[state=active]:text-blue-600 text-gray-600 rounded-xl h-10 font-semibold transition-all duration-200"
            >
              <Database className="h-4 w-4" />
              <span>데이터 입력 및 분석 결과</span>
            </TabsTrigger>
            <TabsTrigger 
              value="visualization" 
              className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:ios-shadow data-[state=active]:text-blue-600 text-gray-600 rounded-xl h-10 font-semibold transition-all duration-200"
            >
              <BarChart3 className="h-4 w-4" />
              <span>시각화</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="data_input_analysis" className="space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="grid lg:grid-cols-5 gap-6 items-start"
            >
              <div className="lg:col-span-2 space-y-6">
                <Tabs defaultValue="manual" className="w-full">
                  <TabsList className="ios-card ios-blur rounded-2xl ios-shadow p-2 border-0 h-12">
                    <TabsTrigger value="manual" className="data-[state=active]:bg-white data-[state=active]:ios-shadow text-gray-600 data-[state=active]:text-blue-600 rounded-xl font-semibold h-8 transition-all duration-200">
                      직접 입력
                    </TabsTrigger>
                    <TabsTrigger value="excel" className="data-[state=active]:bg-white data-[state=active]:ios-shadow text-gray-600 data-[state=active]:text-blue-600 rounded-xl font-semibold h-8 transition-all duration-200">
                      파일 업로드
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="manual" className="mt-6">
                    <ManualInput 
                      analysisType={analysisType}
                      onSaveSample={handleAddOrUpdateSample}
                    />
                  </TabsContent>
                  <TabsContent value="excel" className="mt-6">
                    <ExcelUpload 
                      analysisType={analysisType}
                      onSamplesUploaded={handleSamplesUploaded}
                    />
                  </TabsContent>
                </Tabs>
                <CalculationEngine samples={selectedSamples} />
              </div>
              <div className="lg:col-span-3">
                <SampleResults
                  samples={allCalculatedSamples}
                  selectedIds={selectedSampleIds}
                  onSelectionChange={setSelectedSampleIds}
                  onEdit={handleAddOrUpdateSample}
                  onRemove={handleRemoveSample}
                  onRemoveMultiple={handleRemoveMultipleSamples}
                />
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="visualization">
            <motion.div
              key="visualization"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ChartVisualization samples={allCalculatedSamples} />
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}