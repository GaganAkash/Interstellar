import React from "react";

export function Button({ children, className, ...props }) {
  return (
    <button
      className={
        "px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold shadow-lg transition duration-300 " +
        (className || "")
      }
      {...props}
    >
      {children}
    </button>
  );
}
