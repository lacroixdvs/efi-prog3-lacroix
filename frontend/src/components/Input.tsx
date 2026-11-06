import React, { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && <label className="text-xs uppercase font-bold text-white/60 tracking-wider">{label}</label>}
        <input
          ref={ref}
          className={`bg-white/5 border ${
            error ? "border-red-500" : "border-white/10"
          } rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF4D00] transition-colors ${className}`}
          {...props}
        />
        {error && <span className="text-red-400 text-xs font-semibold">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";