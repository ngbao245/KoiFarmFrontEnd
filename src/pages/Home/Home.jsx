// import React from "react";
import { Header } from "../../layouts/header/header";
import { Footer } from "../../layouts/footer/footer";
import "./Home.css";
import "../../styles/animation.css";
import fish from "../../../public/assets/img_sec1.png";
import { useEffect, useState } from "react";
import { fetchAllProdItem, getProdItemById } from "../../services/ProductItemService";
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
    Promise.all([
      fetchAllProdItem(), // Fetching product items
      fetchAllBlogs() // Fetching blogs
    ])
      .then(([productResponse, blogResponse]) => {
        const items = productResponse.data.entities;
        const shuffledItems = items.sort(() => 0.5 - Math.random()).slice(0, 4);
        setProductItems(shuffledItems); 

        if (blogResponse.statusCode === 200 && Array.isArray(blogResponse.data)) {
          const blogsToShow = blogResponse.data.slice(0, 2); // Show only the first two blogs
          setBlogs(blogsToShow);
        } else {
          // toast.error("Failed to fetch blogs.");
          console.error("Failed to fetch blogs.");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        // toast.error("Error fetching data.");
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleProductClick = async (productItem) => {
    try {
      const prodItemResponse = await getProdItemById(productItem.id);

      const productResponse = await getProductById(prodItemResponse.data.productId);
      const productName = productResponse.data.name;

      navigate(`/koi/${productName.toLowerCase().replace(/\s+/g, "")}/${productItem.id}`, {
        state: { response: prodItemResponse.data, productName },
      });
    } catch (error) {
      console.error("Error fetching product item:", error);
    }
  };

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
                {productItems.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2 border border-1 border-light-subtle p-1 bg-body-tertiary shadow mx-3"
                    style={{ width: 300 }}
                  >
                    <div className="rounded-2" style={{ height: 150 }}>
                      <img
                        className="rounded-1"
                        src={item.imageUrl}
                        style={{ width: 280, height: "100%" }}
                        alt={item.name}
                      />
                    </div>

                    <div
                      style={{
                        borderBottom: "2px solid black",
                        margin: "10px 0",
                      }}
                    ></div>

                    <div className="d-flex flex-column align-items-center">
                      <p className="fs-4 fw-semibold">{item.name}</p>
                      <p className="fs-5 fw-bold" style={{ color: "#C70025" }}>
                        {item.price} VND
                      </p>
                      <p className="fw-normal" style={{ color: "gray" }}>
                        {item.origin}
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
                        style={{ width: 700, height: 400 }}
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
      </div>
    </>
  );
};
