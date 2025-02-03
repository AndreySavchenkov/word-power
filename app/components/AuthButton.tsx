"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";

export default function AuthButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="flex items-center gap-2">
        {session?.user?.image && (
          <Image
            src={session?.user?.image}
            alt="user"
            className="rounded-full w-6 h-6 sm:w-8 sm:h-8"
            width={32}
            height={32}
          />
        )}
        <button
          onClick={() => signOut()}
          className="px-2 sm:px-4 py-1.5 sm:py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs sm:text-sm font-medium transition-colors"
        >
          <span className="hidden sm:inline">Sign Out</span>
          <span className="sm:hidden">Exit</span>
        </button>
      </div>
    );
  }
  return (
    <button
      onClick={() => signIn("google")}
      className="px-2 sm:px-4 py-1.5 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs sm:text-sm font-medium transition-colors"
    >
      <span className="hidden sm:inline">Sign in with Google</span>
      <span className="sm:hidden">Sign in</span>
    </button>
  );
}
