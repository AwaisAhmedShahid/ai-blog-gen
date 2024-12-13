import { Calendar } from "lucide-react";
import React from "react";

interface DateCompTypes {
  date?: string;
  showIcon?: boolean;
}
const DateComp = ({ date = "16 Aug, 2024", showIcon = true }: DateCompTypes) => {
  return (
    <div className="flex gap-1 font-semibold items-center">
      {showIcon && <Calendar size={14} />}
      <h4 className="text-sm font-semibold  font-secondary leading-3">{date}</h4>
    </div>
  );
};

export default DateComp;
