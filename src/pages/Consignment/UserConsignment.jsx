import React, { useState, useEffect } from 'react';
import { getConsignmentsForUser } from '../../services/ConsignmentService'; // Replace with actual service
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";

const UserConsignment = () => {
    const [consignments, setConsignments] = useState([]);
    const [activeTab, setActiveTab] = useState('Pending');
    
    const navigate = useNavigate();

    useEffect(() => {
        const fetchConsignments = async () => {
            try {
                const response = await getConsignmentsForUser();
                if (response.statusCode === 200) {
                    setConsignments(response.data);
                }
            } catch (error) {
                console.error('Error fetching consignments', error);
            }
        };

        fetchConsignments();
    }, []);

    const filterConsignmentItemsByStatus = (status) => {
        return consignments.flatMap(consignment => 
            consignment.items.filter(item => item.status === status)
        );
    };

    return (
        <>
        <div className="back-arrow">
                <i className="fa-solid fa-arrow-left" onClick={() => navigate(-1)}></i>
            </div>
        <div className="container mt-5">
            <h1 className="text-center mb-4">Your Consignments</h1>

            {/* Tabs for different consignment statuses */}
            <div className="consignment-tabs mb-4">
                <button
                    className={`consignment-tab-button ${activeTab === 'Pending' ? 'active' : ''}`}
                    onClick={() => setActiveTab('Pending')}
                >
                    Pending
                </button>
                <button
                    className={`consignment-tab-button ${activeTab === 'Checkedout' ? 'active' : ''}`}
                    onClick={() => setActiveTab('Approved')}
                >
                    Approved
                </button>
                <button
                    className={`consignment-tab-button ${activeTab === 'Completed' ? 'active' : ''}`}
                    onClick={() => setActiveTab('Completed')}
                >
                    Completed
                </button>
            </div>

            {/* Display consignment items based on active tab */}
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Item Name</th>
                        <th>Category</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {filterConsignmentItemsByStatus(activeTab).map((item) => (
                        <tr key={item.itemId}>
                            <td>{item.name}</td>
                            <td>{item.category}</td>
                            <td>{item.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        </>
    );
};

export default UserConsignment;
