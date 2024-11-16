import React, { useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchAllProducts } from "../../services/ProductService";
import { getProdItemByProdId } from "../../services/ProductItemService";
import { UserContext } from "../../contexts/UserContext";
import "./header.css";

import logo from "../../../public/assets/icon.png";
import logo1 from "../../../public/assets/image 9.png";
import search from "../../../public/icons/Search.png";
import cart from "../../../public/icons/Shopping Cart.png";
import list from "../../../public/icons/Group 201.png";

export const Header = () => {
  const { user, logout } = useContext(UserContext);

  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  const [choose, setChoose] = useState("home");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState(null);
  const [listProducts, setListProducts] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [compareListCount, setCompareListCount] = useState(0);
  const [showCompareButton, setShowCompareButton] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const keyword = params.get("keyword");
    if (keyword) {
      setSearchKeyword(keyword);
    }
  }, [location.search]);

  useEffect(() => {
    if (
      location.pathname === "/product-item-search" &&
      searchInputRef.current
    ) {
      searchInputRef.current.focus();
    }
  }, [location.pathname]);

  useEffect(() => {
    const checkCompareList = () => {
      const compareList = JSON.parse(localStorage.getItem('compareList') || '[]');
      const newCount = compareList.length;
      const lastCount = parseInt(localStorage.getItem('lastCompareCount') || '0');
      
      if (newCount >= 2 && lastCount < 2) {
        setShouldAnimate(true);
        setTimeout(() => setShouldAnimate(false), 300);
      }
      
      localStorage.setItem('lastCompareCount', newCount.toString());
      setCompareListCount(newCount);
      setShowCompareButton(newCount >= 2);
    };

    checkCompareList();
    const intervalId = setInterval(checkCompareList, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const handleChoose = (e) => {
    e.preventDefault();
    const value = e.target.value;
    setChoose(value);
    navigate(value === "home" ? "/" : `/${value}`);
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

  const handleClickConsignment = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Vui lòng đăng nhập để xem sản phẩm trong giỏ hàng của bạn");
      navigate("/login");
    } else {
      navigate("/user-consignment");
    }
  };

  const handleClickNav = () => {
    setShowUserDropdown((prev) => !prev);
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem('compareList');
    navigate("/");
    toast.success("Logout Success");
  };

  const handleClickDetail = () => {
    navigate(`/${user.email}/detail`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      navigate(`/product-item-search?keyword=${searchKeyword.trim()}`);
    } else {
      navigate("/");
    }
    searchInputRef.current.focus();
  };

  const handleSearchChange = (e) => {
    setSearchKeyword(e.target.value);
    if (location.pathname === "/product-item-search") {
      navigate(`/product-item-search?keyword=${e.target.value}`);
    }
  };

  const handleComparisonClick = () => {
    navigate("/productItem-comparison");
  };

  return (
    <>
      <div className="nav-container user-select-none">
        <div className="nav-content">
          <div className="nav-logo" onClick={() => navigate("/")}>
            <img src={logo} className="logo-image" alt="#" />
            <img src={logo1} className="logo1-image" alt="#" />
          </div>
          <div className="nav-search-grid">
            {showCompareButton && (
              <button
                className={`comparison-btn ${shouldAnimate ? 'animate-popup' : ''}`}
                onClick={handleComparisonClick}
                title="So sánh sản phẩm"
              >
                <i className="fa-solid fa-balance-scale"></i>
              </button>
            )}
            <form onSubmit={handleSearch} className="nav-search-bar">
              <input
                type="text"
                placeholder='Tìm kiếm "chú cá" phù hợp với bạn...'
                value={searchKeyword}
                onChange={handleSearchChange}
                ref={searchInputRef}
              />
              <button
                type="submit"
                className="nav-search-btn"
                onClick={() => searchInputRef.current.focus()}
              >
                <img src={search} alt="Search" />
              </button>
            </form>
          </div>

          <div className="d-flex flex-row gap-4 ">
            {user && user.auth ? (
              <>
                <div className="nav-info user-select-none">
                  <span>
                    <i className="fa-regular fa-user"></i> :{" "}
                    <span className="fw-bold">{user.email}</span>
                  </span>
                  <div ref={dropdownRef}>
                    <button
                      className="dropdown-toggle"
                      onClick={handleClickNav}
                    >
                      Cài Đặt
                    </button>
                    {showUserDropdown && (
                      <div className="dropdown-link">
                        <button className="nav-btn" onClick={handleClickDetail}>
                          Thông tin cá nhân
                        </button>
                        <button className="nav-btn" onClick={handleClickCart}>
                          Giỏ hàng của bạn
                        </button>
                        <button
                          className="nav-btn"
                          onClick={handleClickConsignment}
                        >
                          Cá Ký Gửi
                        </button>
                        <button className="nav-btn" onClick={handleLogout}>
                          Đăng xuất
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
                  <div className="dropdown-grid">
                    <li
                      className="dropdown-item special-item"
                      onClick={() => navigate('/batches')}
                    >
                      Lô Cá 
                    </li>
                  </div>

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
            value={"consignment"}
            style={{
              background:
                location.pathname === "/consignment" ? "#C70025" : "#281713",
              width: 250,
            }}
            onClick={handleChoose}
          >
            Ký Gửi
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
