import React, { useState } from 'react';

interface AvatarProps {
  name: string;
  src?: string;
  size?: number;
  className?: string;
}

const colors = [
  'bg-indigo-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
  'bg-red-500', 'bg-pink-500', 'bg-purple-500', 'bg-teal-500',
  'bg-orange-500', 'bg-cyan-500',
];

function hashColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

const Avatar: React.FC<AvatarProps> = ({ name, src, size = 40, className = '' }) => {
  const [imgError, setImgError] = useState(false);

  if (src && src.trim() && !imgError) {
    return (
      <img
        src={src}
        alt={name}
        onError={() => setImgError(true)}
        className={`rounded-full object-cover ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className={`rounded-full flex items-center justify-center text-white font-bold ${hashColor(name)} ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.42 }}
    >
      {name.charAt(0)}
    </div>
  );
};

export default Avatar;
