import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../../layouts/header/header";
import { Footer } from "../../layouts/footer/footer";
import ConsignmentForm from "./ConsignmentForm";
import "./Consignment.css";

const Consignment = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const navigate = useNavigate();

  const openForm = () => {
    const email = localStorage.getItem('email');
    const token = localStorage.getItem('token');
    
    if (email && token) {
      setIsFormOpen(true);
    } else {
      navigate('/login');
    }
  };

  const closeForm = () => setIsFormOpen(false);

  return (
    <>
      <Header />
      <div className="consignment-container animated user-select-none">
        <h1 className="consign-title">Ký Gửi Cá Koi</h1>

        <div className="consignment-content">
          <div className="consignment-rules">
            <h2>Quy định gửi hàng</h2>
            <ol>
              <li>
                Tất cả hàng hóa gửi phải tuân thủ quy định pháp luật Việt Nam và
                không thuộc danh mục hàng cấm.
              </li>
              <li>
                Người gửi phải cung cấp đầy đủ thông tin về hàng hóa bao gồm
                tên, loại, nguồn gốc, kích thước, và trọng lượng.
              </li>
              <li>
                Không gửi hàng dễ vỡ hoặc hàng có giá trị cao mà không có biện
                pháp bảo vệ hợp lý.
              </li>
              <li>
                Người gửi chịu trách nhiệm về tính hợp pháp và trung thực của
                thông tin hàng hóa cung cấp.
              </li>
              <li>
                Hàng hóa bị phát hiện vi phạm quy định sẽ bị từ chối tiếp nhận
                hoặc bị xử lý theo quy định pháp luật.
              </li>
            </ol>
          </div>
          <div className="consignment-form-link">
            <h2>Sẵn sàng để ký gửi?</h2>
            <p>Vui lòng điền vào mẫu đơn này.</p>
            <button onClick={openForm} className="consignment-button">
              Đăng Ký Ký Gửi
            </button>
          </div>
        </div>
      </div>
      <Footer />
      <ConsignmentForm isOpen={isFormOpen} onClose={closeForm} />
    </>
  );
};

export default Consignment;
