function ConfirmDialog({ transaction, onConfirm, onCancel }) {
  return (
    <div className="dialog-overlay" onClick={onCancel}>
      <div className="dialog-box" onClick={(e) => e.stopPropagation()}>
        <span className="dialog-icon">🍃</span>
        <h3>Remove Transaction</h3>
        <p>Are you sure you want to delete</p>
        <p className="dialog-txn">"{transaction.description}" — ${transaction.amount.toLocaleString()}</p>
        <div className="dialog-actions">
          <button className="btn-cancel" onClick={onCancel}>Keep it</button>
          <button className="btn-confirm-delete" onClick={onConfirm}>Yes, delete</button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;