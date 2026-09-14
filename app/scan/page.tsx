"use client";

import { useState, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { supabase } from "@/lib/supabase";

export default function ScanPage() {
  const [result, setResult] = useState("");
  const [started, setStarted] = useState(false);
  const [error, setError] = useState("");
  const [debugLog, setDebugLog] = useState<string[]>([]);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  function log(msg: string) {
    setDebugLog((prev) => [...prev, msg]);
  }

  function startScanner() {
    log("Button tapped.");
    setError("");
    setStarted(true);

    try {
      log("Creating Html5QrcodeScanner instance...");
      const scanner = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: 250 },
        false
      );
      scannerRef.current = scanner;
      log("Scanner instance created. Calling render()...");

      scanner.render(
        async (decodedText) => {
          log("QR decoded: " + decodedText.slice(0, 20) + "...");
          await handleScan(decodedText);
        },
        (scanError) => {
          // fires continuously while searching, log only occasionally to avoid spam
        }
      );
      log("render() called successfully.");
    } catch (err) {
      const msg = "Failed to start camera: " + (err as Error).message;
      log("ERROR: " + msg);
      setError(msg);
    }
  }

  async function handleScan(token: string) {
    log("Sending token to /api/checkin...");
    const { data, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      log("ERROR getting session: " + sessionError.message);
    }

    const accessToken = data.session?.access_token;

    if (!accessToken) {
      log("No access token found in session.");
      setResult("You must be logged in to check in.");
      return;
    }

    log("Access token found, sending request.");

    try {
      const res = await fetch("/api/checkin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ token }),
      });
      log(`Server responded with status ${res.status}`);
      const resData = await res.json();
      setResult(resData.message || resData.error);
    } catch (err) {
      log("ERROR contacting server: " + (err as Error).message);
      setResult("Error contacting server");
    }
  }

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <h1 className="text-xl font-semibold">Scan Event QR Code</h1>

      {!started && (
        <button
          onClick={startScanner}
          className="bg-black text-white px-6 py-3 rounded-lg text-lg"
        >
          Start Camera
        </button>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div id="reader" className="w-full max-w-sm" />

      {result && <p className="text-lg font-medium">{result}</p>}

      <div className="w-full max-w-md mt-6 border rounded-lg p-3 bg-zinc-50 dark:bg-zinc-900">
        <p className="text-xs font-semibold mb-2 text-zinc-500">Debug Log:</p>
        {debugLog.length === 0 && (
          <p className="text-xs text-zinc-400">Nothing logged yet.</p>
        )}
        {debugLog.map((entry, i) => (
          <p key={i} className="text-xs font-mono text-zinc-600 dark:text-zinc-400 break-all">
            {entry}
          </p>
        ))}
      </div>
    </div>
  );
}