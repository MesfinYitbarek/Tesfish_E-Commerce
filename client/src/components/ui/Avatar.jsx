import { UserIcon } from '@heroicons/react/24/outline';

const Avatar = ({ src, name, size = 'md', className = '' }) => {
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-14 h-14 text-xl'
  };

  return (
    <div className={`relative inline-flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden ${sizeClasses[size]} ${className}`}>
      {src ? (
        <img
          src={src}
          alt={name || 'Avatar'}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextElementSibling.style.display = 'flex';
          }}
        />
      ) : null}
      <div className={`w-full h-full flex items-center justify-center ${src ? 'hidden' : 'flex'} bg-primary-500 text-white`}>
        {name ? (
          <span>{name.charAt(0).toUpperCase()}</span>
        ) : (
          <UserIcon className="w-1/2 h-1/2" />
        )}
      </div>
    </div>
  );
};

export default Avatar;