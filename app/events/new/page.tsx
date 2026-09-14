"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function NewEvent() {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          date,
          time,
          location,
          description,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to create event.");
        setLoading(false);
        return;
      }

      const event = await res.json();
      router.push(`/events/${event.id}`);
    } catch {
      setError("Unable to connect to the server.");
      setLoading(false);
    }
  }
    async function handleLogout() {
      await supabase.auth.signOut();
      router.push("/login");
    }

  return (
    <>
      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .page {
          min-height: 100vh;
          background: #050505;
          color: #f5f5f5;
          font-family: var(--font-space-mono), monospace;
          display: flex;
          flex-direction: column;
        }

        /* ================= TOP BAR ================= */

        .systemBar {
          height: 52px;
          border-bottom: 1px solid #292929;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 32px;
          font-size: 11px;
          letter-spacing: 0.08em;
        }

        .systemName {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .terminal {
          border: 1px solid #555;
          padding: 4px 7px;
          color: #7ffcff;
        }

        .systemStatus {
          color: #777;
        }

        .statusDot {
          color: #7ffcff;
          margin-right: 7px;
        }

        /* ================= MAIN ================= */

        .main {
          flex: 1;
          width: min(1400px, 100%);
          margin: auto;
          padding: 70px;
          display: grid;
          grid-template-columns: 0.85fr 1.15fr;
          gap: 90px;
          align-items: center;
        }

        /* ================= LEFT SIDE ================= */

        .intro {
          max-width: 520px;
        }

        .label {
          color: #7ffcff;
          font-size: 10px;
          letter-spacing: 0.22em;
          margin-bottom: 24px;
        }

        .title {
          margin: 0;
          font-family: var(--font-cinzel), serif;
          font-size: clamp(60px, 7vw, 110px);
          line-height: 0.82;
          letter-spacing: -0.04em;
          font-weight: 900;

          background: linear-gradient(
            180deg,
            #ffffff 0%,
            #bdbdbd 25%,
            #ffffff 43%,
            #777777 58%,
            #f5f5f5 72%,
            #5d5d5d 100%
          );

          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .title span {
          font-size: 0.72em;
        }

        .line {
          display: flex;
          align-items: center;
          gap: 14px;
          margin: 32px 0 24px;
          color: #6d6d6d;
          font-size: 9px;
          letter-spacing: 0.18em;
        }

        .line span:first-child {
          width: 70px;
          height: 1px;
          background: #7ffcff;
        }

        .description {
          color: #777;
          font-size: 11px;
          line-height: 1.9;
          max-width: 440px;
        }

        .meta {
          display: flex;
          gap: 34px;
          margin-top: 42px;
          padding-top: 20px;
          border-top: 1px solid #222;
        }

        .metaItem {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .metaItem span {
          font-size: 8px;
          color: #555;
          letter-spacing: 0.15em;
        }

        .metaItem strong {
          font-size: 9px;
          font-weight: 400;
          color: #bbb;
        }

        /* ================= FORM PANEL ================= */

        .formPanel {
          position: relative;
          background: #080808;
          border: 1px solid #3b3b3b;
          padding: 42px;
          box-shadow:
            0 0 0 1px #111,
            0 20px 80px rgba(0, 0, 0, 0.7);
        }

        /* Angular corners */

        .corner {
          position: absolute;
          width: 18px;
          height: 18px;
          border-color: #7ffcff;
          pointer-events: none;
        }

        .topLeft {
          top: -1px;
          left: -1px;
          border-top: 2px solid;
          border-left: 2px solid;
        }

        .topRight {
          top: -1px;
          right: -1px;
          border-top: 2px solid;
          border-right: 2px solid;
        }

        .bottomLeft {
          bottom: -1px;
          left: -1px;
          border-bottom: 2px solid;
          border-left: 2px solid;
        }

        .bottomRight {
          bottom: -1px;
          right: -1px;
          border-bottom: 2px solid;
          border-right: 2px solid;
        }

        /* ================= FORM HEADER ================= */

        .formHeader {
          display: flex;
          align-items: center;
          gap: 18px;
        }

        .formIcon {
          width: 48px;
          height: 48px;
          border: 1px solid #555;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #7ffcff;
          font-size: 15px;
        }

        .formSmall {
          color: #666;
          font-size: 8px;
          letter-spacing: 0.2em;
          margin-bottom: 7px;
        }

        .formHeader h2 {
          margin: 0;
          font-size: 18px;
          font-weight: 400;
          letter-spacing: 0.04em;
        }

        .divider {
          width: 100%;
          height: 1px;
          background: #292929;
          margin: 30px 0;
        }

        /* ================= INPUTS ================= */

        .field {
          margin-bottom: 22px;
        }

        .field label {
          display: block;
          margin-bottom: 9px;
          color: #aaa;
          font-size: 9px;
          letter-spacing: 0.12em;
        }

        .required {
          color: #7ffcff;
        }

        .optional {
          color: #555;
          font-size: 8px;
          margin-left: 7px;
        }

        .input {
          height: 46px;
          border: 1px solid #373737;
          background: #030303;
          display: flex;
          align-items: center;
          transition: border-color 0.2s ease;
        }

        .input:focus-within {
          border-color: #7ffcff;
        }

        .prefix {
          width: 42px;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #555;
          font-size: 12px;
          border-right: 1px solid #242424;
        }

        .input input {
          width: 100%;
          height: 100%;
          background: transparent;
          border: 0;
          outline: none;
          padding: 0 14px;
          color: #fff;
          font-family: var(--font-space-mono), monospace;
          font-size: 10px;
          letter-spacing: 0.04em;
        }

        .input input::placeholder {
          color: #3f3f3f;
        }

        .input input[type="date"],
        .input input[type="time"] {
          color-scheme: dark;
        }

        /* ================= TWO COLUMN INPUT ================= */

        .row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        /* ================= TEXTAREA ================= */

        .textarea {
          border: 1px solid #373737;
          background: #030303;
          transition: border-color 0.2s ease;
        }

        .textarea:focus-within {
          border-color: #7ffcff;
        }

        .textarea textarea {
          display: block;
          width: 100%;
          resize: vertical;
          min-height: 95px;
          padding: 14px;
          background: transparent;
          border: 0;
          outline: none;
          color: #fff;
          font-family: var(--font-space-mono), monospace;
          font-size: 10px;
          line-height: 1.7;
        }

        .textarea textarea::placeholder {
          color: #3f3f3f;
        }

        /* ================= ERROR ================= */

        .error {
          border: 1px solid #8f3030;
          background: rgba(120, 20, 20, 0.08);
          color: #ff6d6d;
          padding: 12px;
          font-size: 9px;
          line-height: 1.6;
          margin-bottom: 20px;
        }

        .errorLabel {
          margin-right: 10px;
        }

        /* ================= BUTTONS ================= */

        .actions {
          display: grid;
          grid-template-columns: 0.7fr 1.3fr;
          gap: 12px;
          margin-top: 30px;
        }

        .cancel,
        .create {
          height: 46px;
          font-family: var(--font-space-mono), monospace;
          font-size: 9px;
          letter-spacing: 0.08em;
          cursor: pointer;
          transition: 0.2s ease;
        }

        .cancel {
          background: transparent;
          border: 1px solid #333;
          color: #777;
        }

        .cancel:hover {
          border-color: #777;
          color: #fff;
        }

        .create {
          background: #f2f2f2;
          border: 1px solid #f2f2f2;
          color: #050505;
        }

        .create:hover {
          background: #7ffcff;
          border-color: #7ffcff;
        }

        .create:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }

        /* ================= FORM FOOTER ================= */

        .formStatus {
          margin-top: 22px;
          padding-top: 15px;
          border-top: 1px solid #202020;
          display: flex;
          justify-content: space-between;
          color: #444;
          font-size: 7px;
          letter-spacing: 0.12em;
        }

        /* ================= BOTTOM BAR ================= */

        .bottomBar {
          height: 38px;
          border-top: 1px solid #202020;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 32px;
          color: #444;
          font-size: 7px;
          letter-spacing: 0.12em;
        }

        /* ================= RESPONSIVE ================= */

        @media (max-width: 1000px) {
          .main {
            grid-template-columns: 1fr;
            gap: 50px;
            padding: 55px 30px;
          }

          .intro {
            max-width: 700px;
          }

          .title {
            font-size: clamp(60px, 13vw, 100px);
          }
        }

        @media (max-width: 650px) {
          .systemBar {
            padding: 0 16px;
          }

          .systemStatus {
            display: none;
          }

          .main {
            padding: 40px 16px 60px;
          }

          .formPanel {
            padding: 25px 20px;
          }

          .row {
            grid-template-columns: 1fr;
            gap: 0;
          }

          .meta {
            flex-wrap: wrap;
            gap: 20px;
          }

          .actions {
            grid-template-columns: 1fr;
          }

          .bottomBar {
            padding: 0 16px;
          }

          .bottomBar span:last-child {
            display: none;
          }
        }
      `}</style>

      <div className="page">

        {/* TOP SYSTEM BAR */}
        <header className="systemBar">
          <div className="systemName">
            <span className="terminal">&gt;_</span>
            <span>EVENT QR ATTENDANCE</span>
          </div>

          <div className="systemStatus">
            <button
          onClick={handleLogout}
          className="text-sm border px-3 py-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          Log out
        </button>
            <span className="statusDot">●</span>
            ADMINISTRATOR // ONLINE
          </div>
        </header>

        {/* MAIN */}
        <main className="main">


          {/* FORM */}
          <section>
            <form
              onSubmit={handleSubmit}
              className="formPanel"
            >

              {/* CORNERS */}
              <div className="corner topLeft"></div>
              <div className="corner topRight"></div>
              <div className="corner bottomLeft"></div>
              <div className="corner bottomRight"></div>

              {/* HEADER */}
              <div className="formHeader">

                <div className="formIcon">
                  &gt;_
                </div>

                <div>
                  <div className="formSmall">
                    NEW EVENT PROTOCOL
                  </div>

                  <h2>
                    CREATE NEW EVENT
                  </h2>
                </div>

              </div>

              <div className="divider"></div>

              {/* EVENT NAME */}
              <div className="field">
                <label htmlFor="name">
                  EVENT NAME{" "}
                  <span className="required">*</span>
                </label>

                <div className="input">
                  <span className="prefix">&gt;</span>

                  <input
                    id="name"
                    type="text"
                    placeholder="ENTER EVENT NAME"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* DATE + TIME */}
              <div className="row">

                <div className="field">
                  <label htmlFor="date">
                    EVENT DATE{" "}
                    <span className="required">*</span>
                  </label>

                  <div className="input">
                    <span className="prefix">#</span>

                    <input
                      id="date"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="time">
                    START TIME{" "}
                    <span className="required">*</span>
                  </label>

                  <div className="input">
                    <span className="prefix">@</span>

                    <input
                      id="time"
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      required
                    />
                  </div>
                </div>

              </div>

              {/* LOCATION */}
              <div className="field">
                <label htmlFor="location">
                  LOCATION
                  <small className="optional">
                    [OPTIONAL]
                  </small>
                </label>

                <div className="input">
                  <span className="prefix">+</span>

                  <input
                    id="location"
                    type="text"
                    placeholder="ENTER EVENT LOCATION"
                    value={location}
                    onChange={(e) =>
                      setLocation(e.target.value)
                    }
                  />
                </div>
              </div>

              {/* DESCRIPTION */}
              <div className="field">
                <label htmlFor="description">
                  DESCRIPTION
                  <small className="optional">
                    [OPTIONAL]
                  </small>
                </label>

                <div className="textarea">
                  <textarea
                    id="description"
                    placeholder="ENTER EVENT DESCRIPTION..."
                    value={description}
                    onChange={(e) =>
                      setDescription(e.target.value)
                    }
                    rows={4}
                  />
                </div>
              </div>

              {/* ERROR */}
              {error && (
                <div className="error">
                  <span className="errorLabel">
                    [ ERROR ]
                  </span>
                  {error}
                </div>
              )}

              {/* ACTIONS */}
              <div className="actions">

                <button
                  type="button"
                  className="cancel"
                  onClick={() => router.push("/dashboard")}
                >
                  [ CANCEL ]
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="create"
                >
                  {loading
                    ? "[ CREATING EVENT... ]"
                    : "[ CREATE EVENT ]"}
                </button>

              </div>

              {/* STATUS */}
              <div className="formStatus">
                <span>
                  EVENT SYSTEM // READY
                </span>

                <span>
                  SECURE CONNECTION
                </span>
              </div>

            </form>
          </section>

        </main>

        {/* BOTTOM BAR */}
        <footer className="bottomBar">
          <span>
            EVENT QR ATTENDANCE SYSTEM // EVENT MANAGEMENT
          </span>

          <span>
            ADMIN // CREATE EVENT // v1.0
          </span>
        </footer>

      </div>
    </>
  );
}