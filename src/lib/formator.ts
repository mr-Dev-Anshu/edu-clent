
export const formatCurrency = (
  amountInPaise: number,
  currency = "INR"
): string => {
  const amount = amountInPaise / 100;
  if (amount >= 10_000_000) return `₹${(amount / 10_000_000).toFixed(2)} Cr`;
  if (amount >= 100_000)    return `₹${(amount / 100_000).toFixed(2)} L`;
  if (amount >= 1_000)      return `₹${(amount / 1_000).toFixed(1)}K`;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (
  date: Date | string,
  format: "short" | "long" | "relative" = "short"
): string => {
  const d = new Date(date);
  if (format === "relative") {
    const diffMs = Date.now() - d.getTime();
    const diffSec = Math.round(diffMs / 1000);
    if (diffSec < 60)   return "just now";
    if (diffSec < 3600) return `${Math.round(diffSec / 60)} min ago`;
    if (diffSec < 86400) return `${Math.round(diffSec / 3600)} hour${Math.round(diffSec / 3600) !== 1 ? "s" : ""} ago`;
    const diffDays = Math.round(diffSec / 86400);
    if (diffDays < 30)  return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
  }
  if (format === "long") {
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit", month: "long", year: "numeric",
    }).format(d);
  }
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  }).format(d);
};

export const formatNumber = (n: number): string =>
  new Intl.NumberFormat("en-IN").format(n);

export const formatPercentage = (value: number, decimals = 1): string =>
  `${value.toFixed(decimals)}%`;

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024)        return `${bytes} B`;
  if (bytes < 1024 ** 2)   return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 ** 3)   return `${(bytes / 1024 ** 2).toFixed(2)} MB`;
  return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
};

export const formatAcademicYear = (startYear: number): string =>
  `${startYear}–${String(startYear + 1).slice(2)}`;