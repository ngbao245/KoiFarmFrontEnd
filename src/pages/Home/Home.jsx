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
import { toast } from "react-toastify";

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
        } else {
          console.error("Failed to fetch blogs.");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => setIsLoading(false));
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

  return (
    <>
      <Header />
      <div className="homepage">
        <main className="user-select-none animated-fadeIn">
          <div className="homepage-banner">
            <img src="./public/assets/final.png" />
          </div>
          <h2 className="homepage-news-title">Tin tức cá koi - Tin tức Koi Shop</h2>
          <section className="homepage-news-section">
            <div className="homepage-news-info">
              <p>
                <div>
                  Koi Shop không chỉ là nơi cung cấp các giống cá Koi hàng đầu
                  thế giới, mà chúng tôi còn cung cấp thông tin hữu ích và các
                  bài viết chuyên sâu cho người nuôi cá.
                </div>
                <br />
                <div>
                  Cửa hàng Cá Koi của chúng tôi tự hào là nơi cung cấp những
                  giống cá Koi chất lượng cao, được nhập khẩu trực tiếp từ các
                  trại giống hàng đầu Nhật Bản. Với nhiều năm kinh nghiệm trong
                  việc nuôi dưỡng và chăm sóc cá Koi, chúng tôi cam kết mang đến
                  cho khách hàng những chú cá Koi khỏe mạnh, đẹp mắt và đa dạng
                  về màu sắc, kích thước. Ngoài ra, cửa hàng còn cung cấp các
                  dịch vụ chuyên nghiệp như tư vấn chăm sóc, hồ nuôi, và dịch vụ
                  ký gửi. Đến với chúng tôi, bạn không chỉ sở hữu những chú cá
                  Koi tuyệt đẹp mà còn trải nghiệm sự tận tâm và chuyên nghiệp.
                </div>
              </p>
            </div>
            <img className="homepage-news-image" src={fish} />
          </section>

          <section className="best-sellers">
            <h2>Bán Chạy</h2>
            <div className="product-list d-flex flex-wrap justify-content-center">
              {productItems.map((item) => (
                <div
                  key={item.id}
                  className="product-item rounded-2 border border-1 border-light-subtle p-1 bg-body-tertiary shadow mx-3"
                >
                  <div className="image-container rounded-2">
                    <img
                      className="rounded-1"
                      src={item.imageUrl}
                      alt={item.name}
                    />
                  </div>
                  <div className="divider"></div>
                  <div className="d-flex flex-column align-items-center">
                    <p className="fs-4 fw-semibold">{item.name}</p>
                    <p className="fs-5 fw-bold price">{item.price} VND</p>
                    <p className="fw-normal origin">{item.origin}</p>
                  </div>
                  <div className="mb-2 d-flex flex-row gap-2 justify-content-center">
                    <button className="buy-button rounded">Mua ngay</button>
                    <button
                      className="view-more-button rounded"
                      onClick={() => handleProductClick(item)}
                    >
                      Xem thêm
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="news-section">
            <h2>Tin tức cá koi - Tin tức Koi Shop</h2>
            <div className="news-list d-flex flex-row">
              {isLoading ? (
                <p>Loading blogs...</p>
              ) : blogs.length > 0 ? (
                blogs.map((blog) => (
                  <div className="card mb-3 p-2 me-3" key={blog.id}>
                    <img
                      src={blog.imageUrl || "./public/assets/default.jpg"}
                      className="card-img-top rounded"
                      alt={blog.title}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{blog.title}</h5>
                      <p className="card-text">
                        {blog.description.substring(0, 50)}...
                      </p>
                      <p className="card-text">
                        <small className="text-body-secondary">
                          Last updated recently
                        </small>
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p>No blogs available</p>
              )}
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
};
