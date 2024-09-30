// import React from "react";
import { Header } from "../../layouts/header/header";
import { Footer } from "../../layouts/footer/footer";
import "./Home.css";
import fish from "../../../public/assets/img_sec1.png";

export const Home = () => {
  return (
    <>
      <div className="homepage">
        <Header />
        <div className="info-page user-select-none animated-fadeIn">
          <main>
            <div className="banner_home">
              <img
                src="./public/assets/final.png"
                style={{ width: "100%", height: "100vh" }}
                alt="Banner"
              />
            </div>

            <section
              className="d-flex flex-row justify-content-around"
              style={{ background: "#281713", color: "white" }}
            >
              <div
                className="mt-2 ps-4 align-items-center justify-content-center"
                style={{ width: 500, fontSize: 25 }}
              >
                <h2>Tin tức cá koi - Tin tức Koi Shop</h2>
                <p>
                  Koi Shop không chỉ là nơi cung cấp các giống cá Koi hàng đầu
                  thế giới, mà chúng tôi còn cung cấp thông tin hữu ích và các
                  bài viết chuyên sâu cho người nuôi cá.
                </p>
              </div>

              <img className="mb-1" src={fish} />
            </section>

            <section className="best-sellers">
              <h2>Bán Chạy</h2>
              <div className="product-list d-flex flex-wrap justify-content-center">
                <div
                  className="rounded-2 border border-1 border-light-subtle p-1 bg-body-tertiary shadow mx-3"
                  style={{ width: 300 }}
                >
                  <div className="rounded-2" style={{ height: 150 }}>
                    <img
                      className="rounded-1"
                      src="./public/assets/koi-fish.jpg"
                      style={{ width: 280, height: "100%" }}
                    />
                  </div>

                  {/* Black line between image and description */}
                  <div
                    style={{
                      borderBottom: "2px solid black",
                      margin: "10px 0",
                    }}
                  ></div>

                  <div className="d-flex flex-column align-items-center">
                    <p className="fs-4 fw-semibold">Kohaku Koi</p>
                    <p className="fs-5 fw-bold" style={{ color: "#C70025" }}>
                      1.000.000 VND
                    </p>
                    <p className="fw-normal" style={{ color: "gray" }}>
                      TP Hồ Chí Minh
                    </p>
                  </div>
                  <div className="mb-2 d-flex flex-row gap-2 justify-content-center">
                    <button
                      className="rounded"
                      style={{ background: "#C70025" }}
                    >
                      Mua ngay
                    </button>
                    <button
                      className="bg-white rounded"
                      style={{ border: "1px solid #C70025", color: "#C70025" }}
                    >
                      Xem thêm
                    </button>
                  </div>
                </div>

                <div
                  className="rounded-2 border border-1 border-light-subtle p-1 bg-body-tertiary shadow mx-3"
                  style={{ width: 300 }}
                >
                  <div className="rounded-2" style={{ height: 150 }}>
                    <img
                      className="rounded-1"
                      src="./public/assets/koi-fish.jpg"
                      style={{ width: 280, height: "100%" }}
                    />
                  </div>

                  <div
                    style={{
                      borderBottom: "2px solid black",
                      margin: "10px 0",
                    }}
                  ></div>

                  <div className="d-flex flex-column align-items-center">
                    <p className="fs-4 fw-semibold">Kohaku Koi</p>
                    <p className="fs-5 fw-bold" style={{ color: "#C70025" }}>
                      1.000.000 VND
                    </p>
                    <p className="fw-normal" style={{ color: "gray" }}>
                      TP Hồ Chí Minh
                    </p>
                  </div>
                  <div className="mb-2 d-flex flex-row gap-2 justify-content-center">
                    <button
                      className="rounded"
                      style={{ background: "#C70025" }}
                    >
                      Mua ngay
                    </button>
                    <button
                      className="bg-white rounded"
                      style={{ border: "1px solid #C70025", color: "#C70025" }}
                    >
                      Xem thêm
                    </button>
                  </div>
                </div>

                <div
                  className="rounded-2 border border-1 border-light-subtle p-1 bg-body-tertiary shadow mx-3"
                  style={{ width: 300 }}
                >
                  <div className="rounded-2" style={{ height: 150 }}>
                    <img
                      className="rounded-1"
                      src="./public/assets/koi-fish.jpg"
                      style={{ width: 280, height: "100%" }}
                    />
                  </div>

                  <div
                    style={{
                      borderBottom: "2px solid black",
                      margin: "10px 0",
                    }}
                  ></div>

                  <div className="d-flex flex-column align-items-center">
                    <p className="fs-4 fw-semibold">Kohaku Koi</p>
                    <p className="fs-5 fw-bold" style={{ color: "#C70025" }}>
                      1.000.000 VND
                    </p>
                    <p className="fw-normal" style={{ color: "gray" }}>
                      TP Hồ Chí Minh
                    </p>
                  </div>
                  <div className="mb-2 d-flex flex-row gap-2 justify-content-center">
                    <button
                      className="rounded"
                      style={{ background: "#C70025" }}
                    >
                      Mua ngay
                    </button>
                    <button
                      className="bg-white rounded"
                      style={{ border: "1px solid #C70025", color: "#C70025" }}
                    >
                      Xem thêm
                    </button>
                  </div>
                </div>

                <div
                  className="rounded-2 border border-1 border-light-subtle p-1 bg-body-tertiary shadow mx-3"
                  style={{ width: 300 }}
                >
                  <div className="rounded-2" style={{ height: 150 }}>
                    <img
                      className="rounded-1"
                      src="./public/assets/koi-fish.jpg"
                      style={{ width: 280, height: "100%" }}
                    />
                  </div>

                  <div
                    style={{
                      borderBottom: "2px solid black",
                      margin: "10px 0",
                    }}
                  ></div>

                  <div className="d-flex flex-column align-items-center">
                    <p className="fs-4 fw-semibold">Kohaku Koi</p>
                    <p className="fs-5 fw-bold" style={{ color: "#C70025" }}>
                      1.000.000 VND
                    </p>
                    <p className="fw-normal" style={{ color: "gray" }}>
                      TP Hồ Chí Minh
                    </p>
                  </div>
                  <div className="mb-2 d-flex flex-row gap-2 justify-content-center">
                    <button
                      className="rounded"
                      style={{ background: "#C70025" }}
                    >
                      Mua ngay
                    </button>
                    <button
                      className="bg-white rounded"
                      style={{ border: "1px solid #C70025", color: "#C70025" }}
                    >
                      Xem thêm
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <section className="news-section">
              <h2>Tin tức cá koi - Tin tức Koi Shop</h2>
              <div className="news-list d-flex flex-row">
                <div className="card mb-3 p-2 me-3">
                  <img
                    style={{ width: 700, height: 400 }}
                    src="./public/assets/post1.jpg"
                    className="card-img-top rounded"
                    alt="Card Top"
                  />
                  <div className="card-body">
                    <h5 className="card-title">Thức ăn và cá koi</h5>
                    <p className="card-text">
                      Thức ăn không chỉ ảnh hưởng đến chất lượng cá koi, mà
                      còn...
                    </p>
                    <p className="card-text">
                      <small className="text-body-secondary">
                        Last updated 3 mins ago
                      </small>
                    </p>
                  </div>
                </div>

                <div className="card mb-3 p-2">
                  <img
                    style={{ width: 700, height: 400 }}
                    src="./public/assets/post2.jpg"
                    className="card-img-top rounded"
                    alt="Card Top"
                  />
                  <div className="card-body">
                    <h5 className="card-title">Thức ăn và cá koi</h5>
                    <p className="card-text">
                      Thức ăn không chỉ ảnh hưởng đến chất lượng cá koi, mà
                      còn...
                    </p>
                    <p className="card-text">
                      <small className="text-body-secondary">
                        Last updated 3 mins ago
                      </small>
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>
        <Footer />
      </div>
    </>
  );
};
