import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { postCreateStaff } from "../services/UserService";
import { toast } from "react-toastify";

const ModalAddNew = (props) => {
  const { show, handleClose, handleUpdateTable } = props;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  const handleSaveUser = async () => {
    if (!name || !email || !address || !phone) {
      toast.error("All fields are required!");
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
      console.log(data);
      if (res && res.data && res.data.id) {
        handleClose();
        setName("");
        setEmail("");
        setAddress("");
        setPhone("");
        toast.success("A new staff member has been created successfully!");
        handleUpdateTable(res.data);
      } else {
        toast.error("Error occurred while creating the staff member.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Add new staff</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form>
          <div className="mb-3">
            <label htmlFor="inputName" className="form-label">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="form-control"
              id="inputName"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="inputEmail" className="form-label">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="form-control"
              id="inputEmail"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="inputAddress" className="form-label">
              Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              className="form-control"
              id="inputAddress"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="inputPhone" className="form-label">
              Phone
            </label>
            <input
              type="text"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className="form-control"
              id="inputPhone"
            />
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSaveUser}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalAddNew;
