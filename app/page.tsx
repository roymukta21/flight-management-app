import { supabase } from '@/lib/supabase'
import { Flight } from '@/types/flight'

async function getFlights(): Promise<Flight[]> {
  const { data, error } = await supabase
    .from('flights')
    .select('*')

  if (error) {
    console.log(error)
    return []
  }

  return data
}

export default async function Home() {
  const flights = await getFlights()

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <h1 className="text-4xl font-bold mb-8">
        Available Flights ✈️
      </h1>

      <div className="grid gap-4">
        {flights.map((flight) => (
          <div
            key={flight.id}
            className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800"
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-semibold">
                  {flight.flight_no}
                </h2>

                <p className="text-zinc-400">
                  {flight.origin} → {flight.destination}
                </p>
              </div>

              <div className="text-right">
                <p className="text-yellow-400 text-2xl font-bold">
                  ${flight.base_price}
                </p>

                <p className="text-sm text-zinc-500">
                  {flight.aircraft_type}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}