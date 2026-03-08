import { motion } from 'framer-motion';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}) => {
  const baseStyles = 'font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2';
  
  const variantStyles = {
    primary: {
      background: 'linear-gradient(135deg, #FF6B35 0%, #F7B801 100%)',
      color: 'white',
    },
    secondary: {
      background: 'linear-gradient(135deg, #004E89 0%, #1A659E 100%)',
      color: 'white',
    },
    outline: {
      border: '2px solid #FF6B35',
      color: '#FF6B35',
      background: 'transparent',
    },
    ghost: {
      color: '#FF6B35',
      background: 'transparent',
    },
    danger: {
      background: '#EF4444',
      color: 'white',
    },
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      style={variantStyles[variant]}
      className={`
        ${baseStyles}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-lg'}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <>
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Loading...
        </>
      ) : (
        children
      )}
    </motion.button>
  );
};

export default Button;
