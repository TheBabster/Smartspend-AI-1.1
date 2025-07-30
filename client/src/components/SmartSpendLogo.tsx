import React, { useRef, useEffect } from 'react';

interface SmartSpendLogoProps {
  width?: number;
  height?: number;
  exportPNG?: boolean;
}

export const SmartSpendLogo: React.FC<SmartSpendLogoProps> = ({ 
  width = 400, 
  height = 280, 
  exportPNG = false 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (exportPNG && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set high DPI for sharp PNG export
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr * 2; // Extra high resolution
      canvas.height = height * dpr * 2;
      ctx.scale(dpr * 2, dpr * 2);

      // Clear background
      ctx.clearRect(0, 0, width, height);
      
      drawLogo(ctx, width, height);

      // Auto-download PNG
      setTimeout(() => {
        const link = document.createElement('a');
        link.download = 'smartspend-logo.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      }, 100);
    }
  }, [exportPNG, width, height]);

  const drawLogo = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const centerX = w / 2;
    const centerY = h * 0.3;

    // 4-pointed sparkle star with glow - top left of head
    ctx.save();
    ctx.translate(centerX - 62, centerY - 42);
    
    // Glow effect
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 15);
    gradient.addColorStop(0, 'rgba(255, 215, 0, 0.6)');
    gradient.addColorStop(0.5, 'rgba(255, 184, 77, 0.4)');
    gradient.addColorStop(1, 'rgba(255, 140, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, 15, 0, Math.PI * 2);
    ctx.fill();
    
    // Main 4-pointed star
    ctx.fillStyle = '#FFB84D';
    ctx.strokeStyle = '#FF9800';
    ctx.lineWidth = 0.3;
    ctx.beginPath();
    ctx.moveTo(0, -12);
    ctx.lineTo(2.5, -2.5);
    ctx.lineTo(12, 0);
    ctx.lineTo(2.5, 2.5);
    ctx.lineTo(0, 12);
    ctx.lineTo(-2.5, 2.5);
    ctx.lineTo(-12, 0);
    ctx.lineTo(-2.5, -2.5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Inner highlight
    ctx.fillStyle = 'rgba(255, 215, 0, 0.9)';
    ctx.beginPath();
    ctx.moveTo(0, -7);
    ctx.lineTo(1.5, -1.5);
    ctx.lineTo(7, 0);
    ctx.lineTo(1.5, 1.5);
    ctx.lineTo(0, 7);
    ctx.lineTo(-1.5, 1.5);
    ctx.lineTo(-7, 0);
    ctx.lineTo(-1.5, -1.5);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Realistic Human Profile Silhouette with facial details
    ctx.save();
    ctx.translate(centerX, centerY + 5);
    ctx.fillStyle = '#FF6B9D';
    ctx.strokeStyle = '#F48FB1';
    ctx.lineWidth = 1;
    ctx.beginPath();
    // Head outline with realistic proportions
    ctx.moveTo(-42, 18);
    ctx.bezierCurveTo(-42, 6, -38, -10, -28, -22);
    ctx.bezierCurveTo(-20, -30, -8, -35, 5, -34);
    ctx.bezierCurveTo(18, -33, 28, -28, 35, -20);
    ctx.bezierCurveTo(40, -14, 42, -6, 42, 2);
    ctx.bezierCurveTo(42, 8, 40, 14, 37, 19);
    ctx.bezierCurveTo(35, 22, 33, 24, 31, 26);
    ctx.bezierCurveTo(29, 28, 27, 30, 25, 32);
    ctx.bezierCurveTo(23, 34, 21, 36, 18, 38);
    ctx.bezierCurveTo(15, 40, 12, 41, 9, 42);
    ctx.bezierCurveTo(6, 43, 3, 43, 0, 42);
    ctx.lineTo(0, 47);
    ctx.bezierCurveTo(-2, 49, -4, 50, -6, 51);
    ctx.bezierCurveTo(-8, 52, -10, 52, -12, 51);
    ctx.bezierCurveTo(-14, 50, -16, 48, -18, 46);
    ctx.bezierCurveTo(-20, 44, -22, 42, -24, 39);
    ctx.bezierCurveTo(-26, 36, -28, 33, -30, 30);
    ctx.bezierCurveTo(-32, 27, -34, 24, -36, 21);
    ctx.bezierCurveTo(-38, 20, -40, 19, -42, 18);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Realistic facial features
    // Nose
    ctx.strokeStyle = '#F48FB1';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(25, 15);
    ctx.bezierCurveTo(27, 13, 28, 10, 27, 8);
    ctx.stroke();
    
    // Lips
    ctx.fillStyle = '#E91E63';
    ctx.strokeStyle = '#C2185B';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(15, 30);
    ctx.bezierCurveTo(17, 32, 19, 32, 21, 30);
    ctx.fill();
    ctx.stroke();
    
    // Chin definition
    ctx.strokeStyle = '#F48FB1';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(10, 38);
    ctx.bezierCurveTo(12, 40, 14, 41, 16, 40);
    ctx.stroke();
    
    // Jaw line
    ctx.beginPath();
    ctx.moveTo(16, 40);
    ctx.bezierCurveTo(20, 38, 24, 36, 28, 32);
    ctx.stroke();

    // Detailed Brain inside head
    ctx.save();
    ctx.translate(5, 3);
    
    // Brain main shape with gradient effect
    const brainGradient = ctx.createRadialGradient(-8, -8, 0, 0, 0, 25);
    brainGradient.addColorStop(0, '#F06292');
    brainGradient.addColorStop(1, '#E91E63');
    ctx.fillStyle = brainGradient;
    ctx.strokeStyle = '#C2185B';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(-18, -15);
    ctx.bezierCurveTo(-24, -18, -25, -22, -20, -25);
    ctx.bezierCurveTo(-15, -27, -8, -27, 0, -25);
    ctx.bezierCurveTo(8, -27, 15, -27, 20, -25);
    ctx.bezierCurveTo(25, -22, 24, -18, 18, -15);
    ctx.bezierCurveTo(24, -12, 25, -8, 20, -5);
    ctx.bezierCurveTo(25, -2, 25, 2, 20, 6);
    ctx.bezierCurveTo(15, 9, 8, 9, 0, 6);
    ctx.bezierCurveTo(-8, 9, -15, 9, -20, 6);
    ctx.bezierCurveTo(-25, 2, -25, -2, -20, -5);
    ctx.bezierCurveTo(-25, -8, -24, -12, -18, -15);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Detailed brain hemisphere division
    ctx.strokeStyle = '#AD1457';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, -25);
    ctx.bezierCurveTo(0, -15, 0, -5, 0, 6);
    ctx.stroke();

    // Left hemisphere folds
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(-15, -12);
    ctx.bezierCurveTo(-12, -16, -8, -16, -5, -12);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-15, -6);
    ctx.bezierCurveTo(-12, -10, -8, -10, -5, -6);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-15, 0);
    ctx.bezierCurveTo(-12, -4, -8, -4, -5, 0);
    ctx.stroke();
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.moveTo(-12, 3);
    ctx.bezierCurveTo(-9, -1, -6, -1, -3, 3);
    ctx.stroke();

    // Right hemisphere folds
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(5, -12);
    ctx.bezierCurveTo(8, -16, 12, -16, 15, -12);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(5, -6);
    ctx.bezierCurveTo(8, -10, 12, -10, 15, -6);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(5, 0);
    ctx.bezierCurveTo(8, -4, 12, -4, 15, 0);
    ctx.stroke();
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.moveTo(3, 3);
    ctx.bezierCurveTo(6, -1, 9, -1, 12, 3);
    ctx.stroke();

    // Brain texture details
    ctx.fillStyle = 'rgba(194, 24, 91, 0.7)';
    ctx.beginPath();
    ctx.arc(-8, -8, 1.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(8, -6, 1, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(-6, 0, 0.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(6, 2, 1.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(-3, -3, 0.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(3, -1, 0.7, 0, Math.PI * 2);
    ctx.fill();

    // Bold Yellow £ Symbol at center
    ctx.fillStyle = '#FFD700';
    ctx.strokeStyle = '#FF8F00';
    ctx.lineWidth = 0.8;
    ctx.font = '900 20px Inter, Arial Black, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.strokeText('£', 0, 2);
    ctx.fillText('£', 0, 2);
    
    ctx.restore(); // Brain transform

    // Thick Navy Blue Orbital Ring - wraps behind head and under chin
    ctx.save();
    ctx.translate(-2, 2);
    ctx.rotate(Math.PI / 7.2); // 25 degrees
    ctx.strokeStyle = 'rgba(26, 35, 126, 0.95)';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.ellipse(0, 0, 55, 35, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    ctx.restore(); // Head transform

    // Text - exact typography match
    ctx.textAlign = 'center';
    
    // SmartSpend main text - Dark Navy Inter Bold
    ctx.fillStyle = '#1A237E';
    ctx.font = '700 44px Inter, system-ui, -apple-system, sans-serif';
    ctx.fillText('SmartSpend', centerX, h * 0.7);
    
    // Slogan - Lighter Navy Regular Weight
    ctx.fillStyle = '#3949AB';
    ctx.font = '400 18px Inter, system-ui, -apple-system, sans-serif';
    ctx.fillText('Think Smart. Spend Smarter.', centerX, h * 0.82);
  };

  return (
    <div className="flex flex-col items-center p-8">
      {/* SVG Version */}
      <div className="mb-8">
        <h3 className="text-lg font-bold mb-4">SVG Version (Scalable)</h3>
        <img 
          src="/smartspend-logo.svg" 
          alt="SmartSpend Logo" 
          width={width} 
          height={height}
          className="border border-gray-200 rounded-lg"
        />
      </div>

      {/* Canvas for PNG Export */}
      {exportPNG && (
        <div className="mb-8">
          <h3 className="text-lg font-bold mb-4">High-Resolution PNG Export</h3>
          <canvas 
            ref={canvasRef}
            style={{ width: width, height: height }}
            className="border border-gray-200 rounded-lg"
          />
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-4">
        <a 
          href="/smartspend-logo.svg" 
          download="smartspend-logo.svg"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Download SVG
        </a>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Export PNG
        </button>
      </div>

      {/* Design Specifications */}
      <div className="mt-8 max-w-2xl text-sm text-gray-600">
        <h4 className="font-bold mb-2">Design Specifications:</h4>
        <ul className="list-disc list-inside space-y-1">
          <li>Side-profile red-pink human head (#FF6B9D) with brain inside (#E91E63)</li>
          <li>Yellow pound (£) symbol (#FFD700) embedded in brain center</li>
          <li>Navy blue orbital ring (#1A237E) loops diagonally around head</li>
          <li>Golden sparkle star (#FFB84D) positioned top-left above head</li>
          <li>Bold navy blue text (#1A237E) "SmartSpend" with clean sans-serif font</li>
          <li>Slogan "Think Smart. Spend Smarter." in normal weight, same color</li>
          <li>Transparent background, balanced spacing, centered alignment</li>
        </ul>
      </div>
    </div>
  );
};