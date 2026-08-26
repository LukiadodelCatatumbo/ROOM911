import { useState, useEffect } from "react";
import { X, Eye, Type, Sun, Moon, Sparkles, Check } from "lucide-react";

interface AccessibilityModalProps {
  open: boolean;
  onClose: () => void;
}

export function AccessibilityModal({ open, onClose }: AccessibilityModalProps) {
  const [fontSize, setFontSize] = useState<"small" | "normal" | "large">("normal");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    const savedFontSize = (localStorage.getItem("wcag-font-size") as any) || "normal";
    const savedTheme = (localStorage.getItem("wcag-theme") as any) || "light";
    const savedHighContrast = localStorage.getItem("wcag-high-contrast") === "true";

    setFontSize(savedFontSize);
    setTheme(savedTheme);
    setHighContrast(savedHighContrast);
  }, []);

  const applyChanges = (newSize: "small" | "normal" | "large", newTheme: "light" | "dark", newContrast: boolean) => {
    setFontSize(newSize);
    setTheme(newTheme);
    setHighContrast(newContrast);

    localStorage.setItem("wcag-font-size", newSize);
    localStorage.setItem("wcag-theme", newTheme);
    localStorage.setItem("wcag-high-contrast", String(newContrast));

    // Apply to html root
    const root = document.documentElement;
    root.setAttribute("data-font-size", newSize);
    root.setAttribute("data-theme", newTheme);
    root.setAttribute("data-high-contrast", String(newContrast));

    if (newTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    if (newSize === "small") root.style.fontSize = "14px";
    if (newSize === "normal") root.style.fontSize = "16px";
    if (newSize === "large") root.style.fontSize = "18px";
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-xs p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Panel de accesibilidad WCAG 2.1"
    >
      <div
        className="bg-white dark:bg-card border border-border rounded-lg shadow-2xl w-full max-w-[420px] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-white dark:bg-card">
          <div className="flex items-center gap-2">
            <Eye size={18} className="text-primary" />
            <h2 className="text-base font-semibold text-foreground">Accesibilidad (WCAG 2.1)</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar modal"
            className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Font Size */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
              Tamaño de Fuente
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "small" as const, label: "A- (14px)" },
                { id: "normal" as const, label: "A (16px)" },
                { id: "large" as const, label: "A+ (18px)" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => applyChanges(opt.id, theme, highContrast)}
                  className={[
                    "py-2 px-3 text-xs font-medium border rounded-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer",
                    fontSize === opt.id
                      ? "bg-primary text-white border-primary shadow-xs font-bold"
                      : "bg-background border-border text-foreground hover:bg-secondary",
                  ].join(" ")}
                >
                  {fontSize === opt.id && <Check size={12} />}
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Theme */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
              Tema Visual
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => applyChanges(fontSize, "light", highContrast)}
                className={[
                  "py-2 px-3 text-xs font-medium border rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer",
                  theme === "light"
                    ? "bg-primary text-white border-primary shadow-xs font-bold"
                    : "bg-background border-border text-foreground hover:bg-secondary",
                ].join(" ")}
              >
                <Sun size={14} />
                <span>Modo Claro</span>
              </button>
              <button
                type="button"
                onClick={() => applyChanges(fontSize, "dark", highContrast)}
                className={[
                  "py-2 px-3 text-xs font-medium border rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer",
                  theme === "dark"
                    ? "bg-primary text-white border-primary shadow-xs font-bold"
                    : "bg-background border-border text-foreground hover:bg-secondary",
                ].join(" ")}
              >
                <Moon size={14} />
                <span>Modo Oscuro</span>
              </button>
            </div>
          </div>

          {/* High Contrast */}
          <div className="pt-3 border-t border-border flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Alto Contraste</p>
              <p className="text-xs text-muted-foreground">Aumenta la legibilidad para baja visión</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={highContrast}
              onClick={() => applyChanges(fontSize, theme, !highContrast)}
              className={[
                "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border-2 border-transparent transition-colors cursor-pointer",
                highContrast ? "bg-[#1F8A47]" : "bg-muted",
              ].join(" ")}
            >
              <span
                className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                  highContrast ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        </div>

        <div className="px-6 py-3 border-t border-border bg-[#F7F8FA] dark:bg-card flex justify-end">
          <button
            onClick={onClose}
            type="button"
            className="px-4 py-1.5 text-xs font-semibold bg-primary text-white rounded-md hover:bg-[#0A4F8A] transition-colors cursor-pointer"
          >
            Listo
          </button>
        </div>
      </div>
    </div>
  );
}
