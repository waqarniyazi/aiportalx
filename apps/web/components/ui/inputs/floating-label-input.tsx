import * as React from "react";
import { cn } from "@/utils";
import { type FloatingInputProps, FloatingInput } from "./base/floating-input";
import { FloatingLabel } from "./base/floating-label";

type FloatingLabelInputProps = FloatingInputProps & {
  containerProps?: React.HTMLAttributes<HTMLDivElement>;
  label?: string;
  error?: boolean;
};

const FloatingLabelInput = React.forwardRef<
  React.ElementRef<typeof FloatingInput>,
  React.PropsWithoutRef<FloatingLabelInputProps>
>(({ id, label, error = false, className, containerProps, ...props }, ref) => {
  return (
    <div
      {...containerProps}
      className={cn(
        "relative",
        error &&
          "[&>*]:text-error [&>fieldset]:border-error [&>fieldset]:dark:border-error",
        containerProps?.className,
      )}
    >
      <FloatingInput
        ref={ref}
        id={id}
        className={cn(
          className,
          "focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-opacity-0",
          {
            "text-error": error,
          },
        )}
        {...props}
      />
      <FloatingLabel
        htmlFor={id}
        size={props.size}
        className={cn("font-medium peer-focus:text-primary", {
          "text-error peer-focus:text-error": error,
        })}
      >
        {label}
      </FloatingLabel>
      <fieldset
        className={cn(
          "pointer-events-none absolute inset-0 -top-[5px] m-0 min-w-0 rounded-md border border-input px-2 py-0 text-left transition-all peer-focus-visible:border-2 peer-focus-visible:border-primary dark:border-input/35 peer-placeholder-shown:[&>legend]:max-w-0 peer-focus:[&>legend]:max-w-full peer-focus-visible:[&>legend]:max-w-full",
        )}
      >
        <legend className="invisible h-3 w-auto max-w-full overflow-hidden whitespace-nowrap p-0 text-xs font-normal leading-4 transition-all">
          <span className="visible inline-block px-1 opacity-0">{label}</span>
        </legend>
      </fieldset>
    </div>
  );
});
FloatingLabelInput.displayName = "FloatingLabelInput";

export { FloatingLabelInput };
