interface LevelBadgeProps {
  level: string;
  className?: string;
}

export const LevelBadge = ({ level, className = "" }: LevelBadgeProps) => {
  const getLevelColor = (level: string) => {
    const colors = {
      A1: "bg-green-700 text-green-100",
      A2: "bg-green-700 text-green-100",
      B1: "bg-yellow-700 text-yellow-100",
      B2: "bg-yellow-700 text-yellow-100",
      C1: "bg-orange-700 text-orange-100",
      C2: "bg-orange-700 text-orange-100",
    };
    return colors[level as keyof typeof colors] || "bg-gray-700 text-gray-100";
  };

  return (
    <span
      className={`px-2 py-0.5 rounded text-xs font-medium ${getLevelColor(
        level
      )} ${className}`}
    >
      {level}
    </span>
  );
};
