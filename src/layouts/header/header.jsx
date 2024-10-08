import React, { useContext, useEffect, useState } from "react";
import logo from "../../../public/assets/icon.png";
import logo1 from "../../../public/assets/image 9.png";
import search from "../../../public/icons/Search.png";
import cart from "../../../public/icons/Shopping Cart.png";
import list from "../../../public/icons/Group 201.png";
import { useNavigate, useLocation } from "react-router-dom";
import "./header.css";
import { fetchAllProducts } from "../../services/ProductService";
import { getProdItemByProdId } from "../../services/ProductItemService";
import { toast } from "react-toastify";
import { UserContext } from "../../contexts/UserContext";

export const Header = () => {
  const { logout, user } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [choose, setChoose] = useState("home");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState(null);
  const [listProducts, setListProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetchAllProducts();
        if (response && response.data) {
          setListProducts(response.data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleChoose = (e) => {
    e.preventDefault();
    const value = e.target.value;
    setChoose(value);

    if (value === "home") {
      navigate("/");
    }
    if (value === "info") {
      navigate("/info");
    }
    if (value === "news") {
      navigate("/news");
    }
    if (value === "contact") {
      navigate("/contact");
    }
    if (value === "product") {
      navigate("/product");
    }
  };

  const handleMouseEnter = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setShowDropdown(true);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setShowDropdown(false);
    }, 150);
    setHoverTimeout(timeout);
  };

  const handleProductClick = async (product) => {
    try {
      const response = await getProdItemByProdId(product.id);
      console.log(response.data);

      navigate(`/koi/${product.name.toLowerCase().replace(/\s+/g, "")}`, {
        state: { response: response.data, productName: product.name },
      });
    } catch (error) {
      console.error("Error fetching product item:", error);
    }
  };

  const handleClickCart = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Vui lòng đăng nhập để xem sản phẩm trong giỏ hàng của bạn");
      navigate("/login");
    } else {
      navigate("/cart");
    }
  };

  const handleClickNav = () => {
    if (showUserDropdown) {
      setShowUserDropdown(false);
    } else {
      setShowUserDropdown(true);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    toast.success("Logout Success");
  };

  return (
    <>
      <div className="nav-container">
        <div className="nav-content">
          <div className="nav-logo" onClick={() => navigate("/")}>
            <img src={logo} className="logo-image" alt="#" />
            <img src={logo1} className="logo1-image" alt="#" />
          </div>
          <div className="nav-search-grid">
            <div className="nav-search-bar">
              <input
                type="text"
                placeholder='Tìm kiếm "chú cá" phù hợp với bạn...'
              />
            </div>
            <div className="nav-search-btn">
              <img src={search} />
            </div>
          </div>

          {/* <div className="d-flex flex-row gap-4 ">
            <button
              className="d-flex flex-row border border-0 rounded align-items-center justify-content-center bg-white text-black  "
              style={{ width: 150, height: 50 }}
              onClick={() => {
                navigate("/login");
              }}
            >
              Đăng Nhập
            </button>
            <button
              className="d-flex flex-row border border-0 rounded align-items-center justify-content-center bg-black text-white"
              style={{ width: 50, height: 50 }}
              onClick={() => {
                handleClickCart();
              }}
            >
              <img src={cart} style={{ width: 20, height: 20 }} />
            </button>
          </div> */}

          {/* update  */}

          <div className="d-flex flex-row gap-4 ">
            {user && user.auth ? (
              <>
                <div className="nav-info user-select-none">
                  <span>
                    Welcome: <span className="fw-bold">{user.email}</span>
                  </span>
                  <div>
                    <button
                      className="dropdown-toggle"
                      onClick={handleClickNav}
                    >
                      Settings
                    </button>
                    {showUserDropdown && (
                      <div>
                        <button className="nav-btn" onClick={handleClickCart}>
                          Cart
                        </button>
                        <button className="nav-btn" onClick={handleLogout}>
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <button
                  className="d-flex flex-row border border-0 rounded align-items-center justify-content-center bg-black text-white"
                  style={{ width: 50, height: 50 }}
                  onClick={handleClickCart}
                >
                  <img src={cart} style={{ width: 20, height: 20 }} />
                </button>
              </>
            ) : (
              <>
                <button
                  className="d-flex flex-row border border-0 rounded align-items-center justify-content-center bg-white text-black"
                  style={{ width: 150, height: 50 }}
                  onClick={() => {
                    navigate("/login");
                  }}
                >
                  Đăng Nhập
                </button>

                <button
                  className="d-flex flex-row border border-0 rounded align-items-center justify-content-center bg-black text-white"
                  style={{ width: 50, height: 50 }}
                  onClick={handleClickCart}
                >
                  <img src={cart} style={{ width: 20, height: 20 }} />
                </button>
              </>
            )}
          </div>

          {/*  */}
        </div>

        <div className="dropdown-wrapper">
          <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <button
              className="dropdown-btn user-select-none"
              value={"product"}
              onClick={handleChoose}
            >
              <img className="icon user-select-none" src={list} />
              DANH MỤC KOI
            </button>

            <div className="dropdown-menu">
              {showDropdown && (
                <div className="row dropdown-row row-cols-4">
                  {listProducts.map((product) => (
                    <div className="dropdown-grid" key={product.id}>
                      <li
                        className="dropdown-item"
                        onClick={() => handleProductClick(product)}
                      >
                        {product.name}
                      </li>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button
            className="d-flex flex-row justify-content-center"
            value={"home"}
            style={{
              background: location.pathname === "/" ? "#C70025" : "#281713",
              width: 250,
            }}
            onClick={handleChoose}
          >
            TRANG CHỦ
          </button>
          <button
            className="d-flex flex-row justify-content-center"
            value={"info"}
            style={{
              background: location.pathname === "/info" ? "#C70025" : "#281713",
              width: 250,
            }}
            onClick={handleChoose}
          >
            GIỚI THIỆU
          </button>
          <button
            className="d-flex flex-row justify-content-center"
            value={"news"}
            style={{
              background: location.pathname === "/news" ? "#C70025" : "#281713",
              width: 250,
            }}
            onClick={handleChoose}
          >
            TIN TỨC
          </button>
          <button
            className="d-flex flex-row justify-content-center"
            value={"contact"}
            style={{
              background:
                location.pathname === "/contact" ? "#C70025" : "#281713",
              width: 250,
            }}
            onClick={handleChoose}
          >
            LIÊN HỆ
          </button>
        </div>
      </div>
    </>
  );
};
