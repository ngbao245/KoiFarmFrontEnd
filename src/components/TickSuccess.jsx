import React, { useEffect } from "react";
import "./TickSuccess.css";

const TickSuccess = () => {
  useEffect(() => {
    const svgElement = document.querySelector("svg");
    svgElement.classList.add("animate");
  }, []);

  return (
    <div className="tick-container">
      <svg width="100" height="100">
        <circle
          fill="none"
          stroke="#68E534"
          strokeWidth="5"
          cx="50"
          cy="50"
          r="45"
          className="tick-circle"
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
        />
        <polyline
          fill="none"
          stroke="#68E534"
          strokeWidth="6"
          points="22,54 43,71 76,34"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="tick"
        />
      </svg>
    </div>
  );
};

export default TickSuccess;
