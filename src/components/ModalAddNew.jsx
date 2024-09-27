import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { postCreateStaff } from "../services/UserService";
import { toast } from "react-toastify";

const ModalAddNew = (props) => {
  const { show, handleClose, handleUpdateTable } = props;
  const [name, setName] = useState("");
  const [job, setJob] = useState("");

  const handleSaveUser = async () => {
    let res = await postCreateStaff(data);
    // console.log(res);

    if (!name && !job) {
      toast.error("Please input name and job");
      return;
    }

    if (res && res.id) {
      //success
      handleClose();
      setName("");
      setJob("");
      toast.success("A User is create successed!");
      handleUpdateTable({
        first_name: name,
        id: res.id,
        email: name + "@gmail.com",
      });
    } else {
      //error
      toast.error("Error!");
    }
  };

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add new user</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <>
            <form>
              <div className="mb-3">
                <label htmlFor="inputName" className="form-label">
                  Name
                </label>
                <input
                  type="email"
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                  }}
                  className="form-control"
                  id="inputName"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="InputJob" className="form-label">
                  Job
                </label>
                <input
                  type="text"
                  value={job}
                  onChange={(event) => {
                    setJob(event.target.value);
                  }}
                  className="form-control"
                  id="InputJob"
                />
              </div>
            </form>
          </>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => handleSaveUser()}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalAddNew;
