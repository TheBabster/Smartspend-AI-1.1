import React from "react";
import ExactSmartieAvatar from "./ExactSmartieAvatar";

const SmartieShowcase: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 text-center">
        Enhanced Smartie Expressions & Accessories
      </h2>
      
      {/* Expression Modes */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
          5 Expression Modes
        </h3>
        <div className="grid grid-cols-5 gap-4">
          <div className="text-center">
            <ExactSmartieAvatar 
              size="md" 
              mood="celebrating" 
              animationType="positive"
              animated={true}
            />
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">🥳 Celebrating</p>
            <p className="text-xs text-gray-500">Stars in eyes</p>
          </div>
          
          <div className="text-center">
            <ExactSmartieAvatar 
              size="md" 
              mood="thinking" 
              animationType="thinking"
              animated={true}
            />
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">🧠 Thinking</p>
            <p className="text-xs text-gray-500">Focused stare</p>
          </div>
          
          <div className="text-center">
            <ExactSmartieAvatar 
              size="md" 
              mood="worried" 
              animationType="warning"
              animated={true}
            />
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">😬 Worried</p>
            <p className="text-xs text-gray-500">For overspending</p>
          </div>
          
          <div className="text-center">
            <ExactSmartieAvatar 
              size="md" 
              mood="confident" 
              animationType="milestone"
              animated={true}
            />
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">😎 Confident</p>
            <p className="text-xs text-gray-500">Post good decision</p>
          </div>
          
          <div className="text-center">
            <ExactSmartieAvatar 
              size="md" 
              mood="happy" 
              animationType="greeting"
              animated={true}
            />
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">😊 Happy</p>
            <p className="text-xs text-gray-500">Default friendly</p>
          </div>
        </div>
      </div>

      {/* Accessories */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Accessory Options
        </h3>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <ExactSmartieAvatar 
              size="md" 
              mood="happy" 
              accessory="none"
              animated={true}
            />
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Default</p>
            <p className="text-xs text-gray-500">No accessories</p>
          </div>
          
          <div className="text-center">
            <ExactSmartieAvatar 
              size="md" 
              mood="thinking" 
              accessory="glasses"
              animated={true}
            />
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">🤓 Smart Mode</p>
            <p className="text-xs text-gray-500">Glasses for analysis</p>
          </div>
          
          <div className="text-center">
            <ExactSmartieAvatar 
              size="md" 
              mood="happy" 
              accessory="pencil"
              animated={true}
            />
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">✏️ Learning</p>
            <p className="text-xs text-gray-500">Pencil behind ear</p>
          </div>
          
          <div className="text-center">
            <ExactSmartieAvatar 
              size="md" 
              mood="confident" 
              accessory="backpack"
              animated={true}
            />
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">🎒 Adventure</p>
            <p className="text-xs text-gray-500">Ready to save</p>
          </div>
        </div>
      </div>

      {/* Key Features */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
          ✅ Enhanced Features
        </h3>
        <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 dark:text-gray-400">
          <div>• Snapback cap with £ coin badge</div>
          <div>• White cartoon gloves</div>
          <div>• Expressive eyebrows</div>
          <div>• Rubbery arm animations</div>
          <div>• Facial blush effects</div>
          <div>• Jelly leg movements</div>
          <div>• Simple teeth for big smiles</div>
          <div>• Optional accessories</div>
        </div>
      </div>
    </div>
  );
};

export default SmartieShowcase;