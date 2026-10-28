import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/lib/utils'

interface SheetContentProps extends React.HTMLAttributes<HTMLDivElement> {}
export const SheetContent: React.ForwardRefExoticComponent<
  SheetContentProps & React.RefAttributes<HTMLDivElement>
> = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref as React.Ref<HTMLDivElement>}
    className={cn(
      'fixed top-0 right-0 z-50 h-full w-full max-w-[90vw] bg-background border-l border-border shadow-xl',
      className,
    )}
    {...props}
  />
))
SheetContent.displayName = 'SheetContent'

interface SheetHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}
export const SheetHeader: React.ForwardRefExoticComponent<
  SheetHeaderProps & React.RefAttributes<HTMLDivElement>
> = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref as React.Ref<HTMLDivElement>}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
))
SheetHeader.displayName = 'SheetHeader'

interface SheetTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}
export const SheetTitle: React.ForwardRefExoticComponent<
  SheetTitleProps & React.RefAttributes<HTMLHeadingElement>
> = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref as React.Ref<HTMLHeadingElement>}
    className={cn('text-lg font-semibold leading-none tracking-tight', className)}
    {...props}
  />
))
SheetTitle.displayName = 'SheetTitle'

interface SheetDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}
export const SheetDescription: React.ForwardRefExoticComponent<
  SheetDescriptionProps & React.RefAttributes<HTMLParagraphElement>
> = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref as React.Ref<HTMLParagraphElement>}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
))
SheetDescription.displayName = 'SheetDescription'

interface SheetTriggerProps extends React.HTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

export const SheetTrigger: React.ForwardRefExoticComponent<
  SheetTriggerProps & React.RefAttributes<HTMLButtonElement>
> = React.forwardRef(
  ({ className, children, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        ref={ref as React.Ref<HTMLButtonElement>}
        className={cn(
          'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-secondary hover:text-secondary-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          className,
        )}
        {...props}
      >
        {children}
      </Comp>
    )
  },
)
SheetTrigger.displayName = 'SheetTrigger'

interface SheetProps extends React.HTMLAttributes<HTMLDivElement> {}
export const Sheet: React.FC<SheetProps> = ({ children, ...props }) => (
  <div className='fixed inset-0 z-50' {...props}>
    <div className='absolute inset-0 bg-black/80 backdrop-blur-sm' />
    {children}
  </div>
)
Sheet.displayName = 'Sheet'

interface SheetOverlayProps extends React.HTMLAttributes<HTMLDivElement> {}
export const SheetOverlay: React.ForwardRefExoticComponent<
  SheetOverlayProps & React.RefAttributes<HTMLDivElement>
> = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref as React.Ref<HTMLDivElement>}
    className={cn('fixed inset-0 z-50 bg-black/80 backdrop-blur-sm', className)}
    {...props}
  />
))
SheetOverlay.displayName = 'SheetOverlay'
