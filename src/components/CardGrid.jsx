import React from 'react';
import Card from './Card';

const CardGrid = ({ cards, openCards = [], onCardClick, disabled = false }) => {
  const isCardOpen = (cardId) => openCards.includes(cardId);

  const groupCardsByColor = () => {
    const groups = { green: [], red: [], blue: [], yellow: [] };
    
    cards.forEach(card => {
      if (groups[card.color]) {
        groups[card.color].push(card);
      }
    });
    
    return groups;
  };

  const colorGroups = groupCardsByColor();
  const colorNames = {
    green: 'Grün (Zahlen)',
    red: 'Rot (Zuweisungen/Kontrolle)',
    blue: 'Blau (Operatoren/Vergleiche)',
    yellow: 'Gelb (Variablen/Ausgabe)'
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold mb-4 text-center">Kartenpool</h3>
      
      <div className="space-y-6">
        {Object.entries(colorGroups).map(([color, colorCards]) => (
          colorCards.length > 0 && (
            <div key={color} className="space-y-3">
              <h4 className={`font-semibold text-lg ${
                color === 'green' ? 'text-green-700' :
                color === 'red' ? 'text-red-700' :
                color === 'blue' ? 'text-blue-700' :
                'text-yellow-700'
              }`}>
                {colorNames[color]}
              </h4>
              
              <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                {colorCards.map((card) => (
                  <Card
                    key={card.id}
                    card={card}
                    faceUp={isCardOpen(card.id)}
                    onClick={onCardClick}
                    disabled={disabled}
                  />
                ))}
              </div>
            </div>
          )
        ))}
      </div>

      {/* Statistics */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Gesamt: {cards.length} Karten</span>
          <span>Aufgedeckt: {openCards.length} Karten</span>
        </div>
      </div>

      {/* Teacher Controls */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-600 mb-2">Lehrkraft-Kontrollen:</div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              // This would be passed down from parent
              console.log('Reveal all cards');
            }}
            className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1 rounded transition-colors"
          >
            Alle aufdecken
          </button>
          <button
            onClick={() => {
              console.log('Hide all cards');
            }}
            className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded transition-colors"
          >
            Alle verdecken
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardGrid;
