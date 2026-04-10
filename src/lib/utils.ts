// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]): string =>
  twMerge(clsx(inputs));

export const getInitials = (name: string, maxChars = 2): string =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, maxChars)
    .map((n) => n[0].toUpperCase())
    .join("");

export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const generateAvatarColor = (name: string): string => {
  const colors = [
    "bg-blue-100 text-blue-800",
    "bg-purple-100 text-purple-800",
    "bg-teal-100 text-teal-800",
    "bg-amber-100 text-amber-800",
    "bg-rose-100 text-rose-800",
    "bg-indigo-100 text-indigo-800",
    "bg-green-100 text-green-800",
  ];
  const index = name
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
  return colors[index];
};

export const truncate = (str: string, maxLength: number): string =>
  str.length > maxLength ? `${str.slice(0, maxLength)}…` : str;

export const buildQueryString = (
  params: Record<string, string | number | boolean | undefined>
): string => {
  const filtered = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== "" && v !== null
  );
  return filtered.length
    ? "?" + new URLSearchParams(filtered.map(([k, v]) => [k, String(v)])).toString()
    : "";
};