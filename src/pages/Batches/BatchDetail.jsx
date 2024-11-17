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
import { getCertificateByProductItem } from "../../services/CertificateService";
import "./BatchDetail.css";

const BatchDetail = () => {
  const { id } = useParams();
  const [batch, setBatch] = useState(null);
  const [fishList, setFishList] = useState([]);
  const [selectedFish, setSelectedFish] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [showFishModal, setShowFishModal] = useState(false);
  const [selectedFishCertificates, setSelectedFishCertificates] = useState([]);
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const batchResponse = await fetchBatchById(id);
        if (batchResponse.data) {
          const allItemsSoldOut = batchResponse.data.items.every(item => item.quantity === 0);
          
          if (allItemsSoldOut) {
            toast.error("Lô hàng này đã hết hàng");
            navigate(-1); 
            return;
          }

          setBatch(batchResponse.data);

          const fishResponse = await getProdItemByBatch(id);
          if (fishResponse.data) {
            const approvedFish = fishResponse.data.filter(fish => 
              fish.type === "Approved" && fish.quantity > 0
            );
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
      const response = await addBatchToCart(batch.id);
      if (response.data && response.data.cartId) {
        toast.success(`Đã thêm ${batch.name} vào giỏ hàng`);
      } else {
        toast.error("Sản phẩm đã hết hàng");
      }
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
      const response = await addBatchToCart(batch.id);
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
      if (error.message.includes("No token")) {
        toast.error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng của bạn");
        navigate("/login");
      } else {
        toast.error(error.message || "Có lỗi xảy ra");
      }
    }
  };

  const fetchFishCertificates = async (fishId) => {
    try {
      const response = await getCertificateByProductItem(fishId);
      if (response.data) {
        setSelectedFishCertificates(response.data);
      }
    } catch (error) {
      console.error("Error fetching certificates:", error);
      toast.error("Không thể tải danh sách chứng chỉ.");
    }
  };

  const handleFishSelect = async (fish) => {
    setSelectedFish(fish);
    await fetchFishCertificates(fish.id);
  };

  const handleViewFishDetail = () => {
    setShowFishModal(true);
  };

  const CertificateModal = ({ certificates, onClose }) => {
    useEffect(() => {
      document.body.classList.add('body-no-scroll');
      return () => {
        document.body.classList.remove('body-no-scroll');
      };
    }, []);

    return (
      <div className="certificate-modal" onClick={onClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Chứng chỉ sản phẩm</h2>
            <button className="close-button" onClick={onClose}>&times;</button>
          </div>
          {certificates.length > 0 ? (
            <ul className="certificates-list">
              {certificates.map((cert) => (
                <li key={cert.certificateId} className="certificate-item">
                  <strong>Tên chứng chỉ:</strong> {cert.certificateName} <br />
                  <strong>Nhà cung cấp:</strong> {cert.provider} <br />
                  <strong>Ngày phát hành:</strong>{" "}
                  {new Date(cert.createdTime).toLocaleDateString("vi-VN")} <br />
                  <div>
                    <img
                      src={cert.imageUrl}
                      alt={cert.certificateName}
                      className="certificate-image"
                    />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>Không có chứng chỉ nào được liên kết với sản phẩm này.</p>
          )}
        </div>
      </div>
    );
  };

  const FishDetailModal = ({ fish, onClose }) => {
    useEffect(() => {
      document.body.classList.add('body-no-scroll');
      return () => {
        document.body.classList.remove('body-no-scroll');
      };
    }, []);

    return (
      <div className="fish-detail-modal" onClick={onClose}>
        <div className="fish-modal-content" onClick={e => e.stopPropagation()}>
          <div className="fish-modal-header">
            <h2>{fish.name}</h2>
            <button className="fish-close-button" onClick={onClose}>&times;</button>
          </div>
          <div className="fish-modal-body">
            <div className="fish-modal-image">
              <img src={fish.imageUrl} alt={fish.name} />
            </div>
            <div className="fish-modal-info">
              <p className="fish-modal-price">
                Giá: {fish.price?.toLocaleString("vi-VN")} VND
              </p>
              <ul>
                <li>Giới tính: {fish.sex}</li>
                <li>Tuổi: {fish.age} tuổi</li>
                <li>Kích thước: {fish.size}</li>
                <li>Giống: {fish.species}</li>
                <li>Tính cách: {fish.personality}</li>
                <li>Lượng thức ăn: {fish.foodAmount}</li>
                <li>Nhiệt độ nước: {fish.waterTemp}</li>
                <li>Độ cứng nước: {fish.mineralContent}</li>
                <li>Độ pH: {fish.ph}</li>
                <li>
                  {selectedFishCertificates.length > 0 ? (
                    <>
                      Chứng chỉ:{" "}
                      <button 
                        className="view-certificate-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowCertificateModal(true);
                        }}
                      >
                        Xem chi tiết {selectedFishCertificates.length > 0 ? `(${selectedFishCertificates.length})` : ''}
                      </button>
                    </>
                  ) : (
                    <>
                      Chứng chỉ: <span className="no-certificate">Không có chứng chỉ nào được liên kết với sản phẩm này</span>
                    </>
                  )}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading || !batch) {
    return <FishSpinner />;
  }

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
                <div className="batch-info-content">
                  <h2>Thông tin lô</h2>
                  <ul className="batch-info-list">
                    <li className="batch-info-item">
                      <span className="batch-info-label">Số lượng cá:</span>
                      <span className="batch-info-value">{fishList.length}</span>
                    </li>
                    <li className="batch-info-item">
                      <span className="batch-info-label">Mô tả:</span>
                      <span className="batch-info-value">
                        {batch.description || "Không có mô tả"}
                      </span>
                    </li>
                  </ul>
                </div>
                
                <div className="batch-action-buttons">
                  <button
                    className="quick-buy-btn"
                    onClick={handleQuickBuy}
                  >
                    Đặt Mua Nhanh
                  </button>
                  <button
                    className="add-cart-btn"
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
      
      {showFishModal && (
        <FishDetailModal 
          fish={selectedFish} 
          onClose={() => setShowFishModal(false)} 
        />
      )}

      {showCertificateModal && (
        <CertificateModal 
          certificates={selectedFishCertificates} 
          onClose={() => setShowCertificateModal(false)} 
        />
      )}
    </>
  );
};

export default BatchDetail; 