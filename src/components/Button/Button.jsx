import React from 'react';

const Button = ({
  children,
  onClick,
  disabled = false,
  type = 'button',
  className = '',
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-md text-white font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 ${
        disabled
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500'
      } ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
