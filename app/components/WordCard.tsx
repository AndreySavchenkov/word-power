"use client";

import { useState } from "react";
import Image from "next/image";
import { useSpeech } from "../hooks/useSpeech";
import { LevelBadge } from "./LevelBadge";
import { ProgressCircle } from "./ProgressCircle";
import { PartOfSpeech } from "@prisma/client";

interface Word {
  id: string;
  eng: string;
  partOfSpeech: PartOfSpeech[];
  level?: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  pronunciation: string;
  definition: string[];
  examples: string[];
  imgUrl: string;
  videoUrls: string[];
}

// interface VideoParams {
//   videoId: string;
//   start?: string;
//   end?: string;
// }

interface RecallLevel {
  id: number;
  label: string;
  color: string;
  bgColor: string;
  hoverBgColor: string;
}

const recallLevels: RecallLevel[] = [
  {
    id: 1,
    label: "Don't know",
    color: "text-red-100",
    bgColor: "bg-red-700",
    hoverBgColor: "hover:bg-red-600",
  },
  {
    id: 2,
    label: "Hard",
    color: "text-orange-100",
    bgColor: "bg-orange-700",
    hoverBgColor: "hover:bg-orange-600",
  },
  {
    id: 3,
    label: "Good",
    color: "text-yellow-100",
    bgColor: "bg-yellow-700",
    hoverBgColor: "hover:bg-yellow-600",
  },
  {
    id: 4,
    label: "Easy",
    color: "text-green-100",
    bgColor: "bg-green-700",
    hoverBgColor: "hover:bg-green-600",
  },
];

interface WordCardProps {
  word: {
    id: string;
    eng: string;
    partOfSpeech: PartOfSpeech[];
    level: Word["level"] | null;
    pronunciation: string;
    definition: string[];
    examples: string[];
    imgUrl: string | null;
    videoUrls: string[];
    globalStrength: number;
    createdAt: Date;
    updatedAt: Date;
  };
  deckId: string;
  onProgress?: () => void;
  strength?: number;
  showSkipButton?: boolean;
}

const partOfSpeechStyles = {
  noun: {
    emoji: "📦",
    color: "bg-blue-700 text-blue-100",
    label: "noun",
  },
  verb: {
    emoji: "🏃",
    color: "bg-green-700 text-green-100",
    label: "verb",
  },
  adjective: {
    emoji: "🎨",
    color: "bg-purple-700 text-purple-100",
    label: "adj",
  },
  adverb: {
    emoji: "⚡",
    color: "bg-yellow-700 text-yellow-100",
    label: "adv",
  },
  pronoun: {
    emoji: "👤",
    color: "bg-pink-700 text-pink-100",
    label: "pron",
  },
  preposition: {
    emoji: "🔗",
    color: "bg-orange-700 text-orange-100",
    label: "prep",
  },
  conjunction: {
    emoji: "🤝",
    color: "bg-red-700 text-red-100",
    label: "conj",
  },
  interjection: {
    emoji: "💭",
    color: "bg-indigo-700 text-indigo-100",
    label: "interj",
  },
} as const;

const skipButtonStyle = {
  id: 0,
  label: "Skip",
  color: "text-slate-300",
  bgColor: "bg-slate-700",
  hoverBgColor: "hover:bg-slate-600",
} as const;

