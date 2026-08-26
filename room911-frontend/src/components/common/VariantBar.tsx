export interface VariantOption<T extends string> {
  value: T;
  label: string;
  desc?: string;
  description?: string;
}

export interface VariantBarProps<T extends string> {
  options: VariantOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

export function VariantBar<T extends string>({
  options,
  value,
  onChange,
}: VariantBarProps<T>) {
  const current = options.find((o) => o.value === value) || options[0];
  const descriptionText = current?.desc || current?.description || "";

  return (
    <div className="px-6 py-2 bg-[#EEF4FB] dark:bg-muted/40 border-b border-[#C2D8F0] dark:border-border flex items-center gap-3 flex-wrap">
      <div className="flex items-center gap-0.5 bg-white dark:bg-card border border-[#C2D8F0] dark:border-border rounded-sm p-0.5 shadow-xs">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            aria-pressed={value === o.value}
            title={o.desc || o.description}
            className={[
              "px-3 py-1 text-xs font-medium rounded-sm transition-colors cursor-pointer",
              "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary",
              value === o.value
                ? "bg-primary text-white font-semibold shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/60",
            ].join(" ")}
          >
            {o.label}
          </button>
        ))}
      </div>
      {descriptionText && (
        <p className="text-xs text-[#0B5FA5] dark:text-blue-400">
          <span className="font-semibold">{current.label}:</span> {descriptionText}
        </p>
      )}
    </div>
  );
}
