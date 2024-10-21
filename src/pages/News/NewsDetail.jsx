import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchBlogById } from "../../services/BlogService";
import { getUserById } from "../../services/UserService";
import FishSpinner from "../../components/FishSpinner";
import "./NewsDetail.css";

const NewsDetail = () => {
  const [news, setNews] = useState(null);
  const [author, setAuthor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchNewsAndAuthor = async () => {
      try {
        setIsLoading(true);
        const newsResponse = await fetchBlogById(id);
        if (newsResponse.statusCode === 200) {
          setNews(newsResponse.data);

          const authorResponse = await getUserById(newsResponse.data.userId);
          if (authorResponse.statusCode === 200) {
            setAuthor(authorResponse.data);
          }
        } else {
          setError("Failed to fetch news details.");
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching news detail or author:", error);
        setError("An error occurred while fetching news details.");
        setIsLoading(false);
      }
    };

    fetchNewsAndAuthor();
  }, [id]);

  if (isLoading) return <FishSpinner />;
  if (error) return <div>{error}</div>;

  return (
    <>
      <div className="news-detail-container">
        <div className="back-arrow">
          <i
            className="fa-solid fa-arrow-left"
            onClick={() => navigate(-1)}
          ></i>
        </div>

        <div className="news-detail-content animated">
          {news && (
            <article className="news-detail">
              <div className="news-detail-image-container">
                <img
                  src={news.imageUrl}
                  alt={news.title}
                  className="news-detail-image"
                />
              </div>
              <div className="news-detail-content">
                <h1 className="news-detail-title">{news.title}</h1>
                <div className="news-detail-meta">
                  <span className="news-detail-date">
                    {" "}
                    Đăng vào ngày: {new Date().toLocaleDateString("en-GB")}
                  </span>
                  <span className="news-detail-author">
                    Tác giả: {author ? author.name : "Anonymous"}
                  </span>
                </div>
                <p>{news.description}</p>
              </div>
              <div className="news-footer">---- Hết -----</div>
            </article>
          )}
        </div>
      </div>
    </>
  );
};

export default NewsDetail;
