import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getCart } from "../../services/CartService";
import { createOrder } from "../../services/OrderService";
import { createPayment } from "../../services/PaymentService";
import { useNavigate } from "react-router-dom";

const Order = () => {
  const [cartData, setCartData] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const cartResponse = await getCart();
        setCartData(cartResponse.data);
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

      // Log the full response
      console.log(
        "Full Order creation response:",
        JSON.stringify(response, null, 2)
      );

      if (response.data) {
        console.log("response.data:", JSON.stringify(response.data, null, 2));

        // Extracting data assuming two possible structures
        const orderData = response.data.data || response.data;

        // Check if orderData has orderId
        if (orderData && orderData.orderId) {
          setOrderData(orderData);

          // Handle payment
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
          // If orderId is missing
          console.error("Order ID missing in response:", orderData);
          toast.error("Error creating order: Missing order ID.");
        }
      } else {
        // If response structure is invalid
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
      <div className="back-arrow">
        <i className="fa-solid fa-arrow-left" onClick={() => navigate(-1)}></i>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "20px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            flex: "1",
            padding: "20px",
            backgroundColor: "#f9f9f9",
            borderRadius: "8px",
          }}
        >
          <h2>ĐƠN HÀNG CỦA BẠN</h2>
          <div
            style={{ borderBottom: "1px solid #ddd", marginBottom: "20px" }}
          ></div>

          {cartData.items && cartData.items.length > 0 ? (
            cartData.items.map((item, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  marginBottom: "20px",
                  alignItems: "center",
                }}
              >
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "cover",
                    marginRight: "20px",
                  }}
                />
                <div style={{ flex: "1" }}>
                  <h5 style={{ margin: "0 0 5px" }}>{item.productName}</h5>
                  <p style={{ margin: "0", fontSize: "14px", color: "#666" }}>
                    Số lượng: {item.quantity}
                  </p>
                </div>
                <p style={{ fontWeight: "bold", color: "#C70025" }}>
                  {item.price.toLocaleString()} VND
                </p>
              </div>
            ))
          ) : (
            <p>Giỏ hàng của bạn trống</p>
          )}

          <div
            style={{
              marginTop: "20px",
              paddingTop: "20px",
              borderTop: "1px solid #ddd",
            }}
          >
            <p>Tạm tính: {calculateTotal().toLocaleString()} VND</p>
            <p>
              Phí vận chuyển: {cartData.shippingFee?.toLocaleString() || "0"}{" "}
              VND
            </p>
            <h3 style={{ color: "#C70025", marginTop: "10px" }}>
              TỔNG CỘNG: {calculateTotal().toLocaleString()} VND
            </h3>
          </div>
        </div>

        {/* Payment Method Section */}
        <div style={{ flex: "1", padding: "20px" }}>
          <h2>Phương thức thanh toán</h2>
          <div style={{ marginBottom: "20px" }}>
            <label>
              <input
                type="radio"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={handlePaymentMethodChange}
              />
              Thanh toán tiền mặt khi nhận hàng (COD)
            </label>
          </div>
          <div style={{ marginBottom: "20px" }}>
            <label>
              <input
                type="radio"
                value="bank"
                checked={paymentMethod === "bank"}
                onChange={handlePaymentMethodChange}
              />
              Thanh toán bằng ngân hàng (Bank Transfer)
            </label>
          </div>

          <button
            onClick={handleCreateOrder}
            disabled={isSubmitting}
            style={{
              padding: "15px 30px",
              backgroundColor: "#C70025",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            {isSubmitting ? "Đang xử lý..." : "ĐẶT HÀNG"}
          </button>
        </div>

        {/* Display Order Details After Submission */}
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
    </>
  );
};

export default Order;
