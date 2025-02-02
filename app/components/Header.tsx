"use client";

import { useEffect, useState } from "react";
import AuthButton from "./AuthButton";
import Link from "next/link";

const Logo = () => (
  <div className="flex items-center gap-2">
    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-white to-blue-500">
      Word Power
    </span>
  </div>
);

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
        <div className="flex items-center justify-between h-16">
          <Link href="/">
            <Logo />
          </Link>{" "}
          <nav className=" items-center gap-6">
            <Link
              href="/decks"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Decks
            </Link>
          </nav>
          <AuthButton />
        </div>
      </div>
    </header>
  );
};
