'use client';

import React, { useState, useEffect } from 'react';

export default function RippleEffect({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  const [ripples, setRipples] = useState<{ x: number, y: number, id: number }[]>([]);

  const addRipple = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    
    setRipples(prev => [...prev, { x, y, id }]);
  };

  useEffect(() => {
    if (ripples.length > 0) {
      const timer = setTimeout(() => {
        setRipples(prev => prev.slice(1));
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [ripples]);

  return (
    <div className={`ripple-container ${className}`} onMouseDown={addRipple}>
      {children}
      {ripples.map(ripple => (
        <span 
          key={ripple.id} 
          className="ripple" 
          style={{ left: ripple.x, top: ripple.y, width: '20px', height: '20px', marginLeft: '-10px', marginTop: '-10px' }}
        />
      ))}
    </div>
  );
}
