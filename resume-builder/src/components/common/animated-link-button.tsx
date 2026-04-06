"use client";

import Link from "next/link";
import { motion } from "framer-motion";

type AnimatedLinkButtonProps = {
  href: string;
  label: string;
  className: string;
  delay?: number;
};

export function AnimatedLinkButton({ href, label, className, delay = 0 }: AnimatedLinkButtonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
    >
      <motion.div
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: delay + 0.3 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        <Link href={href} className={className}>
          {label}
        </Link>
      </motion.div>
    </motion.div>
  );
}