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
      if (response && response.data) {
        setListProducts(response.data);
      } else {
        toast.error("Unexpected data format received");
      }
    } catch (error) {
      toast.error("Error fetching products");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductClick = async (product) => {
    try {
      const response = await getProdItemByProdId(product.id);

      navigate(`/koi/${product.name.toLowerCase().replace(/\s+/g, "")}`, {
        state: { response: response.data, productName: product.name },
      });
    } catch (error) {
      console.error("Error fetching product item:", error);
    }
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
                    className="product-card"
                    onClick={() => handleProductClick(product)}
                  >
                    <div className="product-image-container">
                      <img
                        src={product.imageUrl || defaultImage}
                        alt={product.name}
                        className="product-image"
                      />
                    </div>
                    <div className="product-info">
                      <h2 className="product-name">{product.name}</h2>
                      <p className="product-quantity">
                        Quantity: {product.quantity}
                      </p>
                      <button className="product-button">Learn More</button>
                    </div>
                    <div className="product-overlay">
                      <p className="product-description">
                        {product.description}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-products">No products available</p>
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
