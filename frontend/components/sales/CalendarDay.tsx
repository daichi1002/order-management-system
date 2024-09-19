import { format, isToday } from "date-fns";
import React from "react";

interface CalendarDayProps {
  day: Date;
  sales: number;
  onDateClick: (dateString: string) => void;
  isSelected: boolean;
}

export const CalendarDay: React.FC<CalendarDayProps> = ({
  day,
  sales,
  onDateClick,
  isSelected,
}) => {
  const dateString = format(day, "yyyy-MM-dd");
  const dayOfMonth = format(day, "d");

  return (
    <div
      className={`p-4 border rounded-lg text-center cursor-pointer ${
        isToday(day)
          ? "bg-blue-100"
          : isSelected
          ? "bg-gray-200"
          : "hover:bg-gray-100"
      }`}
      onClick={() => onDateClick(dateString)}
    >
      <div>{dayOfMonth}</div>
      <div className="text-red-400">¥{sales.toLocaleString()}</div>
    </div>
  );
};
