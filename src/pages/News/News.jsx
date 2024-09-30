import React, { useState, useEffect } from "react";
import { Header } from "../../layouts/header/header";
import "./News.css";

const News = () => {
  const [news, setNews] = useState([]);
  const [featuredNews, setFeaturedNews] = useState(null);

  useEffect(() => {
    // Simulating fetching news data
    const fetchNews = async () => {
      // Replace this with actual API call
      const mockNews = [
        {
          id: 1,
          title: "Breaking News: Major Tech Breakthrough",
          content:
            "Scientists have made a groundbreaking discovery in quantum computing...",
          date: "2023-04-15",
          image: "https://picsum.photos/800/400?random=1",
        },
        {
          id: 2,
          title: "New Environmental Policy Announced",
          content:
            "The government has unveiled a comprehensive plan to combat climate change...",
          date: "2023-04-14",
          image: "https://picsum.photos/800/400?random=2",
        },
        {
          id: 3,
          title: "Global Economic Summit Concludes",
          content:
            "World leaders reached a consensus on international trade regulations...",
          date: "2023-04-13",
          image: "https://picsum.photos/800/400?random=3",
        },
        {
          id: 4,
          title: "Breakthrough in Medical Research",
          content:
            "A team of researchers has developed a promising new treatment for cancer...",
          date: "2023-04-12",
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
      <div className="user-select-none animated-fadeIn">
        <main className="info-content">
          <h1 className="info-title animated-slideInUp">Latest News</h1>
          {featuredNews && (
            <section className="featured-news animated-slideInUp">
              <img src={featuredNews.image} alt={featuredNews.title} />
              <div className="featured-news-content">
                <h2>{featuredNews.title}</h2>
                <p className="news-date">{featuredNews.date}</p>
                <p className="news-excerpt">
                  {featuredNews.content.substring(0, 150)}...
                </p>
                <button className="read-more">Read Full Story</button>
              </div>
            </section>
          )}
          <section className="news-grid animated-slideInUp">
            {news.map((item) => (
              <article key={item.id} className="news-item">
                <img src={item.image} alt={item.title} />
                <div className="news-item-content">
                  <h3>{item.title}</h3>
                  <p className="news-date">{item.date}</p>
                  <p className="news-excerpt">
                    {item.content.substring(0, 100)}...
                  </p>
                  <button className="read-more">Read More</button>
                </div>
              </article>
            ))}
          </section>
        </main>
      </div>
    </>
  );
};

export default News;
