import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import _ from "lodash";

export default function StatisticsResults({ results, lang = "ko" }) {
  const [selectedFactors, setSelectedFactors] = useState(new Set());
  const [selectedTreatments, setSelectedTreatments] = useState(new Set());
  const [selectedCompound, setSelectedCompound] = useState("all");
  const isEn = lang === "en";
  const t = {
    title: isEn ? "Statistics" : "통계 결과",
    noData: isEn ? "No data to analyze" : "분석할 데이터가 없습니다",
    upload: isEn ? "Upload PDF files first." : "PDF 파일을 업로드해주세요.",
    compound: isEn ? "Compound" : "Compound",
    selectCompound: isEn ? "Select compound" : "화합물 선택",
    allCompounds: isEn ? "All compounds" : "모든 화합물",
    mean: isEn ? "Mean" : "평균",
    se: isEn ? "SE" : "표준오차",
    n: isEn ? "n" : "샘플 수",
    noFiltered: isEn ? "No results match the selected filters." : "선택된 조건에 해당하는 결과가 없습니다.",
    filtered: isEn ? "Filtered samples" : "필터링된 샘플"
  };

  if (results.length === 0) {
    return (
      <Card className="ios-card ios-blur rounded-3xl ios-shadow-lg border-0 h-full">
        <CardHeader>
          <CardTitle className="text-gray-900 text-lg font-semibold flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>{t.title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-center flex flex-col justify-center items-center h-full">
          <div>
            <p className="text-gray-500 font-medium">{t.noData}</p>
            <p className="text-gray-400 text-sm mt-2">{t.upload}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const uniqueFactors = [...new Set(results.map(r => r.factor))];
  const uniqueTreatments = [...new Set(results.map(r => r.treatment))];
  const uniqueCompounds = [...new Set(results.map(r => r.compound))].filter(c => c);

  const handleFactorChange = (factor, checked) => {
    const newSet = new Set(selectedFactors);
    if (checked) newSet.add(factor); else newSet.delete(factor);
    setSelectedFactors(newSet);
  };

  const handleTreatmentChange = (treatment, checked) => {
    const newSet = new Set(selectedTreatments);
    if (checked) newSet.add(treatment); else newSet.delete(treatment);
    setSelectedTreatments(newSet);
  };

  const filteredResults = results.filter(result => {
    const factorMatch = selectedFactors.size === 0 || selectedFactors.has(result.factor);
    const treatmentMatch = selectedTreatments.size === 0 || selectedTreatments.has(result.treatment);
    const compoundMatch = selectedCompound === "all" || result.compound === selectedCompound;
    return factorMatch && treatmentMatch && compoundMatch && result.concentration !== null && result.concentration !== undefined && !isNaN(result.concentration);
  });

  const compoundStats = {};
  const compoundsToStat = selectedCompound === "all" ? uniqueCompounds : [selectedCompound];

  compoundsToStat.forEach(compound => {
    const compoundData = filteredResults.filter(r => r.compound === compound);
    const concentrations = compoundData.map(r => r.concentration).filter(c => c !== null && !isNaN(c));
    if (concentrations.length > 0) {
      const mean = _.mean(concentrations);
      const stdDev = concentrations.length > 1 ? Math.sqrt(_.sumBy(concentrations, c => Math.pow(c - mean, 2)) / (concentrations.length - 1)) : 0;
      const stdError = concentrations.length > 1 ? stdDev / Math.sqrt(concentrations.length) : 0;
      compoundStats[compound] = { mean, stdError, count: concentrations.length };
    }
  });

  return (
    <Card className="ios-card ios-blur rounded-3xl ios-shadow-lg border-0 h-full">
      <CardHeader>
        <CardTitle className="text-gray-900 text-lg font-semibold flex items-center space-x-2">
          <BarChart3 className="h-4 w-4" />
          <span>{t.title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">{t.compound}</h4>
            <Select value={selectedCompound} onValueChange={setSelectedCompound}>
              <SelectTrigger className="w-full"><SelectValue placeholder={t.selectCompound} /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.allCompounds}</SelectItem>
                {uniqueCompounds.map(compound => <SelectItem key={compound} value={compound}>{compound}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Factor</h4>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {uniqueFactors.map(factor => (
                <div key={factor} className="flex items-center space-x-2">
                  <Checkbox id={`factor-${factor}`} checked={selectedFactors.has(factor)} onCheckedChange={(checked) => handleFactorChange(factor, checked)} />
                  <label htmlFor={`factor-${factor}`} className="text-sm text-gray-700">{factor}</label>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Treatment</h4>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {uniqueTreatments.map(treatment => (
                <div key={treatment} className="flex items-center space-x-2">
                  <Checkbox id={`treatment-${treatment}`} checked={selectedTreatments.has(treatment)} onCheckedChange={(checked) => handleTreatmentChange(treatment, checked)} />
                  <label htmlFor={`treatment-${treatment}`} className="text-sm text-gray-700">{treatment}</label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-gray-200/60 max-h-64 overflow-y-auto">
          {Object.entries(compoundStats).map(([compound, stats]) => (
            <div key={compound} className="p-4 bg-gray-50/70 rounded-xl border border-gray-200/80">
              <h5 className="text-gray-800 font-semibold text-sm mb-2">{compound}</h5>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <h6 className="text-blue-800 font-semibold text-xs">{t.mean}</h6>
                  <p className="text-blue-900 font-bold text-lg">{stats.mean.toFixed(4)}</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <h6 className="text-green-800 font-semibold text-xs">{t.se}</h6>
                  <p className="text-green-900 font-bold text-lg">{stats.stdError.toFixed(4)}</p>
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-2">{t.n}: {stats.count}</p>
            </div>
          ))}
          {Object.keys(compoundStats).length === 0 && (
            <div className="text-center py-8"><p className="text-gray-500">{t.noFiltered}</p></div>
          )}
        </div>
        <div className="text-xs text-gray-600">{t.filtered}: {filteredResults.length}</div>
      </CardContent>
    </Card>
  );
}
