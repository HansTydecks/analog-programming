import React from 'react';
import Card from './Card';

const StagingZone = ({ 
  group, 
  cards = [], 
  isValid = false, 
  onCardClick, 
  onExecute, 
  onClear,
  disabled = false 
}) => {
  const getValidationClass = () => {
    if (cards.length === 0) return 'staging-zone';
    return isValid ? 'staging-zone valid' : 'staging-zone invalid';
  };

  const getValidationMessage = () => {
    if (cards.length === 0) {
      return 'Ziehe Karten hierher um einen Befehl zu erstellen';
    }
    return isValid ? 'Gültiger Befehl!' : 'Ungültiger Befehl - überprüfe die Syntax';
  };

  const getValidationIcon = () => {
    if (cards.length === 0) return '📋';
    return isValid ? '✅' : '❌';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
      {/* Group Header */}
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-lg text-gray-800">
          {group.name}
        </h4>
        <div className="text-sm text-gray-600">
          ID: {group.id}
        </div>
      </div>

      {/* Staging Area */}
      <div className={`${getValidationClass()} mb-4`}>
        <div className="flex items-center justify-center mb-2">
          <span className="text-2xl mr-2">{getValidationIcon()}</span>
          <span className="text-sm font-medium text-gray-700">
            Staging-Bereich
          </span>
        </div>

        {cards.length === 0 ? (
          <div className="text-center text-gray-500 text-sm py-8">
            {getValidationMessage()}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 justify-center min-h-20">
            {cards.map((card, index) => (
              <div key={`${card.id}-${index}`} className="relative">
                <Card
                  card={card}
                  faceUp={true}
                  onClick={onCardClick}
                  disabled={disabled}
                />
                <div className="absolute -top-2 -right-2 bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Validation Message */}
      <div className={`text-center text-sm mb-4 p-2 rounded ${
        cards.length === 0 ? 'bg-gray-100 text-gray-600' :
        isValid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {getValidationMessage()}
      </div>

      {/* Command Preview */}
      {cards.length > 0 && (
        <div className="mb-4 p-3 bg-gray-50 rounded border-l-4 border-blue-500">
          <div className="text-xs font-medium text-gray-600 mb-1">Befehl:</div>
          <div className="font-mono text-sm text-gray-800">
            {cards.map(card => card.value).join(' ')}
          </div>
        </div>
      )}

      {/* Group Variables Display */}
      <div className="mb-4 p-3 bg-blue-50 rounded">
        <div className="text-xs font-medium text-blue-800 mb-2">Aktuelle Variablen:</div>
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="text-center">
            <div className="font-medium text-blue-700">x</div>
            <div className="text-blue-600">{group.variables.x ?? 'null'}</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-blue-700">y</div>
            <div className="text-blue-600">{group.variables.y ?? 'null'}</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-blue-700">score</div>
            <div className="text-blue-600">{group.variables.score ?? 'null'}</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2">
        <button
          onClick={() => onExecute && onExecute(group.id)}
          disabled={disabled || !isValid || cards.length === 0}
          className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:opacity-50 text-white font-medium py-2 px-4 rounded transition-colors"
        >
          Ausführen
        </button>
        
        <button
          onClick={() => onClear && onClear(group.id)}
          disabled={disabled || cards.length === 0}
          className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:opacity-50 text-white font-medium py-2 px-4 rounded transition-colors"
        >
          Löschen
        </button>
      </div>

      {/* Additional Info */}
      <div className="mt-3 text-xs text-gray-500 text-center">
        Joker benutzt: {group.jokerUsed ? 'Ja' : 'Nein'}
      </div>
    </div>
  );
};

export default StagingZone;
