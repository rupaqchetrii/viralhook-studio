import React, { useState } from 'react';
import clsx from 'clsx';

export function Tooltip({ children, text, position = 'top', className }) {
  const [visible, setVisible] = useState(false);

  const positionStyles = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div
      className="relative inline-flex items-center"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible && text && (
        <div
          role="tooltip"
          className={clsx(
            'absolute z-50 px-2.5 py-1.5 text-[11px] font-medium text-[#F1F5F9] bg-[#191a2c] border border-[#2e3152] rounded-lg shadow-xl whitespace-nowrap pointer-events-none transition-opacity duration-150',
            positionStyles[position],
            className
          )}
        >
          {text}
        </div>
      )}
    </div>
  );
}
