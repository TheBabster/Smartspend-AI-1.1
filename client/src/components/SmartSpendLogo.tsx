import React, { useRef, useEffect } from 'react';

interface SmartSpendLogoProps {
  width?: number;
  height?: number;
  exportPNG?: boolean;
}

export const SmartSpendLogo: React.FC<SmartSpendLogoProps> = ({ 
  width = 400, 
  height = 200, 
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

    // Sparkle (star) - top left of head
    ctx.save();
    ctx.translate(centerX - 45, centerY - 25);
    ctx.fillStyle = '#FFB84D';
    ctx.strokeStyle = '#FFA500';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(0, -8);
    ctx.lineTo(2, -2);
    ctx.lineTo(8, 0);
    ctx.lineTo(2, 2);
    ctx.lineTo(0, 8);
    ctx.lineTo(-2, 2);
    ctx.lineTo(-8, 0);
    ctx.lineTo(-2, -2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Sparkle center highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.beginPath();
    ctx.arc(0, 0, 1, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Head Profile
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.fillStyle = '#FF6B9D';
    ctx.strokeStyle = '#FF5A8A';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-30, 15);
    ctx.bezierCurveTo(-30, 5, -25, -5, -15, -12);
    ctx.bezierCurveTo(-5, -18, 5, -20, 15, -18);
    ctx.bezierCurveTo(25, -16, 30, -10, 32, -2);
    ctx.bezierCurveTo(34, 6, 32, 14, 28, 20);
    ctx.bezierCurveTo(25, 25, 20, 28, 15, 30);
    ctx.bezierCurveTo(10, 32, 5, 32, 0, 30);
    ctx.lineTo(0, 35);
    ctx.bezierCurveTo(-5, 37, -10, 35, -12, 32);
    ctx.bezierCurveTo(-15, 28, -18, 24, -20, 20);
    ctx.bezierCurveTo(-25, 18, -28, 16, -30, 15);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Brain inside head
    ctx.save();
    ctx.translate(5, 5);
    
    // Brain outline
    ctx.fillStyle = '#E91E63';
    ctx.strokeStyle = '#D81B60';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(-12, -8);
    ctx.bezierCurveTo(-15, -10, -15, -12, -12, -14);
    ctx.bezierCurveTo(-8, -16, -4, -16, 0, -14);
    ctx.bezierCurveTo(4, -16, 8, -16, 12, -14);
    ctx.bezierCurveTo(15, -12, 15, -10, 12, -8);
    ctx.bezierCurveTo(15, -6, 15, -4, 12, -2);
    ctx.bezierCurveTo(15, 0, 15, 2, 12, 4);
    ctx.bezierCurveTo(8, 6, 4, 6, 0, 4);
    ctx.bezierCurveTo(-4, 6, -8, 6, -12, 4);
    ctx.bezierCurveTo(-15, 2, -15, 0, -12, -2);
    ctx.bezierCurveTo(-15, -4, -15, -6, -12, -8);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Brain folds
    ctx.strokeStyle = '#C2185B';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-8, -6);
    ctx.bezierCurveTo(-6, -8, -2, -8, 0, -6);
    ctx.bezierCurveTo(2, -8, 6, -8, 8, -6);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(-8, 0);
    ctx.bezierCurveTo(-6, -2, -2, -2, 0, 0);
    ctx.bezierCurveTo(2, -2, 6, -2, 8, 0);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(-6, 2);
    ctx.bezierCurveTo(-4, 0, 0, 0, 2, 2);
    ctx.bezierCurveTo(4, 0, 6, 0, 6, 2);
    ctx.stroke();

    // £ Symbol
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 14px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('£', 0, 2);
    
    ctx.restore(); // Brain transform

    // Navy blue orbital ring
    ctx.save();
    ctx.rotate(Math.PI / 7); // 25 degrees
    ctx.strokeStyle = '#1A237E';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.ellipse(0, 0, 40, 25, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    ctx.restore(); // Head transform

    // Text
    ctx.fillStyle = '#1A237E';
    ctx.textAlign = 'center';
    
    // SmartSpend main text
    ctx.font = 'bold 36px Arial, Helvetica, sans-serif';
    ctx.fillText('SmartSpend', centerX, h * 0.65);
    
    // Slogan
    ctx.font = 'normal 16px Arial, Helvetica, sans-serif';
    ctx.fillText('Think Smart. Spend Smarter.', centerX, h * 0.78);
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