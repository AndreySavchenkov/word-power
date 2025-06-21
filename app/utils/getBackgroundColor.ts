export const getBackgroundColor = (strength?: number): string => {
  if (!strength) return "bg-slate-800";

  if (strength === 1) return "bg-gradient-to-br from-red-900 to-slate-800";
  if (strength === 2) return "bg-gradient-to-br from-orange-900 to-slate-800";
  if (strength === 3) return "bg-gradient-to-br from-yellow-900 to-slate-800";
  if (strength === 4) return "bg-gradient-to-br from-green-900 to-slate-800";

  return "bg-slate-800";
};
