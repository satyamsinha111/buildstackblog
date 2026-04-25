import Link from "next/link";
import { siteConfig } from "@/lib/site";

interface LogoProps {
  className?: string;
}

export function Logo({ className = "" }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label={`${siteConfig.name} — home`}
      className={`group inline-flex items-center gap-2.5 ${className}`}
    >
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-fg text-fg-inverted transition group-hover:rotate-[-4deg]">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M2 4.5L8 1.5L14 4.5L8 7.5L2 4.5Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M2 8L8 11L14 8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M2 11.5L8 14.5L14 11.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="font-display text-lg font-medium tracking-tightish text-fg">
        {siteConfig.name}
      </span>
    </Link>
  );
}
