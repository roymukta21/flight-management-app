import { supabase } from "@/lib/supabase";

async function getFlights(origin?: string, destination?: string) {
  let query = supabase.from("flights").select("*");

  if (origin) {
    query = query.ilike("origin", `%${origin}%`);
  }

  if (destination) {
    query = query.ilike("destination", `%${destination}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.log(error);
    return [];
  }

  return data;
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{
    origin?: string;
    destination?: string;
  }>;
}) {
  const params = await searchParams;

  const flights = await getFlights(params.origin, params.destination);

  return (
    <main className="min-h-screen bg-background text-text p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <p className="text-primary mb-2">Find your next flight</p>

          <h1 className="text-4xl font-bold">Flight Management ✈️</h1>
        </div>

        <form className="grid md:grid-cols-3 gap-4 mb-8">
          <input
            type="text"
            name="origin"
            placeholder="From"
            defaultValue={params.origin || ""}
            className="bg-card border border-zinc-800 rounded-xl px-4 py-3 outline-none"
          />

          <input
            type="text"
            name="destination"
            placeholder="To"
            defaultValue={params.destination || ""}
            className="bg-card border border-zinc-800 rounded-xl px-4 py-3 outline-none"
          />

          <button className="bg-primary text-black rounded-xl font-semibold hover:opacity-90 transition">
            Search
          </button>
        </form>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {flights.map((flight: any) => (
            <div
              key={flight.id}
              className="bg-card border border-zinc-800 rounded-2xl p-5 hover:-translate-y-1 hover:border-primary transition duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-muted">{flight.flight_no}</p>

                  <h2 className="text-2xl font-bold mt-1">
                    {flight.origin} → {flight.destination}
                  </h2>
                </div>

                <p className="text-primary text-xl font-bold">
                  ${flight.base_price}
                </p>
              </div>

              <div className="space-y-2 text-sm text-muted">
                <p>Aircraft: {flight.aircraft_type}</p>

                <p>Departure: {new Date(flight.departs_at).toLocaleString()}</p>

                <p>Arrival: {new Date(flight.arrives_at).toLocaleString()}</p>
              </div>

              <a
                href={`/flights/${flight.id}`}
                className="block w-full mt-5 text-center py-3 rounded-xl font-semibold bg-primary text-black hover:opacity-90 transition"
              >
                Book Flight
              </a>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
