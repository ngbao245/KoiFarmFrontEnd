import { useState } from "react";
import { postCreateStaff } from "../services/UserService";
import { toast } from "react-toastify";
import "./ModalAddNew.css";

const ModalAddNew = ({ show, handleClose, handleUpdateTable }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  const handleSaveStaff = async () => {
    if (!name || !email || !address || !phone) {
      toast.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    const data = {
      name,
      email,
      password: "123456",
      address,
      phone,
      roleId: "2",
    };

    try {
      const res = await postCreateStaff(data);
      if (res && res.data && res.data.id) {
        handleClose();
        setName("");
        setEmail("");
        setAddress("");
        setPhone("");
        toast.success("Đã tạo nhân viên mới thành công!");
        handleUpdateTable(res.data);
      } else {
        toast.error("Có lỗi xảy ra khi tạo nhân viên.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Thêm Nhân Viên Mới</h2>
          <button className="modal-close-button" onClick={handleClose}>
            &times;
          </button>
        </div>
        <form>
          <div className="form-group">
            <label htmlFor="inputName">Tên:</label>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              id="inputName"
            />
          </div>
          <div className="form-group">
            <label htmlFor="inputEmail">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              id="inputEmail"
            />
          </div>
          <div className="form-group">
            <label htmlFor="inputAddress">Địa chỉ:</label>
            <input
              type="text"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              id="inputAddress"
            />
          </div>
          <div className="form-group">
            <label htmlFor="inputPhone">Số điện thoại:</label>
            <input
              type="text"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              id="inputPhone"
            />
          </div>
          <div className="modal-footer">
            <button type="button" className="cancel-button" onClick={handleClose}>
              Hủy
            </button>
            <button type="button" className="submit-button" onClick={handleSaveStaff}>
              Thêm Nhân Viên
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalAddNew;
