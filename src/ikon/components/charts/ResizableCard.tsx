'use client'
// ResizableCard.tsx
import React, { useRef } from 'react';

const ResizableCard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const resizableRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    const resizable = resizableRef.current;
    if (!resizable) return;

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = resizable.offsetWidth;
    const startHeight = resizable.offsetHeight;

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = Math.max(200, startWidth + (e.clientX - startX));
      const newHeight = Math.max(200, startHeight + (e.clientY - startY));
      resizable.style.width = `${newWidth}px`;
      resizable.style.height = `${newHeight}px`;
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      ref={resizableRef}
      className="relative shadow-md rounded-md p-4"
      style={{ width: '600px', height: '400px' }}
    >
      {children}
      <div
        className="absolute bottom-0 right-0 w-4 h-4 bg-gray-300 cursor-se-resize"
        onMouseDown={handleMouseDown}
      />
    </div>
  );
};

export default ResizableCard;