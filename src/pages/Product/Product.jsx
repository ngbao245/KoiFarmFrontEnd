import { useEffect, useState } from "react";
import { Header } from "../../layouts/header/header";
import "./Product.css";
import "../../styles/animation.css";
import { fetchAllProducts } from "../../services/ProductService";
import { toast } from "react-toastify";
import { Footer } from "../../layouts/footer/footer";
import defaultImage from "../../../public/assets/post2.jpg";
import { useNavigate } from "react-router-dom";
import { getProdItemByProdId } from "../../services/ProductItemService";

const Product = () => {
  const [listProducts, setListProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    setIsLoading(true);
    try {
      const response = await fetchAllProducts();
      if (response?.data) {
        // Xử lý từng sản phẩm một cách tuần tự
        const productsWithApprovedCount = [];
        
        for (const product of response.data) {
          try {
            const itemsResponse = await getProdItemByProdId(product.id);
            if (itemsResponse?.data) {
              const approvedItems = itemsResponse.data.filter(
                (item) => item.type === "Approved"
              );
              const totalQuantity = approvedItems.reduce(
                (sum, item) => sum + (item.quantity || 0), 
                0
              );
              productsWithApprovedCount.push({
                ...product,
                quantity: totalQuantity,
                approvedItems: approvedItems // Lưu danh sách items đã approved
              });
            }
          } catch (error) {
            console.warn(`Failed to fetch items for product ${product.id}:`, error);
            // Vẫn thêm sản phẩm vào danh sách nhưng với quantity = 0
            productsWithApprovedCount.push({
              ...product,
              quantity: 0,
              approvedItems: []
            });
          }
        }
        
        setListProducts(productsWithApprovedCount);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductClick = (product) => {
    if (!product.approvedItems?.length) {
      toast.info("Sản phẩm này hiện không có hàng");
      return;
    }

    navigate(`/koi/${product.name.toLowerCase().replace(/\s+/g, "")}`, {
      state: { 
        response: product.approvedItems, 
        productName: product.name 
      },
    });
  };

  return (
    <>
      <Header />
      <div className="product-container">
        <main className="product-content animated">
          <h1 className="product-title">SẢN PHẨM CỦA CHÚNG TÔI</h1>
          {isLoading ? (
            <div className="loading-spinner"></div>
          ) : (
            <div className="product-grid">
              {listProducts.length > 0 ? (
                listProducts.map((product) => (
                  <div
                    key={product.id}
                    className={`product-card ${!product.quantity ? 'out-of-stock' : ''}`}
                    onClick={() => handleProductClick(product)}
                  >
                    <div className="product-image-container">
                      <img
                        src={product.imageUrl || defaultImage}
                        alt={product.name}
                        className="product-image"
                        onError={(e) => {
                          e.target.src = defaultImage;
                        }}
                      />
                    </div>
                    <div className="product-info">
                      <h2 className="product-name">{product.name}</h2>
                      <p className="product-quantity">
                        Số lượng: {product.quantity || 0}
                      </p>
                      <button className="product-button">
                        {product.quantity ? 'Xem chi tiết' : 'Hết hàng'}
                      </button>
                    </div>
                    {product.description && (
                      <div className="product-overlay">
                        <p className="product-description">
                          {product.description}
                        </p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="no-products">Không có sản phẩm nào</p>
              )}
            </div>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
};

export default Product;
