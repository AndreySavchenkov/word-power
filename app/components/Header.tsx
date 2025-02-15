"use client";

import { useEffect, useState } from "react";
import AuthButton from "./AuthButton";
import Link from "next/link";

const Logo = () => (
  <div className="flex items-center gap-2">
    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-white to-blue-500 sm:hidden">
      WP
    </span>
    <span className="hidden sm:inline text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-white to-blue-500">
      Word Power
    </span>
  </div>
);

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [reviewCount, setReviewCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

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

    window.addEventListener("scroll", handleScroll);
    fetchReviewCount();
    const interval = setInterval(fetchReviewCount, 60000);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(interval);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-slate-800/95 backdrop-blur-sm shadow-lg"
          : "bg-slate-800/50"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12 sm:h-16">
          <Link href="/">
            <Logo />
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              href="/review"
              className="text-xs sm:text-sm text-gray-300 hover:text-white transition-colors flex items-center gap-2"
            >
              Review
              {reviewCount > 0 && (
                <span className="inline-flex items-center justify-center px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                  {reviewCount}
                </span>
              )}
            </Link>
          </nav>
          <AuthButton />
        </div>
      </div>
    </header>
  );
};
