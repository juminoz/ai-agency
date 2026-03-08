"use client";

interface ScoreGaugeProps {
  score: number;
  label?: string;
  size?: number;
}

export function ScoreGauge({ score, label = "Brand Buddy Score", size = 160 }: ScoreGaugeProps) {
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const offset = circumference - progress;

  const strokeColor =
    score >= 80 ? "#22C55E" : score >= 60 ? "#F5A623" : "#EF4444";

  const glowColor =
    score >= 80
      ? "rgba(34, 197, 94, 0.15)"
      : score >= 60
        ? "rgba(245, 166, 35, 0.15)"
        : "rgba(239, 68, 68, 0.15)";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="rotate-[-90deg]"
        >
          {/* Background ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth={strokeWidth}
          />
          {/* Glow effect */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={glowColor}
            strokeWidth={strokeWidth + 8}
            strokeDasharray={`${progress} ${offset}`}
            strokeLinecap="round"
            style={{
              transition: "stroke-dasharray 1s ease-in-out",
            }}
          />
          {/* Progress ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={`${progress} ${offset}`}
            strokeLinecap="round"
            style={{
              transition: "stroke-dasharray 1s ease-in-out",
            }}
          />
        </svg>
        {/* Score number centered */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-gray-800">{score}</span>
          <span className="text-xs text-gray-400">/ 100</span>
        </div>
      </div>
      <span className="text-sm font-medium text-gray-600">{label}</span>
    </div>
  );
}
