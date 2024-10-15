import React, { useState, useEffect } from "react";
import AdminHeader from "../../layouts/header/AdminHeader";
import { fetchOrder, assignStaff } from "../../services/OrderService";
import { fetchAllStaff } from "../../services/UserService";
import StaffDropdown from "../../components/StaffDropdown";
import { toast } from "react-toastify";
import "./AdminOrder.css";

const AdminOrder = () => {
  const [orders, setOrders] = useState([]);
  const [staffMembers, setStaffMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [orderResponse, staffResponse] = await Promise.all([
          fetchOrder(),
          fetchAllStaff(),
        ]);

        console.log("Order Response:", orderResponse);
        console.log("Staff Response:", staffResponse);

        // Handle the order data
        const ordersData = orderResponse.data || [];
        
        // Handle the staff data
        const staffData = staffResponse.data.entities || [];

        const ordersWithDetails = ordersData.map((order) => {
          const assignedStaff = staffData.find(
            (staff) => staff.id === order.staffId
          );
          return { ...order, assignedStaffName: assignedStaff?.name || "Not assigned" };
        });

        console.log("Processed Orders:", ordersWithDetails);

        setOrders(ordersWithDetails);
        setStaffMembers(staffData);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch data", err);
        setError("Failed to fetch data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAssignStaff = async (orderId, staffId) => {
    try {
      await assignStaff(orderId, staffId);
      toast.success("Staff assigned successfully!");
      // Refresh the orders after assignment
      const updatedOrders = orders.map(order => 
        order.orderId === orderId 
          ? { ...order, staffId, assignedStaffName: staffMembers.find(s => s.id === staffId)?.name || "Not assigned" }
          : order
      );
      setOrders(updatedOrders);
    } catch (error) {
      console.error("Error assigning staff:", error);
      toast.error("Failed to assign staff");
    }
  };

  const filteredOrders = orders.filter((order) =>
    order.userId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <AdminHeader />
      <div className="admin-order-container container">
        <div className="my-3">
          <input
            className="form-control"
            placeholder="Search orders by user ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {filteredOrders.length === 0 ? (
          <div>No orders found</div>
        ) : (
          <div className="customize-table">
            <table className="table table-striped text-center">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>User ID</th>
                  <th>Address</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Assigned Staff</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.orderId}>
                    <td>{order.orderId}</td>
                    <td>{order.userId}</td>
                    <td>{order.address}</td>
                    <td>{new Date(order.createdTime).toLocaleDateString()}</td>
                    <td>{order.total}</td>
                    <td>{order.status}</td>
                    <td>{order.assignedStaffName}</td>
                    <td>
                      <StaffDropdown
                        className="assign"
                        staffMembers={staffMembers}
                        currentStaffId={order.staffId}
                        onAssign={(staffId) =>
                          handleAssignStaff(order.orderId, staffId)
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminOrder;
