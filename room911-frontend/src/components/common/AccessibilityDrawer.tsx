import { useState, useEffect } from "react";
import {
  Eye,
  Sun,
  Moon,
  Type,
  Sparkles,
  RotateCcw,
  X,
  Keyboard,
  ShieldCheck,
  Check,
} from "lucide-react";

interface AccessibilityDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AccessibilityDrawer({ isOpen, onClose }: AccessibilityDrawerProps) {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    return (localStorage.getItem("room911_theme") as "light" | "dark") || "light";
  });

  const [highContrast, setHighContrast] = useState<boolean>(() => {
    return localStorage.getItem("room911_high_contrast") === "true";
  });

  const [fontSize, setFontSize] = useState<number>(() => {
    return parseInt(localStorage.getItem("room911_font_size") || "16", 10);
  });

  const [reduceMotion, setReduceMotion] = useState<boolean>(() => {
    return localStorage.getItem("room911_reduce_motion") === "true";
  });

  // Apply theme & accessibility attributes to DOM
  useEffect(() => {
    const root = document.documentElement;
    
    // Theme
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("room911_theme", theme);

    // High Contrast
    if (highContrast) {
      root.classList.add("high-contrast");
    } else {
      root.classList.remove("high-contrast");
    }
    localStorage.setItem("room911_high_contrast", String(highContrast));

    // Font Size
    root.style.setProperty("--font-size", `${fontSize}px`);
    root.style.fontSize = `${fontSize}px`;
    localStorage.setItem("room911_font_size", String(fontSize));

    // Reduce motion
    if (reduceMotion) {
      root.classList.add("motion-reduce");
    } else {
      root.classList.remove("motion-reduce");
    }
    localStorage.setItem("room911_reduce_motion", String(reduceMotion));
  }, [theme, highContrast, fontSize, reduceMotion]);

  // Keyboard shortcut listener (Alt + A)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === "a" || e.key === "A")) {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const resetDefaults = () => {
    setTheme("light");
    setHighContrast(false);
    setFontSize(16);
    setReduceMotion(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="Panel de Accesibilidad">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Right Slider Drawer */}
      <div className="relative w-full max-w-sm bg-card text-card-foreground shadow-2xl h-full flex flex-col border-l border-border z-10 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-muted/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-primary/10 text-primary flex items-center justify-center">
              <Eye size={18} />
            </div>
            <div>
              <h2 className="text-sm font-semibold">Panel de Accesibilidad</h2>
              <p className="text-[11px] text-muted-foreground">Estándar Farmacéutico WCAG 2.1 AA</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors"
            aria-label="Cerrar panel de accesibilidad"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs">
          {/* Contraste */}
          <div className="space-y-2.5">
            <label className="font-semibold text-foreground flex items-center gap-1.5">
              <Sparkles size={14} className="text-primary" />
              <span>Modo de Alto Contraste (AAA)</span>
            </label>
            <p className="text-muted-foreground text-[11px]">
              Aumenta los bordes y maximiza la legibilidad con un ratio de contraste superior a 7:1.
            </p>
            <button
              onClick={() => setHighContrast(!highContrast)}
              className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                highContrast
                  ? "bg-primary text-primary-foreground border-primary font-bold shadow-xs"
                  : "bg-background hover:bg-muted border-border text-foreground"
              }`}
            >
              <span>{highContrast ? "Alto Contraste Activado" : "Contraste Estándar"}</span>
              {highContrast && <Check size={16} />}
            </button>
          </div>

          {/* Tema Visual */}
          <div className="space-y-2.5">
            <label className="font-semibold text-foreground flex items-center gap-1.5">
              <Sun size={14} className="text-primary" />
              <span>Tema Visual</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setTheme("light")}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-lg border text-xs font-medium transition-all ${
                  theme === "light"
                    ? "border-primary bg-primary/10 text-primary font-bold"
                    : "border-border hover:bg-muted text-muted-foreground"
                }`}
              >
                <Sun size={14} />
                <span>Claro</span>
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-lg border text-xs font-medium transition-all ${
                  theme === "dark"
                    ? "border-primary bg-primary/10 text-primary font-bold"
                    : "border-border hover:bg-muted text-muted-foreground"
                }`}
              >
                <Moon size={14} />
                <span>Oscuro</span>
              </button>
            </div>
          </div>

          {/* Tamaño de Tipografía */}
          <div className="space-y-2.5">
            <label className="font-semibold text-foreground flex items-center gap-1.5">
              <Type size={14} className="text-primary" />
              <span>Tamaño de Tipografía</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { size: 14, label: "14px", desc: "Compacta" },
                { size: 16, label: "16px", desc: "Normal" },
                { size: 18, label: "18px", desc: "Grande" },
                { size: 20, label: "20px", desc: "Extra" },
              ].map((item) => (
                <button
                  key={item.size}
                  onClick={() => setFontSize(item.size)}
                  className={`flex flex-col items-center justify-center p-2 rounded-lg border text-center transition-all ${
                    fontSize === item.size
                      ? "border-primary bg-primary text-primary-foreground font-bold"
                      : "border-border hover:bg-muted text-foreground"
                  }`}
                >
                  <span className="text-xs">{item.label}</span>
                  <span className="text-[9px] opacity-75">{item.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Atajos de Teclado */}
          <div className="p-3.5 bg-muted/40 rounded-lg border border-border space-y-2">
            <div className="flex items-center gap-1.5 font-semibold text-foreground">
              <Keyboard size={14} className="text-primary" />
              <span>Navegación por Teclado</span>
            </div>
            <ul className="space-y-1.5 text-[11px] text-muted-foreground">
              <li className="flex justify-between items-center">
                <span>Abrir / Cerrar Accesibilidad</span>
                <kbd className="px-1.5 py-0.5 rounded bg-background border border-border font-mono text-[10px]">Alt + A</kbd>
              </li>
              <li className="flex justify-between items-center">
                <span>Cerrar diálogos activos</span>
                <kbd className="px-1.5 py-0.5 rounded bg-background border border-border font-mono text-[10px]">Esc</kbd>
              </li>
              <li className="flex justify-between items-center">
                <span>Navegar interactivos</span>
                <kbd className="px-1.5 py-0.5 rounded bg-background border border-border font-mono text-[10px]">Tab / Shift+Tab</kbd>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-muted/20 flex items-center justify-between">
          <button
            onClick={resetDefaults}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-medium transition-colors"
          >
            <RotateCcw size={13} />
            <span>Restablecer</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-primary text-primary-foreground rounded-md text-xs font-semibold hover:bg-primary/90 transition-colors"
          >
            Listo
          </button>
        </div>
      </div>
    </div>
  );
}

/** Pestaña flotante lateral derecha fija en pantalla (más baja, cercana a la esquina inferior derecha) */
export function AccessibilityFloatingTrigger({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed right-0 bottom-24 z-40 bg-[#0D1B2E] text-white hover:bg-primary border-y border-l border-[#1E3050] hover:border-primary shadow-xl rounded-l-md px-2 py-3 flex flex-col items-center gap-1.5 transition-all duration-200 group focus:outline-hidden focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer"
      title="Opciones de Accesibilidad (Alt + A)"
      aria-label="Abrir panel lateral de accesibilidad"
    >
      <Eye size={16} className="text-sky-400 group-hover:text-white transition-colors" />
      <span className="text-[9px] font-mono font-bold tracking-widest [writing-mode:vertical-rl] uppercase text-slate-300 group-hover:text-white">
        Accesibilidad
      </span>
    </button>
  );
}
