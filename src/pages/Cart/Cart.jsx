import React, { useState, useEffect } from "react";
import { getCart, updateCartItem } from "../../services/CartService";
import { getProdItemById } from "../../services/ProductItemService";
import "./Cart.css";
import { Header } from "../../layouts/header/header";
import { Footer } from "../../layouts/footer/footer";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getCart(); // Fetch cart items
      const { items } = response.data;

      // Fetch product details (like image URL) for each cart item
      const updatedItems = await Promise.all(
        items.map(async (item) => {
          const productResponse = await getProdItemById(item.productItemId);
          const productData = productResponse.data;
          return { ...item, imageUrl: productData.imageUrl }; // Assign image URL from product API
        })
      );

      setCartItems(updatedItems);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      setError("Failed to load cart items. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuantityChange = async (productItemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      await updateCartItem(productItemId, newQuantity); // Update quantity in cart
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.productItemId === productItemId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    } catch (error) {
      console.error("Error updating cart item:", error);
      alert("Failed to update cart. Please try again.");
    }
  };

  const calculateTotal = () => {
    return cartItems
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toLocaleString(); // Formats with commas
  };

  const handleCheckout = () => {
    console.log("Proceeding to checkout");
    // Implement checkout logic here
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <Header />
      <h1 className="text-center">Your Cart</h1>
      <div className="cart-container">
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <table className="cart-table">
              <thead>
                <tr>
                  <th className="product-header">Tên Sản Phẩm</th>
                  <th>Giá</th>
                  <th>Số Lượng</th>
                  <th>Tổng</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.productItemId}>
                    <td className="product-info">
                      <img
                        src={item.imageUrl}
                        alt={item.productName}
                        className="product-image"
                      />
                      <span>{item.productName}</span>
                    </td>
                    <td>{item.price.toLocaleString()} VND</td>
                    <td>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(
                            item.productItemId,
                            parseInt(e.target.value)
                          )
                        }
                        className="quantity-input"
                      />
                    </td>
                    <td>{(item.price * item.quantity).toLocaleString()} VND</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="order-summary">
              <h2>Đặt Hàng</h2>
              <p>
                Phí ship: <span>Free ship đơn hàng trên 1.500.000 VND</span>
              </p>
              <p>
                VAT: <span>Không tính phí</span>
              </p>
              <h3>Tổng: {calculateTotal()} VND</h3>
              <div className="order-actions">
                <button className="checkout-btn" onClick={handleCheckout}>
                  Tiến Hành Thanh Toán
                </button>
                <button className="continue-btn">Tiếp Tục Mua Hàng</button>
              </div>
            </div>
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Cart;
