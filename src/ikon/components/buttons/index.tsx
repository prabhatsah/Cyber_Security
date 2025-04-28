import React from 'react'
import { Tooltip } from '@/ikon/components/tooltip'
import { Button, buttonVariants } from '@/shadcn/ui/button'
import { type VariantProps } from "class-variance-authority"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    children: React.ReactNode,
    asChild?: boolean,
}

export interface ButtonWithTooltipProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    children: React.ReactNode,
    asChild?: boolean,
    tooltipContent: string | React.ReactNode
}

export function TextButton({ children, variant, asChild = false, size, ...props }: ButtonProps) {
    return (
        <Button variant={variant} size={size} {...props} asChild={asChild}>
            {children}
        </Button>
    )
}

export function TextButtonWithTooltip({ children, variant, asChild = false, size, tooltipContent, ...props }: ButtonWithTooltipProps) {
    return (
        <Tooltip tooltipContent={tooltipContent}>
            <TextButton variant={variant} size={size} {...props} asChild={asChild}>
                {children}
            </TextButton>
        </Tooltip>
    )
}


export function IconTextButton({ children, variant, asChild = false, size, ...props }: ButtonProps) {
    return (
        <Button variant={variant || "outline"} size={size || "sm"} {...props} asChild={asChild}>
            {children}
        </Button>
    )
}

export function IconTextButtonWithTooltip({ children, variant, size, asChild = false, tooltipContent, ...props }: ButtonWithTooltipProps) {
    return (
        <Tooltip tooltipContent={tooltipContent}>
            <IconTextButton variant={variant} size={size} {...props} asChild={asChild}>
                {children}
            </IconTextButton>
        </Tooltip>
    )
}


export function IconButton({ children, variant, size, asChild = false, ...props }: ButtonProps) {
    return (
        <Button variant={variant || "outline"} size={size || "icon"} {...props} asChild={asChild}>
            {children}
        </Button>
    )
}

export function IconButtonWithTooltip({ children, tooltipContent, asChild = false, variant, size, ...props }: ButtonWithTooltipProps) {
    return (
        <Tooltip tooltipContent={tooltipContent}>
            <IconButton variant={variant} size={size} {...props} asChild={asChild}>
                {children}
            </IconButton>
        </Tooltip>
    )
}

