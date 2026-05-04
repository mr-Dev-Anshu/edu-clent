"use client";
import React from "react";
import { BulkImporter } from "@/common/components/import/BulkImporter";
import { useClass } from "../services/ClassService";
import { useCurrentAcademicYear } from "@/hooks/useCurrentAcademicYear";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export const ClassBulkImporter = ({ onCancel, onSuccess }: any) => {
  const queryClient = useQueryClient();
  const createClass = useClass.useCreate();
  const { academicYear: currentAcademicYear } = useCurrentAcademicYear();

  const templateHeaders = [
    "Class Name",
    "Grade Level",
    "Description",
    "Section Names (comma separated)",
    "Section Capacities (comma separated)",
    "Validation Errors",
  ];

  const processData = (rawData: any[]) => {
    const passed: any[] = [];
    const failed: any[] = [];

    rawData.forEach((row, index) => {
      const errors: string[] = [];

      // Validation
      if (!row["Class Name"] || row["Class Name"].toString().trim().length === 0) {
        errors.push("Class Name is required");
      }

      if (!row["Grade Level"] || isNaN(parseInt(row["Grade Level"]))) {
        errors.push("Grade Level must be a valid number");
      }

      const sectionNames = row["Section Names (comma separated)"]
        ?.toString()
        ?.split(",")
        ?.map((s: string) => s.trim())
        ?.filter((s: string) => s) || [];

      if (sectionNames.length === 0) {
        errors.push("At least one section name is required");
      }

      if (errors.length > 0) {
        failed.push({
          ...row,
          "Validation Errors": errors.join("; "),
        });
      } else {
        passed.push({
          name: row["Class Name"].toString().trim(),
          numericLevel: parseInt(row["Grade Level"]),
          description: row["Description"]?.toString().trim() || "",
          sectionNames: sectionNames,
          sectionCapacities: (
            row["Section Capacities (comma separated)"]
              ?.toString()
              ?.split(",")
              ?.map((c: string) => {
                const parsed = parseInt(c.trim());
                return isNaN(parsed) ? 40 : parsed;
              }) || []
          ).length > 0
            ? row["Section Capacities (comma separated)"]
                ?.toString()
                ?.split(",")
                ?.map((c: string) => {
                  const parsed = parseInt(c.trim());
                  return isNaN(parsed) ? 40 : parsed;
                })
            : Array(sectionNames.length).fill(40),
        });
      }
    });

    return { passed, failed };
  };

  const handleImportSuccess = async (data: any[]) => {
    if (!currentAcademicYear?.id) {
      toast.error("Current academic year not found");
      return;
    }

    try {
      let successCount = 0;
      let errorCount = 0;

      for (const classData of data) {
        const payload = {
          name: classData.name,
          numericLevel: classData.numericLevel,
          description: classData.description,
          sections: classData.sectionNames.map((name: string, idx: number) => ({
            name,
            capacity: classData.sectionCapacities[idx] || 40,
            academicYearId: currentAcademicYear.id,
          })),
        };

        try {
          await createClass.mutateAsync(payload);
          successCount++;
        } catch {
          errorCount++;
        }
      }

      queryClient.refetchQueries({ queryKey: ["classes-with-sections"] });

      toast.success(
        `Imported ${successCount} class${successCount !== 1 ? "es" : ""}${
          errorCount > 0 ? ` (${errorCount} failed)` : ""
        }`
      );

      if (successCount > 0) {
        onSuccess?.();
      }
    } catch (error: any) {
      toast.error(error.message || "Import failed");
    }
  };

  return (
    <div className="space-y-6 p-4">
      <BulkImporter
        templateName="Classes"
        templateHeaders={templateHeaders}
        processData={processData}
        onImportSuccess={handleImportSuccess}
      />
    </div>
  );
};
