import { BookingWizard } from "@/components/booking/BookingWizard";
import { mockProvider, mockServices } from "@/lib/mock-data";

export default function Home() {
  return (
    <main
      style={{ ["--accent" as string]: mockProvider.corDestaque, backgroundColor: mockProvider.corFundo }}
      className="min-h-screen py-10 px-4"
    >
      <div className="max-w-md mx-auto">
        <h1 className="font-serif text-3xl mb-1">{mockProvider.nome}</h1>
        <p className="text-black/50 mb-8 text-sm">Escolha um serviço para começar</p>
        <BookingWizard provider={mockProvider} services={mockServices} />
      </div>
    </main>
  );
}