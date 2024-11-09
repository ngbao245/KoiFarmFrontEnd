import React, { useState } from "react";
import { toast } from "react-toastify";
import { createPromotion } from "../services/PromotionService";

const folder = import.meta.env.VITE_FOLDER_BLOG;

const ModalPromotionCreate = ({ isOpen, onClose, handleUpdate, setIsUploading }) => {
  const [formData, setFormData] = useState({
    code: "",
    amount: "",
    type: "Direct",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    onClose();

    try {
      const newBlogData = { ...formData };
      const response = await createPromotion(newBlogData);

      if (response && response.data && response.data.id) {
        toast.success("Blog created successfully!");
        setFormData({
          code: "",
          amount: "",
          type: "",
        });

        handleUpdate(response.data);
      } else {
        toast.error("Mã đơn hàng đã tồn tại!");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className={`modal-content ${isLoading ? "blurred" : ""}`}>
        <div className="modal-header">
          <h2>Add New Promotion</h2>
          <button className="modal-close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="code">Code:</label>
            <input
              id="code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="amount">Giá Trị:</label>
            <input
              id="amount"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="type">Loại:</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="text-dark"
              required
            >
              <option value="">-- Chọn loại --</option>
              <option value="Direct">Trực Tiếp</option>
              <option value="Percentage">Phần Trăm</option>
            </select>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="cancel-button"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-button"
              disabled={isLoading}
            >
              {isLoading ? "Đang Thêm..." : "Thêm Khuyến mãi"}
            </button>
          </div>
        </form>
        {isLoading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <p>Đang tải ảnh lên và tạo blog...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalPromotionCreate;
