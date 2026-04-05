import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string) {
  return format(new Date(date), "MMM d, yyyy");
}

export const PRIORITY_COLORS = {
  LOW: "bg-slate-100 text-slate-700",
  MEDIUM: "bg-blue-100 text-blue-700",
  HIGH: "bg-orange-100 text-orange-700",
  URGENT: "bg-red-100 text-red-700",
} as const;

export const STATUS_LABELS = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  IN_REVIEW: "In Review",
  DONE: "Done",
} as const;

export const STATUS_COLORS = {
  TODO: "bg-slate-500",
  IN_PROGRESS: "bg-blue-500",
  IN_REVIEW: "bg-amber-500",
  DONE: "bg-green-500",
} as const;
