import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ExactSmartieAvatar from "./ExactSmartieAvatar";

interface ModernSmartieAvatarProps {
  size?: "sm" | "md" | "lg" | "xl";
  animationType?: "idle" | "positive" | "thinking" | "warning" | "milestone" | "greeting";
  animated?: boolean;
  showEffects?: boolean;
  mood?: "happy" | "thinking" | "concerned" | "celebrating" | "proud" | "sleepy";
}

const ModernSmartieAvatar: React.FC<ModernSmartieAvatarProps> = ({
  size = "md",
  animationType = "idle",
  animated = true,
  showEffects = false,
  mood = "happy"
}) => {
  // Use the exact pixel-perfect Smartie instead of complex custom version
  return <ExactSmartieAvatar 
    size={size} 
    animationType={animationType} 
    animated={animated} 
    showEffects={showEffects}
    mood={mood}
  />;
};

export default ModernSmartieAvatar;