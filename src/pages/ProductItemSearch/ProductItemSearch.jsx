import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchAllProducts } from '../../services/ProductService';
import { getProdItemByProdId } from '../../services/ProductItemService';
import { Header } from '../../layouts/header/header';
import { Footer } from '../../layouts/footer/footer';
import './ProductItemSearch.css';

const ProductItemSearch = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allItems, setAllItems] = useState([]);
  const location = useLocation();
const navigate = useNavigate();

  const searchProductItems = useCallback(async (keyword) => {
    if (keyword) {
      setLoading(true);
      const filteredItems = allItems.filter(item =>
        item.name.toLowerCase().includes(keyword.toLowerCase()) ||
        item.productName.toLowerCase().includes(keyword.toLowerCase())
      );
      setSearchResults(filteredItems);
      setLoading(false);
    } else {
      setSearchResults([]);
    }
  }, [allItems]);

  useEffect(() => {
    const fetchAllItems = async () => {
      try {
        setLoading(true);
        const productsResponse = await fetchAllProducts();
        if (productsResponse && productsResponse.data) {
          const allProductItems = await Promise.all(
            productsResponse.data.map(async (product) => {
              const itemResponse = await getProdItemByProdId(product.id);
              return itemResponse.data.map(item => ({ ...item, productName: product.name }));
            })
          );
          const flattenedItems = allProductItems.flat();
          setAllItems(flattenedItems);
        }
      } catch (error) {
        console.error("Error fetching all product items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllItems();
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const keyword = searchParams.get('keyword');
    searchProductItems(keyword);
  }, [location.search, searchProductItems]);

  const handleProductItemClick = (productName, item) => {
    navigate(`/koi/${productName.toLowerCase().replace(/\s+/g, "")}`, {
      state: { response: [item], productName: productName },
    });
  };

  return (
    <>
      <Header />
      <div className="search-page">
        <div className="search-container">
          <h2>Kết quả tìm kiếm cho "{new URLSearchParams(location.search).get('keyword')}"</h2>
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Đang tải...</p>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="search-results-grid">
              {searchResults.map((item) => (
                <div key={item.id} className="search-result-item" onClick={() => handleProductItemClick(item.productName, item)}>
                  <div className="item-image">
                    <img src={item.imageUrl} alt={item.name} onError={(e) => {e.target.onerror = null; e.target.src='/path/to/placeholder-image.jpg'}} />
                  </div>
                  <div className="item-details">
                    <h3>{item.name}</h3>
                    <p className="product-name">Sản phẩm: {item.productName}</p>
                    <p className="price">Giá: {item.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                    <p className="size">Kích thước: {item.size} cm</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-results">Không tìm thấy kết quả phù hợp cho từ khóa này.</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductItemSearch;
