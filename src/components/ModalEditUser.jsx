// import { useEffect, useState } from "react";
// import { Modal, Button } from "react-bootstrap";
// import { putUpdateUser } from "../services/UserService";
// import { toast } from "react-toastify";

// const ModalEditUser = (props) => {
//   const { show, handleClose, dataUserEdit, handleEditUserFromModal } = props;
//   const [name, setName] = useState("");
//   const [job, setJob] = useState("");

//   const handleEditUser = async () => {
//     let res = await putUpdateUser(name, job);

//     if (!name && !job) {
//       toast.error("Please input name and job");
//       return;
//     }

//     if (res && res.updatedAt) {
//       //success
//       handleEditUserFromModal({
//         id: dataUserEdit.id,
//         first_name: name,
//       });
//       handleClose();
//       setName("");
//       setJob("");
//       toast.success("User is updated!");
//     } else {
//       toast.error("Error!");
//     }
//   };

//   useEffect(() => {
//     if (show) {
//       setName(dataUserEdit.first_name);
//     }
//   }, [dataUserEdit, show]);

//   return (
//     <>
//       <Modal
//         show={show}
//         onHide={handleClose}
//         backdrop="static"
//         keyboard={false}
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>Edit a user</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <>
//             <form>
//               <div className="mb-3">
//                 <label htmlFor="inputName" className="form-label">
//                   Name
//                 </label>
//                 <input
//                   type="email"
//                   value={name}
//                   onChange={(event) => {
//                     setName(event.target.value);
//                   }}
//                   className="form-control"
//                   id="inputName"
//                 />
//               </div>
//               <div className="mb-3">
//                 <label htmlFor="InputJob" className="form-label">
//                   Job
//                 </label>
//                 <input
//                   type="text"
//                   value={job}
//                   onChange={(event) => {
//                     setJob(event.target.value);
//                   }}
//                   className="form-control"
//                   id="InputJob"
//                 />
//               </div>
//             </form>
//           </>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleClose}>
//             Close
//           </Button>
//           <Button variant="primary" onClick={() => handleEditUser()}>
//             Save Changes
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </>
//   );
// };

// export default ModalEditUser;
