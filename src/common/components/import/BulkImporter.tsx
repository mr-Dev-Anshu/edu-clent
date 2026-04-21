"use client";
import React, { useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import { Download, FileUp, AlertCircle, XCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

interface BulkImporterProps {
  templateName: string;
  // Parent batayega ki headers kya honge template ke liye
  templateHeaders: string[]; 
  // Parent batayega ki raw excel data ko process kaise karna hai
  processData: (rawData: any[]) => { passed: any[], failed: any[] };
  onImportSuccess: (data: any[]) => void;
}

export const BulkImporter = ({ 
  templateName, 
  templateHeaders, 
  processData, 
  onImportSuccess 
}: BulkImporterProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errorData, setErrorData] = useState<any[] | null>(null);

  const downloadTemplate = () => {
    const ws = XLSX.utils.aoa_to_sheet([templateHeaders]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, `${templateName}_Template.xlsx`);
  };

  const downloadErrorReport = () => {
    if (!errorData) return;
    const ws = XLSX.utils.json_to_sheet(errorData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Error_Report");
    XLSX.writeFile(wb, `${templateName}_Error_Report.xlsx`);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      
      // Raw data extract karna
      const rawData = XLSX.utils.sheet_to_json(ws, { defval: "" });
      
      // Parent ka custom logic call karna
      const { passed, failed } = processData(rawData);

      if (failed.length > 0) {
        setErrorData(failed);
        toast.error(`${failed.length} rows failed validation.`);
      } else {
        setErrorData(null);
        onImportSuccess(passed);
        toast.success("Validation successful!");
      }
    };
    reader.readAsBinaryString(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <button onClick={downloadTemplate} className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-xl hover:border-sky-500 hover:bg-sky-50 transition-all group">
          <Download size={24} className="mb-2 text-sky-500" />
          <span className="text-[13px] font-semibold text-slate-700">1. Download Template</span>
        </button>

        <button onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-all group">
          <FileUp size={24} className="mb-2 text-emerald-500" />
          <span className="text-[13px] font-semibold text-slate-700">2. Upload Sheet</span>
          <input type="file" ref={fileInputRef} className="hidden" accept=".xlsx, .xls" onChange={handleFileUpload} />
        </button>
      </div>

      {errorData && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-50 border border-red-100 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-red-700 font-bold text-sm">Errors Found</span>
            <button onClick={downloadErrorReport} className="text-[10px] bg-red-600 text-white px-2 py-1 rounded">Fix & Re-upload</button>
          </div>
          <div className="text-[11px] text-red-500 italic max-h-32 overflow-auto">
            {errorData.slice(0,3).map((err, i) => <div key={i}>• Row {i+1}: {err["Validation Errors"]}</div>)}
          </div>
        </motion.div>
      )}
    </div>
  );
};