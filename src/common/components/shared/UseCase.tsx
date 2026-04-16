"use client";

/**
 * ComponentShowcase.tsx
 * ─────────────────────────────────────────────────────────────────
 * Single-file showcase of every shared component.
 * All dummy data lives here — no external imports needed except
 * your shared component barrel and a few Lucide icons.
 *
 * Route suggestion:  app/(dashboard)/showcase/page.tsx
 * Or drop it anywhere and import: import ComponentShowcase from "@/components/showcase/ComponentShowcase"
 */

import { useState } from "react";
import {
  Users,
  UserCheck,
  CreditCard,
  CalendarCheck,
  AlertCircle,
  Building2,
  CheckCircle,
  Clock,
  TrendingDown,
  School,
} from "lucide-react";

import {
  StatusBadge,
  MetricCard,
  Pagination,
  DataTable,
  FormInput,
  FormSelect,
  FormTextarea,
  PageHeader,
  SectionCard,
  AvatarCircle,
  EmptyState,
  FilterBar,
  ConfirmDialog,
} from "@/common/components/shared";

import type {
  StatusVariant,
  MetricCardData,
  TableColumn,
  FilterField,
  ConfirmOptions,
} from "@/types";

import { useDataTable } from "@/hooks/useDataTable";
import { useConfirm } from "@/hooks/useConfirm";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────
// 1. DUMMY DATA
// ─────────────────────────────────────────────────────────────────

// ── 1A. Students ─────────────────────────────────────────────────

interface Student {
  id: string;
  admissionNo: string;
  firstName: string;
  lastName: string;
  class: string;
  section: string;
  rollNo: string;
  guardianName: string;
  guardianPhone: string;
  status: StatusVariant;
  enrolledDate: string;
  feeStatus: StatusVariant;
}

const STUDENTS: Student[] = [
  { id: "s01", admissionNo: "2024-G10-00214", firstName: "Nisha",   lastName: "Sharma",  class: "10", section: "A", rollNo: "12", guardianName: "Anjali Sharma",  guardianPhone: "+91 98765 43210", status: "active",   enrolledDate: "12 Apr 2024", feeStatus: "overdue"       },
  { id: "s02", admissionNo: "2024-G09-00087", firstName: "Aryan",   lastName: "Kapoor",  class: "9",  section: "B", rollNo: "04", guardianName: "Ravi Kapoor",    guardianPhone: "+91 99001 23456", status: "active",   enrolledDate: "08 Apr 2024", feeStatus: "paid"          },
  { id: "s03", admissionNo: "2023-G08-00341", firstName: "Pooja",   lastName: "Mehta",   class: "8",  section: "C", rollNo: "23", guardianName: "Deepak Mehta",   guardianPhone: "+91 97654 32100", status: "pending",  enrolledDate: "15 Mar 2023", feeStatus: "partially_paid"},
  { id: "s04", admissionNo: "2022-G12-00019", firstName: "Rahul",   lastName: "Verma",   class: "12", section: "A", rollNo: "07", guardianName: "Sunita Verma",   guardianPhone: "+91 88001 55678", status: "inactive", enrolledDate: "02 Jun 2022", feeStatus: "paid"          },
  { id: "s05", admissionNo: "2024-G06-00156", firstName: "Sara",    lastName: "Iyer",    class: "6",  section: "B", rollNo: "18", guardianName: "Mohan Iyer",     guardianPhone: "+91 95555 11222", status: "active",   enrolledDate: "10 Apr 2024", feeStatus: "paid"          },
  { id: "s06", admissionNo: "2024-G07-00203", firstName: "Kabir",   lastName: "Nair",    class: "7",  section: "A", rollNo: "09", guardianName: "Meera Nair",     guardianPhone: "+91 91234 56789", status: "active",   enrolledDate: "09 Apr 2024", feeStatus: "overdue"       },
  { id: "s07", admissionNo: "2023-G11-00078", firstName: "Divya",   lastName: "Reddy",   class: "11", section: "B", rollNo: "31", guardianName: "Suresh Reddy",   guardianPhone: "+91 90000 12345", status: "active",   enrolledDate: "05 Mar 2023", feeStatus: "paid"          },
  { id: "s08", admissionNo: "2024-G10-00189", firstName: "Rohan",   lastName: "Gupta",   class: "10", section: "B", rollNo: "15", guardianName: "Pradeep Gupta",  guardianPhone: "+91 92345 67890", status: "active",   enrolledDate: "11 Apr 2024", feeStatus: "partially_paid"},
  { id: "s09", admissionNo: "2022-G09-00055", firstName: "Ananya",  lastName: "Singh",   class: "9",  section: "C", rollNo: "22", guardianName: "Vikram Singh",   guardianPhone: "+91 87654 32109", status: "suspended",enrolledDate: "20 Apr 2022", feeStatus: "overdue"       },
  { id: "s10", admissionNo: "2024-G08-00312", firstName: "Ishaan",  lastName: "Joshi",   class: "8",  section: "A", rollNo: "03", guardianName: "Kavita Joshi",   guardianPhone: "+91 94567 89012", status: "active",   enrolledDate: "13 Apr 2024", feeStatus: "paid"          },
  { id: "s11", admissionNo: "2023-G06-00099", firstName: "Tanya",   lastName: "Das",     class: "6",  section: "C", rollNo: "27", guardianName: "Bishnu Das",     guardianPhone: "+91 96789 01234", status: "active",   enrolledDate: "08 Mar 2023", feeStatus: "paid"          },
  { id: "s12", admissionNo: "2024-G11-00044", firstName: "Aditya",  lastName: "Bose",    class: "11", section: "A", rollNo: "11", guardianName: "Tapan Bose",     guardianPhone: "+91 93210 98765", status: "active",   enrolledDate: "07 Apr 2024", feeStatus: "partially_paid"},
];

// ── 1B. Admission Leads ───────────────────────────────────────────

interface AdmissionLead {
  id: string;
  applicantName: string;
  dob: string;
  applyingFor: string;
  guardianName: string;
  phone: string;
  source: string;
  assignedTo: string;
  stage: StatusVariant;
  leadScore: number;
  appliedOn: string;
}

