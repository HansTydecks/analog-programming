// Game execution engine for evaluating parsed commands

export class GameEvaluator {
  constructor() {
    this.variables = { global_1: null };
    this.log = [];
    this.maxIterations = 50;
    this.minValue = -1000000000;
    this.maxValue = 1000000000;
  }

  reset() {
    this.variables = { global_1: null };
    this.log = [];
  }

  setVariables(vars) {
    this.variables = { ...this.variables, ...vars };
  }

  getVariables() {
    return { ...this.variables };
  }

  getLog() {
    return [...this.log];
  }

  logAction(groupId, action, result) {
    this.log.push({
      timestamp: new Date().toISOString(),
      groupId,
      action,
      result,
      variables: { ...this.variables }
    });
  }

  clampValue(value) {
    return Math.max(this.minValue, Math.min(this.maxValue, value));
  }

  checkVariableInitialized(varName) {
    if (this.variables[varName] === null || this.variables[varName] === undefined) {
      throw new Error(`Variable '${varName}' is not initialized`);
    }
    return this.variables[varName];
  }

  executeCommand(parsedCommand, groupId = 'system') {
    try {
      switch (parsedCommand.type) {
        case 'assignment':
          return this.executeAssignment(parsedCommand, groupId);
        case 'expression':
          return this.executeExpression(parsedCommand, groupId);
        case 'print':
          return this.executePrint(parsedCommand, groupId);
        case 'if':
          return this.executeIf(parsedCommand, groupId);
        case 'while':
          return this.executeWhile(parsedCommand, groupId);
        case 'for':
          return this.executeFor(parsedCommand, groupId);
        default:
          throw new Error(`Unknown command type: ${parsedCommand.type}`);
      }
    } catch (error) {
      this.logAction(groupId, parsedCommand.command, `Error: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  executeAssignment(command, groupId) {
    const value = this.clampValue(command.value);
    this.variables[command.variable] = value;
    
    const action = `${command.variable} = ${command.value}`;
    const result = `${command.variable} → ${value}`;
    this.logAction(groupId, action, result);
    
    return { 
      success: true, 
      result: `${command.variable} wurde auf ${value} gesetzt`,
      updatedVariables: { [command.variable]: value }
    };
  }

  executeExpression(command, groupId) {
    const leftValue = this.checkVariableInitialized(command.leftVar);
    const rightValue = command.rightValue;
    
    let result;
    switch (command.operator) {
      case '+':
        result = leftValue + rightValue;
        break;
      case '-':
        result = leftValue - rightValue;
        break;
      case '*':
        result = leftValue * rightValue;
        break;
      case '/':
        if (rightValue === 0) {
          throw new Error('Division by zero');
        }
        result = Math.trunc(leftValue / rightValue);
        break;
      default:
        throw new Error(`Unknown operator: ${command.operator}`);
    }
    
    result = this.clampValue(result);
    this.variables[command.variable] = result;
    
    const action = `${command.variable} = ${command.leftVar} ${command.operator} ${rightValue}`;
    const resultText = `${leftValue} ${command.operator} ${rightValue} = ${result}`;
    this.logAction(groupId, action, resultText);
    
    return { 
      success: true, 
      result: `${command.variable} = ${resultText}`,
      updatedVariables: { [command.variable]: result }
    };
  }

  executePrint(command, groupId) {
    const value = this.checkVariableInitialized(command.variable);
    
    const action = `print(${command.variable})`;
    const result = `${command.variable} = ${value}`;
    this.logAction(groupId, action, result);
    
    return { 
      success: true, 
      result: `${command.variable} = ${value}`,
      printValue: { variable: command.variable, value }
    };
  }

  executeIf(command, groupId) {
    const conditionResult = this.evaluateCondition(command.condition);
    
    let executedBranch;
    if (conditionResult) {
      executedBranch = this.executeCommand(command.thenBranch, groupId);
    } else if (command.elseBranch) {
      executedBranch = this.executeCommand(command.elseBranch, groupId);
    }
    
    const conditionText = `${command.condition.variable} ${command.condition.operator} ${command.condition.value}`;
    const action = `if ${conditionText} then ...`;
    const result = `Bedingung ${conditionResult ? 'erfüllt' : 'nicht erfüllt'}`;
    this.logAction(groupId, action, result);
    
    return { 
      success: true, 
      result: `If-Anweisung ausgeführt (${result})`,
      conditionResult,
      branchResult: executedBranch
    };
  }

  executeWhile(command, groupId) {
    let iterations = 0;
    const results = [];
    
    while (this.evaluateCondition(command.condition) && iterations < this.maxIterations) {
      const iterationResult = this.executeCommand(command.body, groupId);
      results.push(iterationResult);
      iterations++;
    }
    
    const conditionText = `${command.condition.variable} ${command.condition.operator} ${command.condition.value}`;
    const action = `while ${conditionText} do ...`;
    const result = `${iterations} Iterationen ausgeführt`;
    this.logAction(groupId, action, result);
    
    if (iterations >= this.maxIterations) {
      this.logAction(groupId, 'WARNING', `While-Schleife nach ${this.maxIterations} Iterationen abgebrochen`);
    }
    
    return { 
      success: true, 
      result: `While-Schleife: ${result}`,
      iterations,
      maxReached: iterations >= this.maxIterations,
      iterationResults: results
    };
  }

  executeFor(command, groupId) {
    const results = [];
    const originalI = this.variables.i;
    
    for (let i = 1; i <= command.count; i++) {
      this.variables.i = i;
      const iterationResult = this.executeCommand(command.body, groupId);
      results.push(iterationResult);
    }
    
    // Restore original i value
    this.variables.i = originalI;
    
    const action = `for i = 1 to ${command.count} do ...`;
    const result = `${command.count} Iterationen ausgeführt`;
    this.logAction(groupId, action, result);
    
    return { 
      success: true, 
      result: `For-Schleife: ${result}`,
      iterations: command.count,
      iterationResults: results
    };
  }

  evaluateCondition(condition) {
    const leftValue = this.checkVariableInitialized(condition.variable);
    const rightValue = condition.value;
    
    switch (condition.operator) {
      case '==':
        return leftValue === rightValue;
      case '<':
        return leftValue < rightValue;
      case '>':
        return leftValue > rightValue;
      case '<=':
        return leftValue <= rightValue;
      case '>=':
        return leftValue >= rightValue;
      case '!=':
        return leftValue !== rightValue;
      default:
        throw new Error(`Unknown comparison operator: ${condition.operator}`);
    }
  }

  exportState() {
    return {
      variables: { ...this.variables },
      log: [...this.log],
      timestamp: new Date().toISOString()
    };
  }

  importState(state) {
    this.variables = { ...state.variables };
    this.log = [...state.log];
  }
}

export default GameEvaluator;
