"use client";

import { Language } from "@prisma/client";
import { useState } from "react";

interface LanguageSelectorProps {
  initialLanguage: Language;
}

const languages: Record<
  Language,
  { name: string; flag: string; nativeName: string }
> = {
  en_US: {
    name: "English",
    flag: "🇺🇸",
    nativeName: "English",
  },
  be: {
    name: "Беларуская",
    flag: "🇧🇾",
    nativeName: "Беларуская",
  },
  pl: {
    name: "Polski",
    flag: "🇵🇱",
    nativeName: "Polski",
  },
  ru: {
    name: "Русский",
    flag: "🇷🇺",
    nativeName: "Русский",
  },
  uk: {
    name: "Українська",
    flag: "🇺🇦",
    nativeName: "Українська",
  },
};

export const LanguageSelector = ({
  initialLanguage,
}: LanguageSelectorProps) => {
  const [currentLanguage, setCurrentLanguage] =
    useState<Language>(initialLanguage);
  const [isLoading, setIsLoading] = useState(false);

  const handleLanguageChange = async (language: Language) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/user/language", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language }),
      });

      if (response.ok) {
        setCurrentLanguage(language);
      }
    } catch (error) {
      console.error("Ошибка при обновлении языка:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6">
      <h3 className="text-xl font-bold text-gray-100 mb-4">
        Translation Language:
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {Object.entries(languages).map(([code, { name, flag }]) => (
          <button
            key={code}
            onClick={() => handleLanguageChange(code as Language)}
            disabled={isLoading}
            className={`
              flex items-center gap-3 p-3 rounded-lg transition-colors
              ${
                currentLanguage === code
                  ? "bg-blue-600 text-white"
                  : "bg-slate-700 text-gray-300 hover:bg-slate-600"
              }
              ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
            `}
          >
            <span className="text-2xl">{flag}</span>
            <div className="text-left">
              <div className="font-medium">{name}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
