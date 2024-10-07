import { useState } from "react";
import "./HintBox.css";

const HintBox = () => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="alert alert-warning hint-box">
      <b>
        The default password is 123456. Employees{" "}
        <span style={{ color: "#c70025" }}>MUST</span> change the password
        immediately after receiving the account.
      </b>
      <button className="close-btn" onClick={handleClose}>
        &times;
      </button>
    </div>
  );
};

export default HintBox;
