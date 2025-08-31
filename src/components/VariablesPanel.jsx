import React from 'react';

const VariablesPanel = ({ variables, targetScore = null, onVariableChange }) => {
  const getVariableColor = (varName, value) => {
    if (value === null || value === undefined) {
      return 'text-gray-400 bg-gray-100';
    }
    
    if (varName === 'score' && targetScore !== null) {
      const distance = Math.abs(value - targetScore);
      if (distance === 0) return 'text-green-800 bg-green-100';
      if (distance <= 5) return 'text-yellow-800 bg-yellow-100';
      if (distance <= 20) return 'text-orange-800 bg-orange-100';
      return 'text-red-800 bg-red-100';
    }
    
    return 'text-blue-800 bg-blue-100';
  };

  const getProgressToTarget = () => {
    if (targetScore === null || variables.score === null) return null;
    
    const current = variables.score;
    const target = targetScore;
    const distance = Math.abs(current - target);
    
    return {
      distance,
      percentage: Math.max(0, 100 - (distance / target) * 100),
      isClose: distance <= 5,
      isVeryClose: distance === 0
    };
  };

  const progress = getProgressToTarget();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold mb-4 text-center text-gray-800">
        Programmvariablen
      </h3>

      {/* Variables Display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {Object.entries(variables).map(([varName, value]) => (
          <div
            key={varName}
            className={`p-4 rounded-lg border-2 border-solid ${getVariableColor(varName, value)} transition-all duration-300`}
          >
            <div className="text-center">
              <div className="text-sm font-medium uppercase tracking-wide mb-2">
                {varName}
              </div>
              <div className="text-3xl font-bold font-mono">
                {value !== null && value !== undefined ? value : 'null'}
              </div>
              
              {/* Special handling for score with target */}
              {varName === 'score' && targetScore !== null && value !== null && (
                <div className="mt-2 text-xs">
                  {progress?.isVeryClose && (
                    <div className="text-green-600 font-bold">🎯 ZIEL ERREICHT!</div>
                  )}
                  {progress?.isClose && !progress?.isVeryClose && (
                    <div className="text-yellow-600 font-bold">🔥 SEHR NAH!</div>
                  )}
                  {!progress?.isClose && (
                    <div className="text-gray-600">
                      Abstand: {progress?.distance}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Target Score Display */}
      {targetScore !== null && (
        <div className="mb-6 p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg border-2 border-purple-300">
          <div className="text-center">
            <div className="text-sm font-medium text-purple-800 mb-2">
              🎯 ZIELWERT
            </div>
            <div className="text-2xl font-bold text-purple-900">
              {targetScore}
            </div>
            
            {progress && (
              <div className="mt-3">
                <div className="w-full bg-purple-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      progress.isVeryClose ? 'bg-green-500' :
                      progress.isClose ? 'bg-yellow-500' : 'bg-purple-500'
                    }`}
                    style={{ width: `${Math.min(100, progress.percentage)}%` }}
                  />
                </div>
                <div className="text-xs text-purple-700 mt-1">
                  {progress.isVeryClose ? 'Perfekt!' : 
                   progress.isClose ? 'Fast geschafft!' : 
                   `${progress.percentage.toFixed(1)}% erreicht`}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Manual Variable Editor (Teacher Control) */}
      <div className="border-t pt-4">
        <div className="text-sm text-gray-600 mb-3 text-center">
          Lehrkraft-Kontrolle: Variablen manuell setzen
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {Object.entries(variables).map(([varName, value]) => (
            <div key={varName} className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700 min-w-12">
                {varName}:
              </label>
              <input
                type="number"
                value={value !== null && value !== undefined ? value : ''}
                onChange={(e) => {
                  const newValue = e.target.value === '' ? null : parseInt(e.target.value);
                  if (onVariableChange) {
                    onVariableChange(varName, newValue);
                  }
                }}
                placeholder="null"
                className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
              />
            </div>
          ))}
        </div>
        
        <div className="mt-3 text-center">
          <button
            onClick={() => {
              if (onVariableChange) {
                Object.keys(variables).forEach(varName => {
                  onVariableChange(varName, null);
                });
              }
            }}
            className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded transition-colors"
          >
            Alle zurücksetzen
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="mt-4 pt-4 border-t border-gray-200 text-center">
        <div className="text-xs text-gray-500">
          Initialisierte Variablen: {Object.values(variables).filter(v => v !== null && v !== undefined).length} / {Object.keys(variables).length}
        </div>
      </div>
    </div>
  );
};

export default VariablesPanel;
