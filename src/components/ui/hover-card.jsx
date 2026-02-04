import * as React from "react";

import { cn } from "@/lib/utils";

const HoverCard = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("relative inline-block", className)}
    {...props}
  />
));
HoverCard.displayName = "HoverCard";

const HoverCardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "absolute bottom-full left-1/2 z-50 w-64 -translate-x-1/2 translate-y-2 rounded-md border bg-popover p-4 text-popover-foreground shadow-md",
      className,
    )}
    {...props}
  />
));
HoverCardContent.displayName = "HoverCardContent";

export { HoverCard, HoverCardContent };
