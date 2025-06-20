import Link from "next/link";

export const CompletedState = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="text-gray-500 mb-4">
        <svg
          className="w-16 h-16 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-gray-700 mb-2">
        Review completed!
      </h2>
      <p className="text-gray-500 mb-6">
        You have reviewed all words. Come back later for the next review.
      </p>
      <Link
        href="/"
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Go to decks
      </Link>
    </div>
  );
};
