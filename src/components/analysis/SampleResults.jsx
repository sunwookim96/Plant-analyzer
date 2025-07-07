
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const getWavelengthsForAnalysis = (analysisType) => {
  const wavelengths = {
    chlorophyll_a_b: ["665.2", "652.4"],
    carotenoid: ["470", "665.2", "652.4"],
    total_phenol: ["765"],
    total_flavonoid: ["415"],
    glucosinolate: ["425"],
    dpph_scavenging: ["517"],
    anthocyanin: ["530", "600"],
    cat: ["240"],
    pod: ["470"],
    sod: ["560"],
    h2o2: ["390"]
  };
  return wavelengths[analysisType] || [];
};

const SampleEditForm = ({ sample, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    ...sample,
    absorbance_values: { ...sample.absorbance_values }
  });
  const wavelengths = getWavelengthsForAnalysis(sample.analysis_type);
  
  const handleAbsorbanceChange = (wavelength, value) => {
    setFormData(prev => ({
      ...prev,
      absorbance_values: {
        ...prev.absorbance_values,
        [wavelength]: value
      }
    }));
  };

  const handleSave = () => {
    // 빈 문자열은 0으로, 유효한 숫자는 그대로 변환
    const processedValues = {};
    Object.entries(formData.absorbance_values).forEach(([key, value]) => {
      if (value === '' || value === null || value === undefined) {
        processedValues[key] = 0;
      } else {
        const numValue = parseFloat(value);
        processedValues[key] = isNaN(numValue) ? 0 : numValue;
      }
    });

    const processedFormData = {
      ...formData,
      absorbance_values: processedValues
    };
    
    onSave(processedFormData, true);
    onCancel(); // 저장 후 다이얼로그 닫기
  };

  return (
    <DialogContent className="ios-card ios-blur rounded-3xl ios-shadow-lg border-0 p-4 sm:p-6 max-w-lg max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-gray-900 text-lg sm:text-xl font-semibold">샘플 수정</DialogTitle>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label className="text-sm font-medium">처리구 이름</Label>
            <Input 
              value={formData.treatment_name || ''} 
              onChange={e => setFormData({...formData, treatment_name: e.target.value})} 
              className="ios-input border-0 h-10" 
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">샘플 이름</Label>
            <Input 
              value={formData.sample_name || ''} 
              onChange={e => setFormData({...formData, sample_name: e.target.value})} 
              className="ios-input border-0 h-10" 
            />
          </div>
        </div>
        <div className="space-y-3">
          <Label className="text-sm font-medium">흡광도 값</Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {wavelengths.map(wl => (
              <div key={wl} className="space-y-1">
                <Label className="text-xs text-gray-600">{wl} nm</Label>
                <Input 
                  type="number" 
                  inputMode="decimal"
                  step="any"
                  value={formData.absorbance_values[wl] ?? ''} 
                  onChange={e => handleAbsorbanceChange(wl, e.target.value)} 
                  className="ios-input border-0 h-9 text-center text-sm" 
                  placeholder="0.000"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <DialogFooter className="flex-col-reverse sm:flex-row gap-2">
        <Button onClick={onCancel} variant="ghost" className="rounded-xl w-full sm:w-auto h-10">
          취소
        </Button>
        <Button onClick={handleSave} className="ios-button rounded-xl w-full sm:w-auto h-10">
          저장
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default function SampleResults({ samples, selectedIds, onSelectionChange, onEdit, onRemove, onRemoveMultiple }) {
  const [editingSample, setEditingSample] = useState(null);

  const exportResults = () => {
    if (samples.length === 0) return;
    const headers = ['처리구명', '샘플명', '분석결과', '단위', '등록일'];
    const csvRows = [
      headers.join(','),
      ...samples.map(sample => [
        `"${sample.treatment_name}"`,
        `"${sample.sample_name}"`,
        sample.result.toFixed(4),
        `"${sample.unit}"`,
        `"${new Date(sample.created_date).toLocaleDateString()}"`
      ].join(','))
    ];

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `analysis_results_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      onSelectionChange(new Set(samples.map(s => s.id)));
    } else {
      onSelectionChange(new Set());
    }
  };

  const handleSelectOne = (id, checked) => {
    const newSet = new Set(selectedIds);
    if (checked) {
      newSet.add(id);
    } else {
      newSet.delete(id);
    }
    onSelectionChange(newSet);
  };

  const handleDeleteSelected = () => {
    if (selectedIds.size > 0) {
      onRemoveMultiple(Array.from(selectedIds));
    }
  };

  const handleDeleteAll = () => {
    if (samples.length > 0) {
      onRemoveMultiple(samples.map(s => s.id));
    }
  };

  return (
    <Dialog open={!!editingSample} onOpenChange={(isOpen) => !isOpen && setEditingSample(null)}>
      <Card className="ios-card ios-blur rounded-3xl ios-shadow-lg border-0 h-full">
        <CardHeader className="pb-3">
            <div className="flex flex-col space-y-3">
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="select-all"
                        checked={selectedIds.size === samples.length && samples.length > 0}
                        onCheckedChange={handleSelectAll}
                    />
                    <CardTitle className="text-gray-900 text-base sm:text-lg font-semibold flex items-center space-x-2">
                        <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span>등록된 샘플 ({samples.length})</span>
                    </CardTitle>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    {selectedIds.size > 0 && (
                        <Button 
                            onClick={handleDeleteSelected}
                            variant="outline" 
                            size="sm"
                            className="h-8 rounded-lg bg-red-50 border-red-200 text-red-600 hover:bg-red-100 font-medium text-xs px-3"
                        >
                            <Trash2 className="h-3 w-3 mr-1" />
                            <span>선택 삭제 ({selectedIds.size})</span>
                        </Button>
                    )}
                    <Button 
                        onClick={handleDeleteAll}
                        variant="outline"
                        size="sm" 
                        className="h-8 rounded-lg bg-red-50 border-red-200 text-red-600 hover:bg-red-100 font-medium text-xs px-3"
                        disabled={samples.length === 0}
                    >
                        <Trash2 className="h-3 w-3 mr-1" />
                        <span>전체 삭제</span>
                    </Button>
                    <Button 
                        onClick={exportResults} 
                        variant="outline"
                        size="sm" 
                        className="h-8 rounded-lg bg-white/80 border-gray-300 text-gray-700 hover:bg-gray-100 font-medium text-xs px-3"
                    >
                        <Download className="h-3 w-3 mr-1" />
                        <span>내보내기</span>
                    </Button>
                </div>
            </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {samples.map((sample) => (
              <div key={sample.id} className="p-3 rounded-xl bg-white/60 ios-shadow border border-gray-100/50 flex items-center gap-2">
                <Checkbox 
                  checked={selectedIds.has(sample.id)}
                  onCheckedChange={(checked) => handleSelectOne(sample.id, checked)}
                  className="flex-shrink-0"
                />
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200 flex-shrink-0 px-2 py-0">
                      {sample.treatment_name}
                    </Badge>
                    <span className="text-gray-800 font-medium text-sm truncate">{sample.sample_name}</span>
                  </div>
                   <div className="text-xs text-gray-400 truncate">
                    흡광도: {Object.entries(sample.absorbance_values).map(([wl, val]) => 
                      `${wl}=${Number(val).toFixed(3)}`
                    ).join(", ")}
                  </div>
                </div>
                <div className="text-right flex-shrink-0 px-2">
                    <p className="text-gray-900 font-bold text-sm">
                        {Number(sample.result).toFixed(3)}
                    </p>
                    <p className="text-gray-500 text-xs">{sample.unit}</p>
                </div>
                <div className="flex items-center space-x-1 flex-shrink-0">
                  <DialogTrigger asChild>
                    <Button 
                      onClick={() => setEditingSample(sample)} 
                      variant="ghost" 
                      size="icon" 
                      className="w-7 h-7 p-0 rounded-full text-blue-600 hover:bg-blue-50"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                  </DialogTrigger>
                  <Button 
                    onClick={() => onRemove(sample.id)} 
                    variant="ghost" 
                    size="icon" 
                    className="w-7 h-7 p-0 rounded-full text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
            {samples.length === 0 && (
              <div className="text-center py-8 text-gray-500 text-sm">
                등록된 샘플이 없습니다
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      {editingSample && (
        <SampleEditForm 
          sample={editingSample} 
          onSave={onEdit} 
          onCancel={() => setEditingSample(null)} 
        />
      )}
    </Dialog>
  );
}
