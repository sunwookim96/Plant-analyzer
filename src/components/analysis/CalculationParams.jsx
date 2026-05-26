
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calculator, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ParamInput = ({ label, value, onChange, placeholder, type = "number" }) => (
  <div>
    <Label className="text-gray-600 text-sm">{label}</Label>
    <Input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="ios-input border-0 text-gray-900 placeholder:text-gray-400"
    />
  </div>
);

const HighlightedValue = ({ value, placeholder }) => {
  const hasValue = value !== undefined && value !== null && value !== "";
  return (
    <span className={`transition-colors duration-300 ${hasValue ? 'text-blue-600 font-bold' : 'text-gray-500'}`}>
      {hasValue ? value : placeholder}
    </span>
  );
};

export default function CalculationParams({ analysisType, onParamsChange, initialParams = {} }) {
  const [params, setParams] = useState(initialParams);
  const [isApplied, setIsApplied] = useState(false);

  useEffect(() => {
    setParams(initialParams);
    setIsApplied(Object.keys(initialParams).length > 0 && Object.values(initialParams).some(v => v));
  }, [initialParams]);

  const handleParamChange = (key, value) => {
    setParams(prev => ({ ...prev, [key]: value }));
    setIsApplied(false);
  };

  const handleNestedParamChange = (group, key, value) => {
    setParams(prev => ({
      ...prev,
      [group]: {
        ...(prev[group] || {}),
        [key]: value
      }
    }));
    setIsApplied(false);
  };

  const handleApply = () => {
    onParamsChange(params);
    setIsApplied(true);
  };

  const renderParams = () => {
    switch (analysisType) {
      case "chlorophyll_a_b":
        return (
          <motion.div layout className="flex items-end gap-4">
            <div className="flex-grow space-y-2">
              <Label className="text-gray-600 text-sm">희석배수</Label>
              <Input
                type="number"
                value={params.dilutionFactor || ""}
                onChange={(e) => handleParamChange('dilutionFactor', e.target.value)}
                placeholder="예: 1, 10"
                className="ios-input border-0 text-gray-900 placeholder:text-gray-400"
              />
            </div>
            <Button onClick={handleApply} className="ios-button rounded-xl h-12 flex-shrink-0 flex items-center justify-center">
              {isApplied && params.dilutionFactor ? <CheckCircle className="h-4 w-4 mr-2" /> : null}
              {isApplied && params.dilutionFactor ? "적용됨" : "적용"}
            </Button>
            <AnimatePresence>
              {isApplied && params.dilutionFactor && (
                <motion.div
                  initial={{ opacity: 0, width: 0, x: -20 }}
                  animate={{ opacity: 1, width: 'auto', x: 0 }}
                  exit={{ opacity: 0, width: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="bg-blue-50 border border-blue-200 rounded-xl h-12 flex items-center px-4"
                >
                  <p className="text-blue-800 font-semibold whitespace-nowrap">
                    적용된 배수: {params.dilutionFactor}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      case "total_phenol":
      case "total_flavonoid":
        return (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-end gap-4">
              <div className="flex-1 w-full"><ParamInput label="기울기 (a)" value={params.std_a || ""} onChange={e => handleParamChange('std_a', e.target.value)} placeholder="Standard curve's slope" /></div>
              <div className="flex-1 w-full"><ParamInput label="Y절편 (b)" value={params.std_b || ""} onChange={e => handleParamChange('std_b', e.target.value)} placeholder="Standard curve's y-intercept" /></div>
              <Button onClick={handleApply} className="ios-button rounded-xl h-12 w-full sm:w-auto flex items-center justify-center">
                {isApplied && <CheckCircle className="h-4 w-4 mr-2" />}
                {isApplied ? "적용됨" : "적용"}
              </Button>
            </div>
            <p className="text-gray-800 font-mono p-3 bg-gray-100 rounded-lg text-center">
                y = <HighlightedValue value={params.std_a} placeholder="a" />x + (<HighlightedValue value={params.std_b} placeholder="b" />)
            </p>
          </div>
        );

case "h2o2":
        return (
          <div className="flex flex-col space-y-4">
            {/* 1. 입력 Row: 기울기, 절편, 그리고 적용 버튼 */}
            <div className="flex flex-wrap items-end gap-4">
              <div className="flex-1 min-w-[150px]">
                <ParamInput 
                  label="기울기 (a)" 
                  value={params.h2o2?.a || ""} 
                  onChange={e => handleNestedParamChange('h2o2', 'a', e.target.value)} 
                  placeholder="Standard curve's slope" 
                />
              </div>
              <div className="flex-1 min-w-[150px]">
                <ParamInput 
                  label="Y절편 (b)" 
                  value={params.h2o2?.b || ""} 
                  onChange={e => handleNestedParamChange('h2o2', 'b', e.target.value)} 
                  placeholder="Standard curve's y-intercept" 
                />
              </div>
              
              {/* 버튼 위치: 입력창 바로 오른쪽 */}
              <div className="flex-shrink-0">
                <Button onClick={handleApply} className="ios-button rounded-xl h-12 flex items-center justify-center px-6">
                  {isApplied && <CheckCircle className="h-4 w-4 mr-2" />}
                  {isApplied ? "적용됨" : "적용"}
                </Button>
              </div>
            </div>

            {/* 2. 표준곡선 수식 표시 (깔끔하게 하단 배치) */}
            <div className="text-white font-mono p-4 bg-white/10 rounded-lg text-center text-sm">
               Standard Curve: y = <HighlightedValue value={params.h2o2?.a} placeholder="a" />x + (<HighlightedValue value={params.h2o2?.b} placeholder="b" />)
            </div>
          </div>
        );

        
      case "dpph_scavenging":
        return (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-end gap-4">
              <div className="flex-1 w-full"><ParamInput label="Control 흡광도" value={params.dpph_control || ""} onChange={e => handleParamChange('dpph_control', e.target.value)} placeholder="Absorbance of control" /></div>
              <Button onClick={handleApply} className="ios-button rounded-xl h-12 w-full sm:w-auto flex items-center justify-center">
                 {isApplied && <CheckCircle className="h-4 w-4 mr-2" />}
                 {isApplied ? "적용됨" : "적용"}
              </Button>
            </div>
            <p className="text-gray-800 font-mono p-3 bg-gray-100 rounded-lg text-center">
                Inhibition (%) = ((<HighlightedValue value={params.dpph_control} placeholder="Control" /> - Sample) / <HighlightedValue value={params.dpph_control} placeholder="Control" />) * 100
            </p>
          </div>
        );
case "anthocyanin":
        return (
           <div className="flex flex-col space-y-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[120px]">
                <ParamInput label="추출 부피 (V, mL)" value={params.anthocyanin?.V || ""} onChange={e => handleNestedParamChange('anthocyanin', 'V', e.target.value)} placeholder="Default: 2" />
              </div>
              <div className="flex-1 min-w-[120px]">
                <ParamInput label="희석 배수 (n)" value={params.anthocyanin?.n || ""} onChange={e => handleNestedParamChange('anthocyanin', 'n', e.target.value)} placeholder="Default: 1" />
              </div>
              <div className="flex-1 min-w-[120px]">
                <ParamInput label="분자량 (Mw)" value={params.anthocyanin?.Mw || ""} onChange={e => handleNestedParamChange('anthocyanin', 'Mw', e.target.value)} placeholder="Default: 449.2" />
              </div>
              <div className="flex-1 min-w-[120px]">
                <ParamInput label="Molar absorptivity (ε)" value={params.anthocyanin?.epsilon || ""} onChange={e => handleNestedParamChange('anthocyanin', 'epsilon', e.target.value)} placeholder="Default: 26900" />
              </div>
              <div className="flex-1 min-w-[120px]">
                <ParamInput label="시료 무게 (m, g)" value={params.anthocyanin?.m || ""} onChange={e => handleNestedParamChange('anthocyanin', 'm', e.target.value)} placeholder="Default: 0.02" />
              </div>
              <div className="flex-shrink-0">
                 <Button onClick={handleApply} className="ios-button rounded-xl h-12 flex items-center justify-center px-6">
                   {isApplied && <CheckCircle className="h-4 w-4 mr-2" />}
                   {isApplied ? "적용됨" : "적용"}
                 </Button>
               </div>
            </div>
            <p className="text-gray-800 font-mono p-3 bg-gray-100 rounded-lg text-center text-sm">
                Anthocyanin = (A530 - A600) × <HighlightedValue value={params.anthocyanin?.V} placeholder="V"/> × <HighlightedValue value={params.anthocyanin?.n} placeholder="n"/> × <HighlightedValue value={params.anthocyanin?.Mw} placeholder="Mw"/> / (<HighlightedValue value={params.anthocyanin?.epsilon} placeholder="ε"/> × <HighlightedValue value={params.anthocyanin?.m} placeholder="m"/>)
            </p>
           </div>
        );

case "sod":
        return (
          <div className="flex flex-col space-y-4">
            <div className="flex flex-wrap items-end gap-4">
              <div className="flex-1 min-w-[150px]">
                <ParamInput label="Light control A560" value={params.sod?.light_control_abs || ""} onChange={e => handleNestedParamChange('sod', 'light_control_abs', e.target.value)} placeholder="예: 0.800" />
              </div>
              <div className="flex-1 min-w-[150px]">
                <ParamInput label="Dark blank A560" value={params.sod?.dark_blank_abs || ""} onChange={e => handleNestedParamChange('sod', 'dark_blank_abs', e.target.value)} placeholder="예: 0.050" />
              </div>
              <div className="flex-1 min-w-[120px]">
                <ParamInput label="희석배수 (DF)" value={params.sod?.dilutionFactor || ""} onChange={e => handleNestedParamChange('sod', 'dilutionFactor', e.target.value)} placeholder="Default: 1" />
              </div>
              <div className="flex-shrink-0">
                <Button onClick={handleApply} className="ios-button rounded-xl h-12 flex items-center justify-center px-6">
                  {isApplied && <CheckCircle className="h-4 w-4 mr-2" />}
                  {isApplied ? "적용됨" : "적용"}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-gray-800 font-mono p-3 bg-gray-100 rounded-lg text-sm leading-relaxed text-center">
                Control<sub>corr</sub> = Light control − Dark blank, Sample<sub>corr</sub> = Sample A560 − Sample dark blank 또는 Dark blank
              </div>
              <div className="text-gray-800 font-mono p-3 bg-gray-100 rounded-lg text-sm leading-relaxed text-center">
                SOD inhibition (%) = ((Control<sub>corr</sub> − Sample<sub>corr</sub>) / Control<sub>corr</sub>) × 100
              </div>
              <div className="text-gray-800 font-mono p-3 bg-gray-100 rounded-lg text-sm leading-relaxed text-center">
                SOD activity = inhibition × 0.02 × <HighlightedValue value={params.sod?.dilutionFactor} placeholder="DF" /> (unit/mg DW)
              </div>
            </div>
          </div>
        );

      case "cat":
        return (
          <div className="flex flex-col space-y-4">
            <div className="flex flex-wrap items-end gap-4">
              <div className="flex-1 min-w-[150px]">
                <ParamInput label="H₂O₂ control slope" value={params.cat?.h2o2_control_slope || ""} onChange={e => handleNestedParamChange('cat', 'h2o2_control_slope', e.target.value)} placeholder="예: -0.005" />
              </div>
              <div className="flex-1 min-w-[120px]">
                <ParamInput label="Path length (cm)" value={params.cat?.pathlength || ""} onChange={e => handleNestedParamChange('cat', 'pathlength', e.target.value)} placeholder="Default: 1" />
              </div>
              <div className="flex-1 min-w-[120px]">
                <ParamInput label="희석배수 (DF)" value={params.cat?.dilutionFactor || ""} onChange={e => handleNestedParamChange('cat', 'dilutionFactor', e.target.value)} placeholder="Default: 1" />
              </div>
              <div className="flex-shrink-0">
                <Button onClick={handleApply} className="ios-button rounded-xl h-12 flex items-center justify-center px-6">
                  {isApplied && <CheckCircle className="h-4 w-4 mr-2" />}
                  {isApplied ? "적용됨" : "적용"}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-gray-800 font-mono p-3 bg-gray-100 rounded-lg text-center text-sm">
                ΔA<sub>corr</sub>/min = −(Sample slope − H₂O₂ control slope)
              </div>
              <div className="text-gray-800 font-mono p-3 bg-gray-100 rounded-lg text-center text-sm">
                CAT activity = ΔA<sub>corr</sub>/min × 152.9 / <HighlightedValue value={params.cat?.pathlength} placeholder="l" /> × <HighlightedValue value={params.cat?.dilutionFactor} placeholder="DF" /> (μmol/min/mg DW)
              </div>
            </div>
          </div>
        );

      case "pod":
        return (
          <div className="flex flex-col space-y-4">
            <div className="flex flex-wrap items-end gap-4">
              <div className="flex-1 min-w-[150px]">
                <ParamInput label="Blank slope" value={params.pod?.blank_slope || ""} onChange={e => handleNestedParamChange('pod', 'blank_slope', e.target.value)} placeholder="예: 0.002" />
              </div>
              <div className="flex-1 min-w-[120px]">
                <ParamInput label="Path length (cm)" value={params.pod?.pathlength || ""} onChange={e => handleNestedParamChange('pod', 'pathlength', e.target.value)} placeholder="Default: 1" />
              </div>
              <div className="flex-1 min-w-[120px]">
                <ParamInput label="희석배수 (DF)" value={params.pod?.dilutionFactor || ""} onChange={e => handleNestedParamChange('pod', 'dilutionFactor', e.target.value)} placeholder="Default: 1" />
              </div>
              <div className="flex-shrink-0">
                <Button onClick={handleApply} className="ios-button rounded-xl h-12 flex items-center justify-center px-6">
                  {isApplied && <CheckCircle className="h-4 w-4 mr-2" />}
                  {isApplied ? "적용됨" : "적용"}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-gray-800 font-mono p-3 bg-gray-100 rounded-lg text-center text-sm">
                ΔA<sub>corr</sub>/min = Sample slope − Blank slope
              </div>
              <div className="text-gray-800 font-mono p-3 bg-gray-100 rounded-lg text-center text-sm">
                POD activity = ΔA<sub>corr</sub>/min × 0.0376 / <HighlightedValue value={params.pod?.pathlength} placeholder="l" /> × <HighlightedValue value={params.pod?.dilutionFactor} placeholder="DF" /> (μmol/min/mg DW)
              </div>
              <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                ε = 26.6 mM⁻¹ cm⁻¹ 기준이므로 POD 계산에는 ×1000을 넣지 않습니다.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderedParams = renderParams();
  if (!renderedParams) return null;

  return (
    <Card className="ios-card ios-blur rounded-3xl ios-shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-gray-900 text-xl font-semibold">
          <Calculator className="h-5 w-5" />
          <span>계산 변수 입력</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {renderedParams}
      </CardContent>
    </Card>
  );
}
