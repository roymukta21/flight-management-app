"use client";

import React, { useState } from "react";

const seats = [
  "1A", "1B", "1C", "1D",
  "2A", "2B", "2C", "2D",
  "3A", "3B", "3C", "3D",
  "4A", "4B", "4C", "4D",
  "5A", "5B", "5C", "5D",
];

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

      {selectedSeat && (
        <div className="mt-6 bg-card border border-zinc-800 rounded-2xl p-5">
          <p className="text-muted text-sm">
            Selected Seat
          </p>

          <h2 className="text-2xl font-bold text-primary mt-1">
            {selectedSeat}
          </h2>

          <button className="w-full mt-5 bg-primary text-black py-3 rounded-xl font-semibold hover:opacity-90 transition">
            Continue Booking
          </button>
        </div>
      )}
    </div>
  );
};

export default SeatSelector;