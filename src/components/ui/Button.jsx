import React from 'react';

const Button = ({ 
  children, 
  variant = 'default', 
  size = 'md', 
  className = '', 
  disabled = false,
  onClick,
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    default: 'bg-primary text-white hover:opacity-90 shadow-sm',
    secondary: 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm',
    destructive: 'bg-red-500 text-white hover:bg-red-600',
    outline: 'border border-white/30 text-white hover:bg-white/10 backdrop-blur-sm',
    ghost: 'text-white hover:bg-white/10'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm rounded-md',
    md: 'px-4 py-2 text-base rounded-lg',
    lg: 'px-6 py-3 text-lg rounded-xl'
  };
  
  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;