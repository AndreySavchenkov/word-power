import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "./components/Header";
import { ReviewCountProvider } from "./contexts/ReviewCountContext";

export const metadata: Metadata = {
  title: "Word Power – Expand Your Vocabulary",
  description: "An app that helps you learn and expand your English vocabulary",
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
