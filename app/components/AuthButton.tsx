"use client";

import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";

export default function AuthButton() {
  const { data: session, status } = useSession();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");

  if (status === "loading") {
    return null;
  }

  if (session?.user) {
    return (
      <div className="flex items-center">
        <Link href="/profile" className="flex items-center">
          {session.user.image ? (
            <Image
              src={session.user.image}
              alt="user"
              className="rounded-full w-6 h-6 sm:w-8 sm:h-8"
              width={32}
              height={32}
            />
          ) : (
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-medium">
              {session.user.name
                ? session.user.name.charAt(0).toUpperCase()
                : "U"}
            </div>
          )}
        </Link>
      </div>
    );
  }

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
  };

  return (
    <>
      <div className="flex gap-2 min-w-48 justify-end">
        <button
          onClick={() => {
            setAuthMode("signin");
            setShowAuthModal(true);
          }}
          className="px-2 sm:px-4 py-1.5 sm:py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-xs sm:text-sm font-medium transition-colors"
        >
          <span className="hidden sm:inline">Sign In</span>
          <span className="sm:hidden">Sign In</span>
        </button>
        <button
          onClick={() => signIn("google")}
          className="px-2 sm:px-4 py-1.5 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs sm:text-sm font-medium transition-colors"
        >
          <span className="hidden sm:inline">Sign In with Google</span>
          <span className="sm:hidden">Google</span>
        </button>
      </div>

      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-gray-600 rounded-lg p-6 w-full max-w-md mx-4 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-100">
                {authMode === "signin" ? "Sign In" : "Sign Up"}
              </h2>
              <button
                onClick={() => setShowAuthModal(false)}
                className="text-gray-400 hover:text-gray-200 transition-colors"
              >
                ✕
              </button>
            </div>

            {authMode === "signin" ? (
              <SignInForm
                onSuccess={handleAuthSuccess}
                onSwitchToSignUp={() => setAuthMode("signup")}
              />
            ) : (
              <SignUpForm
                onSuccess={handleAuthSuccess}
                onSwitchToSignIn={() => setAuthMode("signin")}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
