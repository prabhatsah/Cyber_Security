import React from 'react';
import { useTypingEffect } from './hooks/useTypingEffect';

const TypingEffect = ({ text, delay = 0, className = '' }) => {
  const { displayedText, isTyping } = useTypingEffect(text, delay);

  return (
    <div className={className}>
      {displayedText}
      {isTyping && <span className="animate-pulse">▊</span>}
    </div>
  );
};

export default TypingEffect;