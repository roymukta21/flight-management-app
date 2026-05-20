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
    <main className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Flight Management ✈️</h1>

        <form className="grid md:grid-cols-3 gap-4 mb-8">
          <input
            type="text"
            name="origin"
            placeholder="From"
            defaultValue={params.origin || ""}
            className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3"
          />

          <input
            type="text"
            name="destination"
            placeholder="To"
            defaultValue={params.destination || ""}
            className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3"
          />

          <button className="bg-yellow-400 text-black rounded-xl font-semibold">
            Search
          </button>
        </form>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {flights.map((flight: any) => (
            <div
              key={flight.id}
              className="bg-card border border-zinc-800 rounded-2xl p-5 hover:-translate-y-1 transition duration-300"
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-sm text-zinc-400">{flight.flight_no}</p>

                  <h2 className="text-2xl font-bold">
                    {flight.origin} → {flight.destination}
                  </h2>
                </div>

                <p className="text-yellow-400 font-bold text-xl">
                  ${flight.base_price}
                </p>
              </div>

              <div className="space-y-2 text-sm text-zinc-400">
                <p>Aircraft: {flight.aircraft_type}</p>

                <p>Departure: {new Date(flight.departs_at).toLocaleString()}</p>

                <p>Arrival: {new Date(flight.arrives_at).toLocaleString()}</p>
              </div>

              <a
                href={`/flights/${flight.id}`}
                className="block w-full mt-5 text-center py-3 rounded-xl font-semibold transition"
                style={{
                  backgroundColor: "var(--primary-color)",
                  color: "#000",
                }}
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
