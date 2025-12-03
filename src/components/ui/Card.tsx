import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: boolean
}

export function Card({ className, glow = false, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-forest-700 bg-gradient-to-b from-forest-900/50 to-forest-950/50 backdrop-blur-sm',
        glow && 'animate-glow',
        className
      )}
      {...props}
    >
      <div className="">
        {children}
      </div>
    </div>
  )
}