'use client';

import React from 'react';

export const WhatsAppBackground: React.FC = () => {
  return (
    <div
      className="absolute inset-0 pointer-events-none z-0"
      style={{
        backgroundColor: '#EFEAE2',
        backgroundImage: 'url(/whatsapp-doodle.svg)',
        backgroundRepeat: 'repeat',
        backgroundSize: '400px 400px',
        opacity: 0.95,
      }}
      aria-hidden="true"
    />
  );
};
