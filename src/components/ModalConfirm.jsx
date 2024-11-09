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
        toast.success(`Xóa nhân viên ${dataStaffDelete.name} thành công!`);
        handleDeleteStaffFromModal(dataStaffDelete);
        handleClose();
      } else {
        toast.error("Xóa nhân viên thất bại!");
      }
    } catch (error) {
      toast.error("Có lỗi khi xóa nhân viên!");
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
          <Modal.Title>Xóa Nhân Viên</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            Hành động này không thể hoàn tác! Bạn có chắc chắn muốn xóa nhân viên này?{" "}
            <br />
            <b>Email: {dataStaffDelete?.email} </b>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Đóng
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Xác nhận
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalConfirm;
