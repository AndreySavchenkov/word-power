"use client";

import { WordInCard } from "@/app/types";
import { FrontSide } from "./components/FrontSide/FrontSide";
import { BackSide } from "./components/BackSide/BackSide";
import { useWord } from "@/app/hooks/useWord";

interface WordCardProps {
  word: WordInCard;
  deckId: string;
  onProgress?: () => void;
  strength?: number;
  showSkipButton?: boolean;
  isAuthenticated?: boolean;
}

export const WordCard = ({
  word,
  strength,
  isAuthenticated = false,
}: WordCardProps) => {
  const {
    isFlipped,
    isImageLoading,
    setIsImageLoading,
    translations,
    loadingTranslations,
    wordTranslation,
    handleClick,
  } = useWord(word, isAuthenticated);

  return (
    <>
      <div className="card-container w-full max-w-2xl">
        <div
          className={`
            h-full
            transition-all duration-500 ease-in-out
          `}
        >
          <div
            className="relative h-full cursor-pointer perspective-1000"
            onClick={handleClick}
          >
            <div
              className={`
                absolute inset-0 transition-transform duration-500 transform-style-3d
                ${isFlipped ? "rotate-y-180" : ""}
              `}
            >
              <FrontSide word={word} strength={strength || 0} />
              <BackSide
                word={word}
                strength={strength || 0}
                isImageLoading={isImageLoading}
                setIsImageLoading={setIsImageLoading}
                wordTranslation={wordTranslation}
                loadingTranslations={loadingTranslations}
                translations={translations}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
