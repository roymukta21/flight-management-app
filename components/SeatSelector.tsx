"use client";

import React, { useEffect, useState } from "react";
import BookingForm from "./BookingForm";
import { supabase } from "@/lib/supabase";

const seats = [
  "1A", "1B", "1C", "1D",
  "2A", "2B", "2C", "2D",
  "3A", "3B", "3C", "3D",
  "4A", "4B", "4C", "4D",
  "5A", "5B", "5C", "5D",
];

const SeatSelector = ({ flightId }: { flightId: string }) => {
  const [selectedSeat, setSelectedSeat] = useState("");
  const [bookedSeats, setBookedSeats] = useState<string[]>([]);

  useEffect(() => {
    const getBookedSeats = async () => {
      const { data } = await supabase
        .from("bookings")
        .select("seat_number")
        .eq("flight_id", flightId)
        .eq("status", "confirmed");

      if (data) {
        setBookedSeats(data.map((item) => item.seat_number));
      }
    };

    getBookedSeats();
  }, [flightId]);

  return (
    <div>
      <div className="grid grid-cols-4 gap-4">
        {seats.map((seat) => {
          const isBooked = bookedSeats.includes(seat);
          const isSelected = selectedSeat === seat;

          return (
            <button
              key={seat}
              disabled={isBooked}
              onClick={() => setSelectedSeat(seat)}
              className={`rounded-xl py-4 font-semibold border transition ${
                isBooked
                  ? "bg-zinc-800 text-zinc-500 border-zinc-800 cursor-not-allowed"
                  : isSelected
                  ? "bg-primary text-black border-primary"
                  : "bg-secondary border-zinc-700 hover:bg-primary hover:text-black"
              }`}
            >
              {seat}
            </button>
          );
        })}
      </div>

      {selectedSeat && (
        <BookingForm
          selectedSeat={selectedSeat}
          flightId={flightId}
        />
      )}
    </div>
  );
};

export default SeatSelector;