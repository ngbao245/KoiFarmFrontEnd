import { useState } from "react";
import "./HintBox.css";

const HintBox = ({ message }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="alert alert-warning hint-box">
      <b>{message}</b>
      <button className="close-box-btn" onClick={handleClose}>
        &times;
      </button>
    </div>
  );
};

export default HintBox;
