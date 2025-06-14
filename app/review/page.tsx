import { getServerSession } from "next-auth";
import { ReviewPageClient } from "./ReviewPageClient";
import { getWordsToReview } from "../actions/words";
import { getUser } from "../actions/user";

export default async function ReviewPage() {
  const session = await getServerSession();
  const isAuthenticated = !!session?.user;

  if (!isAuthenticated) {
    return <ReviewPageClient words={[]} isAuthenticated={isAuthenticated} />;
  }

  const user = await getUser(session.user?.email || "");

  if (!user) {
    return <ReviewPageClient words={[]} isAuthenticated={isAuthenticated} />;
  }

  const wordsToReview = await getWordsToReview(user.id);

  const formattedWords = wordsToReview.map((progress) => ({
    ...progress,
    deck: {
      id: progress.word.decks[0].deck.id,
      name: progress.word.decks[0].deck.name,
    },
  }));

  return (
    <ReviewPageClient
      words={formattedWords}
      isAuthenticated={isAuthenticated}
    />
  );
}
