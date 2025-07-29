import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ExactSmartieAvatar from "./ExactSmartieAvatar";

interface ModernSmartieAvatarProps {
  size?: "sm" | "md" | "lg" | "xl";
  animationType?: "idle" | "positive" | "thinking" | "warning" | "milestone" | "greeting";
  animated?: boolean;
  showEffects?: boolean;
  mood?: "happy" | "thinking" | "concerned" | "celebrating" | "confident" | "worried";
  accessory?: "none" | "glasses" | "backpack" | "pencil" | "clipboard" | "speech-bubble";
  pose?: "default" | "waving" | "thinking-chin" | "celebrating-arms-up" | "nervous";
}

const ModernSmartieAvatar: React.FC<ModernSmartieAvatarProps> = ({
  size = "md",
  animationType = "idle",
  animated = true,
  showEffects = false,
  mood = "happy",
  accessory = "none",
  pose = "default"
}) => {
  // Use the exact pixel-perfect Smartie instead of complex custom version
  return <ExactSmartieAvatar 
    size={size} 
    animationType={animationType} 
    animated={animated} 
    showEffects={showEffects}
    mood={mood}
    accessory={accessory}
    pose={pose}
  />;
};

export default ModernSmartieAvatar;