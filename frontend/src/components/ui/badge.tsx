import * as React from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning'
}

export const Badge: React.ForwardRefExoticComponent<
  BadgeProps & React.RefAttributes<HTMLDivElement>
> = React.forwardRef(({ className, variant = 'default', ...props }, ref) => (
  <div
    ref={ref as React.Ref<HTMLDivElement>}
    className={cn(
      'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold',
      {
        default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground',
        outline: 'border-input bg-background',
        success: 'border-transparent bg-green-100 text-green-800',
        warning: 'border-transparent bg-amber-100 text-amber-800',
      }[variant],
      className,
    )}
    {...props}
  />
))
Badge.displayName = 'Badge'
