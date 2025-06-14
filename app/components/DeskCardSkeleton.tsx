export const DeskCardSkeleton = () => {
  return (
    <div className="bg-slate-800 rounded-lg shadow-lg p-4 sm:p-6">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div className="w-1/2 h-6 bg-slate-700 rounded animate-pulse"></div>
          <div className="w-16 h-6 bg-slate-700 rounded animate-pulse"></div>
        </div>

        <div className="flex justify-between items-center mt-2">
          <div className="flex gap-3">
            <div className="w-20 h-4 bg-slate-700 rounded animate-pulse"></div>
            <div className="w-20 h-4 bg-slate-700 rounded animate-pulse"></div>
          </div>
          <div className="w-24 h-8 bg-slate-700 rounded-lg animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};
