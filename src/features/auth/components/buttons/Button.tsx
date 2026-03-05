import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline';
  fullWidth?: boolean;
}

export const Button = ({ 
  children, 
  variant = 'primary', 
  fullWidth = true, 
  className = '', 
  ...props 
}: ButtonProps) => {
  const baseStyles = "py-3 px-6 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2";
  
  const variants = {
    // Matches the gold gradient in the Login/Continue buttons
    primary: "bg-gradient-to-r from-[#EAB308] to-[#CA8A04] text-white hover:opacity-90 shadow-md",
    // Matches the "Signup with Google" style
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50 bg-white"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};