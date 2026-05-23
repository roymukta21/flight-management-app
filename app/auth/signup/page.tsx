"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/");
  };

  return (
    <main className="min-h-screen bg-[#09090b] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">Create Account ✈️</h1>
          <p className="text-[#a1a1aa]">Start booking your flights today</p>
        </div>

        <div className="bg-[#131001] border border-zinc-800 rounded-3xl p-8">
          {error && (
            <div className="bg-red-950 border border-red-800 text-red-400 px-4 py-3 rounded-xl mb-5 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="text-sm text-[#a1a1aa] mb-1 block">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#18181b] border border-zinc-700 rounded-xl px-4 py-3 outline-none text-white placeholder:text-zinc-500"
                required
              />
            </div>

            <div>
              <label className="text-sm text-[#a1a1aa] mb-1 block">Password</label>
              <input
                type="password"
                placeholder="min. 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#18181b] border border-zinc-700 rounded-xl px-4 py-3 outline-none text-white placeholder:text-zinc-500"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#d8b010] text-black py-3 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50 mt-2"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-[#a1a1aa] text-sm mt-6">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-[#d8b010] hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}