import { supabase } from "@/lib/supabase";

async function getFlight(id: string) {
  const { data } = await supabase
    .from("flights")
    .select("*")
    .eq("id", id)
    .single();

  return data;
}

export default async function FlightDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const flight = await getFlight(id);

  const seats = [
    "1A",
    "1B",
    "1C",
    "1D",
    "2A",
    "2B",
    "2C",
    "2D",
    "3A",
    "3B",
    "3C",
    "3D",
  ];

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">
          {flight.origin} → {flight.destination}
        </h1>

        <p className="text-zinc-400 mb-8">{flight.flight_no}</p>

        <div className="bg-zinc-900 rounded-3xl p-6">
          <h2 className="text-2xl font-semibold mb-6">Select Your Seat</h2>

          <div className="grid grid-cols-4 gap-4 max-w-md">
            {seats.map((seat, index) => (
              <button
                key={seat}
                className={`
        py-4 rounded-xl font-semibold transition
        bg-zinc-800 hover:bg-primary hover:text-black
      `}
              >
                {seat}

                {(index + 1) % 2 === 0 && <span className="mx-2"></span>}
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
