import { WordInCard } from "@/app/types";

import Image from "next/image";

import { LevelBadge } from "@/app/components/LevelBadge";
import { ProgressCircle } from "@/app/components/ProgressCircle";
import { useSpeech } from "@/app/hooks/useSpeech";

type ImageSectionProps = {
  word: WordInCard;
  isImageLoading: boolean;
  setIsImageLoading: (isImageLoading: boolean) => void;
  wordTranslation: string;
  strength: number;
};

export const ImageSection = ({
  word,
  isImageLoading,
  setIsImageLoading,
  wordTranslation,
  strength,
}: ImageSectionProps) => {
  const { SpeakableText } = useSpeech();
  return (
    <div className="w-full relative h-[200px] sm:h-[400px]">
      {word.imgUrl ? (
        <>
          {isImageLoading && (
            <div className="absolute inset-0 bg-gray-700 rounded-lg flex items-center justify-center animate-pulse">
              <svg
                className="w-8 h-8 text-gray-400 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
          )}
          <Image
            priority={true}
            quality={80}
            src={word.imgUrl}
            alt={word.eng}
            width={300}
            height={300}
            className={`w-full h-full object-cover rounded-lg shadow-md transition-opacity duration-300 ${
              isImageLoading ? "opacity-0" : "opacity-100"
            }`}
            onLoadingComplete={() => setIsImageLoading(false)}
          />
        </>
      ) : (
        <div className="w-full h-full bg-gray-700 rounded-lg flex items-center justify-center">
          <span className="text-gray-400">No image</span>
        </div>
      )}
      <div className="absolute top-0 left-0 right-0 sm:hidden">
        <div className="p-1">
          <div className="bg-black bg-opacity-50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex flex-col">
                <SpeakableText
                  text={word.eng}
                  className="text-2xl font-bold text-white speakable-text translatable"
                />
                {wordTranslation && (
                  <span className="text-base text-gray-300 mt-0.5">
                    {wordTranslation}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <LevelBadge level={word.level || ""} />
                <ProgressCircle strength={strength || 0} />
              </div>
            </div>
            <div className="text-sm text-gray-200">
              {`/${word.pronunciation}/`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
