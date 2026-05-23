"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import { Session } from "@supabase/supabase-js";

export default function Navbar() {
  const router = useRouter();
  const { reset } = useUserStore();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    reset();
    router.push("/");
    router.refresh();
  };

  return (
    <nav className="border-b border-zinc-800 bg-[#09090b] px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-[#d8b010] font-bold text-xl">
          Flight App ✈️
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/" className="text-[#a1a1aa] hover:text-white transition text-sm">
            Flights
          </Link>
          <Link href="/bookings" className="text-[#a1a1aa] hover:text-white transition text-sm">
            Bookings
          </Link>

          {session ? (
            <div className="flex items-center gap-4">
              <span className="text-xs text-zinc-500 hidden md:block">
                {session.user.email}
              </span>
              <button
                onClick={handleLogout}
                className="bg-zinc-800 border border-zinc-700 text-white px-4 py-2 rounded-xl text-sm hover:bg-zinc-700 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="bg-[#d8b010] text-black px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}