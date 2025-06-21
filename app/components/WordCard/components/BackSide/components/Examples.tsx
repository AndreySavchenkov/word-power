import { WordInCard } from "@/app/types";
import { useSpeech } from "@/app/hooks/useSpeech";

type ExamplesProps = {
  word: WordInCard;
};

export const Examples = ({ word }: ExamplesProps) => {
  const { SpeakableText } = useSpeech();
  return (
    <div className="space-y-1.5">
      <div className="border-t border-slate-700 mb-3 w-full"></div>
      {word.examples.map((example, index) => (
        <div
          key={index}
          className="flex items-center gap-2 text-gray-500 translatable"
          onClick={(e) => e.stopPropagation()}
        >
          <SpeakableText text={example} className="text-sm speakable-text" />
        </div>
      ))}
    </div>
  );
};
