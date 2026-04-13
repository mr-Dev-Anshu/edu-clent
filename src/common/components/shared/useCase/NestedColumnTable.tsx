"use client";

import React from "react";

import { TableColumn } from "@/types";
import { StatusBadge } from "../StatusBadge";
import { DataTable } from "../DataTable";

// 1. Define the Nested Data Types
interface SubjectResult {
  subject: string;
  marks: number;
  grade: string;
}

interface StudentResult {
  id: string;
  name: string;
  rollNo: string;
  results: SubjectResult[]; 
  totalPercentage: number;
  status: "complete" | "pending";
}

// 2. Dummy Data
const DUMMY_RESULTS: StudentResult[] = [
  {
    id: "1",
    name: "Anshu Kumar",
    rollNo: "101",
    status: "complete",
    totalPercentage: 88.5,
    results: [
      { subject: "Mathematics", marks: 95, grade: "A+" },
      { subject: "Science", marks: 82, grade: "A" },
      { subject: "English", marks: 78, grade: "B" },
    ],
  },
  {
    id: "2",
    name: "Adil Khan",
    rollNo: "102",
    status: "complete",
    totalPercentage: 74.2,
    results: [
      { subject: "Mathematics", marks: 70, grade: "B" },
      { subject: "Science", marks: 75, grade: "B+" },
      { subject: "English", marks: 80, grade: "A" },
    ],
  },
];

export const StudentResultTable = () => {
  const columns: TableColumn<StudentResult>[] = [
    {
      key: "name",
      header: "Student Info",
      width: "200px",
      render: (_, row) => (
        <div>
          <p className="font-bold text-slate-800">{row.name}</p>
          <p className="text-xs text-slate-400">Roll: {row.rollNo}</p>
        </div>
      ),
    },
    {
      key: "results",
      header: "Subject Wise Breakdown (Nested)",
      width: "400px",
      render: (val) => {
        const results = val as SubjectResult[];
        return (
          <div className="flex flex-col border rounded-lg overflow-hidden border-slate-100">
            <div className="grid grid-cols-3 bg-slate-50 px-3 py-1 text-[10px] font-bold uppercase text-slate-400 border-b">
              <span>Subject</span>
              <span className="text-center">Marks</span>
              <span className="text-right">Grade</span>
            </div>
            {results.map((item, idx) => (
              <div 
                key={idx} 
                className="grid grid-cols-3 px-3 py-1.5 text-xs border-b last:border-0 border-slate-50"
              >
                <span className="font-medium text-slate-600">{item.subject}</span>
                <span className="text-center text-slate-500">{item.marks}</span>
                <span className="text-right font-bold text-[#1E3A5F]">{item.grade}</span>
              </div>
            ))}
          </div>
        );
      },
    },
    {
      key: "totalPercentage",
      header: "Overall %",
      width: "120px",
      align: "center",
      render: (val) => (
        <span className="text-sm font-bold text-green-600">{val}%</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      width: "120px",
      render: (val) => <StatusBadge status={val as any} />,
    },
  ];

  return (
    <DataTable
      data={DUMMY_RESULTS as any}
      columns={columns as any}
      total={DUMMY_RESULTS.length}
      page={1}
      pageSize={5}
      onPageChange={() => {}}
      headerSlot={
        <h3 className="font-semibold text-slate-700">Class 10 - Examination Results</h3>
      }
    />
  );
};