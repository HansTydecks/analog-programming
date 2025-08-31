import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import cardsConfig from '../config/cards.json';
import WheelAlgorithm from '../lib/wheelAlgorithm';
import GameEvaluator from '../lib/evaluator';

// Components
import Wheel from './Wheel';
import Timer from './Timer';
import LogPanel from './LogPanel';

const QuizmasterInterface = ({ gameConfig, onExit, onShowRules }) => {
  // Game State
  const [gameState, setGameState] = useState(null);
  const [wheelAlgorithm] = useState(() => new WheelAlgorithm());
  const [evaluator] = useState(() => new GameEvaluator());
  
  // UI State
  const [isSpinning, setIsSpinning] = useState(false);
  const [lastWheelResult, setLastWheelResult] = useState(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerKey, setTimerKey] = useState(0); // Key to force timer reset
  const [printEvent, setPrintEvent] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showLog, setShowLog] = useState(false); // Toggle for log panel
  const [currentRound, setCurrentRound] = useState(1); // Track current round
  const [isRandomizingGlobal, setIsRandomizingGlobal] = useState(false); // Animation state for global_1 randomization
  const [showPrintDisplay, setShowPrintDisplay] = useState(false); // Show print display when yellow is spun
  const [isFirstSpin, setIsFirstSpin] = useState(true); // Track if this is the first spin

  // Initialize game state
  useEffect(() => {
    initializeGame();
  }, [gameConfig]);

  // Calculate current timer duration based on adaptive time settings
  const getCurrentTimerDuration = () => {
    if (!gameState) return 30;
    
    const { config, rounds } = gameState;
    const { adaptiveTime } = config;
    
    if (!adaptiveTime.enabled || rounds.current < adaptiveTime.startRound) {
      return config.timerSeconds;
    }
    
    const roundsIntoAdaptive = rounds.current - adaptiveTime.startRound + 1;
    const reduction = (roundsIntoAdaptive - 1) * adaptiveTime.reductionPerRound;
    const newDuration = config.timerSeconds - reduction;
    
    // Minimum 5 seconds
    return Math.max(5, newDuration);
  };

  const initializeGame = () => {
    const levelProbabilities = cardsConfig.gameConfig.wheelProbabilities[`level${gameConfig.level}`] || 
                              cardsConfig.gameConfig.wheelProbabilities.level1;
    
    // Update wheel algorithm with level-specific probabilities
    wheelAlgorithm.updateBaseProbabilities(levelProbabilities);
    
    const newGameState = {
      gameId: uuidv4(),
      level: gameConfig.level,
      variables: { global_1: null },
      rounds: {
        total: gameConfig.rounds || cardsConfig.gameConfig.defaultRounds,
        current: 1
      },
      state: {
        lastSpins: [],
        log: []
      },
      config: {
        timerSeconds: gameConfig.timerSeconds || 30,
        targetScore: gameConfig.targetScore || 100,
        wheelProbabilities: levelProbabilities,
        sounds: { ...cardsConfig.gameConfig.sounds, enabled: soundEnabled },
        adaptiveTime: gameConfig.adaptiveTime || { enabled: false, startRound: 5, reductionPerRound: 10 }
      }
    };

    setGameState(newGameState);
    setCurrentRound(1);
    evaluator.reset();
  };

  // Wheel handling
  const handleSpin = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setTimerRunning(false);
    
    setTimeout(() => {
      const result = wheelAlgorithm.spin();
      setLastWheelResult(result);
      setIsSpinning(false);
      
      // Special handling for yellow = print function
      if (result.color === 'yellow') {
        setShowPrintDisplay(true);
        // Auto-hide print display after 5 seconds
        setTimeout(() => {
          setShowPrintDisplay(false);
        }, 5000);
      }
      
      // Reset and start timer
      setTimerKey(prev => prev + 1); // Force timer reset
      setTimerRunning(true);
      
      // Increment round (only after first spin)
      let nextRound = currentRound;
      if (!isFirstSpin) {
        nextRound = Math.min(currentRound + 1, gameState.rounds.total);
        setCurrentRound(nextRound);
        setGameState(prev => ({
          ...prev,
          rounds: { ...prev.rounds, current: nextRound }
        }));
      } else {
        setIsFirstSpin(false); // Mark that first spin is done
      }
      
      // Log the spin
      const actionDescription = result.color === 'yellow' ? 
        `Rad gedreht - Print-Funktion aktiviert - Runde ${nextRound}` :
        `Rad gedreht - Runde ${nextRound}`;
      evaluator.logAction('teacher', actionDescription, `Farbe: ${result.color}`);
      updateGameLog();
    }, 3000); // 3 second spin animation
  };

  const handleForceColor = (color) => {
    if (isSpinning) return;
    
    const result = wheelAlgorithm.forceColor(color);
    setLastWheelResult(result);
    
    // Reset and start timer
    setTimerKey(prev => prev + 1); // Force timer reset
    setTimerRunning(true);
    
    // Increment round (only after first spin)
    let nextRound = currentRound;
    if (!isFirstSpin) {
      nextRound = Math.min(currentRound + 1, gameState.rounds.total);
      setCurrentRound(nextRound);
      setGameState(prev => ({
        ...prev,
        rounds: { ...prev.rounds, current: nextRound }
      }));
    } else {
      setIsFirstSpin(false); // Mark that first spin is done
    }
    
    // Log the forced spin
    evaluator.logAction('teacher', `Farbe erzwungen - Runde ${nextRound}`, `Farbe: ${color}`);
    updateGameLog();
  };

  // Timer handling
  const handleTimerEnd = () => {
    setTimerRunning(false);
    evaluator.logAction('system', 'Timer abgelaufen', '30 Sekunden vorbei');
    updateGameLog();
  };

  const updateGameLog = () => {
    setGameState(prev => ({
      ...prev,
      state: {
        ...prev.state,
        log: evaluator.getLog()
      }
    }));
  };

  // Teacher controls
  const handleVariableChange = (varName, value) => {
    evaluator.setVariables({ [varName]: value });
    const newVariables = evaluator.getVariables();
    
    setGameState(prev => ({
      ...prev,
      variables: newVariables
    }));

    evaluator.logAction('teacher', `Variable manuell gesetzt`, `${varName} = ${value}`);
    updateGameLog();
  };

  // Randomize global_1 with animation
  const randomizeGlobal1 = () => {
    if (isRandomizingGlobal) return; // Prevent multiple simultaneous animations
    
    setIsRandomizingGlobal(true);
    let counter = 0;
    const maxSteps = 15; // Number of animation steps
    
    const animationInterval = setInterval(() => {
      // Generate random number during animation
      const tempValue = Math.floor(Math.random() * 11) + 5; // 5-15
      
      setGameState(prev => ({
        ...prev,
        variables: { ...prev.variables, global_1: tempValue }
      }));
      
      counter++;
      
      if (counter >= maxSteps) {
        clearInterval(animationInterval);
        
        // Set final random value
        const finalValue = Math.floor(Math.random() * 11) + 5; // 5-15
        evaluator.setVariables({ global_1: finalValue });
        const newVariables = evaluator.getVariables();
        
        setGameState(prev => ({
          ...prev,
          variables: newVariables
        }));
        
        evaluator.logAction('teacher', 'Global Variable randomisiert', `global_1 = ${finalValue} (Zufallswert 5-15)`);
        updateGameLog();
        setIsRandomizingGlobal(false);
      }
    }, 100); // Animation speed: 100ms per step
  };

  const exportGameState = () => {
    const exportData = {
      gameState,
      evaluatorState: evaluator.exportState(),
      wheelStats: wheelAlgorithm.getStats(),
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quizmaster-state-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetGame = () => {
    evaluator.reset();
    wheelAlgorithm.reset();
    setLastWheelResult(null);
    setTimerRunning(false);
    setTimerKey(prev => prev + 1); // Reset timer
    setCurrentRound(1);
    setIsFirstSpin(true); // Reset first spin flag
    setGameState(prev => ({
      ...prev,
      variables: { global_1: null },
      rounds: { ...prev.rounds, current: 1 },
      state: {
        lastSpins: [],
        log: []
      }
    }));
  };

  if (!gameState) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🎮</div>
          <div className="text-xl">Quizmaster wird initialisiert...</div>
        </div>
      </div>
    );
  }

  // Dynamic background based on wheel result
  const getBackgroundClasses = () => {
    if (!lastWheelResult) {
      return "min-h-screen bg-gradient-to-br from-gray-50 to-gray-100";
    }
    
    switch (lastWheelResult.color) {
      case 'green':
        return "min-h-screen bg-gradient-to-br from-green-50 to-green-100";
      case 'red':
        return "min-h-screen bg-gradient-to-br from-red-50 to-red-100";
      case 'blue':
        return "min-h-screen bg-gradient-to-br from-blue-50 to-blue-100";
      case 'yellow':
        return "min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100";
      default:
        return "min-h-screen bg-gradient-to-br from-gray-50 to-gray-100";
    }
  };

  return (
    <div className={getBackgroundClasses()}>
      {/* Print Event Overlay */}
      {printEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 text-center shadow-2xl">
            <div className="text-6xl mb-4">🖨️</div>
            <div className="text-2xl font-bold mb-2">Print-Ausgabe</div>
            <div className="text-4xl font-mono text-blue-600">
              {printEvent.variable} = {printEvent.value}
            </div>
          </div>
        </div>
      )}

      {/* Yellow Wheel Result = Print Display */}
      {showPrintDisplay && (
        <div className="fixed inset-0 bg-yellow-900 bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-yellow-100 border-4 border-yellow-500 rounded-xl p-12 text-center shadow-2xl max-w-2xl">
            <div className="text-8xl mb-6 animate-pulse">📺</div>
            <div className="text-3xl font-bold text-yellow-800 mb-4">
              ANALOGER BILDSCHIRM
            </div>
            <div className="text-6xl font-mono text-yellow-900 mb-6 bg-yellow-200 p-4 rounded-lg border-2 border-yellow-600">
              print(score)
            </div>
            <div className="text-xl text-yellow-700 mb-4">
              📝 Schüler sollen den aktuellen Score-Wert<br/>
              auf den analogen Bildschirm schreiben!
            </div>
            <button
              onClick={() => setShowPrintDisplay(false)}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg font-bold text-lg"
            >
              ✅ Verstanden
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm shadow-md p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                🎲 Quizmaster - {cardsConfig[`level${gameState.level}`]?.name}
              </h1>
              <div className="text-sm text-gray-600">
                Zielwert: {gameState.config.targetScore} | 
                Timer: {gameState.config.adaptiveTime.enabled ? `${getCurrentTimerDuration()}s (adaptiv)` : `${gameState.config.timerSeconds}s`} |
                Vereinfachter Modus
              </div>
            </div>          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
                className="rounded"
              />
              <span>Sound</span>
            </label>
            
            <button
              onClick={onShowRules}
              className="btn-secondary text-sm"
            >
              📚 Regeln
            </button>
            
            <button
              onClick={exportGameState}
              className="btn-secondary text-sm"
            >
              📊 Exportieren
            </button>

            <button
              onClick={resetGame}
              className="btn-secondary text-sm"
            >
              🔄 Reset
            </button>
            
            <button
              onClick={onExit}
              className="btn-danger text-sm"
            >
              ❌ Beenden
            </button>
          </div>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="max-w-6xl mx-auto p-6">
        {/* Wheel and Timer Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
          {/* Wheel Section */}
          <div className="card">
            <h2 className="text-3xl font-bold mb-6 text-center">🎲 Glücksrad</h2>
            <Wheel
              onSpin={handleSpin}
              onForceColor={handleForceColor}
              disabled={false}
              isSpinning={isSpinning}
              lastResult={lastWheelResult}
            />
          </div>
          
          {/* Timer Section */}
          <div className="card">
            <h2 className="text-3xl font-bold mb-6 text-center">⏱️ Timer</h2>
            <Timer
              key={timerKey}
              duration={getCurrentTimerDuration()}
              isRunning={timerRunning}
              onTimeUp={handleTimerEnd}
              soundEnabled={soundEnabled}
            />
            {/* Timer Info and Round Counter */}
            <div className="mt-4 text-center">
              {gameState.config.adaptiveTime.enabled && (
                <div className="text-sm text-blue-600 mb-2">
                  <strong>Adaptive Zeit:</strong> {getCurrentTimerDuration()}s 
                  {gameState.rounds.current >= gameState.config.adaptiveTime.startRound ? (
                    <span> (reduziert ab Runde {gameState.config.adaptiveTime.startRound})</span>
                  ) : (
                    <span> (wird ab Runde {gameState.config.adaptiveTime.startRound} reduziert)</span>
                  )}
                </div>
              )}
              <div className="mt-6 text-center">
                <div className="inline-block bg-gray-100 rounded-lg px-6 py-3">
                  <div className="text-lg font-bold text-gray-800">
                    Runde {currentRound} von {gameState.rounds.total}
                  </div>
                  <div className="text-sm text-gray-600">
                    {gameState.rounds.total - currentRound} Runden verbleibend
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Variables Panel */}
        <div className="card mb-6">
          <h3 className="text-xl font-bold mb-4 text-center">📊 Variablen</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(gameState.variables).map(([varName, value]) => (
              <div key={varName} className="text-center">
                <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                  {varName === 'global_1' ? 'Global 1' : varName}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={value || ''}
                    onChange={(e) => handleVariableChange(varName, parseInt(e.target.value) || null)}
                    className={`flex-1 p-2 border border-gray-300 rounded text-center font-mono text-lg ${
                      isRandomizingGlobal && varName === 'global_1' ? 'bg-yellow-100 border-yellow-400' : ''
                    }`}
                    placeholder="null"
                    disabled={isRandomizingGlobal && varName === 'global_1'}
                  />
                  {varName === 'global_1' && (
                    <button
                      onClick={randomizeGlobal1}
                      disabled={isRandomizingGlobal}
                      className={`px-3 py-2 rounded font-bold transition-all ${
                        isRandomizingGlobal 
                          ? 'bg-yellow-200 text-yellow-800 cursor-not-allowed animate-pulse' 
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }`}
                      title="Randomisiere global_1 (5-15)"
                    >
                      🎲
                    </button>
                  )}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Aktuell: {value !== null ? value : 'null'}
                  {varName === 'global_1' && isRandomizingGlobal && (
                    <div className="text-blue-600 font-bold">🎯 Wird ausgewürfelt...</div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <div className="text-sm text-blue-600">
              💡 Tipp: Variablen können auch durch Kartenbefehle verändert werden
            </div>
            <div className="text-sm text-green-600 mt-1">
              🎲 Global 1 kann mit dem Würfel-Button randomisiert werden (5-15)
            </div>
          </div>
        </div>

        {/* Collapsible Log Panel */}
        {showLog && (
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">📋 Spielprotokoll</h3>
              <button
                onClick={() => setShowLog(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ✕
              </button>
            </div>
            <LogPanel
              log={gameState.state.log}
              onClear={() => {
                evaluator.reset();
                updateGameLog();
              }}
            />
          </div>
        )}
      </div>

      {/* Teacher Controls Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-gray-200 p-4 shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-center space-x-4">
          <button
            onClick={() => setTimerRunning(!timerRunning)}
            className={`text-sm px-4 py-2 rounded font-medium transition-colors ${
              timerRunning
                ? 'bg-red-100 hover:bg-red-200 text-red-800'
                : 'bg-green-100 hover:bg-green-200 text-green-800'
            }`}
          >
            {timerRunning ? '⏸️ Timer pausieren' : '▶️ Timer starten'}
          </button>

          <button
            onClick={() => {
              setTimerKey(prev => prev + 1);
              setTimerRunning(false);
            }}
            className="text-sm bg-orange-100 hover:bg-orange-200 text-orange-800 px-4 py-2 rounded font-medium transition-colors"
          >
            🔄 Timer zurücksetzen
          </button>

          <button
            onClick={() => setShowLog(!showLog)}
            className={`text-sm px-4 py-2 rounded font-medium transition-colors ${
              showLog
                ? 'bg-blue-200 hover:bg-blue-300 text-blue-800'
                : 'bg-blue-100 hover:bg-blue-200 text-blue-800'
            }`}
          >
            📋 {showLog ? 'Protokoll ausblenden' : 'Protokoll anzeigen'}
          </button>

          <button
            onClick={() => {
              const colors = ['green', 'red', 'blue', 'yellow'];
              const randomColor = colors[Math.floor(Math.random() * colors.length)];
              handleForceColor(randomColor);
            }}
            className="text-sm bg-purple-100 hover:bg-purple-200 text-purple-800 px-4 py-2 rounded font-medium transition-colors"
          >
            🎲 Zufallsfarbe
          </button>

          <div className="text-sm text-gray-600 px-4 py-2 bg-gray-100 rounded">
            Letzte Farbe: {lastWheelResult ? (
              <span className={`font-bold ${
                lastWheelResult.color === 'green' ? 'text-green-600' :
                lastWheelResult.color === 'red' ? 'text-red-600' :
                lastWheelResult.color === 'blue' ? 'text-blue-600' :
                'text-yellow-600'
              }`}>
                {lastWheelResult.color === 'green' && 'Grün'}
                {lastWheelResult.color === 'red' && 'Rot'}
                {lastWheelResult.color === 'blue' && 'Blau'}
                {lastWheelResult.color === 'yellow' && 'Gelb'}
              </span>
            ) : 'Noch nicht gedreht'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizmasterInterface;
