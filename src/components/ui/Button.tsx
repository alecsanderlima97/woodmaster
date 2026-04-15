import { ReactNode, ButtonHTMLAttributes } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  children: ReactNode;
}

export function Button({ 
  variant = "primary", 
  className, 
  children, 
  ...props 
}: ButtonProps) {
  const variants = {
    primary: "bg-brass-500 text-wood-950 hover:bg-brass-400 shadow-lg shadow-brass-600/20",
    secondary: "bg-wood-800 text-wood-100 hover:bg-wood-700",
    outline: "border-2 border-brass-500 text-brass-500 hover:bg-brass-500/10",
    ghost: "text-wood-400 hover:text-white hover:bg-white/5",
  };

  return (
    <button
      className={cn(
        "px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
