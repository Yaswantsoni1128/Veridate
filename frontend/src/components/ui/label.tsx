import * as React from 'react'

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}
export const Label: React.ForwardRefExoticComponent<
  LabelProps & React.RefAttributes<HTMLLabelElement>
> = React.forwardRef(({ className, ...props }, ref) => (
  <label
    ref={ref as React.Ref<HTMLLabelElement>}
    className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
    {...props}
  />
))
Label.displayName = 'Label'
