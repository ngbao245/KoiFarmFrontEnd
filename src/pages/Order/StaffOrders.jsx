import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import { getAssignedOrders, updateOrderStatus } from "../../services/OrderService";
import "./StaffOrders.css";
import AdminHeader from "../../layouts/header/AdminHeader";
import { getNameOfProdItem } from "../../services/ProductItemService";


const StaffOrders = () => {
  const { user } = useContext(UserContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [productNames, setProductNames] = useState({});

  useEffect(() => {
    const fetchAssignedOrders = async () => {
      try {
        setLoading(true);
        const response = await getAssignedOrders();
        const assignedOrders = response.data || [];
  
        const productNamePromises = assignedOrders.flatMap((order) =>
          order.items.map(async (item) => {
            try {
              const product = await getNameOfProdItem(item.productItemId);
              return { productItemId: item.productItemId, name: product.name || "Unknown" };
            } catch (err) {
              console.error(`Error fetching product ${item.productItemId}:`, err);
              return { productItemId: item.productItemId, name: "Unknown" };
            }
          })
        );
  
        const productNameResults = await Promise.all(productNamePromises);
        const productNameMap = productNameResults.reduce((map, { productItemId, name }) => {
          map[productItemId] = name;
          return map;
        }, {});
  
        setProductNames(productNameMap);
        setOrders(assignedOrders);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching assigned orders:", err);
        setError("Failed to load assigned orders. Please try again later.");
        setLoading(false);
      }
    };
  
    if (user.auth) {
      fetchAssignedOrders();
    }
  }, [user]);
  

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setIsUpdating(true);
      await updateOrderStatus(orderId, newStatus );
      const updatedOrders = orders.map(order =>
        order.orderId === orderId ? { ...order, status: newStatus } : order
      );
      setOrders(updatedOrders);
      setIsUpdating(false);
    } catch (err) {
      console.error("Error updating order status:", err);
      setError("Failed to update order status. Please try again.");
      setIsUpdating(false);
    }
  };

  if (!user.auth) {
    return <div className="staff-orders">Please log in to view assigned orders.</div>;
  }

  if (loading) {
    return <div className="staff-orders">Loading orders...</div>;
  }

  if (error) {
    return <div className="staff-orders error-message">{error}</div>;
  }

  return (
    <>
    <AdminHeader/>
    <div className="staff-orders container">
      <h1>Assigned Orders</h1>
      <div className="my-3 d-sm-flex">
        <span><b>Manage Assigned Orders</b></span>
      </div>

      <div className="customize-table">
        <table className="table table-striped text-center">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Tổng</th>
              <th>Trạng thái</th>
              <th>Sản phẩm</th>
              <th>Địa chỉ</th>
              <th>Ngày tạo đơn</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order.orderId}>
                  <td>{order.orderId}</td>
                  <td>{order.total.toLocaleString("vi-VN")} VND</td>
                  <td>{order.status}</td>
                  <td>
                    {order.items.map((item, itemIndex) => (
                      <span key={`item-${item.productItemId}-${itemIndex}`}>
                        {item.quantity} x {productNames[item.productItemId] || item.productItemId}
                        <br />
                      </span>
                    ))}
                  </td>
                  <td>{order.address}</td>
                  <td>{new Date(order.createdTime).toLocaleDateString('vi-VN')}</td>
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleStatusChange(order.orderId, "Delivering")}
                      disabled={isUpdating || order.status !== "Pending"}
                    >
                      Start Delivery
                    </button>
                    <button
                      className="btn btn-success"
                      style={{ marginLeft: "10px" }}
                      onClick={() => handleStatusChange(order.orderId, "Completed")}
                      disabled={isUpdating || order.status !== "Delivering"}
                    >
                      Complete Order
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No assigned orders available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
};

export default StaffOrders;
