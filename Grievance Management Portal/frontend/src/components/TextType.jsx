import { useState, useEffect } from 'react';

const TextType = ({
  text = [],
  typingSpeed = 75,
  pauseDuration = 1500,
  showCursor = true,
  cursorCharacter = '_',
  deletingSpeed = 50,
  variableSpeedEnabled = false,
  cursorBlinkDuration = 0.5
}) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (text.length === 0) return;

    const currentFullText = text[currentTextIndex];
    
    const timeout = setTimeout(() => {
      if (isPaused) {
        setIsPaused(false);
        setIsDeleting(true);
        return;
      }

      if (isDeleting) {
        if (currentText.length > 0) {
          setCurrentText(currentFullText.substring(0, currentText.length - 1));
        } else {
          setIsDeleting(false);
          setCurrentTextIndex((prev) => (prev + 1) % text.length);
        }
      } else {
        if (currentText.length < currentFullText.length) {
          setCurrentText(currentFullText.substring(0, currentText.length + 1));
        } else {
          setIsPaused(true);
        }
      }
    }, isPaused ? pauseDuration : isDeleting ? deletingSpeed : typingSpeed);

    return () => clearTimeout(timeout);
  }, [currentText, currentTextIndex, isDeleting, isPaused, text, typingSpeed, pauseDuration, deletingSpeed]);

  return (
    <span className="font-bold">
      {currentText}
      {showCursor && (
        <span 
          className="animate-pulse"
          style={{ 
            animationDuration: `${cursorBlinkDuration}s`,
            animationIterationCount: 'infinite'
          }}
        >
          {cursorCharacter}
        </span>
      )}
    </span>
  );
};

export default TextType;