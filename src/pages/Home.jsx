import React from "react";
import { Header } from "../layouts/header/header";
import { Footer } from "../layouts/footer/footer";
import "./Home.css";

export const Home = () => {
  return (
    <>
      <Header />
      <main>
        <section className="banner">
          <div className="banner-content">
            <h1>Koi</h1>
            <p>Cá Koi của bạn - Tiền của chúng tôi</p>
          </div>
        </section>

        <section className="news">
          <h2>Tin tức cá koi - Tin tức Koi Shop</h2>
          <p>
            Koi Shop không chỉ là nơi cung cấp các giống cá Koi hàng đầu thế giới, mà chúng tôi còn cung cấp thông tin hữu ích và các bài viết chuyên sâu cho người nuôi cá.
          </p>
        </section>

        <section className="best-sellers">
          <h2>Bán chạy</h2>
          <div className="product-list">
            <ProductItem image="koi1.jpg" name="Koi Ki Bekkou" price="1.000.000 VND" />
            <ProductItem image="koi2.jpg" name="Koi Ki Bekkou" price="1.000.000 VND" />
            {/* Add more ProductItem components as needed */}
          </div>
        </section>

        <section className="news-section">
          <h2>Tin tức cá koi - Tin tức Koi Shop</h2>
          <div className="news-list">
            <NewsItem
              image="news1.jpg"
              title="Thức ăn và cá koi"
              excerpt="Thức ăn không chỉ ảnh hưởng đến chất lượng cá koi, mà còn..."
            />
            <NewsItem
              image="news2.jpg"
              title="Chăm sóc cá koi mùa đông"
              excerpt="Không chỉ có thể nuôi koi ở Việt Nam, mà còn phải..."
            />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

const ProductItem = ({ image, name, price }) => (
  <div className="product-item">
    <img src={image} alt={name} />
    <p>{name}</p>
    <p>{price}</p>
  </div>
);

const NewsItem = ({ image, title, excerpt }) => (
  <div className="news-item">
    <img src={image} alt={title} />
    <p>{title}</p>
    <p>{excerpt}</p>
    <a href="#">Xem thêm</a>
  </div>
);
