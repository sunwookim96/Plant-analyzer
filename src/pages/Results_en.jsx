
import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, BarChart3, Database, ArrowLeft, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import _ from "lodash";
import { motion, AnimatePresence } from "framer-motion";
import { createPageUrl } from "@/utils";
import { calculateCatActivity, calculatePodActivity, calculateSodActivity } from "@/utils/antioxidantCalculations";

import ManualInput from "../components/analysis_en/ManualInput";
import ExcelUpload from "../components/analysis_en/ExcelUpload";
import CalculationEngine from "../components/analysis_en/CalculationEngine";
import ChartVisualization from "../components/analysis_en/ChartVisualization";
import SampleResults from "../components/analysis_en/SampleResults";
import CalculationParams from "../components/analysis_en/CalculationParams";

export default function ResultsEn() {
  const location = useLocation();
  const navigate = useNavigate();
  const [analysisType, setAnalysisType] = useState("");
  const [samples, setSamples] = useState([]);
  const [selectedSampleIds, setSelectedSampleIds] = useState(new Set());
  const [activeTab, setActiveTab] = useState("data_input_analysis");
  const [calculationParams, setCalculationParams] = useState({});

  // URL 파라미터에서 탭 상태 확인 및 설정
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [location.search]);

  // 탭 변경 시 URL 업데이트
  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    const params = new URLSearchParams(location.search);
    params.set("tab", newTab);
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  };

  // 계산 변수 localStorage에 저장/불러오기
  const saveCalculationParams = (params) => {
    try {
      localStorage.setItem(`calc_params_${analysisType}`, JSON.stringify(params));
    } catch (error) {
      console.error("Error saving calculation parameters:", error);
    }
  };

  const loadCalculationParams = () => {
    try {
      const saved = localStorage.getItem(`calc_params_${analysisType}`);
      return saved ? JSON.parse(saved) : {};
    } catch (error) {
      console.error("Error loading calculation parameters:", error);
      return {};
    }
  };

  // Get samples from localStorage
  const getSamplesFromStorage = (type) => {
    try {
      const allSamples = JSON.parse(localStorage.getItem("phyto_samples") || "[]");
      return allSamples.filter(s => s.analysis_type === type);
    } catch (error) {
      console.error("Error loading samples from localStorage:", error);
      return [];
    }
  };

  // Save samples to localStorage
  const saveSamplesToStorage = (newSamples) => {
    try {
      const allSamples = JSON.parse(localStorage.getItem("phyto_samples") || "[]");
      const otherSamples = allSamples.filter(s => s.analysis_type !== analysisType);
      localStorage.setItem("phyto_samples", JSON.stringify([...otherSamples, ...newSamples]));
    } catch (error) {
      console.error("Error saving samples to localStorage:", error);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const type = params.get("analysis_type");
    if (type) {
      setAnalysisType(type);
      setSamples(getSamplesFromStorage(type));
      // 저장된 계산 변수 불러오기
      const savedParams = loadCalculationParams();
      setCalculationParams(savedParams);
    }
  }, [location.search]);

  // 계산 변수 변경 시 저장
  const handleCalculationParamsChange = (params) => {
    setCalculationParams(params);
    saveCalculationParams(params);
  };

  const handleBackToAnalysis = () => {
    navigate(createPageUrl("Analysis_en"));
  };
  
  const loadSamples = () => {
    setSamples(getSamplesFromStorage(analysisType));
  };

  const handleAddOrUpdateSample = (sampleData, isEditing) => {
    const currentSamples = getSamplesFromStorage(analysisType);
    let updatedSamples;
    if (isEditing) {
      updatedSamples = currentSamples.map(s => s.id === sampleData.id ? {...s, ...sampleData, updated_date: new Date().toISOString()} : s);
    } else {
      updatedSamples = [...currentSamples, { ...sampleData, id: Date.now().toString(), created_date: new Date().toISOString(), analysis_type: analysisType }]; // Ensure analysis_type is set for new samples
    }
    saveSamplesToStorage(updatedSamples);
    loadSamples();
  };

  const handleRemoveSample = (sampleId) => {
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

  const handleRemoveMultipleSamples = (sampleIds) => {
    const currentSamples = getSamplesFromStorage(analysisType);
    const updatedSamples = currentSamples.filter(s => !sampleIds.includes(s.id));
    saveSamplesToStorage(updatedSamples);
    loadSamples();
    setSelectedSampleIds(new Set());
  };

  const handleSamplesUploaded = (uploadedSamples) => {
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
    const values = sample.absorbance_values || {};
    const toNumber = (value, fallback = 0) => {
      const parsed = parseFloat(value);
      return Number.isFinite(parsed) ? parsed : fallback;
    };
    const getIntercept = (value) => {
      if (value === undefined || value === null || value === "") return 0;
      const parsed = parseFloat(value);
      return Number.isFinite(parsed) ? parsed : NaN;
    };

    switch (sample.analysis_type) {
      case "chlorophyll_a_b": {
        const a665 = toNumber(values["665.2"]);
        const a652 = toNumber(values["652.4"]);
        const a470 = toNumber(values["470"]);
        const dF = toNumber(p?.dilutionFactor, 1) || 1;
        const raw_ca = (16.82 * a665 - 9.28 * a652) * dF;
        const raw_cb = (36.92 * a652 - 16.54 * a665) * dF;
        const raw_car = ((1000 * a470 - 1.91 * (raw_ca / dF) - 95.15 * (raw_cb / dF)) / 225) * dF;
        return {
          result: raw_ca / 10,
          unit: "mg/g DW",
          chl_a: raw_ca / 10,
          chl_b: raw_cb / 10,
          carotenoid: raw_car / 10
        };
      }
      case "carotenoid": {
        const a470 = toNumber(values["470"]);
        const a665 = toNumber(values["665.2"]);
        const a652 = toNumber(values["652.4"]);
        const dF = toNumber(p?.dilutionFactor, 1) || 1;
        const raw_ca = (16.82 * a665 - 9.28 * a652) * dF;
        const raw_cb = (36.92 * a652 - 16.54 * a665) * dF;
        const raw_car = ((1000 * a470 - 1.91 * (raw_ca / dF) - 95.15 * (raw_cb / dF)) / 225) * dF;
        return { result: raw_car / 10, unit: "mg/g DW" };
      }
      case "total_phenol":
      case "total_flavonoid": {
        const slope = parseFloat(p.std_a);
        const intercept = getIntercept(p.std_b);
        if (!Number.isFinite(slope) || slope === 0 || !Number.isFinite(intercept)) {
          return { result: 0, unit: "N/A" };
        }
        const y = toNumber(values[Object.keys(values)[0]]);
        const result = Math.max(0, ((y - intercept) / slope) / 10);
        return {
          result,
          unit: sample.analysis_type === "total_phenol" ? "mg GAE/g DW" : "mg QE/g DW"
        };
      }
      case "h2o2": {
        const { a, b, vol = 2, dw = 0.02 } = p.h2o2 || {};
        const slope = parseFloat(a);
        const intercept = getIntercept(b);
        const extractionVolume = toNumber(vol, 2);
        const dryWeight = toNumber(dw, 0.02);
        if (!Number.isFinite(slope) || slope === 0 || !Number.isFinite(intercept) || extractionVolume <= 0 || dryWeight <= 0) {
          return { result: 0, unit: "Check Params" };
        }
        const abs = toNumber(values["390"]);
        const mM = Math.max(0, (abs - intercept) / slope);
        const result_dw = (mM * extractionVolume) / dryWeight;
        const freshWeight = sample.weight ? toNumber(sample.weight, dryWeight) : dryWeight;
        const result_fw = freshWeight > 0 ? result_dw * (dryWeight / freshWeight) : result_dw;
        return { result: result_dw, unit: "μmol/g DW", result_dw, result_fw };
      }
      case "glucosinolate":
        return { result: 1.40 + 118.86 * toNumber(values["425"]), unit: "μmol/g DW" };
      case "dpph_scavenging": {
        const control = parseFloat(p.dpph_control);
        if (!Number.isFinite(control) || control <= 0) return { result: 0, unit: "% inhibition" };
        return { result: ((control - toNumber(values["517"])) / control) * 100, unit: "% inhibition" };
      }
      case "anthocyanin": {
        const { V = 2, n = 1, Mw = 449.2, epsilon = 26900, m = 0.02 } = p.anthocyanin || {};
        const denominator = toNumber(epsilon, 26900) * toNumber(m, 0.02);
        if (!denominator) return { result: 0, unit: "Check Params" };
        return {
          result: (toNumber(values["530"]) - toNumber(values["600"])) * toNumber(V, 2) * toNumber(n, 1) * toNumber(Mw, 449.2) / denominator,
          unit: "mg/g DW"
        };
      }
      case "cat": {
        return calculateCatActivity(values, p);
      }
      case "pod": {
        return calculatePodActivity(values, p);
      }
      case "sod": {
        return calculateSodActivity(values, p);
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

  // 샘플을 처리구별로 그룹화하고 정렬
  const groupedAndSortedSamples = useMemo(() => {
    const grouped = _.groupBy(allCalculatedSamples, 'treatment_name');
    const sortedGroups = Object.keys(grouped).sort();
    return sortedGroups.flatMap(groupName => 
      grouped[groupName].sort((a, b) => a.sample_name.localeCompare(b.sample_name))
    );
  }, [allCalculatedSamples]);

  const selectedSamples = allCalculatedSamples.filter(s => selectedSampleIds.has(s.id));

  const getAnalysisTitle = () => {
    const titles = {
      chlorophyll_a_b: "Chlorophyll & Carotenoid Analysis",
      total_phenol: "Total Phenolic Content Analysis",
      total_flavonoid: "Total Flavonoid Analysis",
      glucosinolate: "Glucosinolate Analysis",
      dpph_scavenging: "DPPH Radical Scavenging Analysis",
      anthocyanin: "Anthocyanin Analysis",
      cat: "Catalase Activity Analysis",
      pod: "Peroxidase Activity Analysis",
      sod: "Superoxide Dismutase Activity Analysis",
      h2o2: "Hydrogen Peroxide Content Analysis",
      carotenoid: "Carotenoid Analysis" // Added missing carotenoid title
    };
    return titles[analysisType] || "Analysis";
  };

  if (!analysisType) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="text-center py-20">
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">Please select an analysis type</h1>
            <p className="text-sm sm:text-base text-gray-600 mb-6">First, select an analysis to perform from the Analysis Protocols.</p>
            <Button 
              onClick={handleBackToAnalysis}
              className="bg-blue-600 hover:bg-blue-700 mt-6 rounded-xl flex items-center space-x-2 mx-auto"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Analysis Protocols</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8 space-y-6 sm:space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between space-y-4 sm:space-y-0"
        >
          <div className="text-left sm:text-center flex-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 leading-tight">{getAnalysisTitle()}</h1>
            <p className="text-sm sm:text-base text-gray-600">
              Input data and view the analysis results.
            </p>
          </div>
          <Button 
            onClick={handleBackToAnalysis}
            variant="outline"
            className="border-gray-300 hover:bg-gray-100 rounded-xl flex items-center space-x-2 h-10 sm:h-12 w-full sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Select Analysis</span>
          </Button>
        </motion.div>
        
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-white/70 backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-xl p-2 border-0 h-12 sm:h-14">
            <TabsTrigger 
              value="data_input_analysis" 
              className="flex items-center space-x-1 sm:space-x-2 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-blue-600 text-gray-600 rounded-lg sm:rounded-xl h-8 sm:h-10 font-semibold transition-all duration-200 text-xs sm:text-sm"
            >
              <Database className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Data Input & Analysis</span>
              <span className="sm:hidden">Data Analysis</span>
            </TabsTrigger>
            <TabsTrigger 
              value="visualization" 
              className="flex items-center space-x-1 sm:space-x-2 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-blue-600 text-gray-600 rounded-lg sm:rounded-xl h-8 sm:h-10 font-semibold transition-all duration-200 text-xs sm:text-sm"
            >
              <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Visualization</span>
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab} // Key changes with activeTab to trigger re-animation
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="mt-4" // Tailwind margin top to compensate for the AnimatePresence div
            >
              <TabsContent value="data_input_analysis" className="space-y-6 sm:space-y-8 mt-0">
                <motion.div // Removed initial/animate from here, as parent AnimatePresence handles it
                  initial={{ opacity: 0, y: -20 }} // Kept for individual element animation within the tab
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <CalculationParams 
                    analysisType={analysisType} 
                    onParamsChange={handleCalculationParamsChange}
                    initialParams={calculationParams}
                  />
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6 items-start"
                >
                  <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                    <Tabs defaultValue="manual" className="w-full">
                      <TabsList className="bg-white/70 backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-xl p-2 border-0 h-10 sm:h-12 w-full">
                        <TabsTrigger value="manual" className="data-[state=active]:bg-white data-[state=active]:shadow-lg text-gray-600 data-[state=active]:text-blue-600 rounded-lg sm:rounded-xl font-semibold h-6 sm:h-8 transition-all duration-200 text-xs sm:text-sm flex-1">
                          Manual Input
                        </TabsTrigger>
                        <TabsTrigger value="excel" className="data-[state=active]:bg-white data-[state=active]:shadow-lg text-gray-600 data-[state=active]:text-blue-600 rounded-lg sm:rounded-xl font-semibold h-6 sm:h-8 transition-all duration-200 text-xs sm:text-sm flex-1">
                          File Upload
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="manual" className="mt-4 sm:mt-6">
                        <ManualInput 
                          analysisType={analysisType}
                          onSaveSample={handleAddOrUpdateSample}
                        />
                      </TabsContent>
                      <TabsContent value="excel" className="mt-4 sm:mt-6">
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
                      samples={groupedAndSortedSamples}
                      selectedIds={selectedSampleIds}
                      onSelectionChange={setSelectedSampleIds}
                      onEdit={handleAddOrUpdateSample}
                      onRemove={handleRemoveSample}
                      onRemoveMultiple={handleRemoveMultipleSamples}
                      analysisType={analysisType}
                    />
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="visualization" className="mt-0">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <ChartVisualization samples={allCalculatedSamples} />
                </motion.div>
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </div>
    </div>
  );
}
