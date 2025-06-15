import { getDesks } from "./actions/desks";
import { DeskCard } from "./components/DeskCard";
import { getServerSession } from "next-auth";
import { Footer } from "./components/Footer";

export default async function DesksPage() {
  const session = await getServerSession();
  const desks = await getDesks();

  return (
    <>
      <div className="min-h-screen pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {desks.map((desk) => (
              <DeskCard
                key={desk.id}
                desk={{
                  ...desk,
                  description: desk.description || undefined,
                  wordsCount: desk._count.words,
                }}
                isAuthenticated={!!session?.user}
              />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
