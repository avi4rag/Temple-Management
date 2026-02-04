import * as React from "react";

import { cn } from "@/lib/utils";

const Menubar = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center space-x-1 rounded-md border bg-background p-1",
      className,
    )}
    {...props}
  />
));
Menubar.displayName = "Menubar";

const MenubarMenu = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("relative", className)} {...props} />
));
MenubarMenu.displayName = "MenubarMenu";

export { Menubar, MenubarMenu };
