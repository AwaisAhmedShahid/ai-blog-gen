import * as React from "react";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui";

interface SelectMonthType {
  onChange: (e: string) => void;
}
export function SelectMonth({ onChange }: SelectMonthType) {
  const months = [
    { name: "January", value: "00" },
    { name: "February", value: "01" },
    { name: "March", value: "02" },
    { name: "April", value: "03" },
    { name: "May", value: "04" },
    { name: "June", value: "05" },
    { name: "July", value: "06" },
    { name: "August", value: "07" },
    { name: "September", value: "08" },
    { name: "October", value: "09" },
    { name: "November", value: "10" },
    { name: "December", value: "11" },
  ];

  const currentMonth = new Date().getMonth(); // Returns current month index (0 = January)

  return (
    <Select defaultValue={months[currentMonth].value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select month" />
      </SelectTrigger>
      <SelectContent>
        {months.map((month) => (
          <SelectItem key={month.value} value={month.value}>
            {month.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
