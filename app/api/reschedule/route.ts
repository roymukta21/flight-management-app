import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const url = new URL(req.url);

  const bookingId = url.searchParams.get("id");

  const formData = await req.formData();

  const flightId = formData.get("flightId");

  const { error } = await supabase
    .from("bookings")
    .update({
      flight_id: flightId,
      status: "rescheduled",
    })
    .eq("id", bookingId);

  if (error) {
    return NextResponse.json({
      success: false,
    });
  }

  return NextResponse.redirect(
    new URL("/bookings", req.url),
  );
}