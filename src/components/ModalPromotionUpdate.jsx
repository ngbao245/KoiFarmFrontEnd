import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { uploadImageCloudinary } from "../services/CloudinaryService";

const folder = import.meta.env.VITE_FOLDER_BLOG;

const ModalPromotionUpdate = ({ isOpen, onClose, onSubmit, blogData, setIsUploading }) => {
  const [formData, setFormData] = useState({
    code: "",
    amount: "",
    type: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (blogData) {
      setFormData(blogData);
    }
  }, [blogData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

 
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.code || !formData.amount || !formData.type) {
      toast.error("code and amount are required!");
      return;
    }

    setIsLoading(true);
    setIsUploading(true);
    onClose();

    await onSubmit({ ...formData });
    

    setIsLoading(false);
    setIsUploading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className={`modal-content ${isLoading ? "blurred" : ""}`}>
        <div className="modal-header">
          <h2>Update Promotion</h2>
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
            <label htmlFor="amount">Amount:</label>
            <textarea
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="type">Type:</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="text-dark"
            >
              <option value="Direct">Direct</option>
              <option value="Percentage">Percentage</option>
            </select>
          </div>
          <div className="modal-footer">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="submit-button"
              disabled={isLoading}
            >
              {isLoading ? "Updating Promotion..." : "Update Promotion"}
            </button>
          </div>
        </form>
        {isLoading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <p>Updating Promotion...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalPromotionUpdate;
