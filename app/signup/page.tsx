"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const ALLOWED_DOMAIN = "@lccm.edu.ph";

export default function Signup() {
  const [name, setName] = useState("");
  const [studentNumber, setStudentNumber] = useState("");
  const [yearLevel, setYearLevel] = useState("First Year");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email.toLowerCase().endsWith(ALLOWED_DOMAIN)) {
      setError(`Email must be a school email ending in ${ALLOWED_DOMAIN}`);
      return;
    }

    const emailLocalPart = email.split("@")[0];
    if (emailLocalPart !== studentNumber.trim()) {
      setError("Your email must match your Student Number (e.g. 2023000533@lccm.edu.ph)");
      return;
    }

    setLoading(true);

    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    const userId = authData.user?.id;
    if (!userId) {
      setError("Signup failed: no user ID returned.");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: userId,
        name,
        studentNumber: studentNumber.trim(),
        yearLevel,
        email,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to save student profile.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen bg-black text-white font-mono flex flex-col">
  {/* Top System Bar */}
  <header className="h-11 border-b border-zinc-700 flex items-center justify-between px-6 text-sm">
    <div className="flex items-center gap-2">
      <span className="text-zinc-300">▣</span>
      <span>Event QR Attendance System</span>
    </div>

    <div className="text-zinc-400">
      EVENT QR ATTENDANCE
    </div>
  </header>

    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <form
        onSubmit={handleSignup}
        className="flex flex-col gap-4 w-full max-w-sm p-6 border rounded-lg bg-white dark:bg-zinc-900"
      >
        <h1 className="text-xl font-semibold">Student Sign Up</h1>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Student Number (e.g. 2023000533)"
          value={studentNumber}
          onChange={(e) => setStudentNumber(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <select
          value={yearLevel}
          onChange={(e) => setYearLevel(e.target.value)}
          className="border p-2 rounded"
        >
          <option>First Year</option>
          <option>Second Year</option>
          <option>Third Year</option>
          <option>Fourth Year</option>
        </select>
        <input
          type="email"
          placeholder="School Email (studentnumber@lccm.edu.ph)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded"
          required
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white p-2 rounded hover:bg-zinc-800 disabled:opacity-50"
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>
    </div>
    </div>
  );
}