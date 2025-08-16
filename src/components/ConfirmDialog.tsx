type ConfirmDialogProps = {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  message,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <div className="p-4 rounded-lg">
      <h3 className="font-bold text-2xl text-center">{message}</h3>
      <div className="modal-action flex justify-around">
        <button className="btn btn-lg btn-error" onClick={onConfirm}>
          Yes
        </button>
        <button className="btn btn-lg btn-success" onClick={onCancel}>
          No
        </button>
      </div>
    </div>
  );
}
