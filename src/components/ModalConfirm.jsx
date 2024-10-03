import { Modal, Button } from "react-bootstrap";
import { deleteStaff } from "../services/UserService";
import { toast } from "react-toastify";

const ModalConfirm = (props) => {
  const { show, handleClose, dataStaffDelete, handleDeleteStaffFromModal } =
    props;

  const confirmDelete = async () => {
    try {
      let res = await deleteStaff(dataStaffDelete.id);
      if (res && res.statusCode === 200) {
        toast.success(`Delete staff ${dataStaffDelete.name} succeeded!`);
        handleDeleteStaffFromModal(dataStaffDelete);
        handleClose();
      } else {
        toast.error("Delete staff failed!");
      }
    } catch (error) {
      toast.error("Delete staff error!");
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
          <Modal.Title>Delete Staff</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            This action can't be undone! Do you want to delete this staff?{" "}
            <br />
            <b>Email: {dataStaffDelete?.email} </b>
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
