import React, { useState, useEffect } from 'react';

const LogPanel = ({ log = [], onClear, maxEntries = 50 }) => {
  const [filter, setFilter] = useState('all');
  const [expandedEntries, setExpandedEntries] = useState(new Set());
  const [autoScroll, setAutoScroll] = useState(true);

  // Auto-scroll to bottom when new entries are added
  useEffect(() => {
    if (autoScroll) {
      const logContainer = document.getElementById('log-container');
      if (logContainer) {
        logContainer.scrollTop = logContainer.scrollHeight;
      }
    }
  }, [log, autoScroll]);

  const filteredLog = log.filter(entry => {
    if (filter === 'all') return true;
    if (filter === 'errors') return entry.result.includes('Error');
    if (filter === 'success') return !entry.result.includes('Error');
    if (filter === 'assignments') return entry.action.includes('=');
    if (filter === 'prints') return entry.action.includes('print');
    return true;
  }).slice(-maxEntries); // Keep only the last N entries

  const toggleExpanded = (index) => {
    const newExpanded = new Set(expandedEntries);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedEntries(newExpanded);
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('de-DE', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  const getEntryIcon = (entry) => {
    if (entry.result.includes('Error')) return '❌';
    if (entry.action.includes('print')) return '🖨️';
    if (entry.action.includes('=')) return '📝';
    if (entry.action.includes('if')) return '🔀';
    if (entry.action.includes('while')) return '🔄';
    if (entry.action.includes('for')) return '🔢';
    return '✅';
  };

  const getEntryClass = (entry) => {
    if (entry.result.includes('Error')) {
      return 'border-l-red-500 bg-red-50 text-red-900';
    }
    if (entry.action.includes('print')) {
      return 'border-l-blue-500 bg-blue-50 text-blue-900';
    }
    return 'border-l-green-500 bg-green-50 text-green-900';
  };

  const exportLog = () => {
    const logText = log.map(entry => 
      `${formatTimestamp(entry.timestamp)} [${entry.groupId}] ${entry.action} → ${entry.result}`
    ).join('\n');
    
    const blob = new Blob([logText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `game-log-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800">Spielprotokoll</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">
            {log.length} Einträge
          </span>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center gap-2 mb-4 p-3 bg-gray-50 rounded">
        <label className="text-sm font-medium text-gray-700">Filter:</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="text-sm border border-gray-300 rounded px-2 py-1 focus:border-blue-500 focus:outline-none"
        >
          <option value="all">Alle anzeigen</option>
          <option value="success">Nur Erfolg</option>
          <option value="errors">Nur Fehler</option>
          <option value="assignments">Zuweisungen</option>
          <option value="prints">Print-Befehle</option>
        </select>
        
        <label className="flex items-center space-x-1 text-sm">
          <input
            type="checkbox"
            checked={autoScroll}
            onChange={(e) => setAutoScroll(e.target.checked)}
            className="rounded"
          />
          <span>Auto-Scroll</span>
        </label>
      </div>

      {/* Log Entries */}
      <div 
        id="log-container"
        className="flex-1 overflow-y-auto space-y-2 max-h-96 pr-2"
      >
        {filteredLog.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <div className="text-4xl mb-2">📝</div>
            <div>Noch keine Einträge im Protokoll</div>
          </div>
        ) : (
          filteredLog.map((entry, index) => (
            <div
              key={`${entry.timestamp}-${index}`}
              className={`border-l-4 p-3 rounded-r-lg transition-all duration-200 ${getEntryClass(entry)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2 flex-1">
                  <span className="text-lg">{getEntryIcon(entry)}</span>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="font-medium">{formatTimestamp(entry.timestamp)}</span>
                      <span className="px-2 py-1 bg-white bg-opacity-70 rounded text-xs font-medium">
                        {entry.groupId}
                      </span>
                    </div>
                    
                    <div className="mt-1">
                      <div className="font-mono text-sm font-medium">
                        {entry.action}
                      </div>
                      <div className="text-sm mt-1">
                        → {entry.result}
                      </div>
                    </div>
                  </div>
                </div>
                
                {entry.variables && (
                  <button
                    onClick={() => toggleExpanded(index)}
                    className="text-xs bg-white bg-opacity-70 hover:bg-opacity-100 px-2 py-1 rounded transition-colors"
                  >
                    {expandedEntries.has(index) ? '▼' : '▶'}
                  </button>
                )}
              </div>

              {/* Expanded Variables View */}
              {expandedEntries.has(index) && entry.variables && (
                <div className="mt-3 p-2 bg-white bg-opacity-50 rounded text-xs">
                  <div className="font-medium mb-1">Variablen nach Ausführung:</div>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.entries(entry.variables).map(([varName, value]) => (
                      <div key={varName} className="text-center">
                        <div className="font-medium">{varName}</div>
                        <div className="font-mono">{value ?? 'null'}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Controls */}
      <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          {filteredLog.length !== log.length && (
            <span>Gefiltert: {filteredLog.length} von {log.length}</span>
          )}
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={exportLog}
            disabled={log.length === 0}
            className="text-sm bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1 rounded transition-colors disabled:opacity-50"
          >
            Exportieren
          </button>
          
          <button
            onClick={onClear}
            disabled={log.length === 0}
            className="text-sm bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded transition-colors disabled:opacity-50"
          >
            Löschen
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogPanel;
