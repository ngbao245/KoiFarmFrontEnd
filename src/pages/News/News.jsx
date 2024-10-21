import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../../layouts/header/header";
import "./News.css";
import "../../styles/animation.css";
import { Footer } from "../../layouts/footer/footer";
import { fetchAllBlogs } from "../../services/BlogService";
import FishSpinner from "../../components/FishSpinner";

const News = () => {
  const [news, setNews] = useState([]);
  const [featuredNews, setFeaturedNews] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true);
        const response = await fetchAllBlogs();
        if (response.statusCode === 200 && response.data.length > 0) {
          setFeaturedNews(response.data[0]);
          setNews(response.data.slice(1));
        } else {
          setError("No news available at the moment.");
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setError("Failed to fetch news. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);

  const handleReadMore = (id) => {
    navigate(`/news/${id}`);
  };

  if (isLoading) return <FishSpinner />;
  if (error) return <div>{error}</div>;

  return (
    <>
      <Header />
      <div className="news-container">
        <main className="news-content animated user-select-none">
          <h1 className="news-title">Tin tức về Cá Koi</h1>
          {featuredNews && (
            <section className="featured-news">
              <img
                src={
                  featuredNews.imageUrl ||
                  "https://picsum.photos/800/400?random=1"
                }
                alt={featuredNews.title}
              />
              <div className="featured-news-content">
                <h2>{featuredNews.title}</h2>
                <p className="news-excerpt">
                  {featuredNews.description
                    ? `${featuredNews.description.substring(0, 150)}...`
                    : "No description available"}
                </p>
                <button
                  className="read-more"
                  onClick={() => handleReadMore(featuredNews.id)}
                >
                  Đọc Toàn Bộ Tin
                </button>
              </div>
            </section>
          )}

          <section className="news-grid">
            {news.map((item) => (
              <article key={item.id} className="news-item">
                <img
                  src={
                    item.imageUrl ||
                    `https://picsum.photos/800/400?random=${item.id}`
                  }
                  alt={item.title}
                />
                <div className="news-item-content">
                  <h3>{item.title}</h3>
                  <p className="news-excerpt">
                    {item.description
                      ? `${item.description.substring(0, 100)}...`
                      : "No description available"}
                  </p>
                  <button
                    className="read-more"
                    onClick={() => handleReadMore(item.id)}
                  >
                    Đọc Thêm
                  </button>
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
