import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import {
  AccessibilityDrawer,
  AccessibilityFloatingTrigger,
} from "../common/AccessibilityDrawer";
import { ShieldCheck, Eye } from "lucide-react";

export function AppLayout() {
  const location = useLocation();
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);

  const getBreadcrumb = () => {
    const path = location.pathname;
    if (path.includes("/dashboard")) return "Panel Principal y Operativo";
    if (path.includes("/empleados/")) return "Directorio de Personal / Expediente";
    if (path.includes("/empleados")) return "Directorio de Personal y Empleados";
    if (path.includes("/departamentos")) return "Áreas y Departamentos Farmacéuticos";
    if (path.includes("/historial")) return "Registro Global de Auditoría & Intentos";
    if (path.includes("/administradores")) return "Administración de Cuentas y Roles";
    return "Panel";
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground font-sans">
      {/* Persistent Left Floating Tab Trigger for Accessibility */}
      <AccessibilityFloatingTrigger onClick={() => setIsAccessibilityOpen(true)} />

      {/* Main Sidebar */}
      <Sidebar />

      {/* Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#F7F8FA] dark:bg-background">
        {/* Top Header Bar */}
        <header className="h-14 border-b border-border bg-white dark:bg-card px-6 flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
            <span className="font-bold text-primary">ROOM_911</span>
            <span>›</span>
            <span className="text-foreground font-medium">{getBreadcrumb()}</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Normative Badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-[11px] font-mono font-medium">
              <ShieldCheck size={13} />
              <span>VALIDACIÓN BPF</span>
            </div>
          </div>
        </header>

        {/* Main Routed Page Container */}
        <main className="flex-1 overflow-y-auto min-w-0 flex flex-col">
          <Outlet />
        </main>
      </div>

      {/* Left Slider Accessibility Drawer */}
      <AccessibilityDrawer
        isOpen={isAccessibilityOpen}
        onClose={() => setIsAccessibilityOpen(false)}
      />
    </div>
  );
}
