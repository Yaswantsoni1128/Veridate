import * as React from 'react'
import { cn } from '@/lib/utils'

interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {}
export const ScrollArea: React.ForwardRefExoticComponent<
  ScrollAreaProps & React.RefAttributes<HTMLDivElement>
> = React.forwardRef(({ className, children, ...props }, ref) => (
  <div ref={ref as React.Ref<HTMLDivElement>} className={cn('relative overflow-hidden', className)} {...props}>
    <div className='absolute bottom-0 right-0 w-4 bg-muted rounded-full opacity-50 transition-opacity hover:opacity-75' />
  </div>
))
ScrollArea.displayName = 'ScrollArea'

interface ScrollAreaContentProps extends React.HTMLAttributes<HTMLDivElement> {}
export const ScrollAreaContent: React.ForwardRefExoticComponent<
  ScrollAreaContentProps & React.RefAttributes<HTMLDivElement>
> = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref as React.Ref<HTMLDivElement>}
    className={cn('flex flex-col gap-4 p-4', className)}
    {...props}
  />
))
ScrollAreaContent.displayName = 'ScrollAreaContent'
