import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getCart } from "../../services/CartService";
import { createOrder } from "../../services/OrderService";
import { createPayment } from "../../services/PaymentService";
import { useNavigate } from "react-router-dom";
import { getProdItemById } from "../../services/ProductItemService";
import { fetchPromotionByCode } from "../../services/PromotionService";
import { fetchBatchById } from "../../services/BatchService";
import { getProdItemByBatch } from "../../services/ProductItemService";
import "./Order.css";

const Order = () => {
  const [cartData, setCartData] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [cartItemDetails, setCartItemDetails] = useState([]);
  const navigate = useNavigate();

  const [promotionCode, setPromotionCode] = useState(null);
  const [promotionMessage, setPromotionMessage] = useState(null);
  const [messageColor, setMessageColor] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);

  const [expandedBatches, setExpandedBatches] = useState([]);

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const cartResponse = await getCart();
        const { items } = cartResponse.data;

        // Group items by batchId
        const groupedItems = items.reduce((acc, item) => {
          if (item.batchId) {
            if (!acc[item.batchId]) acc[item.batchId] = [];
            acc[item.batchId].push(item);
          } else {
            acc[item.productItemId] = [item];
          }
          return acc;
        }, {});

        const updatedItems = await Promise.all(
          Object.entries(groupedItems).map(async ([key, group]) => {
            if (group[0].batchId) {
              try {
                // Fetch batch details
                const batchResponse = await fetchBatchById(group[0].batchId);
                // Fetch product items in batch
                const batchItemsResponse = await getProdItemByBatch(group[0].batchId);
                
                // Map batch items with their details
                const batchItemsWithDetails = await Promise.all(
                  batchItemsResponse.data.map(async (item) => {
                    try {
                      const productResponse = await getProdItemById(item.id);
                      return {
                        productItemId: item.id,
                        name: item.name || 'Unknown',
                        imageUrl: item.imageUrl || productResponse.data?.imageUrl || '/default-product-image.png',
                        sex: item.sex || 'N/A',
                        age: item.age || 'N/A',
                        size: item.size || 'N/A',
                        quantity: 1
                      };
                    } catch (error) {
                      console.error(`Error fetching product details for ${item.id}:`, error);
                      return {
                        productItemId: item.id,
                        name: item.name || 'Unknown',
                        imageUrl: item.imageUrl || '/default-product-image.png',
                        sex: item.sex || 'N/A',
                        age: item.age || 'N/A',
                        size: item.size || 'N/A',
                        quantity: 1
                      };
                    }
                  })
                );

                return {
                  batchId: group[0].batchId,
                  batchImage: batchResponse.data.imageUrl || '/default-product-image.png',
                  batchName: batchResponse.data.name || 'Unknown Batch',
                  batchPrice: batchResponse.data.price || 0,
                  batchItems: batchItemsWithDetails,
                };
              } catch (error) {
                console.error("Error fetching batch details:", error);
                return null;
              }
            } else {
              // Nếu là sản phẩm đơn lẻ
              try {
                const productResponse = await getProdItemById(group[0].productItemId);
                return {
                  ...group[0],
                  imageUrl: productResponse.data?.imageUrl || '/default-product-image.png',
                };
              } catch (error) {
                console.error("Error fetching product details:", error);
                return {
                  ...group[0],
                  imageUrl: '/default-product-image.png',
                };
              }
            }
          })
        );

        // Lọc bỏ các item null (do lỗi)
        const filteredItems = updatedItems.filter(item => item !== null);
        setCartItemDetails(filteredItems);
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
      const response = await createOrder(cartData.cartId, promotionCode);

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
            window.location.href = paymentResponse.data;
          } else {
            toast.success("Đơn hàng được tạo thành công!");
            navigate("/");
          }
        } else {
          console.error("Order ID missing in response:", orderData);
          // toast.error("Error creating order: Missing order ID.");
        }
      } else {
        console.error("Invalid response structure:", response);
        // toast.error("Error creating order: Invalid response structure.");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      // toast.error("Order submission failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePromotionCheck = async () => {
    if (!promotionCode.trim()) return;

    try {
      const response = await fetchPromotionByCode(promotionCode);
      if (response.statusCode === 200) {
        setPromotionMessage("Mã giảm giá hợp lệ");
        setMessageColor("green");

        const promotion = response.data[0];

        const subtotal = calculateSubtotal();
        if (promotion.type === "Percentage") {
          setDiscountAmount((subtotal * promotion.amount) / 100);
        } else if (promotion.type === "Direct") {
          setDiscountAmount(promotion.amount);
        }
      } else {
        setPromotionMessage("Mã giảm giá không hợp lệ");
        setMessageColor("red");
        setDiscountAmount(0);
      }
    } catch (error) {
      console.error("Error checking promotion code:", error);
      setPromotionMessage("Error checking promotion code");
    }
  };

  const calculateSubtotal = () => {
    if (!cartData || !cartData.items) return 0;
    return cartData.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    return subtotal - discountAmount;
  };

  const toggleBatchExpand = (batchId) => {
    setExpandedBatches(prev => 
      prev.includes(batchId) 
        ? prev.filter(id => id !== batchId)
        : [...prev, batchId]
    );
  };

  if (!cartData) {
    return <div>Loading cart data...</div>;
  }

  return (
    <>
      <div className="order-container animated">
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
                cartItemDetails.map((item, index) =>
                  item.batchId ? (
                    <React.Fragment key={index}>
                      <div 
                        className="order-item"
                        onClick={() => toggleBatchExpand(item.batchId)}
                      >
                        <img
                          src={item.batchImage}
                          alt={item.batchName}
                          className="order-product-image"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/default-product-image.png";
                          }}
                        />
                        <div className="order-item-details">
                          <h5>{item.batchName}</h5>
                          <p>Bao gồm: {item.batchItems.length} sản phẩm</p>
                        </div>
                        <div className="item-price">
                          {item.batchPrice.toLocaleString()} VND
                        </div>
                      </div>
                      {expandedBatches.includes(item.batchId) && (
                        <div className="order-batch-items">
                          {item.batchItems.map((batchItem, idx) => (
                            <div key={`${item.batchId}-${idx}`} className="order-batch-subitem">
                              <img 
                                src={batchItem.imageUrl || '/default-product-image.png'} 
                                alt={batchItem.name}
                                className="order-product-image"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "/default-product-image.png";
                                }}
                              />
                              <div className="order-batch-item-details">
                                <div className="order-batch-item-name">{batchItem.name}</div>
                                <div className="order-batch-item-specs">
                                  <span>Giới tính: {batchItem.sex}</span>
                                  <span>Tuổi: {batchItem.age}</span>
                                  <span>Size: {batchItem.size}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </React.Fragment>
                  ) : (
                    // Render individual product details
                    <div key={index} className="order-item">
                      <img
                        src={item.imageUrl}
                        alt={item.productName}
                        className="order-product-image"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/default-product-image.png";
                        }}
                      />
                      <div className="order-item-details">
                        <h5>{item.productName}</h5>
                        <p>Số lượng: {item.quantity}</p>
                      </div>
                      <div className="item-price">
                        {(item.price * item.quantity).toLocaleString()} VND
                      </div>
                    </div>
                  )
                )
              ) : (
                <p>Giỏ hàng của bạn trống</p>
              )}

              <div className="order-summary-details">
                <p>
                  <span>Tạm tính:</span>
                  <span className="amount">
                    {calculateSubtotal().toLocaleString()} VND
                  </span>
                </p>
                <p>
                  <span>Giảm giá:</span>
                  <span className="amount">
                    {discountAmount.toLocaleString()} VND
                  </span>
                </p>
                <p>
                  <span>Phí vận chuyển:</span>
                  <span className="amount">
                    {cartData.shippingFee?.toLocaleString() || "Miễn phí"} VND
                  </span>
                </p>
                <p>
                  <span>Thuế VAT:</span>
                  <span className="amount">
                    {cartData.shippingFee?.toLocaleString() || "Không áp dụng"}
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
                  <div className="order-payment-content">
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
                  <div className="order-payment-content">
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

                <div className="promotion-bar">
                  <label className="promotionCode" htmlFor="promotionCode">Mã giảm giá:</label>
                  <div className="promotion-input-group">
                    <input
                      className="promotion-input"
                      type="text"
                      id="promotionCode"
                      value={promotionCode || ""}
                      onChange={(e) => {
                        setPromotionCode(e.target.value);
                        setPromotionMessage(null);
                      }}
                    />
                    <button onClick={handlePromotionCheck}>Áp dụng</button>
                  </div>
                </div>
                {promotionMessage && (
                  <p
                    className="promotion-message"
                    style={{
                      color: messageColor,
                    }}
                  >
                    {promotionMessage}
                  </p>
                )}
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
          </div>
        </div>
      </div>
    </>
  );
};

export default Order;
