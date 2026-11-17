import React from 'react';
import clsx from 'clsx';

export function Card({ children, className, elevated = false, borderAccent = false, ...props }) {
  return (
    <div
      className={clsx(
        'rounded-2xl transition-all duration-200 backdrop-blur-sm',
        elevated ? 'bg-[#282a45] shadow-xl' : 'bg-[#202238] shadow-lg',
        borderAccent ? 'border border-[#A78BFA]/50 shadow-[#A78BFA]/10' : 'border border-[#2e3152]',
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
    <div className={clsx('px-6 py-4 border-b border-[#2e3152]/60 flex items-center justify-between', className)} {...props}>
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
