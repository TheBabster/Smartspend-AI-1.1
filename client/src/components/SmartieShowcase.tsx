import React from "react";
import ExactSmartieAvatar from "./ExactSmartieAvatar";

const SmartieShowcase: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 text-center">
        Enhanced Smartie Expressions & Accessories
      </h2>
      
      {/* New Pose System */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
          ✋ Enhanced Pose & Emotion Pack
        </h3>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <ExactSmartieAvatar 
              size="md" 
              mood="happy" 
              pose="waving"
              animationType="greeting"
              animated={true}
            />
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">✋ Waving</p>
            <p className="text-xs text-gray-500">Friendly greeting</p>
          </div>
          
          <div className="text-center">
            <ExactSmartieAvatar 
              size="md" 
              mood="thinking" 
              pose="thinking-chin"
              animationType="thinking"
              animated={true}
            />
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">🤔 Hand on Chin</p>
            <p className="text-xs text-gray-500">Deep thinking</p>
          </div>
          
          <div className="text-center">
            <ExactSmartieAvatar 
              size="md" 
              mood="celebrating" 
              pose="celebrating-arms-up"
              animationType="milestone"
              animated={true}
            />
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">🥳 Arms Up</p>
            <p className="text-xs text-gray-500">Celebration stars</p>
          </div>
          
          <div className="text-center">
            <ExactSmartieAvatar 
              size="md" 
              mood="worried" 
              pose="nervous"
              animationType="warning"
              animated={true}
            />
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">😬 Nervous</p>
            <p className="text-xs text-gray-500">Wobbly + sweat</p>
          </div>
        </div>
      </div>

      {/* Enhanced Accessories */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
          🎒 Contextual Accessories
        </h3>
        <div className="grid grid-cols-5 gap-3">
          <div className="text-center">
            <ExactSmartieAvatar 
              size="md" 
              mood="thinking" 
              accessory="glasses"
              animated={true}
            />
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">🤓 Glasses</p>
            <p className="text-xs text-gray-500">Smart mode</p>
          </div>
          
          <div className="text-center">
            <ExactSmartieAvatar 
              size="md" 
              mood="happy" 
              accessory="pencil"
              animated={true}
            />
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">✏️ Pencil</p>
            <p className="text-xs text-gray-500">Behind ear</p>
          </div>
          
          <div className="text-center">
            <ExactSmartieAvatar 
              size="md" 
              mood="confident" 
              accessory="backpack"
              animated={true}
            />
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">🎒 Backpack</p>
            <p className="text-xs text-gray-500">Adventure ready</p>
          </div>
          
          <div className="text-center">
            <ExactSmartieAvatar 
              size="md" 
              mood="thinking" 
              accessory="clipboard"
              animated={true}
            />
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">📋 Clipboard</p>
            <p className="text-xs text-gray-500">Taking notes</p>
          </div>
          
          <div className="text-center">
            <ExactSmartieAvatar 
              size="md" 
              mood="happy" 
              accessory="speech-bubble"
              animated={true}
            />
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">💬 Chart Bubble</p>
            <p className="text-xs text-gray-500">Analytics mode</p>
          </div>
        </div>
      </div>

      {/* Key Features */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
          ✅ Complete Enhancement Pack
        </h3>
        <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 dark:text-gray-400">
          <div>• 3D snapback cap with glowing £ badge</div>
          <div>• Comic-style brain texture loops</div>
          <div>• 4 distinct pose variations</div>
          <div>• Contextual special effects</div>
          <div>• White cartoon gloves</div>
          <div>• Nervous wobble + sweat drops</div>
          <div>• Celebration stars animation</div>
          <div>• Thought bubbles for thinking</div>
          <div>• Wave motion lines</div>
          <div>• Enhanced accessory system</div>
          <div>• Pose-specific arm positioning</div>
          <div>• Jelly leg movement</div>
        </div>
      </div>
    </div>
  );
};

export default SmartieShowcase;