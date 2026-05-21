"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabase";

type BookingFormProps = {
  selectedSeat: string;
};

const BookingForm = ({
  selectedSeat,
}: BookingFormProps) => {
  const [fullName, setFullName] = useState("");
  const [passportNo, setPassportNo] = useState("");
  const [nationality, setNationality] = useState("");

  const handleBooking = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const { error } = await supabase
      .from("passengers")
      .insert([
        {
          full_name: fullName,
          passport_no: passportNo,
          nationality: nationality,
        },
      ]);

    if (error) {
      alert("Booking failed");
      return;
    }

    alert("Booking successful");
  };

  return (
    <div className="mt-6 bg-card border border-zinc-800 rounded-2xl p-5">
      <p className="text-muted text-sm">
        Selected Seat
      </p>

      <h2 className="text-2xl font-bold text-primary mb-5">
        {selectedSeat}
      </h2>

      <h3 className="text-xl font-bold mb-4">
        Passenger Information
      </h3>

      <form
        onSubmit={handleBooking}
        className="space-y-4"
      >
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) =>
            setFullName(e.target.value)
          }
          className="w-full bg-secondary border border-zinc-700 rounded-xl px-4 py-3 outline-none"
        />

        <input
          type="text"
          placeholder="Passport Number"
          value={passportNo}
          onChange={(e) =>
            setPassportNo(e.target.value)
          }
          className="w-full bg-secondary border border-zinc-700 rounded-xl px-4 py-3 outline-none"
        />

        <input
          type="text"
          placeholder="Nationality"
          value={nationality}
          onChange={(e) =>
            setNationality(e.target.value)
          }
          className="w-full bg-secondary border border-zinc-700 rounded-xl px-4 py-3 outline-none"
        />

        <button className="w-full bg-primary text-black py-3 rounded-xl font-semibold">
          Confirm Booking
        </button>
      </form>
    </div>
  );
};

export default BookingForm;