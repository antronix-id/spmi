'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-yellow-300 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer border-b-4 active:border-b-0 active:translate-y-1',
  {
    variants: {
      variant: {
        default:
          'bg-yellow-400 text-black border-yellow-600 hover:bg-yellow-300 shadow-sm',
        primary:
          'bg-yellow-400 text-black border-yellow-600 hover:bg-yellow-300 shadow-sm',
        brand:
          'bg-yellow-400 text-black border-yellow-600 hover:bg-yellow-300 shadow-sm',
        warning:
          'bg-yellow-400 text-black border-yellow-600 hover:bg-yellow-300 shadow-sm',
        amber:
          'bg-yellow-400 text-black border-yellow-600 hover:bg-yellow-300 shadow-sm',
        secondary:
          'bg-white text-slate-800 border-slate-300 hover:bg-slate-50 shadow-sm',
        outline:
          'bg-white text-slate-800 border-2 border-b-4 border-slate-300 hover:bg-yellow-50/50 hover:border-yellow-500 shadow-2xs',
        white:
          'bg-white text-slate-900 border-slate-300 hover:bg-slate-100 shadow-sm',
        success:
          'bg-emerald-500 text-white border-emerald-700 hover:bg-emerald-400 shadow-sm',
        emerald:
          'bg-emerald-500 text-white border-emerald-700 hover:bg-emerald-400 shadow-sm',
        danger:
          'bg-red-500 text-white border-red-700 hover:bg-red-400 shadow-sm',
        destructive:
          'bg-red-500 text-white border-red-700 hover:bg-red-400 shadow-sm',
        ghost:
          'border-transparent border-b-0 text-slate-700 hover:bg-yellow-100/60 hover:text-black active:translate-y-0.5 active:border-b-0 font-bold',
        link: 
          'border-transparent border-b-0 text-amber-700 underline-offset-4 hover:underline p-0 h-auto font-bold active:translate-y-0',
      },
      size: {
        default: 'h-10 px-5 py-2',
        xs: 'h-7 rounded-lg px-2.5 text-[11px] border-b-2 active:border-b-0 active:translate-y-0.5',
        sm: 'h-8 rounded-lg px-3.5 text-xs border-b-[3px] active:border-b-0 active:translate-y-0.5',
        md: 'h-10 rounded-xl px-5 text-sm',
        lg: 'h-12 rounded-xl px-7 text-base',
        icon: 'h-9 w-9 p-0 shrink-0 border-b-2 active:border-b-0 active:translate-y-0.5',
        'icon-sm': 'h-7 w-7 p-0 shrink-0 border-b-2 active:border-b-0 active:translate-y-0.5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export const Button3D = Button;
export const Component = Button;
export default Button;

export { Button, buttonVariants };
