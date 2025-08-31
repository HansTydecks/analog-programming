import React, { useState } from 'react';
import cardsConfig from '../config/cards.json';

const GameSetup = ({ onStartGame, onShowMaterials }) => {
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [groupCount, setGroupCount] = useState(4);
  const [targetScore, setTargetScore] = useState(100);
  const [timerSeconds, setTimerSeconds] = useState(30);
  const [rounds, setRounds] = useState(10);
  const [showRules, setShowRules] = useState(false);
  
  // Adaptive Time Settings
  const [adaptiveTime, setAdaptiveTime] = useState(false);
  const [adaptiveStartRound, setAdaptiveStartRound] = useState(5);
  const [adaptiveReduction, setAdaptiveReduction] = useState(10);

  const levels = [
    { value: 1, ...cardsConfig.level1 },
    { value: 2, ...cardsConfig.level2 },
    { value: 3, ...cardsConfig.level3 },
    { value: 4, ...cardsConfig.level4 }
  ];

  const selectedLevelData = levels.find(l => l.value === selectedLevel);

  const handleStartGame = () => {
    const gameConfig = {
      level: selectedLevel,
      groupCount,
      targetScore,
      timerSeconds,
      rounds,
      adaptiveTime: {
        enabled: adaptiveTime,
        startRound: adaptiveStartRound,
        reductionPerRound: adaptiveReduction
      }
    };

    onStartGame(gameConfig);
  };

  const RulesModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl max-h-90vh overflow-y-auto m-4">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Spielregeln - {selectedLevelData.name}
            </h2>
            <button
              onClick={() => setShowRules(false)}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="prose max-w-none">
            <p className="text-gray-600 mb-4">{selectedLevelData.description}</p>
            
            <h3 className="text-lg font-semibold mb-3">Regeln für {selectedLevelData.name}:</h3>
            <ul className="space-y-2 mb-6">
              {selectedLevelData.rules.map((rule, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>

            <h3 className="text-lg font-semibold mb-3">Allgemeine Spielregeln:</h3>
            <div className="space-y-3 text-sm">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">🎯 Spielziel</h4>
                <p className="text-blue-700">
                  Bringt die Variable "score" möglichst nahe an den Zielwert heran. 
                  Das Team, das am Ende dem Zielwert am nächsten kommt, gewinnt!
                </p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">🎲 Spielablauf</h4>
                <ol className="text-green-700 space-y-1">
                  <li>1. Lehrkraft dreht das Glücksrad</li>
                  <li>2. Karten der gedrehten Farbe werden aufgedeckt</li>
                  <li>3. 30-Sekunden Timer startet</li>
                  <li>4. Teams wählen Karten und erstellen Befehle</li>
                  <li>5. Lehrkraft führt gültige Befehle aus</li>
                  <li>6. Wiederholen bis Spielende</li>
                </ol>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Wichtige Hinweise</h4>
                <ul className="text-yellow-700 space-y-1">
                  <li>• Uninitialisierte Variablen führen zu Fehlern</li>
                  <li>• Division durch Null ist nicht erlaubt</li>
                  <li>• Karten bleiben im Pool (werden nicht verbraucht)</li>
                  <li>• Befehle müssen vollständig und syntaktisch korrekt sein</li>
                </ul>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-2">🎨 Kartenfarbsystem</h4>
                <div className="grid grid-cols-2 gap-2 text-purple-700">
                  <div>🟢 <strong>Grün:</strong> Zahlen (1-10)</div>
                  <div>🔴 <strong>Rot:</strong> Zuweisungen & Kontrollstrukturen</div>
                  <div>🔵 <strong>Blau:</strong> Operatoren & Vergleiche</div>
                  <div>🟡 <strong>Gelb:</strong> Variablen & Ausgabe</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => setShowRules(false)}
              className="btn-primary px-8"
            >
              Verstanden, weiter zum Spiel!
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {showRules && <RulesModal />}
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            � Quizmaster Classroom Game
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Vereinfachte Steuerungsseite für das analoge Variablen-Memory Kartenspiel. 
            Enthält nur Rad, Timer, Spielprotokoll und Variablen-Management für die Lehrkraft.
          </p>
          <div className="mt-4 p-3 bg-blue-100 rounded-lg inline-block">
            <span className="text-blue-800 font-medium">
              📋 Hinweis: Die Schüler spielen mit physischen Karten im Raum
            </span>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Game Configuration */}
            <div className="lg:col-span-2">
              <div className="card">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">
                  Quizmaster-Modus konfigurieren
                </h2>

                {/* Level Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Schwierigkeitslevel auswählen
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {levels.map((level) => (
                      <div
                        key={level.value}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          selectedLevel === level.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedLevel(level.value)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-gray-900">
                              {level.name}
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              {level.description}
                            </div>
                          </div>
                          <div className={`w-4 h-4 rounded-full border-2 ${
                            selectedLevel === level.value
                              ? 'bg-blue-500 border-blue-500'
                              : 'border-gray-300'
                          }`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Selected Level Details */}
                <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-blue-900">
                      {selectedLevelData.name}
                    </h3>
                    <button
                      onClick={() => setShowRules(true)}
                      className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition-colors"
                    >
                      Regeln anzeigen
                    </button>
                  </div>
                  <p className="text-blue-800 text-sm mb-3">
                    {selectedLevelData.description}
                  </p>
                  <div className="text-xs text-blue-700">
                    <strong>Neue Konzepte:</strong> {selectedLevelData.rules.join(', ')}
                  </div>
                </div>

                {/* Game Settings */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Anzahl Gruppen (nur für Anzeige)
                    </label>
                    <select
                      value={groupCount}
                      onChange={(e) => setGroupCount(parseInt(e.target.value))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    >
                      {[2, 3, 4, 5, 6].map(count => (
                        <option key={count} value={count}>
                          {count} Gruppen
                        </option>
                      ))}
                    </select>
                    <div className="text-xs text-gray-500 mt-1">
                      Wird nur in der Anzeige verwendet, keine digitalen Gruppen-Bereiche
                    </div>
                  </div>                    
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Anzahl Runden
                    </label>
                    <select
                      value={rounds}
                      onChange={(e) => setRounds(parseInt(e.target.value))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    >
                      {[5, 8, 10, 12, 15, 20].map(count => (
                        <option key={count} value={count}>
                          {count} Runden
                        </option>
                      ))}
                    </select>
                    <div className="text-xs text-gray-500 mt-1">
                      Gesamtanzahl der Spielrunden
                    </div>
                  </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Timer (Sekunden)
                      </label>
                      <select
                        value={timerSeconds}
                        onChange={(e) => setTimerSeconds(parseInt(e.target.value))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      >
                        {[15, 20, 30, 45, 60].map(seconds => (
                          <option key={seconds} value={seconds}>
                            {seconds} Sekunden
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Zielwert für "score"
                      </label>
                      <input
                        type="number"
                        value={targetScore}
                        onChange={(e) => setTargetScore(parseInt(e.target.value) || 100)}
                        min="1"
                        max="1000"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                        placeholder="Zielwert eingeben"
                      />
                    </div>
                  </div>
                </div>

                {/* Adaptive Time Settings */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                    ⏱️ Adaptive Zeit-Einstellungen
                  </h4>
                  
                  <div className="mb-4">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={adaptiveTime}
                        onChange={(e) => setAdaptiveTime(e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Adaptive Zeit aktivieren
                      </span>
                    </label>
                    <p className="text-xs text-gray-600 mt-1 ml-7">
                      Zeit wird pro Runde verkürzt, um das Spiel zu beschleunigen
                    </p>
                  </div>

                  {adaptiveTime && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ab Runde
                        </label>
                        <select
                          value={adaptiveStartRound}
                          onChange={(e) => setAdaptiveStartRound(parseInt(e.target.value))}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                        >
                          {Array.from({length: rounds - 1}, (_, i) => i + 2).map(round => (
                            <option key={round} value={round}>
                              Runde {round}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Sekunden weniger pro Runde
                        </label>
                        <select
                          value={adaptiveReduction}
                          onChange={(e) => setAdaptiveReduction(parseInt(e.target.value))}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                        >
                          {[5, 10, 15, 20].map(seconds => (
                            <option key={seconds} value={seconds}>
                              {seconds} Sekunden
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  {adaptiveTime && (
                    <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
                      <strong>Beispiel:</strong> Start: {timerSeconds}s → Ab Runde {adaptiveStartRound}: 
                      {timerSeconds - adaptiveReduction}s → Runde {adaptiveStartRound + 1}: 
                      {Math.max(5, timerSeconds - adaptiveReduction * 2)}s → ...
                      <br />
                      <em>Minimale Zeit: 5 Sekunden</em>
                    </div>
                  )}
                </div>

                {/* Start Button */}
                <div className="mt-8">
                  <button
                    onClick={handleStartGame}
                    className="w-full btn-primary text-xl py-4"
                  >
                    🎲 Quizmaster starten
                  </button>
                  <div className="text-center text-sm text-gray-600 mt-2">
                    Startet die vereinfachte Steuerungsansicht für analoge Karten
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Info & Materials */}
            <div className="space-y-6">
              {/* Quick Start Guide */}
              <div className="card">
                <h3 className="font-bold text-lg mb-3 text-gray-900">
                  🎲 Quizmaster-Modus
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start space-x-2">
                    <span className="font-bold text-blue-600">1.</span>
                    <span>Level wählen und Quizmaster starten</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="font-bold text-blue-600">2.</span>
                    <span>Rad drehen → zeigt Schülern aktive Kartenfarbe</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="font-bold text-blue-600">3.</span>
                    <span>Schüler spielen mit physischen Karten</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="font-bold text-blue-600">4.</span>
                    <span>Befehle prüfen und Variablen manuell setzen</span>
                  </div>
                </div>
              </div>

              {/* Materials */}
              <div className="card">
                <h3 className="font-bold text-lg mb-3 text-gray-900">
                  📚 Materialien
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Lade zusätzliche Materialien wie Spielregeln, 
                  Kartenvorlagen und Lehrerhandbuch herunter.
                </p>
                <button
                  onClick={onShowMaterials}
                  className="w-full btn-secondary"
                >
                  Zu den Materialien
                </button>
              </div>

              {/* System Info */}
              <div className="card">
                <h3 className="font-bold text-lg mb-3 text-gray-900">
                  ⚙️ Was ist enthalten?
                </h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div>✅ Glücksrad mit Farbauswahl</div>
                  <div>✅ 30-Sekunden Timer</div>
                  <div>✅ Variablen-Anzeige und Management</div>
                  <div>✅ Spielprotokoll und Export</div>
                  <div>❌ Keine digitalen Karten/Gruppen</div>
                  <div>📋 Optimiert für analoge Karten</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameSetup;
