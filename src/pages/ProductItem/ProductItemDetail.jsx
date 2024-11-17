import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "../../layouts/header/header";
import { Footer } from "../../layouts/footer/footer";
import { getProdItemById } from "../../services/ProductItemService";
import { addToCart } from "../../services/CartService";
import { toast } from "react-toastify";
import Reviews from "../../components/ReviewSection";
import { getUserInfo } from "../../services/UserService";
import FishSpinner from "../../components/FishSpinner";
import { getCertificateByProductItem } from "../../services/CertificateService";

const ProductItemDetail = () => {
  const { id } = useParams();
  const [productItem, setProductItem] = useState(null);
  const navigate = useNavigate();
  const [certificates, setCertificates] = useState([]);
  const [isLoadingCertificates, setIsLoadingCertificates] = useState(false);


  const fetchCertificates = async (productItemId) => {
    try {
      setIsLoadingCertificates(true);
      const response = await getCertificateByProductItem(productItemId);
      if (response.data) {
        setCertificates(response.data);
      }
    } catch (error) {
      console.error("Error fetching certificates:", error);
      toast.error("Không thể tải danh sách chứng chỉ.");
    } finally {
      setIsLoadingCertificates(false);
    }
  };

  useEffect(() => {
    const fetchProductItem = async () => {
      try {
        const response = await getProdItemById(id);
        if (response.data.type === "Approved" && response.data.quantity > 0) {
          setProductItem(response.data);
          fetchCertificates(id);
        } else {
          toast.error("Sản phẩm này đã hết hàng");
          navigate(-1);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        navigate("/");
      }
    };

    fetchProductItem();
  }, [id, navigate]);

  if (!productItem) {
    return <FishSpinner />;
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
      if (response.data && response.data.cartId) {
        toast.success(`Đã thêm ${productItem.name} vào giỏ hàng`);
      } else {
        toast.error("Sản phẩm đã hết hàng");
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const handleQuickBuy = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng của bạn");
      navigate("/login");
      return;
    }

    try {
      const response = await addToCart(1, productItem.id, token);
      if (response.data && response.data.cartId) {
        const userResponse = await getUserInfo();
        const userData = userResponse.data;

        if (!userData.address || !userData.phone) {
          navigate(`/${userData.id}/detail?fromCart=true`);
          return;
        }
        navigate("/order");
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
        className="animated"
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
            Giá: {productItem.price.toLocaleString("vi-VN")} VND
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
              onClick={handleQuickBuy}
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

      <div style={{ margin: "50px" }}>
        <h2>Chứng chỉ liên quan</h2>
        {isLoadingCertificates ? (
          <FishSpinner />
        ) : certificates.length > 0 ? (
          <ul>
            {certificates.map((cert) => (
              <li key={cert.certificateId} style={{ marginBottom: "20px" }}>
                <strong>Tên chứng chỉ:</strong> {cert.certificateName} <br />
                <strong>Nhà cung cấp:</strong> {cert.provider} <br />
                <strong>Ngày phát hành:</strong>{" "}
                {new Date(cert.createdTime).toLocaleDateString("vi-VN")} <br />
                <strong>Hình ảnh:</strong>
                <div>
                  <img
                    src={cert.imageUrl}
                    alt={cert.certificateName}
                    style={{ width: "200px", borderRadius: "8px", marginTop: "10px" }}
                  />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>Không có chứng chỉ nào được liên kết với sản phẩm này.</p>
        )}
      </div>

      <Reviews productItemId={id} />

      <Footer />
    </>
  );
};

export default ProductItemDetail;
