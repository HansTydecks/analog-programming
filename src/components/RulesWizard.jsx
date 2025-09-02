import React from 'react';
import cardsConfig from '../config/cards.json';

const RulesWizard = ({ gameConfig, onComplete, onSkip }) => {
  const selectedLevelData = cardsConfig[`level${gameConfig.level}`];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                📚 Spielregeln - {selectedLevelData.name}
              </h1>
              <p className="text-sm text-gray-600">
                Alle Regeln für das aktuelle Level auf einen Blick
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={onSkip}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Überspringen
              </button>
              <button
                onClick={onComplete}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Spiel starten
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Single Scrollable Page */}
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        
        {/* General Rules Section */}
        <section className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-2xl mr-4">
              🎯
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Allgemeine Spielregeln</h2>
              <p className="text-gray-600">Grundlegende Regeln für alle Levels</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-blue-800 mb-4">🔄 Rundenablauf</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <div className="font-bold text-blue-700">Rad drehen</div>
                    <div className="text-sm text-blue-600">Lehrkraft dreht das Glücksrad</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <div className="font-bold text-blue-700">Farbe sehen</div>
                    <div className="text-sm text-blue-600">Schüler sehen aktive Kartenfarbe</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <div className="font-bold text-blue-700">Timer läuft</div>
                    <div className="text-sm text-blue-600">{gameConfig.timerSeconds} Sekunden Zeit</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                  <div>
                    <div className="font-bold text-blue-700">Karten legen</div>
                    <div className="text-sm text-blue-600">Teams erstellen Befehle</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-green-800 mb-4">🎯 Spielziel</h3>
              <ul className="space-y-2 text-green-700">
                <li className="flex items-start space-x-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>Erreiche den Zielwert: <strong>{gameConfig.targetScore}</strong></span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>Nutze nur die erlaubte Kartenfarbe pro Runde</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>Arbeite im Team und plane strategisch</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>Spiele insgesamt {gameConfig.rounds} Runden</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="text-xl font-bold text-yellow-800 mb-4">⭐ Besonderheiten in {selectedLevelData.name}</h3>
            <p className="text-yellow-700">
              {selectedLevelData.description}
            </p>
            <div className="mt-3">
              <strong className="text-yellow-800">Spezielle Regeln:</strong>
              <ul className="mt-2 space-y-1">
                {selectedLevelData.rules.map((rule, index) => (
                  <li key={index} className="flex items-start space-x-2 text-yellow-700">
                    <span className="text-yellow-500 mt-1">•</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Card-Specific Rules Sections */}
        
        {/* Green Cards Section */}
        <section className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white text-2xl mr-4">
              🔢
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">🟢 Grüne Karten - Zahlen</h2>
              <p className="text-gray-600">Alle verfügbaren Zahlen für Berechnungen</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-bold text-green-800 mb-4">Verfügbare Zahlen</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].map(number => (
                  <div key={number} className="bg-green-500 text-white px-3 py-1 rounded font-mono text-lg">
                    {number}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-green-800 mb-4">Tipps</h3>
              <ul className="space-y-2 text-green-700">
                <li className="flex items-start space-x-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>Bilden die Grundlage für alle mathematischen Operationen</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>Können direkt in Zuweisungen verwendet werden</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>Mehrstellige Zahlen durch Kombination mehrerer Karten</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Red Cards Section */}
        <section className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center text-white text-2xl mr-4">
              📝
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">🔴 Rote Karten - Zuweisungen & Variablen</h2>
              <p className="text-gray-600">Zuweisungen, Variablenreferenzen und Kontrollstrukturen</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-bold text-red-800 mb-4">Verfügbare Karten</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {(() => {
                  let cards = [];
                  if (gameConfig.level === 1) {
                    cards = ['global_1 =', 'global_1'];
                  } else if (gameConfig.level === 2) {
                    cards = ['global_1 =', 'global_1', 'if', 'then', 'else'];
                  } else if (gameConfig.level === 3) {
                    cards = ['global_1 =', 'global_1', 'if', 'then', 'else', 'while', 'do', 'end'];
                  } else {
                    cards = ['global_1 =', 'global_1', 'if', 'then', 'for i = 1 to', 'do', 'end'];
                  }
                  return cards.map(card => (
                    <div key={card} className="bg-red-500 text-white px-3 py-1 rounded font-mono text-sm">
                      {card}
                    </div>
                  ));
                })()}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-red-800 mb-4">Tipps</h3>
              <ul className="space-y-2 text-red-700">
                {(() => {
                  let tips = [];
                  if (gameConfig.level === 1) {
                    tips = [
                      'Zuweisungen setzen Variablenwerte: global_1 = 5',
                      'Variablen in Berechnungen verwenden: global_1 + 3',
                      'Globale Variable global_1 für teamübergreifende Kommunikation'
                    ];
                  } else if (gameConfig.level === 2) {
                    tips = [
                      'If-Then-Else für Verzweigungen: if global_1 < 5 then',
                      'Variablen in Bedingungen: if global_1 > 10 then',
                      'Komplette If-Struktur muss vor Ausführung stehen'
                    ];
                  } else if (gameConfig.level === 3) {
                    tips = [
                      'While-Schleifen für Wiederholungen: while global_1 < 10 do',
                      'Variablen in Schleifenbedingungen verwenden',
                      'Schleifen müssen mit "end" geschlossen werden'
                    ];
                  } else {
                    tips = [
                      'For-Schleifen mit Zählvariablen: for i = 1 to 5 do',
                      'Schleifenvariable "i" automatisch verfügbar',
                      'Alle Variablen (global_1, i) nutzbar'
                    ];
                  }
                  return tips.map((tip, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>{tip}</span>
                    </li>
                  ));
                })()}
              </ul>
            </div>
          </div>
        </section>

        {/* Blue Cards Section */}
        <section className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-2xl mr-4">
              ➕
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">🔵 Blaue Karten - Operatoren</h2>
              <p className="text-gray-600">Mathematische und logische Operationen</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-bold text-blue-800 mb-4">Verfügbare Operatoren</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {(() => {
                  let ops = [];
                  if (gameConfig.level === 1) {
                    ops = ['+', '-', '*', '/'];
                  } else if (gameConfig.level === 2) {
                    ops = ['+', '-', '*', '/', '==', '<', '>'];
                  } else {
                    ops = ['+', '-', '*', '/', '==', '<', '>', 'and', 'or'];
                  }
                  return ops.map(op => (
                    <div key={op} className="bg-blue-500 text-white px-3 py-1 rounded font-mono text-lg">
                      {op}
                    </div>
                  ));
                })()}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-blue-800 mb-4">Tipps</h3>
              <ul className="space-y-2 text-blue-700">
                {(() => {
                  let tips = [];
                  if (gameConfig.level === 1) {
                    tips = [
                      'Mathematische Grundoperationen: +, -, *, /',
                      'Verwendung in Berechnungen: global_1 + 2',
                      'Division durch Null führt zu Fehlern'
                    ];
                  } else if (gameConfig.level === 2) {
                    tips = [
                      'Vergleichsoperatoren für If-Anweisungen: ==, <, >',
                      'Mathematische Operationen weiterhin verfügbar',
                      'Beispiel: if global_1 == 100 then'
                    ];
                  } else {
                    tips = [
                      'Logische Operatoren für komplexe Bedingungen: and, or',
                      'Beispiel: if global_1 > 5 and global_1 < 10 then',
                      'Alle vorherigen Operatoren weiterhin verfügbar'
                    ];
                  }
                  return tips.map((tip, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>{tip}</span>
                    </li>
                  ));
                })()}
              </ul>
            </div>
          </div>
        </section>

        {/* Yellow Cards Section */}
        <section className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center text-white text-2xl mr-4">
              🖨️
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">🟡 Gelbe Karten - Print-Funktion</h2>
              <p className="text-gray-600">Ausgabe auf analogen Bildschirm</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-bold text-yellow-800 mb-4">Verfügbare Karte</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                <div className="bg-yellow-500 text-white px-3 py-1 rounded font-mono text-sm">
                  print(score)
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-yellow-800 mb-4">Tipps</h3>
              <ul className="space-y-2 text-yellow-700">
                <li className="flex items-start space-x-2">
                  <span className="text-yellow-500 mt-1">•</span>
                  <span>Nur eine gelbe Karte: print(score)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-yellow-500 mt-1">•</span>
                  <span>Zeigt den aktuellen Score-Wert auf dem "analogen Bildschirm"</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-yellow-500 mt-1">•</span>
                  <span>Wird durch Gelb am Glücksrad aktiviert</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-yellow-500 mt-1">•</span>
                  <span>Schüler schreiben den Score-Wert auf ihren Bildschirm-Bereich</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-yellow-500 mt-1">•</span>
                  <span>Sehr wichtig für das Verfolgen des Spielfortschritts!</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Bottom Action Bar */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Bereit zum Spielen?</h3>
              <p className="text-gray-600">Alle Regeln für {selectedLevelData.name} durchgelesen</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={onSkip}
                className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors font-medium"
              >
                Regeln überspringen
              </button>
              <button
                onClick={onComplete}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
              >
                🎮 Spiel jetzt starten
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RulesWizard;