
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";

const getWavelengthsForAnalysis = (analysisType) => {
  const wavelengths = {
    chlorophyll_a_b: ["665.2", "652.4", "470"],
    carotenoid: ["470", "665.2", "652.4"],
    total_phenol: ["765"],
    total_flavonoid: ["510"],
    glucosinolate: ["425"],
    dpph_scavenging: ["517"],
    anthocyanin: ["530", "600"], // Updated from "657" to "600"
    cat: ["240"],
    pod: ["470"],
    sod: ["560"],
    h2o2: ["390"]
  };
  return wavelengths[analysisType] || [];
};

export default function ManualInput({ analysisType, onSaveSample }) {
  const [treatmentName, setTreatmentName] = useState("");
  const [sampleName, setSampleName] = useState("");
  const [absorbanceValues, setAbsorbanceValues] = useState({});

  const wavelengths = getWavelengthsForAnalysis(analysisType);

  const handleAbsorbanceChange = (wavelength, value) => {
    setAbsorbanceValues(prev => ({
      ...prev,
      [wavelength]: value === '' ? '' : parseFloat(value) || 0,
    }));
  };

  const handleSave = () => {
    const processedValues = {};
    Object.entries(absorbanceValues).forEach(([key, value]) => {
      processedValues[key] = value === '' ? 0 : parseFloat(value) || 0;
    });

    const sampleData = {
      treatment_name: treatmentName,
      sample_name: sampleName,
      analysis_type: analysisType,
      absorbance_values: processedValues
    };
    onSaveSample(sampleData, false);
    setTreatmentName("");
    setSampleName("");
    setAbsorbanceValues({});
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

  const isFormValid = treatmentName.trim() && sampleName.trim() && wavelengths.every(wl => 
    absorbanceValues[wl] !== undefined && 
    absorbanceValues[wl] !== '' && 
    !isNaN(parseFloat(absorbanceValues[wl]))
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
                <Label className="text-gray-700 font-medium text-sm">Absorbance Values</Label>
                <div className="flex flex-wrap gap-4">
                    {wavelengths.map(wl => (
                        <div key={wl} className="space-y-2 flex-1 min-w-[80px]">
                            <Label className="text-gray-600 text-sm font-medium">{wl} nm</Label>
                            <Input 
                                type="number" 
                                inputMode="decimal"
                                step="any" 
                                value={absorbanceValues[wl] ?? ''} 
                                onChange={e => handleAbsorbanceChange(wl, e.target.value)} 
                                placeholder="0.000"
                                className="ios-input border-0 text-gray-900 placeholder:text-gray-400 text-center" 
                            />
                        </div>
                    ))}
                </div>
            </div>
            <Button onClick={handleSave} disabled={!isFormValid} className="w-full ios-button rounded-2xl h-14 text-white font-semibold text-base">
                Add
            </Button>
        </CardContent>
    </Card>
  );
}
