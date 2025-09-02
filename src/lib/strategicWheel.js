// Strategische Wheel-Manipulation für pädagogisch optimiertes Gameplay

class StrategicWheelController {
  constructor(totalRounds = 15) {
    this.totalRounds = totalRounds;
    this.currentRound = 0;
    this.printCount = 0;
    this.targetPrintCount = 3; // ~3 Print-Ereignisse bei 15 Runden
    this.spinsHistory = [];
    
    // Basis-Wahrscheinlichkeiten für pädagogische Optimierung
    this.strategicProbabilities = {
      green: 0.45,  // Höchste: Viele Zahlen für Punktesammlung
      red: 0.30,    // Mittlere: Operatoren für Rechnung
      blue: 0.15,   // Niedrigste: Seltene blaue Karten
      yellow: 0.10  // Print-Funktion (wird strategisch gesetzt)
    };
    
    // Mindest- und Maximalwahrscheinlichkeiten
    this.minProb = 0.05;
    this.maxProb = 0.60;
  }

  // Hauptfunktion: Strategisches Rad-Drehen
  spinStrategic() {
    this.currentRound++;
    
    // Letzte Runde: IMMER Print (100% Wahrscheinlichkeit)
    if (this.currentRound === this.totalRounds) {
      this.printCount++;
      this.spinsHistory.push('yellow');
      return {
        color: 'yellow',
        reason: 'Garantiertes Print in letzter Runde',
        round: this.currentRound,
        probabilities: { yellow: 1.0, green: 0, red: 0, blue: 0 }
      };
    }
    
    // Berechne angepasste Wahrscheinlichkeiten
    const probabilities = this.calculateStrategicProbabilities();
    
    // Würfeln basierend auf den angepassten Wahrscheinlichkeiten
    const result = this.weightedRandomSpin(probabilities);
    
    if (result.color === 'yellow') {
      this.printCount++;
    }
    
    this.spinsHistory.push(result.color);
    
    return {
      color: result.color,
      reason: result.reason,
      round: this.currentRound,
      probabilities: probabilities
    };
  }

  // Berechne strategische Wahrscheinlichkeiten basierend auf aktuellem Spielstand
  calculateStrategicProbabilities() {
    const remainingRounds = this.totalRounds - this.currentRound;
    const needMorePrint = this.printCount < 2; // Brauchen wir noch Print-Ereignisse?
    
    let probabilities = { ...this.strategicProbabilities };
    
    // Print-Strategie: Sorge für ~3 Print-Ereignisse
    if (needMorePrint && remainingRounds > 1) {
      // Erhöhe Print-Wahrscheinlichkeit, wenn zu wenig Print-Ereignisse
      const printDeficit = 2 - this.printCount;
      const printBoost = printDeficit * 0.15; // Boost pro fehlendes Print
      probabilities.yellow = Math.min(0.40, probabilities.yellow + printBoost);
    } else if (this.printCount >= 2 && remainingRounds > 1) {
      // Reduziere Print-Wahrscheinlichkeit, wenn genug Print-Ereignisse
      probabilities.yellow = Math.max(0.02, probabilities.yellow * 0.3);
    }
    
    // Anti-Wiederholungs-Mechanismus: Reduziere Wahrscheinlichkeit der letzten Farbe
    const lastColor = this.spinsHistory[this.spinsHistory.length - 1];
    if (lastColor && probabilities[lastColor] > 0.15) {
      const reduction = probabilities[lastColor] * 0.3;
      probabilities[lastColor] -= reduction;
      
      // Verteile die Reduktion auf andere Farben (außer Yellow)
      const otherColors = Object.keys(probabilities).filter(c => c !== lastColor && c !== 'yellow');
      const boost = reduction / otherColors.length;
      otherColors.forEach(color => {
        probabilities[color] += boost;
      });
    }
    
    // Adaptive Grün-Förderung für bessere Punktesammlung
    const recentGreens = this.spinsHistory.slice(-5).filter(c => c === 'green').length;
    if (recentGreens < 2) { // Zu wenig grüne Karten in letzten 5 Runden
      probabilities.green = Math.min(0.60, probabilities.green * 1.3);
      probabilities.blue = Math.max(0.05, probabilities.blue * 0.7);
    }
    
    // Normalisierung: Stelle sicher, dass alle Wahrscheinlichkeiten zusammen 1 ergeben
    const total = Object.values(probabilities).reduce((sum, p) => sum + p, 0);
    Object.keys(probabilities).forEach(color => {
      probabilities[color] = Math.max(this.minProb, 
                                    Math.min(this.maxProb, probabilities[color] / total));
    });
    
    // Erneute Normalisierung nach Min/Max-Anwendung
    const adjustedTotal = Object.values(probabilities).reduce((sum, p) => sum + p, 0);
    Object.keys(probabilities).forEach(color => {
      probabilities[color] = probabilities[color] / adjustedTotal;
    });
    
    return probabilities;
  }

