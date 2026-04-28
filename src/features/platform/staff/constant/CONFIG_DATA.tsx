import { FilterConfig } from "@/common/components/shared/FilterBar";
import { Calendar, Edit2, Trash2, TrendingUp, UserCheck, Users } from "lucide-react";


export const staffFilterConfigs: FilterConfig[] = [
    {
      id: "search",
      label: "Search Staff",
      type: "text",
      placeholder: "Name or Code...",
      width: "280px",
    },
    {
      id: "staffType",
      label: "Staff Type",
      type: "select",
      defaultValue: "all",
      width: "160px",
      options: [
        { label: "All Types", value: "all" },
        {label:"Teacher" , value:"Teacher"},
        { label: "Librarian", value: "Librarian" },
        { label: "Administrative", value: "AdmissionHead" },
        {label:"Other" , value:"Other"}
      ],
    },
  ];

   export const dashStats = [
  {
    id: 1,
    header: "Total Headcount",
    data: "63",
    footer: (
      <>
        <span className="font-bold text-white">+4</span>
        <span className="opacity-80">since last month</span>
      </>
    ),
    icon: Users,
    variant: 'primary' as const, 
  },
  {
    id: 2,
    header: "On Probation",
    data: "12",
    footer: (
      <div className="flex items-center gap-2">
        <div className="flex -space-x-1.5">
           <div className="w-5 h-5 rounded-full bg-blue-400 border border-white" />
           <div className="w-5 h-5 rounded-full bg-red-400 border border-white" />
        </div>
        <span>Review due this week</span>
      </div>
    ),
    icon: UserCheck,
    variant: 'white' as const,
  },
  {
    id: 3,
    header: "Retention Rate",
    data: "94%",
    footer: (
      <div className="flex items-center gap-1">
        <TrendingUp size={14} />
        <span>Stable growth curve</span>
      </div>
    ),
    icon: TrendingUp,
    variant: 'accent' as const,
  }
];


