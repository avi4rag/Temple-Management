import * as React from "react";

import { cn } from "@/lib/utils";

const ScrollArea = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("relative w-full overflow-auto", className)}
      {...props}
    >
      {children}
    </div>
  ),
);
ScrollArea.displayName = "ScrollArea";

const ScrollBar = ({ className, ...props }) => (
  <div
    className={cn("absolute right-0 top-0 h-full w-1 bg-muted", className)}
    {...props}
  />
);

export { ScrollArea, ScrollBar };
