"use client";

import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes } from "react";

interface TeletextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const TeletextInput = forwardRef<HTMLInputElement, TeletextInputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="mb-4">
        {label && (
          <label className="block tt-cyan mb-2 uppercase tracking-wide">
            {label}
          </label>
        )}
        <div className="relative">
          <span className="tt-green mr-2">▶</span>
          <input
            ref={ref}
            className={`teletext-input ${error ? "border-teletext-red" : ""} ${className}`}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1 tt-red text-sm">⚠ {error}</p>
        )}
      </div>
    );
  }
);

TeletextInput.displayName = "TeletextInput";

interface TeletextTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const TeletextTextarea = forwardRef<HTMLTextAreaElement, TeletextTextareaProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="mb-4">
        {label && (
          <label className="block tt-cyan mb-2 uppercase tracking-wide">
            {label}
          </label>
        )}
        <div className="relative">
          <div className="tt-cyan text-sm mb-1">
            ┌{"─".repeat(50)}┐
          </div>
          <textarea
            ref={ref}
            className={`teletext-textarea ${error ? "border-teletext-red" : ""} ${className}`}
            {...props}
          />
          <div className="tt-cyan text-sm mt-1">
            └{"─".repeat(50)}┘
          </div>
        </div>
        {error && (
          <p className="mt-1 tt-red text-sm">⚠ {error}</p>
        )}
      </div>
    );
  }
);

TeletextTextarea.displayName = "TeletextTextarea";
