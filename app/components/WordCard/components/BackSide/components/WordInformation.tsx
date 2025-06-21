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
    <div className="hidden sm:block mb-4">
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex flex-col">
          <SpeakableText
            text={word.eng}
            className="text-3xl font-bold text-gray-100 speakable-text translatable"
          />
          {wordTranslation && (
            <span className="text-lg text-gray-400 mt-1">
              {wordTranslation}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <LevelBadge level={word.level || ""} />
          <ProgressCircle strength={strength || 0} />
        </div>
      </div>
      <div className="text-sm text-gray-400">{`/${word.pronunciation}/`}</div>
    </div>
  );
};
