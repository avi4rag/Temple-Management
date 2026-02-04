import * as React from "react";

import { cn } from "@/lib/utils";

const InputOTP = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex gap-2", className)} {...props} />
));
InputOTP.displayName = "InputOTP";

const InputOTPGroup = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center gap-2", className)}
    {...props}
  />
));
InputOTPGroup.displayName = "InputOTPGroup";

const InputOTPSlot = React.forwardRef(({ index, className, ...props }, ref) => (
  <input
    ref={ref}
    type="text"
    inputMode="numeric"
    maxLength={1}
    className={cn(
      "h-10 w-10 rounded-md border border-input bg-background text-center text-lg font-semibold",
      className,
    )}
    {...props}
  />
));
InputOTPSlot.displayName = "InputOTPSlot";

export { InputOTP, InputOTPGroup, InputOTPSlot };
