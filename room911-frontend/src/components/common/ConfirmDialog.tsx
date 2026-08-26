import { useEffect } from "react";
import { AlertTriangle, X, ShieldAlert, CheckCircle2 } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel = "Confirmar Acción",
  cancelLabel = "Cancelar",
  isDestructive = true,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onCancel();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-card text-card-foreground rounded-xl shadow-2xl border border-border overflow-hidden z-10 animate-in zoom-in-95 duration-150">
        {/* Top Header */}
        <div className="p-5 flex items-start gap-4">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
              isDestructive
                ? "bg-destructive/10 text-destructive"
                : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
            }`}
          >
            {isDestructive ? <ShieldAlert size={20} /> : <AlertTriangle size={20} />}
          </div>
          <div className="flex-1 min-w-0 pr-4">
            <h3 id="dialog-title" className="text-base font-semibold text-foreground leading-tight">
              {title}
            </h3>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              {description}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="w-7 h-7 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors -mr-2 -mt-2"
            aria-label="Cerrar"
          >
            <X size={15} />
          </button>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-muted/40 border-t border-border flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-xs font-medium text-foreground bg-background hover:bg-muted border border-border rounded-md transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 text-xs font-semibold rounded-md text-white transition-colors shadow-2xs ${
              isDestructive
                ? "bg-destructive hover:bg-destructive/90"
                : "bg-primary hover:bg-primary/90"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
