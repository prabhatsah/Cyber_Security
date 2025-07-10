import { useState, useEffect } from 'react';
import { TYPING_SPEED } from '../constants';

export const useTypingEffect = (text, startDelay = 0) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    let timeout;
    let currentIndex = 0;

    const startTyping = () => {
      setIsTyping(true);
      const typeNextChar = () => {
        if (currentIndex < text.length) {
          setDisplayedText(text.slice(0, currentIndex + 1));
          currentIndex++;
          timeout = setTimeout(typeNextChar, TYPING_SPEED);
        } else {
          setIsTyping(false);
        }
      };
      typeNextChar();
    };

    const initialDelay = setTimeout(startTyping, startDelay);

    return () => {
      clearTimeout(initialDelay);
      clearTimeout(timeout);
    };
  }, [text, startDelay]);

  return { displayedText, isTyping };
};