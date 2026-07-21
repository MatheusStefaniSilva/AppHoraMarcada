import { Service, Provider } from "@/types/booking";

export const mockProvider: Provider = {
  nome: "Barbearia Vintage",
  slug: "barbearia-vintage",
  corDestaque: "#1F6F5C",
  corFundo: "#F7F3EC",
  horarioFuncionamento: { inicio: "09:00", fim: "18:00" },
};

export const mockServices: Service[] = [
  { id: "1", nome: "Corte de cabelo", descricao: "Tesoura ou máquina, acabamento na navalha", precoCentavos: 4500, duracaoMinutos: 45 },
  { id: "2", nome: "Barba", descricao: "Toalha quente, navalha e hidratação", precoCentavos: 3000, duracaoMinutos: 30 },
  { id: "3", nome: "Corte + Barba", descricao: "Combo completo", precoCentavos: 7000, duracaoMinutos: 75 },
];

// Simula agendamentos/bloqueios já existentes para o dia escolhido
export function getMockBusyIntervals(date: Date) {
  const d = new Date(date);
  const busy = [
    { hs: 10, ms: 0, he: 10, me: 45 },
    { hs: 14, ms: 0, he: 15, me: 0 },
    { hs: 16, ms: 30, he: 17, me: 0 },
  ];
  return busy.map(({ hs, ms, he, me }) => ({
    start: new Date(d.getFullYear(), d.getMonth(), d.getDate(), hs, ms),
    end: new Date(d.getFullYear(), d.getMonth(), d.getDate(), he, me),
  }));
}