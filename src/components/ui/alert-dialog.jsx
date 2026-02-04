import * as React from "react";

import { cn } from "@/lib/utils";

const AlertDialog = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("fixed inset-0 z-50 bg-black/50", className)}
    {...props}
  />
));
AlertDialog.displayName = "AlertDialog";

export { AlertDialog };
