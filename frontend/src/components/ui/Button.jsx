import React from 'react';
import clsx from 'clsx';

export function Button({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost'
  size = 'md',        // 'sm' | 'md' | 'lg'
  className,
  disabled,
  icon: Icon,
  ...props
}) {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#A78BFA]/50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-[0.98] select-none';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5',
  };

  const variantStyles = {
    primary:
      'bg-gradient-to-r from-[#A78BFA] to-[#9065f7] text-[#11121B] hover:brightness-110 shadow-lg shadow-[#A78BFA]/20 font-bold',
    secondary:
      'bg-[#282a45] text-[#F1F5F9] hover:bg-[#323558] border border-[#2e3152]',
    outline:
      'bg-transparent border border-[#2e3152] text-[#94A3B8] hover:text-[#F1F5F9] hover:border-[#A78BFA]/60 hover:bg-[#A78BFA]/5',
    danger:
      'bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20',
    ghost:
      'bg-transparent text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-white/5',
  };

  return (
    <button
      className={clsx(baseStyles, sizeStyles[size], variantStyles[variant], className)}
      disabled={disabled}
      {...props}
    >
      {Icon && <Icon className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />}
      {children}
    </button>
  );
}
