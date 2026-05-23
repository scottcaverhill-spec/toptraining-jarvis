import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-toyota-cyan/25 bg-toyota-cyan/10 px-2.5 py-1 text-xs font-black uppercase tracking-[.18em] text-toyota-cyan",
        className
      )}
      {...props}
    />
  );
}
