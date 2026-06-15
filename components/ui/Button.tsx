"use client";

import { ButtonVariant } from "@/types";
import Link from "next/link";

interface ButtonProps {
  variant?: ButtonVariant;
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  icon?: React.ReactNode;
}

export function Button({
  variant = "primary",
  children,
  href,
  onClick,
  className = "",
  icon,
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center gap-2 px-6 py-2.5 font-display font-semibold text-sm uppercase tracking-wider rounded-sm transition-all duration-200 cursor-pointer select-none";

  const variants: Record<ButtonVariant, string> = {
    primary:
      "bg-exile-accent text-exile-bg hover:bg-exile-accent/90 hover:shadow-[0_0_20px_rgba(0,255,178,0.3)] active:scale-[0.97]",
    ghost:
      "border border-exile-border text-exile-text hover:border-exile-accent hover:text-exile-accent hover:shadow-[0_0_15px_rgba(0,255,178,0.1)] active:scale-[0.97]",
    danger:
      "bg-exile-red text-white hover:bg-exile-red/90 hover:shadow-[0_0_20px_rgba(255,59,92,0.3)] active:scale-[0.97]",
  };

  const classes = `${baseStyles} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {icon}
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={classes}>
      {icon}
      {children}
    </button>
  );
}
