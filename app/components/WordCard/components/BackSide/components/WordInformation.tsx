import { LevelBadge } from "@/app/components/LevelBadge";
import { ProgressCircle } from "@/app/components/ProgressCircle";
import { useSpeech } from "@/app/hooks/useSpeech";
import { WordInCard } from "@/app/types";

type WordInformationProps = {
  word: WordInCard;
  wordTranslation: string;
  strength: number;
};

export const WordInformation = ({
  word,
  wordTranslation,
  strength,
}: WordInformationProps) => {
  const { SpeakableText } = useSpeech();
  return (
    <div className="hidden sm:block mb-6 sm:mb-8">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex flex-col">
          <SpeakableText
            text={word.eng}
            className="text-2xl sm:text-3xl font-bold text-gray-100 speakable-text translatable leading-tight"
          />
          {wordTranslation && (
            <span className="text-base sm:text-lg text-gray-300 mt-2 font-medium">
              {wordTranslation}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <LevelBadge level={word.level || ""} />
          <ProgressCircle strength={strength || 0} />
        </div>
      </div>
      <div className="text-sm sm:text-base text-gray-400 font-mono bg-gray-800/50 px-3 py-1 rounded-lg inline-block">
        {word.pronunciation}
      </div>
    </div>
  );
};
