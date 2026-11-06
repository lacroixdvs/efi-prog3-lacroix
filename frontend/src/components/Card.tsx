import React from "react";

export const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={`bg-[#101010] border border-white/10 rounded-[1.5rem] p-6 text-white ${className}`}>
      {children}
    </div>
  );
};