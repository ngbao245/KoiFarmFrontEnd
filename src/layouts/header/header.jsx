import React, { useEffect, useState } from "react";
import logo from "../../../public/assets/icon.png";
import logo1 from "../../../public/assets/image 9.png";
import search from "../../../public/icons/Search.png";
import cart from "../../../public/icons/Shopping Cart.png";
import list from "../../../public/icons/Group 201.png";
import { useNavigate, useLocation } from "react-router-dom";
import "./header.css";
import { fetchAllProducts } from "../../services/ProductService";
import { getProdItemByProdId } from "../../services/ProductItemService";

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [choose, setChoose] = useState("home");
  const [showDropdown, setShowDropdown] = useState(false);
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

  return (
    <div className="w-100">
      <div
        className="d-flex p-3 flex-row justify-content-center gap-2 align-items-center justify-content-evenly"
        style={{ background: "#C70025" }}
      >
        <div
          className="d-flex flex-row gap-1 align-items-center"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          <img className=" mb-2" src={logo} style={{ width: 50, height: 50 }} />
          <img className="" src={logo1} style={{ width: 115, height: 40 }} />
        </div>
        <div className="d-flex flex-row gap-1 align-items-center">
          <div
            className="d-flex flex-row border border border-0 rounded "
            style={{ width: 500, height: 50 }}
          >
            <input
              className="w-100 ps-3 rounded border border-0"
              type="text"
              placeholder='Tìm kiếm "chú cá" phù hợp với bạn...'
            />
          </div>

          <div
            className="d-flex flex-row border border-0 rounded align-items-center justify-content-center bg-white "
            style={{ width: 50, height: 50 }}
          >
            <img src={search} style={{ width: 20, height: 20 }} />
          </div>
        </div>
        <div className="d-flex flex-row gap-4 ">
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
          >
            <img src={cart} style={{ width: 20, height: 20 }} />
          </button>
        </div>
      </div>

      <div
        className="h-50 text-white fs-5 d-flex flex-row gap-2 align-items-center justify-content-center"
        style={{
          background: "#281713",
          listStyle: "none",
        }}
      >
        <div
          className="dropdown-wrapper"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <button
            className="d-flex flex-row justify-content-center user-select-none"
            style={{
              background: "#C70025",
              width: 250,
            }}
            value={"product"}
            onClick={handleChoose}
          >
            <img
              className="user-select-none"
              src={list}
              style={{
                width: 20,
                height: 20,
                marginTop: 5,
                marginRight: 10,
              }}
            />
            DANH MỤC KOI
          </button>

          <div className="dropdown-menu">
            {showDropdown && (
              <div className="dropdown-row row row-cols-4">
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
  );
};
