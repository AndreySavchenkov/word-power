export default function Loading() {
  return (
    <div className={"my-auto max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"}>
      <div className="flex flex-col pt-24 gap-4 p-2">
        {/* Заголовок */}
        <div className="w-1/2 h-8 bg-slate-800 rounded animate-pulse"></div>

        {/* UserCard скелетон */}
        <div className="bg-slate-800 rounded-lg p-6 hover:bg-slate-700 animate-pulse">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-slate-700 animate-pulse"></div>
            <div className="w-32 h-8 rounded-lg bg-slate-700 animate-pulse"></div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <div className="w-24 h-6 bg-slate-700 rounded animate-pulse"></div>
              <div className="w-8 h-6 bg-slate-700 rounded animate-pulse"></div>
            </div>
            <div className="flex justify-between">
              <div className="w-32 h-6 bg-slate-700 rounded animate-pulse"></div>
              <div className="w-8 h-6 bg-slate-700 rounded animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* ActivityHeatmap скелетон */}
        <div className="bg-slate-800 rounded-lg p-6 animate-pulse">
          <div className="w-32 h-8 bg-slate-700 rounded mb-4 animate-pulse"></div>
          <div className="overflow-hidden">
            <div className="h-5 mb-1 w-full bg-slate-700 opacity-30 rounded animate-pulse"></div>
            <div className="h-24 w-full bg-slate-700 opacity-40 rounded animate-pulse"></div>
            <div className="h-5 mt-3 w-full bg-slate-700 opacity-30 rounded animate-pulse"></div>
          </div>
        </div>

        {/* LanguageSelector скелетон */}
        <div className="bg-slate-800 rounded-lg p-6 animate-pulse">
          <div className="w-40 h-8 bg-slate-700 rounded mb-4 animate-pulse"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-slate-700 h-14 rounded-lg animate-pulse"
              ></div>
            ))}
          </div>
        </div>

        {/* SignOutButton скелетон */}
        <div className="w-24 h-12 bg-red-700 rounded-lg animate-pulse"></div>
      </div>
    </div>
  );
}
