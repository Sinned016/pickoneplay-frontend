import { cn } from "@/lib/utils";
import Link from "next/link";
import { ButtonHTMLAttributes } from "react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "accent"
  | "ghost"
  | "danger";
export type ButtonSize = "sm" | "md" | "lg" | "icon";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-main1 hover:bg-main1-hover text-black font-bold hover:shadow-glow-main1 focus-visible:ring-main1/60",
  secondary:
    "bg-surface2 hover:bg-surface2-hover border border-border1-strong hover:border-border1-hover text-text1 backdrop-blur-sm focus-visible:ring-main1/60",
  accent:
    "bg-main2 hover:bg-main2-hover text-black font-bold hover:shadow-glow-main2 focus-visible:ring-main2/60",
  ghost:
    "bg-transparent hover:bg-surface1-hover text-text1 hover:text-text1-hover focus-visible:ring-main1/60",
  danger:
    "bg-error hover:bg-error-hover text-white hover:shadow-glow-error focus-visible:ring-error/60",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "py-1.5 px-3 text-sm",
  md: "py-2 px-4 text-base",
  lg: "py-3 px-6 text-lg",
  icon: "p-2",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-lg transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export default function Button({
  variant = "primary",
  size = "md",
  href,
  className,
  children,
  ...props
}: Props) {
  const classes = cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
