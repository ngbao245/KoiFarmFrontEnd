import React from 'react';
import './ConfirmationModal.css';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>{message}</p>
        <div className="modal-buttons">
          <button onClick={onConfirm} className="btn btn-danger">Xác nhận</button>
          <button onClick={onClose} className="btn btn-secondary">Hủy</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
