"use client";

import { ReactNode } from "react";

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  subtext?: string;
  color?: string;
  alert?: boolean;
}

export default function StatCard({
  icon,
  label,
  value,
  subtext,
  color = "bg-white",
  alert = false,
}: StatCardProps) {
  return (
    <div
      className={`${color} rounded-2xl p-5 shadow-sm border ${
        alert ? "border-red-200 bg-red-50" : "border-gray-100"
      } transition-all hover:shadow-md`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</p>
          <p className={`text-2xl font-bold mt-1 ${alert ? "text-red-600" : "text-gray-900"}`}>
            {value}
          </p>
          {subtext && (
            <p className={`text-xs mt-1 ${alert ? "text-red-500" : "text-gray-400"}`}>
              {subtext}
            </p>
          )}
        </div>
        <div
          className={`p-2.5 rounded-xl ${
            alert ? "bg-red-100 text-red-500" : "bg-emerald-50 text-emerald-600"
          }`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
