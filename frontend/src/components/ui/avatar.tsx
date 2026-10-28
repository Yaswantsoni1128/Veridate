import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/lib/utils'

interface AvatarProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string
  alt?: string
}

export const Avatar: React.ForwardRefExoticComponent<
  AvatarProps & React.RefAttributes<HTMLSpanElement>
> = React.forwardRef(({ className, src, alt, ...props }, ref) => (
  <span
    className={cn(
      'relative flex shrink-0 overflow-hidden rounded-full',
      className,
    )}
    ref={ref as React.Ref<HTMLSpanElement>}
    {...props}
  >
    {src ? (
      <img
        src={src}
        alt={alt ?? 'Avatar'}
        className='aspect-square h-full w-full object-cover'
      />
    ) : (
      <Slot />
    )}
  </span>
))
Avatar.displayName = 'Avatar'

interface AvatarFallbackProps extends React.HTMLAttributes<HTMLSpanElement> {}
export const AvatarFallback: React.ForwardRefExoticComponent<
  AvatarFallbackProps & React.RefAttributes<HTMLSpanElement>
> = React.forwardRef(({ className, ...props }, ref) => (
  <span
    ref={ref as React.Ref<HTMLSpanElement>}
    className={cn(
      'flex h-full w-full items-center justify-center rounded-full bg-muted',
      className,
    )}
    {...props}
  />
))
AvatarFallback.displayName = 'AvatarFallback'
