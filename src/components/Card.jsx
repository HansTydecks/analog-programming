import React from 'react';

const Card = ({ card, faceUp = true, selected = false, onClick, disabled = false }) => {
  const getCardColor = () => {
    if (!faceUp) return 'face-down';
    
    switch (card.color) {
      case 'green': return 'border-green-500 bg-green-50';
      case 'red': return 'border-red-500 bg-red-50';
      case 'blue': return 'border-blue-500 bg-blue-50';
      case 'yellow': return 'border-yellow-500 bg-yellow-50';
      default: return 'border-gray-300 bg-white';
    }
  };

  const getTypeIcon = () => {
    switch (card.type) {
      case 'number': return '🔢';
      case 'operator': return '⚙️';
      case 'assign': return '📝';
      case 'varref': return '📊';
      case 'print': return '🖨️';
      case 'conditional': return '🔀';
      case 'compare': return '⚖️';
      case 'loop': return '🔄';
      case 'for': return '🔢';
      case 'logical': return '🧠';
      default: return '❓';
    }
  };

  const handleClick = () => {
    if (!disabled && onClick) {
      onClick(card);
    }
  };

  return (
    <div
      className={`
        card-game w-24 h-32 flex flex-col items-center justify-center text-center
        ${getCardColor()}
        ${selected ? 'selected' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${!faceUp ? 'text-white' : 'text-gray-900'}
      `}
      onClick={handleClick}
      title={faceUp ? `${card.type}: ${card.value}` : 'Verdeckte Karte'}
    >
      {faceUp ? (
        <>
          <div className="text-xs mb-1">{getTypeIcon()}</div>
          <div className="font-bold text-sm leading-tight">
            {card.value}
          </div>
          <div className="text-xs mt-1 opacity-70">
            {card.type}
          </div>
        </>
      ) : (
        <>
          <div className="text-2xl mb-2">🃏</div>
          <div className="text-xs">Verdeckt</div>
        </>
      )}
    </div>
  );
};

export default Card;
