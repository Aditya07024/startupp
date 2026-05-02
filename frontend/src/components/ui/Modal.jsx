export default function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="card-glass w-full max-w-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-[1.25rem] font-bold tracking-[-0.03em]">{title}</h3>
          <button onClick={onClose} className="btn-ghost">Close</button>
        </div>
        {children}
      </div>
    </div>
  );
}
