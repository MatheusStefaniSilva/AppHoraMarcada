import { addMinutes, isBefore, isEqual, areIntervalsOverlapping } from "date-fns";

interface Interval {
  start: Date;
  end: Date;
}

interface GetAvailableSlotsParams {
  workingHours: Interval;      // ex: 09:00 às 18:00 do dia escolhido
  serviceDurationMinutes: number; // ex: 45
  busyIntervals: Interval[];   // bloqueios + agendamentos (pendente/confirmado/reagendamento_proposto)
  slotStepMinutes?: number;    // granularidade dos horários exibidos, ex: 15 ou 30
}

export function getAvailableSlots({
  workingHours,
  serviceDurationMinutes,
  busyIntervals,
  slotStepMinutes = 15,
}: GetAvailableSlotsParams): Interval[] {
  const slots: Interval[] = [];
  let cursor = workingHours.start;

  while (isBefore(cursor, workingHours.end)) {
    const slotEnd = addMinutes(cursor, serviceDurationMinutes);

    // O slot só é válido se o atendimento terminar dentro do expediente
    const fitsInWorkingHours =
      isBefore(slotEnd, workingHours.end) || isEqual(slotEnd, workingHours.end);

    // E se não colidir com nenhum bloqueio/agendamento existente
    const hasConflict = busyIntervals.some((busy) =>
      areIntervalsOverlapping(
        { start: cursor, end: slotEnd },
        { start: busy.start, end: busy.end },
        { inclusive: false } // toque nas bordas (ex: termina 15h, outro começa 15h) não conta como conflito
      )
    );

    if (fitsInWorkingHours && !hasConflict) {
      slots.push({ start: cursor, end: slotEnd });
    }

    cursor = addMinutes(cursor, slotStepMinutes);
  }

  return slots;
}