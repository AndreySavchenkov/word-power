import { WordInCard } from "@/app/types";
import { useSpeech } from "@/app/hooks/useSpeech";

type ExamplesProps = {
  word: WordInCard;
};

export const Examples = ({ word }: ExamplesProps) => {
  const { SpeakableText } = useSpeech();
  return (
    <div className="space-y-3">
      <div className="border-t border-slate-600 mb-4 w-full"></div>
      <h4 className="text-sm sm:text-base font-semibold text-gray-300 mb-3">
        Examples:
      </h4>
      {word.examples.map((example, index) => (
        <div
          key={index}
          className="flex items-start gap-3 p-1 text-gray-400 translatable bg-gray-800/20 rounded-lg hover:bg-gray-800/40 transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="text-blue-400 font-mono text-sm mt-0.5">•</span>
          <SpeakableText
            text={example}
            className="text-sm sm:text-base speakable-text leading-relaxed flex-1"
          />
        </div>
      ))}
    </div>
  );
};
