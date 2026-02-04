import * as React from "react";

import { cn } from "@/lib/utils";

const Resizable = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("w-full", className)} {...props} />
));
Resizable.displayName = "Resizable";

const ResizablePanel = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex-1", className)} {...props} />
));
ResizablePanel.displayName = "ResizablePanel";

const ResizableHandle = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("w-1 bg-border hover:bg-primary", className)}
    {...props}
  />
));
ResizableHandle.displayName = "ResizableHandle";

export { Resizable, ResizablePanel, ResizableHandle };
