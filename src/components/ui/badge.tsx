import { type VariantProps, cva } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
        notion_done:
          "whitespace-nowrap overflow-hidden overflow-ellipsis before:size-2 before:rounded-full before:bg-secondary-green before:inline-flex before:shrink-0 before:mr-1.5  min-w-0 max-w-full h-7 rounded-xl text-sm pl-2 pr-4 leading-tight m-0 capitalize bg-secondary-green/40 border-secondary-green ",
        notion_incomplete:
          "whitespace-nowrap overflow-hidden overflow-ellipsis before:size-2 before:rounded-full before:bg-destructive before:inline-flex before:shrink-0 before:mr-1.5  min-w-0 max-w-full h-7 rounded-xl text-sm pl-2 pr-4 leading-tight m-0 capitalize bg-destructive/40 border-destructive text-destructive-foreground",
        notion_inprogress:
          "whitespace-nowrap overflow-hidden overflow-ellipsis before:size-2 before:rounded-full before:bg-blue-700 before:inline-flex before:shrink-0 before:mr-1.5  min-w-0 max-w-full h-7 rounded-xl text-sm pl-2 pr-4 leading-tight m-0 capitalize bg-blue-700/40 border-blue-700 text-white font-medium",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
