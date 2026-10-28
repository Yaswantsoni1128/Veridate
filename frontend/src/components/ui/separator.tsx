import * as React from 'react'
import { cn } from '@/lib/utils'

interface SeparatorProps extends React.HTMLAttributes<HTMLHRElement> {}
export const Separator: React.ForwardRefExoticComponent<
  SeparatorProps & React.RefAttributes<HTMLHRElement>
> = React.forwardRef(({ className, ...props }, ref) => (
  <hr
    ref={ref as React.Ref<HTMLHRElement>}
    className={cn('border-y', className)}
    {...props}
  />
))
Separator.displayName = 'Separator'
