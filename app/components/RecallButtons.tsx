interface RecallButtonsProps {
  onProgress: (levelId?: number) => void;
  showSkipButton?: boolean;
  isTransitioning?: boolean;
}

export const RecallButtons = ({
  onProgress,
  showSkipButton,
}: RecallButtonsProps) => {
  const recallLevels = [
    {
      id: 1,
      label: "Don't know",
      color: "text-red-100",
      bgColor: "bg-red-700",
      hoverBgColor: "hover:bg-red-600",
    },
    {
      id: 2,
      label: "Hard",
      color: "text-orange-100",
      bgColor: "bg-orange-700",
      hoverBgColor: "hover:bg-orange-600",
    },
    {
      id: 3,
      label: "Good",
      color: "text-yellow-100",
      bgColor: "bg-yellow-700",
      hoverBgColor: "hover:bg-yellow-600",
    },
    {
      id: 4,
      label: "Easy",
      color: "text-green-100",
      bgColor: "bg-green-700",
      hoverBgColor: "hover:bg-green-600",
    },
  ];

  return (
    <div className="buttons-container">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex flex-col gap-3">
          <div className="flex justify-center gap-3">
            {recallLevels.map((level) => (
              <button
                key={level.id}
                onClick={() => onProgress(level.id)}
                className={`
                  px-3 py-3 rounded-xl text-sm font-medium
                  transform transition-all duration-200
                  ${level.bgColor} ${level.color} ${level.hoverBgColor}
                  hover:scale-105 active:scale-95 shadow-lg
                `}
              >
                {level.label}
              </button>
            ))}
          </div>
          {showSkipButton && (
            <div className="flex justify-center">
              <button
                onClick={() => onProgress()}
                className={`
                  px-3 py-[11px] rounded-xl text-sm font-medium w-full
                  transform transition-all duration-200
                  bg-slate-700 text-slate-300 hover:bg-slate-600
                  hover:scale-105 active:scale-95
                  border border-slate-600
                `}
              >
                Skip
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
