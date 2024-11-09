import React, { useState, useEffect } from 'react';
import './ModalAddProductItem.css';
import { createProdItem } from '../services/ProductItemService'
import { toast } from 'react-toastify';
import { fetchAllProducts } from "../services/ProductService";
import { uploadImageCloudinary } from '../services/CloudinaryService';

const folder = import.meta.env.VITE_FOLDER_PRODUCTS;

const ModalAddProductItem = ({ isOpen, onClose, onSubmit, setIsUploading }) => {
  const [formData, setFormData] = useState({
    name: '', price: 1, category: '', origin: '', sex: '', age: 0,
    size: '', species: '', personality: '', foodAmount: '', waterTemp: '',
    mineralContent: '', ph: '', imageUrl: '', quantity: 1, type: 'Pending Approval', productId: ''
  });

  const [products, setProducts] = useState([]);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const fetchProducts = async () => {
        try {
          const response = await fetchAllProducts();
          if (response && response.data) {
            setProducts(response.data);
          } else {
            toast.error("Failed to fetch products.");
          }
        } catch (error) {
          toast.error("Error fetching products.");
        }
      };
      fetchProducts();
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: ['price', 'age', 'quantity'].includes(name) ? Number(value) : value
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
    if (!imageFile) return null;
    setIsLoading(true);
    setIsUploading(true);
    try {
      const response = await uploadImageCloudinary(imageFile, folder);
      return response.secure_url;
    } catch (error) {
      toast.error('Image upload failed.');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.price < 10000) {
      toast.error('Price must be at least 10,000');
      return;
    }

    setIsLoading(true);
    onClose();

    try {
      const uploadedImageUrl = await uploadImage();
      if (uploadedImageUrl) {
        const productData = { ...formData, imageUrl: uploadedImageUrl };

        const res = await createProdItem(productData);

        if (res && res.data && res.data.productId) {
          toast.success('Product created successfully!');
          setFormData({
            name: '', price: 10000, category: '', origin: '', sex: '', age: 0,
            size: '', species: '', personality: '', foodAmount: '', waterTemp: '',
            mineralContent: '', ph: '', imageUrl: '', quantity: 1, type: 'Pending Approval', productId: ''
          });
          onSubmit(res.data);
          onClose();
        } else {
          toast.error('Error while creating the product.');
        } 
      } else {
        toast.error('Please upload an image.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className={`modal-content ${isLoading ? "blurred" : ""}`}>
        <div className="modal-header">
          <h2>Thêm mặt hàng sản phẩm mới</h2>
          <button className="modal-close-button" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-layout">
            <div className="form-column">
              <div className="form-group">
                <h3>Thông Tin Cơ Bản</h3>
                <label htmlFor="name">Tên:</label>
                <input id="name" name="name" value={formData.name} onChange={handleChange} required />

                <label htmlFor="price">Giá:</label>
                <input id="price" type="number" name="price" value={formData.price} onChange={handleChange} required />

                <label htmlFor="category">Danh Mục:</label>
                <input id="category" name="category" value={formData.category} onChange={handleChange} required />

                <label htmlFor="quantity">Số Lượng:</label>
                <input id="quantity" type="number" name="quantity" value={formData.quantity} onChange={handleChange} required />

                <label htmlFor="productId">Sản Phẩm:</label>
                <select id="productId" name="productId" value={formData.productId} onChange={handleChange} required>
                  <option value="">-- Select Product --</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <h3>Chi Tiết Động Vật</h3>
                <label htmlFor="species">Loài:</label>
                <input id="species" name="species" value={formData.species} onChange={handleChange} required />

                <label htmlFor="origin">Nguồn Gốc:</label>
                <input id="origin" name="origin" value={formData.origin} onChange={handleChange} required />

                <label htmlFor="sex">Giới Tính:</label>
                <input id="sex" name="sex" value={formData.sex} onChange={handleChange} required />

                <label htmlFor="age">Tuổi:</label>
                <input id="age" type="number" name="age" value={formData.age} onChange={handleChange} required />

                <label htmlFor="size">Kích Thước:</label>
                <input id="size" name="size" value={formData.size} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-column">
              <div className="form-group">
                <h3>Yêu Cầu Chăm Sóc</h3>
                <label htmlFor="foodAmount">Lượng Thức Ăn:</label>
                <input id="foodAmount" name="foodAmount" value={formData.foodAmount} onChange={handleChange} required />

                <label htmlFor="waterTemp">Nhiệt Độ Nước:</label>
                <input id="waterTemp" name="waterTemp" value={formData.waterTemp} onChange={handleChange} required />

                <label htmlFor="mineralContent">Hàm Lượng Khoáng Chất:</label>
                <input id="mineralContent" name="mineralContent" value={formData.mineralContent} onChange={handleChange} required />

                <label htmlFor="ph">Độ pH:</label>
                <input id="ph" name="ph" value={formData.ph} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <h3>Chi Tiết Bổ Sung</h3>
                <label htmlFor="personality">Tính Cách:</label>
                <input id="personality" name="personality" value={formData.personality} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <h3>Tải Ảnh Lên</h3>
                <label htmlFor="imageUrl">Chọn ảnh:</label>
                <input
                  id="imageUrl"
                  name="imageUrl"
                  type="file"
                  accept="image/png, image/jpg, image/jpeg"
                  onChange={handleImageChange}
                  required
                  className="text-dark"
                />
                {imagePreview && (
                  <img src={imagePreview} alt="Preview" style={{ width: '100%', height: 'auto', marginTop: '10px' }} />
                )}
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="cancel-button" onClick={onClose} disabled={isLoading}>Hủy</button>
            <button type="submit" className="submit-button" disabled={isLoading}>
              {isLoading ? "Đang Thêm..." : "Thêm sản phẩm"}
            </button>
          </div>
        </form>
        {isLoading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <p>Đang tải ảnh lên và tạo product...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalAddProductItem;
