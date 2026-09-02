import { Moon, Sun } from "lucide-react";
import { useTheme, type Theme } from "../../context/ThemeContext";

const themeOptions: Array<{ value: Theme; label: string; icon: typeof Sun }> = [
  { value: "light", label: "Claro", icon: Sun },
  { value: "dark", label: "Oscuro", icon: Moon },
];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div
      role="group"
      aria-label="Seleccionar tema visual"
      className="flex items-center gap-1 p-1 bg-muted/50 border border-border rounded-md"
    >
      {themeOptions.map(({ value, label, icon: Icon }) => {
        const isSelected = theme === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => setTheme(value)}
            aria-pressed={isSelected}
            title={`Usar tema ${label.toLowerCase()}`}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-semibold transition-colors cursor-pointer ${
              isSelected
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-background"
            }`}
          >
            <Icon size={14} aria-hidden="true" />
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
