// Parser for validating and parsing card sequences based on level grammar

export class GameParser {
  constructor(level = 1) {
    this.level = level;
  }

  setLevel(level) {
    this.level = level;
  }

  // Parse a sequence of cards into a command structure
  parse(cards) {
    if (!cards || cards.length === 0) {
      return { valid: false, error: 'Empty command' };
    }

    try {
      switch (this.level) {
        case 1:
          return this.parseLevel1(cards);
        case 2:
          return this.parseLevel2(cards);
        case 3:
          return this.parseLevel3(cards);
        case 4:
          return this.parseLevel4(cards);
        default:
          return { valid: false, error: 'Invalid level' };
      }
    } catch (error) {
      return { valid: false, error: error.message };
    }
  }

  // Level 1: Simple assignments and expressions
  parseLevel1(cards) {
    // Check for print statement
    if (cards.length === 1 && cards[0].type === 'print') {
      return {
        valid: true,
        type: 'print',
        variable: this.extractVariableFromPrint(cards[0].value),
        command: cards[0].value
      };
    }

    // Check for assignment: VARREF = NUMBER or VARREF = VARREF OP NUMBER
    if (cards.length >= 3) {
      const [assign, equals, ...rest] = cards;
      
      if (assign.type !== 'assign') {
        return { valid: false, error: 'Command must start with assignment' };
      }

      if (equals.value !== '=') {
        return { valid: false, error: 'Expected = after variable' };
      }

      // Simple assignment: x = 5
      if (rest.length === 1 && rest[0].type === 'number') {
        return {
          valid: true,
          type: 'assignment',
          variable: assign.value.replace(' =', ''),
          value: parseInt(rest[0].value),
          command: this.cardsToString(cards)
        };
      }

      // Expression assignment: x = y + 3
      if (rest.length === 3) {
        const [left, operator, right] = rest;
        
        if (left.type !== 'varref' || operator.type !== 'operator' || right.type !== 'number') {
          return { valid: false, error: 'Invalid expression format' };
        }

        return {
          valid: true,
          type: 'expression',
          variable: assign.value.replace(' =', ''),
          leftVar: left.value,
          operator: operator.value,
          rightValue: parseInt(right.value),
          command: this.cardsToString(cards)
        };
      }
    }

    return { valid: false, error: 'Invalid command structure for Level 1' };
  }

  // Level 2: If-then-else statements
  parseLevel2(cards) {
    // First try Level 1 commands
    const level1Result = this.parseLevel1(cards);
    if (level1Result.valid) {
      return level1Result;
    }

    // Check for if-then(-else) structure
    if (cards[0]?.value === 'if') {
      return this.parseIfStatement(cards);
    }

    return { valid: false, error: 'Invalid command structure for Level 2' };
  }

  // Level 3: While loops and logical operators
  parseLevel3(cards) {
    // First try Level 2 commands
    const level2Result = this.parseLevel2(cards);
    if (level2Result.valid) {
      return level2Result;
    }

    // Check for while loop
    if (cards[0]?.value === 'while') {
      return this.parseWhileLoop(cards);
    }

    return { valid: false, error: 'Invalid command structure for Level 3' };
  }

  // Level 4: For loops
  parseLevel4(cards) {
    // First try Level 3 commands
    const level3Result = this.parseLevel3(cards);
    if (level3Result.valid) {
      return level3Result;
    }

    // Check for for loop
    if (cards[0]?.value?.startsWith('for i')) {
      return this.parseForLoop(cards);
    }

    return { valid: false, error: 'Invalid command structure for Level 4' };
  }

