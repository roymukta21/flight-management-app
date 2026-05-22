import { supabase } from "@/lib/supabase";

async function getFlights() {
  const { data } = await supabase
    .from("flights")
    .select("*");

  return data || [];
}

async function getBooking(id: string) {
  const { data } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", id)
    .single();

  return data;
}

const page = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  const flights = await getFlights();
  const booking = await getBooking(id);

  return (
    <main className="min-h-screen bg-background text-text p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">
          Reschedule Flight
        </h1>

        <div className="bg-card border border-zinc-800 rounded-2xl p-6">
          <p className="text-muted mb-2">
            Current Seat: {booking.seat_number}
          </p>

          <p className="text-muted mb-6">
            Current Flight ID: {booking.flight_id}
          </p>

          <form
            action={`/api/reschedule?id=${booking.id}`}
            method="POST"
            className="space-y-4"
          >
            <select
              name="flightId"
              className="w-full bg-secondary border border-zinc-700 rounded-xl px-4 py-3"
            >
              {flights.map((flight: any) => (
                <option key={flight.id} value={flight.id}>
                  {flight.flight_no} — {flight.origin} →{" "}
                  {flight.destination}
                </option>
              ))}
            </select>

            <button className="w-full bg-primary text-black py-3 rounded-xl font-semibold">
              Confirm Reschedule
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default page;