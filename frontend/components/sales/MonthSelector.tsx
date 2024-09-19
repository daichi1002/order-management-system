import { addMonths, parse, subMonths } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface MonthSelectorProps {
  selectedMonth: string;
  onMonthChange: (newDate: Date) => void;
}

export const MonthSelector: React.FC<MonthSelectorProps> = ({
  selectedMonth,
  onMonthChange,
}) => (
  <div className="flex items-center space-x-2">
    <Button
      variant="outline"
      size="icon"
      onClick={() =>
        onMonthChange(subMonths(parse(selectedMonth, "yyyy-MM", new Date()), 1))
      }
    >
      <ChevronLeft className="h-4 w-4" />
    </Button>
    <Input
      type="month"
      value={selectedMonth}
      onChange={(e) =>
        onMonthChange(parse(e.target.value, "yyyy-MM", new Date()))
      }
      className="w-40"
    />
    <Button
      variant="outline"
      size="icon"
      onClick={() =>
        onMonthChange(addMonths(parse(selectedMonth, "yyyy-MM", new Date()), 1))
      }
    >
      <ChevronRight className="h-4 w-4" />
    </Button>
  </div>
);
