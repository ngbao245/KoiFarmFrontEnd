import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Header } from "../../layouts/header/header";
import { Footer } from "../../layouts/footer/footer";
import { toast } from "react-toastify";

const ProductItem = () => {
  const location = useLocation();
  const { response: productItems, productName } = location.state || {};

  const navigate = useNavigate();

  const approvedItems =
    productItems?.filter((item) => item.type === "Approved") || [];

  if (!approvedItems || approvedItems.length === 0) {
    return (
      <>
        <Header />
        <div className="animated" style={{ padding: "20px", textAlign: "center" }}>
          <h2>Không tìm thấy sản phẩm nào</h2>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: "10px 20px",
              backgroundColor: "#C70025",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              marginTop: "20px"
            }}
          >
            Quay về trang chủ
          </button>
        </div>
        <Footer />
      </>
    );
  }

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
      <div className="animated" style={{ padding: "20px" }}>
        <h1>Product: {productName}</h1>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "20px",
          }}
        >
          {approvedItems.map((item) => (
            <div
              key={item.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "15px",
                textAlign: "center",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              <img
                src={item.imageUrl}
                alt={item.name}
                style={{ width: "100%", height: "150px", objectFit: "cover" }}
              />
              <h3>{item.name}</h3>
              <p>Price: {item.price} VND</p>
              <p>Age: {item.age} years</p>
              <p>Size: {item.size}</p>
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  justifyContent: "center",
                }}
              >
                <button
                  onClick={() => handleViewDetails(item.id)}
                  style={{
                    padding: "10px",
                    backgroundColor: "#C70025",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  View Details
                </button>
                <button
                  onClick={() => handleAddToCompare(item)}
                  style={{
                    padding: "10px",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  So sánh
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductItem;
