import React from "react";
import "./footer.css";
import logo from "../../../public/assets/icon.png";

export const Footer = () => {
  return (
    <>
      <footer>
        <div className="footer-container">
          <div className="footer-section contact-info">
            <img src={logo} alt="Koi Shop Logo" />
            <p>
              Địa chỉ: Tây Hồ, Hà Nội
              <br />
              Điện thoại: 091.5588.336
              <br />
              Email: koishopvn@gmail.com
            </p>
          </div>
          <div className="footer-section experience">
            <h3>KINH NGHIỆM - HƯỚNG DẪN</h3>
            <ul>
              <li>Koi Hướng dẫn nuôi Koi</li>
              <li>Kinh nghiệm nuôi Koi</li>
              <li>Koi Hướng dẫn nuôi Koi</li>
            </ul>
          </div>
          <div className="footer-section support">
            <h3>HỖ TRỢ TƯ VẤN</h3>
            <p>Phone number</p>
          </div>
        </div>
      </footer>
      <div className="footer-bottom">
        <p>
          © 2024 thuộc về www.shopkoi.vn. Bảo lưu toàn quyền, vui lòng ghi lại
          nguồn khhi lấy thông tin từ trang website của chúng tôi
        </p>
      </div>
    </>
  );
};
