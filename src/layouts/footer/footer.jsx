// import React from "react";
import logo from "../../../public/assets/icon.png";
import logo1 from "../../../public/assets/image 9.png";
import arrow from "../../../public/icons/Group 10.png";
import check from "../../../public/icons/Group 208.png";
import gift from "../../../public/icons/Group 207.png";
import cart from "../../../public/icons/Shopping Cart.png";
import { Col, Container, Row } from "react-bootstrap";
export const Footer = () => {
  return (
    <Container
      fluid
      className="border border-success"
      style={{ marginTop: 0, bottom: 0 }}
    >
      <Row
        className="py-2 text-white"
        style={{
          background: "#C70025",
          fontSize: 25,
          justifyContent: "space-evenly",
        }}
      >
        <Col className="d-flex align-items-center gap-2 text-center justify-content-center">
          <img className="mt-1" src={cart} style={{ width: 30, height: 30 }} />
          Mua Koi linh hoạt
        </Col>
        <Col className="d-flex align-items-center gap-2 text-center justify-content-center">
          <img className="mt-1" src={gift} style={{ width: 30, height: 30 }} />
          Giá rẻ bất ngờ
        </Col>
        <Col className="d-flex align-items-center gap-2 text-center justify-content-center">
          <img className="mt-1" src={check} style={{ width: 30, height: 30 }} />
          Uy tín, chất lượng
        </Col>
      </Row>
      <Row className="p-3">
        <Col>
          <p className="fw-semibold" style={{ fontSize: 22, color: "#C70025" }}>
            THÔNG TIN LIÊN HỆ CHÚNG TÔI
          </p>
          <img
            src={logo}
            alt="Koi Shop Logo"
            style={{ width: 80, height: 80 }}
          />
          <img src={logo1} style={{ width: 210, height: 60 }} />
          <p className="mt-3 fw-semibold">
            Địa chỉ: Tây Hồ, Hà Nội
            <br />
            Điện thoại: 091.5588.336
            <br />
            Email: koishopvn@gmail.com
          </p>
        </Col>
        <Col>
          <p className="fw-semibold" style={{ fontSize: 22, color: "#C70025" }}>
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
        </Col>
        <Col>
          <p className="fw-semibold" style={{ fontSize: 22, color: "#C70025" }}>
            HỖ TRỢ TƯ VẤN
          </p>
          <div className="d-flex flex-row gap-2">
            <input
              className="ps-3 border rounded"
              placeholder="Phone Number"
              style={{ width: 400, height: 50 }}
            />
            <div
              className="d-flex flex-row border border-0 rounded align-items-center justify-content-center bg-black"
              style={{ width: 50, height: 50 }}
            >
              <img src={arrow} style={{ width: 20, height: 20 }} />
            </div>
          </div>
        </Col>
      </Row>
      <Row
        className="d-flex justify-content-center align-items-center bg-black"
        style={{ height: "50px" }}
      >
        <Col className="d-flex justify-content-center align-items-center">
          <p className="text-white text-center mb-0">
            © 2024 thuộc về www.shopkoi.vn. Bảo lưu toàn quyền, vui lòng ghi lại
            nguồn khi lấy thông tin từ trang website của chúng tôi
          </p>
        </Col>
      </Row>
    </Container>
  );
};
