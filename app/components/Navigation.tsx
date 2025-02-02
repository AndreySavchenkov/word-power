"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export const Navigation = () => {
  const pathname = usePathname();
  const [reviewCount, setReviewCount] = useState(0);

  const isActive = (path: string) => pathname === path;

  useEffect(() => {
    const fetchReviewCount = async () => {
      try {
        const response = await fetch("/api/progress/count");
        if (response.ok) {
          const data = await response.json();
          setReviewCount(data.count);
        }
      } catch (error) {
        console.error("Failed to fetch review count:", error);
      }
    };

    fetchReviewCount();
    // Обновляем каждую минуту
    const interval = setInterval(fetchReviewCount, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-slate-900/50 backdrop-blur-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link
              href="/decks"
              className={`text-sm font-medium transition-colors ${
                isActive("/decks")
                  ? "text-white"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Decks
            </Link>
            <Link
              href="/review"
              className={`text-sm font-medium transition-colors flex items-center gap-2 ${
                isActive("/review")
                  ? "text-white"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Review
              {reviewCount > 0 && (
                <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                  {reviewCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
