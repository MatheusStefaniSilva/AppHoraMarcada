"use client";

import { useMemo, useState } from "react";
import { Provider, Service, TimeSlot, ContactInfo } from "@/types/booking";
import { getAvailableSlots } from "@/lib/availability";
import { getMockBusyIntervals } from "@/lib/mock-data";
import { StepIndicator } from "./StepIndicator";
import { ServiceSelector } from "./ServiceSelector";
import { DateCarousel } from "./DateCarousel";
import { TimeSlotGrid } from "./TimeSlotGrid";
import { ContactForm } from "./ContactForm";

function parseHour(hhmm: string, base: Date) {
  const [h, m] = hhmm.split(":").map(Number);
  return new Date(base.getFullYear(), base.getMonth(), base.getDate(), h, m);
}

export function BookingWizard({ provider, services }: { provider: Provider; services: Service[] }) {
  const [step, setStep] = useState(0);
  const [service, setService] = useState<Service | null>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [slot, setSlot] = useState<TimeSlot | null>(null);
  const [confirmed, setConfirmed] = useState<ContactInfo | null>(null);

  const availableSlots = useMemo(() => {
    if (!service || !date) return [];
    const workingHours = {
      start: parseHour(provider.horarioFuncionamento.inicio, date),
      end: parseHour(provider.horarioFuncionamento.fim, date),
    };
    return getAvailableSlots({
      workingHours,
      serviceDurationMinutes: service.duracaoMinutos,
      busyIntervals: getMockBusyIntervals(date),
    });
  }, [service, date, provider]);

  if (confirmed) {
    return (
      <div className="text-center py-10">
        <h2 className="font-serif text-2xl mb-2">Solicitação enviada</h2>
        <p className="text-black/60">
          Enviamos um e-mail para <strong>{confirmed.email}</strong> assim que{" "}
          <strong>{provider.nome}</strong> confirmar seu horário de{" "}
          <strong>{slot?.start.toLocaleString("pt-BR", { dateStyle: "long", timeStyle: "short" })}</strong>.
        </p>
      </div>
    );
  }

  return (
    <div>
      <StepIndicator current={step} />

      {step === 0 && (
        <ServiceSelector
          services={services}
          onSelect={(s) => {
            setService(s);
            setStep(1);
          }}
        />
      )}

      {step === 1 && service && (
        <div className="grid gap-6">
          <DateCarousel selectedDate={date} onSelect={(d) => { setDate(d); setSlot(null); }} />
          {date && (
            <TimeSlotGrid slots={availableSlots} selected={slot} onSelect={setSlot} />
          )}
          <div className="flex justify-between">
            <button onClick={() => setStep(0)} className="text-sm text-black/50">← Trocar serviço</button>
            <button
              disabled={!slot}
              onClick={() => setStep(2)}
              className="bg-[var(--accent)] text-white rounded-lg px-4 py-2 disabled:opacity-30"
            >
              Continuar
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="grid gap-4">
          <ContactForm onSubmit={(info) => setConfirmed(info)} />
          <button onClick={() => setStep(1)} className="text-sm text-black/50 text-left">← Voltar</button>
        </div>
      )}
    </div>
  );
}