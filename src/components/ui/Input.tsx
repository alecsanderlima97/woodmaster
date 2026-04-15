import { InputHTMLAttributes } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, className, ...props }: InputProps) {
  return (
    <div className="space-y-2 w-full">
      {label && (
        <label className="text-sm font-medium text-wood-300 ml-1">
          {label}
        </label>
      )}
      <input
        className={cn(
          "w-full bg-wood-900/50 border border-wood-800 rounded-xl px-4 py-3 text-white placeholder:text-wood-600 focus:outline-none focus:ring-2 focus:ring-brass-500/50 focus:border-brass-500 transition-all",
          className
        )}
        {...props}
      />
    </div>
  );
}
