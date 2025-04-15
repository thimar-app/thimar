import React from 'react';

interface LoadingIndicatorProps {
  className?: string;
}

export function LoadingIndicator({ className = '' }: LoadingIndicatorProps) {
  return (
    <div className={`w-full h-1 bg-violet-600/20 ${className}`}>
      <div className="h-full bg-violet-600 animate-pulse" style={{ width: '100%' }}></div>
    </div>
  );
} 