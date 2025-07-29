import { useCallback } from 'react';
import { useAnimation } from 'framer-motion';

// Enhanced animation hooks for micro-interactions
export const useButtonAnimation = () => {
  const controls = useAnimation();

  const animatePress = useCallback(async () => {
    await controls.start({
      scale: 0.95,
      transition: { duration: 0.1 }
    });
    controls.start({
      scale: 1,
      transition: { duration: 0.2, type: "spring", stiffness: 400 }
    });
  }, [controls]);

  const animateHover = useCallback(() => {
    controls.start({
      scale: 1.02,
      y: -2,
      transition: { duration: 0.2, type: "spring", stiffness: 300 }
    });
  }, [controls]);

  const animateLeave = useCallback(() => {
    controls.start({
      scale: 1,
      y: 0,
      transition: { duration: 0.2, type: "spring", stiffness: 300 }
    });
  }, [controls]);

  return { controls, animatePress, animateHover, animateLeave };
};

export const useProgressAnimation = () => {
  const controls = useAnimation();

  const animateProgress = useCallback(async (percentage: number) => {
    await controls.start({
      width: 0,
      transition: { duration: 0.1 }
    });
    controls.start({
      width: `${percentage}%`,
      transition: { duration: 1.2, type: "spring", stiffness: 100 }
    });
  }, [controls]);

  return { controls, animateProgress };
};

export const useCardAnimation = () => {
  const controls = useAnimation();

  const animateEntry = useCallback((delay = 0) => {
    controls.start({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.6, 
        delay,
        type: "spring", 
        stiffness: 100,
        damping: 15
      }
    });
  }, [controls]);

  const animateExit = useCallback(() => {
    controls.start({
      opacity: 0,
      y: 20,
      scale: 0.95,
      transition: { duration: 0.3 }
    });
  }, [controls]);

  return { controls, animateEntry, animateExit };
};

export const useSlideAnimation = () => {
  const controls = useAnimation();

  const slideIn = useCallback((direction: 'left' | 'right' | 'up' | 'down' = 'right') => {
    const initial = {
      left: { x: -100, opacity: 0 },
      right: { x: 100, opacity: 0 },
      up: { y: -100, opacity: 0 },
      down: { y: 100, opacity: 0 }
    };

    controls.set(initial[direction]);
    controls.start({
      x: 0,
      y: 0,
      opacity: 1,
      transition: { 
        duration: 0.5, 
        type: "spring", 
        stiffness: 120,
        damping: 20
      }
    });
  }, [controls]);

  const slideOut = useCallback((direction: 'left' | 'right' | 'up' | 'down' = 'left') => {
    const target = {
      left: { x: -100, opacity: 0 },
      right: { x: 100, opacity: 0 },
      up: { y: -100, opacity: 0 },
      down: { y: 100, opacity: 0 }
    };

    controls.start({
      ...target[direction],
      transition: { duration: 0.3 }
    });
  }, [controls]);

  return { controls, slideIn, slideOut };
};

export const usePulseAnimation = () => {
  const controls = useAnimation();

  const startPulse = useCallback(() => {
    controls.start({
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    });
  }, [controls]);

  const stopPulse = useCallback(() => {
    controls.stop();
    controls.start({
      scale: 1,
      transition: { duration: 0.3 }
    });
  }, [controls]);

  return { controls, startPulse, stopPulse };
};

export const useShakeAnimation = () => {
  const controls = useAnimation();

  const shake = useCallback(() => {
    controls.start({
      x: [0, -10, 10, -10, 10, 0],
      transition: { duration: 0.5 }
    });
  }, [controls]);

  return { controls, shake };
};

export const useBounceAnimation = () => {
  const controls = useAnimation();

  const bounce = useCallback(() => {
    controls.start({
      y: [0, -20, 0],
      transition: { 
        duration: 0.6,
        type: "spring",
        stiffness: 300,
        damping: 10
      }
    });
  }, [controls]);

  return { controls, bounce };
};