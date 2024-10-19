import React from "react";
import "./FishSpinner.css";

const FishSpinner = () => {
  return (
    <>
      <div className="loading-overlay">
        <div className="fish-container">
          <div className="water"></div>
          <div className="fish"></div>
        </div>
        <p>Đang tải dữ liệu...</p>
      </div>
    </>
  );
};

export default FishSpinner;
