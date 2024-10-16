import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "../../layouts/header/header";
import { Footer } from "../../layouts/footer/footer";
import { getProdItemById } from "../../services/ProductItemService";
import { addToCart } from "../../services/CartService";
import { toast } from "react-toastify";
import Reviews from "../../components/ReviewSection";

const ProductItemDetail = () => {
  const { id } = useParams();
  const [productItem, setProductItem] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductItem = async () => {
      try {
        const response = await getProdItemById(id);
        setProductItem(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProductItem();
  }, [id]);

  if (!productItem) {
    return <div>Loading...</div>;
  }

  const handleAddToCart = async (quantity, itemId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng của bạn");
      navigate("/login");
      return;
    }

    try {
      const response = await addToCart(quantity, itemId, token);
      console.log(response);
      if (response.data && response.data.cartId) {
        toast.success(`Đã thêm ${productItem.name} vào giỏ hàng`);
      } else {
        toast.error("Sản phẩm đã hết hàng");
      }
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <>
      <Header />
      <div
        style={{
          padding: "50px",
          display: "flex",
          gap: "20px",
          marginLeft: 300,
        }}
      >
        <div style={{ width: "50%" }}>
          <img
            src={productItem.imageUrl}
            alt={productItem.name}
            style={{ width: "40%", borderRadius: "8px" }}
          />
        </div>
        <div style={{ width: "50%" }}>
          <h1>Tên: {productItem.name}</h1>
          <p
            style={{
              color: "red",
              fontSize: 30,
            }}
          >
            Giá: {productItem.price} VND
          </p>
          <ul>
            <li>Giới tính: {productItem.sex}</li>
            <li>Tuổi: {productItem.age} tuổi</li>
            <li>Kích thước: {productItem.size}</li>
            <li>Giống: {productItem.species}</li>
            <li>Tính cách: {productItem.personality}</li>
            <li>Lượng thức ăn: {productItem.foodAmount}</li>
            <li>Nhiệt độ nước: {productItem.waterTemp}</li>
            <li>Độ cứng nước: {productItem.mineralContent}</li>
            <li>Độ pH: {productItem.ph}</li>
          </ul>
          <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
            <button
              style={{
                padding: "10px",
                backgroundColor: "#C70025",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Đặt Mua Nhanh
            </button>
            <button
              style={{
                padding: "10px",
                backgroundColor: "#0056b3",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              onClick={() => {
                handleAddToCart(1, productItem.id);
              }}
            >
              Thêm vào Giỏ
            </button>
          </div>
        </div>
      </div>

      <Reviews productItemId={id} />

      <Footer />
    </>
  );
};

export default ProductItemDetail;
