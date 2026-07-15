import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

export type CardVariant = "surface1" | "surface2" | "ghost";
export type CardPadding = "none" | "sm" | "md" | "lg";
export type CardRadius = "xl" | "2xl";

type Props = HTMLAttributes<HTMLDivElement> & {
  variant?: CardVariant;
  padding?: CardPadding;
  radius?: CardRadius;
  bordered?: boolean;
  interactive?: boolean;
};

const variantClasses: Record<CardVariant, string> = {
  surface1: "bg-surface1 backdrop-blur-xl shadow-md",
  surface2: "bg-surface2 backdrop-blur-xl shadow-md",
  ghost: "bg-transparent",
};

const interactiveHoverClasses: Record<CardVariant, string> = {
  surface1: "hover:bg-surface1-hover",
  surface2: "hover:bg-surface2-hover",
  ghost: "hover:bg-surface1-hover",
};

const paddingClasses: Record<CardPadding, string> = {
  none: "",
  sm: "p-3",
  md: "p-4 md:p-6",
  lg: "p-6 md:p-8",
};

const radiusClasses: Record<CardRadius, string> = {
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
};

export default function Card({
  variant = "surface1",
  padding = "md",
  radius = "2xl",
  bordered = false,
  interactive = false,
  className,
  children,
  ...props
}: Props) {
  const borderColor =
    variant === "ghost"
      ? bordered
        ? "border-border1-strong"
        : "border-transparent"
      : bordered
        ? "border-border1-strong"
        : "border-border1";

  return (
    <div
      className={cn(
        variantClasses[variant],
        "border",
        borderColor,
        paddingClasses[padding],
        radiusClasses[radius],
        interactive &&
          cn(
            "transition-all cursor-pointer hover:border-border1-strong",
            interactiveHoverClasses[variant],
          ),
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
