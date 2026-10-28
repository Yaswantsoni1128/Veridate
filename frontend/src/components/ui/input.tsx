import * as React from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}
export const Input: React.ForwardRefExoticComponent<
  InputProps & React.RefAttributes<HTMLInputElement>
> = React.forwardRef(({ className, type, ...props }, ref) => (
  <input
    type={type}
    className={cn(
      'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      className,
    )}
    ref={ref as React.Ref<HTMLInputElement>}
    {...props}
  />
))
Input.displayName = 'Input'

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}
export const Label: React.ForwardRefExoticComponent<
  LabelProps & React.RefAttributes<HTMLLabelElement>
> = React.forwardRef(({ className, ...props }, ref) => (
  <label
    ref={ref as React.Ref<HTMLLabelElement>}
    className={cn('text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70', className)}
    {...props}
  />
))
Label.displayName = 'Label'
