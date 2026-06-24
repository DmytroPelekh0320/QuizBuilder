import styles from "../styles/ConfirmDialog.module.css";

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  loadingLabel?: string;
  isLoading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmDialog({
  title,
  message,
  confirmLabel,
  cancelLabel = "Cancel",
  loadingLabel = "Working...",
  isLoading = false,
  onCancel,
  onConfirm
}: ConfirmDialogProps) {
  return (
    <div className={styles.overlay} role="presentation">
      <section
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
      >
        <h2 id="confirm-title">{title}</h2>
        <p>{message}</p>

        <div className={styles.actions}>
          <button
            className={styles.cancelButton}
            type="button"
            disabled={isLoading}
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            className={styles.confirmButton}
            type="button"
            disabled={isLoading}
            onClick={onConfirm}
          >
            {isLoading ? loadingLabel : confirmLabel}
          </button>
        </div>
      </section>
    </div>
  );
}
