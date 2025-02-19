"use client";

import { createContext, useContext, useState } from "react";

type ReviewCountContextType = {
  reviewCount: number;
  setReviewCount: (count: number) => void;
  decrementReviewCount: () => void;
};

const ReviewCountContext = createContext<ReviewCountContextType | undefined>(
  undefined
);

export function ReviewCountProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [reviewCount, setReviewCount] = useState(0);

  const decrementReviewCount = () => {
    setReviewCount((prev) => Math.max(0, prev - 1));
  };

  return (
    <ReviewCountContext.Provider
      value={{ reviewCount, setReviewCount, decrementReviewCount }}
    >
      {children}
    </ReviewCountContext.Provider>
  );
}

export function useReviewCount() {
  const context = useContext(ReviewCountContext);
  if (context === undefined) {
    throw new Error("useReviewCount must be used within a ReviewCountProvider");
  }
  return context;
}
