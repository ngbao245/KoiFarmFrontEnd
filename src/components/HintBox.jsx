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
        Mật khẩu mặc định là 123456. Nhân viên{" "}
        <span style={{ color: "#c70025" }}>PHẢI</span> đổi mật khẩu
        ngay sau khi nhận được tài khoản.
      </b>
      <button className="close-btn" onClick={handleClose}>
        &times;
      </button>
    </div>
  );
};

export default HintBox;
