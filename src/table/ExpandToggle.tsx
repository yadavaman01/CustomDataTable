import { ChevronRight } from "lucide-react";
import { cn } from "../lib/cn";

interface ExpandToggleProps {
  expanded: boolean;
  onToggle: () => void;
}

function ExpandToggle({ expanded, onToggle }: ExpandToggleProps) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex h-7 w-7 items-center justify-center rounded-md",
        "bg-transparent transition-colors hover:bg-black/5",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--cdt-accent)]"
      )}
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      aria-label={expanded ? "Collapse row" : "Expand row"}
      aria-expanded={expanded}
    >
      <ChevronRight
        className={cn(
          "h-4 w-4 transition-transform duration-200 text-[var(--cdt-expand-icon)]",
          expanded && "rotate-90"
        )}
      />
    </button>
  );
}

export default ExpandToggle;
