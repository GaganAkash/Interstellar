import React from "react";

const TitleWithIcon = () => (
  <div className="title-with-icon flex items-center space-x-2 text-white">
    <span className="text-2xl font-bold">Interstellar</span>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="text-cyan-400"
    >
      <path d="M2.5 19.5L21 3l-3 18-5-5-5 5-5-5z" />
      <path d="M9 14l-3 3" />
      <path d="M15 14l3 3" />
    </svg>
  </div>
);

export default TitleWithIcon;
