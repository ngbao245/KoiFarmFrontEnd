import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { createBatch } from "../services/BatchService";
import { uploadImageCloudinary } from "../services/CloudinaryService";
import "./ModalBatch.css";

const folder = import.meta.env.VITE_FOLDER_BATCH;

const ModalBatchCreate = ({ isOpen, onClose, handleUpdate, setIsUploading }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrl: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Vui lòng nhập tên lô hàng!");
      return;
    }

    try {
      setIsLoading(true);
      setIsUploading(true);

      let imageUrl = "";
      if (imageFile) {
        const uploadResponse = await uploadImageCloudinary(imageFile, folder);
        imageUrl = uploadResponse.secure_url;
      }

      const response = await createBatch({
        ...formData,
        imageUrl: imageUrl
      });
      
      if (response?.data) {
        console.log("New batch data:", response.data);
        handleUpdate(response.data);
        toast.success("Tạo lô hàng thành công!");
        handleClose();
      }
    } catch (error) {
      console.error("Error creating batch:", error);
      toast.error("Không thể tạo lô hàng.");
    } finally {
      setIsLoading(false);
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      description: "",
      imageUrl: "",
    });
    setImageFile(null);
    setImagePreview(null);
    onClose();
  };

  return (
    <Modal show={isOpen} onHide={handleClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Tạo Lô Hàng Mới</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <div className="batch-form-group">
            <label>Tên lô hàng</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="batch-form-group">
            <label>Mô tả</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="3"
              className="form-control"
            />
          </div>
          <div className="batch-form-group">
            <label>Hình ảnh</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="form-control"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-2"
                style={{ maxWidth: "100%", height: "auto" }}
              />
            )}
          </div>
          <div className="batch-modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
              disabled={isLoading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? "Đang tạo..." : "Tạo lô hàng"}
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default ModalBatchCreate; 