import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calculator, CheckCircle } from "lucide-react";
import { getHplcCompounds, isCalibrationCurveHplcType } from "@/data/hplcProtocols";

const HighlightedValue = ({ value, placeholder }) => (
  <span className={`transition-colors duration-300 ${value !== "" && value !== undefined && value !== null ? "text-blue-600 font-bold" : "text-gray-500"}`}>
    {value !== "" && value !== undefined && value !== null ? value : placeholder}
  </span>
);

const getShortName = (compoundName) => {
  const shortNames = {
    "4-Hydroxybenzoic acid": "4-Hydroxybenzoic",
    "(-)-Epicatechin": "Epicatechin",
    "4-Hydroxy-3-benzoic acid": "4-Hydroxy-3-benzoic",
    "p-Coumaric acid": "p-Coumaric",
    "trans-Ferulic acid": "trans-Ferulic",
    "trans-Cinnamic acid": "trans-Cinnamic",
    "4-Hydroxyglucobrassicin": "4-Hydroxygluco",
    "Glucobrassicanapin": "Glucobrassican",
    "4-Methoxyglucobrassicin": "4-Methoxygluco"
  };
  return shortNames[compoundName] || compoundName;
};

export default function CalculationInput({ analysisType, onCalculationParamsChange, initialValues = {}, lang = "ko" }) {
  const [params, setParams] = useState({});
  const [isApplied, setIsApplied] = useState(false);
  const isEn = lang === "en";
  const compounds = getHplcCompounds(analysisType, lang);
  const usesCalibrationCurve = isCalibrationCurveHplcType(analysisType);

  useEffect(() => {
    setParams(initialValues);
    setIsApplied(Object.keys(initialValues).length > 0 && Object.values(initialValues).some(v => v !== "" && v !== undefined));
  }, [initialValues]);

  const handleParamChange = (key, value) => {
    setParams(prev => ({ ...prev, [key]: value }));
    setIsApplied(false);
  };

  const handleApply = () => {
    onCalculationParamsChange(params);
    setIsApplied(true);
  };

  const t = {
    title: isEn ? "Calculation parameters" : "분석 변수 입력",
    apply: isEn ? "Apply" : "적용",
    applied: isEn ? "Applied" : "적용됨",
    descCalibration: isEn
      ? "Enter the calibration equation for each compound and the extraction parameters. Calibration model: Area = a × C + b, where C is μg/mL."
      : "각 화합물의 표준곡선과 추출 조건을 입력하세요. 표준곡선 모델은 Area = a × C + b, C는 μg/mL입니다.",
    descGeneric: isEn ? "Enter the variables required for the selected HPLC calculation." : "계산에 필요한 변수들을 입력하세요.",
    sampleWeight: isEn ? "Sample weight (g)" : "시료 무게 (g)",
    extractionVolume: isEn ? "Extraction volume (mL)" : "추출 부피 (mL)",
    dilutionFactor: isEn ? "Dilution factor (DF)" : "희석배수 (DF)",
    slope: isEn ? "Slope (a)" : "기울기 (a)",
    intercept: isEn ? "Intercept (b)" : "절편 (b)",
    variableInput: isEn ? "Calibration variables" : "표준곡선 변수",
    appliedVars: isEn ? "Applied variables" : "적용된 변수",
    formula: isEn ? "Formula" : "계산 공식",
    notEntered: isEn ? "not entered" : "미입력",
    standardArea: isEn ? "Standard area" : "표준 Area",
    molecularWeight: isEn ? "Molecular weight (MW)" : "분자량 (MW)",
    conversionFactor: isEn ? "Conversion factor" : "환산계수",
    sampleAreaPlaceholder: isEn ? "sample Area" : "샘플 Area",
    stdAreaPlaceholder: isEn ? "standard Area" : "표준 Area"
  };

  if (usesCalibrationCurve) {
    return (
      <Card className="ios-card ios-blur rounded-3xl ios-shadow-lg border-0">
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="text-gray-900 text-xl font-semibold flex items-center space-x-2">
              <Calculator className="h-5 w-5" />
              <span>{t.title}</span>
            </CardTitle>
            <Button
              onClick={handleApply}
              className={`ios-button rounded-xl h-10 px-6 flex items-center space-x-2 ${
                isApplied ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isApplied && <CheckCircle className="h-4 w-4" />}
              <span>{isApplied ? t.applied : t.apply}</span>
            </Button>
          </div>
          <p className="text-gray-600 text-sm">{t.descCalibration}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <Label className="text-gray-700 font-medium text-sm">{t.sampleWeight}</Label>
              <Input
                type="number"
                step="any"
                placeholder={analysisType === "lamiaceae_markers" ? "0.1" : "0.1"}
                value={params.sampleWeight || ""}
                onChange={(e) => handleParamChange("sampleWeight", e.target.value)}
                className="ios-input border-0 text-gray-900 placeholder:text-gray-400"
              />
            </div>
            <div>
              <Label className="text-gray-700 font-medium text-sm">{t.extractionVolume}</Label>
              <Input
                type="number"
                step="any"
                placeholder="10"
                value={params.extractionVolume || ""}
                onChange={(e) => handleParamChange("extractionVolume", e.target.value)}
                className="ios-input border-0 text-gray-900 placeholder:text-gray-400"
              />
            </div>
            <div>
              <Label className="text-gray-700 font-medium text-sm">{t.dilutionFactor}</Label>
              <Input
                type="number"
                step="any"
                placeholder="1"
                value={params.dilutionFactor || ""}
                onChange={(e) => handleParamChange("dilutionFactor", e.target.value)}
                className="ios-input border-0 text-gray-900 placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="space-y-4 max-h-72 overflow-y-auto border border-gray-200 rounded-xl p-3 bg-gray-50/30">
            <h4 className="text-gray-800 font-semibold text-sm mb-2">{t.variableInput}</h4>
            {compounds.map(compound => (
              <div key={compound} className="p-3 bg-white rounded-xl border border-gray-200 shadow-sm">
                <h5 className="text-gray-800 font-semibold text-sm mb-3 truncate" title={compound}>{getShortName(compound)}</h5>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-gray-600 text-xs">{t.slope}</Label>
                    <Input
                      type="number"
                      step="any"
                      placeholder="0.00"
                      value={params[`${compound}_a`] || ""}
                      onChange={(e) => handleParamChange(`${compound}_a`, e.target.value)}
                      className="ios-input border-0 text-gray-900 placeholder:text-gray-400 text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-600 text-xs">{t.intercept}</Label>
                    <Input
                      type="number"
                      step="any"
                      placeholder="0.00"
                      value={params[`${compound}_b`] ?? ""}
                      onChange={(e) => handleParamChange(`${compound}_b`, e.target.value)}
                      className="ios-input border-0 text-gray-900 placeholder:text-gray-400 text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {isApplied && (
            <div className="applied-summary max-h-64 overflow-y-auto p-4 bg-blue-50 rounded-xl border border-blue-200">
              <h4 className="text-blue-800 font-semibold text-sm mb-2">{t.appliedVars}</h4>
              <p className="text-blue-800 text-xs font-semibold mb-3">
                {t.sampleWeight}: {params.sampleWeight || t.notEntered}g / {t.extractionVolume}: {params.extractionVolume || t.notEntered}mL / DF: {params.dilutionFactor || "1"}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {compounds.map(compound => {
                  const aValue = params[`${compound}_a`];
                  const bValue = params[`${compound}_b`];
                  if (aValue || bValue === 0 || bValue) {
                    return (
                      <div key={compound} className="p-3 bg-blue-100 rounded-xl border border-blue-300">
                        <h5 className="text-blue-800 font-semibold text-sm mb-2 truncate" title={compound}>{getShortName(compound)}</h5>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div><span className="text-blue-700">a: </span><span className="font-bold text-blue-900">{aValue || t.notEntered}</span></div>
                          <div><span className="text-blue-700">b: </span><span className="font-bold text-blue-900">{bValue !== undefined && bValue !== "" ? bValue : t.notEntered}</span></div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          )}

          <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <h4 className="text-gray-800 font-semibold mb-2">{t.formula}</h4>
            <div className="text-gray-700 text-sm space-y-1 font-mono leading-relaxed">
              <p>• C(µg/mL) = (Area − b) / a</p>
              <p>• mg/g DW = C × <HighlightedValue value={params.extractionVolume} placeholder="V(mL)"/> × <HighlightedValue value={params.dilutionFactor || "1"} placeholder="DF"/> / <HighlightedValue value={params.sampleWeight} placeholder="sample weight(g)"/> / 1000</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="ios-card ios-blur rounded-3xl ios-shadow-lg border-0">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-gray-900 text-xl font-semibold flex items-center space-x-2">
            <Calculator className="h-5 w-5" />
            <span>{t.title}</span>
          </CardTitle>
          <Button
            onClick={handleApply}
            className={`ios-button rounded-xl h-10 px-6 flex items-center space-x-2 ${
              isApplied ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isApplied && <CheckCircle className="h-4 w-4" />}
            <span>{isApplied ? t.applied : t.apply}</span>
          </Button>
        </div>
        <p className="text-gray-600 text-sm">{t.descGeneric}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-gray-700 font-medium text-sm">{t.standardArea}</Label>
            <Input type="number" step="any" placeholder={isEn ? "Area of standard compound" : "표준 화합물의 Area 값"} value={params.standardArea || ""} onChange={(e) => handleParamChange("standardArea", e.target.value)} className="ios-input border-0 text-gray-900 placeholder:text-gray-400"/>
          </div>
          <div>
            <Label className="text-gray-700 font-medium text-sm">{t.molecularWeight}</Label>
            <Input type="number" step="any" placeholder={isEn ? "Molecular weight" : "화합물의 분자량"} value={params.molecularWeight || ""} onChange={(e) => handleParamChange("molecularWeight", e.target.value)} className="ios-input border-0 text-gray-900 placeholder:text-gray-400"/>
          </div>
          <div>
            <Label className="text-gray-700 font-medium text-sm">{t.sampleWeight}</Label>
            <Input type="number" step="any" placeholder={isEn ? "Sample weight in grams" : "시료의 무게 (그램)"} value={params.sampleWeight || ""} onChange={(e) => handleParamChange("sampleWeight", e.target.value)} className="ios-input border-0 text-gray-900 placeholder:text-gray-400"/>
          </div>
          <div>
            <Label className="text-gray-700 font-medium text-sm">{t.conversionFactor}</Label>
            <Input type="number" value={params.conversionFactor || "1"} onChange={(e) => handleParamChange("conversionFactor", e.target.value)} className="ios-input border-0 text-gray-900 placeholder:text-gray-400"/>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <h4 className="text-gray-800 font-semibold mb-2">{t.formula}</h4>
          <p className="text-gray-700 text-sm font-mono break-words leading-relaxed">
            µmol/g dry wt. = (<HighlightedValue value={null} placeholder={t.sampleAreaPlaceholder}/> / <HighlightedValue value={params.standardArea} placeholder={t.stdAreaPlaceholder}/>) × 0.5 / <HighlightedValue value={params.molecularWeight} placeholder="MW"/> × 1000 / <HighlightedValue value={params.sampleWeight} placeholder="sample weight"/> × <HighlightedValue value={params.conversionFactor || "1"} placeholder="factor"/>
          </p>
          {isApplied && (
            <div className="applied-summary mt-3 p-2 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-blue-800 text-xs font-semibold">
                {t.appliedVars}: standardArea={params.standardArea || t.notEntered}, MW={params.molecularWeight || t.notEntered}, sampleWeight={params.sampleWeight || t.notEntered}g, factor={params.conversionFactor || "1"}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
