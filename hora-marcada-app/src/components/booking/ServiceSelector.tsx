import { Service } from "@/types/booking";

export function ServiceSelector({
  services,
  onSelect,
}: {
  services: Service[];
  onSelect: (service: Service) => void;
}) {
  return (
    <div className="grid gap-3">
      {services.map((s) => (
        <button
          key={s.id}
          onClick={() => onSelect(s)}
          className="text-left border border-black/10 rounded-xl p-4 hover:border-[var(--accent)] hover:bg-[var(--accent)]/5 transition-colors"
        >
          <div className="flex justify-between items-baseline">
            <h3 className="font-serif text-lg">{s.nome}</h3>
            <span className="font-mono text-sm">
              {(s.precoCentavos / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </span>
          </div>
          <p className="text-sm text-black/60 mt-1">{s.descricao}</p>
          <span className="text-xs font-mono text-black/40 mt-2 inline-block">{s.duracaoMinutos} min</span>
        </button>
      ))}
    </div>
  );
}