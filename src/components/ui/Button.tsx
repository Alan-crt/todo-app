import React, { ButtonHTMLAttributes, forwardRef } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg';
  isLoading?: boolean;
}

const getVariantClasses = (variant: ButtonProps['variant'] = 'default'): string => {
  switch (variant) {
    case 'default':
      return 'bg-blue-600 text-white hover:bg-blue-700';
    case 'destructive':
      return 'bg-red-600 text-white hover:bg-red-700';
    case 'outline':
      return 'border border-gray-300 bg-transparent hover:bg-gray-50 text-gray-700';
    case 'secondary':
      return 'bg-gray-200 text-gray-900 hover:bg-gray-300';
    case 'ghost':
      return 'hover:bg-gray-100 text-gray-700';
    case 'link':
      return 'underline-offset-4 hover:underline text-blue-600';
    default:
      return 'bg-blue-600 text-white hover:bg-blue-700';
  }
};

const getSizeClasses = (size: ButtonProps['size'] = 'default'): string => {
  switch (size) {
    case 'default':
      return 'h-10 py-2 px-4';
    case 'sm':
      return 'h-9 px-3 text-sm';
    case 'lg':
      return 'h-11 px-8 text-base';
    default:
      return 'h-10 py-2 px-4';
  }
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className = '', 
    variant = 'default', 
    size = 'default', 
    isLoading = false,
    disabled,
    children,
    ...props 
  }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none';
    const variantClasses = getVariantClasses(variant);
    const sizeClasses = getSizeClasses(size);
    
    return (
      <button
        ref={ref}
        disabled={isLoading || disabled}
        className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
        {...props}
      >
        {isLoading ? (
          <div className="mr-2">
            <svg 
              className="animate-spin h-4 w-4 text-current" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              />
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;