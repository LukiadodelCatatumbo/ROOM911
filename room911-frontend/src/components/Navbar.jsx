import { useRef } from "react";
import { FaUniversalAccess } from "react-icons/fa";
import { useAccessibility } from "../context/AccessibilityContext";
import AccessibilityPanel from "./AccessibilityPanel";

function Navbar() {
    const { isOpen, togglePanel } = useAccessibility();
    const accessibilityBtnRef = useRef(null);

    return (
        <header className="navbar">
            <h2>
                Sistema ROOM_911
            </h2>

            <div className="navbar-actions">
                <button
                    ref={accessibilityBtnRef}
                    className="btn-accessibility"
                    onClick={togglePanel}
                    aria-label="Abrir opciones de accesibilidad"
                    aria-expanded={isOpen}
                    aria-controls="accessibility-panel-modal"
                    title="Accesibilidad"
                >
                    <FaUniversalAccess className="btn-icon" aria-hidden="true" />
                    <span>Accesibilidad</span>
                </button>

                <div className="user-badge" aria-label="Usuario administrador">
                    👤 Administrador
                </div>
            </div>

            <AccessibilityPanel />
        </header>
    );
}

export default Navbar;