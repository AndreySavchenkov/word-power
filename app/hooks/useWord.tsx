import { useEffect, useState, useCallback, useMemo } from "react";
import { WordInCard } from "../types";

export const useWord = (word: WordInCard, isAuthenticated: boolean) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [loadingTranslations, setLoadingTranslations] = useState<
    Record<string, boolean>
  >({});
  const [wordTranslation, setWordTranslation] = useState<string>("");

  const wordKey = useMemo(
    () => `${word.eng}-${word.definition.join(",")}`,
    [word.eng, word.definition]
  );

  useEffect(() => {
    const translateContent = async () => {
      if (!isAuthenticated) return;

      try {
        const response = await fetch("/api/user/language/current");
        const { language } = await response.json();

        if (language === "en_US") return;

        const translationPromises = [];

        const wordTranslatePromise = fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: word.eng, mode: "word" }),
        }).then((res) => (res.ok ? res.json() : null));

        for (const def of word.definition) {
          setLoadingTranslations((prev) => ({ ...prev, [def]: true }));

          const irregularVerbPattern = /^[a-zA-Z]+ – [a-zA-Z]+ – [a-zA-Z]+$/;
          if (irregularVerbPattern.test(def.trim())) {
            setTranslations((prev) => ({ ...prev, [def]: def }));
            setLoadingTranslations((prev) => ({ ...prev, [def]: false }));
            continue;
          }

          const defPromise = fetch("/api/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: def, mode: "definition" }),
          })
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => ({ def, translation: data?.translation || def }))
            .finally(() => {
              setLoadingTranslations((prev) => ({ ...prev, [def]: false }));
            });

          translationPromises.push(defPromise);
        }

        const [wordResult, ...defResults] = await Promise.all([
          wordTranslatePromise,
          ...translationPromises,
        ]);

        if (wordResult?.translation) {
          setWordTranslation(wordResult.translation);
        }

        defResults.forEach(({ def, translation }) => {
          if (translation) {
            setTranslations((prev) => ({ ...prev, [def]: translation }));
          }
        });
      } catch (error) {
        console.error("Error translating word:", error);
      }
    };

    translateContent();
  }, [wordKey, isAuthenticated]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest(".translatable")) {
      return;
    }
    setIsFlipped((prev) => !prev);
  }, []);

  return {
    isFlipped,
    isImageLoading,
    setIsImageLoading,
    translations,
    loadingTranslations,
    wordTranslation,
    handleClick,
  };
};
