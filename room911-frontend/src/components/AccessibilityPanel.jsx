import { useEffect, useRef, useState } from "react";
import {
    FaUniversalAccess,
    FaSun,
    FaMoon,
    FaFont,
    FaAdjust,
    FaUndo,
    FaTimes,
    FaCheck
} from "react-icons/fa";
import { useAccessibility } from "../context/AccessibilityContext";
import "../styles/AccessibilityPanel.css";

function AccessibilityPanel() {
    const {
        theme,
        fontSize,
        highContrast,
        isOpen,
        setTheme,
        setFontSize,
        setHighContrast,
        resetSettings,
        closePanel,
    } = useAccessibility();

    const modalRef = useRef(null);
    const closeBtnRef = useRef(null);
    const [announcement, setAnnouncement] = useState("");

    // Anunciador para lectores de pantalla
    const announce = (message) => {
        setAnnouncement(message);
        setTimeout(() => setAnnouncement(""), 3000);
    };

    // Control de teclado WCAG 2.1 AA (Escape para cerrar, Trap de Foco)
    useEffect(() => {
        if (!isOpen) return;

        // Enfocar botón de cerrar al abrir
        if (closeBtnRef.current) {
            closeBtnRef.current.focus();
        }

        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                closePanel();
                return;
            }

            if (e.key === "Tab" && modalRef.current) {
                const focusableElements = modalRef.current.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                if (focusableElements.length === 0) return;

                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        lastElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        firstElement.focus();
                        e.preventDefault();
                    }
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, closePanel]);

    if (!isOpen) return null;

    return (
        <div
            className="accessibility-overlay"
            onClick={closePanel}
            aria-hidden="true"
        >
            {/* Notificación aria-live para lecturas de pantalla */}
            <div className="sr-only" aria-live="polite" aria-atomic="true">
                {announcement}
            </div>

            <div
                id="accessibility-panel-modal"
                className="accessibility-modal"
                ref={modalRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="accessibility-panel-title"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="accessibility-header">
                    <div className="accessibility-title-container">
                        <FaUniversalAccess className="accessibility-header-icon" aria-hidden="true" />
                        <h2 id="accessibility-panel-title">Panel de Accesibilidad</h2>
                    </div>
                    <button
                        ref={closeBtnRef}
                        className="accessibility-close-btn"
                        onClick={closePanel}
                        aria-label="Cerrar panel de accesibilidad"
                    >
                        <FaTimes aria-hidden="true" />
                    </button>
                </header>

                <div className="accessibility-body">
                    {/* Opcion 1: Modo Claro / Oscuro */}
                    <fieldset className="accessibility-group">
                        <legend className="accessibility-label">
                            <span className="label-icon-wrapper">
                                <FaSun aria-hidden="true" />
                            </span>
                            Modo de Color
                        </legend>
                        <div className="accessibility-options" role="radiogroup" aria-label="Modo de color">
                            <button
                                type="button"
                                className={`accessibility-opt-btn ${theme === "light" ? "active" : ""}`}
                                onClick={() => {
                                    setTheme("light");
                                    announce("Modo claro activado");
                                }}
                                role="radio"
                                aria-checked={theme === "light"}
                            >
                                <FaSun className="opt-icon" aria-hidden="true" />
                                <span>Modo Claro</span>
                                {theme === "light" && <FaCheck className="check-icon" aria-hidden="true" />}
                            </button>
                            <button
                                type="button"
                                className={`accessibility-opt-btn ${theme === "dark" ? "active" : ""}`}
                                onClick={() => {
                                    setTheme("dark");
                                    announce("Modo oscuro activado");
                                }}
                                role="radio"
                                aria-checked={theme === "dark"}
                            >
                                <FaMoon className="opt-icon" aria-hidden="true" />
                                <span>Modo Oscuro</span>
                                {theme === "dark" && <FaCheck className="check-icon" aria-hidden="true" />}
                            </button>
                        </div>
                    </fieldset>

                    {/* Opcion 2: Tamano de Letra */}
                    <fieldset className="accessibility-group">
                        <legend className="accessibility-label">
                            <span className="label-icon-wrapper">
                                <FaFont aria-hidden="true" />
                            </span>
                            Tamaño de Letra
                        </legend>
                        <div className="accessibility-options font-options" role="radiogroup" aria-label="Tamaño de letra">
                            <button
                                type="button"
                                className={`accessibility-opt-btn font-sm ${fontSize === "small" ? "active" : ""}`}
                                onClick={() => {
                                    setFontSize("small");
                                    announce("Tamaño de letra cambiado a Pequeña");
                                }}
                                role="radio"
                                aria-checked={fontSize === "small"}
                            >
                                <span className="font-badge">A-</span>
                                <span>Pequeña</span>
                                {fontSize === "small" && <FaCheck className="check-icon" aria-hidden="true" />}
                            </button>
                            <button
                                type="button"
                                className={`accessibility-opt-btn font-md ${fontSize === "normal" ? "active" : ""}`}
                                onClick={() => {
                                    setFontSize("normal");
                                    announce("Tamaño de letra cambiado a Normal");
                                }}
                                role="radio"
                                aria-checked={fontSize === "normal"}
                            >
                                <span className="font-badge">A</span>
                                <span>Normal</span>
                                {fontSize === "normal" && <FaCheck className="check-icon" aria-hidden="true" />}
                            </button>
                            <button
                                type="button"
                                className={`accessibility-opt-btn font-lg ${fontSize === "large" ? "active" : ""}`}
                                onClick={() => {
                                    setFontSize("large");
                                    announce("Tamaño de letra cambiado a Grande");
                                }}
                                role="radio"
                                aria-checked={fontSize === "large"}
                            >
                                <span className="font-badge">A+</span>
                                <span>Grande</span>
                                {fontSize === "large" && <FaCheck className="check-icon" aria-hidden="true" />}
                            </button>
                        </div>
                    </fieldset>

                    {/* Opcion 3: Alto Contraste */}
                    <fieldset className="accessibility-group">
                        <legend className="accessibility-label">
                            <span className="label-icon-wrapper">
                                <FaAdjust aria-hidden="true" />
                            </span>
                            Alto Contraste
                        </legend>
                        <div className="contrast-toggle-container">
                            <div className="contrast-info">
                                <span className="contrast-title">Modo de Alto Contraste</span>
                                <span className="contrast-desc">Aumenta los bordes y el contraste para máxima legibilidad</span>
                            </div>
                            <button
                                type="button"
                                className={`accessibility-switch ${highContrast ? "checked" : ""}`}
                                onClick={() => {
                                    const next = !highContrast;
                                    setHighContrast(next);
                                    announce(next ? "Alto contraste activado" : "Alto contraste desactivado");
                                }}
                                role="switch"
                                aria-checked={highContrast}
                                aria-label="Activar o desactivar modo de alto contraste"
                            >
                                <span className="switch-slider" />
                            </button>
                        </div>
                    </fieldset>
                </div>

                <footer className="accessibility-footer">
                    <button
                        type="button"
                        className="btn-reset"
                        onClick={() => {
                            resetSettings();
                            announce("Preferencias de accesibilidad restablecidas");
                        }}
                    >
                        <FaUndo aria-hidden="true" />
                        <span>Restablecer valores</span>
                    </button>
                    <button
                        type="button"
                        className="btn-primary btn-done"
                        onClick={closePanel}
                    >
                        Guardar y Cerrar
                    </button>
                </footer>
            </div>
        </div>
    );
}

export default AccessibilityPanel;
