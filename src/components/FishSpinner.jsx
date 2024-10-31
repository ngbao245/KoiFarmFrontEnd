import React, { useEffect } from "react";
import "./FishSpinner.css";

const FishSpinner = () => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

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
