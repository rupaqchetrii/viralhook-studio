import React from 'react';
import clsx from 'clsx';

export function Badge({ children, variant = 'default', size = 'sm', className, icon: Icon }) {
  const baseStyles = 'inline-flex items-center font-medium rounded-full select-none';

  const sizeStyles = {
    xs: 'text-[10px] px-2 py-0.5 gap-1',
    sm: 'text-xs px-2.5 py-1 gap-1.5',
    md: 'text-sm px-3 py-1.5 gap-2',
  };

  const variantStyles = {
    default: 'bg-[#282a45] text-[#94A3B8] border border-[#2e3152]',
    accent: 'bg-[#A78BFA]/15 text-[#A78BFA] border border-[#A78BFA]/30',
    success: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    warning: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    danger: 'bg-rose-500/15 text-rose-400 border border-rose-500/30',
  };

  return (
    <span className={clsx(baseStyles, sizeStyles[size], variantStyles[variant], className)}>
      {Icon && <Icon className="w-3 h-3" />}
      {children}
    </span>
  );
}
