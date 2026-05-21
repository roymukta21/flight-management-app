"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabase";

type BookingFormProps = {
  selectedSeat: string;
  flightId: string;
};

const BookingForm = ({ selectedSeat, flightId }: BookingFormProps) => {
  const [fullName, setFullName] = useState("");
  const [passportNo, setPassportNo] = useState("");
  const [nationality, setNationality] = useState("");

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    const pnrCode = "PNR" + Math.floor(100000 + Math.random() * 900000);

    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .insert([
        {
          status: "confirmed",
          total_price: 0,
          pnr_code: pnrCode,
          seat_number: selectedSeat,
          flight_id: flightId,
        },
      ])
      .select()
      .single();

    if (bookingError) {
      alert(bookingError.message);
      return;
    }

    const { error: passengerError } = await supabase.from("passengers").insert([
      {
        booking_id: booking.id,
        full_name: fullName,
        passport_no: passportNo,
        nationality,
      },
    ]);

    if (passengerError) {
      alert("Passenger save failed");
      return;
    }

    alert(`Booking successful. Your PNR is ${pnrCode}`);
  };

  return (
    <div className="mt-6 bg-card border border-zinc-800 rounded-2xl p-5">
      <p className="text-muted text-sm">Selected Seat</p>

      <h2 className="text-2xl font-bold text-primary mb-5">{selectedSeat}</h2>

      <h3 className="text-xl font-bold mb-4">Passenger Information</h3>

      <form onSubmit={handleBooking} className="space-y-4">
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full bg-secondary border border-zinc-700 rounded-xl px-4 py-3 outline-none"
          required
        />

        <input
          type="text"
          placeholder="Passport Number"
          value={passportNo}
          onChange={(e) => setPassportNo(e.target.value)}
          className="w-full bg-secondary border border-zinc-700 rounded-xl px-4 py-3 outline-none"
          required
        />

        <input
          type="text"
          placeholder="Nationality"
          value={nationality}
          onChange={(e) => setNationality(e.target.value)}
          className="w-full bg-secondary border border-zinc-700 rounded-xl px-4 py-3 outline-none"
          required
        />

        <button className="w-full bg-primary text-black py-3 rounded-xl font-semibold">
          Confirm Booking
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
