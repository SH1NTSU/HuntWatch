"use client";

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  showLabel?: boolean;
}

export default function ScoreRing({
  score,
  size = 160,
  strokeWidth = 12,
  label = "Green Score",
  showLabel = true,
}: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 80) return { stroke: "#10b981", text: "text-emerald-500", bg: "text-emerald-100" };
    if (s >= 60) return { stroke: "#f59e0b", text: "text-amber-500", bg: "text-amber-100" };
    if (s >= 40) return { stroke: "#f97316", text: "text-orange-500", bg: "text-orange-100" };
    return { stroke: "#ef4444", text: "text-red-500", bg: "text-red-100" };
  };

  const color = getColor(score);

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color.stroke}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-4xl font-bold ${color.text}`}>{score}</span>
          <span className="text-xs text-gray-400 mt-1">/ 100</span>
        </div>
      </div>
      {showLabel && (
        <p className="text-sm font-medium text-gray-600 mt-2">{label}</p>
      )}
    </div>
  );
}
