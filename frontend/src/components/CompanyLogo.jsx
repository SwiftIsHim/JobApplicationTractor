import { useState } from "react";

// Resolves company-name → favicon via Google's free s2 service.
// It always returns *something*, so we only fall back to the letter avatar
// when the network request itself fails, or the name doesn't slugify.
export default function CompanyLogo({ name, size = 36, className = "" }) {
  const [errored, setErrored] = useState(false);
  const slug = (name || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  const dim = { width: size, height: size };

  if (errored || !slug) {
    const letter = (name || "?").trim().charAt(0).toUpperCase();
    return (
      <div
        style={dim}
        className={`flex shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-semibold text-slate-600 ${className}`}
      >
        {letter}
      </div>
    );
  }

  return (
    <img
      src={`https://www.google.com/s2/favicons?domain=${slug}.com&sz=128`}
      alt={name}
      style={dim}
      onError={() => setErrored(true)}
      className={`shrink-0 rounded-lg bg-white object-contain p-1 ${className}`}
    />
  );
}
