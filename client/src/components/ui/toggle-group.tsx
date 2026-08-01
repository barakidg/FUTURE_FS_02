"use client"

import * as React from "react"
import { Toggle as TogglePrimitive } from "@base-ui/react/toggle"
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { toggleVariants } from "@/components/ui/toggle"

const toggleGroupVariants = cva(
  "group/toggle-group flex w-fit items-center gap-0.5 rounded-lg bg-muted p-1",
  {
    variants: {
      variant: {
        default: "",
        outline: "border border-input bg-transparent p-0.5",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function ToggleGroup({
  className,
  variant = "default",
  ...props
}: React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive> &
  VariantProps<typeof toggleGroupVariants>) {
  return (
    <ToggleGroupPrimitive
      data-slot="toggle-group"
      className={cn(toggleGroupVariants({ variant }), className)}
      {...props}
    />
  )
}

function ToggleGroupItem({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof TogglePrimitive>) {
  return (
    <TogglePrimitive
      data-slot="toggle-group-item"
      className={cn(
        toggleVariants({ variant: "default", size: "sm" }),
        "min-w-0 flex-1 rounded-md px-3 data-[pressed]:bg-background data-[pressed]:text-foreground data-[pressed]:shadow-sm",
        className
      )}
      {...props}
    />
  )
}

export { ToggleGroup, ToggleGroupItem, toggleGroupVariants }