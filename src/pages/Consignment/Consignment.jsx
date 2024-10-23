import React, { useState } from 'react';
import { createConsignment } from '../../services/ConsignmentService';
import { toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";
import './ConsignmentForm.css';

const ConsignmentForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        origin: '',
        sex: '',
        age: 0,
        size: '',
        species: ''
    });

    const navigate = useNavigate();

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await createConsignment(formData);

            if (response.statusCode === 201) {
                setSuccess(true);
                setFormData({
                    name: '',
                    category: '',
                    origin: '',
                    sex: '',
                    age: 0,
                    size: '',
                    species: '',
                });
                toast.success("Successfully created a consignment");
                setError(null);
            }
        } catch (err) {
            toast.error('Failed to create consignment item. Please try again.');
            setSuccess(false);
        }
    };

    return (
        <>
            <div className="back-arrow">
                <i className="fa-solid fa-arrow-left" onClick={() => navigate(-1)}></i>
            </div>

            <div className="consignment-wrapper">
                <div className="consignment-container mt-5">
                    <h1 className="text-center mb-4">Create Consignment Item</h1>

                    {error && <p className="alert alert-danger">{error}</p>}
                    {success && <p className="alert alert-success">Consignment Item created successfully!</p>}

                    <form onSubmit={handleSubmit} className="consignment-card p-4 shadow-sm">
                        <div className="consignment-form-group mb-3">
                            <label>Name:</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="form-control"
                                required
                            />
                        </div>

                        <div className="consignment-form-group mb-3">
                            <label>Category:</label>
                            <input
                                type="text"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="form-control"
                                required
                            />
                        </div>

                        <div className="consignment-form-group mb-3">
                            <label>Origin:</label>
                            <input
                                type="text"
                                name="origin"
                                value={formData.origin}
                                onChange={handleChange}
                                className="form-control"
                                required
                            />
                        </div>

                        <div className="consignment-form-group mb-3">
                            <label>Sex:</label>
                            <input
                                type="text"
                                name="sex"
                                value={formData.sex}
                                onChange={handleChange}
                                className="form-control"
                                required
                            />
                        </div>

                        <div className="consignment-form-group mb-3">
                            <label>Age:</label>
                            <input
                                type="number"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                className="form-control"
                                required
                            />
                        </div>

                        <div className="consignment-form-group mb-3">
                            <label>Size:</label>
                            <input
                                type="text"
                                name="size"
                                value={formData.size}
                                onChange={handleChange}
                                className="form-control"
                                required
                            />
                        </div>

                        <div className="consignment-form-group mb-3">
                            <label>Species:</label>
                            <input
                                type="text"
                                name="species"
                                value={formData.species}
                                onChange={handleChange}
                                className="form-control"
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary w-100">Submit</button>
                    </form>
                </div>

                <div className="consignment-rules">
                    <h2>Quy định gửi hàng</h2>
                    <p>
                        1. Tất cả hàng hóa gửi phải tuân thủ quy định pháp luật Việt Nam và không thuộc danh mục hàng cấm.
                    </p>
                    <p>
                        2. Người gửi phải cung cấp đầy đủ thông tin về hàng hóa bao gồm tên, loại, nguồn gốc, kích thước, và trọng lượng.
                    </p>
                    <p>
                        3. Không gửi hàng dễ vỡ hoặc hàng có giá trị cao mà không có biện pháp bảo vệ hợp lý.
                    </p>
                    <p>
                        4. Người gửi chịu trách nhiệm về tính hợp pháp và trung thực của thông tin hàng hóa cung cấp.
                    </p>
                    <p>
                        5. Hàng hóa bị phát hiện vi phạm quy định sẽ bị từ chối tiếp nhận hoặc bị xử lý theo quy định pháp luật.
                    </p>
                </div>
            </div>
        </>
    );
};

export default ConsignmentForm;
