export const getLevelWeight = (level: string | null): number => {
  const weights: { [key: string]: number } = {
    A1: 1,
    A2: 2,
    B1: 3,
    B2: 4,
    C1: 5,
    C2: 6,
  };
  return level ? weights[level] || 0 : 0;
};
