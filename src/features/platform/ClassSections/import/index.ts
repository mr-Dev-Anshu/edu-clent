/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from 'react';
import { BulkImporter } from "@/common/components/import/BulkImporter";
import { Modal } from "@/common/components/shared/Modal"; // Aapka reusable modal
import { FileSpreadsheet } from 'lucide-react';
import { toast } from 'react-hot-toast';

 const ClassSectionImporter = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const templateHeaders = ["CLASSES", "Class 1", "Class 2", "Class 3", "Class 4", "Class 5"];

  const handleProcessMatrix = (rawData: any[]) => {
    const passed: any[] = [];
    const failed: any[] = [];
    
    if (rawData.length === 0) {
      toast.error("The uploaded file is empty.");
      return { passed, failed };
    }

    const headerKeys = Object.keys(rawData[0]).filter(key => key !== "CLASSES");

    const result = headerKeys.map(key => {
      const className = rawData[0][key]; 
      if (!className) return null;

      const sections = rawData
        .slice(1) 
        .map(row => row[key])
        .filter(val => val !== undefined && val !== null && val !== ""); 

      return {
        className: className.toString(),
        sections: sections.map(s => ({ name: s.toString() }))
      };
    }).filter(Boolean);

    // 2. Validation Check
    result.forEach((cls: any) => {
      if (cls.sections.length === 0) {
        failed.push({ 
          "Class Name": cls.className, 
          "Validation Errors": "Class defined but no sections found below it." 
        });
      } else {
        passed.push(cls);
      }
    });

    return { passed, failed };
  };

  const handleFinalSubmit = async (data: any[]) => {
    try {
      console.log("🚀 Payload for Backend:", data); 
      toast.success(`${data.length} Classes & their sections imported successfully!`);
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Failed to save classes. Please try again.");
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
      >
        <FileSpreadsheet size={18} />
        <span>Import Classes</span>
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Bulk Setup: Classes & Sections"
        className="max-w-2xl" 
      >
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
            <h4 className="text-sm font-bold text-blue-900 mb-1">Matrix Format Instructions:</h4>
            <ul className="text-[12px] text-blue-800 list-disc ml-4 space-y-1">
              <li>Enter <b>Class Names</b> in the first row (10th, 9th, etc.)</li>
              <li>List <b>Sections</b> (A, B, C) vertically under each class.</li>
              <li>You can add up to as many classes as columns provided.</li>
            </ul>
          </div>

          <BulkImporter
            templateName="Class_Section_Matrix"
            templateHeaders={templateHeaders}
            processData={handleProcessMatrix}
            onImportSuccess={handleFinalSubmit}
          />
        </div>
      </Modal>
    </>
  );
};

export default ClassSectionImporter