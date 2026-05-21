import { supabase } from "@/lib/supabase";

const getBooking = async (id: string) => {
  const { data } = await supabase
    .from("bookings")
    .select(`
      id,
      pnr_code,
      seat_number,
      status,
      booked_at,
      passengers (
        full_name,
        passport_no,
        nationality
      ),
      flights (
        flight_no,
        origin,
        destination,
        departs_at,
        arrives_at,
        aircraft_type
      )
    `)
    .eq("id", id)
    .single();

  return data;
};

const page = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const booking: any = await getBooking(id);

  return (
    <main className="min-h-screen bg-background text-text p-6">
      <div className="max-w-4xl mx-auto">
        <p className="text-primary mb-2">Boarding Pass</p>
        <h1 className="text-4xl font-bold mb-8">Your Ticket</h1>

        <div className="bg-card border border-zinc-800 rounded-3xl overflow-hidden">
          <div className="bg-primary text-black p-6 flex justify-between">
            <div>
              <p className="text-sm font-semibold">PNR CODE</p>
              <h2 className="text-3xl font-bold">{booking.pnr_code}</h2>
            </div>

            <div className="text-right">
              <p className="text-sm font-semibold">STATUS</p>
              <h2 className="text-xl font-bold uppercase">{booking.status}</h2>
            </div>
          </div>

          <div className="p-6 grid md:grid-cols-3 gap-6">
            <div>
              <p className="text-muted text-sm">Passenger</p>
              <h3 className="text-xl font-semibold">
                {booking.passengers?.[0]?.full_name}
              </h3>
            </div>

            <div>
              <p className="text-muted text-sm">Flight</p>
              <h3 className="text-xl font-semibold">
                {booking.flights?.flight_no}
              </h3>
            </div>

            <div>
              <p className="text-muted text-sm">Seat</p>
              <h3 className="text-xl font-semibold text-primary">
                {booking.seat_number}
              </h3>
            </div>

            <div>
              <p className="text-muted text-sm">From</p>
              <h3 className="text-2xl font-bold">
                {booking.flights?.origin}
              </h3>
            </div>

            <div>
              <p className="text-muted text-sm">To</p>
              <h3 className="text-2xl font-bold">
                {booking.flights?.destination}
              </h3>
            </div>

            <div>
              <p className="text-muted text-sm">Aircraft</p>
              <h3 className="text-xl font-semibold">
                {booking.flights?.aircraft_type}
              </h3>
            </div>
          </div>

          <div className="border-t border-dashed border-zinc-700 p-6 grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-muted text-sm">Departure</p>
              <h3 className="text-lg font-semibold">
                {new Date(booking.flights?.departs_at).toLocaleString()}
              </h3>
            </div>

            <div>
              <p className="text-muted text-sm">Arrival</p>
              <h3 className="text-lg font-semibold">
                {new Date(booking.flights?.arrives_at).toLocaleString()}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default page;