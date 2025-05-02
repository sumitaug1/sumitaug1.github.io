document.addEventListener('DOMContentLoaded', function() {
    const display = document.getElementById('display');
    const history = document.getElementById('history');
    let currentInput = '';
    let calculationHistory = [];

    // Handle number and operator button clicks
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function() {
            const value = this.textContent;
            
            if (value === 'C') {
                clearDisplay();
            } else if (value === '⌫') {
                deleteLastChar();
            } else if (value === '=') {
                calculate();
            } else {
                appendToDisplay(value);
            }
        });
    });

    // Handle keyboard input
    document.addEventListener('keydown', function(event) {
        if (event.key >= '0' && event.key <= '9' || 
            event.key === '.' || 
            event.key === '+' || 
            event.key === '-' || 
            event.key === '*' || 
            event.key === '/' || 
            event.key === '%') {
            appendToDisplay(event.key);
        } else if (event.key === 'Enter') {
            calculate();
        } else if (event.key === 'Backspace') {
            deleteLastChar();
        } else if (event.key === 'Escape') {
            clearDisplay();
        }
    });

    function appendToDisplay(value) {
        currentInput += value;
        display.value = currentInput;
    }

    function clearDisplay() {
        currentInput = '';
        display.value = '';
    }

    function deleteLastChar() {
        currentInput = currentInput.slice(0, -1);
        display.value = currentInput;
    }

    function calculate() {
        try {
            const result = eval(currentInput);
            calculationHistory.push(`${currentInput} = ${result}`);
            updateHistory();
            currentInput = result.toString();
            display.value = currentInput;
        } catch (error) {
            display.value = 'Error';
            currentInput = '';
        }
    }

    function updateHistory() {
        history.innerHTML = calculationHistory
            .slice(-5)
            .map(item => `<div class="history-item">${item}</div>`)
            .join('');
    }
}); 