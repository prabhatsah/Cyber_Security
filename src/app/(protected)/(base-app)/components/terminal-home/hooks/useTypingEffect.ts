import { useState, useEffect } from 'react';

const TYPING_SPEED = 50;

export const useTypingEffect = (text: string) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let currentIndex = 0;
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

    return () => clearTimeout(timeout);
  }, [text]);

  return { displayedText, isTyping };
};