import React, { useState } from 'react';
import GameSetup from './components/GameSetup';
import RulesWizard from './components/RulesWizard';
import QuizmasterInterface from './components/QuizmasterInterface';
import MaterialPage from './components/MaterialPage';
import './index.css';

function App() {
  const [currentView, setCurrentView] = useState('setup'); // 'setup', 'rules', 'game', 'materials'
  const [gameConfig, setGameConfig] = useState(null);

  const handleStartGame = (config) => {
    setGameConfig(config);
    setCurrentView('rules'); // Show rules first
  };

  const handleRulesComplete = () => {
    setCurrentView('game');
  };

  const handleSkipRules = () => {
    setCurrentView('game');
  };

  const handleExitGame = () => {
    setGameConfig(null);
    setCurrentView('setup');
  };

  const handleShowRulesFromGame = () => {
    setCurrentView('rules');
  };

  const handleShowMaterials = () => {
    setCurrentView('materials');
  };

  const handleBackFromMaterials = () => {
    setCurrentView('setup');
  };

  return (
    <div className="App">
      {currentView === 'setup' && (
        <GameSetup
          onStartGame={handleStartGame}
          onShowMaterials={handleShowMaterials}
        />
      )}
      
      {currentView === 'rules' && gameConfig && (
        <RulesWizard
          gameConfig={gameConfig}
          onComplete={handleRulesComplete}
          onSkip={handleSkipRules}
        />
      )}
      
      {currentView === 'game' && gameConfig && (
        <QuizmasterInterface
          gameConfig={gameConfig}
          onExit={handleExitGame}
          onShowRules={handleShowRulesFromGame}
        />
      )}
      
      {currentView === 'materials' && (
        <MaterialPage
          onBack={handleBackFromMaterials}
        />
      )}
    </div>
  );
}

export default App;
