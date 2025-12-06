"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface TeletextScreenProps {
  children: ReactNode;
  className?: string;
}

export function TeletextScreen({ children, className = "" }: TeletextScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`teletext-screen teletext-flicker ${className}`}
    >
      <div className="max-w-4xl mx-auto pb-20">
        {children}
      </div>
    </motion.div>
  );
}
