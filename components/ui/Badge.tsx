import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  onRemove?: () => void;
  variant?: "solid" | "outline";
  tone?: "main1" | "main2";
  className?: string;
};

const solidToneClasses: Record<"main1" | "main2", string> = {
  main1: "bg-main1 text-black",
  main2: "bg-main2 text-black",
};

const outlineToneClasses: Record<"main1" | "main2", string> = {
  main1: "border-border1-strong text-text1",
  main2: "border-main2/50 text-text1",
};

export default function Badge({
  children,
  onRemove,
  variant = "solid",
  tone = "main1",
  className,
}: Props) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 py-1 px-3 rounded-full text-sm font-medium",
        variant === "solid"
          ? solidToneClasses[tone]
          : cn(
              "border hover:border-border1-hover transition-colors",
              outlineToneClasses[tone],
            ),
        className,
      )}
    >
      <span>{children}</span>
      {onRemove && (
        <button type="button" onClick={onRemove} className="cursor-pointer">
          <X size={16} />
        </button>
      )}
    </div>
  );
}
