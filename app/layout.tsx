import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "./components/Header";
import { ReviewCountProvider } from "./contexts/ReviewCountContext";

export const metadata: Metadata = {
  title:
    "Word Power – English Vocabulary Learning App | Spaced Repetition System",
  description:
    "Learn English words effectively with spaced repetition. Expand your vocabulary, track progress, and study words with examples and pronunciation. Multi-language support: Russian, Ukrainian, Belarusian, Polish, and Hindi.",
  keywords:
    "english learning, vocabulary, english words, flashcards, spaced repetition, multi-language, pronunciation, transcription",
  authors: [{ name: "Word Power Team" }],
  creator: "Word Power",
  publisher: "Word Power",
  openGraph: {
    type: "website",
    title: "Word Power – English Vocabulary Learning App",
    description:
      "Effective English words learning app with spaced repetition system.",
    url: "https://word-power-mu.vercel.app/",
    siteName: "Word Power",
    images: [
      {
        url: "/images/word-power-og.jpg",
        width: 1200,
        height: 630,
        alt: "Word Power English learning app",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Word Power – English Vocabulary Learning App",
    description:
      "Effective English words learning app with spaced repetition system.",
    images: ["/images/word-power-twitter.jpg"],
  },
  viewport:
    "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
  applicationName: "Word Power",
  category: "education",
  alternates: {
    languages: {
      "en-US": "/en",
      ru: "/ru",
      pl: "/pl",
      uk: "/ua",
      be: "/by",
      hi: "/hi",
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-slate-900">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className="bg-slate-900">
        <ReviewCountProvider>
          <Providers>
            <Header />
            <div>{children}</div>
          </Providers>
        </ReviewCountProvider>
      </body>
    </html>
  );
}
