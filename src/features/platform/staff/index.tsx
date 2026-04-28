"use client";
import React, { useState } from "react";
import AnalysisCard from "@/common/components/shared/AnalysisCard";
import { useHeader } from "@/hooks/useHeader";
import { DataTable, FilterBar, Modal } from "@/common/components/shared"; 
import { useStaff } from "./services/StaffService";
import { columns, dashStats, headerConfig, staffFilterConfigs } from "./constant/CONFIG_DATA";
import {StaffEnrollment} from "./components/StaffInrollments";

const StaffPage = () => {
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal State
  const [filters, setFilters] = useState({
    search: "",
    staffType: "",
    department: "",
    employmentStatus: ""
  });
  const pageSize = 10;

  const { data: staffResponse, isLoading, isFetching } = useStaff.usePaginatedData(
    page,
    pageSize,
    filters
  );

  const handleFilterChange = (id: string, val: string) => {
    setFilters(prev => ({ ...prev, [id]: val === 'all' ? "" : val }));
    setPage(1);
  };

  // 🔥 Header actions handle kar rahe hain
  useHeader(headerConfig, (eventName) => {
    if (eventName === "STAFF_EXPORT") console.log("Exporting...");
    if (eventName === "STAFF_ADD") setIsModalOpen(true); // Modal Open kiya
  });

  return (
    <div className="space-y-6 p-6">
      {/* 1. Filters */}
      <FilterBar
        configs={staffFilterConfigs}
        onFilterChange={handleFilterChange}
        showApplyButton={false}
      />

      {/* 2. Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashStats.map((stat) => (
          <AnalysisCard key={stat.id} {...stat} />
        ))}
      </div>

      {/* 3. Table */}
      <DataTable
        data={staffResponse?.data || []}
        columns={columns}
        total={staffResponse?.total || 0}
        page={page}
        pageSize={pageSize}
        onPageChange={(newPage) => setPage(newPage)}
        isLoading={isLoading || isFetching}
        emptyMessage="No staff records found."
      />

      {/* 4. Staff Enrollment Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Enroll New Staff"
        className="max-w-5xl" 
      >
        <div className="max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
          <StaffEnrollment onCancel={() => setIsModalOpen(false)} />
        </div>
      </Modal>
    </div>
  );
};

export default StaffPage;