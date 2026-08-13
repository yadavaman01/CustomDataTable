import { useEffect, useRef } from "react";
import { cn } from "../lib/cn";

interface IndeterminateCheckboxProps {
  checked: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  onChange: () => void;
  "aria-label"?: string;
}

/**
 * Plain native checkbox styled via the `accent-color` CSS property (through
 * --cdt-accent) instead of a design-system Checkbox. accent-color accepts
 * any color string at runtime, so theme.accentColor stays fully dynamic
 * instead of being limited to Tailwind-safelisted classes.
 */
function IndeterminateCheckbox({
  checked,
  indeterminate,
  disabled,
  onChange,
  ...rest
}: IndeterminateCheckboxProps) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = !checked && !!indeterminate;
    }
  }, [checked, indeterminate]);

  return (
    <input
      ref={ref}
      type="checkbox"
      checked={checked}
      disabled={disabled}
      onChange={onChange}
      onClick={(e) => e.stopPropagation()}
      className={cn(
        "h-4 w-4 rounded cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
        "accent-[var(--cdt-accent)]"
      )}
      {...rest}
    />
  );
}

export default IndeterminateCheckbox;
