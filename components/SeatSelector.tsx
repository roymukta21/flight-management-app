"use client";

import React, { useState } from "react";
import BookingForm from "./BookingForm";

const seats = [
  "1A", "1B", "1C", "1D",
  "2A", "2B", "2C", "2D",
  "3A", "3B", "3C", "3D",
  "4A", "4B", "4C", "4D",
  "5A", "5B", "5C", "5D",
];

const TypedBookingForm = BookingForm as React.ComponentType<{ selectedSeat: string }>;

const SeatSelector = () => {
  const [selectedSeat, setSelectedSeat] = useState("");

  return (
    <div>
      <div className="grid grid-cols-4 gap-4">
        {seats.map((seat) => (
          <button
            key={seat}
            onClick={() => setSelectedSeat(seat)}
            className={`rounded-xl py-4 font-semibold transition border ${
              selectedSeat === seat
                ? "bg-primary text-black border-primary"
                : "bg-secondary border-zinc-700 hover:bg-primary hover:text-black"
            }`}
          >
            {seat}
          </button>
        ))}
      </div>

      {selectedSeat && <TypedBookingForm selectedSeat={selectedSeat} />}
    </div>
  );
};

export default SeatSelector;