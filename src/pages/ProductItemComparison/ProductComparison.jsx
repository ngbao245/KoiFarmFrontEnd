import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../../layouts/header/header";
import { Footer } from "../../layouts/footer/footer";
import { toast } from "react-toastify";
import { getProdItemByProdId } from "../../services/ProductItemService";
import "./ProductComparison.css";

const ProductComparison = () => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const compareList = JSON.parse(localStorage.getItem("compareList") || "[]");
    setSelectedProducts(compareList);
  }, []);

  const handleRemoveProduct = (productId) => {
    const updatedProducts = selectedProducts.filter(
      (product) => product.id !== productId
    );
    setSelectedProducts(updatedProducts);
    localStorage.setItem("compareList", JSON.stringify(updatedProducts));
  };

  const handleViewProduct = async (product) => {
    try {
      const response = await getProdItemByProdId(product.productId);
      const approvedItems = response.data.filter(
        (item) => item.type === "Approved"
      );

      navigate(
        `/koi/${product.name.toLowerCase().replace(/\s+/g, "")}/${product.id}`
      );
    } catch (error) {
      console.error("Error fetching product item:", error);
      toast.error("Error navigating to product details");
    }
  };

  if (selectedProducts.length === 0) {
    return (
      <>
        <Header />
        <div className="comparison-container">
          <div className="comparison-content animated">
            <div className="comparison-header">
              <h2 className="comparison-title">So sánh sản phẩm</h2>
              <p className="comparison-subtitle">So sánh tối đa 5 sản phẩm</p>
            </div>
            <div className="container-fluid text-center empty-cart-container">
              <i
                className="fa-solid fa-scale-balanced"
                style={{
                  fontSize: "50px",
                  opacity: 0.2,
                  marginBottom: "15px",
                }}
              ></i>
              <p className="empty-cart-text">"Hỏng" có gì để so sánh hết</p>
              <p className="empty-cart-text">Lướt KoiShop, lựa cá ngay đi!</p>
              <button
                className="shop-now-btn"
                onClick={() => navigate("/product")}
              >
                Mua ngay
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="comparison-container">
        <div className="comparison-content animated">
          <div className="comparison-header">
            <h2 className="comparison-title">So sánh sản phẩm</h2>
            <p className="comparison-subtitle">So sánh tối đa 5 sản phẩm</p>
          </div>

          <div className="comparison-table-wrapper">
            <table className="comparison-table">
              <thead>
                <tr className="image-row">
                  <th className="feature-column">Sản phẩm</th>
                  {selectedProducts.map((product) => (
                    <td key={product.id} className="product-column">
                      <h3 className="comparison-product-name">
                        {product.name}
                      </h3>
                      <div className="comparison-image-container">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="product-image"
                        />
                      </div>
                      <div className="product-actions">
                        <button
                          className="view-product-button"
                          onClick={() => handleViewProduct(product)}
                        >
                          Xem chi tiết
                        </button>
                        <button
                          className="remove-button"
                          onClick={() => handleRemoveProduct(product.id)}
                        >
                          Xóa khỏi so sánh
                        </button>
                      </div>
                    </td>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="section-header">
                  <th colSpan={selectedProducts.length + 1}>
                    Thông tin cơ bản
                  </th>
                </tr>
                <tr>
                  <th>Giá</th>
                  {selectedProducts.map((product) => (
                    <td key={product.id}>
                      {product.price.toLocaleString("vi-VN")} VND
                    </td>
                  ))}
                </tr>
                <tr>
                  <th>Giới tính</th>
                  {selectedProducts.map((product) => (
                    <td key={product.id}>{product.sex}</td>
                  ))}
                </tr>
                <tr>
                  <th>Danh mục</th>
                  {selectedProducts.map((product) => (
                    <td key={product.id}>{product.category}</td>
                  ))}
                </tr>

                <tr className="section-header">
                  <th colSpan={selectedProducts.length + 1}>Đặc điểm</th>
                </tr>
                <tr>
                  <th>Xuất xứ</th>
                  {selectedProducts.map((product) => (
                    <td key={product.id}>{product.origin}</td>
                  ))}
                </tr>
                <tr>
                  <th>Tuổi</th>
                  {selectedProducts.map((product) => (
                    <td key={product.id}>{product.age}</td>
                  ))}
                </tr>
                <tr>
                  <th>Kích thước</th>
                  {selectedProducts.map((product) => (
                    <td key={product.id}>{product.size}</td>
                  ))}
                </tr>
                <tr>
                  <th>Giống</th>
                  {selectedProducts.map((product) => (
                    <td key={product.id}>{product.species}</td>
                  ))}
                </tr>
                <tr>
                  <th>Tính cách</th>
                  {selectedProducts.map((product) => (
                    <td key={product.id}>{product.personality}</td>
                  ))}
                </tr>

                <tr className="section-header">
                  <th colSpan={selectedProducts.length + 1}>
                    Yêu cầu chăm sóc
                  </th>
                </tr>
                <tr>
                  <th>Lượng thức ăn</th>
                  {selectedProducts.map((product) => (
                    <td key={product.id}>{product.foodAmount}</td>
                  ))}
                </tr>
                <tr>
                  <th>Nhiệt độ nước</th>
                  {selectedProducts.map((product) => (
                    <td key={product.id}>{product.waterTemp}</td>
                  ))}
                </tr>
                <tr>
                  <th>Độ cứng nước</th>
                  {selectedProducts.map((product) => (
                    <td key={product.id}>{product.mineralContent}</td>
                  ))}
                </tr>
                <tr>
                  <th>Độ pH</th>
                  {selectedProducts.map((product) => (
                    <td key={product.id}>{product.ph}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductComparison;
