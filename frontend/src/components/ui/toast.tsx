import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/lib/utils'

interface ToastProps {
  title?: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export const Toast: React.FC<React.PropsWithChildren<ToastProps>> = ({
  className,
  title,
  description,
  action,
  ...props
}) => (
  <div
    className={cn(
      'relative w-full overflow-hidden',
      'animate-in slide-in-from-bottom-2 fade-in-8 duration-200',
      className,
    )}
    {...props}
  >
    <div className='grid gap-1 bg-background p-4 rounded-lg border border-border/50 shadow-md'>
      <div className='grid gap-1.5 text-sm'>
        {title && (
          <h3 className='font-semibold leading-none tracking-tight'>
            {title}
          </h3>
        )}
        {description && (
          <div className='opacity-70 line-clamp-2'>{description}</div>
        )}
      </div>
      {action && (
        <Slot>{action}</Slot>
      )}
    </div>
  </div>
)
Toast.displayName = 'Toast'

interface ToastActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}
export const ToastAction: React.ForwardRefExoticComponent<
  ToastActionProps & React.RefAttributes<HTMLButtonElement>
> = React.forwardRef(({ className, ...props }, ref) => (
  <button
    ref={ref as React.Ref<HTMLButtonElement>}
    className={cn(
      'inline-flex h-8 shrink-0 items-center justify-center rounded-md bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
      className,
    )}
    {...props}
  />
))
ToastAction.displayName = 'ToastAction'

interface ToastCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}
export const ToastClose: React.ForwardRefExoticComponent<
  ToastCloseProps & React.RefAttributes<HTMLButtonElement>
> = React.forwardRef(({ className, ...props }, ref) => (
  <button
    ref={ref as React.Ref<HTMLButtonElement>}
    className={cn(
      'absolute right-1 top-1 rounded-md p-2 text-muted-foreground opacity-100 transition-opacity hover:text-destructive focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
      className,
    )}
    {...props}
  />
))
ToastClose.displayName = 'ToastClose'

interface ToastViewportProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}
export const ToastViewport: React.ForwardRefExoticComponent<
  ToastViewportProps & React.RefAttributes<HTMLDivElement>
> = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref as React.Ref<HTMLDivElement>}
    className={cn(
      'fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:max-h-[80vh]',
      className,
    )}
    {...props}
  />
))
ToastViewport.displayName = 'ToastViewport'
