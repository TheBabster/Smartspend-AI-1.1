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
    const centerY = h * 0.28;

    // Sparkle (star) with glow - top left of head
    ctx.save();
    ctx.translate(centerX - 55, centerY - 35);
    
    // Glow effect
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 12);
    gradient.addColorStop(0, 'rgba(255, 215, 0, 0.8)');
    gradient.addColorStop(0.7, 'rgba(255, 184, 77, 0.6)');
    gradient.addColorStop(1, 'rgba(255, 140, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, 12, 0, Math.PI * 2);
    ctx.fill();
    
    // Main sparkle star
    ctx.fillStyle = '#FFB84D';
    ctx.strokeStyle = '#FF8C00';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(0, -10);
    ctx.lineTo(3, -3);
    ctx.lineTo(10, 0);
    ctx.lineTo(3, 3);
    ctx.lineTo(0, 10);
    ctx.lineTo(-3, 3);
    ctx.lineTo(-10, 0);
    ctx.lineTo(-3, -3);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Inner highlight
    ctx.fillStyle = 'rgba(255, 215, 0, 0.9)';
    ctx.beginPath();
    ctx.moveTo(0, -6);
    ctx.lineTo(1.8, -1.8);
    ctx.lineTo(6, 0);
    ctx.lineTo(1.8, 1.8);
    ctx.lineTo(0, 6);
    ctx.lineTo(-1.8, 1.8);
    ctx.lineTo(-6, 0);
    ctx.lineTo(-1.8, -1.8);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Head Profile - more accurate proportions
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.fillStyle = '#FF6B9D';
    ctx.strokeStyle = '#E91E63';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-35, 20);
    ctx.bezierCurveTo(-35, 8, -30, -8, -18, -18);
    ctx.bezierCurveTo(-8, -25, 8, -28, 22, -25);
    ctx.bezierCurveTo(32, -22, 38, -15, 40, -5);
    ctx.bezierCurveTo(42, 5, 40, 16, 35, 25);
    ctx.bezierCurveTo(30, 32, 22, 37, 15, 40);
    ctx.bezierCurveTo(8, 42, 0, 42, -5, 40);
    ctx.lineTo(-5, 48);
    ctx.bezierCurveTo(-10, 50, -18, 48, -22, 44);
    ctx.bezierCurveTo(-26, 38, -30, 30, -33, 24);
    ctx.bezierCurveTo(-34, 22, -35, 21, -35, 20);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Brain inside head - more detailed
    ctx.save();
    ctx.translate(8, 8);
    
    // Brain main shape
    ctx.fillStyle = '#E91E63';
    ctx.strokeStyle = '#C2185B';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-15, -12);
    ctx.bezierCurveTo(-20, -15, -20, -18, -15, -20);
    ctx.bezierCurveTo(-10, -22, -5, -22, 0, -20);
    ctx.bezierCurveTo(5, -22, 10, -22, 15, -20);
    ctx.bezierCurveTo(20, -18, 20, -15, 15, -12);
    ctx.bezierCurveTo(20, -9, 20, -6, 15, -4);
    ctx.bezierCurveTo(20, -1, 20, 2, 15, 5);
    ctx.bezierCurveTo(10, 8, 5, 8, 0, 5);
    ctx.bezierCurveTo(-5, 8, -10, 8, -15, 5);
    ctx.bezierCurveTo(-20, 2, -20, -1, -15, -4);
    ctx.bezierCurveTo(-20, -6, -20, -9, -15, -12);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Detailed brain folds
    ctx.strokeStyle = '#AD1457';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(-12, -8);
    ctx.bezierCurveTo(-8, -12, -3, -12, 0, -8);
    ctx.bezierCurveTo(3, -12, 8, -12, 12, -8);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(-12, -2);
    ctx.bezierCurveTo(-8, -6, -3, -6, 0, -2);
    ctx.bezierCurveTo(3, -6, 8, -6, 12, -2);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(-10, 2);
    ctx.bezierCurveTo(-6, -2, -2, -2, 2, 2);
    ctx.bezierCurveTo(6, -2, 10, -2, 10, 2);
    ctx.stroke();
    
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-8, 5);
    ctx.bezierCurveTo(-4, 1, 0, 1, 4, 5);
    ctx.bezierCurveTo(8, 1, 8, 1, 8, 5);
    ctx.stroke();

    // Additional brain texture
    ctx.fillStyle = 'rgba(194, 24, 91, 0.6)';
    ctx.beginPath();
    ctx.arc(-6, -5, 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(6, -3, 1.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(-3, 1, 1, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(4, 3, 1.3, 0, Math.PI * 2);
    ctx.fill();

    // £ Symbol in center - bold and prominent
    ctx.fillStyle = '#FFD700';
    ctx.strokeStyle = '#FF8C00';
    ctx.lineWidth = 0.5;
    ctx.font = '900 18px Arial Black, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.strokeText('£', 0, 3);
    ctx.fillText('£', 0, 3);
    
    ctx.restore(); // Brain transform

    // Navy blue orbital ring - passing behind head
    ctx.save();
    ctx.rotate(Math.PI / 6.4); // 28 degrees
    ctx.strokeStyle = 'rgba(26, 35, 126, 0.95)';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.ellipse(0, 0, 50, 32, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    ctx.restore(); // Head transform

    // Text - properly spaced
    ctx.fillStyle = '#1A237E';
    ctx.textAlign = 'center';
    
    // SmartSpend main text - exact font match
    ctx.font = '700 42px Inter, system-ui, -apple-system, sans-serif';
    ctx.fillText('SmartSpend', centerX, h * 0.68);
    
    // Slogan - proper spacing
    ctx.font = '400 18px Inter, system-ui, -apple-system, sans-serif';
    ctx.fillText('Think Smart. Spend Smarter.', centerX, h * 0.79);
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