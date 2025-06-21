export interface PartOfSpeech {
  emoji: string;
  color: string;
  label: string;
}

export const PART_OF_SPEECH_STYLES: Record<string, PartOfSpeech> = {
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
  idiom: {
    emoji: "💭",
    color: "bg-indigo-700 text-indigo-100",
    label: "idiom",
  },
} as const;
