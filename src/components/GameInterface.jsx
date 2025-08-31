import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import cardsConfig from '../config/cards.json';
import WheelAlgorithm from '../lib/wheelAlgorithm';
import GameParser from '../lib/parser';
import GameEvaluator from '../lib/evaluator';

// Components
import Wheel from './Wheel';
import Timer from './Timer';
import CardGrid from './CardGrid';
import StagingZone from './StagingZone';
import VariablesPanel from './VariablesPanel';
import LogPanel from './LogPanel';

const GameInterface = ({ gameConfig, onExit }) => {
  // Game State
  const [gameState, setGameState] = useState(null);
  const [wheelAlgorithm] = useState(() => new WheelAlgorithm());
  const [parser] = useState(() => new GameParser());
  const [evaluator] = useState(() => new GameEvaluator());
  
  // UI State
  const [isSpinning, setIsSpinning] = useState(false);
  const [lastWheelResult, setLastWheelResult] = useState(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [printEvent, setPrintEvent] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Initialize game state
  useEffect(() => {
    initializeGame();
  }, [gameConfig]);

  // Update parser level when game config changes
  useEffect(() => {
    if (gameConfig?.level) {
      parser.setLevel(gameConfig.level);
    }
  }, [gameConfig?.level, parser]);

  const initializeGame = () => {
    const cards = generateCards(gameConfig.level);
    const groups = generateGroups(gameConfig.groupCount);
    
    const newGameState = {
      gameId: uuidv4(),
      level: gameConfig.level,
      groups: groups,
      cards: {
        pool: cards,
        open: []
      },
      state: {
        lastSpins: [],
        turn: { groupId: groups[0]?.id, startedAt: new Date().toISOString() },
        log: []
      },
      config: {
        timerSeconds: gameConfig.timerSeconds || 30,
        targetScore: gameConfig.targetScore || 100,
        wheelProbabilities: cardsConfig.gameConfig.wheelProbabilities,
        sounds: { ...cardsConfig.gameConfig.sounds, enabled: soundEnabled }
      }
    };

    setGameState(newGameState);
    evaluator.reset();
  };

  const generateCards = (level) => {
    const cards = [];
    let cardId = 0;

    // Add cards for current level and all previous levels
    for (let l = 1; l <= level; l++) {
      const levelKey = `level${l}`;
      const levelCards = cardsConfig[levelKey]?.cards || [];
      
      levelCards.forEach(cardTemplate => {
        for (let i = 0; i < cardTemplate.count; i++) {
          cards.push({
            ...cardTemplate,
            id: `${cardTemplate.id}_${cardId++}`,
            faceUp: false
          });
        }
      });
    }

    return cards;
  };

  const generateGroups = (count) => {
    const groups = [];
    for (let i = 1; i <= count; i++) {
      groups.push({
        id: `g${i}`,
        name: `Gruppe ${i}`,
        staging: [],
        variables: { x: null, y: null, score: null },
        jokerUsed: false
      });
    }
    return groups;
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
      
      // Reveal cards of the selected color
      revealCardsByColor(result.color);
      
      // Start timer
      setTimerRunning(true);
      
      // Log the spin
      evaluator.logAction('system', `Rad gedreht`, `Farbe: ${result.color}`);
      updateGameLog();
    }, 3000); // 3 second spin animation
  };

  const handleForceColor = (color) => {
    if (isSpinning) return;
    
    const result = wheelAlgorithm.forceColor(color);
    setLastWheelResult(result);
    
    // Reveal cards of the selected color
    revealCardsByColor(color);
    
    // Start timer
    setTimerRunning(true);
    
    // Log the forced spin
    evaluator.logAction('teacher', `Farbe erzwungen`, `Farbe: ${color}`);
    updateGameLog();
  };

  const revealCardsByColor = (color) => {
    setGameState(prev => {
      const newOpenCards = [...prev.cards.open];
      
      // Find cards of the selected color that aren't already open
      prev.cards.pool.forEach(card => {
        if (card.color === color && !newOpenCards.includes(card.id)) {
          newOpenCards.push(card.id);
        }
      });
      
      return {
        ...prev,
        cards: {
          ...prev.cards,
          open: newOpenCards
        }
      };
    });
  };

  // Timer handling
  const handleTimerEnd = () => {
    setTimerRunning(false);
    evaluator.logAction('system', 'Timer abgelaufen', '30 Sekunden vorbei');
    updateGameLog();
  };

  // Card handling
  const handleCardClick = (card) => {
    if (!selectedGroup) {
      alert('Bitte wähle zuerst eine Gruppe aus');
      return;
    }

    if (!gameState.cards.open.includes(card.id)) {
      alert('Diese Karte ist noch nicht aufgedeckt');
      return;
    }

    addCardToStaging(selectedGroup, card);
  };

  const addCardToStaging = (groupId, card) => {
    setGameState(prev => {
      const groups = prev.groups.map(group => {
        if (group.id === groupId) {
          return {
            ...group,
            staging: [...group.staging, card]
          };
        }
        return group;
      });

      return { ...prev, groups };
    });
  };

  // Command execution
  const handleExecuteCommand = (groupId) => {
    const group = gameState.groups.find(g => g.id === groupId);
    if (!group || group.staging.length === 0) return;

    // Parse the command
    const parseResult = parser.parse(group.staging);
    
    if (!parseResult.valid) {
      alert(`Ungültiger Befehl: ${parseResult.error}`);
      return;
    }

    // Execute the command
    const executeResult = evaluator.executeCommand(parseResult, groupId);
    
    if (executeResult.success) {
      // Update global variables
      const newVariables = evaluator.getVariables();
      
      // Clear staging area
      setGameState(prev => {
        const groups = prev.groups.map(g => {
          if (g.id === groupId) {
            return {
              ...g,
              staging: [],
              variables: newVariables
            };
          }
          return { ...g, variables: newVariables };
        });

        return { ...prev, groups };
      });

      // Show print event if applicable
      if (executeResult.printValue) {
        setPrintEvent(executeResult.printValue);
        setTimeout(() => setPrintEvent(null), 3000);
      }

      updateGameLog();
    } else {
      alert(`Ausführungsfehler: ${executeResult.error}`);
    }
  };

  const handleClearStaging = (groupId) => {
    setGameState(prev => {
      const groups = prev.groups.map(group => {
        if (group.id === groupId) {
          return { ...group, staging: [] };
        }
        return group;
      });

      return { ...prev, groups };
    });
  };

  const validateCommand = (cards) => {
    if (cards.length === 0) return false;
    const parseResult = parser.parse(cards);
    return parseResult.valid;
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
  const handleRevealAll = () => {
    setGameState(prev => {
      const allCardIds = prev.cards.pool.map(card => card.id);
      return {
        ...prev,
        cards: {
          ...prev.cards,
          open: allCardIds
        }
      };
    });
  };

  const handleHideAll = () => {
    setGameState(prev => ({
      ...prev,
      cards: {
        ...prev.cards,
        open: []
      }
    }));
  };

  const handleVariableChange = (varName, value) => {
    evaluator.setVariables({ [varName]: value });
    const newVariables = evaluator.getVariables();
    
    setGameState(prev => ({
      ...prev,
      groups: prev.groups.map(group => ({
        ...group,
        variables: newVariables
      }))
    }));

    evaluator.logAction('teacher', `Variable manuell gesetzt`, `${varName} = ${value}`);
    updateGameLog();
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
    a.download = `game-state-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!gameState) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🎮</div>
          <div className="text-xl">Spiel wird initialisiert...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
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

      {/* Header */}
      <div className="bg-white shadow-md p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Quizmaster - {cardsConfig[`level${gameState.level}`]?.name}
            </h1>
            <div className="text-sm text-gray-600">
              Zielwert: {gameState.config.targetScore} | 
              Timer: {gameState.config.timerSeconds}s |
              Gruppen: {gameState.groups.length}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
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
              onClick={exportGameState}
              className="btn-secondary text-sm"
            >
              Exportieren
            </button>
            
            <button
              onClick={onExit}
              className="btn-danger text-sm"
            >
              Spiel beenden
            </button>
          </div>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Left Column - Wheel and Timer */}
          <div className="xl:col-span-1 space-y-6">
            <div className="card">
              <Wheel
                onSpin={handleSpin}
                onForceColor={handleForceColor}
                disabled={timerRunning}
                isSpinning={isSpinning}
                lastResult={lastWheelResult}
              />
            </div>
            
            <div className="card">
              <Timer
                duration={gameState.config.timerSeconds}
                isRunning={timerRunning}
                onTimeUp={handleTimerEnd}
                soundEnabled={soundEnabled}
              />
            </div>

            <VariablesPanel
              variables={gameState.groups[0]?.variables || { x: null, y: null, score: null }}
              targetScore={gameState.config.targetScore}
              onVariableChange={handleVariableChange}
            />
          </div>

          {/* Middle Column - Cards and Staging */}
          <div className="xl:col-span-2 space-y-6">
            <CardGrid
              cards={gameState.cards.pool}
              openCards={gameState.cards.open}
              onCardClick={handleCardClick}
              disabled={isSpinning || !lastWheelResult}
            />

            {/* Group Selection */}
            <div className="card">
              <h3 className="text-lg font-bold mb-4">Gruppenauswahl</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {gameState.groups.map(group => (
                  <button
                    key={group.id}
                    onClick={() => setSelectedGroup(group.id)}
                    className={`p-3 rounded font-medium transition-colors ${
                      selectedGroup === group.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                    }`}
                  >
                    {group.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Staging Zones */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {gameState.groups.map(group => (
                <StagingZone
                  key={group.id}
                  group={group}
                  cards={group.staging}
                  isValid={validateCommand(group.staging)}
                  onCardClick={() => {}} // Cards in staging don't need click handler
                  onExecute={handleExecuteCommand}
                  onClear={handleClearStaging}
                  disabled={isSpinning}
                />
              ))}
            </div>
          </div>

          {/* Right Column - Log */}
          <div className="xl:col-span-1">
            <LogPanel
              log={gameState.state.log}
              onClear={() => {
                evaluator.reset();
                updateGameLog();
              }}
            />
          </div>
        </div>
      </div>

      {/* Teacher Controls Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-center space-x-4">
          <button
            onClick={handleRevealAll}
            className="text-sm bg-green-100 hover:bg-green-200 text-green-800 px-3 py-2 rounded transition-colors"
          >
            Alle Karten aufdecken
          </button>
          
          <button
            onClick={handleHideAll}
            className="text-sm bg-red-100 hover:bg-red-200 text-red-800 px-3 py-2 rounded transition-colors"
          >
            Alle Karten verdecken
          </button>
          
          <button
            onClick={() => setTimerRunning(!timerRunning)}
            className={`text-sm px-3 py-2 rounded transition-colors ${
              timerRunning
                ? 'bg-red-100 hover:bg-red-200 text-red-800'
                : 'bg-green-100 hover:bg-green-200 text-green-800'
            }`}
          >
            {timerRunning ? 'Timer pausieren' : 'Timer starten'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameInterface;
