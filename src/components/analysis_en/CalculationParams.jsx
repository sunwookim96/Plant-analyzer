
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calculator, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

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
  const [isApplied, setIsApplied] = useState(Object.keys(initialParams).length > 0);

  // initialParams가 변경되거나 analysisType이 변경될 때 params 업데이트
  useEffect(() => {
    setParams(initialParams);
    // 초기 params가 있으면 적용된 상태로 표시
    setIsApplied(Object.keys(initialParams).length > 0);
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
      case "carotenoid":
        return (
          <motion.div layout className="flex items-end gap-4">
            <div className="flex-grow space-y-2">
              <Label className="text-gray-600 text-sm">Dilution Factor</Label>
              <Input
                type="number"
                value={params.dilutionFactor || ""}
                onChange={(e) => handleParamChange('dilutionFactor', e.target.value)}
                placeholder="e.g., 1, 10"
                className="ios-input border-0 text-gray-900 placeholder:text-gray-400"
              />
            </div>
            <Button onClick={handleApply} className="ios-button rounded-xl h-12 flex-shrink-0 flex items-center justify-center">
              {isApplied && params.dilutionFactor ? <CheckCircle className="h-4 w-4 mr-2" /> : null}
              {isApplied && params.dilutionFactor ? "Applied" : "Apply"}
            </Button>
            {isApplied && params.dilutionFactor && (
              <motion.div
                initial={{ opacity: 0, width: 0, x: -20 }}
                animate={{ opacity: 1, width: 'auto', x: 0 }}
                exit={{ opacity: 0, width: 0, x: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="bg-blue-50 border border-blue-200 rounded-xl h-12 flex items-center px-4"
              >
                <p className="text-blue-800 font-semibold whitespace-nowrap">
                  Applied factor: {params.dilutionFactor}
                </p>
              </motion.div>
            )}
          </motion.div>
        );
      case "total_phenol":
      case "total_flavonoid":
        return (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-end gap-4">
              <div className="flex-1 w-full"><ParamInput label="Slope (a)" value={params.std_a || ""} onChange={e => handleParamChange('std_a', e.target.value)} placeholder="Standard curve's slope" /></div>
              <div className="flex-1 w-full"><ParamInput label="Y-intercept (b)" value={params.std_b || ""} onChange={e => handleParamChange('std_b', e.target.value)} placeholder="Standard curve's y-intercept" /></div>
              <Button onClick={handleApply} className="ios-button rounded-xl h-12 w-full sm:w-auto flex items-center justify-center">
                {isApplied && <CheckCircle className="h-4 w-4 mr-2" />}
                {isApplied ? "Applied" : "Apply"}
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
            <div className="flex flex-wrap items-end gap-4">
              <div className="flex-1 min-w-[150px]">
                <ParamInput
                  label="Slope (a)"
                  value={params.h2o2?.a || ""}
                  onChange={e => handleNestedParamChange('h2o2', 'a', e.target.value)}
                  placeholder="H₂O₂ standard curve slope"
                />
              </div>
              <div className="flex-1 min-w-[150px]">
                <ParamInput
                  label="Y-intercept (b)"
                  value={params.h2o2?.b || ""}
                  onChange={e => handleNestedParamChange('h2o2', 'b', e.target.value)}
                  placeholder="Default: 0 allowed"
                />
              </div>
              <div className="flex-1 min-w-[120px]">
                <ParamInput
                  label="Extraction volume (mL)"
                  value={params.h2o2?.vol || ""}
                  onChange={e => handleNestedParamChange('h2o2', 'vol', e.target.value)}
                  placeholder="Default: 2"
                />
              </div>
              <div className="flex-1 min-w-[120px]">
                <ParamInput
                  label="Dry weight (g)"
                  value={params.h2o2?.dw || ""}
                  onChange={e => handleNestedParamChange('h2o2', 'dw', e.target.value)}
                  placeholder="Default: 0.02"
                />
              </div>
              <div className="flex-shrink-0">
                <Button onClick={handleApply} className="ios-button rounded-xl h-12 flex items-center justify-center px-6">
                  {isApplied && <CheckCircle className="h-4 w-4 mr-2" />}
                  {isApplied ? "Applied" : "Apply"}
                </Button>
              </div>
            </div>
            <div className="text-gray-800 font-mono p-3 bg-gray-100 rounded-lg text-sm leading-relaxed text-center">
              H₂O₂ (μmol/g DW) = ((A390 − b) / a) × <HighlightedValue value={params.h2o2?.vol} placeholder="2 mL" /> / <HighlightedValue value={params.h2o2?.dw} placeholder="0.02 g" />
            </div>
          </div>
        );
      case "dpph_scavenging":
        return (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-end gap-4">
              <div className="flex-1 w-full"><ParamInput label="Control Absorbance" value={params.dpph_control || ""} onChange={e => handleParamChange('dpph_control', e.target.value)} placeholder="Absorbance of control" /></div>
              <Button onClick={handleApply} className="ios-button rounded-xl h-12 w-full sm:w-auto flex items-center justify-center">
                 {isApplied && <CheckCircle className="h-4 w-4 mr-2" />}
                 {isApplied ? "Applied" : "Apply"}
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
                <ParamInput label="Extraction Vol (V, mL)" value={params.anthocyanin?.V || ""} onChange={e => handleNestedParamChange('anthocyanin', 'V', e.target.value)} placeholder="Default: 2" />
              </div>
              <div className="flex-1 min-w-[120px]">
                <ParamInput label="Dilution Factor (n)" value={params.anthocyanin?.n || ""} onChange={e => handleNestedParamChange('anthocyanin', 'n', e.target.value)} placeholder="Default: 1" />
              </div>
              <div className="flex-1 min-w-[120px]">
                <ParamInput label="Molecular Weight (Mw)" value={params.anthocyanin?.Mw || ""} onChange={e => handleNestedParamChange('anthocyanin', 'Mw', e.target.value)} placeholder="Default: 449.2" />
              </div>
              <div className="flex-1 min-w-[120px]">
                <ParamInput label="Molar absorptivity (ε)" value={params.anthocyanin?.epsilon || ""} onChange={e => handleNestedParamChange('anthocyanin', 'epsilon', e.target.value)} placeholder="Default: 26900" />
              </div>
              <div className="flex-1 min-w-[120px]">
                <ParamInput label="Sample Weight (m, g)" value={params.anthocyanin?.m || ""} onChange={e => handleNestedParamChange('anthocyanin', 'm', e.target.value)} placeholder="Default: 0.02" />
              </div>
              <div className="flex-shrink-0">
                <Button onClick={handleApply} className="ios-button rounded-xl h-12 mt-6 flex items-center justify-center px-6">
                  {isApplied && <CheckCircle className="h-4 w-4 mr-2" />}
                  {isApplied ? "Applied" : "Apply"}
                </Button>
              </div>
            </div>
            <p className="text-gray-800 font-mono p-3 bg-gray-100 rounded-lg text-center text-sm">
              Anthocyanin = (A530 - A600) × <HighlightedValue value={params.anthocyanin?.V} placeholder="V" /> × <HighlightedValue value={params.anthocyanin?.n} placeholder="n" /> × <HighlightedValue value={params.anthocyanin?.Mw} placeholder="Mw" /> / (<HighlightedValue value={params.anthocyanin?.epsilon} placeholder="ε" /> × <HighlightedValue value={params.anthocyanin?.m} placeholder="m" />)
            </p>
           </div>
        );
      case "sod":
        return (
          <div className="flex flex-col space-y-4">
            <div className="flex flex-wrap items-end gap-4">
              <div className="flex-1 min-w-[150px]">
                <ParamInput label="Light control A560" value={params.sod?.light_control_abs || ""} onChange={e => handleNestedParamChange('sod', 'light_control_abs', e.target.value)} placeholder="e.g., 0.800" />
              </div>
              <div className="flex-1 min-w-[150px]">
                <ParamInput label="Dark blank A560" value={params.sod?.dark_blank_abs || ""} onChange={e => handleNestedParamChange('sod', 'dark_blank_abs', e.target.value)} placeholder="e.g., 0.050" />
              </div>
              <div className="flex-1 min-w-[120px]">
                <ParamInput label="Dilution Factor (DF)" value={params.sod?.dilutionFactor || ""} onChange={e => handleNestedParamChange('sod', 'dilutionFactor', e.target.value)} placeholder="Default: 1" />
              </div>
              <div className="flex-shrink-0">
                <Button onClick={handleApply} className="ios-button rounded-xl h-12 flex items-center justify-center px-6">
                  {isApplied && <CheckCircle className="h-4 w-4 mr-2" />}
                  {isApplied ? "Applied" : "Apply"}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-gray-800 font-mono p-3 bg-gray-100 rounded-lg text-sm leading-relaxed text-center">
                Control<sub>corr</sub> = light control − dark blank, Sample<sub>corr</sub> = sample A560 − sample dark blank or dark blank
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
                <ParamInput label="H₂O₂ control slope" value={params.cat?.h2o2_control_slope || ""} onChange={e => handleNestedParamChange('cat', 'h2o2_control_slope', e.target.value)} placeholder="e.g., -0.005" />
              </div>
              <div className="flex-1 min-w-[120px]">
                <ParamInput label="Path length (cm)" value={params.cat?.pathlength || ""} onChange={e => handleNestedParamChange('cat', 'pathlength', e.target.value)} placeholder="Default: 1" />
              </div>
              <div className="flex-1 min-w-[120px]">
                <ParamInput label="Dilution Factor (DF)" value={params.cat?.dilutionFactor || ""} onChange={e => handleNestedParamChange('cat', 'dilutionFactor', e.target.value)} placeholder="Default: 1" />
              </div>
              <div className="flex-shrink-0">
                <Button onClick={handleApply} className="ios-button rounded-xl h-12 flex items-center justify-center px-6">
                  {isApplied && <CheckCircle className="h-4 w-4 mr-2" />}
                  {isApplied ? "Applied" : "Apply"}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-gray-800 font-mono p-3 bg-gray-100 rounded-lg text-center text-sm">
                ΔA<sub>corr</sub>/min = −(sample slope − H₂O₂ control slope)
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
                <ParamInput label="Blank slope" value={params.pod?.blank_slope || ""} onChange={e => handleNestedParamChange('pod', 'blank_slope', e.target.value)} placeholder="e.g., 0.002" />
              </div>
              <div className="flex-1 min-w-[120px]">
                <ParamInput label="Path length (cm)" value={params.pod?.pathlength || ""} onChange={e => handleNestedParamChange('pod', 'pathlength', e.target.value)} placeholder="Default: 1" />
              </div>
              <div className="flex-1 min-w-[120px]">
                <ParamInput label="Dilution Factor (DF)" value={params.pod?.dilutionFactor || ""} onChange={e => handleNestedParamChange('pod', 'dilutionFactor', e.target.value)} placeholder="Default: 1" />
              </div>
              <div className="flex-shrink-0">
                <Button onClick={handleApply} className="ios-button rounded-xl h-12 flex items-center justify-center px-6">
                  {isApplied && <CheckCircle className="h-4 w-4 mr-2" />}
                  {isApplied ? "Applied" : "Apply"}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-gray-800 font-mono p-3 bg-gray-100 rounded-lg text-center text-sm">
                ΔA<sub>corr</sub>/min = sample slope − blank slope
              </div>
              <div className="text-gray-800 font-mono p-3 bg-gray-100 rounded-lg text-center text-sm">
                POD activity = ΔA<sub>corr</sub>/min × 0.0376 / <HighlightedValue value={params.pod?.pathlength} placeholder="l" /> × <HighlightedValue value={params.pod?.dilutionFactor} placeholder="DF" /> (μmol/min/mg DW)
              </div>
              <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                Because ε = 26.6 mM⁻¹ cm⁻¹, do not multiply the POD equation by 1000.
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
          <span>Input Calculation Parameters</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {renderedParams}
      </CardContent>
    </Card>
  );
}
