"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("Attempting login...");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        setError("Supabase error: " + error.message);
        return;
      }

      if (!data.session) {
        setError("No session returned, but no error either. Unexpected state.");
        return;
      }

      setError("Login succeeded, redirecting...");
      router.push("/dashboard");
    } catch (err) {
      setError("Unexpected exception: " + (err as Error).message);
    }
  }

  return (
    <>
      <button
        onClick={() => alert("Button works!")}
        className="fixed top-2 right-2 bg-red-600 text-white px-3 py-1 text-xs z-50"
      >
        TEST TAP
      </button>

      <div className="min-h-screen bg-black text-white font-mono flex flex-col">
        <header className="h-11 border-b border-zinc-700 flex items-center justify-between px-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-zinc-300">▣</span>
            <span>Event QR Attendance System</span>
          </div>
          <div className="text-zinc-400">EVENT QR ATTENDANCE</div>
        </header>

        <main className="flex-1 flex items-center justify-center px-4">
          <form
            onSubmit={handleLogin}
            className="w-full max-w-md border border-zinc-500 bg-black p-8"
          >
            <div className="flex justify-center mb-5">
              <div className="w-12 h-10 border-2 border-zinc-300 flex items-center justify-center text-xl">
                &gt;_
              </div>
            </div>

            <div className="text-center mb-7">
              <h1 className="text-lg tracking-wide">Event QR Attendance System</h1>
              <p className="text-xs text-zinc-400 mt-2">Scan. Verify. Attend.</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm mb-2">Email:</label>
              <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 px-3 bg-black border border-zinc-500 text-white placeholder:text-zinc-600 outline-none focus:border-white"
                required
              />
            </div>

            <div className="mb-5">
              <label className="block text-sm mb-2">Password:</label>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-10 px-3 bg-black border border-zinc-500 text-white placeholder:text-zinc-600 outline-none focus:border-white"
                required
              />
            </div>

            {error && (
              <div className="border border-red-500 text-red-400 text-xs p-3 mb-5">
                [ ERROR ] {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full h-10 bg-zinc-200 text-black font-mono text-sm hover:bg-white transition-colors"
            >
              [ Login ]
            </button>

            <div className="text-center mt-6">
              <a
                href="/signup"
                className="text-xs text-zinc-400 hover:text-white hover:underline"
              >
                Don&apos;t have an account? Contact your administrator.
              </a>
            </div>
          </form>
        </main>
      </div>
    </>
  );
}