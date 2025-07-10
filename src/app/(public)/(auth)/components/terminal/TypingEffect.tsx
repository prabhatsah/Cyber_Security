import React from 'react';
import { useTypingEffect } from './hooks/useTypingEffect';

interface Props {
  text: string;
  className?: string;
}

const TypingEffect = ({ text, className = 'text-green-400 whitespace-pre-line' }: Props) => {
  const { displayedText, isTyping } = useTypingEffect(text);

  return (
    <div className={className}>
      {displayedText}
      {isTyping && <span className="animate-pulse">▊</span>}
    </div>
  );
};

export default TypingEffect;