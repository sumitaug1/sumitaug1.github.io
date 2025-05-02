// Global variables
let currentInput = '';
let calculationHistory = [];

// Get display elements
const currentDisplay = document.getElementById('current');
const historyDisplay = document.getElementById('history');

// Handle keyboard input
document.addEventListener('keydown', function(event) {
    if (event.key >= '0' && event.key <= '9' || 
        event.key === '.' || 
        event.key === '+' || 
        event.key === '-' || 
        event.key === '*' || 
        event.key === '/' || 
        event.key === '%') {
        appendNumber(event.key);
    } else if (event.key === 'Enter') {
        calculate();
    } else if (event.key === 'Backspace') {
        deleteLast();
    } else if (event.key === 'Escape') {
        clearAll();
    }
});

function appendNumber(number) {
    currentInput += number;
    currentDisplay.textContent = currentInput;
}

function appendOperator(operator) {
    currentInput += operator;
    currentDisplay.textContent = currentInput;
}

function appendFunction(func) {
    currentInput += func;
    currentDisplay.textContent = currentInput;
}

function appendConstant(constant) {
    if (constant === 'π') {
        currentInput += Math.PI;
    } else if (constant === 'e') {
        currentInput += Math.E;
    }
    currentDisplay.textContent = currentInput;
}

function clearAll() {
    currentInput = '';
    currentDisplay.textContent = '0';
    historyDisplay.textContent = '';
}

function deleteLast() {
    currentInput = currentInput.slice(0, -1);
    currentDisplay.textContent = currentInput || '0';
}

function calculate() {
    try {
        // Replace special functions with their JavaScript equivalents
        let expression = currentInput
            .replace(/sin\(/g, 'Math.sin(')
            .replace(/cos\(/g, 'Math.cos(')
            .replace(/tan\(/g, 'Math.tan(')
            .replace(/log\(/g, 'Math.log10(')
            .replace(/ln\(/g, 'Math.log(')
            .replace(/√/g, 'Math.sqrt(')
            .replace(/\^/g, '**')
            .replace(/!/g, 'factorial(');

        // Add closing parenthesis for sqrt if needed
        if (expression.includes('Math.sqrt(') && !expression.includes(')')) {
            expression += ')';
        }

        const result = eval(expression);
        calculationHistory.push(`${currentInput} = ${result}`);
        updateHistory();
        currentInput = result.toString();
        currentDisplay.textContent = currentInput;
    } catch (error) {
        currentDisplay.textContent = 'Error';
        currentInput = '';
    }
}

function updateHistory() {
    historyDisplay.innerHTML = calculationHistory
        .slice(-5)
        .map(item => `<div>${item}</div>`)
        .join('');
}

// Helper function for factorial
function factorial(n) {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize display
    currentDisplay.textContent = '0';
    historyDisplay.textContent = '';
}); 