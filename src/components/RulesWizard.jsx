import React, { useState } from 'react';
import cardsConfig from '../config/cards.json';

const RulesWizard = ({ gameConfig, onComplete, onSkip }) => {
  const [currentPage, setCurrentPage] = useState(0);

  const pages = [
    {
      id: 'general',
      title: '📋 Allgemeine Spielregeln',
      icon: '🎯'
    },
    {
      id: 'green',
      title: '🟢 Grüne Karten - Zahlen',
      icon: '🔢'
    },
    {
      id: 'red',
      title: '🔴 Rote Karten - Zuweisungen & Variablen',
      icon: '📝'
    },
    {
      id: 'blue',
      title: '🔵 Blaue Karten - Operatoren',
      icon: '➕'
    },
    {
      id: 'yellow',
      title: '🟡 Gelbe Karten - Print-Funktion',
      icon: '🖨️'
    }
  ];
  const selectedLevelData = cardsConfig[`level${gameConfig.level}`];

  const goToPage = (pageIndex) => {
    setCurrentPage(pageIndex);
  };

  const nextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      onComplete();
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const GeneralRulesPage = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">🎯</div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Willkommen zum Quizmaster-Modus!
        </h2>
        <p className="text-lg text-gray-600">
          Level {gameConfig.level}: {selectedLevelData.name}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Spielziel */}
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center">
            🎯 Spielziel
          </h3>
          <p className="text-blue-700">
            Bringt den angezeigten Wert auf eurem Bildschirm möglichst nahe an den <strong>Zielwert {gameConfig.targetScore}</strong> heran. 
            Das Team, das am Ende dem Zielwert am nächsten kommt, gewinnt!
          </p>
        </div>

        {/* Spielinfo */}
        <div className="bg-green-50 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center">
            ⚙️ Spiel-Einstellungen
          </h3>
          <div className="text-green-700 space-y-2">
            <div><strong>Runden:</strong> {gameConfig.rounds}</div>
            <div><strong>Timer:</strong> {gameConfig.timerSeconds} Sekunden</div>
            <div><strong>Gruppen:</strong> {gameConfig.groupCount}</div>
          </div>
        </div>
      </div>

      {/* Rundenablauf */}
      <div className="bg-yellow-50 p-6 rounded-lg">
        <h3 className="text-xl font-bold text-yellow-800 mb-4">🔄 Rundenablauf</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-3xl mb-2">🎲</div>
            <div className="font-bold text-yellow-700">1. Rad drehen</div>
            <div className="text-sm text-yellow-600">Zufallsfarbe</div>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">👁️</div>
            <div className="font-bold text-yellow-700">2. Farbe sehen</div>
            <div className="text-sm text-yellow-600">Schüler*innen wählen Kartenfarbe</div>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">⏰</div>
            <div className="font-bold text-yellow-700">3. Timer läuft</div>
            <div className="text-sm text-yellow-600">{gameConfig.timerSeconds} Sekunden Zeit</div>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">🧩</div>
            <div className="font-bold text-yellow-700">4. Karten legen</div>
            <div className="text-sm text-yellow-600">Teams erstellen Befehle</div>
          </div>
        </div>
      </div>

      {/* Level-spezifische Regeln */}
      <div className="bg-purple-50 p-6 rounded-lg">
        <h3 className="text-xl font-bold text-purple-800 mb-4">📚 Level-spezifische Regeln</h3>
        <p className="text-purple-700 mb-3"><strong>{selectedLevelData.name}:</strong> {selectedLevelData.description}</p>
        <ul className="space-y-2">
          {selectedLevelData.rules.map((rule, index) => (
            <li key={index} className="flex items-start space-x-2 text-purple-700">
              <span className="font-bold text-purple-600">•</span>
              <span>{rule}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Wichtige Hinweise */}
      <div className="bg-red-50 p-6 rounded-lg">
        <h3 className="text-xl font-bold text-red-800 mb-4">⚠️ Wichtige Hinweise</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-red-700">
          <div>• Fehlerhafter Code: zufällige Strafkarte</div>
          <div>• Division durch Null ist nicht erlaubt</div>
          <div>• Karten werden offen in den Pool zurückgelegt</div>
        </div>
      </div>
    </div>
  );

  const ColorCardPage = ({ color, colorName, description, examples, tips }) => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">{color === 'green' ? '🟢' : color === 'red' ? '🔴' : color === 'blue' ? '🔵' : '🟡'}</div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {colorName} Karten
        </h2>
        <p className="text-lg text-gray-600">{description}</p>
      </div>

      {/* Kartenbeispiele */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-4">🃏 Kartenbeispiele</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {examples.map((example, index) => (
            <div 
              key={index}
              className={`p-3 rounded text-center font-bold text-white shadow-md ${
                color === 'green' ? 'bg-green-500' :
                color === 'red' ? 'bg-red-500' :
                color === 'blue' ? 'bg-blue-500' :
                'bg-yellow-500'
              }`}
            >
              {example}
            </div>
          ))}
        </div>
      </div>

      {/* Verwendung */}
      <div className="bg-blue-50 p-6 rounded-lg">
        <h3 className="text-xl font-bold text-blue-800 mb-4">💡 Wie werden sie verwendet?</h3>
        <div className="space-y-3 text-blue-700">
          {tips.map((tip, index) => (
            <div key={index} className="flex items-start space-x-2">
              <span className="font-bold text-blue-600">•</span>
              <span>{tip}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Level-spezifische Besonderheiten */}
      {gameConfig.level > 1 && (
        <div className="bg-yellow-50 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-yellow-800 mb-4">⭐ Besonderheiten in {selectedLevelData.name}</h3>
          <p className="text-yellow-700">
            {color === 'red' && gameConfig.level >= 2 && "Enthält If-Then-Else Strukturen für Verzweigungen"}
            {color === 'red' && gameConfig.level >= 2 && "Variablenreferenzen (x, y, score, global_1) für Berechnungen"}
            {color === 'red' && gameConfig.level >= 3 && " und While-Schleifen für Wiederholungen"}
            {color === 'red' && gameConfig.level >= 4 && " sowie For-Schleifen mit Zählvariablen"}
            {color === 'blue' && gameConfig.level >= 2 && "Vergleichsoperatoren (==, <, >) für If-Anweisungen"}
            {color === 'blue' && gameConfig.level >= 3 && " und logische Operatoren (and, or) für komplexe Bedingungen"}
            {color === 'yellow' && "Print-Funktion aktiviert sich automatisch bei Gelb am Glücksrad"}
            {color === 'green' && "Zahlen werden in allen Levels gleich verwendet"}
          </p>
        </div>
      )}
    </div>
  );

  const getCurrentPageContent = () => {
    const page = pages[currentPage];
    
    switch (page.id) {
      case 'general':
        return <GeneralRulesPage />;
      
      case 'green':
        return (
          <ColorCardPage
            color="green"
            colorName="Grüne"
            description="Zahlen von 1 bis 10 für Berechnungen und Zuweisungen"
            examples={['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']}
            tips={[
              'Können für einfache Zuweisungen verwendet werden: x = 5 oder score = 8',
              'Können in Berechnungen eingesetzt werden: score = x + 3',
            ]}
          />
        );
      
      case 'red':
        return (
          <ColorCardPage
            color="red"
            colorName="Rote"
            description="Zuweisungen, Variablenreferenzen"
            examples={gameConfig.level === 1 ? ['x =', 'global_1 =', 'x', 'score', 'global_1'] :
                     gameConfig.level === 2 ? ['x =', 'y =', 'score =', 'global_1 =', 'x', 'y', 'score', 'global_1', 'if', 'then', 'else'] :
                     gameConfig.level === 3 ? ['x =', 'y =', 'score =', 'global_1 =', 'x', 'y', 'score', 'global_1', 'if', 'then', 'else', 'while', 'do', 'end'] :
                     ['x =', 'y =', 'score =', 'global_1 =', 'x', 'y', 'score', 'global_1', 'if', 'then', 'for i = 1 to', 'do', 'end', 'i']}
            tips={gameConfig.level === 1 ? [
              'Zuweisungen setzen Variablenwerte: x = 5',
              'Variablen in Berechnungen verwenden: score = x + 5',
              'Globale Variable global_1 ist für sämtliche Gruppen die selbe. Sie wird an der Tafel angezeigt und verändert wie andere Variablen auch. Sie wird immer vor den Berechnungen der anderen Gruppen abgearbeitet.',
              'Zuweisungen müssen immer korrekt Zeile für Zeile abgearbeitet werden können. Dabei ist ein: score = ... oder ein global_1 = ... ungültig. '
            ] : gameConfig.level === 2 ? [
              'If-Then-Else für Verzweigungen: if x < 5 then y = 1 else y = 2',
              'Variablen in Bedingungen: if score > global_1 then',
              'Komplette If-Struktur muss vor Ausführung stehen'
            ] : gameConfig.level === 3 ? [
              'While-Schleifen für Wiederholungen: while x < 10 do x = x + 1 end',
              'Variablen in Schleifenbedingungen: while score < global_1 do',
              'Schleifen müssen mit "end" geschlossen werden'
            ] : [
              'For-Schleifen mit Zählvariablen: for i = 1 to 5 do score = score + i end',
              'Schleifenvariable "i" automatisch verfügbar',
              'Alle Variablen (x, y, score, global_1, i) nutzbar'
            ]}
          />
        );
      
      case 'blue':
        return (
          <ColorCardPage
            color="blue"
            colorName="Blaue"
            description="Operatoren für mathematische und logische Operationen"
            examples={gameConfig.level === 1 ? ['+', '-', '*', '/'] :
                     gameConfig.level === 2 ? ['+', '-', '*', '/', '==', '<', '>'] :
                     gameConfig.level >= 3 ? ['+', '-', '*', '/', '==', '<', '>', 'and', 'or'] :
                     ['+', '-', '*', '/', '==', '<', '>', 'and', 'or']}
            tips={gameConfig.level === 1 ? [
              'Mathematische Grundoperationen: +, -, *, /',
              'Ein Operator ersetzt ein beliebiges + oder -.',
              'Wichtig: wird ein Grundoperator gezogen muss das Programm sofort durchgeführt werden, auch wenn dabei Fehler entstehen.',
              'Sonderfall: der Zuweisungsoperator = kann zu der Variante +=, -=, *=, /= erweitert werden, z.B. score += 5. In disem Fall löst der Operator nicht sofort das Ausführen aus. Die nächste rote oder grüne Karte muss jedoch sofort in diese Zeile gelgt werden.',
              'Division durch Null führt zu Fehlern'
            ] : gameConfig.level === 2 ? [
              'Vergleichsoperatoren für If-Anweisungen: ==, <, >',
              'Mathematische Operationen weiterhin verfügbar',
              'Beispiel: if score == 100 then print("Gewonnen!")'
            ] : [
              'Logische Operatoren für komplexe Bedingungen: and, or',
              'Beispiel: if x > 5 and y < 10 then score = 50',
              'Alle vorherigen Operatoren weiterhin verfügbar'
            ]}
          />
        );
      
      case 'yellow':
        return (
          <ColorCardPage
            color="yellow"
            colorName="Gelbe"
            description="Print-Funktion für Ausgabe auf analogen Bildschirm"
            examples={['print(score)']}
            tips={[
              'Schüler*innen schreiben den aktuellen Wert der Variable score auf ihren Bildschirm-Bereich'
            ]}
          />
        );
      
      default:
        return <GeneralRulesPage />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                📚 Spielregeln durchgehen
              </h1>
              <p className="text-sm text-gray-600">
                Seite {currentPage + 1} von {pages.length} • {pages[currentPage].title}
              </p>
            </div>
            <button
              onClick={onSkip}
              className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded font-medium transition-colors"
            >
              ⏭️ Regeln überspringen
            </button>
          </div>
        </div>
      </div>

      {/* Page Navigation */}
      <div className="bg-white/50 backdrop-blur-sm border-b border-gray-200 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center space-x-2">
            {pages.map((page, index) => (
              <button
                key={page.id}
                onClick={() => goToPage(index)}
                className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                  index === currentPage
                    ? 'bg-blue-600 text-white'
                    : index < currentPage
                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span className="mr-2">{page.icon}</span>
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-8">
          {getCurrentPageContent()}
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-gray-200 p-4 shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <button
            onClick={prevPage}
            disabled={currentPage === 0}
            className={`px-6 py-2 rounded font-medium transition-colors ${
              currentPage === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
            }`}
          >
            ← Zurück
          </button>

          <div className="text-center">
            <div className="text-sm text-gray-600">
              Seite {currentPage + 1} von {pages.length}
            </div>
            <div className="text-xs text-gray-500">
              {pages[currentPage].title}
            </div>
          </div>

          <button
            onClick={nextPage}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-medium transition-colors"
          >
            {currentPage === pages.length - 1 ? '🎲 Spiel starten' : 'Weiter →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RulesWizard;
