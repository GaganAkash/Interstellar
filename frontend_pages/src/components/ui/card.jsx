import React from "react";

export function Card({ children, className, ...props }) {
  return (
    <div
      className={
        "bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-2xl shadow-2xl border border-cyan-700 " + (className || "")
      }
      {...props}
    >
      {children}
    </div>
  );
}

export function CardContent({ children, className, ...props }) {
  return (
    <div
      className={
        "p-8 " + (className || "")
      }
      {...props}
    >
      {children}
    </div>
  );
}
