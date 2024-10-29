import React, { useState, useEffect } from "react";
import AdminHeader from "../../layouts/header/AdminHeader";
import {
  fetchAllConsignments,
  updateConsignmentItemStatus,
} from "../../services/ConsignmentService";
import { toast } from "react-toastify";
import FishSpinner from "../../components/FishSpinner";
import "./AdminConsignment.css";

const AdminConsignment = () => {
  const [consignments, setConsignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("Pending");
  const [expandedRows, setExpandedRows] = useState([]);
  
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetchAllConsignments();
      console.log("Fetched consignments:", response);
      
      if (response.data) {
        setConsignments(response.data);
      }
    } catch (error) {
      console.error("Error fetching consignments:", error);
      toast.error("Không thể tải danh sách ký gửi");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (itemId, newStatus) => {
    try {
      console.log('Updating status:', itemId, newStatus);
      
      const response = await updateConsignmentItemStatus(itemId, newStatus);
      console.log('API Response:', response);

      if (response.data) {
        setConsignments(prevConsignments => 
          prevConsignments.map(consignment => ({
            ...consignment,
            items: consignment.items.map(item => 
              item.itemId === itemId ? { ...item, status: newStatus } : item
            )
          }))
        );
        
        toast.success("Cập nhật trạng thái thành công!");
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error("Cập nhật trạng thái thất bại");
    }
  };

  const filterConsignmentsByStatus = (status) => {
    if (!consignments) return [];
    
    return consignments.filter(consignment =>
      consignment.items.some(item => {
        const searchTermLower = searchTerm.toLowerCase();
        return item.status === status && 
          (
            (consignment.consignmentId && consignment.consignmentId.toString().includes(searchTermLower)) ||
            (item.name && item.name.toLowerCase().includes(searchTermLower))
          );
      })
    );
  };

  // Thêm useEffect để log khi activeTab thay đổi
  useEffect(() => {
    console.log("Active tab changed to:", activeTab);
    const filteredData = filterConsignmentsByStatus(activeTab);
    console.log("Filtered consignments:", filteredData);
  }, [activeTab]);

  const toggleExpandedRow = (consignmentId) => {
    setExpandedRows(prev =>
      prev.includes(consignmentId)
        ? prev.filter(id => id !== consignmentId)
        : [...prev, consignmentId]
    );
  };

  if (loading) return <FishSpinner />;

  return (
    <>
      <AdminHeader />
      <div className="container">
        <div className="my-3">
          <b>Danh sách ký gửi:</b>
          <div className="col-12 col-sm-4 my-3">
            <input
              className="form-control"
              placeholder="Tìm kiếm theo mã ký gửi hoặc tên cá..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="consignment-tabs">
          <button
            className={`tab-button ${activeTab === "Pending" ? "active" : ""}`}
            onClick={() => setActiveTab("Pending")}
          >
            Chờ duyệt
          </button>
          <button
            className={`tab-button ${activeTab === "Approved" ? "active" : ""}`}
            onClick={() => setActiveTab("Approved")}
          >
            Đã duyệt
          </button>
          <button
            className={`tab-button ${activeTab === "Checkedout" ? "active" : ""}`}
            onClick={() => setActiveTab("Checkedout")}
          >
            Đã thanh toán
          </button>
        </div>

        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th></th>
                <th>Mã ký gửi</th>
                <th>Tên cá</th>
                <th>Người ký gửi</th>
                <th>Ngày ký gửi</th>
                <th>Trạng thái</th>
                {activeTab === "Pending" && <th>Hành động</th>}
              </tr>
            </thead>
            <tbody>
              {filterConsignmentsByStatus(activeTab).map((consignment) => (
                <React.Fragment key={consignment.consignmentId}>
                  {consignment.items.map((item) => (
                    <tr key={item.itemId}>
                      <td>
                        <button
                          className="btn btn-sm"
                          onClick={() => toggleExpandedRow(consignment.consignmentId)}
                        >
                          <i className="fas fa-info-circle"></i>
                        </button>
                      </td>
                      <td>{consignment.consignmentId}</td>
                      <td>{item.name}</td>
                      <td>{consignment.userId}</td>
                      <td>{new Date(consignment.createdAt).toLocaleDateString()}</td>
                      <td>
                        <span className={`status-badge ${item.status.toLowerCase()}`}>
                          {item.status}
                        </span>
                      </td>
                      {activeTab === "Pending" && (
                        <td>
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleStatusChange(item.itemId, "Approved")}
                          >
                            <i className="fas fa-check"></i> Duyệt
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                  {expandedRows.includes(consignment.consignmentId) && (
                    <tr>
                      <td colSpan="7">
                        <div className="expanded-content">
                          <p><strong>Mô tả:</strong> {consignment.description || 'Không có mô tả'}</p>
                          <p><strong>Ghi chú:</strong> {consignment.notes || 'Không có ghi chú'}</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AdminConsignment;
