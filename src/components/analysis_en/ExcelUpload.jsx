import React, { useState, useRef } from "react";
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getFieldValueFromRow, getMeasurementFields } from "@/utils/analysisFields";

const parseCSV = (text) => {
  const lines = text.split(/\r?\n/).filter(line => line.trim());
  if (lines.length < 2) return [];

  const delimiters = [",", ";", "\t"];
  let bestDelimiter = ",";
  let maxCount = 0;

  delimiters.forEach(delimiter => {
    const count = lines[0].split(delimiter).length;
    if (count > maxCount) {
      maxCount = count;
      bestDelimiter = delimiter;
    }
  });

  const headers = lines[0].replace(/^\uFEFF/, "").split(bestDelimiter).map(header => header.trim().replace(/^"|"$/g, ""));
  
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(bestDelimiter).map(value => value.trim().replace(/^"|"$/g, ""));
    if (values.length === headers.length) {
      const row = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || "";
      });
      rows.push(row);
    }
  }

  return rows;
};

const getExampleValue = (analysisType, field, rowIndex) => {
  if (field.optional) return "";
  if (analysisType === "cat") return ["-0.048", "-0.052", "-0.044"][rowIndex] || "-0.050";
  if (analysisType === "pod") return ["0.085", "0.092", "0.078"][rowIndex] || "0.080";
  if (analysisType === "sod" && field.key === "560") return ["0.420", "0.455", "0.390"][rowIndex] || "0.400";
  return ["0.123", "0.145", "0.098"][rowIndex] || "0.000";
};

export default function ExcelUpload({ analysisType, onSamplesUploaded }) {
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const fields = getMeasurementFields(analysisType, "en");

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
    const { files } = e.dataTransfer;
    if (files.length > 0) {
      handleFileUpload({ target: { files } });
    }
  };

  const downloadSampleTemplate = () => {
    if (!analysisType) return;
    
    const headers = ["treatment_name", "sample_name", ...fields.map(field => field.key)];
    const sampleRows = ["Rep1", "Rep2", "Rep3"].map((replicate, rowIndex) => [
      rowIndex < 2 ? "Control" : "Treatment",
      replicate,
      ...fields.map(field => getExampleValue(analysisType, field, rowIndex))
    ]);
    
    const csvRows = [headers.join(","), ...sampleRows.map(row => row.join(","))];
    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
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
        
        if (file.name.toLowerCase().endsWith(".csv")) {
          json = parseCSV(e.target.result);
        } else {
          throw new Error("CSV files are currently supported. Please save the Excel sheet as CSV and upload it again.");
        }

        if (json.length === 0) {
          throw new Error("Could not read valid data from the file. Please check the headers and delimiter.");
        }

        const processedSamples = json.map(row => {
          const absorbance_values = {};

          fields.forEach(field => {
            const rawValue = getFieldValueFromRow(row, field);
            if (field.optional && rawValue === "") return;

            const valueStr = String(rawValue || "0").replace(",", ".");
            absorbance_values[field.key] = parseFloat(valueStr) || 0;
          });

          return {
            treatment_name: row.treatment_name || row["Treatment Name"] || "N/A",
            sample_name: row.sample_name || row["Sample Name"] || "N/A",
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
          throw new Error("Failed to process sample data. Please check the column names.");
        }
      } catch (error) {
        setUploadResult({
          success: false,
          message: "Error processing file: " + error.message
        });
      } finally {
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };
    
    reader.onerror = (error) => {
      setUploadResult({ success: false, message: "File read error: " + error.toString() });
      setUploading(false);
    };
    
    if (file.name.toLowerCase().endsWith(".csv")) {
      reader.readAsText(file, "UTF-8");
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
        isDragOver ? "border-2 border-dashed border-blue-400 bg-blue-50/50" : "border-2 border-dashed border-gray-200"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <FileSpreadsheet className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">CSV Upload</h3>
        <p className="text-gray-500 mb-2">Download the template, fill it in Excel, save it as CSV, then upload it.</p>
        <p className="text-gray-400 text-sm mb-3">Required columns: treatment_name, sample_name, {fields.filter(field => !field.optional).map(field => field.key).join(", ")}</p>
        {fields.some(field => field.optional) && (
          <p className="text-gray-400 text-xs mb-6">Optional columns: {fields.filter(field => field.optional).map(field => field.key).join(", ")}</p>
        )}
        {!fields.some(field => field.optional) && <div className="mb-3" />}
        
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
          <Alert className={`mt-4 w-full ${uploadResult.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
            <div className="flex items-center space-x-2">
              {uploadResult.success ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600" />
              )}
              <AlertDescription className={uploadResult.success ? "text-green-800" : "text-red-800"}>
                {uploadResult.message}
              </AlertDescription>
            </div>
          </Alert>
        )}
      </div>
    </div>
  );
}
