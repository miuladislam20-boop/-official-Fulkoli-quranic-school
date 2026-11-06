import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';

interface SchoolLogoProps {
  src?: string;
  alt?: string;
  className?: string;
  fallbackSize?: 'sm' | 'md' | 'lg';
}

export const SchoolLogo: React.FC<SchoolLogoProps> = ({
  src,
  alt = 'School Logo',
  className = 'w-10 h-10 rounded-full object-cover border border-emerald-700/20 shadow-xs',
  fallbackSize = 'md',
}) => {
  const [imageError, setImageError] = useState(false);

  // If the src starts with old /src/assets path or has errored, fallback to beautiful SVG emblem
  const isInvalidSrc = !src || src.startsWith('/src/assets/');

  if (imageError || isInvalidSrc) {
    const sizeClasses =
      fallbackSize === 'sm'
        ? 'w-10 h-10 text-xs'
        : fallbackSize === 'lg'
        ? 'w-14 h-14 text-sm'
        : 'w-11 h-11 text-xs';

    return (
      <div
        className={`${sizeClasses} rounded-full bg-gradient-to-br from-emerald-800 to-emerald-950 text-amber-300 flex flex-col items-center justify-center border-2 border-amber-400/80 shadow-md shrink-0 select-none`}
        title={alt}
      >
        <BookOpen className="w-5 h-5 text-amber-300 stroke-[2.2]" />
        <span className="text-[8px] font-bold tracking-tighter text-emerald-100 uppercase mt-0.5">
          FQS
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setImageError(true)}
    />
  );
};
