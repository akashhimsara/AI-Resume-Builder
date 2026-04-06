"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

type MotionLinkButtonProps = {
  href: string;
  label: string;
  className: string;
  icon?: ReactNode;
  delay?: number;
};

export function MotionLinkButton({ href, label, className, icon, delay = 0 }: MotionLinkButtonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Link href={href} className={className}>
        {icon ? <span className="shrink-0">{icon}</span> : null}
        {label}
      </Link>
    </motion.div>
  );
}
