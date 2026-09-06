export default function Modal({ title, onClose, children, wide }) {
  return (
    <div className="modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={`modal${wide ? ' modal-wide' : ''}`}>
        <div className="page-header">
          <h2>{title}</h2>
          <button className="icon-btn" onClick={onClose} type="button">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}