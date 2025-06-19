// Define interfaces for better type safety (optional but good practice)
interface CalculatorState {
    displayValue: string;
    firstOperand: number | null;
    waitingForSecondOperand: boolean;
    operator: string | null;
}

// Get references to DOM elements with type assertions
const calculator = document.querySelector('.calculator') as HTMLDivElement;
const calculatorScreen = document.querySelector('.calculator-screen') as HTMLInputElement;
const keys = document.querySelector('.calculator-keys') as HTMLDivElement;

// Initialize the calculator's state
let calculatorState: CalculatorState = {
    displayValue: '0',
    firstOperand: null,
    waitingForSecondOperand: false,
    operator: null,
};

// Function to update the display
function updateDisplay(): void {
    calculatorScreen.value = calculatorState.displayValue;
}

// Function to handle digit input
function inputDigit(digit: string): void {
    const { displayValue, waitingForSecondOperand } = calculatorState;

    if (waitingForSecondOperand) {
        calculatorState.displayValue = digit;
        calculatorState.waitingForSecondOperand = false;
    } else {
        calculatorState.displayValue = displayValue === '0' ? digit : displayValue + digit;
    }
    updateDisplay();
}

// Function to handle decimal input
function inputDecimal(dot: string): void {
    if (calculatorState.waitingForSecondOperand === true) {
        calculatorState.displayValue = '0.';
        calculatorState.waitingForSecondOperand = false;
        updateDisplay();
        return;
    }

    // If the `displayValue` does not contain a decimal point
    if (!calculatorState.displayValue.includes(dot)) {
        calculatorState.displayValue += dot;
    }
    updateDisplay();
}

// Function to handle operator input
function handleOperator(nextOperator: string): void {
    const { firstOperand, displayValue, operator } = calculatorState;
    const inputValue = parseFloat(displayValue);

    if (operator && calculatorState.waitingForSecondOperand) {
        calculatorState.operator = nextOperator;
        return;
    }

    if (firstOperand === null && !isNaN(inputValue)) {
        calculatorState.firstOperand = inputValue;
    } else if (operator) {
        const result = performCalculation[operator](firstOperand as number, inputValue);
        calculatorState.displayValue = String(parseFloat(result.toFixed(7))); // Limit decimal places for display
        calculatorState.firstOperand = result;
    }

    calculatorState.waitingForSecondOperand = true;
    calculatorState.operator = nextOperator;
    updateDisplay();
}

// Object to store calculation functions
const performCalculation: { [key: string]: (a: number, b: number) => number } = {
    '/': (firstOperand, secondOperand) => firstOperand / secondOperand,
    '*': (firstOperand, secondOperand) => firstOperand * secondOperand,
    '+': (firstOperand, secondOperand) => firstOperand + secondOperand,
    '-': (firstOperand, secondOperand) => firstOperand - secondOperand,
    '=': (firstOperand, secondOperand) => secondOperand // For '=' button, just return the second operand
};

// Function to reset the calculator
function resetCalculator(): void {
    calculatorState = {
        displayValue: '0',
        firstOperand: null,
        waitingForSecondOperand: false,
        operator: null,
    };
    updateDisplay();
}

// Event listener for button clicks
keys.addEventListener('click', (event: Event) => {
    const target = event.target as HTMLButtonElement;

    if (!target.matches('button')) {
        return; // Exit if not a button
    }

    if (target.classList.contains('operator')) {
        handleOperator(target.value);
        return;
    }

    if (target.classList.contains('decimal')) {
        inputDecimal(target.value);
        return;
    }

    if (target.classList.contains('all-clear')) {
        resetCalculator();
        return;
    }

    inputDigit(target.value);
});

// Initial display update
updateDisplay();