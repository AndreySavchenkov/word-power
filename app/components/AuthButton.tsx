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
            className="rounded-full"
            width={32}
            height={32}
          />
        )}
        <button
          onClick={() => signOut()}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          Sign Out
        </button>
      </div>
    );
  }
  return (
    <button
      onClick={() => signIn("google")}
      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
    >
      Sign in with Google
    </button>
  );
}
