"use client";

import React from "react";

interface UserProgress {
  id: string;
  strength: number;
  lastReviewed: Date;
  wordId: string;
}

interface ActivityHeatmapProps {
  userProgress: UserProgress[];
}

interface DayData {
  date: string;
  count: number;
  dayOfWeek: number;
  isToday: boolean;
}

interface MonthLabel {
  name: string;
  position: number;
}

export const ActivityHeatmap = ({ userProgress }: ActivityHeatmapProps) => {
  const processActivityData = () => {
    const activityMap = new Map<string, number>();

    const yearAgo = new Date();
    yearAgo.setFullYear(yearAgo.getFullYear() - 1);
    yearAgo.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const dateList = [];
    const tempDate = new Date(yearAgo);

    while (tempDate <= today) {
      const dateStr = formatDateToString(tempDate);
      dateList.push(dateStr);
      activityMap.set(dateStr, 0);

      tempDate.setDate(tempDate.getDate() + 1);
    }

    userProgress.forEach((progress) => {
      if (progress.lastReviewed) {
        const dateStr = formatDateToString(new Date(progress.lastReviewed));
        if (activityMap.has(dateStr)) {
          activityMap.set(dateStr, (activityMap.get(dateStr) || 0) + 1);
        }
      }
    });

    return Array.from(activityMap);
  };

  const formatDateToString = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  };

  const formatDateForDisplay = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0].split("-").reverse().join("/");
  };

  const getColorByCount = (count: number) => {
    if (count === 0) return "rgb(51, 65, 85)"; // slate-700
    if (count <= 2) return "rgb(21, 128, 61, 0.3)"; // green-700
    if (count <= 5) return "rgb(21, 128, 61, 0.5)";
    if (count <= 10) return "rgb(21, 128, 61, 0.7)";
    return "rgb(21, 128, 61)";
  };

  const todayDate = new Date();
  const todayStr = formatDateToString(todayDate);

  const activityData = processActivityData();

  const calendarData: DayData[][] = [];
  let currentWeek: DayData[] = [];

  activityData.forEach(([dateStr, count], index) => {
    const date = new Date(dateStr);
    const dayOfWeek = date.getDay();
    const isToday = dateStr === todayStr;

    if (dayOfWeek === 0 && index !== 0) {
      calendarData.push([...currentWeek]);
      currentWeek = [];
    }

    currentWeek.push({ date: dateStr, count, dayOfWeek, isToday });

    if (index === activityData.length - 1) {
      calendarData.push([...currentWeek]);
    }
  });

  const months: MonthLabel[] = [];
  let currentMonth = "";

  calendarData.forEach((week, weekIndex) => {
    if (week.length > 0) {
      const date = new Date(week[0].date);
      const month = date.toLocaleString("en-US", { month: "short" });

      if (month !== currentMonth) {
        months.push({ name: month, position: weekIndex });
        currentMonth = month;
      }
    }
  });

  const maxActivity = Math.max(...activityData.map(([, count]) => count), 1);
  const legendSteps = [
    0,
    Math.ceil(maxActivity / 4),
    Math.ceil(maxActivity / 2),
    maxActivity,
  ];

  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollContainerRef.current) {
      let todayWeekIndex = -1;

      for (let i = 0; i < calendarData.length; i++) {
        if (calendarData[i].some((day) => day.isToday)) {
          todayWeekIndex = i;
          break;
        }
      }

      if (todayWeekIndex !== -1) {
        const scrollPosition = Math.max(0, (todayWeekIndex - 2) * 16);
        scrollContainerRef.current.scrollLeft = scrollPosition;
      }
    }
  }, [calendarData]);

  return (
    <div className="bg-slate-800 rounded-lg p-6 overflow-hidden">
      <h3 className="text-xl font-bold text-gray-100 mb-4">Activity</h3>

      <div
        ref={scrollContainerRef}
        className="overflow-x-auto pr-6 md:pr-10 pb-2"
      >
        <div className="relative flex ml-3 h-5 mb-1">
          {months.map((month, index) => (
            <div
              key={`${month.name}-${month.position}-${index}`}
              className="absolute text-xs text-slate-400"
              style={{
                left: `${month.position * 16}px`,
                top: index % 2 === 0 ? "0px" : "10px",
              }}
            >
              {month.name}
            </div>
          ))}
        </div>

        <div className="flex">
          <div className="flex gap-1 pr-4">
            {calendarData.map((week, weekIndex) => (
              <div key={`week-${weekIndex}`} className="flex flex-col gap-1">
                {Array.from({ length: 7 }).map((_, dayIndex) => {
                  const day = week.find(
                    (d: DayData) => d.dayOfWeek === dayIndex
                  );
                  return (
                    <div
                      key={`${weekIndex}-${dayIndex}`}
                      className={`w-3 h-3 rounded-sm transition-colors duration-200 ${
                        day?.isToday ? "ring-2 ring-green-500" : ""
                      }`}
                      style={{
                        backgroundColor: day
                          ? getColorByCount(day.count)
                          : "rgba(51, 65, 85, 0.3)",
                      }}
                      title={
                        day
                          ? `${formatDateForDisplay(day.date)}: ${
                              day.count
                            } reviews ${day.isToday ? "(Today)" : ""}`
                          : "No data"
                      }
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end mt-3 text-xs text-slate-400">
          <span className="mr-2">Less</span>
          {legendSteps.map((level, index) => (
            <div
              key={`legend-${level}-${index}`}
              className="w-3 h-3 rounded-sm mx-0.5"
              style={{ backgroundColor: getColorByCount(level) }}
              title={`${level} reviews`}
            />
          ))}
          <span className="ml-2">More</span>
        </div>
      </div>
    </div>
  );
};
