"use client";

import { useEffect, useState } from "react";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  function cycle() {
    const order: Array<"light" | "dark" | "system"> = ["light", "dark", "system"];
    const idx = order.indexOf(theme);
    const next = order[(idx + 1) % order.length];
    setTheme(next);
  }

  const label = !mounted
    ? "Toggle theme"
    : theme === "system"
      ? `Theme: System (${resolvedTheme})`
      : `Theme: ${theme[0].toUpperCase()}${theme.slice(1)}`;

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={cycle}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full border border-line bg-canvas text-fg-muted transition hover:border-line-strong hover:bg-canvas-subtle hover:text-fg ${className}`}
    >
      <span className="sr-only">{label}</span>
      {/* Light icon */}
      <svg
        className={`h-4 w-4 ${mounted && resolvedTheme === "light" ? "block" : "hidden"}`}
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="8" cy="8" r="3.25" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M8 1.5v1.5M8 13v1.5M14.5 8H13M3 8H1.5M12.6 3.4l-1.05 1.05M4.45 11.55l-1.05 1.05M12.6 12.6l-1.05-1.05M4.45 4.45L3.4 3.4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
      {/* Dark icon */}
      <svg
        className={`h-4 w-4 ${mounted && resolvedTheme === "dark" ? "block" : "hidden"}`}
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M13.5 9.5A5.5 5.5 0 016.5 2.5a5.5 5.5 0 107 7z"
          fill="currentColor"
        />
      </svg>
    </button>
  );
}
