import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const ModalBlogUpdate = ({ isOpen, onClose, onSubmit, blogData }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
  });

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
    if (!formData.title || !formData.description || !formData.imageUrl) {
        toast.error('All fields are required!');
        return;
      }
  
      onSubmit(formData);
      onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Update Blog</h2>
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
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="imageUrl">Image URL:</label>
            <input
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              required
            />
          </div>
          <div className="modal-footer">
          <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-button">
              Update Blog
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalBlogUpdate;
