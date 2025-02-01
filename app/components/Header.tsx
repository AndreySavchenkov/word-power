"use client";

import AuthButton from "./AuthButton";
export const Header = () => {
  return (
    <header className="flex items-center justify-between bg-slate-500">
      <span>Word Power</span>
      <AuthButton />
    </header>
  );
};
