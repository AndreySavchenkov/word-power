export const WordCardSkeleton = () => {
  return (
    <div className="card-container w-full max-w-2xl">
      <div className="relative h-[450px]">
        <div className="absolute w-full h-full">
          <div className="w-full h-full bg-slate-800 rounded-lg shadow-xl p-4 sm:p-6">
            {/* Скелетон для передней стороны */}
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-3/4 h-12 bg-slate-700 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