const ADMISSION_LEADS: AdmissionLead[] = [
  { id: "l01", applicantName: "Aryan Mehta",    dob: "12 Jan 2014", applyingFor: "Grade 6",  guardianName: "Rajesh Mehta",   phone: "+91 99887 12345", source: "Website",     assignedTo: "Priya Sharma", stage: "submitted",   leadScore: 82, appliedOn: "01 Jul 2025" },
  { id: "l02", applicantName: "Priya Nair",     dob: "05 Mar 2012", applyingFor: "Grade 8",  guardianName: "Sanjay Nair",    phone: "+91 98001 77654", source: "Walk-in",     assignedTo: "Deepak Nair",  stage: "approved",    leadScore: 91, appliedOn: "28 Jun 2025" },
  { id: "l03", applicantName: "Karan Verma",    dob: "22 Jul 2013", applyingFor: "Grade 7",  guardianName: "Mohan Verma",    phone: "+91 97654 00012", source: "Referral",    assignedTo: "Priya Sharma", stage: "pending",     leadScore: 65, appliedOn: "03 Jul 2025" },
  { id: "l04", applicantName: "Simran Kaur",    dob: "18 Sep 2011", applyingFor: "Grade 9",  guardianName: "Harpreet Kaur",  phone: "+91 95001 43210", source: "Social media",assignedTo: "Anita Rao",    stage: "rejected",    leadScore: 34, appliedOn: "25 Jun 2025" },
  { id: "l05", applicantName: "Vedant Joshi",   dob: "30 Apr 2014", applyingFor: "Grade 6",  guardianName: "Nilesh Joshi",   phone: "+91 91234 99001", source: "Website",     assignedTo: "Deepak Nair",  stage: "in_progress", leadScore: 74, appliedOn: "05 Jul 2025" },
];

// ── 1C. Staff ─────────────────────────────────────────────────────

interface StaffMember {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  designation: string;
  department: string;
  staffType: string;
  status: StatusVariant;
  joiningDate: string;
  phone: string;
}

const STAFF_MEMBERS: StaffMember[] = [
  { id: "st01", employeeCode: "EMP-001", firstName: "Priya",    lastName: "Sharma",  designation: "Principal",       department: "Administration", staffType: "Non-teaching", status: "confirmed", joiningDate: "01 Jun 2018", phone: "+91 98765 43210" },
  { id: "st02", employeeCode: "TCH-012", firstName: "Rajesh",   lastName: "Kumar",   designation: "Senior Teacher",  department: "Science",        staffType: "Teaching",     status: "confirmed", joiningDate: "10 Jul 2020", phone: "+91 91234 56789" },
  { id: "st03", employeeCode: "TCH-023", firstName: "Anita",    lastName: "Rao",     designation: "Teacher",         department: "Mathematics",    staffType: "Teaching",     status: "confirmed", joiningDate: "15 Aug 2021", phone: "+91 92345 67890" },
  { id: "st04", employeeCode: "TCH-034", firstName: "Deepak",   lastName: "Nair",    designation: "Teacher",         department: "English",        staffType: "Teaching",     status: "probation", joiningDate: "01 Jan 2025", phone: "+91 93456 78901" },
  { id: "st05", employeeCode: "ADM-005", firstName: "Kavita",   lastName: "Joshi",   designation: "Admission Coord.",department: "Admin",          staffType: "Non-teaching", status: "confirmed", joiningDate: "20 Mar 2022", phone: "+91 94567 89012" },
  { id: "st06", employeeCode: "TCH-045", firstName: "Suresh",   lastName: "Reddy",   designation: "HOD Science",     department: "Science",        staffType: "Teaching",     status: "confirmed", joiningDate: "05 Jul 2019", phone: "+91 95678 90123" },
];

// ── 1D. Metric Card Data ──────────────────────────────────────────

const SCHOOL_METRICS: MetricCardData[] = [
  { label: "Total students",  value: "1,247", icon: Users,         trend: { value: 8.2,  direction: "up",   positive: true  }, accentVariant: "default" },
  { label: "Total staff",     value: "86",    icon: UserCheck,     trend: { value: 3.5,  direction: "up",   positive: true  }, accentVariant: "default" },
  { label: "Collected (Jul)", value: "₹18.4L",icon: CreditCard,    trend: { value: 12.1, direction: "up",   positive: true  }, accentVariant: "success" },
  { label: "Attendance today",value: "94.2%", icon: CalendarCheck, trend: { value: 1.8,  direction: "down", positive: false }, accentVariant: "warning" },
  { label: "Overdue fees",    value: "₹24.1L",icon: AlertCircle,   trend: { value: 6.3,  direction: "up",   positive: false }, accentVariant: "danger"  },
];

const SUPER_ADMIN_METRICS: MetricCardData[] = [
  { label: "Total schools",   value: "247",   icon: Building2,     accentVariant: "default" },
  { label: "Active",          value: "198",   icon: CheckCircle,   accentVariant: "success" },
  { label: "Trialing",        value: "37",    icon: Clock,         accentVariant: "warning" },
  { label: "Suspended",       value: "12",    icon: TrendingDown,  accentVariant: "danger"  },
];

// ── 1E. Filter Field Configs ──────────────────────────────────────

const STUDENT_FILTER_FIELDS: FilterField[] = [
  { key: "search",  label: "Search",  type: "search",  placeholder: "Search by name or admission no…", width: "240px" },
  { key: "class",   label: "Class",   type: "select",  width: "140px", options: [
    { label: "Class 6",  value: "6"  },
    { label: "Class 7",  value: "7"  },
    { label: "Class 8",  value: "8"  },
    { label: "Class 9",  value: "9"  },
    { label: "Class 10", value: "10" },
    { label: "Class 11", value: "11" },
    { label: "Class 12", value: "12" },
  ]},
  { key: "section", label: "Section", type: "select",  width: "130px", options: [
    { label: "Section A", value: "A" },
    { label: "Section B", value: "B" },
    { label: "Section C", value: "C" },
  ]},
  { key: "status",  label: "Status",  type: "select",  width: "130px", options: [
    { label: "Active",    value: "active"    },
    { label: "Inactive",  value: "inactive"  },
    { label: "Suspended", value: "suspended" },
    { label: "Pending",   value: "pending"   },
  ]},
];

const LEAD_FILTER_FIELDS: FilterField[] = [
  { key: "search",     label: "Search",      type: "search", placeholder: "Search applicant or guardian…", width: "240px" },
  { key: "applyingFor",label: "Class",       type: "select", width: "140px", options: [
    { label: "Grade 6", value: "Grade 6" },
    { label: "Grade 7", value: "Grade 7" },
    { label: "Grade 8", value: "Grade 8" },
    { label: "Grade 9", value: "Grade 9" },
  ]},
  { key: "stage",      label: "Stage",       type: "select", width: "140px", options: [
    { label: "Pending",      value: "pending"     },
    { label: "Submitted",    value: "submitted"   },
    { label: "Approved",     value: "approved"    },
    { label: "Rejected",     value: "rejected"    },
    { label: "In Progress",  value: "in_progress" },
  ]},
  { key: "appliedOn",  label: "Applied on",  type: "date",   width: "160px" },
];

