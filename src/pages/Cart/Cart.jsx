import React, { useState, useEffect } from "react";
import { getCart, updateCartItem } from "../../services/CartService";
import { getProdItemById } from "../../services/ProductItemService";
import { Header } from "../../layouts/header/header";
import { Footer } from "../../layouts/footer/footer";
import "./Cart.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    setIsLoading(true);
    try {
      const response = await getCart();
      const { items } = response.data;
      setCart(response.data);

      const updatedItems = await Promise.all(
        items.map(async (item) => {
          const productResponse = await getProdItemById(item.productItemId);
          return { ...item, imageUrl: productResponse.data.imageUrl };
        })
      );

      setCartItems(updatedItems);
    } catch (error) {
      toast.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuantityChange = async (cartId, item, newQuantity) => {
    if (newQuantity === 0 && !window.confirm("Are you sure you want to remove this item from the cart?")) return;

    try {
      const response = await updateCartItem(cartId, item.productItemId, newQuantity);
      if (response.statusCode == 200) {
        if (newQuantity === 0) {
          setCartItems((prevItems) => prevItems.filter((i) => i.productItemId !== item.productItemId));
          //Linq: Where(item => item.productItemId !== productItemId)
          toast.success(`Item ${item.productName} removed from cart`);
        } else {
          setCartItems((prevItems) =>
            prevItems.map((i) =>
              i.productItemId === item.productItemId
                ? { ...i, quantity: newQuantity } : i
            )
          );
        }
      } else {
        toast.error(response.data.messageError);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const calculateTotal = () => {
    return cartItems
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toLocaleString();
  };

  const handleCheckout = () => {
    navigate("/order");
  };

  const handleContinue = () => {
    navigate("/product");
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <Header />
      <div className="cart-container">
        <main className="cart-content animated user-select-none">
          <h1 className="cart-title">Your Shopping Cart</h1>
          <div className="cart-grid">
            {cartItems.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              <>
                <table className="cart-table">
                  <thead>
                    <tr>
                      <th></th>
                      <th>Product Name</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item) => (
                      <tr key={item.productItemId}>
                        <td>
                          <img
                            src={item.imageUrl}
                            alt={item.productName}
                            className="product-image"
                          />
                        </td>
                        <td style={{ fontWeight: "bold" }}>
                          {item.productName}
                        </td>
                        <td className="price">
                          {item.price.toLocaleString()} VND
                        </td>
                        <td>
                          <div className="quantity-control">
                            <button
                              className="quantity-btn"
                              onClick={() =>
                                handleQuantityChange(
                                  cart.cartId,
                                  item,
                                  item.quantity - 1
                                )
                              }
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) =>
                                handleQuantityChange(
                                  cart.cartId,
                                  item,
                                  parseInt(e.target.value)
                                )
                              }
                              className="quantity-input"
                              readOnly
                            />
                            <button
                              className="quantity-btn"
                              onClick={() =>
                                handleQuantityChange(
                                  cart.cartId,
                                  item,
                                  item.quantity + 1
                                )
                              }
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="price">
                          {(item.price * item.quantity).toLocaleString()} VND
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="order-summary">
                  <h2>Order Summary</h2>
                  <p>
                    Shipping: <span>Free</span>
                  </p>
                  <p>
                    VAT: <span>Not applicable</span>
                  </p>
                  <h3>Total: {calculateTotal()} VND</h3>
                  <div className="order-actions">
                    <button className="checkout-btn" onClick={handleCheckout}>
                      Proceed to Checkout
                    </button>
                    <button className="continue-btn" onClick={handleContinue}>
                      Continue Shopping
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default Cart;
