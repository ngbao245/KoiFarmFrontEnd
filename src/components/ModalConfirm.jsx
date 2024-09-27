import { Modal, Button } from "react-bootstrap";
import { deleteStaff } from "../services/UserService";
import { toast } from "react-toastify";

const ModalConfirm = (props) => {
  const { show, handleClose, dataUserDelete, handleDeleteUserFromModal } =
    props;

  const confirmDelete = async () => {
    try {
      let res = await deleteStaff(dataUserDelete.id);
      if (res && res.statusCode === 200) {
        toast.success("Delete user succeeded!");
        handleDeleteUserFromModal(dataUserDelete); // Update list in Admin component
        handleClose(); // Close the modal
      } else {
        toast.error("Delete user failed!");
      }
    } catch (error) {
      toast.error("Delete user error!");
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
          <Modal.Title>Delete User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            This action can't be undone! Do you want to delete this user? <br />
            <b>Email: {dataUserDelete?.email} </b>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalConfirm;