  // Gewichtetes Zufalls-Drehen basierend auf Wahrscheinlichkeiten
  weightedRandomSpin(probabilities) {
    const random = Math.random();
    let cumulative = 0;
    
    for (const [color, probability] of Object.entries(probabilities)) {
      cumulative += probability;
      if (random <= cumulative) {
        return {
          color: color,
          reason: this.getSpinReason(color, probabilities[color])
        };
      }
    }
    
    // Fallback (sollte nie passieren)
    return { color: 'green', reason: 'Fallback' };
  }

  // Erkläre warum diese Farbe gewählt wurde
  getSpinReason(color, probability) {
    if (color === 'yellow') {
      if (this.printCount < 2) {
        return `Print gefördert (${this.printCount}/3 Print-Ereignisse)`;
      } else {
        return `Zufälliges Print`;
      }
    }
    
    if (color === 'green' && probability > 0.50) {
      return `Grün gefördert für bessere Punktesammlung`;
    }
    
    if (color === 'red' && probability > 0.35) {
      return `Rot gefördert für mehr Rechenoperationen`;
    }
    
    if (color === 'blue') {
      return `Seltene blaue Karte`;
    }
    
    return `Normale Wahrscheinlichkeit (${Math.round(probability * 100)}%)`;
  }

  // Erzwinge eine bestimmte Farbe (für manuelle Lehrkraft-Kontrolle)
  forceColor(color) {
    this.currentRound++;
    
    if (color === 'yellow') {
      this.printCount++;
    }
    
    this.spinsHistory.push(color);
    
    return {
      color: color,
      reason: 'Manuell von Lehrkraft erzwungen',
      round: this.currentRound,
      forced: true
    };
  }

  // Statistiken für Transparenz
  getGameStats() {
    const colorCounts = {
      green: this.spinsHistory.filter(c => c === 'green').length,
      red: this.spinsHistory.filter(c => c === 'red').length,
      blue: this.spinsHistory.filter(c => c === 'blue').length,
      yellow: this.spinsHistory.filter(c => c === 'yellow').length
    };
    
    return {
      currentRound: this.currentRound,
      totalRounds: this.totalRounds,
      printCount: this.printCount,
      targetPrintCount: this.targetPrintCount,
      spinsHistory: [...this.spinsHistory],
      colorCounts: colorCounts,
      remainingRounds: this.totalRounds - this.currentRound,
      printDeficit: Math.max(0, 2 - this.printCount) // Wie viele Prints fehlen noch?
    };
  }

  // Reset für neues Spiel
  reset(newTotalRounds = 15) {
    this.totalRounds = newTotalRounds;
    this.currentRound = 0;
    this.printCount = 0;
    this.targetPrintCount = Math.max(2, Math.floor(newTotalRounds / 5)); // ~1 Print pro 5 Runden
    this.spinsHistory = [];
  }

  // Debug-Informationen für Entwicklung
  getDebugInfo() {
    const stats = this.getGameStats();
    const nextProbs = this.currentRound < this.totalRounds ? 
      this.calculateStrategicProbabilities() : null;
    
    return {
      ...stats,
      nextProbabilities: nextProbs,
      strategicState: {
        needsMorePrint: this.printCount < 2,
        isLastRound: this.currentRound === this.totalRounds - 1,
        recentColors: this.spinsHistory.slice(-3)
      }
    };
  }
}

export default StrategicWheelController;
