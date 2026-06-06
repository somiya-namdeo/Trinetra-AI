import React from 'react';

export const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center h-full text-gray-400">
    <div className="text-center">
      <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
      <p>This module is currently operating in background mode.</p>
    </div>
  </div>
);
