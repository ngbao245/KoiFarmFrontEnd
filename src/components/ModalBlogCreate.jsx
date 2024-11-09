import React, { useState } from "react";
import { toast } from "react-toastify";
import { createBlog } from "../services/BlogService";
import "./ModalBlogCreate.css";
import { uploadImageCloudinary } from "../services/CloudinaryService";

const folder = import.meta.env.VITE_FOLDER_BLOG;

const ModalBlogCreate = ({ isOpen, onClose, handleUpdate, setIsUploading }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
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

  const uploadImage = async () => {
    setIsLoading(true);
    setIsUploading(true);
    try {
      if (imageFile) {
        const response = await uploadImageCloudinary(imageFile, folder);
        return response.secure_url;
      }
    } catch (error) {
      console.error("Image upload failed:", error);
      toast.error("Image upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    onClose();

    try {
      const uploadedImageUrl = await uploadImage();
      if (uploadedImageUrl) {
        const newBlogData = { ...formData, imageUrl: uploadedImageUrl };
        const response = await createBlog(newBlogData);

        if (response && response.data && response.data.id) {
          toast.success("Tạo bài viết thành công!");
          setFormData({
            title: "",
            description: "",
            imageUrl: "",
          });

          setImageFile(null);
          setImagePreview(null);
          handleUpdate(response.data);
        } else {
          toast.error("Có lỗi xảy ra khi tạo bài viết.");
        }
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className={`modal-content ${isLoading ? "blurred" : ""}`}>
        <div className="modal-header">
          <h2>Thêm Bài Viết Mới</h2>
          <button className="modal-close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Tiêu đề:</label>
            <input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="contact-form-group form-group">
            <label htmlFor="description">Nội dung:</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="imageUrl">Chọn ảnh:</label>
            <input
              id="imageUrl"
              name="imageUrl"
              type="file"
              accept="image/png, image/jpg, image/jpeg"
              onChange={handleImageChange}
              className="text-dark"
              required
            />
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="w-100" />
            )}
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="cancel-button"
              onClick={onClose}
              disabled={isLoading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="submit-button"
              disabled={isLoading}
            >
              {isLoading ? "Đang thêm bài viết..." : "Thêm bài viết"}
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

export default ModalBlogCreate;
