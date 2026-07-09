import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "verified" | "premium" | "outline" | "secondary";
}

const variantStyles = {
  default: "bg-primary/10 text-primary border-primary/20",
  verified: "bg-verified/10 text-verified border-verified/20",
  premium: "gradient-premium text-white border-transparent",
  outline: "bg-transparent text-muted-foreground border-border",
  secondary: "bg-secondary/10 text-secondary border-secondary/20",
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
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
