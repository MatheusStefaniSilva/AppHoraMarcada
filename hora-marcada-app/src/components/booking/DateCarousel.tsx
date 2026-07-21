"use client";

import { useMemo } from "react";

const DIAS_SEMANA = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

export function DateCarousel({
  selectedDate,
  onSelect,
  daysAhead = 14,
}: {
  selectedDate: Date | null;
  onSelect: (date: Date) => void;
  daysAhead?: number;
}) {
  const days = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Array.from({ length: daysAhead }, (_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      return d;
    });
  }, [daysAhead]);

  return (
    <div className="flex gap-2 overflow-x-auto snap-x snap-mandatory pb-2 -mx-1 px-1">
      {days.map((day) => {
        const isSelected = selectedDate?.toDateString() === day.toDateString();
        return (
          <button
            key={day.toISOString()}
            onClick={() => onSelect(day)}
            className={`snap-center shrink-0 w-16 flex flex-col items-center rounded-xl py-3 border-2 transition-colors
              ${isSelected ? "bg-[var(--accent)] border-[var(--accent)] text-white" : "border-black/10 text-black/70 hover:border-[var(--accent)]/50"}`}
          >
            <span className="text-xs uppercase font-mono">{DIAS_SEMANA[day.getDay()]}</span>
            <span className="font-serif text-2xl leading-tight">{day.getDate()}</span>
            <span className="text-[10px] uppercase font-mono">{MESES[day.getMonth()]}</span>
          </button>
        );
      })}
    </div>
  );
}