// ── 1F. Status Badge variants list ───────────────────────────────

const STATUS_GROUPS: { title: string; statuses: StatusVariant[] }[] = [
  {
    title: "Success / positive",
    statuses: ["active", "present", "verified", "approved", "enrolled", "paid", "confirmed", "published", "complete"],
  },
  {
    title: "Warning / neutral",
    statuses: ["pending", "trialing", "draft", "scheduled", "late", "half_day", "partially_paid", "probation", "waitlisted", "onboarding"],
  },
  {
    title: "Danger",
    statuses: ["suspended", "absent", "overdue", "rejected", "expired", "terminated", "canceled"],
  },
  {
    title: "Informational",
    statuses: ["in_progress", "submitted", "computed"],
  },
  {
    title: "Neutral / archived",
    statuses: ["inactive", "archived", "locked"],
  },
];

// ─────────────────────────────────────────────────────────────────
// 2. SECTION WRAPPER — keeps the page tidy
// ─────────────────────────────────────────────────────────────────

interface ShowcaseSectionProps {
  id: string;
  title: string;
  description: string;
  children: React.ReactNode;
}

const ShowcaseSection = ({ id, title, description, children }: ShowcaseSectionProps) => (
  <section id={id} className="scroll-mt-6">
    <div className="mb-4">
      <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
      <p className="text-sm text-slate-500 mt-0.5">{description}</p>
    </div>
    <div className="flex flex-col gap-4">{children}</div>
  </section>
);

const DemoCard = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
    <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100">
      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{label}</span>
    </div>
    <div className="p-5">{children}</div>
  </div>
);

// ─────────────────────────────────────────────────────────────────
// 3. SECTION: StatusBadge
// ─────────────────────────────────────────────────────────────────

