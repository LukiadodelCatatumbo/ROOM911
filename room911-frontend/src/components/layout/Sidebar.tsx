import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Building2,
  FileText,
  ShieldAlert,
  Smartphone,
  Lock,
  LogOut,
} from "lucide-react";
import { authService } from "../../services/authService";

const menuItems = [
  {
    category: "GESTIÓN Y CONTROL",
    items: [
      { label: "Panel Principal", path: "/dashboard", icon: LayoutDashboard, roles: null },
      { label: "Personal y Empleados", path: "/empleados", icon: Users, roles: null },
      { label: "Áreas y Departamentos", path: "/departamentos", icon: Building2, roles: null },
      { label: "Auditoría y Registros", path: "/historial", icon: FileText, roles: null },
      // Solo SUPER_ADMIN y ADMIN_SISTEMAS gestionan cuentas (coincide con los @PreAuthorize del backend)
      {
        label: "Administradores",
        path: "/administradores",
        icon: ShieldAlert,
        roles: ["SUPER_ADMIN", "ADMIN_SISTEMAS"],
      },
    ],
  },
  {
    category: "TERMINALES Y MÓVIL",
    items: [
      { label: "Credencial Móvil (Demo)", path: "/credencial/EMP-0042", icon: Smartphone, roles: null },
    ],
  },
];

export function Sidebar() {
  const location = useLocation();
  const user = authService.getUser();
  const rol = user?.rol;

  const gruposFiltrados = menuItems
    .map((group) => ({
      ...group,
      items: group.items.filter(
        (item) => !item.roles || (rol != null && item.roles.includes(rol))
      ),
    }))
    .filter((group) => group.items.length > 0);

const handleLogout = () => {
  authService.logout();
  window.location.replace("/login");
};

  return (
    <aside
      className="w-64 shrink-0 flex flex-col justify-between border-r border-[#1E3050] text-slate-300 select-none z-20"
      style={{ background: "#0D1B2E" }}
      aria-label="Barra lateral de navegación principal"
    >
      {/* Brand Header */}
      <div>
        <div className="p-5 border-b border-[#1E3050] flex items-center gap-3">
          <div className="w-9 h-9 bg-primary flex items-center justify-center rounded-sm shadow-md">
            <Lock size={18} className="text-white" aria-hidden="true" />
          </div>
          <div>
            <span className="text-white font-bold text-sm font-mono tracking-wider">ROOM_911</span>
            <p className="text-[10px] text-[#64748B] uppercase tracking-widest font-semibold">
              Control de Acceso
            </p>
          </div>
        </div>

        {/* Menu Navigation */}
        <nav className="p-3 space-y-6">
          {gruposFiltrados.map((group) => (
            <div key={group.category}>
              <p className="px-3 text-[10px] font-mono text-[#64748B] tracking-wider uppercase mb-2 font-semibold">
                {group.category}
              </p>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive =
                    item.path === "/dashboard"
                      ? location.pathname === "/" || location.pathname === "/dashboard"
                      : location.pathname.startsWith(item.path);
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-medium transition-colors ${
                        isActive
                          ? "bg-primary text-white shadow-xs font-semibold"
                          : "text-slate-300 hover:bg-[#162740] hover:text-white"
                      }`}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <Icon size={16} className={isActive ? "text-white" : "text-slate-400"} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-[#1E3050] space-y-3">
        <div className="bg-[#142338] p-3 rounded-md border border-[#1E3050]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400 uppercase">SESIÓN ACTIVA</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" title="En línea" />
          </div>
          <p className="text-xs font-semibold text-white mt-1 truncate">
            {user?.nombre || user?.usuario || "Usuario"}
          </p>
          <p className="text-[11px] text-slate-400 truncate">
            {user?.rol === "SUPER_ADMIN"
              ? "Super Administrador"
              : user?.rol === "ADMIN_ACCESOS"
              ? "Administrador de Accesos"
              : user?.rol === "ADMIN_SISTEMAS"
              ? "Administrador de Sistemas"
              : user?.rol || "—"}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-md text-xs font-semibold text-rose-300 bg-rose-500/10 border border-rose-400/30 hover:text-rose-100 hover:bg-rose-500/25 hover:border-rose-400/60 transition-colors"
          aria-label="Cerrar sesión"
        >
          <LogOut size={14} />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}
