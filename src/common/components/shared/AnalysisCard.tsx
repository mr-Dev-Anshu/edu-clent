import React, { ReactNode, ElementType } from 'react';
type CardVariant = 'primary' | 'white' | 'accent';

interface AnalysisCardProps {
  variant?: CardVariant;
  header: ReactNode;
  data: string | number | ReactNode;
  footer?: ReactNode;
  icon?: ElementType;
  className?: string;
}

const AnalysisCard: React.FC<AnalysisCardProps> = ({
  variant = 'white',
  header,
  data,
  footer,
  icon: Icon,
  className = "",
}) => {
  
  // 🔥 Refined Variants - Making Primary "Lighter" and Elegant
  const variants: Record<CardVariant, string> = {
    // New Primary: Light Indigo/Slate tint with a strong accent border
    primary: "bg-indigo-50/30 text-indigo-900 border-l-4 border-l-indigo-600 border-y border-r border-indigo-100/50 shadow-[0_10px_20px_rgba(79,70,229,0.04)]", 
    // White: Clean, minimal with soft border
    white: "bg-white text-slate-900 border border-slate-100 shadow-sm",
    // Accent: Soft blue for secondary stats
    accent: "bg-blue-50 text-blue-700 border border-blue-100/50", 
  };

  const headerStyles: Record<CardVariant, string> = {
    primary: "text-indigo-600/80",
    white: "text-slate-500",
    accent: "text-blue-600/80",
  };

  const iconStyles: Record<CardVariant, string> = {
    primary: "text-indigo-600 bg-indigo-100/50 p-1.5 rounded-lg",
    white: "text-slate-400 bg-slate-50 p-1.5 rounded-lg",
    accent: "text-blue-600 bg-blue-100/50 p-1.5 rounded-lg",
  };

  return (
    <div 
      className={`rounded-2xl p-5 flex flex-col justify-between min-h-[150px] max-h-[150px] transition-all duration-300 hover:shadow-md hover:-translate-y-1 ${variants[variant]} ${className}`}
    >
      {/* 1. Header Section */}
      <div className="flex justify-between items-start">
        <div className={`uppercase tracking-widest text-[10px] font-bold ${headerStyles[variant]}`}>
          {header}
        </div>
        {Icon && (
          <div className={iconStyles[variant]}>
            <Icon size={18} strokeWidth={2.5} />
          </div>
        )}
      </div>

      {/* 2. Data Section */}
      <div className="mt-2">
        <div className="text-4xl font-black tracking-tight leading-tight">
          {data}
        </div>
      </div>

      {/* 3. Footer Section */}
      {footer && (
        <div className="mt-auto pt-3 border-t border-current/5 text-[12px] flex items-center gap-1.5 opacity-80">
          {footer}
        </div>
      )}
    </div>
  );
};

export default AnalysisCard;