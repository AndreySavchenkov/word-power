import { memo, useCallback } from "react";
import { RECALL_LEVELS } from "@/app/constants/recall-levels";

interface RecallButtonsProps {
  onProgress: (levelId?: number) => void;
  showSkipButton?: boolean;
  isTransitioning?: boolean;
  isAuthenticated?: boolean;
  isLoading?: boolean;
}

export const RecallButtons = memo(
  ({
    onProgress,
    showSkipButton,
    isAuthenticated = false,
    isLoading = false,
  }: RecallButtonsProps) => {
    const handleClick = useCallback(
      (levelId?: number) => {
        if (levelId !== undefined && !isAuthenticated) {
          return;
        }
        onProgress(levelId);
      },
      [onProgress, isAuthenticated]
    );

    return (
      <div className="buttons-container w-full">
        <div className="max-w-2xl mx-auto px-2 sm:px-6">
          <div className="flex flex-col gap-4 sm:gap-3">
            {isAuthenticated && (
              <div className="flex justify-between gap-2 sm:gap-3">
                {RECALL_LEVELS.map((level) => (
                  <button
                    key={level.id}
                    onClick={() => handleClick(level.id)}
                    disabled={isLoading}
                    aria-label={level.ariaLabel}
                    className={`
                      flex-1 min-h-[52px] sm:min-h-[48px]
                      px-2 py-3 sm:px-3 sm:py-3
                      rounded-lg text-xs sm:text-sm font-medium
                      transform transition-all duration-200
                      ${level.bgColor} ${level.color} 
                      ${level.hoverBgColor} ${level.activeBgColor}
                      hover:scale-105 active:scale-95 
                      shadow-lg hover:shadow-xl
                      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                      disabled:opacity-50 disabled:cursor-not-allowed
                      disabled:transform-none disabled:shadow-md
                      touch-manipulation
                    `}
                  >
                    <span className="hidden sm:inline">{level.label}</span>
                    <span className="sm:hidden">{level.shortLabel}</span>
                  </button>
                ))}
              </div>
            )}
            {showSkipButton && (
              <div className="flex justify-center">
                <button
                  onClick={() => handleClick()}
                  disabled={isLoading}
                  aria-label="Skip this word"
                  className={`
                    min-h-[48px] sm:min-h-[40px]
                    px-6 py-3 sm:px-4 sm:py-2
                    rounded-lg text-sm sm:text-xs font-medium w-full max-w-xs
                    transform transition-all duration-200
                    bg-slate-700 text-slate-300 
                    hover:bg-slate-600 active:bg-slate-800
                    hover:scale-105 active:scale-95
                    border border-slate-600
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                    disabled:opacity-50 disabled:cursor-not-allowed
                    disabled:transform-none
                    touch-manipulation
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
  }
);

RecallButtons.displayName = "RecallButtons";
