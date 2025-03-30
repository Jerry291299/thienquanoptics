import React from "react";

const Logo = () => {
  return (
    <div className="flex items-center space-x-2">
      {/* TQ Icon (Simplified as SVG) */}
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-white"
      >
        <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="4" />
        <path
          d="M12 12L28 28M28 12L12 28"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path d="M20 12V28" stroke="currentColor" strokeWidth="4" />
      </svg>

      {/* Text Section */}
      <div className="flex flex-col">
        <h1 className="text-white text-3xl font-bold tracking-wide">
          THIÊN QUANG
        </h1>
        <p className="text-white text-lg">Optic</p>
      </div>
    </div>
  );
};

export default Logo;