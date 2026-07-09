import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "verified" | "document" | "outline" | "secondary";
}

const variantStyles = {
  default: "bg-primary/8 text-primary border-primary/15",
  verified: "bg-verified/10 text-verified border-verified/20",
  document: "bg-secondary/10 text-secondary border-secondary/25",
  outline: "bg-transparent text-muted-foreground border-border",
  secondary: "bg-muted text-foreground border-border",
};

export function Badge({
  className,
  variant = "default",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
