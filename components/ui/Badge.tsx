import { BadgeVariant } from "@/types";

interface BadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant, children, className = "" }: BadgeProps) {
  const baseStyles =
    "inline-flex items-center gap-1.5 px-2.5 py-1 font-mono text-xs uppercase tracking-wider rounded-sm";

  const variants: Record<BadgeVariant, string> = {
    live: "bg-exile-red/20 text-exile-red border border-exile-red/30",
    platform: "bg-exile-surface-2 text-exile-muted border border-exile-border",
    game: "bg-exile-accent/10 text-exile-accent border border-exile-accent/20",
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`}>
      {variant === "live" && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-exile-red opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-exile-red" />
        </span>
      )}
      {children}
    </span>
  );
}
