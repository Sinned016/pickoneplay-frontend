import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";
import { ReactNode } from "react";

type Props = {
  children?: ReactNode;
  className?: string;
};

export default function FormError({ children, className }: Props) {
  if (!children) return null;

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 text-error text-sm",
        className,
      )}
    >
      <AlertCircle size={14} className="shrink-0" />
      <span>{children}</span>
    </div>
  );
}
