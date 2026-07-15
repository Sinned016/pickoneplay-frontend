import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { forwardRef, InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  icon?: LucideIcon;
  error?: boolean;
  wrapperClassName?: string;
};

const Input = forwardRef<HTMLInputElement, Props>(
  ({ icon: Icon, error, className, wrapperClassName, ...props }, ref) => {
    return (
      <div
        className={cn(
          "flex items-center gap-2 rounded-lg border bg-surface1 backdrop-blur-sm py-2.5 px-3 transition-all duration-200 focus-within:border-border1-focus",
          error
            ? "border-error focus-within:shadow-glow-error"
            : "border-border1-strong focus-within:shadow-glow-main1",
          wrapperClassName,
        )}
      >
        {Icon && <Icon className="w-5 h-5 text-muted shrink-0" />}
        <input
          ref={ref}
          className={cn(
            "w-full bg-transparent outline-none focus:outline-none focus:ring-0 text-text1 placeholder:text-muted",
            className,
          )}
          {...props}
        />
      </div>
    );
  },
);

Input.displayName = "Input";
export default Input;
