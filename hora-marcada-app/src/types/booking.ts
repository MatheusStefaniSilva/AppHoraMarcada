export interface Service {
  id: string;
  nome: string;
  descricao: string;
  precoCentavos: number;
  duracaoMinutos: number;
}

export interface TimeSlot {
  start: Date;
  end: Date;
}

export interface ContactInfo {
  nome: string;
  email: string;
  telefone: string;
}

export interface Provider {
  nome: string;
  slug: string;
  corDestaque: string;
  corFundo: string;
  horarioFuncionamento: { inicio: string; fim: string };
}