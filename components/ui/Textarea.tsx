import { cn } from "@/lib/utils";
import { forwardRef, TextareaHTMLAttributes } from "react";

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  error?: boolean;
};

const Textarea = forwardRef<HTMLTextAreaElement, Props>(
  ({ error, className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "w-full rounded-lg border bg-surface1 backdrop-blur-sm py-2.5 px-3 outline-none text-text1 placeholder:text-muted transition-all duration-200 focus:border-border1-focus max-h-[160px] overflow-y-auto",
          error
            ? "border-error focus:shadow-glow-error"
            : "border-border1-strong focus:shadow-glow-main1",
          className,
        )}
        {...props}
      />
    );
  },
);

Textarea.displayName = "Textarea";
export default Textarea;
