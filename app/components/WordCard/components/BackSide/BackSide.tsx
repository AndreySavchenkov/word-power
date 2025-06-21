import { getBackgroundColor } from "@/app/utils/getBackgroundColor";
import { WordInCard } from "@/app/types";
import { ImageSection } from "./components/ImageSection";
import { WordInformation } from "./components/WordInformation";
import { PartsOfSpeech } from "./components/PartsOfSpeech";
import { Examples } from "./components/Examples";

type BackSideProps = {
  word: WordInCard;
  strength: number;
  isImageLoading: boolean;
  setIsImageLoading: (isImageLoading: boolean) => void;
  wordTranslation: string;
  loadingTranslations: Record<string, boolean>;
  translations: Record<string, string>;
};

export const BackSide = ({
  word,
  strength,
  isImageLoading,
  setIsImageLoading,
  wordTranslation,
  loadingTranslations,
  translations,
}: BackSideProps) => {
  return (
    <div className="absolute inset-0 backface-hidden rotate-y-180">
      <div
        className={`w-full h-full ${getBackgroundColor(
          strength
        )} rounded-lg shadow-xl p-2 sm:p-6 overflow-y-auto`}
      >
        <div className="h-full flex flex-col">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <ImageSection
              word={word}
              isImageLoading={isImageLoading}
              setIsImageLoading={setIsImageLoading}
              wordTranslation={wordTranslation}
              strength={strength}
            />

            <div className="w-full sm:w-1/2 flex flex-col">
              <WordInformation
                word={word}
                wordTranslation={wordTranslation}
                strength={strength}
              />

              <PartsOfSpeech
                word={word}
                loadingTranslations={loadingTranslations}
                translations={translations}
              />

              <Examples word={word} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
