import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { createBlog } from '../services/BlogService'; // Make sure this service function is correctly set up

const ModalBlogCreate = ({ isOpen, onClose, handleUpdate }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await createBlog(formData);

      if (res && res.data && res.data.id) {
        toast.success('Blog created successfully!');
        setFormData({
          title: '',
          description: '',
          imageUrl: ''
        });

        handleUpdate(res.data); 
        onClose();
      } else {
        toast.error('Error while creating the blog.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
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
              Add Blog
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalBlogCreate;
