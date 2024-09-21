// import React from "react";
import logo from "../../../public/assets/icon.png";
import logo1 from "../../../public/assets/image 9.png";
import arrow from "../../../public/icons/Group 10.png";
import check from "../../../public/icons/Group 208.png";
import gift from "../../../public/icons/Group 207.png";
import cart from "../../../public/icons/Shopping Cart.png";
export const Footer = () => {
  return (
    // <>
    //   <footer>
    //     <div className="footer-container">
    //       <div className="footer-section contact-info">
    //         <img src={logo} alt="Koi Shop Logo" />
    //         <p>
    //           Địa chỉ: Tây Hồ, Hà Nội
    //           <br />
    //           Điện thoại: 091.5588.336
    //           <br />
    //           Email: koishopvn@gmail.com
    //         </p>
    //       </div>
    //       <div className="footer-section experience">
    //         <h3>KINH NGHIỆM - HƯỚNG DẪN</h3>
    //         <ul>
    //           <li>Koi Hướng dẫn nuôi Koi</li>
    //           <li>Kinh nghiệm nuôi Koi</li>
    //           <li>Koi Hướng dẫn nuôi Koi</li>
    //         </ul>
    //       </div>
    //       <div className="footer-section support">
    //         <h3>HỖ TRỢ TƯ VẤN</h3>
    //         <p>Phone number</p>
    //       </div>
    //     </div>
    //   </footer>
    //   <div className="footer-bottom">
    //     <p>
    //       © 2024 thuộc về www.shopkoi.vn. Bảo lưu toàn quyền, vui lòng ghi lại
    //       nguồn khhi lấy thông tin từ trang website của chúng tôi
    //     </p>
    //   </div>
    // </>
    <div
      className="w-100 border border-success"
      style={{ marginTop: 100, position: "", bottom: 0, width: "100%" }}
    >
      <div
        className="w-100 d-flex flex-row py-2 text-white justify-content-evenly"
        style={{ background: "#C70025", fontSize: 25 }}
      >
        <div className="d-flex flex-row gap-2">
          <img className="mt-1" src={cart} style={{ width: 30, height: 30 }} />
          Mua Koi linh hoạt
        </div>
        <div className="d-flex flex-row gap-2">
          <img className="mt-1" src={gift} style={{ width: 30, height: 30 }} />
          Giá rẻ bất ngờ
        </div>
        <div className="d-flex flex-row gap-2">
          <img className="mt-1" src={check} style={{ width: 30, height: 30 }} />
          Uy tín, chất lượng
        </div>
      </div>
      <div>
        <div className="w-100 d-flex flex-row justify-content-between p-3">
          <div className="">
            <p
              className="fw-semibold"
              style={{ fontSize: 22, color: "#C70025" }}
            >
              THÔNG TIN LIÊN HỆ CHÚNG TÔI
            </p>
            <img
              src={logo}
              alt="Koi Shop Logo"
              style={{ width: 100, height: 100 }}
            />
            <img className="" src={logo1} style={{ width: 230, height: 80 }} />
            <p className="mt-3 fw-semibold">
              Địa chỉ: Tây Hồ, Hà Nội
              <br />
              Điện thoại: 091.5588.336
              <br />
              Email: koishopvn@gmail.com
            </p>
          </div>
          <div className="">
            <p
              className="fw-semibold"
              style={{ fontSize: 22, color: "#C70025" }}
            >
              KINH NGHIỆM - HƯỚNG DẪN
            </p>
            <ul
              className="fw-semibold"
              style={{ listStyle: "none", marginLeft: -30 }}
            >
              <li>Koi Hướng dẫn nuôi Koi</li>
              <li>Kinh nghiệm nuôi Koi</li>
              <li>Koi Hướng dẫn nuôi Koi</li>
            </ul>
          </div>
          <div className="" style={{ marginRight: 150 }}>
            <p
              className="fw-semibold"
              style={{ fontSize: 22, color: "#C70025" }}
            >
              HỖ TRỢ TƯ VẤN
            </p>
            <div className="d-flex flex-row gap-2">
              <input
                className="ps-3 border rounded"
                placeholder="Phone Number"
                style={{ width: 400, height: 50 }}
              />
              <div
                className="d-flex flex-row border border-0 rounded align-items-center justify-content-center bg-black "
                style={{ width: 50, height: 50 }}
              >
                <img src={arrow} style={{ width: 20, height: 20 }} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="d-flex flex-row justify-content-center align-items-center bg-black"
        style={{ textAlign: "center", justifySelf: "center" }}
      >
        <p
          className="d-flex flex-row justify-content-center align-items-center text-white"
          style={{ textAlign: "center", justifySelf: "center", marginTop: 15 }}
        >
          © 2024 thuộc về www.shopkoi.vn. Bảo lưu toàn quyền, vui lòng ghi lại
          nguồn khi lấy thông tin từ trang website của chúng tôi
        </p>
      </div>
    </div>
  );
};
