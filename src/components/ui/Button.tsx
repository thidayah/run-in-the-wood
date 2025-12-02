import { cn } from '@/lib/utils'
import { forwardRef, Children, cloneElement } from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  asChild?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', asChild = false, children, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center rounded-lg font-medium transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-trail-500 disabled:opacity-50 disabled:cursor-not-allowed'
    
    const variants = {
      primary: 'bg-gradient-to-r from-trail-500 to-trail-600 text-white hover:shadow-lg hover:shadow-trail-500/25 active:scale-[0.98]',
      secondary: 'bg-forest-700 text-white hover:bg-forest-600',
      outline: 'border border-trail-500 text-trail-500 bg-transparent hover:bg-trail-500/10',
    }
    
    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    }

    const buttonClass = cn(base, variants[variant], sizes[size], className)

    // Jika asChild, render children tanpa button wrapper
    if (asChild) {
      const child = Children.only(children) as React.ReactElement<{ className?: string }>
      return cloneElement(child, {
        className: cn(buttonClass, child.props.className),
        ...props,
      })
    }

    return (
      <button
        ref={ref}
        className={buttonClass}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }