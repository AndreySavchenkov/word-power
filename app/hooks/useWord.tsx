import { useEffect, useState } from "react";
import { WordInCard } from "../types";

export const useWord = (word: WordInCard, isAuthenticated: boolean) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [loadingTranslations, setLoadingTranslations] = useState<
    Record<string, boolean>
  >({});
  const [wordTranslation, setWordTranslation] = useState<string>("");

  useEffect(() => {
    const translateContent = async () => {
      if (!isAuthenticated) return;

      try {
        const response = await fetch("/api/user/language/current");
        const { language } = await response.json();

        if (language === "en_US") return;

        try {
          const wordTranslateResponse = await fetch("/api/translate", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              text: word.eng,
              mode: "word",
            }),
          });

          if (wordTranslateResponse.ok) {
            const { translation } = await wordTranslateResponse.json();
            setWordTranslation(translation);
          }
        } catch (error) {
          console.error("Error translating word:", error);
        }

        for (const def of word.definition) {
          setLoadingTranslations((prev) => ({ ...prev, [def]: true }));
          try {
            const irregularVerbPattern = /^[a-zA-Z]+ – [a-zA-Z]+ – [a-zA-Z]+$/;
            if (irregularVerbPattern.test(def.trim())) {
              setTranslations((prev) => ({ ...prev, [def]: def }));
              setLoadingTranslations((prev) => ({ ...prev, [def]: false }));
              continue;
            }

            const translateResponse = await fetch("/api/translate", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                text: def,
                mode: "definition",
              }),
            });

            if (translateResponse.ok) {
              const { translation } = await translateResponse.json();
              setTranslations((prev) => ({ ...prev, [def]: translation }));
            }
          } finally {
            setLoadingTranslations((prev) => ({ ...prev, [def]: false }));
          }
        }
      } catch (error) {
        console.error("Error translating word:", error);
      }
    };

    translateContent();
  }, [word.eng, word.definition, isAuthenticated]);

  const handleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest(".translatable")) {
      return;
    }

    setIsFlipped(!isFlipped);
  };

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
