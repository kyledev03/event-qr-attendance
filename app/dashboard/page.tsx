"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Student = {
  id: string;
  name: string;
  studentNumber: string;
  yearLevel: string;
  email: string;
};

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<Student | null>(null);
  const [isOrganizer, setIsOrganizer] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function checkSessionAndRole() {
      const { data } = await supabase.auth.getSession();
      const session = data.session;

      if (!session) {
        router.push("/login");
        return;
      }

      const res = await fetch(`/api/students/${session.user.id}`);

      if (res.ok) {
        const studentData = await res.json();
        setStudent(studentData);
      } else {
        setIsOrganizer(true);
      }

      setLoading(false);
    }
    checkSessionAndRole();
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  if (loading) {
    return <p className="p-6">Loading...</p>;
  }

  return (
<div className="min-h-screen bg-black text-white font-mono flex flex-col">


      {student && (
        <div className="min-h-screen bg-black text-white font-mono flex flex-col">
  {/* Top System Bar */}
  <header className="h-11 border-b border-zinc-700 flex items-center justify-between px-6 text-sm">
    <div className="flex items-center gap-2">
      <span className="text-zinc-300">▣</span>
      <span>Event QR Attendance System</span>
    </div>

      <button
          onClick={handleLogout}
          className="text-sm border px-3 py-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800">
          Log out
        </button>
  </header>
        <div className="flex flex-col gap-2">
          <p>Welcome, {student.name}!</p>
          <p className="text-zinc-500 text-sm">
            {student.studentNumber} • {student.yearLevel}
          </p>
          <button
            onClick={() => router.push("/scan")}
            className="mt-4 bg-black text-white px-6 py-3 rounded-lg text-lg w-fit"
          >
            Scan to Check In
          </button>
        </div>
        </div>
      )}

{isOrganizer && (
  <div className="min-h-screen bg-black text-white font-mono flex flex-col">
  {/* Top System Bar */}
  <header className="h-11 border-b border-zinc-700 flex items-center justify-between px-6 text-sm">
    <div className="flex items-center gap-2">
      <span className="text-zinc-300">▣</span>
      <span>Event QR Attendance System</span>
    </div>

    <div className="text-zinc-400">
        <button
          onClick={handleLogout}
          className="text-sm border px-3 py-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800">
          Log out
        </button>
    </div>
  </header>

{/* Title */}
      <div className="text-center mb-7">
        <h1 className="text-lg tracking-wide">
          Event QR Attendance System
        </h1>

        <p className="text-xs text-zinc-400 mt-2">
          Scan. Verify. Attend.
        </p>
      </div>
      
  <div className="flex flex-col gap-2">
    <h6>Welcome, Organizer!</h6>
    <button
      onClick={() => router.push("/events/new")}
      className="mt-4 bg-black text-white px-6 py-3 rounded-lg text-lg w-fit"
    >
      + Create New Event
    </button>
  </div>
  </div>
)}
</div>
  );
}
