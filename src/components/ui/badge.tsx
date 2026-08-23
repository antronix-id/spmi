import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 select-none',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-zinc-900 text-zinc-50 shadow-2xs',
        secondary:
          'border-slate-200 bg-slate-100 text-slate-800',
        destructive:
          'border-transparent bg-red-600 text-white shadow-2xs',
        outline:
          'border-slate-300 bg-white text-slate-700',
        white:
          'border-zinc-200 bg-white text-zinc-950 font-bold shadow-2xs',
        dark:
          'border-zinc-800 bg-zinc-900 text-zinc-200',
        brand:
          'border-blue-200 bg-blue-50 text-blue-800 font-semibold',
        emerald:
          'border-emerald-200 bg-emerald-50 text-emerald-800 font-semibold',
        gold:
          'border-amber-300 bg-amber-50 text-amber-900 font-semibold',
        amber:
          'border-amber-300 bg-amber-50 text-amber-900 font-semibold',
        rose:
          'border-rose-200 bg-rose-50 text-rose-800 font-semibold',
        purple:
          'border-purple-200 bg-purple-50 text-purple-800 font-semibold',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
