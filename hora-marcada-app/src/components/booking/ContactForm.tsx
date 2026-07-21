"use client";

import { useState } from "react";
import { ContactInfo } from "@/types/booking";

export function ContactForm({ onSubmit }: { onSubmit: (info: ContactInfo) => void }) {
  const [form, setForm] = useState<ContactInfo>({ nome: "", email: "", telefone: "" });

  return (
    <form
      className="grid gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
    >
      <label className="grid gap-1 text-sm">
        Nome completo
        <input
          required
          value={form.nome}
          onChange={(e) => setForm({ ...form, nome: e.target.value })}
          className="border border-black/15 rounded-lg px-3 py-2 focus:outline-none focus:border-[var(--accent)]"
        />
      </label>
      <label className="grid gap-1 text-sm">
        E-mail
        <input
          required
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="border border-black/15 rounded-lg px-3 py-2 focus:outline-none focus:border-[var(--accent)]"
        />
      </label>
      <label className="grid gap-1 text-sm">
        Telefone (opcional)
        <input
          value={form.telefone}
          onChange={(e) => setForm({ ...form, telefone: e.target.value })}
          className="border border-black/15 rounded-lg px-3 py-2 focus:outline-none focus:border-[var(--accent)]"
        />
      </label>
      <button
        type="submit"
        className="bg-[var(--accent)] text-white rounded-lg py-3 font-medium mt-2 hover:opacity-90 transition-opacity"
      >
        Solicitar agendamento
      </button>
    </form>
  );
}