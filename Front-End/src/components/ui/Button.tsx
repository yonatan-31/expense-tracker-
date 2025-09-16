import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// keep this a top-level named export (stable across HMR)
export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap focus:outline-none focus:ring-0 rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none  aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary px-5  text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "text-secondary-foreground shadow-sm hover:bg-[#f56565] hover:text-white",
        ghost:
          "flex items-center gap-2 justify-start dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      // make min-w consistent so content length won't change visual size
      size: {
        default:
          "w-[100px] sm:w-[140px] h-9 px-2 py-2 text-sm sm:px-5 sm:py-5 sm:text-sm md:text-base",
        sm: "min-w-[100px] h-8 px-1 py-1 text-xs sm:px-2 sm:py-5 sm:text-sm",
        md: "min-w-[100px] h-8 px-2 py-1 text-xs sm:px-3 sm:py-1.5 sm:text-sm",
        lg: "min-w-[140px] h-10 px-3 py-2 text-sm sm:px-6 sm:py-3 sm:text-base",
        icon: "size-8 sm:size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// explicit props type
export type ButtonProps = React.ComponentPropsWithoutRef<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

// use forwardRef and export as a const — stable exports, HMR friendly
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    // IMPORTANT: pass only variant keys into buttonVariants, append `className` with cn()
    return (
      <Comp
        ref={ref as any}
        data-slot="button"
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
