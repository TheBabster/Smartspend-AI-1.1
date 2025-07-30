import React, { useState } from 'react';
import { SmartSpendLogo } from '../components/SmartSpendLogo';

export function LogoDemo() {
  const [exportPNG, setExportPNG] = useState(false);

  const handlePNGExport = () => {
    setExportPNG(true);
    setTimeout(() => setExportPNG(false), 1000);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">SmartSpend Logo Recreation</h1>
          <p className="text-gray-600">Exact recreation based on provided specifications</p>
        </div>

        {/* Logo Display */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <SmartSpendLogo width={400} height={280} exportPNG={exportPNG} />
        </div>

        {/* Export Controls */}
        <div className="text-center space-y-4">
          <div className="flex justify-center gap-4">
            <a 
              href="/smartspend-logo.svg" 
              download="smartspend-logo.svg"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Download SVG (Scalable)
            </a>
            <button 
              onClick={handlePNGExport}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Export High-Res PNG
            </button>
          </div>
          
          <p className="text-sm text-gray-500">
            SVG version is infinite resolution. PNG export creates a high-DPI image for print use.
          </p>
        </div>

        {/* Specifications */}
        <div className="mt-12 bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Design Specifications Met:</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Visual Elements:</h3>
              <ul className="text-sm space-y-1">
                <li>✓ Side-profile red-pink human head</li>
                <li>✓ Brain with detailed folds inside head</li>
                <li>✓ Yellow £ symbol in brain center</li>
                <li>✓ Navy blue diagonal orbital ring</li>
                <li>✓ Golden sparkle star (top-left)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Typography & Layout:</h3>
              <ul className="text-sm space-y-1">
                <li>✓ Clean, rounded sans-serif font</li>
                <li>✓ Bold "SmartSpend" in navy blue</li>
                <li>✓ "Think Smart. Spend Smarter." slogan</li>
                <li>✓ Transparent background</li>
                <li>✓ Balanced spacing and centering</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Color Palette */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Color Palette Used:</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-lg mb-2" style={{backgroundColor: '#FF6B9D'}}></div>
              <p className="text-xs font-mono">#FF6B9D</p>
              <p className="text-xs">Head Pink</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-lg mb-2" style={{backgroundColor: '#E91E63'}}></div>
              <p className="text-xs font-mono">#E91E63</p>
              <p className="text-xs">Brain Pink</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-lg mb-2" style={{backgroundColor: '#FFD700'}}></div>
              <p className="text-xs font-mono">#FFD700</p>
              <p className="text-xs">£ Symbol</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-lg mb-2" style={{backgroundColor: '#1A237E'}}></div>
              <p className="text-xs font-mono">#1A237E</p>
              <p className="text-xs">Navy Blue</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-lg mb-2" style={{backgroundColor: '#FFB84D'}}></div>
              <p className="text-xs font-mono">#FFB84D</p>
              <p className="text-xs">Sparkle Gold</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}