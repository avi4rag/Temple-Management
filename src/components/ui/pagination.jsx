import * as React from "react";

import { cn } from "@/lib/utils";

const Pagination = ({ className, ...props }) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("flex w-full justify-center", className)}
    {...props}
  />
);
Pagination.displayName = "Pagination";

const PaginationContent = React.forwardRef(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-1", className)}
    {...props}
  />
));
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef(({ ...props }, ref) => (
  <li ref={ref} {...props} />
));
PaginationItem.displayName = "PaginationItem";

const PaginationLink = ({ isActive, ...props }) => (
  <a
    aria-current={isActive ? "page" : undefined}
    className={cn(
      "inline-flex h-10 w-10 items-center justify-center rounded-md border border-input text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      isActive &&
        "border-primary bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
    )}
    {...props}
  />
);
PaginationLink.displayName = "PaginationLink";

const PaginationPrevious = React.forwardRef(({ className, ...props }, ref) => (
  <PaginationLink
    ref={ref}
    size="default"
    className={cn("gap-1 pl-2.5", className)}
    {...props}
  />
));
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = React.forwardRef(({ className, ...props }, ref) => (
  <PaginationLink
    ref={ref}
    size="default"
    className={cn("gap-1 pr-2.5", className)}
    {...props}
  />
));
PaginationNext.displayName = "PaginationNext";

export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
};
