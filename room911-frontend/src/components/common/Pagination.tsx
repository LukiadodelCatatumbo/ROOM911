import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  itemName?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  itemName = "registros",
}: PaginationProps) {
  if (totalItems === 0) return null;

  const start = (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex items-center justify-between px-6 py-3 border-t border-border bg-white dark:bg-card text-xs">
      <span className="text-muted-foreground font-mono">
        {start}–{end} de {totalItems} {itemName}
      </span>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1}
          className="p-1.5 rounded-md border border-border bg-background hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed text-foreground transition-colors flex items-center justify-center shadow-2xs"
          aria-label="Página anterior"
          title="Página anterior"
        >
          <ChevronLeft size={15} />
        </button>
        <span className="px-3 py-1 font-mono text-muted-foreground text-xs font-medium select-none">
          <span className="text-foreground font-bold">{currentPage}</span> / {Math.max(1, totalPages)}
        </span>
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage >= totalPages}
          className="p-1.5 rounded-md border border-border bg-background hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed text-foreground transition-colors flex items-center justify-center shadow-2xs"
          aria-label="Página siguiente"
          title="Página siguiente"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}
