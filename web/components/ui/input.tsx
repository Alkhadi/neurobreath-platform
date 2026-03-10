import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // Base layout
          "flex h-10 w-full rounded-md px-3 py-2 text-sm ring-offset-background",
          // Background + text
          "bg-[var(--nb-form-bg)] text-[var(--nb-form-input-text)]",
          // Border — default → hover → focus
          "border border-[var(--nb-form-border)]",
          "hover:border-[var(--nb-form-border-hover)]",
          // Placeholder
          "placeholder:text-[var(--nb-form-placeholder)]",
          // Focus-visible ring
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--nb-form-ring-focus)] focus-visible:ring-offset-2 focus-visible:border-[var(--nb-form-border-focus)]",
          // Error state (set by FormControl via aria-invalid)
          "aria-[invalid=true]:border-[var(--nb-form-error-border)] aria-[invalid=true]:bg-[var(--nb-form-error-bg)] aria-[invalid=true]:focus-visible:ring-[var(--nb-form-error-ring)]",
          // Read-only state
          "read-only:bg-[var(--nb-form-bg-readonly)] read-only:cursor-default read-only:focus-visible:ring-0 read-only:focus-visible:border-[var(--nb-form-border)]",
          // Disabled state
          "disabled:cursor-not-allowed disabled:bg-[var(--nb-form-bg-disabled)] disabled:text-[var(--nb-form-disabled-text)] disabled:border-[var(--nb-form-disabled-border)]",
          // File input
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[var(--nb-form-input-text)]",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }