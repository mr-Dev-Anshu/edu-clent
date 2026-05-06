import React from 'react';
import { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { PermissionGuard } from '@/hoc/PermissionGuard';

interface NavItem {
  label: string;
  href: string;
  isActive?: boolean;
}

// Button Config Type
interface HeaderAction {
  label: string;
  onClick: () => void;
  icon?: LucideIcon;
  variant?: 'primary' | 'secondary' | 'outline'; 
  isHidden?: boolean; 
  permission?: string;
  anyOf?: string[];
  allOf?: string[];
  roles?: string | string[];
  fallback?: React.ReactNode;
}

interface DashboardHeaderProps {
  moduleName: string;
  headerNavItems: NavItem[];
  actions?: HeaderAction[]; // Bas ye array bhejenge
  onSearchChange?: (value: string) => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  moduleName,
  headerNavItems,
  actions = [],
}) => {
  
  // Style mapping logic
  const getBtnStyles = (variant: string = 'primary') => {
    switch (variant) {
      case 'primary': 
        return "bg-[#0F172A] text-white hover:bg-slate-800 shadow-sm";
      case 'outline': 
        return "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50";
      case 'secondary': 
        return "bg-slate-100 text-slate-900 hover:bg-slate-200";
      default: 
        return "bg-[#0F172A] text-white";
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 w-full">
      <div className="max-w-400 mx-auto px-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-y-4 py-3 min-h-16">
          
          <div className="flex items-center gap-6 md:gap-10 overflow-x-auto no-scrollbar">
            <h1 className="text-xl font-bold text-slate-900 whitespace-nowrap">
              {moduleName}
            </h1>

            <nav className="flex items-center gap-1">
              {headerNavItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className={`px-3 py-2 text-sm font-medium transition-all whitespace-nowrap rounded-md ${
                    item.isActive 
                      ? "text-slate-900 bg-slate-100" 
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4 grow justify-end">
            <div className="flex items-center gap-2 shrink-0">
              

              {actions
                .filter(action => !action.isHidden)
                .map((btn, idx) => {
                  const actionButton = (
                    <button 
                      onClick={btn.onClick}
                      className={`flex items-center cursor-pointer justify-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition-all min-w-25 ${getBtnStyles(btn.variant)}`}
                    >
                      {btn.icon && <btn.icon size={18} />}
                      <span className="whitespace-nowrap">{btn.label}</span>
                    </button>
                  );

                  if (!btn.permission && !btn.anyOf && !btn.allOf && !btn.roles) {
                    return <React.Fragment key={idx}>{actionButton}</React.Fragment>;
                  }

                  return (
                    <PermissionGuard
                      key={idx}
                      permission={btn.permission}
                      anyOf={btn.anyOf}
                      allOf={btn.allOf}
                      roles={btn.roles}
                      fallback={btn.fallback}
                    >
                      {actionButton}
                    </PermissionGuard>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
