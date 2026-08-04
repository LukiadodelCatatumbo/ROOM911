import { createContext, useContext, useState, useEffect } from "react";

const STORAGE_KEY = "room911_accessibility_settings";

const defaultSettings = {
    theme: "light",       // "light" | "dark"
    fontSize: "normal",   // "small" | "normal" | "large"
    highContrast: false,  // true | false
};

const AccessibilityContext = createContext();

export function AccessibilityProvider({ children }) {
    const [settings, setSettings] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                return { ...defaultSettings, ...JSON.parse(saved) };
            }
        } catch (e) {
            console.error("Error al cargar la configuración de accesibilidad", e);
        }
        return defaultSettings;
    });

    const [isOpen, setIsOpen] = useState(false);

    // Aplicar atributos al documento HTML y sincronizar localStorage
    useEffect(() => {
        const root = document.documentElement;
        root.setAttribute("data-theme", settings.theme);
        root.setAttribute("data-font-size", settings.fontSize);
        root.setAttribute("data-high-contrast", settings.highContrast ? "true" : "false");

        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
        } catch (e) {
            console.error("Error al guardar la configuración de accesibilidad", e);
        }
    }, [settings]);

    const setTheme = (theme) => {
        setSettings((prev) => ({ ...prev, theme }));
    };

    const setFontSize = (fontSize) => {
        setSettings((prev) => ({ ...prev, fontSize }));
    };

    const setHighContrast = (highContrast) => {
        setSettings((prev) => ({ ...prev, highContrast }));
    };

    const toggleHighContrast = () => {
        setSettings((prev) => ({ ...prev, highContrast: !prev.highContrast }));
    };

    const resetSettings = () => {
        setSettings(defaultSettings);
    };

    const togglePanel = () => setIsOpen((prev) => !prev);
    const openPanel = () => setIsOpen(true);
    const closePanel = () => setIsOpen(false);

    return (
        <AccessibilityContext.Provider
            value={{
                theme: settings.theme,
                fontSize: settings.fontSize,
                highContrast: settings.highContrast,
                isOpen,
                setTheme,
                setFontSize,
                setHighContrast,
                toggleHighContrast,
                resetSettings,
                togglePanel,
                openPanel,
                closePanel,
            }}
        >
            {children}
        </AccessibilityContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAccessibility() {
    const context = useContext(AccessibilityContext);
    if (!context) {
        throw new Error("useAccessibility debe usarse dentro de un AccessibilityProvider");
    }
    return context;
}
