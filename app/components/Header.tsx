"use client";

import { useEffect, useState } from "react";
import AuthButton from "./AuthButton";
import Link from "next/link";
import logoImg from "@/public/icons/logo.png";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useReviewCount } from "../contexts/ReviewCountContext";
import { usePathname } from "next/navigation";

const Logo = () => (
  <div className="flex items-center gap-2">
    <Image
      src={logoImg}
      alt="Logo"
      width={36}
      height={36}
      className="w-9 h-9 sm:w-10 sm:h-10"
    />
    <span className="hidden sm:inline text-lg sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-white to-blue-500">
      WordPower
    </span>
  </div>
);

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: session, status } = useSession();
  const { reviewCount, setReviewCount } = useReviewCount();
  const isAuthenticated = status === "authenticated";
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const fetchReviewCount = async () => {
      if (!isAuthenticated) return;

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

    if (status !== "loading") {
      fetchReviewCount();

      const interval = setInterval(fetchReviewCount, 60000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, status, setReviewCount]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-slate-900/95 backdrop-blur-md shadow-xl border-b border-slate-700/50"
          : "bg-slate-900/80 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 sm:h-18">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Logo />
            </Link>
          </div>
          <div className="flex-1 flex justify-center">
            {isAuthenticated && (
              <Link
                href="/review"
                className={`relative px-5 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-3 text-base ${
                  isActive("/review")
                    ? "text-white bg-slate-700/50 shadow-lg"
                    : "text-gray-300 hover:text-white hover:bg-slate-700/30"
                }`}
              >
                <span className="hidden xs:inline">Review</span>
                <span className="xs:hidden">Review</span>
                {reviewCount > 0 && (
                  <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 text-xs font-bold leading-none text-white bg-red-500 rounded-full shadow-sm">
                    {reviewCount}
                  </span>
                )}
              </Link>
            )}
          </div>
          <div className="flex-shrink-0">
            <AuthButton />
          </div>
        </div>
      </div>
    </header>
  );
};
