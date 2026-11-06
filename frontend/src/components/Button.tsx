import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  children,
  className = "",
  ...props
}) => {
  const styles = {
    primary: "bg-[#FF4D00] text-black font-black hover:bg-white",
    secondary: "bg-white/10 text-white hover:bg-white/20 border border-white/20",
    danger: "bg-red-600/20 text-red-400 border border-red-500/30 hover:bg-red-600 hover:text-white",
  };

  return (
    <button
      className={`px-5 py-2.5 rounded-full text-xs uppercase tracking-widest transition-all font-bold disabled:opacity-50 ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};