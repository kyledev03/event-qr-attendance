"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Papa, { type ParseResult } from "papaparse";
import { QRCodeSVG } from "qrcode.react";

type Event = {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string | null;
  description: string | null;
  status: string;
  currentCheckinToken: string | null;
  roster: { id: string }[];
};

type CsvRow = {
  StudentNumber: string;
  Name: string;
  YearLevel: string;
};

export default function EventPage() {
  const params = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const refreshInterval = useRef<NodeJS.Timeout | null>(null);

  async function fetchEvent() {
    const res = await fetch(`/api/events/${params.id}`);
    if (res.ok) {
      const data = await res.json();
      setEvent(data);
    }
    setLoading(false);
  }

useEffect(() => {
  // eslint-disable-next-line react-hooks/set-state-in-effect
  fetchEvent();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [params.id]);

  useEffect(() => {
    if (event?.status === "active") {
      refreshInterval.current = setInterval(async () => {
        const res = await fetch(`/api/events/refresh-token/${params.id}`, {
          method: "POST",
        });
        if (res.ok) {
          const data = await res.json();
          setEvent((prev) => (prev ? { ...prev, ...data } : prev));
        }
      }, 4000);
    }

    return () => {
      if (refreshInterval.current) clearInterval(refreshInterval.current);
    };
  }, [event?.status, params.id]);

  async function handleStart() {
    const res = await fetch(`/api/events/start/${params.id}`, { method: "POST" });
    if (res.ok) {
      const data = await res.json();
      setEvent((prev) => (prev ? { ...prev, ...data } : prev));
    }
  }

  async function handleEnd() {
    if (refreshInterval.current) clearInterval(refreshInterval.current);
    const res = await fetch(`/api/events/end/${params.id}`, { method: "POST" });
    if (res.ok) {
      const data = await res.json();
      setEvent((prev) => (prev ? { ...prev, ...data } : prev));
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadMessage("");

    Papa.parse<CsvRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results: ParseResult<CsvRow>) => {
        const rows = results.data.map((row: CsvRow) => ({
          studentNumber: row.StudentNumber?.trim(),
          name: row.Name?.trim(),
          yearLevel: row.YearLevel?.trim(),
        }));

        const res = await fetch(`/api/events/roster/${params.id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rows }),
        });

        const data = await res.json();

        if (res.ok) {
          setUploadMessage(`Uploaded ${data.count} student(s) to the roster.`);
          fetchEvent();
        } else {
          setUploadMessage(data.error || "Upload failed.");
        }

        setUploading(false);
      },
      error: () => {
        setUploadMessage("Failed to parse CSV file.");
        setUploading(false);
      },
    });

    e.target.value = "";
  }

  if (loading) return <p className="p-6">Loading...</p>;
  if (!event) return <p className="p-6">Event not found.</p>;

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-semibold">{event.name}</h1>
      <p className="text-zinc-500 mt-1">
        {new Date(event.date).toLocaleDateString()} at {event.time}
      </p>
      {event.location && <p className="text-zinc-500">{event.location}</p>}
      {event.description && <p className="mt-4">{event.description}</p>}

      <div className="mt-6 flex items-center gap-2">
        <span className="text-sm font-medium">Status:</span>
        <span className="text-sm px-2 py-1 rounded bg-zinc-200 dark:bg-zinc-800">
          {event.status}
        </span>
      </div>

      <div className="mt-4">
        <span className="text-sm font-medium">Roster:</span>{" "}
        <span className="text-sm text-zinc-500">
          {event.roster.length} student(s) uploaded
        </span>
      </div>

      {event.status === "not_started" && (
        <div className="mt-6 border-t pt-6">
          <label className="text-sm font-medium block mb-2">
            Upload Roster CSV
          </label>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            disabled={uploading}
            className="text-sm"
          />
          {uploading && <p className="text-sm text-zinc-500 mt-2">Uploading...</p>}
          {uploadMessage && <p className="text-sm mt-2">{uploadMessage}</p>}

          <button
            onClick={handleStart}
            className="mt-6 bg-black text-white px-6 py-3 rounded-lg text-lg block"
          >
            Start Event
          </button>
        </div>
      )}

      {event.status === "active" && (
        <div className="mt-6 border-t pt-6 flex flex-col items-center gap-4">
          <p className="text-sm text-zinc-500">Students: scan this QR to check in</p>
          {event.currentCheckinToken && (
            <QRCodeSVG value={event.currentCheckinToken} size={240} />
          )}
          <button
            onClick={handleEnd}
            className="mt-4 border px-6 py-3 rounded-lg text-lg"
          >
            End Event
          </button>
        </div>
      )}

      {event.status === "ended" && (
        <div className="mt-6 border-t pt-6">
          <p className="text-zinc-500">This event has ended. No further check-ins are accepted.</p>
        </div>
      )}
    </div>
  );
}