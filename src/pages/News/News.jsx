import React, { useState, useEffect } from "react";
import { Header } from "../../layouts/header/header";
import "./News.css";
import "../../animation.css";
import { Footer } from "../../layouts/footer/footer";

const News = () => {
  const [news, setNews] = useState([]);
  const [featuredNews, setFeaturedNews] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      const mockNews = [
        {
          id: 1,
          title: "Tin Tức: Kỹ Thuật Nuôi Cá Koi Hiện Đại",
          content:
            "Các chuyên gia đã phát triển phương pháp nuôi cá Koi hiệu quả hơn, giúp tối ưu hóa môi trường sống cho cá...",
          date: "2023-09-15",
          image: "https://picsum.photos/800/400?random=1",
        },
        {
          id: 2,
          title: "Hướng Dẫn: Cách Chọn Cá Koi Chuẩn Đẹp",
          content:
            "Việc chọn cá Koi đẹp không chỉ dựa vào màu sắc mà còn phụ thuộc vào hình dáng và cách bơi của cá...",
          date: "2023-09-14",
          image: "https://picsum.photos/800/400?random=2",
        },
        {
          id: 3,
          title: "Sự Kiện: Triển Lãm Cá Koi Toàn Quốc",
          content:
            "Triển lãm cá Koi lớn nhất năm sẽ diễn ra vào tháng tới, thu hút hàng ngàn người tham gia, phóng viên...",
          date: "2023-09-13",
          image: "https://picsum.photos/800/400?random=3",
        },
        {
          id: 4,
          title: "Bí Quyết: Chăm Sóc Cá Koi Mùa Đông",
          content:
            "Để cá Koi khỏe mạnh qua mùa đông, người nuôi cần chú ý đến nhiệt độ nước và chế độ dinh dưỡng...",
          date: "2023-09-12",
          image: "https://picsum.photos/800/400?random=4",
        },
      ];
      setFeaturedNews(mockNews[0]);
      setNews(mockNews.slice(1));
    };

    fetchNews();
  }, []);

  return (
    <>
      <Header />

      <div className="news-container">
        <main className="news-content animated user-select-none">
          <h1 className="news-title">Tin tức về Cá Koi</h1>
          {featuredNews && (
            <section className="featured-news">
              <img src={featuredNews.image} />
              <div className="featured-news-content">
                <h2>{featuredNews.title}</h2>
                <p className="news-date">{featuredNews.date}</p>
                <p className="news-excerpt">
                  {featuredNews.content.substring(0, 150)}...
                </p>
                <button className="read-more">Đọc Toàn Bộ Tin</button>
              </div>
            </section>
          )}

          <section className="news-grid">
            {news.map((item) => (
              <article key={item.id} className="news-item">
                <img src={item.image} alt={item.title} />
                <div className="news-item-content">
                  <h3>{item.title}</h3>
                  <p className="news-date">{item.date}</p>
                  <p className="news-excerpt">
                    {item.content.substring(0, 100)}...
                  </p>
                  <button className="read-more">Đọc Thêm</button>
                </div>
              </article>
            ))}
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default News;
