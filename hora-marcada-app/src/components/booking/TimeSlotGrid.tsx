import { TimeSlot } from "@/types/booking";

export function TimeSlotGrid({
  slots,
  selected,
  onSelect,
}: {
  slots: TimeSlot[];
  selected: TimeSlot | null;
  onSelect: (slot: TimeSlot) => void;
}) {
  if (slots.length === 0) {
    return (
      <p className="text-sm text-black/50 border border-dashed border-black/15 rounded-xl p-6 text-center">
        Não há horários disponíveis para essa data. Tente escolher outro dia.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
      {slots.map((slot) => {
        const isSelected = selected?.start.getTime() === slot.start.getTime();
        const label = slot.start.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
        return (
          <button
            key={slot.start.toISOString()}
            onClick={() => onSelect(slot)}
            className={`font-mono text-sm py-2 rounded-lg border-2 transition-colors
              ${isSelected ? "bg-[var(--accent)] border-[var(--accent)] text-white" : "border-black/10 hover:border-[var(--accent)]/50"}`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}