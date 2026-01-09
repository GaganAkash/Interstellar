import React from "react";

export function Input({ className, ...props }) {
  return (
    <input
      className={
        "w-full px-4 py-3 rounded-xl bg-gradient-to-r from-gray-800 to-gray-900 text-white placeholder-gray-400 shadow-inner focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 " +
        (className || "")
      }
      {...props}
    />
  );
}
