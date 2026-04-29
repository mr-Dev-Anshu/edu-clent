"use client";

import { useState } from "react";
import AnalysisCard from "@/common/components/shared/AnalysisCard";
import { DataTable, FilterBar, Modal } from "@/common/components/shared";
import { useHeader } from "@/hooks/useHeader";
import { SortState } from "@/types";
import { StudentEnrollment } from "./components/StudentEnrollment";
import {
  ANALYSIS_CARDS,
  FILTER_CONFIGS,
  STUDENT_HEADER_CONFIG,
  TABLE_COLUMNS,
} from "./constant/CONFIG_DATA";
import { useStudentService } from "./services/StudentService";
import { StudentType } from "./types";

export const StudentPage = () => {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    gender: "",
    status: "",
    classId: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sort, setSort] = useState<SortState | null>(null);
  const pageSize = 10;

  useHeader(STUDENT_HEADER_CONFIG, (eventName) => {
    if (eventName === "add-student") {
      setIsModalOpen(true);
    }
  });

  const {
    data: studentResponse,
    isLoading,
    isFetching,
  } = useStudentService.usePaginatedData(page, pageSize, filters);

  const handleFilterChange = (id: string, value: string) => {
    setFilters((previous) => ({
      ...previous,
      [id]: value === "all" ? "" : value,
    }));
    setPage(1);
  };

  const handleSort = (key: string) => {
    setSort((current) => {
      if (current?.key === key) {
        return {
          key,
          direction: current.direction === "asc" ? "desc" : "asc",
        };
      }

      return { key, direction: "asc" };
    });
  };

  const students = [...(studentResponse?.data ?? [])];

  if (sort?.key === "admissionNumber") {
    students.sort((left, right) => {
      const comparison = left.admissionNumber.localeCompare(
        right.admissionNumber,
      );

      return sort.direction === "asc" ? comparison : comparison * -1;
    });
  }

  const totalStudents = studentResponse?.total ?? 0;
  const activeStudents = students.filter(
    (student) => student.status === "active",
  ).length;
  const inactiveStudents = students.filter(
    (student) => student.status === "inactive",
  ).length;
  const now = new Date();
  const newThisMonth = students.filter((student) => {
    const createdAt = new Date(student.createdAt);

    return (
      createdAt.getMonth() === now.getMonth() &&
      createdAt.getFullYear() === now.getFullYear()
    );
  }).length;

  const getCardValue = (cardId: string) => {
    switch (cardId) {
      case "totalStudents":
        return totalStudents;
      case "activeStudents":
        return activeStudents;
      case "newThisMonth":
        return newThisMonth;
      case "inactiveStudents":
        return inactiveStudents;
      default:
        return 0;
    }
  };

  const handleEnrollmentSuccess = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 p-6">
      <FilterBar
        configs={FILTER_CONFIGS}
        onFilterChange={handleFilterChange}
        showApplyButton={false}
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {ANALYSIS_CARDS.map((card) => (
          <AnalysisCard key={card.id} {...card} data={getCardValue(card.id)} />
        ))}
      </div>

      <DataTable<StudentType>
        data={students}
        columns={TABLE_COLUMNS}
        total={studentResponse?.total ?? 0}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        sort={sort}
        onSort={handleSort}
        isLoading={isLoading || isFetching}
        emptyMessage="No students found."
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Enroll New Student"
        className="max-w-5xl"
      >
        <div className="custom-scrollbar max-h-[80vh] overflow-y-auto pr-2">
          <StudentEnrollment
            onCancel={() => setIsModalOpen(false)}
            onSuccess={handleEnrollmentSuccess}
          />
        </div>
      </Modal>
    </div>
  );
};

export default StudentPage;
