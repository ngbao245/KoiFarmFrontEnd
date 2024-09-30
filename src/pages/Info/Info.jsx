import React from "react";
import { Header } from "../../layouts/header/header";
import "./Info.css";
import "../../animation.css";
import ceoImage from "../../../public/assets/ceo.jpg";
import ctoImage from "../../../public/assets/cto.jpg";
import cfoImage from "../../../public/assets/cfo.jpg";

const Info = () => {
  return (
    <>
      <Header />
      <div className="user-select-none animated-fadeIn">
        <main className="info-content">
          <h1 className="info-title animated-slideInUp">
            Về Công Ty Chúng Tôi
          </h1>

          <section className="info-section mission animated-slideInUp">
            <h2 className="text-center">Sứ Mệnh Của Chúng Tôi</h2>
            <br />
            <h2
              className="fst-italic fw-bold animated-text"
              style={{ color: "#319795" }}
            >
              "CÁ KOI CỦA BẠN - TIỀN CỦA CHÚNG TÔI"
            </h2>
          </section>

          <section className="info-section team animated-slideInUp">
            <h2 className="text-center">Đội Ngũ Của Chúng Tôi</h2>
            <br />
            <div className="team-grid">
              {[
                {
                  role: "Nguyễn Trọng Nghĩa",
                  image: ctoImage,
                  description: "Đảm nhiệm Backend.",
                },
                {
                  role: "Nguyễn Hoàng Bảo",
                  image: ceoImage,
                  description: "Đảm nhiệm Frontend.",
                },
                {
                  role: "Nguyễn Hưng Hảo",
                  image: cfoImage,
                  description: "Đảm nhiệm Backend.",
                },
              ].map(({ role, image, description }) => (
                <div key={role} className="team-member animated-slideInUp">
                  <div className="member-image">
                    <img src={image} alt={role} />
                  </div>
                  <h3>{role}</h3>
                  <p>{description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="info-section about animated-slideInUp">
            <h2 className="text-center">
              Giới Thiệu Về Trang Web Của Chúng Tôi
            </h2>
            <br />
            <div className="about-info">
              <div className="about-item">
                <i className="fas fa-fish"></i>
                <p className="item-center">
                  Trang web của chúng tôi chuyên cung cấp các loại cá Koi chất
                  lượng cao từ Nhật Bản.
                </p>
              </div>
              <div className="about-item">
                <i className="fas fa-leaf"></i>
                <p className="item-center">
                  Chúng tôi tự hào về việc chăm sóc và nuôi dưỡng cá Koi theo
                  tiêu chuẩn bền vững và thân thiện với môi trường.
                </p>
              </div>
              <div className="about-item">
                <i className="fas fa-award"></i>
                <p className="item-center">
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
