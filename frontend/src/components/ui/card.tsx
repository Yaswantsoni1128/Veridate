import * as React from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}
export const Card: React.ForwardRefExoticComponent<
  CardProps & React.RefAttributes<HTMLDivElement>
> = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref as React.Ref<HTMLDivElement>}
    className={cn('rounded-xl border bg-card text-card-foreground shadow', className)}
    {...props}
  />
))
Card.displayName = 'Card'

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}
export const CardHeader: React.ForwardRefExoticComponent<
  CardHeaderProps & React.RefAttributes<HTMLDivElement>
> = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref as React.Ref<HTMLDivElement>}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
))
CardHeader.displayName = 'CardHeader'

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}
export const CardTitle: React.ForwardRefExoticComponent<
  CardTitleProps & React.RefAttributes<HTMLHeadingElement>
> = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref as React.Ref<HTMLHeadingElement>}
    className={cn('text-2xl font-semibold leading-none tracking-tight', className)}
    {...props}
  />
))
CardTitle.displayName = 'CardTitle'

interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}
export const CardDescription: React.ForwardRefExoticComponent<
  CardDescriptionProps & React.RefAttributes<HTMLParagraphElement>
> = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref as React.Ref<HTMLParagraphElement>}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
))
CardDescription.displayName = 'CardDescription'

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}
export const CardContent: React.ForwardRefExoticComponent<
  CardContentProps & React.RefAttributes<HTMLDivElement>
> = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref as React.Ref<HTMLDivElement>} className={cn('p-6 pt-0', className)} {...props} />
))
CardContent.displayName = 'CardContent'

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}
export const CardFooter: React.ForwardRefExoticComponent<
  CardFooterProps & React.RefAttributes<HTMLDivElement>
> = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref as React.Ref<HTMLDivElement>}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
))
CardFooter.displayName = 'CardFooter'
