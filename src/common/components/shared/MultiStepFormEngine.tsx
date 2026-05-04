/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { FormField } from "./FormField";
import { DynamicArrayField } from "./DynamicArrayField";

interface Step {
  id: number;
  title: string;
  sections: string[];
}

interface MultiStepFormProps {
  steps: Step[];
  formConfig: any[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
  submitButtonText?: string;
  defaultValues?: Record<string, any>;
}

export const MultiStepFormEngine = ({
  steps,
  formConfig,
  onSubmit,
  onCancel,
  submitButtonText = "Confirm & Submit",
  defaultValues,
}: MultiStepFormProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const methods = useForm({
    defaultValues,
    mode: "onChange",
    shouldUnregister: false,
  });

  const handleNext = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const currentStepSections = steps[activeStep].sections;
    const fieldsToValidate = formConfig
      .filter((sec) => currentStepSections.includes(sec.id))
      .flatMap((sec: any) => sec.fields.map((f: any) => f.id));

    // Sirf current step ke fields validate honge
    const isValid = await methods.trigger(fieldsToValidate);

    if (isValid) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    if (activeStep === 0) {
      onCancel();
    } else {
      setActiveStep((prev) => prev - 1);
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="space-y-8 p-4">
        {steps.length > 1 && (
          <div className="flex items-center justify-between max-w-2xl mx-auto mb-10">
          {steps.map((step, idx) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center gap-2">
                <div
                  className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-all",
                    activeStep >= idx
                      ? "bg-slate-900 border-slate-900 text-white"
                      : "bg-white border-slate-200 text-slate-400",
                  )}
                >
                  {activeStep > idx ? <Check size={14} /> : idx + 1}
                </div>
                <span
                  className={cn(
                    "text-[9px] font-bold uppercase tracking-widest",
                    activeStep >= idx ? "text-slate-800" : "text-slate-400",
                  )}
                >
                  {step.title}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={cn(
                    "h-px flex-1 mx-4",
                    activeStep > idx ? "bg-slate-900" : "bg-slate-100",
                  )}
                />
              )}
            </React.Fragment>
          ))}
        </div>
        )}

        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {formConfig
                .filter((sec) => steps[activeStep].sections.includes(sec.id))
                .map((section) => (
                  <div key={section.id} className="mb-10">
                    {section.type === "dynamic" ? (
                      <DynamicArrayField section={section} />
                    ) : (
                      <>
                        <div className="flex flex-col mb-6 border-l-4 border-indigo-500 pl-4">
                          <h2 className="text-[13px] font-black text-slate-800 uppercase tracking-wider">
                            {section.sectionTitle}
                          </h2>
                          {section.description && (
                            <p className="text-[11px] text-slate-400">
                              {section.description}
                            </p>
                          )}
                        </div>
                        <div className="grid grid-cols-12 gap-x-5 gap-y-4">
                          {section.fields.map((field:any) => (
                            <FormField key={field.id} field={field} />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                ))}
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-between pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={handleBack}
              className="text-slate-400 font-bold text-[11px] uppercase tracking-widest hover:text-slate-600 transition-colors flex items-center gap-1"
            >
              <ChevronLeft size={14} /> {activeStep === 0 ? "Cancel" : "Back"}
            </button>

            {activeStep < steps.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="bg-slate-900 text-white px-7 py-2.5 rounded-lg font-bold text-[11px] uppercase tracking-widest flex items-center gap-2 hover:bg-slate-800 transition-all"
              >
                Next Step <ChevronRight size={14} />
              </button>
            ) : (
              <button
                type="submit"
                className="bg-indigo-600 text-white px-8 py-2.5 rounded-lg font-bold text-[11px] uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
              >
                {submitButtonText}
              </button>
            )}
          </div>
        </form>
      </div>
    </FormProvider>
  );
};
