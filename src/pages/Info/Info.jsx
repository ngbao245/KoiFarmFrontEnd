import React from "react";
import { Header } from "../../layouts/header/header";
import "./Info.css";
import "../../animation.css";
import ceoImage from "../../../public/assets/ceo.jpg";
import ctoImage from "../../../public/assets/cto.jpg";
import cfoImage from "../../../public/assets/cfo.jpg";

const Info = () => {
  const teamMembers = [
    {
      name: "Nguyễn Trọng Nghĩa",
      image: ctoImage,
      role: "Đảm nhiệm Backend.",
    },
    {
      name: "Nguyễn Hoàng Bảo",
      image: ceoImage,
      role: "Đảm nhiệm Frontend.",
    },
    {
      name: "Nguyễn Hưng Hảo",
      image: cfoImage,
      role: "Đảm nhiệm Backend.",
    },
  ];

  return (
    <>
      <Header />

      <div className="info-container">
        <main className="info-content animated user-select-none">
          <h1 className="info-title">Về Công Ty Chúng Tôi</h1>
          <section className="info-section">
            <h2 className="text-center">Sứ Mệnh Của Chúng Tôi</h2>
            <br />
            <h2 className="fst-italic fw-bold" style={{ color: "#319795" }}>
              "CÁ KOI CỦA BẠN - TIỀN CỦA CHÚNG TÔI"
            </h2>
          </section>

          <section className="info-section">
            <h2 className="text-center">Đội Ngũ Của Chúng Tôi</h2>
            <br />
            <div className="team-grid">
              {teamMembers.map(({ name, image, role }) => (
                <div key={name} className="team-member">
                  <div className="member-image">
                    <img src={image} />
                  </div>
                  <h3>{name}</h3>
                  <p>{role}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="info-section">
            <h2 className="text-center">
              Giới Thiệu Về Trang Web Của Chúng Tôi
            </h2>
            <br />
            <div className="about-info">
              <div className="about-item">
                <i className="fas fa-fish"></i>
                <p>
                  Trang web của chúng tôi chuyên cung cấp các loại cá Koi chất
                  lượng cao từ Nhật Bản.
                </p>
              </div>
              <div className="about-item">
                <i className="fas fa-leaf"></i>
                <p>
                  Chúng tôi tự hào về việc chăm sóc và nuôi dưỡng cá Koi theo
                  tiêu chuẩn bền vững và thân thiện với môi trường.
                </p>
              </div>
              <div className="about-item">
                <i className="fas fa-award"></i>
                <p>
                  Khách hàng có thể tin tưởng vào kinh nghiệm và sự tận tâm của
                  chúng tôi trong việc nuôi dưỡng và chăm sóc cá Koi.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default Info;
