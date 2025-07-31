import { useState, useEffect } from "react";
import ModernSmartieAvatar from "@/components/ModernSmartieAvatar";

interface SmartieAccessory {
  id: string;
  name: string;
  type: "hat" | "glasses" | "clothing" | "accessory";
  price: number;
  unlocked: boolean;
  equipped: boolean;
  description: string;
}

interface SmartieAvatarSystemProps {
  mood?: "happy" | "thinking" | "calculating" | "concerned" | "celebrating" | "excited" | "worried" | "confident";
  size?: "sm" | "md" | "lg" | "xl";
  accessories?: SmartieAccessory[];
  animate?: boolean;
}

export default function SmartieAvatarSystem({ 
  mood = "happy", 
  size = "md", 
  accessories = [],
  animate = false 
}: SmartieAvatarSystemProps) {
  const [currentAccessories, setCurrentAccessories] = useState<SmartieAccessory[]>(accessories);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setCurrentAccessories(accessories);
  }, [accessories]);

  // Trigger animation when accessories change
  useEffect(() => {
    if (animate && accessories.length > 0) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [accessories, animate]);

  const equippedAccessories = currentAccessories.filter(acc => acc.equipped);

  return (
    <div className={`relative inline-block ${isAnimating ? 'animate-bounce' : ''}`}>
      <ModernSmartieAvatar mood={mood} size={size} />
      
      {/* Render equipped accessories */}
      {equippedAccessories.map((accessory) => (
        <div
          key={accessory.id}
          className={`absolute inset-0 pointer-events-none ${
            accessory.type === 'hat' ? 'top-0' :
            accessory.type === 'glasses' ? 'top-1/4' :
            accessory.type === 'clothing' ? 'top-1/2' :
            'bottom-0'
          }`}
        >
          {/* Render accessory based on type */}
          {accessory.type === 'hat' && (
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
              {accessory.name === "Blue Beanie" && (
                <div className="w-8 h-6 bg-blue-500 rounded-t-full border-2 border-blue-600" />
              )}
              {accessory.name === "Graduation Cap" && (
                <div className="w-8 h-4 bg-black rounded-sm relative">
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-black transform rotate-45" />
                </div>
              )}
              {accessory.name === "Chef Hat" && (
                <div className="w-6 h-8 bg-white rounded-t-full border border-gray-200" />
              )}
            </div>
          )}
          
          {accessory.type === 'glasses' && (
            <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2">
              {accessory.name === "Smart Glasses" && (
                <div className="flex gap-1">
                  <div className="w-3 h-3 border-2 border-gray-600 rounded-full bg-blue-100/50" />
                  <div className="w-3 h-3 border-2 border-gray-600 rounded-full bg-blue-100/50" />
                </div>
              )}
              {accessory.name === "Cool Shades" && (
                <div className="flex gap-1">
                  <div className="w-3 h-3 border-2 border-black rounded-sm bg-black" />
                  <div className="w-3 h-3 border-2 border-black rounded-sm bg-black" />
                </div>
              )}
            </div>
          )}

          {accessory.type === 'clothing' && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2">
              {accessory.name === "Superhero Cape" && (
                <div className="w-4 h-6 bg-red-500 rounded-b-lg border-red-600 border-2" />
              )}
              {accessory.name === "Bow Tie" && (
                <div className="w-4 h-2 bg-purple-600 rounded-sm relative">
                  <div className="absolute inset-y-0 left-1/2 w-1 bg-purple-800 transform -translate-x-1/2" />
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      {/* Sparkle effect when new accessory is equipped */}
      {isAnimating && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-2 h-2 bg-yellow-400 rounded-full animate-ping" />
          <div className="absolute bottom-0 left-0 w-1 h-1 bg-pink-400 rounded-full animate-ping delay-100" />
          <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-blue-400 rounded-full animate-ping delay-200" />
        </div>
      )}
    </div>
  );
}

// Predefined accessories for the shop
export const SMARTIE_ACCESSORIES: SmartieAccessory[] = [
  {
    id: "blue-beanie",
    name: "Blue Beanie",
    type: "hat",
    price: 50,
    unlocked: false,
    equipped: false,
    description: "A cozy blue beanie for cold saving days"
  },
  {
    id: "graduation-cap",
    name: "Graduation Cap",
    type: "hat", 
    price: 100,
    unlocked: false,
    equipped: false,
    description: "For mastering your finances like a scholar"
  },
  {
    id: "smart-glasses",
    name: "Smart Glasses",
    type: "glasses",
    price: 75,
    unlocked: false,
    equipped: false,
    description: "See your spending patterns more clearly"
  },
  {
    id: "cool-shades",
    name: "Cool Shades",
    type: "glasses",
    price: 60,
    unlocked: false,
    equipped: false,
    description: "Look cool while saving money"
  },
  {
    id: "superhero-cape",
    name: "Superhero Cape",
    type: "clothing",
    price: 150,
    unlocked: false,
    equipped: false,
    description: "For when you're a money-saving superhero"
  },
  {
    id: "bow-tie",
    name: "Bow Tie",
    type: "clothing",
    price: 40,
    unlocked: false,
    equipped: false,
    description: "Dress up for financial success"
  },
  {
    id: "chef-hat",
    name: "Chef Hat",
    type: "hat",
    price: 80,
    unlocked: false,
    equipped: false,
    description: "Cooking up some great savings recipes"
  }
];