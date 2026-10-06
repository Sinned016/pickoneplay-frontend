import { cn } from "@/lib/utils";

type Size = "md" | "lg" | "xl";

type Props = {
  label?: string;
  size?: Size;
  className?: string;
};

const sizeClasses: Record<Size, { outer: string; text: string }> = {
  md: { outer: "w-14 h-14 md:w-16 md:h-16", text: "text-xs md:text-sm" },
  lg: { outer: "w-20 h-20 md:w-24 md:h-24", text: "text-lg md:text-xl" },
  xl: { outer: "w-16 h-16 md:w-24 md:h-24 lg:w-28 lg:h-28", text: "text-lg md:text-2xl lg:text-3xl" },
};

// Always an opaque dark centre so the gradient text stays readable on any
// background. No backdrop-blur: it flickers when the badge sits over animations.
export default function VsDivider({
  label = "VS",
  size = "md",
  className,
}: Props) {
  return (
    <div
      className={cn(
        "flex items-center justify-center shrink-0 rounded-full p-[1.5px] bg-gradient-to-br from-main1 to-main2 shadow-glow-duel",
        sizeClasses[size].outer,
        className,
      )}
    >
      <div className="flex items-center justify-center w-full h-full rounded-full bg-background">
        <span
          className={cn(
            "font-black tracking-wide bg-gradient-to-br from-main1 to-main2 bg-clip-text text-transparent",
            sizeClasses[size].text,
          )}
        >
          {label}
        </span>
      </div>
    </div>
  );
}
