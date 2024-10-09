import React, { useEffect } from "react";
import "./CrossFail.css";

const CrossFail = () => {
  useEffect(() => {
    const svgElement = document.querySelector("svg");
    svgElement.classList.add("animate");
  }, []);

  return (
    <div className="crossfail-container">
      <svg width="100" height="100">
        <circle
          fill="none"
          stroke="#dc3545"
          strokeWidth="5"
          cx="50"
          cy="50"
          r="45"
          className="crossfail-circle"
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
        />
        <line
          fill="none"
          stroke="#dc3545"
          strokeWidth="6"
          x1="30"
          y1="30"
          x2="70"
          y2="70"
          strokeLinecap="round"
          className="cross"
        />
        <line
          fill="none"
          stroke="#dc3545"
          strokeWidth="6"
          x1="70"
          y1="30"
          x2="30"
          y2="70"
          strokeLinecap="round"
          className="cross"
        />
      </svg>
    </div>
  );
};

export default CrossFail;
