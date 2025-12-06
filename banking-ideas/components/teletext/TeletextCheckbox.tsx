"use client";

import { forwardRef, InputHTMLAttributes } from "react";

interface TeletextCheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
}

export const TeletextCheckbox = forwardRef<HTMLInputElement, TeletextCheckboxProps>(
  ({ label, className = "", ...props }, ref) => {
    return (
      <label className="flex items-center gap-3 cursor-pointer group mb-2">
        <span className="tt-cyan group-hover:tt-yellow">[ ]</span>
        <input
          ref={ref}
          type="checkbox"
          className={`teletext-checkbox ${className}`}
          {...props}
        />
        <span className="tt-white group-hover:tt-cyan transition-colors">
          {label}
        </span>
      </label>
    );
  }
);

TeletextCheckbox.displayName = "TeletextCheckbox";

interface TeletextRadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
}

export const TeletextRadio = forwardRef<HTMLInputElement, TeletextRadioProps>(
  ({ label, className = "", ...props }, ref) => {
    return (
      <label className="flex items-center gap-3 cursor-pointer group mb-2">
        <span className="tt-cyan group-hover:tt-yellow">( )</span>
        <input
          ref={ref}
          type="radio"
          className={`teletext-radio ${className}`}
          {...props}
        />
        <span className="tt-white group-hover:tt-cyan transition-colors">
          {label}
        </span>
      </label>
    );
  }
);

TeletextRadio.displayName = "TeletextRadio";
