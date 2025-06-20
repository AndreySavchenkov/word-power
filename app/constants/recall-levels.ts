export interface RecallLevel {
  id: number;
  label: string;
  shortLabel: string;
  color: string;
  bgColor: string;
  hoverBgColor: string;
  activeBgColor: string;
  ariaLabel: string;
}

export const RECALL_LEVELS: RecallLevel[] = [
  {
    id: 1,
    label: "Don't know",
    shortLabel: "No",
    color: "text-red-100",
    bgColor: "bg-red-700",
    hoverBgColor: "hover:bg-red-600",
    activeBgColor: "active:bg-red-800",
    ariaLabel: "Mark as don't know",
  },
  {
    id: 2,
    label: "Hard",
    shortLabel: "Hard",
    color: "text-orange-100",
    bgColor: "bg-orange-700",
    hoverBgColor: "hover:bg-orange-600",
    activeBgColor: "active:bg-orange-800",
    ariaLabel: "Mark as hard",
  },
  {
    id: 3,
    label: "Good",
    shortLabel: "Good",
    color: "text-yellow-100",
    bgColor: "bg-yellow-700",
    hoverBgColor: "hover:bg-yellow-600",
    activeBgColor: "active:bg-yellow-800",
    ariaLabel: "Mark as good",
  },
  {
    id: 4,
    label: "Easy",
    shortLabel: "Easy",
    color: "text-green-100",
    bgColor: "bg-green-700",
    hoverBgColor: "hover:bg-green-600",
    activeBgColor: "active:bg-green-800",
    ariaLabel: "Mark as easy",
  },
];
