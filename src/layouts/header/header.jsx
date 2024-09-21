import React from "react";
// import { Button } from "bootstrap";
// import { Badge } from "react-bootstrap";
import logo from "../../../public/assets/icon.png";
import logo1 from "../../../public/assets/image 9.png";
import search from "../../../public/icons/Search.png";
import cart from "../../../public/icons/Shopping Cart.png";
import list from "../../../public/icons/Group 201.png";
import { useNavigate } from "react-router-dom";
export const Header = () => {
  const navigate = useNavigate();

  const [choose, setChoose] = React.useState("");

  const handleChoose = (e) => {
    e.preventDefault();
    setChoose(e.target.value);
  };

  // console.log(choose);
  return (
    // <>
    //   <header>
    //     <div className="menu-toggle">&#9776; DANH MỤC KOI</div>
    //     <div className="logo">KOI SHOP</div>
    //     <nav className="nav">
    //       <ul>
    //         <li>
    //           <a href="#home">TRANG CHỦ</a>
    //         </li>
    //         <li>
    //           <a href="#about">GIỚI THIỆU</a>
    //         </li>
    //         <li>
    //           <a href="#news">TIN TỨC</a>
    //         </li>
    //         <li>
    //           <a href="#contact">LIÊN HỆ</a>
    //         </li>
    //       </ul>
    //     </nav>
    //     <div className="search-bar">
    //       <input type="text" placeholder="Tìm kiếm 'cá' phù hợp với bạn..." />
    //       <button>&#x1F50D;</button>
    //     </div>
    //     <div className="login-cart">
    //       <button>Đăng Nhập</button>
    //       <div className="cart">&#128722;</div>
    //     </div>
    //   </header>
    // </>

    <div className="header">
      <div className="w-100 border border-primary">
        <div
          className="d-flex p-3 flex-row justify-content-center gap-2 align-items-center justify-content-evenly"
          style={{ background: "#C70025" }}
        >
          <div className="d-flex flex-row gap-1 align-items-center">
            <img
              className=" mb-2"
              src={logo}
              style={{ width: 50, height: 50 }}
            />
            <img className="" src={logo1} style={{ width: 115, height: 40 }} />
          </div>
          <div className="d-flex flex-row gap-1 align-items-center">
            <div
              className="d-flex flex-row border border border-0 rounded "
              style={{ width: 500, height: 50 }}
            >
              <input
                className="w-100 ps-3"
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
          className="h-50 text-white fs-5 d-flex flex-row gap-2 align-items-center justify-content-evenly "
          style={{ background: "#281713", listStyle: "none", marginLeft: -80 }}
        >
          <button
            className="d-flex flex-row gap-3 justify-content-center"
            style={{
              background: choose === "cate" ? "#C70025" : "#281713",
              width: 250,
            }}
            value={"cate"}
            onClick={handleChoose}
          >
            <img
              className=""
              src={list}
              style={{
                width: 20,
                height: 20,
                marginTop: 5,
              }}
            />
            DANH MỤC KOI
          </button>
          <button
            className="d-flex flex-row justify-content-center"
            value={"home"}
            style={{
              background: choose === "home" ? "#C70025" : "#281713",
              width: 250,
            }}
            onClick={handleChoose}
          >
            TRANG CHỦ
          </button>
          <button
            className="d-flex flex-row justify-content-center"
            value={"intro"}
            style={{
              background: choose === "intro" ? "#C70025" : "#281713",
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
              background: choose === "news" ? "#C70025" : "#281713",
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
              background: choose === "contact" ? "#C70025" : "#281713",
              width: 250,
            }}
            onClick={handleChoose}
          >
            LIÊN HỆ
          </button>
        </div>
      </div>
    </div>
  );
};
