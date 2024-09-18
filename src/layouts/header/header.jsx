import React from "react";
import "./header.css";
import { Button } from "bootstrap";
import { Badge } from "react-bootstrap";

export const Header = () => {
  return (
    <>
      <header>
        <div className="menu-toggle">&#9776; DANH MỤC KOI</div>
        <div className="logo">KOI SHOP</div>
        <nav className="nav">
          <ul>
            <li>
              <a href="#home">TRANG CHỦ</a>
            </li>
            <li>
              <a href="#about">GIỚI THIỆU</a>
            </li>
            <li>
              <a href="#news">TIN TỨC</a>
            </li>
            <li>
              <a href="#contact">LIÊN HỆ</a>
            </li>
          </ul>
        </nav>
        <div className="search-bar">
          <input type="text" placeholder="Tìm kiếm 'cá' phù hợp với bạn..." />
          <button>&#x1F50D;</button>
        </div>
        <div className="login-cart">
          <button>Đăng Nhập</button>
          <div className="cart">&#128722;</div>
        </div>
      </header>
    </>
  );
};
