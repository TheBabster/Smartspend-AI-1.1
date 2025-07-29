import { useEffect, useState } from "react";
import { useInView } from "framer-motion";
import { useRef } from "react";

interface UseCountUpProps {
  end: number;
  duration?: number;
  startOnInView?: boolean;
}

export function useCountUp({ end, duration = 2000, startOnInView = true }: UseCountUpProps) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref);

  useEffect(() => {
    if ((!startOnInView || isInView) && !hasStarted) {
      setHasStarted(true);
      
      const increment = end / (duration / 16); // 60fps
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [end, duration, isInView, startOnInView, hasStarted]);

  return { count, ref };
}

interface UseTypingEffectProps {
  text: string;
  speed?: number;
  startDelay?: number;
  onComplete?: () => void;
}

export function useTypingEffect({ 
  text, 
  speed = 50, 
  startDelay = 0,
  onComplete 
}: UseTypingEffectProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!hasStarted) {
      const startTimer = setTimeout(() => {
        setHasStarted(true);
        setIsTyping(true);
      }, startDelay);

      return () => clearTimeout(startTimer);
    }
  }, [hasStarted, startDelay]);

  useEffect(() => {
    if (hasStarted && isTyping) {
      let currentIndex = 0;
      
      const typeTimer = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayedText(text.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          setIsTyping(false);
          clearInterval(typeTimer);
          onComplete?.();
        }
      }, speed);

      return () => clearInterval(typeTimer);
    }
  }, [text, speed, hasStarted, isTyping, onComplete]);

  return {
    displayedText,
    isTyping,
    restart: () => {
      setDisplayedText("");
      setIsTyping(false);
      setHasStarted(false);
    }
  };
}

interface UseProgressBarProps {
  targetValue: number;
  duration?: number;
  delay?: number;
}

export function useProgressBar({ 
  targetValue, 
  duration = 1500, 
  delay = 0 
}: UseProgressBarProps) {
  const [progress, setProgress] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref);

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        const increment = targetValue / (duration / 16);
        let current = 0;
        
        const progressTimer = setInterval(() => {
          current += increment;
          if (current >= targetValue) {
            setProgress(targetValue);
            clearInterval(progressTimer);
          } else {
            setProgress(current);
          }
        }, 16);

        return () => clearInterval(progressTimer);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [isInView, targetValue, duration, delay]);

  return { progress, ref };
}

export function useBlinkingAnimation(interval: number = 1000) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsVisible(prev => !prev);
    }, interval);

    return () => clearInterval(timer);
  }, [interval]);

  return isVisible;
}

export function usePulseAnimation() {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setScale(prev => prev === 1 ? 1.05 : 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return scale;
}

interface UseConfettiProps {
  trigger: boolean;
  duration?: number;
}

export function useConfetti({ trigger, duration = 3000 }: UseConfettiProps) {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (trigger) {
      setIsActive(true);
      const timer = setTimeout(() => {
        setIsActive(false);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [trigger, duration]);

  return isActive;
}

export function useRippleEffect() {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const createRipple = (event: React.MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    const newRipple = {
      id: Date.now(),
      x,
      y,
    };

    setRipples(prev => [...prev, newRipple]);

    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);
  };

  return { ripples, createRipple };
}

export function useParallax(speed: number = 0.5) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setOffset(window.pageYOffset * speed);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return offset;
}
