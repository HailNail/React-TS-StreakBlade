import type { ReactNode } from "react";
import ReactDOM from "react-dom";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
};

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="modal modal-open">
      <div className="modal-box relative bg-base-200">
        <button
          className="btn btn-md btn-circle absolute right-2 top-2"
          onClick={onClose}
        >
          ✕
        </button>
        {children}
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>,
    document.getElementById("modal-root")!
  );
}