const StatusBadgeSection = () => (
  <ShowcaseSection
    id="status-badge"
    title="StatusBadge"
    description="Maps every status enum value from the schema to the correct Tailwind color pill."
  >
    <DemoCard label="All variants — from schema enums">
      <div className="flex flex-col gap-4">
        {STATUS_GROUPS.map((group) => (
          <div key={group.title}>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              {group.title}
            </p>
            <div className="flex flex-wrap gap-2">
              {group.statuses.map((s) => (
                <StatusBadge key={s} status={s} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </DemoCard>

    <DemoCard label="With dot variant — sidebar, attendance lists">
      <div className="flex flex-wrap gap-2">
        {(["active", "pending", "suspended", "in_progress", "archived"] as StatusVariant[]).map((s) => (
          <StatusBadge key={s} status={s} dot />
        ))}
      </div>
    </DemoCard>

    <DemoCard label="Inline in a student table row">
      <div className="flex items-center gap-3 flex-wrap">
        <AvatarCircle name="Nisha Sharma" size="sm" />
        <span className="text-sm font-medium text-slate-800">Nisha Sharma</span>
        <span className="text-xs text-slate-400">·</span>
        <span className="text-xs text-slate-500">Enrollment:</span>
        <StatusBadge status="active" />
        <span className="text-xs text-slate-400">·</span>
        <span className="text-xs text-slate-500">Fee:</span>
        <StatusBadge status="overdue" />
        <span className="text-xs text-slate-400">·</span>
        <span className="text-xs text-slate-500">Attendance:</span>
        <StatusBadge status="late" />
      </div>
    </DemoCard>

    <DemoCard label="Size sm — compact table badges">
      <div className="flex flex-wrap gap-2">
        {(["active", "pending", "overdue", "confirmed", "in_progress"] as StatusVariant[]).map((s) => (
          <StatusBadge key={s} status={s} size="sm" />
        ))}
      </div>
    </DemoCard>
  </ShowcaseSection>
);

// ─────────────────────────────────────────────────────────────────
// 4. SECTION: MetricCard
// ─────────────────────────────────────────────────────────────────

const MetricCardSection = () => (
  <ShowcaseSection
    id="metric-card"
    title="MetricCard"
    description="Summary stat cards for dashboards. Accepts icon, trend, and accent variant."
  >
    <DemoCard label="School Admin home dashboard — 5 cards">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {SCHOOL_METRICS.map((m) => (
          <MetricCard key={m.label} data={m} />
        ))}
      </div>
    </DemoCard>

    <DemoCard label="Super Admin platform view — 4 cards">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {SUPER_ADMIN_METRICS.map((m) => (
          <MetricCard key={m.label} data={m} />
        ))}
      </div>
    </DemoCard>

    <DemoCard label="HR Payroll summary — 3 cards">
      <div className="grid grid-cols-3 gap-3">
        {([
          { label: "Total staff",     value: "63",     icon: UserCheck, accentVariant: "default" as const },
          { label: "Total gross",     value: "₹41.2L", icon: CreditCard,accentVariant: "success" as const },
          { label: "Total net payout",value: "₹24.8L", icon: CheckCircle,accentVariant: "info"   as const },
        ] as MetricCardData[]).map((m) => (
          <MetricCard key={m.label} data={m} />
        ))}
      </div>
    </DemoCard>
  </ShowcaseSection>
);

// ─────────────────────────────────────────────────────────────────
// 5. SECTION: Pagination
// ─────────────────────────────────────────────────────────────────

const PaginationSection = () => {
  const [studentPage, setStudentPage] = useState(3);
  const [leadPage, setLeadPage]       = useState(1);

  return (
    <ShowcaseSection
      id="pagination"
      title="Pagination"
      description="Shows 'X–Y of Z' summary on the left, page number pills on the right. Handles ellipsis automatically."
    >
      <DemoCard label="Students list — 847 total, navigating page 3">
        <div className="text-sm text-slate-500 mb-3">
          Currently on page <span className="font-semibold text-slate-700">{studentPage}</span>
        </div>
        <Pagination
          page={studentPage}
          pageSize={10}
          total={847}
          onPageChange={setStudentPage}
        />
      </DemoCard>

      <DemoCard label="Admission leads — 38 total, page 1">
        <Pagination
          page={leadPage}
          pageSize={10}
          total={38}
          onPageChange={setLeadPage}
        />
      </DemoCard>

      <DemoCard label="Payroll — 63 staff, small dataset">
        <Pagination
          page={1}
          pageSize={10}
          total={63}
          onPageChange={() => {}}
        />
      </DemoCard>
    </ShowcaseSection>
  );
};

// ─────────────────────────────────────────────────────────────────
// 6. SECTION: DataTable
// ─────────────────────────────────────────────────────────────────

const DataTableSection = () => {
  const { paginated, total, page, pageSize, setPage,
          query, filters, sort, handleSearch,
          handleFilter, handleSort, resetFilters } = useDataTable({
    data: STUDENTS as unknown as Record<string, unknown>[],
    pageSize: 5,
    searchKeys: ["firstName", "lastName", "admissionNo"],
  });

  const hasActiveFilters = !!query || Object.values(filters).some(Boolean);

  const studentColumns: TableColumn[] = [
    {
      key: "name",
      header: "Name",
      width: "220px",
      render: (_val, row) => {
        const s = row as unknown as Student;
        return (
          <div className="flex items-center gap-2.5">
            <AvatarCircle name={`${s.firstName} ${s.lastName}`} size="sm" />
            <div>
              <p className="text-sm font-medium text-slate-800">
                {s.firstName} {s.lastName}
              </p>
              <p className="text-[11px] text-slate-400">{s.admissionNo}</p>
            </div>
          </div>
        );
      },
    },
    {
      key: "class",
      header: "Class",
      width: "110px",
      render: (_val, row) => {
        const s = row as unknown as Student;
        return (
          <div>
            <span className="text-sm text-slate-700">
              Class {s.class}-{s.section}
            </span>
            <p className="text-[11px] text-slate-400">Roll {s.rollNo}</p>
          </div>
        );
      },
    },
    {
      key: "guardianName",
      header: "Guardian",
      width: "180px",
      render: (_val, row) => {
        const s = row as unknown as Student;
        return (
          <div>
            <p className="text-sm text-slate-700">{s.guardianName}</p>
            <p className="text-[11px] text-slate-400">{s.guardianPhone}</p>
          </div>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      width: "110px",
      sortable: true,
      render: (val) => <StatusBadge status={val as StatusVariant} />,
    },
    {
      key: "feeStatus",
      header: "Fee",
      width: "110px",
      render: (val) => <StatusBadge status={val as StatusVariant} />,
    },
    {
      key: "enrolledDate",
      header: "Enrolled",
      width: "120px",
      sortable: true,
      render: (val) => (
        <span className="text-xs text-slate-500">{val as string}</span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      width: "80px",
      align: "center",
      render: (_val, row) => {
        const s = row as unknown as Student;
        return (
          <button
            onClick={() => alert(`View student: ${s.firstName} ${s.lastName}`)}
            className="text-xs text-[#1E3A5F] font-medium hover:underline"
          >
            View
          </button>
        );
      },
    },
  ];

  return (
    <ShowcaseSection
      id="data-table"
      title="DataTable"
      description="Generic reusable table with search, column sorting, filter slot, pagination, loading skeleton, and empty state. Driven by useDataTable hook."
    >
      <DemoCard label="Student directory — live search + filter + sort + pagination">
        <DataTable
          data={paginated}
          columns={studentColumns}
          total={total}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          sort={sort}
          onSort={handleSort}
          searchPlaceholder="Search by name or admission no…"
          emptyMessage="No students match your search."
          headerSlot={
            <FilterBar
              fields={STUDENT_FILTER_FIELDS}
              values={filters}
              onFilter={handleFilter}
              onSearch={handleSearch}
              searchValue={query}
              onReset={resetFilters}
              hasActiveFilters={hasActiveFilters}
              actionSlot={
                <button className="h-9 px-4 rounded-lg bg-[#1E3A5F] text-white text-sm font-medium hover:bg-[#152d4a] transition-colors">
                  + Enroll student
                </button>
              }
            />
          }
        />
      </DemoCard>

      <DemoCard label="Loading skeleton state">
        <DataTable
          data={[]}
          columns={studentColumns.slice(0, 4)}
          total={0}
          page={1}
          pageSize={5}
          onPageChange={() => {}}
          isLoading={true}
        />
      </DemoCard>
    </ShowcaseSection>
  );
};

// ─────────────────────────────────────────────────────────────────
// 7. SECTION: FormInput
// ─────────────────────────────────────────────────────────────────

const FormInputSection = () => (
  <ShowcaseSection
    id="form-input"
    title="FormInput"
    description="Wraps <input> with label, helper text, error message, prefix/suffix addons. Works with react-hook-form via ref forwarding."
  >
    <DemoCard label="Add Staff — personal details (Step 1 of 3)">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <FormInput label="First name" id="firstName" required defaultValue="Rajesh"  placeholder="First name" />
        <FormInput label="Last name"  id="lastName"  required defaultValue="Kumar"   placeholder="Last name"  />
      </div>
      <div className="mb-4">
        <FormInput
          label="Official email"
          id="email"
          type="email"
          required
          defaultValue="raj.kumar@greenwood.edu"
          placeholder="staff@school.edu"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormInput
          label="Phone"
          id="phone"
          prefix="+91"
          defaultValue="98765 43210"
          placeholder="Phone number"
        />
        <FormInput
          label="Employee code"
          id="empCode"
          required
          prefix="EMP-"
          defaultValue="0042"
          helperText="Auto-generated. You can override."
        />
      </div>
    </DemoCard>

    <DemoCard label="Enrollment form — validation error states">
      <div className="grid grid-cols-2 gap-4">
        <FormInput
          label="Admission number"
          id="admNo"
          required
          defaultValue="2024-G10-00214"
        />
        <FormInput
          label="Official email"
          id="emailErr"
          required
          defaultValue="not-an-email"
          error={{ type: "validate", message: "Enter a valid email address." }}
        />
        <FormInput
          label="Date of birth"
          id="dob"
          required
          type="date"
          defaultValue="2012-03-14"
        />
        <FormInput
          label="Aadhar number"
          id="aadhar"
          defaultValue="1234"
          error={{ type: "minLength", message: "Aadhar must be 12 digits." }}
          helperText="Will be stored encrypted."
        />
      </div>
    </DemoCard>

    <DemoCard label="Subdomain input — with .saas.com suffix">
      <div className="max-w-sm">
        <FormInput
          label="School subdomain"
          id="subdomain"
          required
          defaultValue="greenwood"
          suffix=".saas.com"
          helperText="Only lowercase letters, numbers, and hyphens. Cannot be changed after creation."
        />
      </div>
    </DemoCard>
  </ShowcaseSection>
);

// ─────────────────────────────────────────────────────────────────
// 8. SECTION: FormSelect
// ─────────────────────────────────────────────────────────────────

const FormSelectSection = () => (
  <ShowcaseSection
    id="form-select"
    title="FormSelect"
    description="Styled <select> with label, placeholder, error, and helper text. Consistent with FormInput appearance."
  >
    <DemoCard label="Admission lead form — class, source, counselor, category">
      <div className="grid grid-cols-3 gap-4 mb-4">
        <FormSelect
          label="Applying for class"
          id="applyClass"
          required
          placeholder="Select class"
          options={[
            { label: "Grade 6",  value: "g6"  },
            { label: "Grade 7",  value: "g7"  },
            { label: "Grade 8",  value: "g8"  },
            { label: "Grade 9",  value: "g9"  },
            { label: "Grade 10", value: "g10" },
          ]}
          defaultValue="g6"
        />
        <FormSelect
          label="Source channel"
          id="source"
          placeholder="Select source"
          options={[
            { label: "Website",      value: "website"      },
            { label: "Walk-in",      value: "walk_in"      },
            { label: "Referral",     value: "referral"     },
            { label: "Social media", value: "social_media" },
          ]}
          defaultValue="walk_in"
        />
        <FormSelect
          label="Assign counselor"
          id="counselor"
          placeholder="Unassigned"
          options={[
            { label: "Priya Sharma", value: "usr-002" },
            { label: "Deepak Nair",  value: "usr-006" },
            { label: "Anita Rao",    value: "usr-007" },
          ]}
          defaultValue="usr-002"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormSelect
          label="Academic year"
          id="ay"
          required
          options={[
            { label: "2025–26", value: "ay-2025" },
            { label: "2024–25", value: "ay-2024" },
          ]}
          defaultValue="ay-2025"
        />
        <FormSelect
          label="Category"
          id="category"
          placeholder="Select category"
          options={[
            { label: "General", value: "general" },
            { label: "OBC",     value: "obc"     },
            { label: "SC",      value: "sc"      },
            { label: "ST",      value: "st"      },
            { label: "EWS",     value: "ews"     },
          ]}
          defaultValue="obc"
        />
      </div>
    </DemoCard>

    <DemoCard label="Error state — required field not selected">
      <div className="max-w-xs">
        <FormSelect
          label="Grading system"
          id="gradingErr"
          required
          placeholder="Select grading system"
          options={[
            { label: "Percentage", value: "percentage" },
            { label: "GPA 4.0",    value: "gpa"        },
            { label: "CGPA",       value: "cgpa"       },
            { label: "Custom",     value: "custom"     },
          ]}
          error={{ type: "required", message: "Please select a grading system." }}
        />
      </div>
    </DemoCard>
  </ShowcaseSection>
);

// ─────────────────────────────────────────────────────────────────
// 9. SECTION: FormTextarea
// ─────────────────────────────────────────────────────────────────

const FormTextareaSection = () => (
  <ShowcaseSection
    id="form-textarea"
    title="FormTextarea"
    description="Auto-resizable textarea with label, helper, and error — same API as FormInput."
  >
    <DemoCard label="Notice compose — body and internal note">
      <div className="flex flex-col gap-4">
        <FormTextarea
          label="Notice body"
          id="noticeBody"
          required
          rows={5}
          defaultValue={`Dear Parents,\n\nPlease note that school will remain closed on 15th July 2025 (Tuesday) on account of the school's Annual Sports Day preparation. Classes will resume on 16th July 2025.\n\nRegards,\nGreenwood International School`}
          helperText="Max 2,000 characters. Supports plain text only."
        />
        <FormTextarea
          label="Internal note (admin only)"
          id="internalNote"
          rows={2}
          placeholder="Add any internal notes about this notice…"
        />
      </div>
    </DemoCard>

    <DemoCard label="Leave application — reason field with validation error">
      <FormTextarea
        label="Reason for leave"
        id="leaveReason"
        required
        rows={3}
        placeholder="Describe the reason in detail…"
        error={{ type: "required", message: "Reason is required for sick leave exceeding 2 days." }}
      />
    </DemoCard>

    <DemoCard label="Rejection note — lead rejected">
      <FormTextarea
        label="Rejection reason"
        id="rejectReason"
        rows={3}
        defaultValue="Applicant's age does not meet the minimum eligibility criteria for Grade 6 as per school policy. DoB is 22 Jul 2013, minimum required is before 31 May 2013."
        helperText="This note will be visible to the admission team but not sent to the parent."
      />
    </DemoCard>
  </ShowcaseSection>
);

// ─────────────────────────────────────────────────────────────────
// 10. SECTION: PageHeader
// ─────────────────────────────────────────────────────────────────

const PageHeaderSection = () => (
  <ShowcaseSection
    id="page-header"
    title="PageHeader"
    description="Breadcrumb + title + description + action buttons slot. Used at the top of every list and detail page."
  >
    <DemoCard label="Students list page">
      <PageHeader
        title="Students"
        description="1,247 students enrolled · Academic year 2025–26"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Students" },
        ]}
        actions={
          <>
            <button className="h-9 px-4 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
              Import CSV
            </button>
            <button className="h-9 px-4 rounded-lg bg-[#1E3A5F] text-white text-sm font-medium hover:bg-[#152d4a] transition-colors">
              + Enroll student
            </button>
          </>
        }
      />
    </DemoCard>

    <DemoCard label="Admission lead detail page">
      <PageHeader
        title="Aryan Kapoor"
        description="Applying for Grade 6 · Lead score 78/100"
        breadcrumbs={[
          { label: "Admissions", href: "/admissions" },
          { label: "Leads",      href: "/admissions/leads" },
          { label: "Aryan Kapoor" },
        ]}
        actions={
          <>
            <StatusBadge status="submitted" />
            <button className="h-9 px-4 rounded-lg border border-red-300 text-sm font-medium text-red-700 hover:bg-red-50 transition-colors">
              Reject
            </button>
            <button className="h-9 px-4 rounded-lg bg-[#1E3A5F] text-white text-sm font-medium hover:bg-[#152d4a] transition-colors">
              Convert to student
            </button>
          </>
        }
      />
    </DemoCard>

    <DemoCard label="Payroll run — with status badge and disabled approve button">
      <PageHeader
        title="Payroll — July 2025"
        description="63 staff · 26 working days · Net payout ₹24.8L"
        breadcrumbs={[
          { label: "HR & Payroll", href: "/hr" },
          { label: "Payroll",      href: "/hr/payroll" },
          { label: "July 2025" },
        ]}
        actions={
          <>
            <StatusBadge status="draft" />
            <button className="h-9 px-4 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
              Submit for review
            </button>
            <button
              disabled
              className="h-9 px-4 rounded-lg bg-[#1E3A5F] text-white text-sm font-medium opacity-40 cursor-not-allowed"
            >
              Approve & disburse
            </button>
          </>
        }
      />
    </DemoCard>
  </ShowcaseSection>
);

// ─────────────────────────────────────────────────────────────────
// 11. SECTION: SectionCard
// ─────────────────────────────────────────────────────────────────

const SectionCardSection = () => (
  <ShowcaseSection
    id="section-card"
    title="SectionCard"
    description="White card with optional title, description, and header action slot. Used for profile detail sections, form groups, and dashboard widgets."
  >
    <DemoCard label="Student profile — two SectionCards side by side">
      <div className="grid grid-cols-2 gap-4">
        <SectionCard
          title="Personal details"
          description="Basic profile information"
          headerSlot={
            <button className="text-xs text-[#1E3A5F] font-medium hover:underline">
              Edit
            </button>
          }
        >
          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            {[
              ["Date of birth",  "14 Mar 2012"],
              ["Gender",         "Female"],
              ["Blood group",    "B+"],
              ["Category",       "General"],
              ["Nationality",    "Indian"],
              ["Aadhar",         "XXXX-XXXX-4821"],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
                <p className="text-sm text-slate-800">{value}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Contact & address">
          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            {[
              ["Emergency contact", "Anjali Sharma"],
              ["Phone",             "+91 98765 43210"],
              ["City",              "Pune"],
              ["Pincode",           "411005"],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
                <p className="text-sm text-slate-800">{value}</p>
              </div>
            ))}
            <div className="col-span-2">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Address</p>
              <p className="text-sm text-slate-800">42, Shivaji Nagar, Pune – 411005, Maharashtra</p>
            </div>
          </div>
        </SectionCard>
      </div>
    </DemoCard>

    <DemoCard label="Subscription card — no padding body variant">
      <div className="max-w-sm">
        <SectionCard
          title="Subscription"
          headerSlot={
            <button className="text-xs text-[#1E3A5F] font-medium hover:underline">
              Change plan
            </button>
          }
          noPadding
        >
          <div className="divide-y divide-slate-50">
            {[
              ["Plan",           "Professional"],
              ["Status",         "active"],
              ["Billing",        "Monthly"],
              ["Amount",         "₹6,999/mo"],
              ["Next billing",   "15 Aug 2025"],
              ["Trial",          "Completed"],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between px-5 py-3">
                <span className="text-xs text-slate-500">{label}</span>
                {label === "Status"
                  ? <StatusBadge status={value as StatusVariant} />
                  : <span className="text-sm font-medium text-slate-800">{value}</span>}
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </DemoCard>
  </ShowcaseSection>
);

// ─────────────────────────────────────────────────────────────────
// 12. SECTION: AvatarCircle
// ─────────────────────────────────────────────────────────────────

const AvatarCircleSection = () => {
  const PEOPLE = [
    { name: "Priya Sharma",  role: "Principal"  },
    { name: "Rajesh Kumar",  role: "Teacher"    },
    { name: "Amit Mehta",    role: "Student"    },
    { name: "Sara Iyer",     role: "Parent"     },
    { name: "Deepak Verma",  role: "Staff"      },
    { name: "Nisha Sharma",  role: "Student"    },
    { name: "Karan Singh",   role: "Teacher"    },
  ];

  return (
    <ShowcaseSection
      id="avatar-circle"
      title="AvatarCircle"
      description="Deterministic color from name hash. Supports xl / lg / md / sm / xs sizes. Falls back to initials when no imageUrl."
    >
      <DemoCard label="All sizes">
        <div className="flex items-end gap-6">
          {(["xl", "lg", "md", "sm", "xs"] as const).map((size) => (
            <div key={size} className="flex flex-col items-center gap-2">
              <AvatarCircle name="Priya Sharma" size={size} />
              <span className="text-[11px] text-slate-400">{size}</span>
            </div>
          ))}
        </div>
      </DemoCard>

      <DemoCard label="Color variety — deterministic from name">
        <div className="flex flex-col gap-3">
          {PEOPLE.map((p) => (
            <div key={p.name} className="flex items-center gap-3">
              <AvatarCircle name={p.name} size="md" />
              <div>
                <p className="text-sm font-medium text-slate-800">{p.name}</p>
                <p className="text-xs text-slate-400">{p.role}</p>
              </div>
            </div>
          ))}
        </div>
      </DemoCard>

      <DemoCard label="In a staff table row">
        <div className="flex flex-col gap-3">
          {STAFF_MEMBERS.slice(0, 4).map((s) => (
            <div key={s.id} className="flex items-center gap-3 py-1">
              <AvatarCircle name={`${s.firstName} ${s.lastName}`} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800">
                  {s.firstName} {s.lastName}
                </p>
                <p className="text-xs text-slate-400">{s.designation} · {s.department}</p>
              </div>
              <StatusBadge status={s.status} size="sm" />
            </div>
          ))}
        </div>
      </DemoCard>
    </ShowcaseSection>
  );
};

// ─────────────────────────────────────────────────────────────────
// 13. SECTION: EmptyState
// ─────────────────────────────────────────────────────────────────

const EmptyStateSection = () => (
  <ShowcaseSection
    id="empty-state"
    title="EmptyState"
    description="Centered empty placeholder with icon, title, description, and optional action slot."
  >
    <div className="grid grid-cols-2 gap-4">
      <DemoCard label="No students found (after filter)">
        <div className="bg-white rounded-xl border border-slate-100">
          <EmptyState
            title="No students found"
            description="Try adjusting your class, section, or status filters to find what you're looking for."
            action={
              <button className="h-8 px-4 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                Reset filters
              </button>
            }
          />
        </div>
      </DemoCard>

      <DemoCard label="No admission leads yet">
        <div className="bg-white rounded-xl border border-slate-100">
          <EmptyState
            title="No leads yet for 2025–26"
            description="Share the inquiry form link or import leads from a CSV to get started."
            action={
              <div className="flex gap-2">
                <button className="h-8 px-4 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                  Import CSV
                </button>
                <button className="h-8 px-4 rounded-lg bg-[#1E3A5F] text-white text-sm font-medium hover:bg-[#152d4a] transition-colors">
                  + Add inquiry
                </button>
              </div>
            }
          />
        </div>
      </DemoCard>

      <DemoCard label="No payslips generated">
        <div className="bg-white rounded-xl border border-slate-100">
          <EmptyState
            title="No payslips for July 2025"
            description="The payroll run for this month has not been processed yet."
            action={
              <button className="h-8 px-4 rounded-lg bg-[#1E3A5F] text-white text-sm font-medium hover:bg-[#152d4a] transition-colors">
                Start payroll run
              </button>
            }
          />
        </div>
      </DemoCard>

      <DemoCard label="Search returned nothing">
        <div className="bg-white rounded-xl border border-slate-100">
          <EmptyState
            title='No results for "xyz123"'
            description="Double-check the spelling or try a different search term."
          />
        </div>
      </DemoCard>
    </div>
  </ShowcaseSection>
);

// ─────────────────────────────────────────────────────────────────
// 14. SECTION: FilterBar
// ─────────────────────────────────────────────────────────────────

const FilterBarSection = () => {
  const [studentFilters, setStudentFilters] = useState<Record<string, string>>({});
  const [studentSearch, setStudentSearch]   = useState("");
  const [leadFilters,    setLeadFilters]     = useState<Record<string, string>>({});
  const [leadSearch,     setLeadSearch]      = useState("");

  const studentHasActive = !!studentSearch || Object.values(studentFilters).some(Boolean);
  const leadHasActive    = !!leadSearch    || Object.values(leadFilters).some(Boolean);

  return (
    <ShowcaseSection
      id="filter-bar"
      title="FilterBar"
      description="Flexible filter row that renders search, select, and date inputs from a config array. Supports a Reset link and a right-side action slot."
    >
      <DemoCard label="Student list filter bar">
        <FilterBar
          fields={STUDENT_FILTER_FIELDS}
          values={studentFilters}
          onFilter={(key, value) => setStudentFilters((p) => ({ ...p, [key]: value }))}
          onSearch={setStudentSearch}
          searchValue={studentSearch}
          onReset={() => { setStudentFilters({}); setStudentSearch(""); }}
          hasActiveFilters={studentHasActive}
          actionSlot={
            <>
              <span className="text-xs text-slate-400">
                {studentHasActive ? "Filters active" : "No filters"}
              </span>
              <button className="h-9 px-4 rounded-lg bg-[#1E3A5F] text-white text-sm font-medium hover:bg-[#152d4a] transition-colors">
                + Enroll student
              </button>
            </>
          }
        />
        <p className="text-xs text-slate-400 mt-2">
          Active filters: {JSON.stringify({ search: studentSearch, ...studentFilters })}
        </p>
      </DemoCard>

      <DemoCard label="Admission leads filter bar">
        <FilterBar
          fields={LEAD_FILTER_FIELDS}
          values={leadFilters}
          onFilter={(key, value) => setLeadFilters((p) => ({ ...p, [key]: value }))}
          onSearch={setLeadSearch}
          searchValue={leadSearch}
          onReset={() => { setLeadFilters({}); setLeadSearch(""); }}
          hasActiveFilters={leadHasActive}
          actionSlot={
            <button className="h-9 px-4 rounded-lg bg-[#1E3A5F] text-white text-sm font-medium hover:bg-[#152d4a] transition-colors">
              + New inquiry
            </button>
          }
        />
      </DemoCard>
    </ShowcaseSection>
  );
};

// ─────────────────────────────────────────────────────────────────
// 15. SECTION: ConfirmDialog
// ─────────────────────────────────────────────────────────────────

const ConfirmDialogSection = () => {
  const { confirm, isOpen, options, handleConfirm, handleCancel } = useConfirm();

  const [lastAction, setLastAction] = useState<string | null>(null);

  const triggerSuspendSchool = () =>
    confirm({
      title: "Suspend Greenwood International School?",
      description:
        "This will immediately block all logins for 1,247 students, 86 staff, and all parents. The school can be unsuspended at any time from tenant settings.",
      confirmLabel: "Yes, suspend school",
      cancelLabel: "Cancel",
      variant: "danger",
      onConfirm: async () => {
        await new Promise((r) => setTimeout(r, 600));
        setLastAction("School suspended ✓");
      },
    });

  const triggerDeleteStudent = () =>
    confirm({
      title: "Delete Nisha Sharma's record?",
      description:
        "This will permanently remove the student profile, all attendance records, marks, and fee history. This action cannot be undone.",
      confirmLabel: "Delete permanently",
      variant: "danger",
      onConfirm: async () => {
        setLastAction("Student deleted ✓");
      },
    });

  const triggerLockMarks = () =>
    confirm({
      title: "Lock marks entry for Mathematics?",
      description:
        "Once locked, no teacher can modify marks for Class 10-A · Half-Yearly 2025. The exam coordinator can unlock it if corrections are needed.",
      confirmLabel: "Lock marks entry",
      variant: "default",
      onConfirm: async () => {
        setLastAction("Marks locked ✓");
      },
    });

  const triggerApprovePayroll = () =>
    confirm({
      title: "Approve July 2025 payroll?",
      description:
        "This will approve the payroll for 63 staff with a net payout of ₹24.8L. Bank disbursement file will be available for download immediately after.",
      confirmLabel: "Approve & proceed",
      variant: "default",
      onConfirm: async () => {
        setLastAction("Payroll approved ✓");
      },
    });

  return (
    <ShowcaseSection
      id="confirm-dialog"
      title="ConfirmDialog"
      description="Modal confirmation dialog. Danger variant shows red icon and button. Default variant uses navy. Driven by useConfirm hook."
    >
      <DemoCard label="Trigger different dialog variants">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={triggerSuspendSchool}
            className="h-9 px-4 rounded-lg border border-red-300 text-sm font-medium text-red-700 hover:bg-red-50 transition-colors"
          >
            Suspend school (danger)
          </button>
          <button
            onClick={triggerDeleteStudent}
            className="h-9 px-4 rounded-lg border border-red-300 text-sm font-medium text-red-700 hover:bg-red-50 transition-colors"
          >
            Delete student (danger)
          </button>
          <button
            onClick={triggerLockMarks}
            className="h-9 px-4 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Lock exam marks (default)
          </button>
          <button
            onClick={triggerApprovePayroll}
            className="h-9 px-4 rounded-lg bg-[#1E3A5F] text-white text-sm font-medium hover:bg-[#152d4a] transition-colors"
          >
            Approve payroll (default)
          </button>
        </div>

        {lastAction && (
          <div className="mt-4 flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-2.5">
            <CheckCircle size={14} />
            {lastAction}
          </div>
        )}

        <ConfirmDialog
          isOpen={isOpen}
          options={options}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      </DemoCard>

      <DemoCard label="useConfirm hook — how it works">
        <div className="bg-slate-50 rounded-lg p-4 font-mono text-xs text-slate-600 leading-relaxed">
          <p className="text-slate-400 mb-2">{"// 1. One instance per page"}</p>
          <p>{"const { confirm, isOpen, options, handleConfirm, handleCancel } = useConfirm();"}</p>
          <p className="mt-3 text-slate-400">{"// 2. Call from any action button"}</p>
          <p>{"confirm({ title: '...', description: '...', variant: 'danger', onConfirm: async () => { ... } });"}</p>
          <p className="mt-3 text-slate-400">{"// 3. Render once at bottom of JSX"}</p>
          <p>{"<ConfirmDialog isOpen={isOpen} options={options} onConfirm={handleConfirm} onCancel={handleCancel} />"}</p>
        </div>
      </DemoCard>
    </ShowcaseSection>
  );
};

// ─────────────────────────────────────────────────────────────────
// 16. COMBINED DEMO — DataTable + FilterBar + Pagination together
// ─────────────────────────────────────────────────────────────────

const CombinedLeadTableDemo = () => {
  const { paginated, total, page, pageSize, setPage,
          query, filters, sort, handleSearch,
          handleFilter, handleSort, resetFilters } = useDataTable({
    data: ADMISSION_LEADS as unknown as Record<string, unknown>[],
    pageSize: 3,
    searchKeys: ["applicantName", "guardianName"],
  });

  const hasActive = !!query || Object.values(filters).some(Boolean);

  const leadColumns: TableColumn[] = [
    {
      key: "applicantName",
      header: "Applicant",
      width: "200px",
      render: (_val, row) => {
        const l = row as unknown as AdmissionLead;
        return (
          <div className="flex items-center gap-2.5">
            <AvatarCircle name={l.applicantName} size="sm" />
            <div>
              <p className="text-sm font-medium text-slate-800">{l.applicantName}</p>
              <p className="text-[11px] text-slate-400">DOB: {l.dob}</p>
            </div>
          </div>
        );
      },
    },
    { key: "applyingFor", header: "Class",     width: "100px", sortable: true },
    { key: "guardianName",header: "Guardian",  width: "140px" },
    { key: "source",      header: "Source",    width: "110px",
      render: (val) => <span className="text-xs text-slate-600">{val as string}</span>
    },
    { key: "assignedTo",  header: "Counselor", width: "130px",
      render: (val) => (
        <div className="flex items-center gap-1.5">
          <AvatarCircle name={val as string} size="xs" />
          <span className="text-xs text-slate-700">{val as string}</span>
        </div>
      ),
    },
    { key: "stage",       header: "Stage",     width: "120px", sortable: true,
      render: (val) => <StatusBadge status={val as StatusVariant} size="sm" />
    },
    { key: "leadScore",   header: "Score",     width: "80px",  align: "center",
      render: (val) => {
        const score = val as number;
        return (
          <span className={cn(
            "text-sm font-semibold",
            score >= 80 ? "text-green-700" : score >= 60 ? "text-amber-700" : "text-red-700"
          )}>
            {score}
          </span>
        );
      },
    },
    { key: "appliedOn",   header: "Applied",   width: "110px",
      render: (val) => <span className="text-xs text-slate-400">{val as string}</span>
    },
  ];

  return (
    <ShowcaseSection
      id="combined-demo"
      title="Combined demo — DataTable + FilterBar + Pagination"
      description="Admission leads list showing DataTable, FilterBar, Pagination, StatusBadge, and AvatarCircle all working together."
    >
      <DataTable
        data={paginated}
        columns={leadColumns}
        total={total}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        sort={sort}
        onSort={handleSort}
        emptyMessage="No leads match your search."
        headerSlot={
          <FilterBar
            fields={LEAD_FILTER_FIELDS}
            values={filters}
            onFilter={handleFilter}
            onSearch={handleSearch}
            searchValue={query}
            onReset={resetFilters}
            hasActiveFilters={hasActive}
            actionSlot={
              <button className="h-9 px-4 rounded-lg bg-[#1E3A5F] text-white text-sm font-medium hover:bg-[#152d4a] transition-colors">
                + New inquiry
              </button>
            }
          />
        }
      />
    </ShowcaseSection>
  );
};

// ─────────────────────────────────────────────────────────────────
// 17. SIDEBAR NAV
// ─────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: "status-badge",   label: "StatusBadge"   },
  { id: "metric-card",    label: "MetricCard"     },
  { id: "pagination",     label: "Pagination"     },
  { id: "data-table",     label: "DataTable"      },
  { id: "form-input",     label: "FormInput"      },
  { id: "form-select",    label: "FormSelect"     },
  { id: "form-textarea",  label: "FormTextarea"   },
  { id: "page-header",    label: "PageHeader"     },
  { id: "section-card",   label: "SectionCard"    },
  { id: "avatar-circle",  label: "AvatarCircle"   },
  { id: "empty-state",    label: "EmptyState"     },
  { id: "filter-bar",     label: "FilterBar"      },
  { id: "confirm-dialog", label: "ConfirmDialog"  },
  { id: "combined-demo",  label: "Combined demo"  },
];

// ─────────────────────────────────────────────────────────────────
// 18. ROOT PAGE COMPONENT
// ─────────────────────────────────────────────────────────────────

const ComponentShowcase = () => {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex gap-8 min-h-screen">
      {/* Sticky sidebar nav */}
      <aside className="hidden lg:block w-52 flex-shrink-0">
        <div className="sticky top-6">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3 px-1">
            Components
          </p>
          <nav className="flex flex-col gap-0.5">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                  item.id === "combined-demo"
                    ? "text-[#1E3A5F] font-medium bg-blue-50 hover:bg-blue-100"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                )}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 flex flex-col gap-12 pb-24">
        {/* Page title */}
        <div className="border-b border-slate-100 pb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#1E3A5F] flex items-center justify-center">
              <School size={16} className="text-white" />
            </div>
            <h1 className="text-2xl font-semibold text-slate-800">
              Shared Component Showcase
            </h1>
          </div>
          <p className="text-sm text-slate-500">
            Every component from <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded">@/components/shared</code> with
            real school data. All dummy data lives in this single file.
          </p>
        </div>

        <StatusBadgeSection />
        <MetricCardSection />
        <PaginationSection />
        <DataTableSection />
        <FormInputSection />
        <FormSelectSection />
        <FormTextareaSection />
        <PageHeaderSection />
        <SectionCardSection />
        <AvatarCircleSection />
        <EmptyStateSection />
        <FilterBarSection />
        <ConfirmDialogSection />
        <CombinedLeadTableDemo />
      </main>
    </div>
  );
};

export default ComponentShowcase;
