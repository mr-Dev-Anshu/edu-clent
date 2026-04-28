'use client'
import React, { useState } from 'react';
import { useHeader } from '@/hooks/useHeader';

const AttendancePage = () => {
  const [isMarking, setIsMarking] = useState(false);

  const attendanceConfig = {
    moduleName: "Staff Attendance",
    items: [
      { label: 'Directory', href: '/platform/staff' },
      { label: 'Attendance', href: '/platform/staff/attendance' },
      { label: 'Performance', href: '/platform/staff/performance' },
    ],
    actions: [
      { 
        label: 'Download Report', 
        iconName: 'FileText', 
        variant: 'outline' as const, 
        emitEvent: 'ATTENDANCE_REPORT' 
      },
      { 
        label: 'Mark Bulk Attendance', 
        iconName: 'CheckCircle', 
        variant: 'primary' as const, 
        emitEvent: 'MARK_ATTENDANCE' 
      },
    ]
  };

  useHeader(attendanceConfig, (eventName) => {
    if (eventName === 'ATTENDANCE_REPORT') {
      console.log("Generating Attendance PDF...");
      alert("Downloading Report...");
    }
    if (eventName === 'MARK_ATTENDANCE') {
      setIsMarking(true);
      console.log("Opening Bulk Attendance UI...");
    }
  });

  return (
    <div className="p-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-800">Daily Attendance Log</h2>
          <span className="text-sm text-slate-500">Date: 26 April, 2026</span>
        </div>
        
        <div className="p-20 flex flex-col items-center justify-center text-center">
          {isMarking ? (
            <div className="animate-pulse text-blue-600 font-medium">
              Processing Bulk Attendance Mode...
              <button 
                onClick={() => setIsMarking(false)} 
                className="block mt-4 text-xs text-slate-400 underline"
              >
                Cancel
              </button>
            </div>
          ) : (
            <>
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                 <span className="text-2xl text-slate-300">📅</span>
              </div>
              <p className="text-slate-500">Attendance data will be listed here.</p>
              <p className="text-xs text-slate-400 mt-1">Try clicking 'Mark Bulk Attendance' in the header.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AttendancePage;