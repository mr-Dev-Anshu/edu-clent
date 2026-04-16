// src/components/shared/AvatarCircle.tsx
import { cn, getInitials, generateAvatarColor } from "@/lib/utils";

interface AvatarCircleProps {
  name: string;
  imageUrl?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

const SIZE_CLASSES = {
  xs: "w-6 h-6 text-[10px]",
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
  xl: "w-16 h-16 text-lg",
};

export const AvatarCircle = ({
  name,
  imageUrl,
  size = "md",
  className,
}: AvatarCircleProps) => {
  const initials    = getInitials(name);
  const colorClass  = generateAvatarColor(name);

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name}
        className={cn(
          "rounded-full object-cover flex-shrink-0",
          SIZE_CLASSES[size],
          className
        )}
      />
    );
  }

  return (
    <div
      aria-label={name}
      className={cn(
        "rounded-full flex items-center justify-center font-semibold shrink-0 select-none",
        SIZE_CLASSES[size],
        colorClass,
        className
      )}
    >
      {initials}
    </div>
  );
};