"use client";

import React, { useEffect, useState } from "react";
import BookingForm from "./BookingForm";
import { supabase } from "@/lib/supabase";
import { useFlightStore } from "@/store/useFlightStore";

type Seat = {
  id: string;
  seat_number: string;
  class: "economy" | "business" | "first";
  is_available: boolean;
  extra_fee: number;
};

const classStyles = {
  first: {
    available: "bg-amber-950 border-amber-600 hover:bg-amber-600 hover:text-black text-amber-400",
    selected: "bg-amber-500 text-black border-amber-400",
    booked: "bg-zinc-800 text-zinc-600 border-zinc-700 cursor-not-allowed",
    label: "First Class",
    color: "bg-amber-500",
  },
  business: {
    available: "bg-blue-950 border-blue-600 hover:bg-blue-600 hover:text-black text-blue-400",
    selected: "bg-blue-500 text-black border-blue-400",
    booked: "bg-zinc-800 text-zinc-600 border-zinc-700 cursor-not-allowed",
    label: "Business",
    color: "bg-blue-500",
  },
  economy: {
    available: "bg-secondary border-zinc-700 hover:bg-[#d8b010] hover:text-black text-white",
    selected: "bg-[#d8b010] text-black border-[#d8b010]",
    booked: "bg-zinc-800 text-zinc-600 border-zinc-700 cursor-not-allowed",
    label: "Economy",
    color: "bg-[#d8b010]",
  },
};

const SeatSelector = ({ flightId }: { flightId: string }) => {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);

  const { selectedSeat, setSelectedSeat } = useFlightStore();

  useEffect(() => {
    const fetchSeats = async () => {
      const { data, error } = await supabase
        .from("seats")
        .select("*")
        .eq("flight_id", flightId)
        .order("seat_number");

      if (!error && data) setSeats(data);
      setLoading(false);
    };

    fetchSeats();

    // Realtime subscription — অন্য user seat নিলে live update
    const channel = supabase
      .channel(`seats-${flightId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "seats",
          filter: `flight_id=eq.${flightId}`,
        },
        (payload) => {
          setSeats((prev) =>
            prev.map((s) => (s.id === payload.new.id ? { ...s, ...payload.new } : s))
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [flightId]);

  const firstClass = seats.filter((s) => s.class === "first");
  const business = seats.filter((s) => s.class === "business");
  const economy = seats.filter((s) => s.class === "economy");

  const renderZone = (zoneSeats: Seat[], zone: "first" | "business" | "economy") => {
    const style = classStyles[zone];
    return (
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className={`w-3 h-3 rounded-full ${style.color}`} />
          <span className="text-sm font-semibold text-white">{style.label}</span>
          {zone !== "economy" && (
            <span className="text-xs text-zinc-500">
              +${zoneSeats[0]?.extra_fee ?? 0} extra
            </span>
          )}
        </div>
        <div className="grid grid-cols-4 gap-2">
          {zoneSeats.map((seat) => {
            const isSelected = selectedSeat?.id === seat.id;
            const isBooked = !seat.is_available;

            return (
              <button
                key={seat.id}
                disabled={isBooked}
                title={`${seat.seat_number} — ${style.label}${seat.extra_fee ? ` (+$${seat.extra_fee})` : ""}`}
                onClick={() => setSelectedSeat(isSelected ? null : seat)}
                className={`rounded-xl py-3 text-sm font-semibold border transition ${
                  isBooked
                    ? style.booked
                    : isSelected
                    ? style.selected
                    : style.available
                }`}
              >
                {seat.seat_number}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="text-center py-10 text-zinc-500 animate-pulse">
        Loading seat map...
      </div>
    );
  }

  if (seats.length === 0) {
    return (
      <div className="text-center py-10 text-zinc-500">
        No seats available for this flight.
      </div>
    );
  }

  return (
    <div>
      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-6 text-xs text-zinc-400">
        <span className="flex items-center gap-1">
          <span className="w-4 h-4 rounded bg-[#d8b010]" /> Selected
        </span>
        <span className="flex items-center gap-1">
          <span className="w-4 h-4 rounded bg-zinc-800 border border-zinc-700" /> Occupied
        </span>
        <span className="flex items-center gap-1">
          <span className="w-4 h-4 rounded bg-amber-950 border border-amber-600" /> First Class
        </span>
        <span className="flex items-center gap-1">
          <span className="w-4 h-4 rounded bg-blue-950 border border-blue-600" /> Business
        </span>
        <span className="flex items-center gap-1">
          <span className="w-4 h-4 rounded bg-secondary border border-zinc-700" /> Economy
        </span>
      </div>

      {/* Seat zones */}
      <div className="overflow-y-auto max-h-125 pr-1">
        {firstClass.length > 0 && renderZone(firstClass, "first")}
        {business.length > 0 && renderZone(business, "business")}
        {economy.length > 0 && renderZone(economy, "economy")}
      </div>

      {selectedSeat && (
        <BookingForm
          selectedSeat={selectedSeat.seat_number}
          flightId={flightId}
        />
      )}
    </div>
  );
};

export default SeatSelector;