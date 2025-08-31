// Semi-random wheel algorithm with adaptive probabilities

class WheelAlgorithm {
  constructor(colors = ['green', 'red', 'blue', 'yellow'], options = {}) {
    this.colors = colors;
    this.baseProbabilities = options.baseProbabilities || colors.reduce((acc, color) => {
      acc[color] = 1 / colors.length;
      return acc;
    }, {});
    this.alpha = options.alpha || 0.6;
    this.minProbability = options.minProbability || 0.12;
    this.maxProbability = options.maxProbability || 0.5;
    this.lastSpins = [];
    this.maxHistory = options.maxHistory || 10;
    this.seed = options.seed || null;
    this.rng = this.createRNG(this.seed);
  }

  // Simple seeded random number generator (LCG)
  createRNG(seed) {
    if (seed === null) {
      return Math.random;
    }
    let currentSeed = seed;
    return () => {
      currentSeed = (currentSeed * 1664525 + 1013904223) % Math.pow(2, 32);
      return currentSeed / Math.pow(2, 32);
    };
  }

  addSpin(color) {
    this.lastSpins.push(color);
    if (this.lastSpins.length > this.maxHistory) {
      this.lastSpins.shift();
    }
  }

  computeProbabilities() {
    if (this.lastSpins.length === 0) {
      return { ...this.baseProbabilities };
    }

    // Count frequencies in recent spins
    const counts = this.colors.reduce((acc, color) => {
      acc[color] = this.lastSpins.filter(spin => spin === color).length;
      return acc;
    }, {});

    const avgFrequency = this.lastSpins.length / this.colors.length;
    
    // Calculate adaptive weights
    const weights = {};
    for (const color of this.colors) {
      const frequency = counts[color] || 0;
      const adjustment = this.alpha * (avgFrequency - frequency);
      weights[color] = this.baseProbabilities[color] * (1 + adjustment);
    }

    // Apply constraints and normalize
    let totalWeight = 0;
    for (const color of this.colors) {
      weights[color] = Math.max(this.minProbability, 
                               Math.min(weights[color], this.maxProbability));
      totalWeight += weights[color];
    }

    // Normalize to probabilities
    const probabilities = {};
    for (const color of this.colors) {
      probabilities[color] = weights[color] / totalWeight;
    }

    return probabilities;
  }

  spin() {
    const probabilities = this.computeProbabilities();
    const random = this.rng();
    
    let cumulative = 0;
    for (const color of this.colors) {
      cumulative += probabilities[color];
      if (random <= cumulative) {
        this.addSpin(color);
        return {
          color,
          probabilities,
          random,
          history: [...this.lastSpins]
        };
      }
    }
    
    // Fallback (should never happen)
    const fallbackColor = this.colors[0];
    this.addSpin(fallbackColor);
    return {
      color: fallbackColor,
      probabilities,
      random,
      history: [...this.lastSpins]
    };
  }

  forceColor(color) {
    if (!this.colors.includes(color)) {
      throw new Error(`Invalid color: ${color}`);
    }
    this.addSpin(color);
    return {
      color,
      forced: true,
      history: [...this.lastSpins]
    };
  }

  reset() {
    this.lastSpins = [];
  }

  getStats() {
    const counts = this.colors.reduce((acc, color) => {
      acc[color] = this.lastSpins.filter(spin => spin === color).length;
      return acc;
    }, {});

    return {
      totalSpins: this.lastSpins.length,
      counts,
      history: [...this.lastSpins],
      currentProbabilities: this.computeProbabilities()
    };
  }

  updateBaseProbabilities(newProbabilities) {
    this.baseProbabilities = { ...newProbabilities };
  }
}

export default WheelAlgorithm;
