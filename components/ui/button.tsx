import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "ghost" | "outline" | "cyan" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
};

export function Button({ className, variant = "default", size = "md", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-toyota-cyan disabled:pointer-events-none disabled:opacity-50",
        variant === "default" && "bg-toyota-red text-white shadow-redglow hover:brightness-110",
        variant === "ghost" && "bg-white/5 text-slate-200 hover:bg-white/10",
        variant === "outline" && "border border-white/15 bg-black/20 text-slate-100 hover:border-toyota-cyan/60 hover:bg-toyota-cyan/10",
        variant === "cyan" && "bg-toyota-cyan text-slate-950 shadow-hud hover:brightness-110",
        variant === "danger" && "bg-red-950/70 text-red-100 hover:bg-red-900",
        size === "sm" && "h-9 px-3 text-sm",
        size === "md" && "h-11 px-4",
        size === "lg" && "h-14 px-6 text-lg",
        size === "icon" && "h-11 w-11 p-0",
        className
      )}
      {...props}
    />
  );
}
