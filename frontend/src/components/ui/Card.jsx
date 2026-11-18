import React from 'react';
import clsx from 'clsx';

export function Card({ children, className, elevated = false, borderAccent = false, hoverLift = true, ...props }) {
  return (
    <div
      className={clsx(
        'rounded-2xl transition-all duration-200 bg-white border',
        elevated ? 'shadow-md border-[#E7E7E9]' : 'shadow-[0_2px_12px_rgba(13,12,34,0.04)] border-[#E7E7E9]',
        borderAccent ? 'border-[#EA4C89] shadow-[0_4px_20px_rgba(234,76,137,0.12)]' : 'border-[#E7E7E9]',
        hoverLift && 'hover:shadow-[0_8px_24px_rgba(13,12,34,0.06)] hover:border-[#D1D1D6]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className, ...props }) {
  return (
    <div className={clsx('px-6 py-4 border-b border-[#E7E7E9] flex items-center justify-between bg-[#F8F7F4]/50 rounded-t-2xl', className)} {...props}>
      {children}
    </div>
  );
}

export function CardBody({ children, className, ...props }) {
  return (
    <div className={clsx('p-6', className)} {...props}>
      {children}
    </div>
  );
}
