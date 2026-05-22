"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

type Booking = {
  id: string;
  pnr_code: string;
  seat_number: string;
  status: string;
  booked_at: string;
  passengers: { full_name: string; nationality: string }[];
  flights: {
    flight_no: string;
    origin: string;
    destination: string;
    departs_at: string;
  }[];
};

const statusColors: Record<string, string> = {
  confirmed: "bg-green-900 text-green-400 border-green-700",
  cancelled: "bg-red-900 text-red-400 border-red-700",
  rescheduled: "bg-blue-900 text-blue-400 border-blue-700",
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const fetchBookings = async () => {
    const { data, error } = await supabase
      .from("bookings")
      .select(
        `
        id, pnr_code, seat_number, status, booked_at,
        passengers (full_name, nationality),
        flights (flight_no, origin, destination, departs_at)
      `,
      )
      .order("booked_at", { ascending: false });

    if (!error && data) {
      setBookings(data as unknown as Booking[]);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId: string, departsAt: string) => {
    const departureTime = new Date(departsAt).getTime();
    const diffHours = (departureTime - Date.now()) / (1000 * 60 * 60);

    if (diffHours < 2) {
      alert("Cannot cancel within 2 hours of departure!");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?",
    );

    if (!confirmed) return;

    setCancellingId(bookingId);

    const { error } = await supabase
      .from("bookings")
      .update({ status: "cancelled" })
      .eq("id", bookingId);

    if (error) {
      alert(error.message);
    } else {
      await fetchBookings();
    }

    setCancellingId(null);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background text-text p-6">
        <div className="max-w-5xl mx-auto text-muted text-center py-20">
          Loading bookings...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-text p-6">
      <div className="max-w-5xl mx-auto">
        <p className="text-primary mb-2">My Trips</p>
        <h1 className="text-4xl font-bold mb-8">Booking History</h1>

        {bookings.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted text-lg mb-4">No bookings found.</p>

            <Link
              href="/"
              className="bg-primary text-black px-6 py-3 rounded-xl font-semibold"
            >
              Search Flights
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-card border border-zinc-800 rounded-2xl p-5"
              >
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-sm text-muted">PNR Code</p>

                    <h2 className="text-2xl font-bold text-primary">
                      {booking.pnr_code}
                    </h2>
                  </div>

                  <span
                    className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${
                      statusColors[booking.status] ||
                      "bg-zinc-800 text-zinc-400 border-zinc-700"
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-3 text-sm text-muted mb-5">
                  <p>Flight: {booking.flights?.[0]?.flight_no}</p>
                  <p>Seat: {booking.seat_number}</p>
                  <p>
                    Route: {booking.flights?.[0]?.origin} →{" "}
                    {booking.flights?.[0]?.destination}
                  </p>
                  <p>Passenger: {booking.passengers?.[0]?.full_name}</p>
                  <p>Nationality: {booking.passengers?.[0]?.nationality}</p>
                  <p>
                    Departure:{" "}
                    {booking.flights?.[0]?.departs_at
                      ? new Date(
                          booking.flights?.[0]?.departs_at,
                        ).toLocaleString()
                      : "N/A"}
                  </p>
                </div>

                <div className="flex gap-3 flex-wrap">
                  <Link
                    href={`/bookings/${booking.id}`}
                    className="bg-primary text-black px-5 py-2.5 rounded-xl font-semibold text-sm"
                  >
                    View Ticket
                  </Link>

                  {booking.status === "confirmed" && (
                    <button
                      onClick={() =>
                        handleCancel(
                          booking.id,
                          booking.flights?.[0]?.departs_at,
                        )
                      }
                      disabled={cancellingId === booking.id}
                      className="bg-red-950 border border-red-800 text-red-400 px-5 py-2.5 rounded-xl font-semibold text-sm disabled:opacity-50"
                    >
                      {cancellingId === booking.id
                        ? "Cancelling..."
                        : "Cancel Booking"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
