import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getCart } from "../../services/CartService";
import { createOrder } from "../../services/OrderService";
import { createPayment } from "../../services/PaymentService";
import { useNavigate } from "react-router-dom";
import { getProdItemById } from "../../services/ProductItemService";
import "./Order.css";

const Order = () => {
  const [cartData, setCartData] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [cartItemDetails, setCartItemDetails] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const cartResponse = await getCart();
        setCartData(cartResponse.data);

        if (cartResponse.data?.items) {
          const updatedItems = await Promise.all(
            cartResponse.data.items.map(async (item) => {
              try {
                const productResponse = await getProdItemById(
                  item.productItemId
                );
                return {
                  ...item,
                  imageUrl: productResponse.data.imageUrl,
                };
              } catch (error) {
                console.error(
                  `Error fetching product details for ${item.productItemId}:`,
                  error
                );
                return {
                  ...item,
                  imageUrl: "/default-product-image.png",
                };
              }
            })
          );
          setCartItemDetails(updatedItems);
        }
      } catch (error) {
        console.error("Error fetching cart data:", error);
        toast.error("Failed to fetch cart data.");
      }
    };

    fetchCartData();
  }, []);

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handleCreateOrder = async () => {
    if (!cartData || !cartData.cartId) {
      toast.error("No cart data available.");
      return;
    }

    if (!paymentMethod) {
      toast.error("Please select a payment method.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await createOrder(cartData.cartId);

      if (response.data) {
        const orderData = response.data.data || response.data;

        if (orderData && orderData.orderId) {
          setOrderData(orderData);

          if (paymentMethod === "bank") {
            const paymentResponse = await createPayment({
              orderDescription: "Thanh toán đơn hàng",
              orderType: "billpayment",
              name: "Your Name",
              orderId: orderData.orderId,
            });
            toast.success("Order created successfully!");
            window.location.href = paymentResponse.data;
          } else {
            toast.success("Your order has been placed with Cash on Delivery!");
            navigate("/");
          }
        } else {
          console.error("Order ID missing in response:", orderData);
          toast.error("Error creating order: Missing order ID.");
        }
      } else {
        console.error("Invalid response structure:", response);
        toast.error("Error creating order: Invalid response structure.");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Order submission failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateTotal = () => {
    if (!cartData || !cartData.items) return 0;
    const subtotal = cartData.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    return subtotal;
  };

  if (!cartData) {
    return <div>Loading cart data...</div>;
  }

  return (
    <>
      <div className="order-container">
        <div className="back-arrow">
          <i
            className="fa-solid fa-arrow-left"
            onClick={() => navigate(-1)}
          ></i>
        </div>

        <div className="order-content">
          <h1 className="order-title">Đơn hàng của bạn</h1>
          <div className="order-grid">
            <div className="order-items">
              <div
                style={{ borderBottom: "1px solid #ddd", marginBottom: "20px" }}
              ></div>

              {cartItemDetails.length > 0 ? (
                cartItemDetails.map((item, index) => (
                  <div key={index} className="order-item">
                    <img
                      src={item.imageUrl}
                      alt={item.productName}
                      className="product-image"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/default-product-image.png";
                      }}
                    />
                    <div className="item-details">
                      <h5>{item.productName}</h5>
                      <p>Số lượng: {item.quantity}</p>
                    </div>
                    <div className="item-price">
                      {item.price.toLocaleString()} VND
                    </div>
                  </div>
                ))
              ) : (
                <p>Giỏ hàng của bạn trống</p>
              )}

              <div className="order-summary-details">
                <p>
                  <span>Tạm tính:</span>
                  <span className="amount">
                    {calculateTotal().toLocaleString()} VND
                  </span>
                </p>
                <p>
                  <span>Phí vận chuyển:</span>
                  <span className="amount">
                    {cartData.shippingFee?.toLocaleString() || "0"} VND
                  </span>
                </p>
                <h3>
                  <span>TỔNG CỘNG:</span>
                  <span>{calculateTotal().toLocaleString()} VND</span>
                </h3>
              </div>
            </div>

            <div className="payment-section">
              <h2 className="payment-title">Phương thức thanh toán</h2>
              <div className="payment-methods">
                <label className="payment-method">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={handlePaymentMethodChange}
                  />
                  <div className="payment-content">
                    <div className="payment-icon">
                      <i className="fas fa-money-bill"></i>
                    </div>
                    <div className="payment-info">
                      <span className="payment-name">
                        Thanh toán khi nhận hàng
                      </span>
                      <span className="payment-description">
                        Cash On Delivery (COD)
                      </span>
                    </div>
                  </div>
                </label>

                <label className="payment-method">
                  <input
                    type="radio"
                    name="payment"
                    value="bank"
                    checked={paymentMethod === "bank"}
                    onChange={handlePaymentMethodChange}
                  />
                  <div className="payment-content">
                    <div className="payment-icon">
                      <i className="fas fa-university"></i>
                    </div>
                    <div className="payment-info">
                      <span className="payment-name">
                        Thanh toán qua ngân hàng
                      </span>
                      <span className="payment-description">Bank Transfer</span>
                    </div>
                  </div>
                </label>
              </div>

              <button
                className="order-button"
                onClick={handleCreateOrder}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    <span>Đang xử lý...</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-shopping-cart"></i>
                    <span>ĐẶT HÀNG</span>
                  </>
                )}
              </button>
            </div>

            {orderData && (
              <div
                style={{
                  marginTop: "20px",
                  paddingTop: "20px",
                  borderTop: "1px solid #ddd",
                }}
              >
                <h2>Chi tiết đơn hàng</h2>
                <p>Mã đơn hàng: {orderData.orderId}</p>
                <p>Tổng tiền: {orderData.total.toLocaleString()} VND</p>
                <p>Trạng thái: {orderData.status}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Order;
