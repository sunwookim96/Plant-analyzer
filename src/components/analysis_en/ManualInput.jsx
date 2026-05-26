import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { getMeasurementFields } from "@/utils/analysisFields";

export default function ManualInput({ analysisType, onSaveSample }) {
  const [treatmentName, setTreatmentName] = useState("");
  const [sampleName, setSampleName] = useState("");
  const [measurementValues, setMeasurementValues] = useState({});

  const fields = getMeasurementFields(analysisType, "en");

  const handleMeasurementChange = (key, value) => {
    setMeasurementValues(prev => ({
      ...prev,
      [key]: value === "" ? "" : parseFloat(value) || 0,
    }));
  };

  const buildProcessedValues = () => {
    const processedValues = {};

    fields.forEach(field => {
      const value = measurementValues[field.key];
      if (field.optional && (value === "" || value === undefined || value === null)) return;
      processedValues[field.key] = value === "" || value === undefined || value === null ? 0 : parseFloat(value) || 0;
    });

    return processedValues;
  };

  const handleSave = () => {
    const sampleData = {
      treatment_name: treatmentName,
      sample_name: sampleName,
      analysis_type: analysisType,
      absorbance_values: buildProcessedValues()
    };

    onSaveSample(sampleData, false);
    setTreatmentName("");
    setSampleName("");
    setMeasurementValues({});
  };
  
  if (!analysisType) {
    return (
      <Card className="ios-card ios-blur rounded-3xl ios-shadow-lg border-0">
        <CardContent className="p-8 text-center">
          <p className="text-gray-500 font-medium">Please select an analysis type first</p>
        </CardContent>
      </Card>
    );
  }

  const requiredFields = fields.filter(field => !field.optional);
  const isFormValid = treatmentName.trim() && sampleName.trim() && requiredFields.every(field => 
    measurementValues[field.key] !== undefined &&
    measurementValues[field.key] !== "" &&
    !isNaN(parseFloat(measurementValues[field.key]))
  );

  return (
    <Card className="ios-card ios-blur rounded-3xl ios-shadow-lg border-0 h-full">
      <CardHeader>
        <CardTitle className="text-gray-900 text-xl font-semibold flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>Add Sample Manually</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-gray-700 font-medium text-sm">Treatment Name</Label>
            <Input value={treatmentName} onChange={e => setTreatmentName(e.target.value)} placeholder="e.g., Control" className="ios-input border-0 text-gray-900 placeholder:text-gray-400" />
          </div>
          <div className="space-y-2">
            <Label className="text-gray-700 font-medium text-sm">Replicate</Label>
            <Input value={sampleName} onChange={e => setSampleName(e.target.value)} placeholder="e.g., Rep1" className="ios-input border-0 text-gray-900 placeholder:text-gray-400" />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label className="text-gray-700 font-medium text-sm">Measurement values</Label>
          <div className="flex flex-wrap gap-4">
            {fields.map(field => (
              <div key={field.key} className="space-y-2 flex-1 min-w-[140px]">
                <Label className="text-gray-600 text-sm font-medium">
                  {field.label}{field.optional ? "" : " *"}
                </Label>
                <Input 
                  type="number" 
                  inputMode="decimal"
                  step="any" 
                  value={measurementValues[field.key] ?? ""} 
                  onChange={e => handleMeasurementChange(field.key, e.target.value)} 
                  placeholder={field.placeholder || "0.000"}
                  className="ios-input border-0 text-gray-900 placeholder:text-gray-400 text-center" 
                />
              </div>
            ))}
          </div>
          {analysisType === "sod" && (
            <p className="text-xs text-gray-500 leading-relaxed">
              Leave sample dark blank empty when it was not measured; the common dark blank will be used instead.
            </p>
          )}
        </div>
        <Button onClick={handleSave} disabled={!isFormValid} className="w-full ios-button rounded-2xl h-14 text-white font-semibold text-base">
          Add
        </Button>
      </CardContent>
    </Card>
  );
}
