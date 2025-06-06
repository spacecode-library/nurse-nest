
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-xl text-sm font-normal ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:scale-105",
  {
    variants: {
      variant: {
        default: "bg-brand-primary text-brand-navy hover:bg-brand-primary/90 shadow-brand",
        destructive:
          "bg-error text-white hover:bg-error/90",
        outline:
          "border border-brand-primary bg-transparent text-brand-primary hover:bg-brand-primary hover:text-brand-navy",
        secondary:
          "bg-accent text-white hover:bg-accent/90",
        ghost: "hover:bg-neutral-light hover:text-brand-navy",
        link: "text-brand-blue underline-offset-4 hover:underline",
        professional: "bg-brand-navy text-white hover:bg-brand-navy/90 shadow-professional",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-10 rounded-lg px-4",
        lg: "h-14 rounded-xl px-8",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
