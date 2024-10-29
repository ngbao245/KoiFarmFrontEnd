import { useState, useEffect } from "react";
import { Header } from "../../layouts/header/header";
import { Footer } from "../../layouts/footer/footer";
import { getAllProdItem } from "../../services/ProductItemService";

const ProductComparison = () => {
  const [productList, setProductList] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const response = await getAllProdItem();
        setProductList(response.data.entities || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchAllProducts();
  }, []);

  const handleSelectProduct = (product) => {
    setSelectedProducts((prevSelected) => [...prevSelected, product]);
  };

  const handleRemoveProduct = (productId) => {
    setSelectedProducts((prevSelected) =>
      prevSelected.filter((product) => product.id !== productId)
    );
  };

  return (
    <>
      <Header />
      <div style={{ padding: "50px" }}>
        <h2>Product Item Comparison</h2>
        <div style={{ display: "flex", gap: "20px" }}>
          {/* Product List */}
          <div style={{ flex: 1 }}>
            <h3>Choose Product Items</h3>
            {productList.length > 0 ? (
              productList
                .filter(
                  (product) =>
                    !selectedProducts.some(
                      (selectedProduct) => selectedProduct.id === product.id
                    )
                ) // Exclude selected products
                .map((product) => (
                  <div key={product.id} style={{ border: "1px solid #ccc", padding: "10px" }}>
                    <img src={product.imageUrl} alt={product.name} style={{ width: "100px" }} />
                    <p>{product.name}</p>
                    <button onClick={() => handleSelectProduct(product)}>Select</button>
                  </div>
                ))
            ) : (
              <p>Loading products...</p>
            )}
          </div>
          {/* Comparison Section */}
          <div style={{ flex: 2 }}>
            <h3>Selected Product Items</h3>
            {selectedProducts.length > 0 ? (
              <div style={{ display: "flex", gap: "20px" }}>
                {selectedProducts.map((product) => (
                  <div key={product.id} style={{ textAlign: "center" }}>
                    <img src={product.imageUrl} alt={product.name} style={{ width: "150px" }} />
                    <p>{product.name}</p>
                    <p>Giá: {product.price.toLocaleString("vi-VN")} VND</p>
                    <p>Giới tính: {product.sex}</p>
                    <p>Category: {product.category}</p>
                    <p>Origin: {product.origin}</p>
                    <p>Tuổi: {product.age}</p>
                    <p>Kích thước: {product.size}</p>
                    <p>Giống: {product.species}</p>
                    <p>Tính cách: {product.personality}</p>
                    <p>Lượng thức ăn: {product.foodAmount}</p>
                    <p>Nhiệt độ nước: {product.waterTemp}</p>
                    <p>Độ cứng nước: {product.mineralContent}</p>
                    <p>Độ pH: {product.ph}</p>
                    
                    {/* Remove button */}
                    <button onClick={() => handleRemoveProduct(product.id)}>Remove</button>
                  </div>
                ))}
              </div>
            ) : (
              <p>No product items selected for comparison.</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductComparison;
