"use client";

interface ProgressBarProps {
  current: number;
  target: number;
  label?: string;
  color?: string;
  showPercentage?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function ProgressBar({
  current,
  target,
  label,
  color = "bg-emerald-500",
  showPercentage = true,
  size = "md",
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.round((current / target) * 100));

  const heights = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4",
  };

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-xs text-gray-500">{label}</span>}
          {showPercentage && (
            <span className="text-xs font-semibold text-gray-700">{percentage}%</span>
          )}
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full ${heights[size]} overflow-hidden`}>
        <div
          className={`${color} ${heights[size]} rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[10px] text-gray-400">
          {current.toLocaleString()} / {target.toLocaleString()} {label ? "" : ""}
        </span>
      </div>
    </div>
  );
}
