"use client";

import { useState, useEffect } from "react";

interface SpeakableTextProps {
  text: string;
  className?: string;
}

export const useSpeech = () => {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [selectedVoice, setSelectedVoice] =
    useState<SpeechSynthesisVoice | null>(null);
  const [pressedText, setPressedText] = useState<string | null>(null);

  useEffect(() => {
    const loadVoices = () => {
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
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [selectedVoice]);

  const speak = (text: string) => {
    if (!("speechSynthesis" in window)) return;

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
    utterance.onerror = () => setPlayingId(null);

    window.speechSynthesis.speak(utterance);
  };

  const SpeakableText = ({ text, className = "" }: SpeakableTextProps) => (
    <span
      className={`group inline-flex items-center gap-1 cursor-pointer ${
        pressedText === text ? "scale-95" : "scale-100"
      } transition-all duration-150 ${className}`}
      onClick={() => speak(text)}
    >
      {text}
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
    </span>
  );

  return {
    SpeakableText,
  };
};
