import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import { updateUserInfo, getUserInfo } from "../../services/UserService";
import {
  getOrderByUser,
  updateIsDelivered,
  cancelOrder,
} from "../../services/OrderService";
import { fetchAllPayment } from "../../services/PaymentService";
import { getNameOfProdItem } from "../../services/ProductItemService";
import "./UserDetail.css";
import FishSpinner from "../../components/FishSpinner";

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({
    name: "",
    email: user.email || "",
    password: "",
    address: "",
    phone: "",
  });

  console.log(orders);

  const [activeTab, setActiveTab] = useState("Pending");

  const isPaymentPage = window.location.pathname.includes("/payments");

  const [productNames, setProductNames] = useState({});

  const filterOrdersByStatus = (status) => {
    return orders.filter((order) => order.status === status);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const userInfoResponse = await getUserInfo();
        const userData = userInfoResponse.data;

        setUpdatedUser({
          name: userData?.name || "",
          email: userData?.email || "",
          address: userData?.address || "",
          phone: userData?.phone || "",
          password: "",
        });

        if (isPaymentPage) {
          const paymentsResponse = await fetchAllPayment();
          setPayments(paymentsResponse.data?.data || []);
        } else {
          const ordersResponse = await getOrderByUser();
          setOrders(
            Array.isArray(ordersResponse.data) ? ordersResponse.data : []
          );

          const fetchedOrders = Array.isArray(ordersResponse.data)
            ? ordersResponse.data
            : [];
          const uniqueProductItemIds = [
            ...new Set(
              fetchedOrders.flatMap((order) =>
                order.items.map((item) => item.productItemId)
              )
            ),
          ];

          const namesPromises = uniqueProductItemIds.map((id) =>
            getNameOfProdItem(id)
          );
          const namesResponses = await Promise.all(namesPromises);
          const names = {};
          namesResponses.forEach((response) => {
            if (response && response.id) {
              names[response.id] = response.name || "Unknown Product";
            }
          });
          setProductNames(names);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
        setLoading(false);
      }
    };

    if (user.auth) {
      fetchData();
    }
  }, [user, isPaymentPage]);

  const handleNavigateToPayments = () => {
    navigate(`/${id}/payments`);
  };

  const handleNavigateToOrders = () => {
    navigate(`/${id}/detail`);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!updatedUser.password) {
      setError("Vui lòng nhập mật khẩu để cập nhật thông tin.");
      return;
    }
    try {
      const response = await updateUserInfo(updatedUser);
      setUpdatedUser((prev) => ({ ...prev, ...response.data, password: "" }));
      setEditMode(false);
      setError(null);
    } catch (err) {
      setError(
        err.message || "Không thể cập nhật thông tin. Vui lòng thử lại."
      );
      console.error(err);
    }
  };

  const handleUpdateIsDelivered = async (orderId) => {
    try {
      await updateIsDelivered(orderId);
      const updatedOrders = orders.map((order) =>
        order.orderId === orderId ? { ...order, isDelivered: true } : order
      );
      setOrders(updatedOrders);
    } catch (err) {
      console.error("Error updating isDelivered:", err);
      setError("Failed to update order. Please try again.");
    }
  };

  const handleBackClick = () => {
    if (editMode) {
      setEditMode(false);
    } else {
      navigate(-1);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await cancelOrder(orderId);
      const updatedOrders = orders.filter((order) => order.orderId !== orderId);
      console.log(updatedOrders);
      
      setOrders(updatedOrders);
    } catch (err) {
      console.error("Error cancelling order:", err);
      setError("Failed to cancel order. Please try again.");
    }
  };

  if (!user.auth) {
    return (
      <div className="user-detail-container">
        Vui lòng đăng nhập để xem thông tin.
      </div>
    );
  }

  if (loading) {
    return <FishSpinner />;
  }

  if (error) {
    return <div className="user-detail-container error-message">{error}</div>;
  }

  return (
    <div className="user-detail-container">
      <div className="back-arrow">
        <i className="fa-solid fa-arrow-left" onClick={handleBackClick}></i>
      </div>

      <main className="user-detail-content animated user-select-none">
        <div className="user-detail-header">
          <h1 className="user-detail-title">
            {isPaymentPage ? "Lịch sử thanh toán" : "Thông tin người dùng"}
          </h1>

          <div
            onClick={
              isPaymentPage ? handleNavigateToOrders : handleNavigateToPayments
            }
            className="text-uppercase btn"
          >
            {isPaymentPage ? (
              <>
                Xem thông tin người dùng
                <i className="fa-solid fa-user px-2"></i>
              </>
            ) : (
              <div className="btn-view-payments">
                Lịch sử thanh toán
                <i className="fa-solid fa-clock-rotate-left px-2"></i>
              </div>
            )}
          </div>
        </div>

        {!isPaymentPage && (
          <div className="user-detail-info">
            {editMode ? (
              <form onSubmit={handleSubmit} className="edit-form">
                <div>
                  <label htmlFor="name">Tên:</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={updatedUser.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label htmlFor="email">Email:</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={updatedUser.email}
                    onChange={handleInputChange}
                    readOnly
                  />
                </div>
                <div>
                  <label htmlFor="password">
                    Mật khẩu (bắt buộc để cập nhật):
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={updatedUser.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="address">Địa chỉ:</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={updatedUser.address}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label htmlFor="phone">Số điện thoại:</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={updatedUser.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <button type="submit">Lưu thay đổi</button>
                <button type="button" onClick={() => setEditMode(false)}>
                  Hủy
                </button>
              </form>
            ) : (
              <>
                <div className="user-info-grid">
                  <div className="user-info-row">
                    <div className="user-info-item">
                      <strong>Email:</strong>
                      <span>{user.email}</span>
                    </div>
                    <div className="user-info-item">
                      <strong>Địa chỉ:</strong>
                      <span>{updatedUser.address || "Chưa cung cấp"}</span>
                    </div>
                  </div>
                  <div className="user-info-row">
                    <div className="user-info-item">
                      <strong>Tên:</strong>
                      <span>{updatedUser.name || "Chưa cung cấp"}</span>
                    </div>
                    <div className="user-info-item">
                      <strong>Số điện thoại:</strong>
                      <span>{updatedUser.phone || "Chưa cung cấp"}</span>
                    </div>
                    <div className="user-info-item">
                      <strong>Trạng thái:</strong>
                      <span
                        className={`auth-status ${
                          user.auth ? "authenticated" : "not-authenticated"
                        }`}
                      >
                        {user.auth ? "Đã xác thực" : "Chưa xác thực"}
                      </span>
                    </div>
                    <button
                      className="edit-info-btn"
                      onClick={() => setEditMode(true)}
                    >
                      <i className="fa-solid fa-wrench"></i>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {isPaymentPage ? (
          <>
            <table className="payment-table">
              <thead>
                <tr>
                  <th>Mã thanh toán</th>
                  <th>Số tiền</th>
                  <th>Phương thức</th>
                  <th>Ngày thanh toán</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id}>
                    <td>{payment.id}</td>
                    <td>{payment.amount.toLocaleString("vi-VN")} VND</td>
                    <td>{payment.paymentMethod}</td>
                    <td>
                      {new Date(payment.paymentDate).toLocaleDateString(
                        "vi-VN"
                      )}
                    </td>
                    <td>{payment.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              onClick={handleNavigateToOrders}
              className="btn btn-primary"
            >
              Xem thông tin người dùng
            </button>
          </>
        ) : (
          <>
            <div className="user-detail-header">
              <h2 className="user-detail-title">Đơn hàng của bạn</h2>
            </div>
            {orders.length === 0 ? (
              <p>Bạn chưa có đơn hàng nào.</p>
            ) : (
              <>
                <div className="order-tabs">
                  <button
                    className={`order-tab-button ${
                      activeTab === "Pending" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("Pending")}
                  >
                    Đang xử lý
                  </button>
                  <button
                    className={`order-tab-button ${
                      activeTab === "Delivering" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("Delivering")}
                  >
                    Đang giao hàng
                  </button>
                  <button
                    className={`order-tab-button ${
                      activeTab === "Completed" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("Completed")}
                  >
                    Đã hoàn thành
                  </button>
                </div>

                <table className="order-table">
                  <thead>
                    <tr>
                      <th>Mã Đơn Hàng</th>
                      <th>Sản Phẩm</th>
                      <th>Tổng Tiền</th>
                      <th>Ngày Mua</th>
                      <th>Trạng Thái</th>
                      {activeTab === "Completed" && <th>Xác Nhận Hàng</th>}
                      {activeTab === "Pending" && <th>Hủy Đơn Hàng</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {filterOrdersByStatus(activeTab).map((order) => (
                      <tr key={order.orderId}>
                        <td>{order.orderId}</td>
                        <td>
                          {order.items.map((item, index) => (
                            <div key={`${item.productItemId}-${index}`}>
                              {productNames[item.productItemId] ||
                                `Product ${item.productItemId}`}{" "}
                              x {item.quantity}
                            </div>
                          ))}
                        </td>
                        <td>{order.total.toLocaleString("vi-VN")} VND</td>
                        <td>
                          {new Date(order.createdTime).toLocaleDateString(
                            "vi-VN"
                          )}
                        </td>
                        <td>
                          {order.status === "Pending" && (
                            <span
                              style={{
                                color: "lightcoral",
                                fontWeight: "bold",
                              }}
                            >
                              Đang Xử Lý
                            </span>
                          )}
                          {order.status === "Delivering" && (
                            <span
                              style={{ color: "orange", fontWeight: "bold" }}
                            >
                              Đang Giao Hàng
                            </span>
                          )}
                          {order.status === "Completed" && (
                            <span
                              style={{ color: "green", fontWeight: "bold" }}
                            >
                              Đã Giao Hàng
                            </span>
                          )}
                        </td>
                        {activeTab === "Completed" && (
                          <td>
                            {order.isDelivered === null ? (
                              <button
                                className="btn btn-primary"
                                onClick={() =>
                                  handleUpdateIsDelivered(order.orderId)
                                }
                              >
                                Xác nhận đã nhận hàng
                              </button>
                            ) : (
                              <span
                                style={{ color: "green", fontWeight: "bold" }}
                              >
                                ✓ Đã nhận hàng
                              </span>
                            )}
                          </td>
                        )}
                        {activeTab === "Pending" && (
                          <td>
                            <button
                              className="btn btn-danger"
                              onClick={() => handleCancelOrder(order.orderId)}
                            >
                              Hủy đơn hàng
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default UserDetail;
