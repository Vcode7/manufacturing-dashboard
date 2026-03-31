import React from "react";
import { motion } from "framer-motion";

export const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
};

export function PageWrapper({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`h-full ${className}`}
    >
      {children}
    </motion.div>
  );
}
