import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

/**
 * Wraps a page with a smooth slide-in + blur-to-clear entrance animation,
 * and a slide-out + blur exit animation.
 *
 * Enter: slides up from 20px below + blurred  → crisp in place  (0.45s)
 * Exit : slides up 10px + blurs out           → gone            (0.25s)
 */
export default function PageTransition({ children }: PageTransitionProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 22,
        filter: "blur(12px)",
        scale: 0.985,
      }}
      animate={{
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        scale: 1,
      }}
      exit={{
        opacity: 0,
        y: -12,
        filter: "blur(10px)",
        scale: 1.01,
      }}
      transition={{
        duration: 0.42,
        ease: [0.25, 0.46, 0.45, 0.94], // smooth ease-out curve
      }}
      style={{ width: "100%" }}
    >
      {children}
    </motion.div>
  );
}
