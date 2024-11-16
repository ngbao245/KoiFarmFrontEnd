import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Header } from "../../layouts/header/header";
import { Footer } from "../../layouts/footer/footer";
import { toast } from "react-toastify";
import './ProductItem.css';

const ProductItem = () => {
  const location = useLocation();
  const { response: productItems, productName } = location.state || {};

  const navigate = useNavigate();

  const approvedItems = Array.isArray(productItems) 
    ? productItems.filter((item) => item.type === "Approved")
    : [];

  const handleViewDetails = (productId) => {
    navigate(
      `/koi/${productName.toLowerCase().replace(/\s+/g, "")}/${productId}`
    );
  };

  const handleAddToCompare = (product) => {
    const compareList = JSON.parse(localStorage.getItem("compareList") || "[]");

    if (compareList.some((item) => item.id === product.id)) {
      toast.warning("Sản phẩm này đã có trong danh sách so sánh!");
      return;
    }

    if (compareList.length >= 5) {
      toast.warning("Chỉ có thể so sánh tối đa 5 sản phẩm!");
      return;
    }

    localStorage.setItem(
      "compareList",
      JSON.stringify([...compareList, product])
    );

    if (compareList.length === 0) {
      toast.info("Hãy thêm một sản phẩm nữa để so sánh!");
    } else {
      toast.success("Đã thêm sản phẩm vào danh sách so sánh!");
    }
  };

  return (
    <>
      <Header />
      <div className="koi-product-page">
        <div className="koi-product-container animated user-select-none">
          {approvedItems && approvedItems.length > 0 && (
            <h1 className="koi-product-heading">Danh sách {productName}</h1>
          )}
          
          {(!approvedItems || approvedItems.length === 0) ? (
            <div className="koi-empty-state-container">
              <div className="koi-empty-state-icon">🎏</div>
              <h2 className="koi-empty-state-heading">Không tìm thấy sản phẩm nào</h2>
              <p className="koi-empty-state-message">
                Hiện tại không có sản phẩm nào trong danh mục này. 
                Vui lòng quay lại sau hoặc khám phá các sản phẩm khác.
              </p>
              <button 
                onClick={() => navigate('/')}
                className="koi-empty-state-button"
              >
                Quay về trang chủ
              </button>
            </div>
          ) : (
            <div className="koi-items-grid">
              {approvedItems.map((item) => (
                <div key={item.id} className="koi-item-card">
                  <div className="koi-item-image-wrapper">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="koi-item-image"
                    />
                  </div>
                  <div className="koi-item-content">
                    <h3 className="koi-item-name">{item.name}</h3>
                    <p className="koi-item-price">
                      {item.price.toLocaleString('vi-VN')} VND
                    </p>
                    <div className="koi-item-specs">
                      <p>Tuổi: {item.age} tuổi</p>
                      <p>Kích thước: {item.size}</p>
                    </div>
                    <div className="koi-item-actions">
                      <button
                        onClick={() => handleViewDetails(item.id)}
                        className="koi-view-btn"
                      >
                        Xem chi tiết
                      </button>
                      <button
                        onClick={() => handleAddToCompare(item)}
                        className="koi-compare-btn"
                      >
                        So sánh
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductItem;
