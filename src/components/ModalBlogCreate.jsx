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
          toast.success("Blog created successfully!");
          setFormData({
            title: "",
            description: "",
            imageUrl: "",
          });

          setImageFile(null);
          setImagePreview(null);
          handleUpdate(response.data);
        } else {
          toast.error("Error while creating the blog.");
        }
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
          <h2>Add New Blog</h2>
          <button className="modal-close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title:</label>
            <input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="imageUrl">Choose file:</label>
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
              Cancel
            </button>
            <button
              type="submit"
              className="submit-button"
              disabled={isLoading}
            >
              {isLoading ? "Adding Blog..." : "Add Blog"}
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
