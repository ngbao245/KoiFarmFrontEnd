import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { uploadImageCloudinary } from "../services/CloudinaryService";
import "./ModalBatch.css";

const folder = import.meta.env.VITE_FOLDER_BATCH;

const ModalBatchUpdate = ({
  isOpen,
  onClose,
  onSubmit,
  batchData,
  setIsUploading,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrl: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (batchData) {
      setFormData({
        name: batchData.name || "",
        description: batchData.description || "",
        imageUrl: batchData.imageUrl || "",
      });
      setImagePreview(batchData.imageUrl || null);
    }
  }, [batchData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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

      let imageUrl = formData.imageUrl;
      if (imageFile) {
        const uploadResponse = await uploadImageCloudinary(imageFile, folder);
        imageUrl = uploadResponse.secure_url;
      }

      await onSubmit({
        ...formData,
        imageUrl: imageUrl,
      });
      resetForm();
      onClose();
    } catch (error) {
      console.error("Error updating batch:", error);
      toast.error("Không thể cập nhật lô hàng.");
    } finally {
      setIsLoading(false);
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      imageUrl: "",
    });
    setImageFile(null);
    setImagePreview(null);
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal
      show={isOpen}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Cập Nhật Lô Hàng</Modal.Title>
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
              {isLoading ? "Đang cập nhật..." : "Cập nhật"}
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default ModalBatchUpdate;
