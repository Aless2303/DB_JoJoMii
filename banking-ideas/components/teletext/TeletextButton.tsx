"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { motion, HTMLMotionProps } from "framer-motion";

type MotionButtonProps = HTMLMotionProps<"button">;

interface TeletextButtonProps extends Omit<MotionButtonProps, "children"> {
  variant?: "default" | "primary" | "danger";
  isLoading?: boolean;
  children?: React.ReactNode;
}

export const TeletextButton = forwardRef<HTMLButtonElement, TeletextButtonProps>(
  ({ children, variant = "default", isLoading, className = "", disabled, ...props }, ref) => {
    const variantClasses = {
      default: "teletext-button",
      primary: "teletext-button teletext-button-primary",
      danger: "teletext-button teletext-button-danger",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`${variantClasses[variant]} ${className} ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="teletext-loading"></span>
            PROCESARE...
          </span>
        ) : (
          children
        )}
      </motion.button>
    );
  }
);

TeletextButton.displayName = "TeletextButton";
