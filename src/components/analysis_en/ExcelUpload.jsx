import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle, Download } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const getWavelengthsForAnalysis = (analysisType) => {
  const wavelengths = {
    chlorophyll_a_b: ["665.2", "652.4", "470"],
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

const parseCSV = (text) => {
  const lines = text.split(/\r?\n/).filter(line => line.trim());
  if (lines.length < 2) return [];

  const delimiters = [',', ';', '\t'];
  let bestDelimiter = ',';
  let maxCount = 0;

  delimiters.forEach(d => {
    const count = lines[0].split(d).length;
    if (count > maxCount) {
      maxCount = count;
      bestDelimiter = d;
    }
  });

  const headers = lines[0].split(bestDelimiter).map(h => h.trim().replace(/^"|"$/g, ''));
  
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(bestDelimiter).map(v => v.trim().replace(/^"|"$/g, ''));
    if (values.length === headers.length) {
        const row = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });
        rows.push(row);
    }
  }
  return rows;
};


export default function ExcelUpload({ analysisType, onSamplesUploaded }) {
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload({ target: { files } });
    }
  };

  const downloadSampleTemplate = () => {
    if (!analysisType) return;
    
    const wavelengths = getWavelengthsForAnalysis(analysisType);
    const headers = ['treatment_name', 'sample_name', ...wavelengths];
    
    const sampleRows = [
      ['Control', 'Rep1', ...wavelengths.map(() => '0.123')],
      ['Control', 'Rep2', ...wavelengths.map(() => '0.145')],
      ['Treatment', 'Rep1', ...wavelengths.map(() => '0.098')]
    ];
    
    const csvRows = [
      headers.join(','),
      ...sampleRows.map(row => row.join(','))
    ];

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `sample_template_${analysisType}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    setUploadResult(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        let json = [];
        
        if (file.name.endsWith('.csv')) {
          const text = e.target.result;
          json = parseCSV(text);
        } else {
          throw new Error("Only CSV files are currently supported. Please convert your Excel file to CSV.");
        }

        if (json.length === 0) {
          throw new Error("Could not read valid data from the file. Please check the file format (headers, delimiter).");
        }
        
        const wavelengths = getWavelengthsForAnalysis(analysisType);
        
        const processedSamples = json.map(row => {
          const absorbance_values = {};
          wavelengths.forEach(wl => {
            const valueStr = String(row[wl] || '0').replace(',', '.');
            const value = parseFloat(valueStr) || 0;
            absorbance_values[wl] = value;
          });
          return {
            treatment_name: row["treatment_name"] || "N/A",
            sample_name: row["sample_name"] || "N/A",
            absorbance_values,
          };
        });

        if (processedSamples.length > 0) {
            onSamplesUploaded(processedSamples);
            setUploadResult({
                success: true,
                message: `${processedSamples.length} samples uploaded successfully.`
            });
        } else {
            throw new Error("Failed to process sample data. Please check if the column names (headers) are correct.");
        }
      } catch (error) {
        setUploadResult({
          success: false,
          message: "Error processing file: " + error.message
        });
      } finally {
        setUploading(false);
      }
    };
    
    reader.onerror = (error) => {
      setUploadResult({ success: false, message: "File read error: " + error.toString() });
      setUploading(false);
    };
    
    if (file.name.endsWith('.csv')) {
      reader.readAsText(file, 'UTF-8');
    } else {
      setUploadResult({ success: false, message: "Only CSV files are supported." });
      setUploading(false);
    }
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

  return (
    <div 
        className={`ios-card ios-blur rounded-3xl ios-shadow-lg border-0 p-8 transition-all duration-300 ${
          isDragOver ? 'border-2 border-dashed border-blue-400 bg-blue-50/50' : 'border-2 border-dashed border-gray-200'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileSpreadsheet className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">File Upload</h3>
          <p className="text-gray-500 mb-2 whitespace-nowrap">Download the template, enter your data, then upload the file.</p>
          <p className="text-gray-400 text-sm mb-6">Drag your file here or click the button to upload.</p>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full mb-6">
            <Button 
              onClick={downloadSampleTemplate}
              variant="outline"
              className="h-14 flex-1 text-base rounded-2xl border-blue-300 text-blue-600 hover:bg-blue-50"
            >
              <Download className="h-5 w-5 mr-2" />
              Download Template
            </Button>
            <Button 
              onClick={() => fileInputRef.current?.click()} 
              disabled={uploading} 
              className="ios-button bg-green-600 hover:bg-green-700 h-14 flex-1 text-base rounded-2xl"
            >
              <Upload className="h-5 w-5 mr-2" />
              {uploading ? "Uploading..." : "Select File"}
            </Button>
          </div>
          
          <input 
            ref={fileInputRef} 
            type="file" 
            accept=".csv" 
            onChange={handleFileUpload} 
            className="hidden" 
          />

          {uploadResult && (
            <Alert className={`mt-4 w-full ${uploadResult.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
              <div className="flex items-center space-x-2">
                {uploadResult.success ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
                <AlertDescription className={uploadResult.success ? 'text-green-800' : 'text-red-800'}>
                  {uploadResult.message}
                </AlertDescription>
              </div>
            </Alert>
          )}
        </div>
      </div>
  );
}