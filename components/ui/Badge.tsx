// components/ui/Badge.tsx
import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
}

export default function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  const variants = {
    default: 'bg-ink/5 text-ink/60 border-ink/10',
    success: 'bg-accent2/10 text-accent2 border-accent2/20',
    warning: 'bg-accent/10 text-accent border-accent/20',
    error: 'bg-red-500/10 text-red-500 border-red-500/20',
    info: 'bg-accent2/8 text-accent2 border-accent2/15',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
