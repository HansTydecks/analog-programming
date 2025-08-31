# Quizmaster Classroom Game

Eine vereinfachte Web-Anwendung zur Steuerung des analogen Kartenspiel "Variablen-Memory" - optimiert für den Einsatz an digitalen Whiteboards im Klassenzimmer.

## 🎯 Überblick

Diese Anwendung dient als digitale Steuerungszentrale für Lehrkräfte beim analogen Kartenspiel. Sie bietet nur die essentiellen Elemente:

- **🎲 Twister-Glücksrad** mit semi-randomem Algorithmus
- **⏱️ Timer-System** (30 Sekunden pro Runde)
- **📊 Variablen-Tracking** (x, y, score) mit manueller Eingabe
- **📋 Spielprotokoll** mit Export-Funktion
- **🎨 Farbsystem-Referenz** für physische Karten

**Wichtig:** Die Schüler spielen mit **physischen Karten im Raum**. Diese App steuert nur das Rad, den Timer und verwaltet die Variablen.

## 🚀 Installation & Start

```bash
# Klonen des Repositories
git clone [repository-url]
cd analog-programming-game

# Dependencies installieren  
npm install

# Entwicklung starten
npm run dev

# Build für Produktion
npm run build
```

Die Anwendung ist dann unter `http://localhost:5173` verfügbar.

## 🎮 Quizmaster-Modus

### Grundbedienung
1. **Setup-Phase**: Level und Timer-Einstellungen wählen
2. **Spiel-Phase**: Rad drehen, Timer starten, Variablen verwalten
3. **Export**: Spielprotokoll als JSON-Datei herunterladen

### Farbsystem für physische Karten
- � **Rot**: Grundlagen (Level 1)
- � **Gelb**: If-Anweisungen (Level 2) 
- 🔵 **Blau**: Schleifen (Level 3)
- � **Grün**: Funktionen (Level 4)

### Timer-System
- **Standard**: 30 Sekunden pro Runde
- **Warnsignal**: Bei 10 Sekunden verbleibend
- **Ende-Signal**: Bei Zeitablauf
## 🎯 Variablen-Panel

### Manuelle Verwaltung
- **x, y, score**: Zentrale Spielvariablen
- **Direkte Eingabe**: Werte können manuell gesetzt werden
- **Echtzeit-Display**: Aktuelle Werte immer sichtbar
- **Export-Funktion**: Spielstand als JSON speichern

### Spielprotokoll
- **Automatische Aufzeichnung** aller Aktionen
- **Zeitstempel** für jeden Eintrag
- **Export als JSON** für spätere Auswertung
- **Übersichtliche Darstellung** der Spielhistorie

## 🌐 Deployment

Die Anwendung wird automatisch bei jedem Push auf den `main` Branch über GitHub Actions nach GitHub Pages deployed.

## 🎓 Didaktischer Einsatz

### Klassenraum-Setup
1. **Digitales Whiteboard**: Zeigt die Quizmaster-Oberfläche
2. **Physische Karten**: Schüler nutzen gedruckte Programmkarten
3. **Gruppen**: 2-6 Teams arbeiten parallel im Raum
4. **Lehrkraft**: Steuert Rad, Timer und Variablen über das Interface

### Lernziele
- **Programmierkonzepte** durch physische Manipulation verstehen
- **Algorithmisches Denken** durch Kartenreihenfolge entwickeln
- **Teamarbeit** bei der Lösungsfindung fördern
- **Zeitmanagement** durch Timer-Druck trainieren

## 📱 Browser-Kompatibilität

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile Browser (responsive Design)
   - Lehrkraft validiert und führt Befehle aus

3. **Lehrkraft-Kontrollen**:
   - Rad-Farbe erzwingen
   - Alle Karten auf-/zudecken
   - Timer pausieren/starten
   - Variablen manuell setzen
   - Spielzustand exportieren

---

## 🔧 Entwicklung

Diese Anwendung wurde als vereinfachte Quizmaster-Steuerung für den analogen Klasseneinsatz entwickelt.

**Technologie**: React 18, Vite, Tailwind CSS
**Deployment**: GitHub Pages mit automatischem CI/CD
**Browser**: Moderne Browser mit ES6+ Support

Entwickelt für den Bildungsbereich mit ❤️
