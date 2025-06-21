import { useSpeech } from "@/app/hooks/useSpeech";
import { WordInCard } from "@/app/types";
import { getBackgroundColor } from "@/app/utils/getBackgroundColor";

type FrontSideProps = {
  word: WordInCard;
  strength: number;
};

export const FrontSide = ({ word, strength }: FrontSideProps) => {
  const { SpeakableText } = useSpeech();
  return (
    <div className="absolute inset-0 backface-hidden">
      <div
        className={`w-full h-full ${getBackgroundColor(
          strength
        )} rounded-lg shadow-xl p-4 sm:p-6 flex items-center justify-center`}
      >
        <SpeakableText
          text={word.eng}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-100 speakable-text text-center break-words max-w-full px-4 translatable"
          style={{
            wordBreak: "break-word",
            overflowWrap: "break-word",
            hyphens: "auto",
            lineHeight: "1.2",
          }}
        />
      </div>
    </div>
  );
};
