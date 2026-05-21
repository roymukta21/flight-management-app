import SeatSelector from "@/components/SeatSelector";
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
    "4A",
    "4B",
    "4C",
    "4D",
    "5A",
    "5B",
    "5C",
    "5D",
  ];

  return (
    <main className="min-h-screen bg-background text-text p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <p className="text-primary mb-2">Flight Details</p>

          <h1 className="text-4xl font-bold">
            {flight.origin} → {flight.destination}
          </h1>

          <p className="text-muted mt-2">{flight.flight_no}</p>
        </div>

        <div className="bg-card border border-zinc-800 rounded-3xl p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-muted text-sm mb-1">Departure</p>

              <h3 className="text-xl font-semibold">
                {new Date(flight.departs_at).toLocaleString()}
              </h3>
            </div>

            <div>
              <p className="text-muted text-sm mb-1">Arrival</p>

              <h3 className="text-xl font-semibold">
                {new Date(flight.arrives_at).toLocaleString()}
              </h3>
            </div>

            <div>
              <p className="text-muted text-sm mb-1">Aircraft</p>

              <h3 className="text-xl font-semibold">{flight.aircraft_type}</h3>
            </div>

            <div>
              <p className="text-muted text-sm mb-1">Ticket Price</p>

              <h3 className="text-xl font-semibold text-primary">
                ${flight.base_price}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-card border border-zinc-800 rounded-3xl p-6">
          <h2 className="text-2xl font-bold mb-6">Select Your Seat</h2>
          <SeatSelector />
        </div>
      </div>
    </main>
  );
}
