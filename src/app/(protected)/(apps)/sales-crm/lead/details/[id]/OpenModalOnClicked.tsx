import React from 'react';

interface ModalProps {
  title: string;
  description: string;
  confirmText: string;
  onConfirm: () => void;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ title, description, confirmText, onConfirm, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{title}</h2>
        <p>{description}</p>
        <button onClick={onConfirm}>{confirmText}</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Modal;
