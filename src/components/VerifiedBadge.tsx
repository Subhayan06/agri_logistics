'use client';

import React from 'react';

interface VerifiedBadgeProps {
  size?: number;
  className?: string;
}

export const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({ size = 16, className = '' }) => {
  return (
    <span
      className={`inline-flex items-center justify-center flex-shrink-0 align-middle ${className}`}
      title="Verified Official Business Account"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Scalloped Official WhatsApp Verified Seal */}
        <path
          d="M9 0.5L10.7 2.3L13.1 1.9L14.3 3.9L16.6 4.6L16.8 7.1L18.5 8.9L17.5 11.1L18.2 13.5L16.1 14.8L15.6 17.2L13.1 17.3L11.7 19.2L9.4 18.3L7.3 19.5L6.4 17.2L3.9 16.6L3.9 14.1L2 12.6L2.9 10.3L1.5 8.3L3 6.4L2.8 3.9L5.2 3.8L6.7 1.8L9 2.7L9 0.5Z"
          fill="#25D366"
        />
        {/* White Checkmark */}
        <path
          d="M5.5 9.2L7.8 11.5L12.5 6.8"
          stroke="#FFFFFF"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
};
