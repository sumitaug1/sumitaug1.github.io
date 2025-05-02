// Global variables and functions
let numberInput, inputPrefix, binaryDisplay, decimalDisplay, hexDisplay, octalDisplay, bitDisplay, historyTable, systemButtons;
let conversionHistory = [];

function showError(message) {
    alert(message);
}

function performOperation(operation) {
    const activeSystem = document.querySelector('.system-btn.active').dataset.system;
    const input = numberInput.value.trim();
    
    if (!input) {
        showError('Please enter a number first');
        return;
    }

    let decimal;
    try {
        switch(activeSystem) {
            case 'binary':
                decimal = parseInt(input, 2);
                break;
            case 'decimal':
                decimal = parseInt(input, 10);
                break;
            case 'hex':
                decimal = parseInt(input, 16);
                break;
            case 'octal':
                decimal = parseInt(input, 8);
                break;
        }

        let result;
        switch(operation) {
            case 'and':
                result = decimal & 0xFF; // AND with 255 (8 bits)
                break;
            case 'or':
                result = decimal | 0xFF; // OR with 255 (8 bits)
                break;
            case 'xor':
                result = decimal ^ 0xFF; // XOR with 255 (8 bits)
                break;
            case 'not':
                result = ~decimal & 0xFF; // NOT and mask to 8 bits
                break;
            case 'shiftLeft':
                result = (decimal << 1) & 0xFF; // Shift left and mask to 8 bits
                break;
            case 'shiftRight':
                result = (decimal >> 1) & 0xFF; // Shift right and mask to 8 bits
                break;
        }

        // Update input with result
        numberInput.value = result.toString();
        convert();
    } catch (error) {
        showError('Invalid number for operation');
    }
}

function clearInput() {
    numberInput.value = '';
    clearDisplays();
}

document.addEventListener('DOMContentLoaded', function() {
    // Get display elements
    numberInput = document.getElementById('numberInput');
    inputPrefix = document.getElementById('inputPrefix');
    binaryDisplay = document.getElementById('binaryDisplay');
    decimalDisplay = document.getElementById('decimalDisplay');
    hexDisplay = document.getElementById('hexDisplay');
    octalDisplay = document.getElementById('octalDisplay');
    bitDisplay = document.getElementById('bitDisplay');
    historyTable = document.getElementById('historyTable');
    systemButtons = document.querySelectorAll('.system-btn');

    // Load history from localStorage
    conversionHistory = JSON.parse(localStorage.getItem('conversionHistory')) || [];

    // Initialize bit display
    initializeBitDisplay();

    // Event listeners
    systemButtons.forEach(button => {
        button.addEventListener('click', function() {
            systemButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            updateInputPrefix();
        });
    });

    numberInput.addEventListener('input', function() {
        convert();
    });

    function updateInputPrefix() {
        const activeSystem = document.querySelector('.system-btn.active').dataset.system;
        switch(activeSystem) {
            case 'binary':
                inputPrefix.textContent = '0b';
                break;
            case 'decimal':
                inputPrefix.textContent = '';
                break;
            case 'hex':
                inputPrefix.textContent = '0x';
                break;
            case 'octal':
                inputPrefix.textContent = '0o';
                break;
        }
    }

    function convert() {
        const activeSystem = document.querySelector('.system-btn.active').dataset.system;
        const input = numberInput.value.trim();
        
        if (!input) {
            clearDisplays();
            return;
        }

        let decimal;
        try {
            switch(activeSystem) {
                case 'binary':
                    if (!/^[01]+$/.test(input)) {
                        throw new Error('Invalid binary number');
                    }
                    decimal = parseInt(input, 2);
                    break;
                case 'decimal':
                    if (!/^\d+$/.test(input)) {
                        throw new Error('Invalid decimal number');
                    }
                    decimal = parseInt(input, 10);
                    break;
                case 'hex':
                    if (!/^[0-9A-Fa-f]+$/.test(input)) {
                        throw new Error('Invalid hexadecimal number');
                    }
                    decimal = parseInt(input, 16);
                    break;
                case 'octal':
                    if (!/^[0-7]+$/.test(input)) {
                        throw new Error('Invalid octal number');
                    }
                    decimal = parseInt(input, 8);
                    break;
            }

            const binary = decimal.toString(2);
            const hex = decimal.toString(16).toUpperCase();
            const octal = decimal.toString(8);

            // Add to history
            const conversion = {
                from: { system: activeSystem, value: input },
                to: {
                    binary,
                    decimal: decimal.toString(),
                    hexadecimal: hex,
                    octal
                },
                timestamp: new Date().toISOString()
            };

            conversionHistory.unshift(conversion);
            if (conversionHistory.length > 10) {
                conversionHistory.pop();
            }

            localStorage.setItem('conversionHistory', JSON.stringify(conversionHistory));
            updateHistory();

            displayResults(binary, decimal, hex, octal);
            updateBitDisplay(binary);
        } catch (error) {
            showError(error.message);
        }
    }

    function displayResults(binary, decimal, hex, octal) {
        binaryDisplay.textContent = `0b${binary}`;
        decimalDisplay.textContent = decimal;
        hexDisplay.textContent = `0x${hex}`;
        octalDisplay.textContent = `0o${octal}`;
    }

    function clearDisplays() {
        binaryDisplay.textContent = '0b0';
        decimalDisplay.textContent = '0';
        hexDisplay.textContent = '0x0';
        octalDisplay.textContent = '0o0';
        updateBitDisplay('0');
    }

    function initializeBitDisplay() {
        bitDisplay.innerHTML = Array.from({length: 8}, (_, i) => `
            <div class="bit" data-bit="${7-i}">
                <div class="bit-value">0</div>
                <div class="bit-position">2<sup>${7-i}</sup></div>
            </div>
        `).join('');

        // Add event listeners to bits
        document.querySelectorAll('.bit').forEach(bit => {
            bit.addEventListener('click', function() {
                const position = parseInt(this.dataset.bit);
                const currentValue = this.querySelector('.bit-value').textContent;
                const newValue = currentValue === '0' ? '1' : '0';
                
                this.querySelector('.bit-value').textContent = newValue;
                updateInputFromBits();
            });
        });
    }

    function updateBitDisplay(binary = '0') {
        const bits = binary.padStart(8, '0').split('').reverse();
        
        document.querySelectorAll('.bit').forEach((bit, index) => {
            bit.querySelector('.bit-value').textContent = bits[index];
        });
    }

    function updateInputFromBits() {
        const bits = Array.from(document.querySelectorAll('.bit-value'))
            .map(el => el.textContent)
            .reverse()
            .join('');
        
        const decimal = parseInt(bits, 2);
        numberInput.value = decimal.toString();
        systemButtons.forEach(btn => {
            if (btn.dataset.system === 'decimal') {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        updateInputPrefix();
        convert();
    }

    function updateHistory() {
        historyTable.innerHTML = conversionHistory.map(conv => `
            <tr>
                <td>${conv.from.system}: ${conv.from.value}</td>
                <td>${conv.to.binary}</td>
                <td>${conv.to.decimal}</td>
                <td>${conv.to.hexadecimal}</td>
                <td>${conv.to.octal}</td>
                <td>${new Date(conv.timestamp).toLocaleTimeString()}</td>
            </tr>
        `).join('');
    }

    // Initialize
    updateInputPrefix();
    clearDisplays();
}); 