export const headerConfig = {
    moduleName: "Staff Directory",
    items: [
      { label: "Directory", href: "/platform/staff" },
      { label: "Attendance", href: "/platform/staff/attendance" },
      { label: "Performance", href: "/platform/staff/performance" },
    ],
    actions: [
      // {
      //   label: "Export",
      //   iconName: "Download",
      //   variant: "outline" as const,
      //   emitEvent: "STAFF_EXPORT",
      // },
      {
        label: "Add Staff",
        iconName: "Plus",
        variant: "primary" as const,
        emitEvent: "STAFF_ADD",
      },
    ],
  };


  export const columns = [
    {
      header: "Employee Name",
      key: "user",
      render: (_: any, row: Staff) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold border border-indigo-100 uppercase">
            {row.user?.firstName?.[0]}{row.user?.lastName?.[0]}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-slate-900 text-[13px]">
                {row.user?.firstName} {row.user?.lastName}
            </span>
            <span className="text-[11px] text-slate-400 font-medium lowercase">
                {row.user?.email}
            </span>
          </div>
        </div>
      )
    },
    {
      header: "Code",
      key: "employeeCode",
      width: "140px",
      render: (val: string) => (
        <span className="font-mono text-[11px] font-bold text-slate-500 bg-slate-50 px-2.5 py-1.5 rounded border border-slate-100 whitespace-nowrap inline-block">
          {val}
        </span>
      )
    },
    { 
      header: "Type", 
      key: "staffType",
      render: (val: string) => <span className="text-[12px] font-medium text-slate-600">{val}</span>
    },
    { 
      header: "Department", 
      key: "department",
      render: (val: string) => <span className="text-[12px] text-slate-500 italic">{val}</span>
    },
    {
      header: "Status",
      key: "employmentStatus",
      render: (val: string) => (
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${
          val === 'confirmed' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"
        }`}>
          {val}
        </span>
      )
    },
    {
      header: "Joining Date",
      key: "joiningDate",
      render: (val: string) => (
        <div className="flex items-center gap-2 text-slate-500 text-[12px]">
          <Calendar size={13} className="opacity-60" /> {val}
        </div>
      )
    },
    {
        header: "Actions",
        key: "id",
        align: "right" as const,
        render: (_: any, row: Staff) => (
          <div className="flex items-center justify-end gap-1">
            <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
              <Edit2 size={15} />
            </button>
            <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
              <Trash2 size={15} />
            </button>
          </div>
        )
      }
  ];



 export const staffFormConfig = [
  {
    id: "step1",
    sectionTitle: "Employee Basics",
    description: "Please provide the initial employment credentials.",
    fields: [
      { 
        id: "employeeCode", 
        label: "Employee Code *", 
        type: "text", 
        placeholder: "e.g. EMP-2024-001", 
        gridCols: 6, 
        validation: { required: "Employee code is required" } 
      },
      { 
        id: "staffType", 
        label: "Staff Type *", 
        type: "select", 
        options: ["Teacher", "Librarian", "AdmissionHead", "Accountant", "Other"], 
        gridCols: 6,
        validation: { required: "Please select a staff type" }
      },
      { 
        id: "designation", 
        label: "Designation *", 
        type: "text", 
        placeholder: "e.g. Senior Faculty", 
        gridCols: 6,
        validation: { required: "Designation is required" }
      },
      { 
        id: "department", 
        label: "Department *", 
        type: "text", 
        placeholder: "e.g. Mathematics", 
        gridCols: 6,
        validation: { required: "Department is required" }
      },
    ]
  },
  {
    id: "step1_details",
    sectionTitle: "Employment Details",
    fields: [
      { 
        id: "joiningDate", 
        label: "Joining Date *", 
        type: "date", 
        gridCols: 6,
        validation: { required: "Joining date is required" }
      },
      { 
        id: "employmentStatus", 
        label: "Employment Status *", 
        type: "select", 
        options: ["confirmed", "probation", "notice"], 
        gridCols: 6,
        validation: { required: "Please select employment status" }
      },
    ]
  },
  {
    id: "step2",
    sectionTitle: "Financial & Personal Details",
    fields: [
      { 
        id: "firstName", 
        label: "First Name *", 
        type: "text", 
        gridCols: 6,
        validation: { required: "First name is required" }
      },
      { 
        id: "lastName", 
        label: "Last Name *", 
        type: "text", 
        gridCols: 6,
        validation: { required: "Last name is required" }
      },
      { 
        id: "email", 
        label: "Official Email *", 
        type: "email", 
        gridCols: 6,
        validation: { 
          required: "Email is required",
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "Invalid email address"
          }
        }
      },
      { 
        id: "password", 
        label: "Login Password *", 
        type: "password", 
        gridCols: 6,
        validation: { 
          required: "Password is required",
          minLength: { value: 8, message: "Min 8 characters required" }
        }
      },
      { 
        id: "panNumber", 
        label: "PAN Number *", 
        type: "text", 
        gridCols: 12,
        validation: { 
          required: "PAN Number is required",
          pattern: {
            value: /[A-Z]{5}[0-9]{4}[A-Z]{1}/,
            message: "Invalid PAN format (e.g. ABCDE1234F)"
          }
        }
      },
    ]
  },
  {
    id: "step3",
    sectionTitle: "Banking Information",
    fields: [
      { 
        id: "bankName", 
        label: "Bank Name *", 
        type: "text", 
        gridCols: 6,
        validation: { required: "Bank name is required" }
      },
      { 
        id: "ifscCode", 
        label: "IFSC Code *", 
        type: "text", 
        gridCols: 6,
        validation: { 
          required: "IFSC is required",
          pattern: {
            value: /^[A-Z]{4}0[A-Z0-9]{6}$/,
            message: "Invalid IFSC format"
          }
        }
      },
      { 
        id: "bankAccountNumber", 
        label: "Account Number *", 
        type: "text", 
        gridCols: 6,
        validation: { required: "Account number is required" }
      },
      { 
        id: "accountHolderName", 
        label: "Account Holder Name *", 
        type: "text", 
        gridCols: 6,
        validation: { required: "Holder name is required" }
      },
      { 
        id: "basicSalary", 
        label: "Basic Salary *", 
        type: "number", 
        gridCols: 12,
        validation: { 
          required: "Salary is required",
          min: { value: 0, message: "Salary cannot be negative" }
        }
      },
    ]
  }
];