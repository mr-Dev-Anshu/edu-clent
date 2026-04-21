import { 
  LayoutDashboard, Users, GraduationCap, DollarSign, 
  BookOpen, Calendar, BarChart2, Settings, Shield, 
  Building2, Bell, FileText, Truck, Landmark, Wallet,
  Briefcase,
  UserCheck,
  ClipboardList
} from 'lucide-react';

import { LucideIcon } from 'lucide-react';

export interface SidebarItem {
  label: string;
  href: string;
  icon: LucideIcon; 
  permission?: string; 
  children?: SidebarItem[]; 
  badge?: string | number;
}
// 1. ADMIN SIDEBAR (Platform/Super Admin - No Tenant Required)
export const ADMIN_SIDEBAR: SidebarItem[] = [
  { label: 'Dashboard',   href: '/admin/dashboard',   icon: LayoutDashboard },
  { label: 'Tenants',     href: '/admin/tenants',     icon: Building2,    permission: 'read:infrastructure' },
  { label: 'System Users',href: '/admin/users',       icon: Users,        permission: 'read:user_role' },
  { label: 'Roles & Perms', href: '/admin/permissions', icon: Shield,     permission: 'read:role_permission' },
  { label: 'Global Logs',  href: '/admin/logs',        icon: FileText,      permission: 'read:infrastructure' },
  { label: 'Settings',    href: '/admin/settings',    icon: Settings },
];

// 2. STAFF SIDEBAR (Teachers/School Staff - Tenant Required)
export const STAFF_SIDEBAR: SidebarItem[] = [
  { label: 'Dashboard', href: '/staff/dashboard', icon: LayoutDashboard },
  {
    label: 'Academic',
    href: '/staff/academic',
    icon: GraduationCap,
    permission: 'read:students',
    children: [
      { label: 'Students',   href: '/staff/students',   icon: Users,      permission: 'read:students' },
      { label: 'Attendance', href: '/staff/attendance', icon: Calendar,   permission: 'read:attendance' },
      { label: 'Exams',      href: '/staff/exams',      icon: FileText,   permission: 'read:exams' },
    ],
  },
  { label: 'Classes',   href: '/staff/classes',   icon: BookOpen,    permission: 'read:classes' },
  { label: 'Library',   href: '/staff/library',   icon: BookOpen,    permission: 'read:subjects' },
  { label: 'Notices',   href: '/staff/notices',   icon: Bell,        permission: 'read:notices' },
  { label: 'My Payroll', href: '/staff/payroll',   icon: Wallet,      permission: 'read:payroll' },
];

// 3. PLATFORM SIDEBAR (School Managers/Owners - Tenant Specific Settings)
export const PLATFORM_SIDEBAR: SidebarItem[] = [
  { 
    label: 'Overview', 
    href: '/platform/dashboard', 
    icon: LayoutDashboard 
  },

  // --- ACADEMIC MODULE ---
  {
    label: 'Academic',
    href: '/platform/academic',
    icon: GraduationCap,
    permission: 'read:students', // Parent check
    children: [
      { label: 'Student Directory', href: '/platform/students', icon: Users, permission: 'read:students' },
      { label: 'Attendance', href: '/platform/attendance', icon: UserCheck, permission: 'read:attendance' },
      { label: 'Classes & Sections', href: '/platform/classes', icon: Building2, permission: 'read:classes' },
      { label: 'Subjects', href: '/platform/subjects', icon: BookOpen, permission: 'read:subjects' },
      { label: 'Teacher Assign', href: '/platform/assignments', icon: ClipboardList, permission: 'read:teacher_assignment' },
    ],
  },

  // --- EXAMINATION MODULE ---
  {
    label: 'Examination',
    href: '/platform/examination',
    icon: FileText,
    permission: 'read:exams',
    children: [
      { label: 'Exam Schedules', href: '/platform/exams', icon: Calendar, permission: 'read:exams' },
      { label: 'Admit Cards', href: '/platform/admit-cards', icon: FileText, permission: 'read:exams' },
      { label: 'Results', href: '/platform/results', icon: BarChart2, permission: 'read:exams' },
    ]
  },

  // --- FINANCE MODULE ---
  {
    label: 'Finance & Fees',
    href: '/platform/finance',
    icon: DollarSign,
    permission: 'read:fees',
    children: [
      { label: 'Fee Collection', href: '/platform/fees', icon: Wallet, permission: 'read:fees' },
      { label: 'Invoices', href: '/platform/invoices', icon: FileText, permission: 'read:invoices' },
      { label: 'Staff Payroll', href: '/platform/payroll', icon: DollarSign, permission: 'read:payroll' },
    ],
  },

  // --- HR & STAFF MODULE ---
  {
    label: 'Human Resources',
    href: '/platform/hr',
    icon: Briefcase,
    permission: 'read:staff',
    children: [
      { label: 'Staff Directory', href: '/platform/staff', icon: Users, permission: 'read:staff' },
      { label: 'Roles & Permissions', href: '/platform/roles', icon: Shield, permission: 'read:roles' },
    ],
  },

  // --- ADMISSION MODULE ---
  {
    label: 'Admissions',
    href: '/platform/admissions',
    icon: Landmark,
    permission: 'read:admission_leads',
    children: [
      { label: 'Leads / Inquiries', href: '/platform/leads', icon: Users, permission: 'read:admission_leads' },
      { label: 'Admission Reports', href: '/platform/admission-reports', icon: BarChart2, permission: 'read:admission_leads' },
    ]
  },

  // --- INVENTORY & LOGISTICS ---
  {
    label: 'Inventory',
    href: '/platform/inventory',
    icon: Building2,
    permission: 'read:infrastructure',
    children: [
      { label: 'Assets & Rooms', href: '/platform/infrastructure', icon: Building2, permission: 'read:infrastructure' },
    ]
  },
  {
    label: 'Logistics',
    href: '/platform/logistics',
    icon: Truck,
    permission: 'read:transport',
    children: [
      { label: 'Transport / Routes', href: '/platform/transport', icon: Truck, permission: 'read:transport' },
    ]
  },

  // --- COMMUNICATION ---
  {
    label: 'Communication',
    href: '/platform/communication',
    icon: Bell,
    permission: 'read:notices',
    children: [
      { label: 'Notice Board', href: '/platform/notices', icon: Bell, permission: 'read:notices' },
    ]
  },

  // --- SECURITY & SYSTEM ---
  {
    label: 'Security',
    href: '/platform/security',
    icon: Shield,
    permission: 'read:user_role',
    children: [
      { label: 'User Roles Mapping', href: '/platform/user-roles', icon: Users, permission: 'read:user_role' },
      { label: 'Access Control', href: '/platform/access-control', icon: Shield, permission: 'read:role_permission' },
    ]
  },

  { label: 'Settings', href: '/platform/settings', icon: Settings },
];

// 4. PORTAL SIDEBAR (Students / Parents - Limited Access)
export const PORTAL_SIDEBAR: SidebarItem[] = [
  { label: 'My Dashboard',  href: '/portal/dashboard',  icon: LayoutDashboard },
  { label: 'My Classes',    href: '/portal/classes',    icon: BookOpen },
  { label: 'Attendance',    href: '/portal/attendance', icon: Calendar },
  { label: 'Examination',   href: '/portal/exams',      icon: FileText },
  { label: 'Fee Status',    href: '/portal/fees',       icon: Wallet },
  { label: 'Notice Board',  href: '/portal/notices',    icon: Bell },
  { label: 'Profile',       href: '/portal/profile',    icon: Users },
];