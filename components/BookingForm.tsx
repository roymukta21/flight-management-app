"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useFlightStore } from "@/store/useFlightStore";

type BookingFormProps = {
  selectedSeat: string;
  flightId: string;
  seatId: string;
};

const BookingForm = ({ selectedSeat, flightId, seatId }: BookingFormProps) => {
  const router = useRouter();
  const { passengerForm, setPassengerForm, resetBooking } = useFlightStore();
  const [loading, setLoading] = useState(false);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: seatData, error: seatError } = await supabase
      .from("seats")
      .select("is_available")
      .eq("id", seatId)
      .single();

    if (seatError || !seatData?.is_available) {
      alert("This seat is no longer available! Please select another seat.");
      setLoading(false);
      return;
    }

    await supabase
      .from("seats")
      .update({ is_available: false })
      .eq("id", seatId);

    const pnrCode = "PNR" + Math.floor(100000 + Math.random() * 900000);

    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .insert([{
        flight_id: flightId,
        seat_id: seatId,
        seat_number: selectedSeat,
        status: "confirmed",
        total_price: 0,
        pnr_code: pnrCode,
      }])
      .select()
      .single();

    if (bookingError) {
      alert(bookingError.message);
      setLoading(false);
      return;
    }

    const { error: passengerError } = await supabase
      .from("passengers")
      .insert([{
        booking_id: booking.id,
        full_name: passengerForm.fullName,
        passport_no: passengerForm.passportNo,
        nationality: passengerForm.nationality,
      }]);

    if (passengerError) {
      alert("Passenger save failed: " + passengerError.message);
      setLoading(false);
      return;
    }

    resetBooking();
    router.push(`/bookings/${booking.id}`);
  };

  return (
    <div className="mt-6 bg-[#131001] border border-zinc-800 rounded-2xl p-5">
      <p className="text-[#a1a1aa] text-sm">Selected Seat</p>
      <h2 className="text-2xl font-bold text-[#d8b010] mb-5">{selectedSeat}</h2>
      <h3 className="text-xl font-bold mb-4">Passenger Information</h3>

      <form onSubmit={handleBooking} className="space-y-4">
        <input
          type="text"
          placeholder="Full Name"
          value={passengerForm.fullName}
          onChange={(e) => setPassengerForm({ ...passengerForm, fullName: e.target.value })}
          className="w-full bg-[#18181b] border border-zinc-700 rounded-xl px-4 py-3 outline-none text-white placeholder:text-zinc-500"
          required
        />
        <input
          type="text"
          placeholder="Passport Number"
          value={passengerForm.passportNo}
          onChange={(e) => setPassengerForm({ ...passengerForm, passportNo: e.target.value })}
          className="w-full bg-[#18181b] border border-zinc-700 rounded-xl px-4 py-3 outline-none text-white placeholder:text-zinc-500"
          required
        />
        <input
          type="text"
          placeholder="Nationality"
          value={passengerForm.nationality}
          onChange={(e) => setPassengerForm({ ...passengerForm, nationality: e.target.value })}
          className="w-full bg-[#18181b] border border-zinc-700 rounded-xl px-4 py-3 outline-none text-white placeholder:text-zinc-500"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#d8b010] text-black py-3 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "Booking..." : "Confirm Booking"}
        </button>
      </form>
    </div>
  );
};

export default BookingForm;