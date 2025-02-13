import { DecksPageSkeleton } from "@/app/components/DecksPageSkeleton";

export default function Loading() {
  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <DecksPageSkeleton />
      </div>
    </div>
  );
}
