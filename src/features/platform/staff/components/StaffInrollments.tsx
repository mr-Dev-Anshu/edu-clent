// src/app/platform/staff/components/StaffEnrollment.tsx
"use client"
import { MultiStepFormEngine } from "@/common/components/shared/MultiStepFormEngine";
import { staffFormConfig } from "../constant/CONFIG_DATA";
import { useStaff } from "../services/StaffService";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner"; 

export const StaffEnrollment = ({ onCancel, onSuccess }: any) => {
  const queryClient = useQueryClient();
  
  const createStaff = useStaff.useCreate();

  const steps = [
    { id: 0, title: "Organization", sections: ["step1", "step1_details"] },
    { id: 1, title: "Personal & Bank", sections: ["step2", "step3"] },
  ];

 const handleFormSubmit = async (data: any) => {
  createStaff.mutate(data, {
    onSuccess: (res) => {
        console.log(res)
      toast.success("Staff enrolled successfully!");
      queryClient.invalidateQueries({ queryKey: ['staff', 'list'] });
      onSuccess?.();
    },
    onError: (error: any) => {
      const exactMessage = error.message; 
      console.log(exactMessage)
      toast.error(exactMessage, {
        description: "Please check the employee code or contact admin.",
        duration: 5000,
      });
    }
  });
};

  return (
    <div className="relative">
      {createStaff.isPending && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-50 flex items-center justify-center rounded-xl">
           <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-[11px] font-black uppercase tracking-widest text-slate-700">Enrolling Member...</p>
           </div>
        </div>
      )}

      <MultiStepFormEngine 
        steps={steps}
        formConfig={staffFormConfig}
        onCancel={onCancel}
        onSubmit={handleFormSubmit}
        submitButtonText={createStaff.isPending ? "Processing..." : "Enroll Staff Member"}
      />
    </div>
  );
};