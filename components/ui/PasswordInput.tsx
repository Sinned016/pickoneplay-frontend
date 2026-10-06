"use client";

import Input from "@/components/ui/Input";
import { Eye, EyeOff, Lock } from "lucide-react";
import { ComponentProps, forwardRef, useState } from "react";

type Props = Omit<ComponentProps<typeof Input>, "type">;

// Input with a show/hide toggle; forwards the ref so react-hook-form's register works.
const PasswordInput = forwardRef<HTMLInputElement, Props>(
  ({ icon = Lock, className, ...props }, ref) => {
    const [visible, setVisible] = useState(false);

    return (
      <div className="relative">
        <Input
          ref={ref}
          icon={icon}
          type={visible ? "text" : "password"}
          className={`pr-8 ${className ?? ""}`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-md text-muted hover:text-text1 cursor-pointer"
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    );
  },
);

PasswordInput.displayName = "PasswordInput";
export default PasswordInput;
