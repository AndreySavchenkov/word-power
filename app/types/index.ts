import { PartOfSpeech } from "@prisma/client";

export type Level = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type WordInCard = {
  id: string;
  eng: string;
  partOfSpeech: PartOfSpeech[];
  level: Level | null;
  pronunciation: string;
  definition: string[];
  examples: string[];
  imgUrl: string | null;
  videoUrls: string[];
  globalStrength: number;
  createdAt: Date;
  updatedAt: Date;
};
