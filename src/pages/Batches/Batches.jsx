import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../../layouts/header/header";
import { Footer } from "../../layouts/footer/footer";
import { fetchAllBatchs } from "../../services/BatchService";
import './Batches.css';

const Batches = () => {
  const navigate = useNavigate();
  const [batches, setBatches] = useState([]);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const response = await fetchAllBatchs();
        if (response && response.data) {
          setBatches(response.data);
        }
      } catch (error) {
        console.error("Error fetching batches:", error);
      }
    };
    fetchBatches();
  }, []);

  const handleViewBatchDetails = (batchId) => {
    navigate(`/batches/${batchId}`);
  };

  return (
    <>
      <Header />
      <div className="batch-page">
        <div className="batch-container animated user-select-none">
          {batches && batches.length > 0 && (
            <h1 className="batch-heading">Danh sách Lô Cá</h1>
          )}
          
          {(!batches || batches.length === 0) ? (
            <div className="batch-empty-state-container">
              <div className="batch-empty-state-icon">🎏</div>
              <h2 className="batch-empty-state-heading">Không có lô cá nào</h2>
              <p className="batch-empty-state-message">
                Hiện tại chưa có lô cá nào được đăng bán.
                Vui lòng quay lại sau.
              </p>
              <button 
                onClick={() => navigate('/')}
                className="batch-empty-state-button"
              >
                Quay về trang chủ
              </button>
            </div>
          ) : (
            <div className="batch-items-grid">
              {batches.map((batch) => (
                <div key={batch.id} className="batch-item-card">
                  <div className="batch-item-image-wrapper">
                    <img
                      src={batch.imageUrl || "default-batch-image.jpg"}
                      alt={batch.name}
                      className="batch-item-image"
                    />
                  </div>
                  <div className="batch-item-content">
                    <h3 className="batch-item-name">{batch.name}</h3>
                    <p className="batch-item-price">
                      {batch.price?.toLocaleString('vi-VN')} VND
                    </p>
                    <div className="batch-item-specs">
                      <p>Số lượng cá: {batch.quantity || 0}</p>
                    </div>
                    <div className="batch-item-actions">
                      <button
                        onClick={() => handleViewBatchDetails(batch.id)}
                        className="batch-view-btn"
                      >
                        Xem chi tiết lô
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

export default Batches; 