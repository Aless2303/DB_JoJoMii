"use client";

import { forwardRef, SelectHTMLAttributes } from "react";

interface Option {
  value: string;
  label: string;
}

interface TeletextSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Option[];
  error?: string;
}

export const TeletextSelect = forwardRef<HTMLSelectElement, TeletextSelectProps>(
  ({ label, options, error, className = "", ...props }, ref) => {
    return (
      <div className="mb-4">
        {label && (
          <label className="block tt-cyan mb-2 uppercase tracking-wide">
            {label}
          </label>
        )}
        <div className="relative">
          <span className="tt-green mr-2">▶</span>
          <select
            ref={ref}
            className={`teletext-select ${error ? "border-teletext-red" : ""} ${className}`}
            {...props}
          >
            <option value="">-- Selectează --</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <span className="absolute right-3 top-1/2 -translate-y-1/2 tt-cyan pointer-events-none">
            ▼
          </span>
        </div>
        {error && (
          <p className="mt-1 tt-red text-sm">⚠ {error}</p>
        )}
      </div>
    );
  }
);

TeletextSelect.displayName = "TeletextSelect";
