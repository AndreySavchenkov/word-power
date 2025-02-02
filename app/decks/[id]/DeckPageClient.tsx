"use client";

import { WordCard } from "@/app/components/WordCard";
import Link from "next/link";
import { Deck, Word, DeckWord } from "@prisma/client";
import { useState } from "react";

type DeckWithWords = Deck & {
  words: (DeckWord & {
    word: Word;
  })[];
};

interface DeckPageClientProps {
  deck: DeckWithWords;
}

export function DeckPageClient({ deck }: DeckPageClientProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleProgress = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      if (currentWordIndex < deck.words.length - 1) {
        setCurrentWordIndex((prev) => prev + 1);
        setIsTransitioning(false);
      } else {
        setIsCompleted(true);
      }
    }, 500);
  };

  const currentWord = deck.words[currentWordIndex]?.word;

  if (isCompleted || deck.words.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-100">
              Все карточки пройдены!
            </h2>
            <Link
              href="/decks"
              className="mt-4 inline-block text-gray-400 hover:text-white transition-colors"
            >
              ← Вернуться к колодам
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/decks"
              className="text-gray-400 hover:text-white transition-colors"
            >
              ← Назад к колодам
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-100">{deck.name}</h1>
              {deck.description && (
                <p className="text-gray-400 mt-2">{deck.description}</p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-blue-900 text-blue-100 rounded-full text-xs">
                {deck.level}
              </span>
              <span className="text-sm text-gray-400">{deck.category}</span>
              <span className="text-sm text-gray-400">
                {currentWordIndex + 1} / {deck.words.length}
              </span>
            </div>
          </div>
        </div>

        <div
          className={`space-y-8 ${
            isTransitioning ? "pointer-events-none" : ""
          }`}
        >
          <WordCard
            key={currentWord.id}
            word={{
              id: currentWord.id,
              eng: currentWord.eng,
              partOfSpeech: currentWord.partOfSpeech,
              level: currentWord.level || undefined,
              pronunciation: currentWord.pronunciation,
              definition: currentWord.definition,
              examples: currentWord.examples,
              imgUrl: currentWord.imgUrl || "",
              videoUrls: currentWord.videoUrls,
            }}
            deckId={deck.id}
            onProgress={handleProgress}
          />
        </div>
      </div>
    </div>
  );
}
