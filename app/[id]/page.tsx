import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { DeckPageClient } from "./components/DeckPageClient";
import { getDesk } from "../actions/desks";
import { getUser } from "../actions/user";
import { sortWords } from "../utils/sortWords";

export default async function DeckPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession();
  const id = (await params).id;
  const isAuthenticated = !!session?.user;

  let user = null;
  if (isAuthenticated) {
    user = await getUser(session.user?.email || "");
  }

  const deck = await getDesk(id, user);

  if (!deck) {
    redirect("/");
  }

  if (deck.words) {
    deck.words = sortWords(deck.words);
  }

  return <DeckPageClient deck={deck} isAuthenticated={isAuthenticated} />;
}
