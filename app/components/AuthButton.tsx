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
    return (
      <div className="flex items-center">
        <div className="w-9 h-9 bg-slate-700 rounded-full animate-pulse"></div>
      </div>
    );
  }

  if (session?.user) {
    return (
      <div className="flex items-center">
        <Link
          href="/profile"
          className="flex items-center p-2 rounded-xl hover:bg-slate-700/50 transition-colors"
        >
          {session.user.image ? (
            <Image
              src={session.user.image}
              alt="user"
              className="rounded-full w-8 h-8 sm:w-9 sm:h-9 ring-2 ring-slate-600"
              width={36}
              height={36}
            />
          ) : (
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-base font-semibold shadow-lg">
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
      <div className="flex gap-3">
        <button
          onClick={() => {
            setAuthMode("signin");
            setShowAuthModal(true);
          }}
          className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <span className="hidden sm:inline">Sign In</span>
          <span className="sm:hidden">Sign In</span>
        </button>
        <button
          onClick={() => signIn("google")}
          className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span className="hidden sm:inline">Google</span>
          <span className="sm:hidden">Google</span>
        </button>
      </div>

      {showAuthModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-600 rounded-xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">
                {authMode === "signin" ? "Sign In" : "Sign Up"}
              </h2>
              <button
                onClick={() => setShowAuthModal(false)}
                className="text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-700"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
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
