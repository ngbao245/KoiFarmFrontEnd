import React, { useState, useEffect } from 'react';
import { getConsignmentsForUser, deleteConsignmentItem } from '../../services/ConsignmentService';
import { createPayment, callBackPayment } from '../../services/PaymentService';
import { useNavigate, useLocation } from "react-router-dom";
import FishSpinner from "../../components/FishSpinner";
import { toast } from "react-toastify";
import "./UserConsignment.css";

const UserConsignment = () => {
    const [consignments, setConsignments] = useState([]);
    const [activeTab, setActiveTab] = useState('Pending');
    const [loading, setLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        fetchConsignments();
        // Kiểm tra callback từ VNPay
        const urlParams = new URLSearchParams(location.search);
        const vnp_ResponseCode = urlParams.get('vnp_ResponseCode');
        const vnp_OrderInfo = urlParams.get('vnp_OrderInfo');
        
        if (vnp_ResponseCode === '00') {
            handlePaymentCallback();
        } else if (vnp_ResponseCode) {
            toast.error("Thanh toán thất bại. Vui lòng thử lại.");
        }
    }, [location]);

    const fetchConsignments = async () => {
        try {
            const response = await getConsignmentsForUser();
            if (response.data) {
                setConsignments(response.data);
            }
        } catch (error) {
            toast.error("Không thể tải danh sách ký gửi");
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentCallback = async () => {
        try {
            const response = await callBackPayment();
            if (response.data) {
                // Refresh danh sách sau khi thanh toán thành công
                fetchConsignments();
                toast.success("Thanh toán thành công!");
            }
        } catch (error) {
            console.error("Payment callback error:", error);
            toast.error("Có lỗi xảy ra khi xác nhận thanh toán");
        }
    };

    const handlePayment = async (consignment, item) => {
        try {
            setIsProcessing(true);
            console.log("Processing payment for:", item);
            
            const response = await createPayment({
                orderDescription: `Thanh toán ký gửi: ${item.name}`,
                orderType: "consignment",
                name: item.name,
                orderId: item.itemId
            });

            if (response.data) {
                console.log("Payment URL:", response.data);
                window.location.href = response.data;
            }
        } catch (error) {
            console.error("Payment error:", error);
            toast.error("Không thể xử lý thanh toán. Vui lòng thử lại sau.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDeleteItem = async (itemId) => {
        try {
            await deleteConsignmentItem(itemId);
            // Cập nhật state để xóa item khỏi danh sách
            setConsignments(prevConsignments => 
                prevConsignments.map(consignment => ({
                    ...consignment,
                    items: consignment.items.filter(item => item.itemId !== itemId)
                })).filter(consignment => consignment.items.length > 0)
            );
            toast.success("Đã xóa cá ký gửi thành công!");
        } catch (error) {
            console.error("Delete error:", error);
            toast.error("Không thể xóa cá ký gửi. Vui lòng thử lại sau.");
        }
    };

    const filterConsignmentsByStatus = (status) => {
        return consignments.filter(consignment =>
            consignment.items.some(item => item.status === status)
        );
    };

    if (loading) return <FishSpinner />;

    return (
        <div className="uc-container">
            <div className="back-arrow">
                <i className="fa-solid fa-arrow-left" onClick={() => navigate(-1)}></i>
            </div>

            <main className="uc-content animated user-select-none">
                <div className="uc-header">
                    <h1 className="uc-title">Quản lý cá ký gửi</h1>
                </div>

                <div className="uc-tabs">
                    <button
                        className={`uc-tab-button ${activeTab === 'Pending' ? 'active' : ''}`}
                        onClick={() => setActiveTab('Pending')}
                    >
                        <i className="fas fa-clock me-2"></i>
                        Chờ duyệt
                        <span className="uc-count">{
                            consignments.reduce((acc, cons) => 
                                acc + cons.items.filter(item => item.status === 'Pending').length, 0
                            )
                        }</span>
                    </button>
                    <button
                        className={`uc-tab-button ${activeTab === 'Approved' ? 'active' : ''}`}
                        onClick={() => setActiveTab('Approved')}
                    >
                        <i className="fas fa-check-circle me-2"></i>
                        Đã duyệt
                        <span className="uc-count">{
                            consignments.reduce((acc, cons) => 
                                acc + cons.items.filter(item => item.status === 'Approved').length, 0
                            )
                        }</span>
                    </button>
                    <button
                        className={`uc-tab-button ${activeTab === 'Checkedout' ? 'active' : ''}`}
                        onClick={() => setActiveTab('Checkedout')}
                    >
                        <i className="fas fa-shopping-cart me-2"></i>
                        Đã thanh toán
                        <span className="uc-count">{
                            consignments.reduce((acc, cons) => 
                                acc + cons.items.filter(item => item.status === 'Checkedout').length, 0
                            )
                        }</span>
                    </button>
                </div>

                <div className="uc-table-container">
                    <table className="uc-table">
                        <thead>
                            <tr>
                                <th>Hình ảnh</th>
                                <th>Mã ký gửi</th>
                                <th>Tên cá</th>
                                <th>Loại</th>
                                <th>Trạng thái</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filterConsignmentsByStatus(activeTab).map(consignment => (
                                consignment.items.map(item => (
                                    <tr key={`${consignment.consignmentId}-${item.itemId}`}>
                                        <td>
                                            <img 
                                                src={item.imageUrl} 
                                                alt={item.name} 
                                                className="uc-fish-image"
                                            />
                                        </td>
                                        <td>{consignment.consignmentId}</td>
                                        <td>{item.name}</td>
                                        <td>{item.category}</td>
                                        <td>
                                            <span className={`uc-status ${item.status.toLowerCase()}`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td>
                                            {activeTab === 'Approved' && (
                                                <button
                                                    className="uc-btn uc-btn-payment"
                                                    onClick={() => handlePayment(consignment, item)}
                                                    disabled={isProcessing}
                                                >
                                                    {isProcessing ? (
                                                        <>
                                                            <i className="fas fa-spinner fa-spin me-2"></i>
                                                            Đang xử lý...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <i className="fas fa-credit-card me-2"></i>
                                                            Thanh toán
                                                        </>
                                                    )}
                                                </button>
                                            )}
                                            {activeTab === 'Pending' && (
                                                <button
                                                    className="uc-btn uc-btn-delete"
                                                    onClick={() => handleDeleteItem(item.itemId)}
                                                >
                                                    <i className="fas fa-trash me-2"></i>
                                                    Xóa
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ))}
                            {!consignments.some(c => c.items.some(i => i.status === activeTab)) && (
                                <tr>
                                    <td colSpan="6" className="text-center">
                                        <div className="uc-empty-state">
                                            <i className="fas fa-fish"></i>
                                            <p>Không có cá ký gửi nào trong trạng thái này</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default UserConsignment;
