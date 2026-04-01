import React from "react";
import { motion } from "framer-motion";
import { Variants } from "framer-motion";

const variants: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -4, transition: { duration: 0.15 } },
};

export function PageWrapper({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`min-h-full ${className}`}
    >
      {children}
    </motion.div>
  );
}
