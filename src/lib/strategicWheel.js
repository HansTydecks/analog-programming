// Strategische Wheel-Manipulation für pädagogisch optimiertes Gameplay

class StrategicWheelController {
  constructor(totalRounds = 15) {
    this.totalRounds = totalRounds;
    this.currentRound = 0;
    this.printCount = 0;
    this.targetPrintCount = Math.min(3, Math.max(2, Math.floor(totalRounds / 6))); // 2-3 Print events based on round count
    this.spinsHistory = [];
    
    // Basis-Wahrscheinlichkeiten für pädagogische Optimierung
    this.strategicProbabilities = {
      green: 0.40,  // Equal with red: Zahlen für Punktesammlung
      red: 0.40,    // Equal with green: Operatoren für Rechnung
      blue: 0.15,   // Less often: Seltene blaue Karten
      yellow: 0.05  // 2-3 times total: Print-Funktion
    };
    
    // Mindest- und Maximalwahrscheinlichkeiten
    this.minProb = 0.05;
    this.maxProb = 0.65;
  }

  // Hauptfunktion: Strategisches Rad-Drehen
  spinStrategic() {
    this.currentRound++;
    
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
    const lastColor = this.spinsHistory[this.spinsHistory.length - 1];
    
    let probabilities = { ...this.strategicProbabilities };
    
    // REGEL 1: Yellow sollte nur 2-3 mal insgesamt erscheinen
    if (this.printCount >= this.targetPrintCount && remainingRounds > 1) {
      // Bereits genug Yellow-Ereignisse - drastisch reduzieren
      probabilities.yellow = 0.02;
    } else if (remainingRounds <= 2 && this.printCount < 2) {
      // Letzte Chancen für Yellow - erhöhen
      probabilities.yellow = Math.min(0.35, probabilities.yellow * 3);
    }
    
    // REGEL 2: Yellow niemals zweimal hintereinander
    if (lastColor === 'yellow') {
      probabilities.yellow = 0; // Komplett ausschließen
    }
    
    // REGEL 3: Blue niemals zweimal hintereinander
    if (lastColor === 'blue') {
      probabilities.blue = 0; // Komplett ausschließen
    }
    
    // REGEL 4: Green und Red etwa gleich häufig
    const recentSpins = this.spinsHistory.slice(-6); // Letzte 6 Spins betrachten
    const greenCount = recentSpins.filter(c => c === 'green').length;
    const redCount = recentSpins.filter(c => c === 'red').length;
    
    if (greenCount > redCount + 2) {
      // Zu viel Grün - Red fördern
      probabilities.red = Math.min(0.65, probabilities.red * 1.4);
      probabilities.green = Math.max(0.15, probabilities.green * 0.7);
    } else if (redCount > greenCount + 2) {
      // Zu viel Rot - Green fördern
      probabilities.green = Math.min(0.65, probabilities.green * 1.4);
      probabilities.red = Math.max(0.15, probabilities.red * 0.7);
    }
    
    // REGEL 5: Vermeide zu viele Wiederholungen der letzten Farbe
    if (lastColor && lastColor !== 'yellow' && lastColor !== 'blue') {
      probabilities[lastColor] = Math.max(0.15, probabilities[lastColor] * 0.6);
      
      // Verteile die Reduktion auf andere verfügbare Farben
      const otherColors = Object.keys(probabilities).filter(c => 
        c !== lastColor && probabilities[c] > 0
      );
      const boost = (probabilities[lastColor] * 0.4) / otherColors.length;
      otherColors.forEach(color => {
        probabilities[color] += boost;
      });
    }
    
    // Normalisierung: Stelle sicher, dass alle Wahrscheinlichkeiten zusammen 1 ergeben
    const total = Object.values(probabilities).reduce((sum, p) => sum + p, 0);
    if (total > 0) {
      Object.keys(probabilities).forEach(color => {
        probabilities[color] = Math.max(this.minProb, 
                                      Math.min(this.maxProb, probabilities[color] / total));
      });
      
      // Erneute Normalisierung nach Min/Max-Anwendung
      const adjustedTotal = Object.values(probabilities).reduce((sum, p) => sum + p, 0);
      Object.keys(probabilities).forEach(color => {
        probabilities[color] = probabilities[color] / adjustedTotal;
      });
    }
    
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
    const lastColor = this.spinsHistory[this.spinsHistory.length - 1];
    
    if (color === 'yellow') {
      if (this.printCount <= this.targetPrintCount) {
        return `Print-Ereignis (${this.printCount}/${this.targetPrintCount} erreicht)`;
      } else {
        return `Seltenes Print-Ereignis`;
      }
    }
    
    if (lastColor === color && color !== 'yellow' && color !== 'blue') {
      return `Wiederholung trotz Reduktion (${Math.round(probability * 100)}%)`;
    }
    
    if ((color === 'green' || color === 'red') && probability > 0.50) {
      return `${color === 'green' ? 'Grün' : 'Rot'} gefördert für Balance`;
    }
    
    if (color === 'blue') {
      return `Seltene blaue Karte (${Math.round(probability * 100)}%)`;
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
      printDeficit: Math.max(0, this.targetPrintCount - this.printCount) // Wie viele Prints fehlen noch?
    };
  }

  // Reset für neues Spiel
  reset(newTotalRounds = 15) {
    this.totalRounds = newTotalRounds;
    this.currentRound = 0;
    this.printCount = 0;
    this.targetPrintCount = Math.min(3, Math.max(2, Math.floor(newTotalRounds / 6))); // 2-3 Print events based on round count
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
        needsMorePrint: this.printCount < this.targetPrintCount,
        isLastRound: this.currentRound === this.totalRounds,
        recentColors: this.spinsHistory.slice(-3),
        yellowDeficit: Math.max(0, this.targetPrintCount - this.printCount)
      }
    };
  }
}

export default StrategicWheelController;
