"use client";

import { useState, useEffect } from "react";

interface SpeakableTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}

export const useSpeech = () => {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [selectedVoice, setSelectedVoice] =
    useState<SpeechSynthesisVoice | null>(null);
  const [pressedText, setPressedText] = useState<string | null>(null);
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);

  useEffect(() => {
    const checkSpeechSupport = () => {
      try {
        const isSupported =
          typeof window !== "undefined" &&
          "speechSynthesis" in window &&
          "SpeechSynthesisUtterance" in window;

        setIsSpeechSupported(isSupported);

        if (!isSupported) {
          console.log("Web Speech API does not support");
          return;
        }
      } catch (error) {
        console.log("Error checking Web Speech API support:", error);
        setIsSpeechSupported(false);
        return;
      }
    };

    checkSpeechSupport();

    if (!isSpeechSupported) return;

    const loadVoices = () => {
      try {
        const availableVoices = window.speechSynthesis.getVoices();
        const englishVoices = availableVoices.filter((voice) =>
          voice.lang.includes("en")
        );

        const preferredVoice = englishVoices.find(
          (voice) =>
            (voice.name === "Google US English" && voice.lang === "en-US") ||
            (voice.name === "Samantha" && voice.lang === "en-US") ||
            (voice.name === "Alex" && voice.lang === "en-US")
        );

        if (!preferredVoice) {
          const usVoices = englishVoices.filter(
            (voice) => voice.lang === "en-US"
          );
          const largestVoice = usVoices.reduce((prev, current) => {
            return prev.localService === current.localService
              ? prev.name.length > current.name.length
                ? prev
                : current
              : prev.localService
              ? prev
              : current;
          }, usVoices[0]);

          if (largestVoice && !selectedVoice) {
            setSelectedVoice(largestVoice);
          }
        } else if (!selectedVoice) {
          setSelectedVoice(preferredVoice);
        }
      } catch (error) {
        console.log("Error loading voices:", error);
      }
    };

    loadVoices();

    // Безопасно устанавливаем обработчик событий
    try {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    } catch (error) {
      console.log("Error setting voiceschanged handler:", error);
    }

    return () => {
      try {
        if (window.speechSynthesis) {
          window.speechSynthesis.onvoiceschanged = null;
        }
      } catch (error) {
        console.log("Error clearing voiceschanged handler:", error);
      }
    };
  }, [selectedVoice, isSpeechSupported]);

  const speak = (text: string) => {
    if (!isSpeechSupported) {
      console.log("Web Speech API does not support");
      return;
    }

    try {
      setPressedText(text);
      setTimeout(() => setPressedText(null), 150);

      window.speechSynthesis.cancel();
      setPlayingId(text);

      const utterance = new SpeechSynthesisUtterance(text);

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      utterance.onend = () => setPlayingId(null);
      utterance.onerror = (event) => {
        console.log("Error speaking:", event);
        setPlayingId(null);
      };

      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.log("Error speaking:", error);
      setPlayingId(null);
    }
  };

  const SpeakableText = ({
    text,
    className = "",
    style,
  }: SpeakableTextProps) => (
    <span
      className={`group inline-flex items-center gap-1 ${
        isSpeechSupported ? "cursor-pointer" : "cursor-default"
      } ${
        pressedText === text ? "scale-95" : "scale-100"
      } transition-all duration-150 ${className}`}
      onClick={() => isSpeechSupported && speak(text)}
      style={style}
    >
      {text}
      {isSpeechSupported && (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className={`
            w-4 h-4 opacity-30 group-hover:opacity-100
            transition-all duration-300 ease-in-out
            ${playingId === text ? "stroke-blue-400" : "stroke-gray-400"}
          `}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 6L8 10H4V14H8L12 18V6Z" />
          <path d="M15.54 8.46C16.4774 9.39764 17.0039 10.6692 17.0039 12C17.0039 13.3308 16.4774 14.6024 15.54 15.54" />
        </svg>
      )}
    </span>
  );

  return {
    SpeakableText,
  };
};
