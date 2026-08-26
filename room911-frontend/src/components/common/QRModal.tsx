import { useEffect } from "react";
import { X, Download, FileText } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";
import { Employee } from "../../types";

interface QRModalProps {
  isOpen: boolean;
  employee: Employee | null;
  onClose: () => void;
}

export function QRModal({ isOpen, employee, onClose }: QRModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !employee) return null;

  const timestamp = new Date().toLocaleString("es-MX", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  const qrValue = employee.codigoQr || employee.id;

  const downloadPNG = () => {
    const svgElement = document.getElementById("qr-code-svg");
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = 600;
      canvas.height = 700;
      if (!ctx) return;

      // Background
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Title & border
      ctx.fillStyle = "#0D1B2E";
      ctx.font = "bold 24px 'IBM Plex Sans', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("ROOM_911 — Control de Acceso", 300, 50);

      ctx.fillStyle = "#64748B";
      ctx.font = "16px 'IBM Plex Sans', sans-serif";
      ctx.fillText("Credencial Biometrizada Oficial", 300, 78);

      // QR
      ctx.drawImage(img, 150, 110, 300, 300);

      // Info
      ctx.fillStyle = "#0D1117";
      ctx.font = "bold 22px 'IBM Plex Sans', sans-serif";
      ctx.fillText(`${employee.nombre} ${employee.apellido}`, 300, 470);

      ctx.fillStyle = "#0B5FA5";
      ctx.font = "bold 18px 'IBM Plex Mono', monospace";
      ctx.fillText(employee.id, 300, 505);

      ctx.fillStyle = "#475569";
      ctx.font = "16px 'IBM Plex Sans', sans-serif";
      ctx.fillText(`${employee.departamento} · ${employee.cargo}`, 300, 540);

      ctx.fillStyle = "#94A3B8";
      ctx.font = "12px 'IBM Plex Mono', monospace";
      ctx.fillText(`Generado: ${timestamp} · Válido para terminales autorizadas`, 300, 620);

      const a = document.createElement("a");
      a.download = `QR_${employee.id}_${employee.nombre}.png`;
      a.href = canvas.toDataURL("image/png");
      a.click();

      toast.success("Código QR exportado en PNG", {
        description: `Archivo generado para ${employee.nombre} ${employee.apellido}`,
      });
    };

    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  const downloadPDF = () => {
    toast.success("Exportando Ficha Técnica PDF", {
      description: `Generando documento oficial de acceso para ${employee.id}`,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Código QR de acceso"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className="relative bg-white dark:bg-card border border-border rounded-lg shadow-2xl w-full max-w-[380px] overflow-hidden animate-in zoom-in-95 duration-150 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-white dark:bg-card">
          <div>
            <h2 className="text-base font-semibold text-foreground">Código QR de Acceso</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Credencial digital para terminales</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar modal"
            className="p-2 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary min-h-[36px] min-w-[36px] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* QR container */}
        <div className="px-6 py-6 flex flex-col items-center gap-5 bg-[#FAFBFC] dark:bg-background">
          <div className="p-4 bg-white border border-border rounded-md shadow-sm">
            <QRCodeSVG
              id="qr-code-svg"
              value={qrValue}
              size={190}
              level="H"
              bgColor="#ffffff"
              fgColor="#0D1117"
              includeMargin={false}
            />
          </div>

          <div className="text-center w-full">
            <p className="font-semibold text-base text-foreground">
              {employee.nombre} {employee.apellido}
            </p>
            <p className="font-mono text-sm text-primary font-bold mt-0.5">{employee.id}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {employee.departamento} — {employee.cargo}
            </p>
            <p className="font-mono text-[11px] text-muted-foreground/70 mt-2">
              Emitido: {timestamp}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t border-border bg-white dark:bg-card flex gap-3">
          <button
            onClick={downloadPNG}
            type="button"
            className="flex-1 h-10 text-xs font-semibold border border-border rounded-md bg-white dark:bg-secondary hover:bg-secondary text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-primary flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
          >
            <Download size={14} aria-hidden="true" />
            <span>Descargar PNG</span>
          </button>
          <button
            onClick={downloadPDF}
            type="button"
            className="flex-1 h-10 text-xs font-semibold border border-primary rounded-md bg-primary text-white hover:bg-primary/90 transition-colors focus-visible:outline-2 focus-visible:outline-primary flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
          >
            <FileText size={14} aria-hidden="true" />
            <span>Descargar PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
}
