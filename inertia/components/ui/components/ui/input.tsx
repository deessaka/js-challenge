import * as React from 'react'
import { cn } from '~/lib/lib'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const defaultClasses = cn(
      `flex h-10 
      w-full 
      rounded-md 
      border 
      border-input 
      px-3 
      py-2 
      text-sm
      ring-offset-blue-400
      file:border-0 
      file:bg-transparent 
      file:text-sm 
      file:font-medium
      placeholder:text-muted-foreground 
      focus-visible:outline-none 
      focus-visible:ring-1
      focus-visible:ring-ring 
      focus-visible:ring-offset-2 
      disabled:cursor-not-allowed 
      disabled:opacity-50
      sm:text-base
      md:text-lg
      lg:h-12
      lg:px-4
      lg:py-3
      xl:h-14
      xl:px-5
      xl:py-4
      2xl:h-16
      2xl:px-6
      2xl:py-5`,
      className
    )
    return (
      <div className="w-full">
        <input type={type} className={defaultClasses} ref={ref} {...props} />
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input }
