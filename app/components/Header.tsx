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
    <Image src={logoImg} alt="Logo" width={36} height={36} />
    <span className="hidden sm:inline text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-white to-blue-500">
      WordPower
    </span>
  </div>
);

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { data: session, status } = useSession();
  const { reviewCount, setReviewCount } = useReviewCount();
  const isAuthenticated = status === "authenticated";
  const pathname = usePathname();

  //TDO: delete later
  console.log(`session: ${session}`);

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
          ? "bg-slate-800/95 backdrop-blur-sm shadow-lg"
          : "bg-slate-800/50"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-12 sm:h-16">
          <div className="w-1/4">
            <Link href="/">
              <Logo />
            </Link>
          </div>
          <div className="flex-1 flex justify-center">
            {isAuthenticated && (
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
            )}
          </div>
          <div className="w-1/4 flex justify-end">
            <AuthButton />
          </div>
        </div>
      </div>
    </header>
  );
};
