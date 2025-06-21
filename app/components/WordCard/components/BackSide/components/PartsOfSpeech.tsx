import { PART_OF_SPEECH_STYLES } from "@/app/constants/partOfSpeech";
import { WordInCard } from "@/app/types";

type PartsOfSpeechProps = {
  word: WordInCard;
  loadingTranslations: Record<string, boolean>;
  translations: Record<string, string>;
};

export const PartsOfSpeech = ({
  word,
  loadingTranslations,
  translations,
}: PartsOfSpeechProps) => {
  return (
    <div className="mb-4">
      <div className="flex flex-wrap gap-2 mb-2">
        {word.partOfSpeech.map((pos, index) => (
          <span
            key={index}
            className={`text-sm px-2 py-1 rounded flex items-center gap-1 ${PART_OF_SPEECH_STYLES[pos].color}`}
          >
            <span>{PART_OF_SPEECH_STYLES[pos].emoji}</span>
            <span>{PART_OF_SPEECH_STYLES[pos].label}</span>
          </span>
        ))}
      </div>
      <div className="space-y-2">
        {word.definition.map((def, index) => (
          <div key={index} className="mb-2">
            <p className="text-gray-200">
              {loadingTranslations[def] ? (
                <span className="loading-dots">...</span>
              ) : (
                translations[def] || def
              )}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
