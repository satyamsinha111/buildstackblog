"use client";

import { useState } from "react";

const REASONS = [
  { value: "feedback", label: "Feedback or correction" },
  { value: "pitch", label: "Pitch an article" },
  { value: "partnership", label: "Partnership / sponsorship" },
  { value: "other", label: "Something else" },
] as const;

const fieldClasses =
  "mt-2 h-11 w-full rounded-xl border border-line bg-canvas px-3.5 text-sm text-fg placeholder:text-fg-subtle transition focus:border-line-strong focus:outline-none focus:ring-4 focus:ring-fg/5";

export function ContactForm() {
  const [status, setStatus] = useState<
    "idle" | "submitting" | "done" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const message = String(form.get("message") ?? "").trim();

    if (!name || !email || !message) {
      setStatus("error");
      setErrorMessage("Please fill out name, email, and message.");
      return;
    }

    setTimeout(() => {
      setStatus("done");
      (e.target as HTMLFormElement).reset();
    }, 700);
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-3xl border border-line bg-canvas-subtle/40 p-6 sm:p-8"
      noValidate
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Your name" name="name" autoComplete="name" required />
        <Field
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </div>

      <div className="mt-5">
        <label
          htmlFor="reason"
          className="block text-sm font-medium text-fg"
        >
          Reason
        </label>
        <select
          id="reason"
          name="reason"
          defaultValue="feedback"
          className={fieldClasses}
        >
          {REASONS.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-5">
        <label
          htmlFor="message"
          className="block text-sm font-medium text-fg"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          placeholder="Tell us what's on your mind…"
          className="mt-2 w-full rounded-xl border border-line bg-canvas px-3.5 py-3 text-sm text-fg placeholder:text-fg-subtle transition focus:border-line-strong focus:outline-none focus:ring-4 focus:ring-fg/5"
        />
      </div>

      <div className="mt-4 flex items-start gap-3 text-xs text-fg-muted">
        <input
          id="consent"
          name="consent"
          type="checkbox"
          required
          defaultChecked
          className="mt-0.5 h-4 w-4 rounded border-line text-fg focus:ring-fg/20"
        />
        <label htmlFor="consent" className="leading-relaxed">
          I agree to the BuildStack privacy policy and consent to my
          information being used to respond to this message.
        </label>
      </div>

      <div className="mt-6 flex flex-col items-start justify-between gap-3 border-t border-line pt-6 sm:flex-row sm:items-center">
        <p className="text-xs text-fg-subtle">
          We respond within two working days.
        </p>
        <button
          type="submit"
          disabled={status === "submitting"}
          className="btn-primary disabled:opacity-60"
        >
          {status === "submitting" ? "Sending…" : "Send message"}
        </button>
      </div>

      {status === "done" && (
        <p
          role="status"
          className="mt-5 rounded-xl border border-line bg-canvas px-4 py-3 text-sm text-fg"
        >
          ✓ Thanks — your message has been received. We&rsquo;ll get back to
          you shortly.
        </p>
      )}
      {status === "error" && errorMessage && (
        <p
          role="alert"
          className="mt-5 rounded-xl border border-line bg-canvas px-4 py-3 text-sm text-fg"
        >
          {errorMessage}
        </p>
      )}
    </form>
  );
}

interface FieldProps {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}

function Field({
  label,
  name,
  type = "text",
  required,
  autoComplete,
}: FieldProps) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-fg">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        className={fieldClasses}
      />
    </div>
  );
}
