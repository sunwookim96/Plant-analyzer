
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

const HighlightedValue = ({ value, placeholder }) => (
  <span className={`transition-colors duration-300 ${value ? 'text-blue-600 font-bold' : 'text-gray-500'}`}>
    {value || placeholder}
  </span>
);

export default function CalculationParams({ analysisType, onParamsChange, initialParams = {} }) {
  const [params, setParams] = useState(initialParams);
  const [isApplied, setIsApplied] = useState(Object.keys(initialParams).length > 0);

  useEffect(() => {
    if (Object.keys(initialParams).length > 0) {
      setParams(initialParams);
      setIsApplied(true);
    } else {
      setParams({});
      setIsApplied(false);
    }
  }, [initialParams, analysisType]);

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
          <motion.div
            layout
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex flex-col sm:flex-row items-stretch gap-4"
          >
            <motion.div layout className="flex-1 w-full space-y-4">
              <ParamInput label="희석배수" value={params.abs_dilution_factor || ""} onChange={e => handleParamChange('abs_dilution_factor', e.target.value)} placeholder="1" />
              <Button onClick={handleApply} className="ios-button rounded-xl h-12 w-full flex items-center justify-center">
                {isApplied && <CheckCircle className="h-4 w-4 mr-2" />}
                {isApplied ? "적용됨" : "적용"}
              </Button>
            </motion.div>
            
            <AnimatePresence>
              {isApplied && (
                <motion.div
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="flex-1 w-full"
                >
                  <div className="h-full p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <h4 className="text-blue-800 font-semibold mb-3">적용된 계산 변수</h4>
                    <div className="grid grid-cols-1 gap-4 text-sm">
                      <div className="bg-blue-100 rounded p-2 text-center">
                        <div className="text-blue-700 font-medium mb-1">희석배수</div>
                        <div className="font-bold text-blue-900">{params.abs_dilution_factor || '1'}</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      case "total_phenol":
      case "total_flavonoid":
      case "h2o2":
        return (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-end gap-4">
              <div className="flex-1 w-full"><ParamInput label="기울기 (a)" value={params.std_a || ""} onChange={e => handleParamChange('std_a', e.target.value)} placeholder="Standard curve's slope" /></div>
              <div className="flex-1 w-full"><ParamInput label="Y절편 (b)" value={params.std_b || ""} onChange={e => handleParamChange('std_b', e.target.value)} placeholder="Standard curve's y-intercept" /></div>
              <div className="flex-1 w-full"><ParamInput label="흡광도 희석배수" value={params.abs_dilution_factor || ""} onChange={e => handleParamChange('abs_dilution_factor', e.target.value)} placeholder="1" /></div>
              <div className="flex-1 w-full"><ParamInput label="최종 희석배수" value={params.dilution_factor || ""} onChange={e => handleParamChange('dilution_factor', e.target.value)} placeholder="1" /></div>
              <Button onClick={handleApply} className="ios-button rounded-xl h-12 w-full sm:w-auto flex items-center justify-center">
                {isApplied && <CheckCircle className="h-4 w-4 mr-2" />}
                {isApplied ? "적용됨" : "적용"}
              </Button>
            </div>
            <p className="text-gray-800 font-mono p-3 bg-gray-100 rounded-lg text-center">
                농도 = (((흡광도 × <HighlightedValue value={params.abs_dilution_factor} placeholder="흡광도 희석배수"/>) - <HighlightedValue value={params.std_b} placeholder="b" />) / <HighlightedValue value={params.std_a} placeholder="a" />) × <HighlightedValue value={params.dilution_factor} placeholder="최종 희석배수" />
            </p>
            {isApplied && Object.keys(initialParams).length > 0 && (
              <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <h4 className="text-blue-800 font-semibold mb-3">적용된 계산 변수</h4>
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div className="bg-blue-100 rounded p-2 text-center"><div className="text-blue-700 font-medium mb-1">기울기 (a)</div><div className="font-bold text-blue-900">{params.std_a || 'N/A'}</div></div>
                  <div className="bg-blue-100 rounded p-2 text-center"><div className="text-blue-700 font-medium mb-1">Y절편 (b)</div><div className="font-bold text-blue-900">{params.std_b || 'N/A'}</div></div>
                  <div className="bg-blue-100 rounded p-2 text-center"><div className="text-blue-700 font-medium mb-1">흡광도 희석배수</div><div className="font-bold text-blue-900">{params.abs_dilution_factor || '1'}</div></div>
                  <div className="bg-blue-100 rounded p-2 text-center"><div className="text-blue-700 font-medium mb-1">최종 희석배수</div><div className="font-bold text-blue-900">{params.dilution_factor || '1'}</div></div>
                </div>
              </div>
            )}
          </div>
        );
      case "dpph_scavenging":
        return (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-end gap-4">
              <div className="flex-1 w-full"><ParamInput label="Control 흡광도" value={params.dpph_control || ""} onChange={e => handleParamChange('dpph_control', e.target.value)} placeholder="Absorbance of control" /></div>
              <div className="flex-1 w-full"><ParamInput label="흡광도 희석배수" value={params.abs_dilution_factor || ""} onChange={e => handleParamChange('abs_dilution_factor', e.target.value)} placeholder="1" /></div>
              <div className="flex-1 w-full"><ParamInput label="최종 희석배수" value={params.dilution_factor || ""} onChange={e => handleParamChange('dilution_factor', e.target.value)} placeholder="1" /></div>
              <Button onClick={handleApply} className="ios-button rounded-xl h-12 w-full sm:w-auto flex items-center justify-center">
                 {isApplied && <CheckCircle className="h-4 w-4 mr-2" />}
                 {isApplied ? "적용됨" : "적용"}
              </Button>
            </div>
            <p className="text-gray-800 font-mono p-3 bg-gray-100 rounded-lg text-center">
                Inhibition (%) = ((<HighlightedValue value={params.dpph_control} placeholder="Control" /> - (Sample × <HighlightedValue value={params.abs_dilution_factor} placeholder="흡광도 희석배수"/>)) / <HighlightedValue value={params.dpph_control} placeholder="Control" />) × 100 × <HighlightedValue value={params.dilution_factor} placeholder="최종 희석배수" />
            </p>
            {isApplied && Object.keys(initialParams).length > 0 && (
              <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <h4 className="text-blue-800 font-semibold mb-3">적용된 계산 변수</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="bg-blue-100 rounded p-2 text-center"><div className="text-blue-700 font-medium mb-1">Control 흡광도</div><div className="font-bold text-blue-900">{params.dpph_control || 'N/A'}</div></div>
                  <div className="bg-blue-100 rounded p-2 text-center"><div className="text-blue-700 font-medium mb-1">흡광도 희석배수</div><div className="font-bold text-blue-900">{params.abs_dilution_factor || '1'}</div></div>
                  <div className="bg-blue-100 rounded p-2 text-center"><div className="text-blue-700 font-medium mb-1">최종 희석배수</div><div className="font-bold text-blue-900">{params.dilution_factor || '1'}</div></div>
                </div>
              </div>
            )}
          </div>
        );
      case "glucosinolate":
        return (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-end gap-4">
              <div className="flex-1 w-full"><ParamInput label="흡광도 희석배수" value={params.abs_dilution_factor || ""} onChange={e => handleParamChange('abs_dilution_factor', e.target.value)} placeholder="1" /></div>
              <div className="flex-1 w-full"><ParamInput label="최종 희석배수" value={params.dilution_factor || ""} onChange={e => handleParamChange('dilution_factor', e.target.value)} placeholder="1" /></div>
              <Button onClick={handleApply} className="ios-button rounded-xl h-12 w-full sm:w-auto flex items-center justify-center">
                {isApplied && <CheckCircle className="h-4 w-4 mr-2" />}
                {isApplied ? "적용됨" : "적용"}
              </Button>
            </div>
            <p className="text-gray-800 font-mono p-3 bg-gray-100 rounded-lg text-center">
              Total glucosinolate (μmol/g) = (1.40 + 118.86 × (A<sub>425</sub> × <HighlightedValue value={params.abs_dilution_factor} placeholder="흡광도 희석배수"/>)) × <HighlightedValue value={params.dilution_factor} placeholder="최종 희석배수" />
            </p>
            {isApplied && Object.keys(initialParams).length > 0 && (
              <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <h4 className="text-blue-800 font-semibold mb-3">적용된 계산 변수</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-blue-100 rounded p-2 text-center"><div className="text-blue-700 font-medium mb-1">흡광도 희석배수</div><div className="font-bold text-blue-900">{params.abs_dilution_factor || '1'}</div></div>
                  <div className="bg-blue-100 rounded p-2 text-center"><div className="text-blue-700 font-medium mb-1">최종 희석배수</div><div className="font-bold text-blue-900">{params.dilution_factor || '1'}</div></div>
                </div>
              </div>
            )}
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
              <div className="flex-1 min-w-[120px]">
                <ParamInput label="흡광도 희석배수" value={params.anthocyanin?.abs_dilution_factor || ""} onChange={e => handleNestedParamChange('anthocyanin', 'abs_dilution_factor', e.target.value)} placeholder="Default: 1" />
              </div>
              <div className="flex-shrink-0">
                <Button onClick={handleApply} className="ios-button rounded-xl h-12 mt-6 flex items-center justify-center px-6">
                  {isApplied && <CheckCircle className="h-4 w-4 mr-2" />}
                  {isApplied ? "적용됨" : "적용"}
                </Button>
              </div>
            </div>
            <p className="text-gray-800 font-mono p-3 bg-gray-100 rounded-lg text-center text-sm">
              Anthocyanin = ((A530 - A600) × <HighlightedValue value={params.anthocyanin?.abs_dilution_factor} placeholder="흡광도 희석배수"/>) × <HighlightedValue value={params.anthocyanin?.V} placeholder="V" /> × <HighlightedValue value={params.anthocyanin?.n} placeholder="n" /> × <HighlightedValue value={params.anthocyanin?.Mw} placeholder="Mw" /> / (<HighlightedValue value={params.anthocyanin?.epsilon} placeholder="ε" /> × <HighlightedValue value={params.anthocyanin?.m} placeholder="m" />)
            </p>
            {isApplied && Object.keys(initialParams).length > 0 && (
              <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <h4 className="text-blue-800 font-semibold mb-3">적용된 계산 변수</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="bg-blue-100 rounded p-2 text-center"><div className="text-blue-700 font-medium mb-1">추출 부피 (V)</div><div className="font-bold text-blue-900">{params.anthocyanin?.V || '2'}</div></div>
                  <div className="bg-blue-100 rounded p-2 text-center"><div className="text-blue-700 font-medium mb-1">희석 배수 (n)</div><div className="font-bold text-blue-900">{params.anthocyanin?.n || '1'}</div></div>
                  <div className="bg-blue-100 rounded p-2 text-center"><div className="text-blue-700 font-medium mb-1">분자량 (Mw)</div><div className="font-bold text-blue-900">{params.anthocyanin?.Mw || '449.2'}</div></div>
                  <div className="bg-blue-100 rounded p-2 text-center"><div className="text-blue-700 font-medium mb-1">Molar absorptivity (ε)</div><div className="font-bold text-blue-900">{params.anthocyanin?.epsilon || '26900'}</div></div>
                  <div className="bg-blue-100 rounded p-2 text-center"><div className="text-blue-700 font-medium mb-1">시료 무게 (m)</div><div className="font-bold text-blue-900">{params.anthocyanin?.m || '0.02'}</div></div>
                  <div className="bg-blue-100 rounded p-2 text-center"><div className="text-blue-700 font-medium mb-1">흡광도 희석배수</div><div className="font-bold text-blue-900">{params.anthocyanin?.abs_dilution_factor || '1'}</div></div>
                </div>
              </div>
            )}
           </div>
        );
       case "pod":
       case "cat":
       case "sod":
         const enzyme = analysisType;
         
         if (enzyme === 'sod') {
             return (
                 <div className="flex flex-col space-y-4">
                   <div className="flex flex-wrap items-end gap-4">
                     <div className="flex-1 min-w-[150px]">
                       <ParamInput label="Control Absorbance" value={params.sod?.control_abs || ""} onChange={e => handleNestedParamChange('sod', 'control_abs', e.target.value)} placeholder="Absorbance of control" />
                     </div>
                     <div className="flex-1 min-w-[120px]">
                       <ParamInput label="Total Volume (μL)" value={params.sod?.total_vol || ""} onChange={e => handleNestedParamChange('sod', 'total_vol', e.target.value)} placeholder="e.g., 200" />
                     </div>
                     <div className="flex-1 min-w-[120px]">
                       <ParamInput label="Enzyme Volume (μL)" value={params.sod?.enzyme_vol || ""} onChange={e => handleNestedParamChange('sod', 'enzyme_vol', e.target.value)} placeholder="e.g., 20" />
                     </div>
                     <div className="flex-1 min-w-[150px]">
                       <ParamInput label="Enzyme Conc. (mg/mL)" value={params.sod?.enzyme_conc || ""} onChange={e => handleNestedParamChange('sod', 'enzyme_conc', e.target.value)} placeholder="Enzyme concentration" />
                     </div>
                     <div className="flex-shrink-0">
                       <Button onClick={handleApply} className="ios-button rounded-xl h-12 flex items-center justify-center px-6">
                          {isApplied && <CheckCircle className="h-4 w-4 mr-2" />}
                          {isApplied ? "적용됨" : "적용"}
                       </Button>
                     </div>
                   </div>
                    <p className="text-gray-800 font-mono p-3 bg-gray-100 rounded-lg text-center text-sm">
                       SOD activity = (inhibition% × <HighlightedValue value={params.sod?.total_vol} placeholder="total_vol"/>) / (50 × <HighlightedValue value={params.sod?.enzyme_vol} placeholder="enzyme_vol"/>) / <HighlightedValue value={params.sod?.enzyme_conc} placeholder="enzyme_conc"/>
                    </p>
                </div>
            )
         }
         // CAT and POD layout
         return (
           <div className="flex flex-col space-y-4">
             <div className="flex flex-wrap items-end gap-4">
               <div className="flex-1 min-w-[150px]">
                 <ParamInput label="ΔA/min" value={params[enzyme]?.delta_A || ""} onChange={e => handleNestedParamChange(enzyme, 'delta_A', e.target.value)} placeholder="Change in absorbance per minute" />
               </div>
               <div className="flex-1 min-w-[120px]">
                 <ParamInput label="Total Volume (μL)" value={params[enzyme]?.total_vol || ""} onChange={e => handleNestedParamChange(enzyme, 'total_vol', e.target.value)} placeholder="e.g., 200" />
               </div>
               <div className="flex-1 min-w-[120px]">
                 <ParamInput label="Enzyme Volume (μL)" value={params[enzyme]?.enzyme_vol || ""} onChange={e => handleNestedParamChange(enzyme, 'enzyme_vol', e.target.value)} placeholder="e.g., 20" />
               </div>
               <div className="flex-1 min-w-[150px]">
                 <ParamInput label="Enzyme Conc. (mg/mL)" value={params[enzyme]?.enzyme_conc || ""} onChange={e => handleNestedParamChange(enzyme, 'enzyme_conc', e.target.value)} placeholder="Enzyme concentration" />
               </div>
               <div className="flex-shrink-0">
                 <Button onClick={handleApply} className="ios-button rounded-xl h-12 flex items-center justify-center px-6">
                   {isApplied && <CheckCircle className="h-4 w-4 mr-2" />}
                   {isApplied ? "적용됨" : "적용"}
                 </Button>
               </div>
             </div>
             <p className="text-gray-800 font-mono p-3 bg-gray-100 rounded-lg text-center text-sm">
               {enzyme.toUpperCase()} activity = (<HighlightedValue value={params[enzyme]?.delta_A} placeholder="ΔA"/> × <HighlightedValue value={params[enzyme]?.total_vol} placeholder="total_vol"/> × 1000) / ({enzyme === 'cat' ? '39.4' : '26.6'} × <HighlightedValue value={params[enzyme]?.enzyme_vol} placeholder="enzyme_vol"/>) / <HighlightedValue value={params[enzyme]?.enzyme_conc} placeholder="enzyme_conc"/>
             </p>
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
