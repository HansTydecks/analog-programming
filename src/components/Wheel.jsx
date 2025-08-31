import React, { useState, useEffect } from 'react';

const Wheel = ({ onSpin, onForceColor, disabled = false, isSpinning = false, lastResult = null }) => {
  const [rotation, setRotation] = useState(0);
  const [currentColor, setCurrentColor] = useState(null);

  const colors = [
    { name: 'green', color: '#22c55e', angle: 0 },
    { name: 'red', color: '#ef4444', angle: 90 },
    { name: 'blue', color: '#3b82f6', angle: 180 },
    { name: 'yellow', color: '#eab308', angle: 270 }
  ];

  const colorAngles = {
    green: 0,
    red: 90,
    blue: 180,
    yellow: 270
  };

  useEffect(() => {
    if (lastResult && lastResult.color) {
      // Calculate final rotation to land on the correct color
      const targetAngle = colorAngles[lastResult.color];
      const spinRotations = 5; // Number of full rotations
      const finalRotation = spinRotations * 360 + targetAngle;
      setRotation(finalRotation);
      setCurrentColor(lastResult.color);
    }
  }, [lastResult]);

  const handleSpin = () => {
    if (!disabled && !isSpinning) {
      onSpin();
    }
  };

  const handleForceColor = (colorName) => {
    if (!disabled && !isSpinning) {
      onForceColor(colorName);
      const targetAngle = colorAngles[colorName];
      const finalRotation = rotation + 360 + targetAngle;
      setRotation(finalRotation);
      setCurrentColor(colorName);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="relative">
        {/* Wheel */}
        <div 
          className={`relative w-64 h-64 rounded-full border-8 border-gray-800 ${isSpinning ? 'wheel-spinning' : ''}`}
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {colors.map((color, index) => (
            <div
              key={color.name}
              className="absolute w-full h-full"
              style={{
                transform: `rotate(${color.angle}deg)`,
                clipPath: 'polygon(50% 50%, 50% 0%, 100% 50%)'
              }}
            >
              <div
                className="w-full h-full"
                style={{ backgroundColor: color.color }}
              />
            </div>
          ))}
          
          {/* Center circle */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-gray-800 rounded-full border-4 border-white" />
        </div>

        {/* Pointer */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
          <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-gray-800" />
        </div>
      </div>

      {/* Current Result */}
      {currentColor && (
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-700">Aktuelle Farbe:</div>
          <div 
            className="inline-block px-6 py-3 rounded-lg text-white font-bold text-xl capitalize shadow-lg"
            style={{ backgroundColor: colors.find(c => c.name === currentColor)?.color }}
          >
            {currentColor === 'green' && 'Grün'}
            {currentColor === 'red' && 'Rot'}
            {currentColor === 'blue' && 'Blau'}
            {currentColor === 'yellow' && 'Gelb'}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-col items-center space-y-4">
        <button
          onClick={handleSpin}
          disabled={disabled || isSpinning}
          className="btn-primary text-xl px-8 py-4 disabled:opacity-50"
        >
          {isSpinning ? 'Dreht...' : 'Rad drehen'}
        </button>

        {/* Force Color Controls (for teacher) */}
        <div className="flex flex-col items-center space-y-2">
          <div className="text-sm text-gray-600 font-medium">Lehrkraft-Kontrolle:</div>
          <div className="flex space-x-2">
            {colors.map((color) => (
              <button
                key={color.name}
                onClick={() => handleForceColor(color.name)}
                disabled={disabled || isSpinning}
                className="w-12 h-12 rounded-full border-4 border-gray-300 hover:border-gray-600 transition-colors disabled:opacity-50"
                style={{ backgroundColor: color.color }}
                title={`Zwinge ${color.name}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wheel;