export const WordCard = ({
  word,
  deckId,
  onProgress,
  strength,
  showSkipButton,
}: WordCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const { SpeakableText } = useSpeech();
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [slideDirection, setSlideDirection] = useState<
    "none" | "left" | "right"
  >("none");
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [loadingTranslations, setLoadingTranslations] = useState<
    Record<string, boolean>
  >({});

  // const parseYouTubeUrl = (url: string): VideoParams | null => {
  //   try {
  //     const regExp = /^.*(youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/;
  //     const match = url.match(regExp);
  //     if (!match || match[2].length !== 11) return null;

  //     const urlObj = new URL(url);
  //     const searchParams = new URLSearchParams(urlObj.search);

  //     return {
  //       videoId: match[2],
  //       start: searchParams.get("start") || undefined,
  //       end: searchParams.get("end") || undefined,
  //     };
  //   } catch {
  //     return null;
  //   }
  // };

  const handleClick = (e: React.MouseEvent) => {
    // Проверяем, был ли клик по переводимому элементу
    const target = e.target as HTMLElement;
    if (target.closest(".translatable")) {
      return;
    }

    setIsFlipped(!isFlipped);
  };

  const handleRecallLevel = async (levelId: number) => {
    setSelectedLevel(levelId);
    const direction = levelId >= 3 ? "right" : "left";
    setSlideDirection(direction);

    try {
      await fetch("/api/progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          wordId: word.id,
          strength: levelId,
          deckId: deckId,
        }),
      });

      // Вызываем callback для обновления UI
      if (onProgress) {
        setTimeout(onProgress, 500);
      }
    } catch (error) {
      console.error("Failed to save progress:", error);
    }
  };

  const translateDefinition = async (text: string) => {
    // Если перевод уже существует, переключаем обратно на оригинал
    if (translations[text]) {
      setTranslations((prev) => {
        const newTranslations = { ...prev };
        delete newTranslations[text];
        return newTranslations;
      });
      return;
    }

    try {
      setLoadingTranslations((prev) => ({ ...prev, [text]: true }));

      const response = await fetch("/api/user/language/current");
      const { language } = await response.json();

      if (language === "en_US") {
        setLoadingTranslations((prev) => ({ ...prev, [text]: false }));
        return;
      }

      const translateResponse = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (translateResponse.ok) {
        const { translation } = await translateResponse.json();
        setTranslations((prev) => ({ ...prev, [text]: translation }));
      }
    } catch (error) {
      console.error("Ошибка перевода:", error);
    } finally {
      setLoadingTranslations((prev) => ({ ...prev, [text]: false }));
    }
  };

  return (
    <>
      <div className="card-container w-full max-w-2xl">
        <div
          className={`
            h-full
            transition-all duration-500 ease-in-out
            ${slideDirection === "left" ? "throw-left-up" : ""}
            ${slideDirection === "right" ? "throw-right-up" : ""}
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
              {/* Передняя сторона */}
              <div className="absolute inset-0 backface-hidden">
                <div className="w-full h-full bg-slate-800 rounded-lg shadow-xl p-4 sm:p-6 flex items-center justify-center">
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

              {/* Задняя сторона */}
              <div className="absolute inset-0 backface-hidden rotate-y-180">
                <div className="w-full h-full bg-slate-800 rounded-lg shadow-xl p-2 sm:p-6 overflow-y-auto">
                  <div className="h-full flex flex-col">
                    {/* Верхняя секция */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-4">
                      {/* Левая колонка с изображением */}
                      <div className="w-full sm:w-1/3 relative h-[260px] sm:h-auto">
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
                                <SpeakableText
                                  text={word.eng}
                                  className="text-2xl font-bold text-white speakable-text translatable"
                                />
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

                      {/* Правая колонка с информацией */}
                      <div className="w-full sm:w-2/3 flex flex-col">
                        <div className="hidden sm:block mb-4">
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <SpeakableText
                              text={word.eng}
                              className="text-3xl font-bold text-gray-100 speakable-text translatable"
                            />
                            <div className="flex items-center gap-2">
                              <LevelBadge level={word.level || ""} />
                              <ProgressCircle strength={strength || 0} />
                            </div>
                          </div>
                          <div className="text-sm text-gray-400">
                            {`/${word.pronunciation}/`}
                          </div>
                        </div>

                        {/* Выводим все части речи и определения */}
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-2 mb-2">
                            {word.partOfSpeech.map((pos, index) => (
                              <span
                                key={index}
                                className={`text-sm px-2 py-1 rounded flex items-center gap-1 ${partOfSpeechStyles[pos].color}`}
                              >
                                <span>{partOfSpeechStyles[pos].emoji}</span>
                                <span>{partOfSpeechStyles[pos].label}</span>
                              </span>
                            ))}
                          </div>
                          <div className="space-y-2">
                            {word.definition.map((def, index) => (
                              <div
                                key={index}
                                className="mb-2 cursor-pointer translatable"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  translateDefinition(def);
                                }}
                              >
                                <p className="text-gray-200">
                                  {loadingTranslations[def] ? (
                                    <span className="loading-dots">...</span>
                                  ) : translations[def] ? (
                                    translations[def]
                                  ) : (
                                    def
                                  )}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Примеры */}
                        <div className="space-y-1.5">
                          <div className="border-t border-slate-700 mb-3 w-full"></div>
                          {word.examples.map((example, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 text-gray-500 translatable"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <SpeakableText
                                text={example}
                                className="text-sm speakable-text"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Видео секция */}
                    {/* <div className="mt-auto pt-4 border-t border-slate-700">
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        {word.videoUrls.map((url, index) => {
                          const params = parseYouTubeUrl(url);
                          if (!params) return null;

                          return (
                            <div key={index} className="w-full sm:w-1/2">
                              <iframe
                                className="w-full aspect-video rounded-lg shadow-lg"
                                src={`https://www.youtube.com/embed/${
                                  params.videoId
                                }${
                                  params.start ? `?start=${params.start}` : ""
                                }${params.end ? `&end=${params.end}` : ""}`}
                                title="YouTube video player"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Кнопки уровня запоминания */}
      <div className="buttons-container">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex flex-col gap-3">
            <div className="flex justify-center gap-3">
              {recallLevels.map((level) => (
                <button
                  key={level.id}
                  onClick={() => handleRecallLevel(level.id)}
                  className={`
                    px-3 py-3 rounded-xl text-sm font-medium
                    transform transition-all duration-200
                    ${level.bgColor} ${level.color} ${level.hoverBgColor}
                    hover:scale-105 active:scale-95 shadow-lg
                    ${
                      selectedLevel === level.id
                        ? "ring-2 ring-white ring-opacity-50"
                        : ""
                    }
                  `}
                >
                  {level.label}
                </button>
              ))}
            </div>
            {showSkipButton && (
              <div className="flex justify-center">
                <button
                  onClick={() => onProgress?.()}
                  className={`
                    px-3 py-[11px] rounded-xl text-sm font-medium w-full
                    transform transition-all duration-200
                    ${skipButtonStyle.bgColor} ${skipButtonStyle.color} ${skipButtonStyle.hoverBgColor}
                    hover:scale-105 active:scale-95
                    border border-slate-600
                  `}
                >
                  {skipButtonStyle.label}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
