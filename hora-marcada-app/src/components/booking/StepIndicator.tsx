const STEPS = ["Serviço", "Data e hora", "Seus dados"] as const;

export function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {STEPS.map((label, i) => (
        <div key={label} className="flex items-center gap-2 flex-1">
          <div className="flex flex-col items-center gap-1 flex-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-sm border-2 transition-colors
                ${i <= current ? "bg-[var(--accent)] border-[var(--accent)] text-white" : "border-black/20 text-black/40"}`}
            >
              {i + 1}
            </div>
            <span className={`text-xs ${i <= current ? "text-black/80" : "text-black/40"}`}>{label}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`h-[2px] flex-1 -mt-5 ${i < current ? "bg-[var(--accent)]" : "bg-black/10"}`} />
          )}
        </div>
      ))}
    </div>
  );
}