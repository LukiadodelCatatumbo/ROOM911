package com.room911.entity;

/**
 * Roles del sistema, persistidos como texto (EnumType.STRING).
 * Los valores deben coincidir con los usados en los @PreAuthorize de los
 * controllers y con el union type AdminRole del frontend (types/index.ts).
 */
public enum Rol {
    SUPER_ADMIN,
    ADMIN_ACCESOS,
    ADMIN_SISTEMAS
}
