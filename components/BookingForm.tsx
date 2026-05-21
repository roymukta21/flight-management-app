"use client";

import React from "react";

type BookingFormProps = {
  selectedSeat: string;
};

const BookingForm = ({ selectedSeat }: BookingFormProps) => {
  return (
    <div className="mt-6 bg-card border border-zinc-800 rounded-2xl p-5">
      <p className="text-muted text-sm">Selected Seat</p>
      <h2 className="text-2xl font-bold text-primary mb-5">
        {selectedSeat}
      </h2>

      <h3 className="text-xl font-bold mb-4">
        Passenger Information
      </h3>

      <form className="space-y-4">
        <input
          type="text"
          placeholder="Full Name"
          className="w-full bg-secondary border border-zinc-700 rounded-xl px-4 py-3 outline-none"
        />

        <input
          type="text"
          placeholder="Passport Number"
          className="w-full bg-secondary border border-zinc-700 rounded-xl px-4 py-3 outline-none"
        />

        <input
          type="text"
          placeholder="Nationality"
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