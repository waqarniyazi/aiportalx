"use client";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "@/utils";
import { type VariantProps } from "class-variance-authority";
import { buttonVariants } from "./variants";

// ----------------------------------------------------------------------

export interface FloatingLabelButonProps
  extends Omit<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      "color" | "value"
    >,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  ring?: boolean;
  // variant?: "destructive" | "secondary" | "link" | "ghost" | "soft" | "filled" | "outline";
  color?:
    | "default"
    | "primary"
    | "secondary"
    | "info"
    | "success"
    | "warning"
    | "error";
  size?: "default" | "sm" | "md" | "lg" | "icon";
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;

  label: string;
  value: React.ReactNode;
  error?: boolean;
}

const FloatingLabelButon = React.forwardRef<
  HTMLButtonElement,
  FloatingLabelButonProps
>(
  (
    {
      className,
      color,
      size,
      asChild = false,
      error = false,
      startIcon,
      endIcon,
      label,
      value,
      ...props
    },
    ref,
  ) => {
    const labelRef = React.useRef<React.ElementRef<"span">>(null);
    const [btnMinWidth, setBtnMinWidth] = React.useState(60);
    const Comp = asChild ? Slot : "button";

    React.useEffect(() => {
      if (!!labelRef.current) {
        const minW =
          !!startIcon || !!endIcon
            ? labelRef.current.clientWidth + 24
            : labelRef.current.clientWidth;
        setBtnMinWidth(minW);
      }
    }, [startIcon, endIcon]);

    return (
      <Comp
        data-start-icon={!!startIcon}
        data-end-icon={!!endIcon}
        style={{
          minWidth: `calc(1.5rem + ${btnMinWidth}px)`,
        }}
        className={cn(
          buttonVariants({ color, size, className }),
          "group relative h-12 justify-start border-0",
          {
            "text-error": !!error,
          },
        )}
        type="button"
        ref={ref}
        {...props}
        data-value={!!value}
      >
        {!!startIcon && <span className="mr-1 flex-shrink-0">{startIcon}</span>}
        <span
          ref={labelRef}
          className={cn(
            "absolute flex-shrink-0 flex-grow text-muted-foreground transition-all group-data-[value=true]:top-2 group-data-[value=true]:-translate-y-4 group-data-[value=true]:text-xs",
            {
              "translate-x-7 group-data-[value=true]:-translate-x-1":
                !!startIcon,
            },
          )}
        >
          {label}
        </span>
        {!!value ? (
          <span className="text-left">{value}</span>
        ) : (
          <span className="w-full" />
        )}
        {!!endIcon && <span className="ml-auto flex-shrink-0">{endIcon}</span>}
        <fieldset
          className={cn(
            "pointer-events-none absolute inset-0 -top-[5px] m-0 min-w-0 rounded-md border border-input px-2 py-0 text-left transition-all group-focus:border-2 group-focus:border-primary group-focus-visible:border-2 group-focus-visible:border-primary dark:border-input/35 group-focus:[&>legend]:max-w-full group-focus-visible:[&>legend]:max-w-full group-data-[value=false]:[&>legend]:max-w-0",
            {
              "text-error border-error": !!error,
            },
          )}
        >
          <legend className="invisible h-3 w-auto max-w-full overflow-hidden whitespace-nowrap p-0 text-xs font-normal leading-4 transition-all">
            <span className="visible inline-block px-1 opacity-0">{label}</span>
          </legend>
        </fieldset>
      </Comp>
    );
  },
);

FloatingLabelButon.displayName = "FloatingLabelButton";

export { FloatingLabelButon };
