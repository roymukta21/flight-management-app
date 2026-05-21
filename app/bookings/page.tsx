import { supabase } from "@/lib/supabase";

const getBookings = async () => {
  const { data, error } = await supabase
    .from("bookings")
    .select(`
      id,
      pnr_code,
      seat_number,
      status,
      booked_at,
      passengers (
        full_name,
        nationality
      ),
      flights (
        flight_no,
        origin,
        destination,
        departs_at
      )
    `)
    .order("booked_at", {
      ascending: false,
    });

  if (error) {
    console.log(error);
    return [];
  }

  return data;
};

const page = async () => {
  const bookings = await getBookings();

  return (
    <main className="min-h-screen bg-background text-text p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">
          Booking History
        </h1>

        {bookings.length === 0 ? (
          <p className="text-muted">
            No bookings found.
          </p>
        ) : (
          <div className="space-y-5">
            {bookings.map((booking: any) => (
              <div
                key={booking.id}
                className="bg-card border border-zinc-800 rounded-2xl p-5"
              >
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-sm text-muted">
                      PNR Code
                    </p>

                    <h2 className="text-2xl font-bold text-primary">
                      {booking.pnr_code}
                    </h2>
                  </div>

                  <span className="bg-secondary border border-zinc-700 px-4 py-2 rounded-full text-sm">
                    {booking.status}
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-4 text-muted">
                  <p>
                    Flight: {booking.flights?.flight_no}
                  </p>

                  <p>
                    Seat: {booking.seat_number}
                  </p>

                  <p>
                    Route: {booking.flights?.origin} →{" "}
                    {booking.flights?.destination}
                  </p>

                  <p>
                    Passenger:{" "}
                    {booking.passengers?.[0]?.full_name}
                  </p>

                  <p>
                    Nationality:{" "}
                    {booking.passengers?.[0]?.nationality}
                  </p>

                  <p>
                    Departure:{" "}
                    {booking.flights?.departs_at
                      ? new Date(
                          booking.flights.departs_at
                        ).toLocaleString()
                      : "N/A"}
                  </p>
                </div>

                <a
                  href={`/bookings/${booking.id}`}
                  className="block mt-5 bg-primary text-black text-center py-3 rounded-xl font-semibold"
                >
                  View Ticket
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default page;