  parseIfStatement(cards) {
    // Find 'then' keyword
    const thenIndex = cards.findIndex(card => card.value === 'then');
    if (thenIndex === -1) {
      return { valid: false, error: 'Missing "then" in if statement' };
    }

    // Find 'else' keyword (optional)
    const elseIndex = cards.findIndex(card => card.value === 'else');

    // Parse condition: if VARREF COMPARE NUMBER
    const conditionCards = cards.slice(1, thenIndex);
    if (conditionCards.length !== 3) {
      return { valid: false, error: 'Invalid condition format' };
    }

    const [varRef, compare, number] = conditionCards;
    if (varRef.type !== 'varref' || compare.type !== 'compare' || number.type !== 'number') {
      return { valid: false, error: 'Invalid condition components' };
    }

    // Parse then branch
    const thenStart = thenIndex + 1;
    const thenEnd = elseIndex !== -1 ? elseIndex : cards.length;
    const thenCards = cards.slice(thenStart, thenEnd);
    
    const thenResult = this.parseLevel1(thenCards);
    if (!thenResult.valid) {
      return { valid: false, error: 'Invalid then branch: ' + thenResult.error };
    }

    let elseResult = null;
    if (elseIndex !== -1) {
      const elseCards = cards.slice(elseIndex + 1);
      elseResult = this.parseLevel1(elseCards);
      if (!elseResult.valid) {
        return { valid: false, error: 'Invalid else branch: ' + elseResult.error };
      }
    }

    return {
      valid: true,
      type: 'if',
      condition: {
        variable: varRef.value,
        operator: compare.value,
        value: parseInt(number.value)
      },
      thenBranch: thenResult,
      elseBranch: elseResult,
      command: this.cardsToString(cards)
    };
  }

  parseWhileLoop(cards) {
    // Find 'do' and 'end' keywords
    const doIndex = cards.findIndex(card => card.value === 'do');
    const endIndex = cards.findIndex(card => card.value === 'end');

    if (doIndex === -1) {
      return { valid: false, error: 'Missing "do" in while loop' };
    }
    if (endIndex === -1) {
      return { valid: false, error: 'Missing "end" in while loop' };
    }

    // Parse condition: while VARREF COMPARE NUMBER
    const conditionCards = cards.slice(1, doIndex);
    if (conditionCards.length !== 3) {
      return { valid: false, error: 'Invalid while condition format' };
    }

    const [varRef, compare, number] = conditionCards;
    if (varRef.type !== 'varref' || compare.type !== 'compare' || number.type !== 'number') {
      return { valid: false, error: 'Invalid while condition components' };
    }

    // Parse body
    const bodyCards = cards.slice(doIndex + 1, endIndex);
    const bodyResult = this.parseLevel1(bodyCards);
    if (!bodyResult.valid) {
      return { valid: false, error: 'Invalid while body: ' + bodyResult.error };
    }

    return {
      valid: true,
      type: 'while',
      condition: {
        variable: varRef.value,
        operator: compare.value,
        value: parseInt(number.value)
      },
      body: bodyResult,
      command: this.cardsToString(cards)
    };
  }

  parseForLoop(cards) {
    // Find 'do' and 'end' keywords
    const doIndex = cards.findIndex(card => card.value === 'do');
    const endIndex = cards.findIndex(card => card.value === 'end');

    if (doIndex === -1) {
      return { valid: false, error: 'Missing "do" in for loop' };
    }
    if (endIndex === -1) {
      return { valid: false, error: 'Missing "end" in for loop' };
    }

    // Parse for header and get the count
    const forCard = cards[0];
    const countMatch = forCard.value.match(/for i = 1 to (\d+)/);
    if (!countMatch) {
      return { valid: false, error: 'Invalid for loop format' };
    }

    const count = parseInt(countMatch[1]);

    // Parse body
    const bodyCards = cards.slice(doIndex + 1, endIndex);
    const bodyResult = this.parseLevel1(bodyCards);
    if (!bodyResult.valid) {
      return { valid: false, error: 'Invalid for body: ' + bodyResult.error };
    }

    return {
      valid: true,
      type: 'for',
      count: count,
      body: bodyResult,
      command: this.cardsToString(cards)
    };
  }

  extractVariableFromPrint(printValue) {
    const match = printValue.match(/print\((\w+)\)/);
    return match ? match[1] : 'score';
  }

  cardsToString(cards) {
    return cards.map(card => card.value).join(' ');
  }
}

export default GameParser;
