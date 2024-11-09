import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { uploadImageCloudinary } from "../services/CloudinaryService";

const folder = import.meta.env.VITE_FOLDER_BLOG;

const ModalBlogUpdate = ({ isOpen, onClose, onSubmit, blogData, setIsUploading }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (blogData) {
      setFormData(blogData);
      if (blogData.imageUrl) {
        setImagePreview(blogData.imageUrl);
      }
    }
  }, [blogData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return formData.imageUrl;
    setIsUploading(true);
    try {
      const response = await uploadImageCloudinary(imageFile, folder);
      return response.secure_url;
    } catch (error) {
      console.error("Image upload failed:", error);
      toast.error("Image upload failed. Please try again.");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      toast.error("Title and description are required!");
      return;
    }

    setIsLoading(true);
    setIsUploading(true);
    onClose();

    const uploadedImageUrl = await uploadImage();
    if (uploadedImageUrl) {
      await onSubmit({ ...formData, imageUrl: uploadedImageUrl });
    }

    setIsLoading(false);
    setIsUploading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className={`modal-content ${isLoading ? "blurred" : ""}`}>
        <div className="modal-header">
          <h2>Cập Nhật Bài Viết</h2>
          <button className="modal-close-button" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Tiêu Đề:</label>
            <input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="blog-form-group contact-form-group form-group">
            <label htmlFor="description">Mô Tả:</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="imageUrl">Chọn Ảnh:</label>
            <input
              id="imageUrl"
              name="imageUrl"
              type="file"
              accept="image/png, image/jpg, image/jpeg"
              onChange={handleImageChange}
              className="text-dark"
            />
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="w-100" />
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="cancel-button" onClick={onClose}>Hủy</button>
            <button type="submit" className="submit-button" disabled={isLoading}>
              {isLoading ? "Đang Cập Nhật..." : "Cập Nhật"}
            </button>
          </div>
        </form>
        {isLoading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <p>Đang cập nhật blog...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalBlogUpdate;
