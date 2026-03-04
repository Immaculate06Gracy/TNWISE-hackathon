import { useMemo } from "react";

interface BatteryGaugeProps {
  level: number;
}

export function BatteryGauge({ level }: BatteryGaugeProps) {
  const normalizedLevel = Math.max(0, Math.min(100, level));
  
  // Determine color based on level
  const color = useMemo(() => {
    if (normalizedLevel <= 20) return "hsl(var(--destructive))";
    if (normalizedLevel <= 50) return "hsl(var(--warning))";
    return "hsl(var(--success))";
  }, [normalizedLevel]);

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedLevel / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center w-24 h-24">
      {/* Background circle */}
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-white/10"
        />
        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: strokeDashoffset,
            transition: "stroke-dashoffset 1s ease-in-out, stroke 0.5s ease",
          }}
          className="drop-shadow-lg"
        />
      </svg>
      {/* Percentage Text */}
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-xl font-bold font-mono-numbers text-white">{normalizedLevel}%</span>
      </div>
    </div>
  );
}
