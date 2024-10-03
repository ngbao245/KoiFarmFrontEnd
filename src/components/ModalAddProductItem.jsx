import React, { useState } from 'react';
import './ModalAddProductItem.css';

const ModalAddProductItem = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '', price: 0, category: '', origin: '', sex: '', age: 0,
    size: '', species: '', personality: '', foodAmount: '', waterTemp: '',
    mineralContent: '', ph: '', imageUrl: '', quantity: 1, type: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: ['price', 'age', 'quantity'].includes(name) ? Number(value) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add New Product Item</h2>
          <button className="modal-close-button" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-layout">
            <div className="form-column">
              <div className="form-group">
                <h3>Basic Information</h3>
                <label htmlFor="name">Name:</label>
                <input id="name" name="name" value={formData.name} onChange={handleChange} required />
                
                <label htmlFor="price">Price:</label>
                <input id="price" type="number" name="price" value={formData.price} onChange={handleChange} required />
                
                <label htmlFor="category">Category:</label>
                <input id="category" name="category" value={formData.category} onChange={handleChange} required />
                
                <label htmlFor="type">Type:</label>
                <input id="type" name="type" value={formData.type} onChange={handleChange} required />
                
                <label htmlFor="quantity">Quantity:</label>
                <input id="quantity" type="number" name="quantity" value={formData.quantity} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <h3>Animal Details</h3>
                <label htmlFor="species">Species:</label>
                <input id="species" name="species" value={formData.species} onChange={handleChange} required />
                
                <label htmlFor="origin">Origin:</label>
                <input id="origin" name="origin" value={formData.origin} onChange={handleChange} required />
                
                <label htmlFor="sex">Sex:</label>
                <input id="sex" name="sex" value={formData.sex} onChange={handleChange} required />
                
                <label htmlFor="age">Age:</label>
                <input id="age" type="number" name="age" value={formData.age} onChange={handleChange} required />
                
                <label htmlFor="size">Size:</label>
                <input id="size" name="size" value={formData.size} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-column">
              <div className="form-group">
                <h3>Care Requirements</h3>
                <label htmlFor="foodAmount">Food Amount:</label>
                <input id="foodAmount" name="foodAmount" value={formData.foodAmount} onChange={handleChange} required />
                
                <label htmlFor="waterTemp">Water Temperature:</label>
                <input id="waterTemp" name="waterTemp" value={formData.waterTemp} onChange={handleChange} required />
                
                <label htmlFor="mineralContent">Mineral Content:</label>
                <input id="mineralContent" name="mineralContent" value={formData.mineralContent} onChange={handleChange} required />
                
                <label htmlFor="ph">pH:</label>
                <input id="ph" name="ph" value={formData.ph} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <h3>Additional Details</h3>
                <label htmlFor="personality">Personality:</label>
                <input id="personality" name="personality" value={formData.personality} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <h3>Image</h3>
                <label htmlFor="imageUrl">Image URL:</label>
                <input id="imageUrl" name="imageUrl" value={formData.imageUrl} onChange={handleChange} required />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="cancel-button" onClick={onClose}>Cancel</button>
            <button type="submit" className="submit-button">Add Product</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalAddProductItem;