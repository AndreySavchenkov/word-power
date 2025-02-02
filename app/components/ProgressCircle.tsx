import { useMemo } from "react";

interface ProgressCircleProps {
  strength: number;
  size?: number;
  strokeWidth?: number;
}

export const ProgressCircle = ({
  strength,
  size = 24,
  strokeWidth = 3,
}: ProgressCircleProps) => {
  const getColorByStrength = (strength: number) => {
    switch (strength) {
      case 1:
        return "rgb(185, 28, 28)"; // red-700
      case 2:
        return "rgb(194, 65, 12)"; // orange-700
      case 3:
        return "rgb(161, 98, 7)"; // yellow-700
      case 4:
        return "rgb(21, 128, 61)"; // green-700
      default:
        return "rgb(51, 65, 85)"; // slate-700
    }
  };

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progressPercentage = (strength / 4) * 100;
  const offset = circumference - (progressPercentage / 100) * circumference;

  const color = useMemo(() => getColorByStrength(strength), [strength]);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Фоновый круг */}
      <svg className="rotate-[-90deg]" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgb(51, 65, 85)"
          strokeWidth={strokeWidth}
          className="opacity-20"
        />
        {/* Прогресс */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-300"
          strokeLinecap="round"
        />
      </svg>
      {/* Текст в центре */}
      <div
        className="absolute inset-0 flex items-center justify-center text-xs font-medium"
        style={{ color }}
      >
        {strength}
      </div>
    </div>
  );
};
