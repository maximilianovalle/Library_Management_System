import React from 'react';
import './ConfirmationDialog.css';

const ConfirmationDialog = ({ 
  isOpen, 
  title, 
  message, 
  confirmText = "Confirm", 
  cancelText = "Cancel", 
  onConfirm, 
  onCancel,
  type = "default" // default, danger, warning
}) => {
  if (!isOpen) return null;
  
  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className={`confirmation-dialog ${type}`} onClick={e => e.stopPropagation()}>
        <div className="confirmation-header">
          <h3>{title}</h3>
          <button className="close-button" onClick={onCancel}>&times;</button>
        </div>
        
        <div className="confirmation-body">
          <p>{message}</p>
        </div>
        
        <div className="confirmation-actions">
          <button 
            className="cancel-button" 
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button 
            className={`confirm-button ${type}`} 
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;