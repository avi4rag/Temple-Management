import * as React from "react";

import { cn } from "@/lib/utils";

const Sidebar = React.forwardRef(({ className, ...props }, ref) => (
  <aside
    ref={ref}
    className={cn("w-64 border-r bg-background", className)}
    {...props}
  />
));
Sidebar.displayName = "Sidebar";

const SidebarContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-4", className)} {...props} />
));
SidebarContent.displayName = "SidebarContent";

export { Sidebar, SidebarContent };
