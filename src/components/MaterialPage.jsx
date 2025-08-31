import React, { useState } from 'react';

const MaterialPage = ({ onBack }) => {
  const [materials, setMaterials] = useState([
    {
      id: 1,
      name: 'Spielregeln Level 1-4',
      type: 'PDF',
      description: 'Vollständige Spielregeln für alle Level',
      url: '/materials/rules.pdf',
      size: '1.2 MB'
    },
    {
      id: 2,
      name: 'Kartenset Vorlage',
      type: 'PDF',
      description: 'Druckvorlage für physische Karten',
      url: '/materials/cardset.pdf',
      size: '800 KB'
    },
    {
      id: 3,
      name: 'Lehrerhandbuch',
      type: 'PDF',
      description: 'Anleitung für Lehrkräfte mit Tipps und Tricks',
      url: '/materials/teacher-guide.pdf',
      size: '2.1 MB'
    }
  ]);

  const [uploadArea, setUploadArea] = useState({
    dragOver: false,
    uploading: false
  });

  const handleDragOver = (e) => {
    e.preventDefault();
    setUploadArea(prev => ({ ...prev, dragOver: true }));
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setUploadArea(prev => ({ ...prev, dragOver: false }));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setUploadArea(prev => ({ ...prev, dragOver: false }));
    
    const files = Array.from(e.dataTransfer.files);
    handleFileUpload(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    handleFileUpload(files);
  };

  const handleFileUpload = (files) => {
    // In a real implementation, this would upload to a server
    // For static hosting, we show instructions instead
    alert('Da dies eine statische Website ist, können Dateien nicht dauerhaft hochgeladen werden.\n\nOptionen:\n1. Lade Materialien in den GitHub Repository hoch\n2. Verwende einen Cloud-Speicher (Google Drive, etc.)\n3. Kontaktiere den Administrator für Backend-Integration');
  };

  const getFileIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'pdf': return '📄';
      case 'doc':
      case 'docx': return '📝';
      case 'png':
      case 'jpg':
      case 'jpeg': return '🖼️';
      case 'zip': return '📦';
      default: return '📎';
    }
  };

  const downloadMaterial = (material) => {
    // In a real implementation, this would trigger download
    alert(`Download würde starten: ${material.name}\n\nDa dies eine Demo ist, ist kein echter Download verfügbar.`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Materialien & Downloads</h1>
            <p className="text-gray-600 mt-2">
              Lade Spielmaterialien herunter oder verwalte eigene Dateien
            </p>
          </div>
          <button
            onClick={onBack}
            className="btn-secondary"
          >
            ← Zurück zum Spiel
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Available Materials */}
          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="text-xl font-bold mb-4">Verfügbare Materialien</h2>
              
              {materials.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <div className="text-4xl mb-2">📁</div>
                  <div>Noch keine Materialien verfügbar</div>
                </div>
              ) : (
                <div className="space-y-3">
                  {materials.map((material) => (
                    <div
                      key={material.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="text-3xl">
                          {getFileIcon(material.type)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {material.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {material.description}
                          </p>
                          <div className="flex items-center space-x-3 mt-1 text-xs text-gray-500">
                            <span className="bg-gray-100 px-2 py-1 rounded">
                              {material.type}
                            </span>
                            <span>{material.size}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => downloadMaterial(material)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
                        >
                          Download
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Upload Area */}
          <div>
            <div className="card">
              <h2 className="text-xl font-bold mb-4">Material hochladen</h2>
              
              {/* Drag & Drop Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  uploadArea.dragOver
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="text-4xl mb-4">📤</div>
                <div className="text-gray-600 mb-4">
                  Dateien hier hinziehen oder klicken zum Auswählen
                </div>
                
                <input
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.zip"
                />
                <label
                  htmlFor="file-upload"
                  className="btn-primary cursor-pointer inline-block"
                >
                  Dateien auswählen
                </label>
                
                <div className="text-xs text-gray-500 mt-3">
                  Unterstützte Formate: PDF, DOC, PNG, JPG, ZIP<br/>
                  Maximale Größe: 10 MB pro Datei
                </div>
              </div>

              {/* Static Hosting Notice */}
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <div className="text-yellow-600">⚠️</div>
                  <div>
                    <div className="font-medium text-yellow-800 mb-1">
                      Hinweis für statisches Hosting
                    </div>
                    <div className="text-sm text-yellow-700">
                      Da diese Website statisch gehostet wird, können Uploads nicht dauerhaft gespeichert werden. 
                      Für persistente Materialien:
                    </div>
                    <ul className="text-sm text-yellow-700 mt-2 ml-4 list-disc">
                      <li>Lade Dateien in das GitHub Repository hoch</li>
                      <li>Verwende Cloud-Speicher (Google Drive, Dropbox)</li>
                      <li>Kontaktiere Administrator für Backend-Integration</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="card mt-6">
              <h3 className="font-bold mb-3">Schnellzugriff</h3>
              <div className="space-y-2">
                <a
                  href="#"
                  className="block text-blue-600 hover:text-blue-800 text-sm transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Link zur Dokumentation (nicht implementiert in Demo)');
                  }}
                >
                  📚 Online-Dokumentation
                </a>
                <a
                  href="#"
                  className="block text-blue-600 hover:text-blue-800 text-sm transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Link zum Support (nicht implementiert in Demo)');
                  }}
                >
                  💬 Support & Hilfe
                </a>
                <a
                  href="#"
                  className="block text-blue-600 hover:text-blue-800 text-sm transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Link zu Community (nicht implementiert in Demo)');
                  }}
                >
                  👥 Community Forum
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialPage;
