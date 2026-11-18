import React from 'react';
import clsx from 'clsx';

export function Badge({ children, variant = 'default', size = 'sm', className, icon: Icon }) {
  const baseStyles = 'inline-flex items-center font-semibold rounded-full select-none';

  const sizeStyles = {
    xs: 'text-[10px] px-2.5 py-0.5 gap-1',
    sm: 'text-xs px-3 py-1 gap-1.5',
    md: 'text-sm px-3.5 py-1.5 gap-2',
  };

  const variantStyles = {
    default: 'bg-[#F8F7F4] text-[#6E6D7A] border border-[#E7E7E9]',
    accent: 'bg-[#FDF2F7] text-[#EA4C89] border border-[#EA4C89]/25',
    dark: 'bg-[#0D0C22] text-white',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border border-rose-200',
  };

  return (
    <span className={clsx(baseStyles, sizeStyles[size], variantStyles[variant], className)}>
      {Icon && <Icon className="w-3 h-3" />}
      {children}
    </span>
  );
}
