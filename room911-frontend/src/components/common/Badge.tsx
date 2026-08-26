import React from "react";
import { CheckCircle2, XCircle, AlertTriangle, Shield, Check, X, Lock } from "lucide-react";
import { AccessResult, AdminRole, RestrictionLevel } from "../../types";

export interface BaseBadgeProps {
  variant?: "success" | "danger" | "warning" | "neutral" | "primary" | "purple";
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = "neutral", children, className = "" }: BaseBadgeProps) {
  const styles: Record<string, string> = {
    success: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800",
    danger:  "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-300 dark:border-rose-800",
    warning: "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-800",
    neutral: "bg-muted text-muted-foreground border-border",
    primary: "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-800",
    purple:  "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 border-purple-300 dark:border-purple-800",
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-medium border rounded-full font-sans ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
}

export function AccessBadge({
  status,
  resultado,
}: {
  status?: "activo" | "inactivo" | boolean;
  resultado?: AccessResult | string;
}) {
  if (resultado) {
    if (resultado === "CONCEDIDO") {
      return (
        <Badge variant="success">
          <CheckCircle2 size={12} aria-hidden="true" />
          <span>Concedido</span>
        </Badge>
      );
    }
    if (resultado === "DENEGADO") {
      return (
        <Badge variant="danger">
          <XCircle size={12} aria-hidden="true" />
          <span>Denegado</span>
        </Badge>
      );
    }
    return (
      <Badge variant="warning">
        <AlertTriangle size={12} aria-hidden="true" />
        <span>Falla Sensor</span>
      </Badge>
    );
  }

  const isActivo = status === true || status === "activo";
  return isActivo ? (
    <Badge variant="success">
      <Check size={12} aria-hidden="true" />
      <span>Permitido</span>
    </Badge>
  ) : (
    <Badge variant="danger">
      <X size={12} aria-hidden="true" />
      <span>Denegado</span>
    </Badge>
  );
}

export function AccesoBadge({
  resultado,
  acceso,
}: {
  resultado?: AccessResult | string;
  acceso?: boolean;
}) {
  if (resultado) {
    if (resultado === "CONCEDIDO") {
      return (
        <Badge variant="success">
          <CheckCircle2 size={12} aria-hidden="true" />
          <span>Concedido</span>
        </Badge>
      );
    }
    if (resultado === "DENEGADO") {
      return (
        <Badge variant="danger">
          <XCircle size={12} aria-hidden="true" />
          <span>Denegado</span>
        </Badge>
      );
    }
    return (
      <Badge variant="warning">
        <AlertTriangle size={12} aria-hidden="true" />
        <span>Falla Sensor</span>
      </Badge>
    );
  }

  return acceso ? (
    <Badge variant="success">
      <Check size={12} aria-hidden="true" />
      <span>Permitido</span>
    </Badge>
  ) : (
    <Badge variant="danger">
      <X size={12} aria-hidden="true" />
      <span>Denegado</span>
    </Badge>
  );
}

export function RoleBadge({ role }: { role: AdminRole | string }) {
  if (role === "SUPER_ADMIN") {
    return (
      <Badge variant="purple">
        <Shield size={11} aria-hidden="true" />
        <span>Super Admin</span>
      </Badge>
    );
  }
  if (role === "ADMIN_SISTEMAS") {
    return (
      <Badge variant="primary">
        <span>Sistemas</span>
      </Badge>
    );
  }
  return (
    <Badge variant="neutral">
      <span>Accesos</span>
    </Badge>
  );
}

export function RestrictionBadge({ level }: { level: RestrictionLevel | string }) {
  if (level === "CRITICA" || level === "CRITICA_ESTERIL") {
    return (
      <Badge variant="danger">
        <Lock size={11} aria-hidden="true" />
        <span>Crítica · Sala Limpia</span>
      </Badge>
    );
  }
  if (level === "ALTA") {
    return (
      <Badge variant="warning">
        <span>Alta Restricción</span>
      </Badge>
    );
  }
  if (level === "MEDIA") {
    return (
      <Badge variant="primary">
        <span>Media Restricción</span>
      </Badge>
    );
  }
  return (
    <Badge variant="neutral">
      <span>Baja Restricción</span>
    </Badge>
  );
}
