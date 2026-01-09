import React from "react";

export function Progress({ value, className, ...props }) {
  return (
    <div
      className={"w-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl shadow-inner " + (className || "")}
      {...props}
    >
      <div
        className="bg-white h-4 rounded-xl shadow-lg"
        style={{ width: `${value}%` }}
      ></div>
    </div>
  );
}
