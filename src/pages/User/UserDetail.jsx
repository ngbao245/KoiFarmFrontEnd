import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../contexts/UserContext";
import "./UserDetail.css";
import { updateUserInfo } from "../../services/UserService";
import { getOrderByUser } from "../../services/OrderService";

const UserDetail = () => {
  const { user } = useContext(UserContext);
  const [orders, setOrders] = useState([]);
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

  useEffect(() => {
    setUpdatedUser(prevUser => ({
      ...prevUser,
      email: user.email || "",
    }));

    const fetchOrders = async () => {
      try {
        const response = await getOrderByUser();
        console.log("Orders data:", response.data); // Log dữ liệu đơn hàng
        // Kiểm tra và xử lý dữ liệu đơn hàng
        const ordersData = Array.isArray(response.data) ? response.data : 
                           (Array.isArray(response.data?.data) ? response.data.data : []);
        setOrders(ordersData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Không thể tải đơn hàng. Vui lòng thử lại sau.");
        setLoading(false);
      }
    };

    if (user.auth) {
      fetchOrders();
    }
  }, [user]);

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

  return (
    <div className="user-detail-container">
      <h1>Thông tin người dùng</h1>
      {user.auth ? (
        <>
          <div className="user-info">
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
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Tên:</strong> {updatedUser.name || "Chưa cung cấp"}
                </p>
                <p>
                  <strong>Địa chỉ:</strong>{" "}
                  {updatedUser.address || "Chưa cung cấp"}
                </p>
                <p>
                  <strong>Số điện thoại:</strong>{" "}
                  {updatedUser.phone || "Chưa cung cấp"}
                </p>
                <p>
                  <strong>Trạng thái:</strong>{" "}
                  <span
                    className={`auth-status ${
                      user.auth ? "authenticated" : "not-authenticated"
                    }`}
                  >
                    {user.auth ? "Đã xác thực" : "Chưa xác thực"}
                  </span>
                </p>
                <button onClick={() => setEditMode(true)}>
                  Chỉnh sửa thông tin
                </button>
              </>
            )}
          </div>

          <h2>Đơn hàng của bạn</h2>
          {loading ? (
            <p>Đang tải đơn hàng...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : orders.length === 0 ? (
            <p>Bạn chưa có đơn hàng nào.</p>
          ) : (
            <table className="order-table">
              <thead>
                <tr>
                  <th>Mã đơn hàng</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                  <th>Số lượng sản phẩm</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.orderId}>
                    <td>{order.orderId}</td>
                    <td>{order.total.toLocaleString("vi-VN")} VND</td>
                    <td>{order.status}</td>
                    <td>
                      {order.items.reduce(
                        (sum, item) => sum + item.quantity,
                        0
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      ) : (
        <div className="user-info">
          <p className="error-message">Bạn chưa đăng nhập.</p>
        </div>
      )}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default UserDetail;
