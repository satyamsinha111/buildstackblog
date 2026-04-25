interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  bordered?: boolean;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  align = "left",
  bordered = true,
}: PageHeaderProps) {
  const alignment = align === "center" ? "text-center mx-auto" : "";
  return (
    <header
      className={`${bordered ? "border-b border-line pb-10 mb-12" : ""} max-w-3xl ${alignment}`}
    >
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1 className="mt-3 font-display text-[40px] font-medium leading-[1.1] tracking-crisp text-fg text-balance sm:text-5xl md:text-[56px]">
        {title}
      </h1>
      {description && (
        <p className="mt-5 text-base leading-relaxed text-fg-muted text-pretty sm:text-lg">
          {description}
        </p>
      )}
    </header>
  );
}
