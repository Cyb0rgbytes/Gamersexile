"use client";

import { motion } from "framer-motion";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  accent?: boolean;
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  accent = true,
  className = "",
}: SectionHeaderProps) {
  return (
    <motion.div
      className={`mb-10 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl uppercase tracking-wider text-exile-text">
        {title}
      </h2>
      {accent && (
        <motion.div
          className="h-[2px] mt-3 bg-exile-accent"
          initial={{ width: 0 }}
          whileInView={{ width: "4rem" }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        />
      )}
      {subtitle && (
        <p className="mt-4 text-exile-muted text-base sm:text-lg max-w-2xl">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
