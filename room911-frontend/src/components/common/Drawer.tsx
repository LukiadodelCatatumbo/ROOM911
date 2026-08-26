import React from "react";
import { X } from "lucide-react";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  width?: number | string;
}

export function Drawer({
  open,
  onClose,
  title,
  subtitle,
  children,
  width = 500,
}: DrawerProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="fixed inset-0 bg-foreground/30 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="relative bg-white dark:bg-card border-l border-border h-full flex flex-col shadow-2xl z-10 animate-in slide-in-from-right duration-200"
        style={{ width: typeof width === "number" ? `${width}px` : width, maxWidth: "100vw" }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0 bg-white dark:bg-card">
          <div>
            <h2 className="text-base font-semibold text-foreground">{title}</h2>
            {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar panel"
            className="p-2 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary min-h-[36px] min-w-[36px] flex items-center justify-center transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
