import React from "react";
import { Header } from "../../layouts/header/header";
import { Footer } from "../../layouts/footer/footer";
import "./Home.css";
import "../../styles/animation.css";
import fish from "../../../public/assets/img_sec.png";
import { useEffect, useState } from "react";
import {
  getAllProdItem,
  getProdItemById,
} from "../../services/ProductItemService";
import { useNavigate } from "react-router-dom";
import { getProductById } from "../../services/ProductService";
import { fetchAllBlogs } from "../../services/BlogService";
import FishSpinner from "../../components/FishSpinner";

export const Home = () => {
  const [productItems, setProductItems] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([getAllProdItem(), fetchAllBlogs()])
      .then(([productResponse, blogResponse]) => {
        const items = productResponse.data.entities;
        const shuffledItems = items.sort(() => 0.5 - Math.random()).slice(0, 4);
        setProductItems(shuffledItems);

        if (
          blogResponse.statusCode === 200 &&
          Array.isArray(blogResponse.data)
        ) {
          const blogsToShow = blogResponse.data.slice(0, 2);
          setBlogs(blogsToShow);
        }
      })
      .finally(() => setIsLoading(false));

      //Chatbot
      const script = document.createElement("script");
      script.src = "https://app.tudongchat.com/js/chatbox.js";
      script.async = true;
      document.body.appendChild(script);
  
      script.onload = () => {
        const tudong_chatbox = new TuDongChat('0gZTvtFBAwLSMw1Du_cQl');
        tudong_chatbox.initial();
      };
  
      return () => {
        document.body.removeChild(script);
      };
  }, []);

  const handleProductClick = async (productItem) => {
    try {
      const prodItemResponse = await getProdItemById(productItem.id);
      const productResponse = await getProductById(
        prodItemResponse.data.productId
      );
      const productName = productResponse.data.name;

      navigate(
        `/koi/${productName.toLowerCase().replace(/\s+/g, "")}/${
          productItem.id
        }`,
        {
          state: { response: prodItemResponse.data, productName },
        }
      );
    } catch (error) {
      console.error("Error fetching product item:", error);
    }
  };

  const handleReadMore = (id) => {
    navigate(`/news/${id}`);
  };

  return (
    <>
      <Header />
      <div className="homepage">
        <main className="user-select-none animated-fadeIn">
          <div className="homepage-banner">
            <img src="./public/assets/final.png" alt="Banner" />
          </div>
          <h2 className="homepage-intro-title">
            Tin tức cá koi - Tin tức Koi Shop
          </h2>
          <section className="homepage-intro-section">
            <div className="homepage-intro-info">
              <div>
                <p>
                  Koi Shop không chỉ là nơi cung cấp các giống cá Koi hàng đầu
                  thế giới, mà chúng tôi còn cung cấp thông tin hữu ích và các
                  bài viết chuyên sâu cho người nuôi cá.
                </p>
                <br />
                <p>
                  Cửa hàng Cá Koi của chúng tôi tự hào là nơi cung cấp những
                  giống cá Koi chất lượng cao, được nhập khẩu trực tiếp từ các
                  trại giống hàng đầu Nhật Bản. Với nhiều năm kinh nghiệm trong
                  việc nuôi dưỡng và chăm sóc cá Koi, chúng tôi cam kết mang đến
                  cho khách hàng những chú cá Koi khỏe mạnh, đẹp mắt và đa dạng
                  về màu sắc, kích thước. Ngoài ra, cửa hàng còn cung cấp các
                  dịch vụ chuyên nghiệp như tư vấn chăm sóc, hồ nuôi, và dịch vụ
                  ký gửi. Đến với chúng tôi, bạn không chỉ sở hữu những chú cá
                  Koi tuyệt đẹp mà còn trải nghiệm sự tận tâm và chuyên nghiệp.
                </p>
              </div>
            </div>
            <img className="homepage-intro-image" src={fish} alt="Fish" />
          </section>

          <section className="best-sellers">
            <h2 className="homepage-best-sellers-title">Bán Chạy</h2>
            <div className="product-list">
              {productItems.map((item) => (
                <div key={item.id} className="product-item-card">
                  <div className="image-container">
                    <img src={item.imageUrl} alt={item.name} />
                  </div>
                  <div className="product-card-info">
                    <div>
                      <p className="best-seller-name">{item.name}</p>
                      <p className="best-seller-price">
                        {item.price.toLocaleString("vi-VN")} VND
                      </p>
                    </div>
                    <div className="button-container">
                      <button className="buy-button">Mua ngay</button>
                      <button
                        className="view-more-button"
                        onClick={() => handleProductClick(item)}
                      >
                        Xem thêm
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="homepage-news-section">
            <h2 className="homepage-news-title">
              Tin tức cá koi - Tin tức Koi Shop
            </h2>
            <div className="homepage-news-list">
              {isLoading ? (
                <><FishSpinner/></>
              ) : blogs.length > 0 ? (
                blogs.map((blog) => (
                  <div className="homepage-news-card" key={blog.id}>
                    <div className="news-card-image-container">
                      <img
                        src={blog.imageUrl || "./public/assets/default.jpg"}
                        alt={blog.title}
                        className="news-card-image"
                      />
                      <div className="news-card-overlay">
                        <span className="news-card-category">
                          Tin Tức Cá Koi
                        </span>
                      </div>
                    </div>
                    <h5 className="news-card-title">{blog.title}</h5>
                    <p className="news-card-text">
                      {blog.description.substring(0, 200)}...
                    </p>
                    <div className="news-card-footer">
                      <span className="news-card-date">
                        {new Date().toLocaleDateString()}
                      </span>
                      <button 
                      className="news-card-button"
                      onClick={() => handleReadMore(blog.id)}
                      >Đọc thêm</button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-blogs-message">
                  Không có tin tức nào trong ngày hôm nay :(
                </p>
              )}
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
};
