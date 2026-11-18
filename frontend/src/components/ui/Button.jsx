import React from 'react';
import clsx from 'clsx';

export function Button({
  children,
  variant = 'primary', // 'primary' | 'accent' | 'secondary' | 'outline' | 'danger' | 'ghost'
  size = 'md',        // 'sm' | 'md' | 'lg'
  className,
  disabled,
  icon: Icon,
  ...props
}) {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold rounded-full transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#0D0C22]/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-[0.97] select-none';

  const sizeStyles = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5',
    md: 'text-sm px-5 py-2.5 gap-2',
    lg: 'text-base px-7 py-3.5 gap-2.5',
  };

  const variantStyles = {
    primary:
      'bg-[#0D0C22] text-white hover:bg-[#3D3D4E] shadow-sm font-bold',
    accent:
      'bg-[#EA4C89] text-white hover:bg-[#F082AC] shadow-sm font-bold',
    secondary:
      'bg-[#F8F7F4] text-[#0D0C22] hover:bg-[#F3F3F6] border border-[#E7E7E9]',
    outline:
      'bg-white border border-[#E7E7E9] text-[#6E6D7A] hover:text-[#0D0C22] hover:border-[#0D0C22] shadow-sm',
    danger:
      'bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100',
    ghost:
      'bg-transparent text-[#6E6D7A] hover:text-[#0D0C22] hover:bg-[#F8F7F4]',
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
