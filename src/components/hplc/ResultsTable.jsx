import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Database } from "lucide-react";
import { isCalibrationCurveHplcType } from "@/data/hplcProtocols";

export default function ResultsTable({ results, analysisType, lang = "ko" }) {
  const isEn = lang === "en";
  const unit = isCalibrationCurveHplcType(analysisType) ? "mg/g DW" : "µmol/g dry wt.";

  const handleExport = () => {
    if (results.length === 0) return;
    const headers = ["Sample Name", "Factor", "Treatment", "Replicate", "Compound", "Standard_RT", "Matched_RT", "Area", unit];
    const csvRows = [headers.join(",")];

    results.forEach(result => {
      csvRows.push([
        `"${result.sampleName}"`,
        `"${result.factor}"`,
        `"${result.treatment}"`,
        `"${result.replicate}"`,
        `"${result.compound}"`,
        result.standardRT?.toFixed(2) || "",
        result.matchedRT?.toFixed(2) || "",
        result.area || "",
        result.concentration !== null && result.concentration !== undefined && !isNaN(result.concentration) ? result.concentration.toFixed(6) : ""
      ].join(","));
    });

    const csvContent = csvRows.join("\n");
    const blob = new Blob([`\uFEFF${csvContent}`], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `hplc_results_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (results.length === 0) return null;

  const t = {
    title: isEn ? `Analysis results (${results.length})` : `분석 결과 (${results.length})`,
    export: isEn ? "Export CSV" : "CSV 내보내기",
    sample: isEn ? "Sample" : "Sample",
    factor: isEn ? "Factor" : "Factor",
    treatment: isEn ? "Treatment" : "Treatment",
    rep: isEn ? "Rep" : "Rep",
    compound: isEn ? "Compound" : "Compound",
    stdRT: isEn ? "Std RT" : "Std RT",
    matchRT: isEn ? "Match RT" : "Match RT",
    area: isEn ? "Area" : "Area"
  };

  return (
    <Card className="ios-card ios-blur rounded-3xl ios-shadow-lg border-0">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-gray-900 text-xl font-semibold flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>{t.title}</span>
          </CardTitle>
          <Button onClick={handleExport} variant="outline" size="sm" className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>{t.export}</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto max-h-96">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-white/80 backdrop-blur-sm">
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-2 font-semibold text-gray-700">{t.sample}</th>
                <th className="text-left py-2 px-2 font-semibold text-gray-700">{t.factor}</th>
                <th className="text-left py-2 px-2 font-semibold text-gray-700">{t.treatment}</th>
                <th className="text-left py-2 px-2 font-semibold text-gray-700">{t.rep}</th>
                <th className="text-left py-2 px-2 font-semibold text-gray-700">{t.compound}</th>
                <th className="text-right py-2 px-2 font-semibold text-gray-700">{t.stdRT}</th>
                <th className="text-right py-2 px-2 font-semibold text-gray-700">{t.matchRT}</th>
                <th className="text-right py-2 px-2 font-semibold text-gray-700">{t.area}</th>
                <th className="text-right py-2 px-2 font-semibold text-gray-700">{unit}</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50/50">
                  <td className="py-2 px-2 text-gray-900 font-medium truncate" title={result.sampleName}>{result.sampleName}</td>
                  <td className="py-2 px-2 text-gray-700">{result.factor}</td>
                  <td className="py-2 px-2 text-gray-700">{result.treatment}</td>
                  <td className="py-2 px-2 text-gray-700">{result.replicate}</td>
                  <td className="py-2 px-2 text-gray-700">{result.compound}</td>
                  <td className="py-2 px-2 text-gray-700 font-mono text-right">{result.standardRT ? result.standardRT.toFixed(2) : "-"}</td>
                  <td className="py-2 px-2 text-gray-700 font-mono text-right">{result.matchedRT ? result.matchedRT.toFixed(2) : "-"}</td>
                  <td className="py-2 px-2 text-gray-700 font-mono text-right">{result.area !== null ? Number(result.area).toPrecision(6) : "-"}</td>
                  <td className="py-2 px-2 text-gray-700 font-mono text-right">{result.concentration !== null && !isNaN(result.concentration) ? Number(result.concentration).toFixed(4) : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
