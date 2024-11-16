import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "../../layouts/header/header";
import { Footer } from "../../layouts/footer/footer";
import { fetchBatchById } from "../../services/BatchService";
import { getProdItemByBatch } from "../../services/ProductItemService";
import FishSpinner from "../../components/FishSpinner";
import { addBatchToCart } from "../../services/CartService";
import { toast } from "react-toastify";
import { getUserInfo } from "../../services/UserService";
import "./BatchDetail.css";

const BatchDetail = () => {
  const { id } = useParams();
  const [batch, setBatch] = useState(null);
  const [fishList, setFishList] = useState([]);
  const [selectedFish, setSelectedFish] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch batch details
        const batchResponse = await fetchBatchById(id);
        if (batchResponse.data) {
          setBatch(batchResponse.data);

          // Fetch fish in batch
          const fishResponse = await getProdItemByBatch(id);
          if (fishResponse.data) {
            const approvedFish = fishResponse.data.filter(fish => fish.type === "Approved");
            setFishList(approvedFish);
            if (approvedFish.length > 0) {
              setSelectedFish(approvedFish[0]);
            }
          }
        } else {
          navigate("/*");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        navigate("/batches");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleAddToCart = async () => {
    try {
      await addBatchToCart(batch.id);
      toast.success(`Đã thêm ${batch.name} vào giỏ hàng`);
    } catch (error) {
      if (error.message.includes("No token")) {
        toast.error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng của bạn");
        navigate("/login");
      } else {
        toast.error(error.message || "Có lỗi xảy ra");
      }
    }
  };

  const handleQuickBuy = async () => {
    try {
      await addBatchToCart(batch.id);
      const userResponse = await getUserInfo();
      const userData = userResponse.data;

      if (!userData.address || !userData.phone) {
        navigate(`/${userData.id}/detail?fromCart=true`);
        return;
      }
      navigate("/order");
    } catch (error) {
      if (error.message.includes("No token")) {
        toast.error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng của bạn");
        navigate("/login");
      } else {
        toast.error(error.message || "Có lỗi xảy ra");
      }
    }
  };

  if (loading || !batch) {
    return <FishSpinner />;
  }

  const handleFishSelect = (fish) => {
    setSelectedFish(fish);
  };

  const handleViewFishDetail = (fishId) => {
    navigate(`/koi/${batch.name.toLowerCase().replace(/\s+/g, "")}/${fishId}`);
  };

  return (
    <>
      <Header />
      <div className="batch-detail-page animated">
        <div className="batch-detail-container">
          <div className="batch-detail-header">
            <h1 className="batch-detail-title">{batch.name}</h1>
            <p className="batch-detail-price">
              Giá lô: {batch.price?.toLocaleString("vi-VN")} VND
            </p>
          </div>

          <div className="batch-detail-content">
            <div className="batch-info-section">
              <div className="batch-main-image">
                <img
                  src={batch.imageUrl || "default-batch-image.jpg"}
                  alt={batch.name}
                />
              </div>
              <div className="batch-info">
                <h2>Thông tin lô</h2>
                <ul>
                  <li>Số lượng cá: {fishList.length}</li>
                  <li>Mô tả: {batch.description || "Không có mô tả"}</li>
                </ul>
                <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                  <button
                    style={{
                      marginTop : "50px",
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
                      marginTop : "50px",
                      padding: "10px",
                      backgroundColor: "#0056b3",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                    onClick={handleAddToCart}
                  >
                    Thêm vào Giỏ
                  </button>
                </div>
              </div>
            </div>

            <div className="batch-fish-section">
              <h2>Danh sách cá trong lô</h2>
              <div className="fish-list">
                {fishList.length > 0 ? (
                  fishList.map((fish) => (
                    <div
                      key={fish.id}
                      className={`fish-card ${selectedFish?.id === fish.id ? "selected" : ""
                        }`}
                      onClick={() => handleFishSelect(fish)}
                    >
                      <img src={fish.imageUrl} alt={fish.name} />
                      <div className="fish-card-info">
                        <h3>{fish.name}</h3>
                        <p>{fish.price?.toLocaleString("vi-VN")} VND</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="no-fish-message">Chưa có cá trong lô này</p>
                )}
              </div>

              {selectedFish && (
                <div className="selected-fish-details">
                  <h2>Chi tiết cá đã chọn</h2>
                  <div className="selected-fish-content">
                    <img src={selectedFish.imageUrl} alt={selectedFish.name} />
                    <div className="selected-fish-info">
                      <h3>{selectedFish.name}</h3>
                      <p className="fish-price">
                        {selectedFish.price?.toLocaleString("vi-VN")} VND
                      </p>
                      <ul>
                        <li>Giới tính: {selectedFish.sex}</li>
                        <li>Tuổi: {selectedFish.age} tuổi</li>
                        <li>Kích thước: {selectedFish.size}</li>
                        <li>Giống: {selectedFish.species}</li>
                      </ul>
                      <button
                        className="view-detail-btn"
                        onClick={() => handleViewFishDetail(selectedFish.id)}
                      >
                        Xem chi tiết cá
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BatchDetail; 