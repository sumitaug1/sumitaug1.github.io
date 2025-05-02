document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const form = document.getElementById('generatorForm');
    const minNumber = document.getElementById('minNumber');
    const maxNumber = document.getElementById('maxNumber');
    const quantity = document.getElementById('quantity');
    const uniqueOnly = document.getElementById('uniqueOnly');
    const sortResults = document.getElementById('sortResults');
    const resetBtn = document.getElementById('resetBtn');
    const resultsCard = document.getElementById('resultsCard');
    const resultsContainer = document.getElementById('resultsContainer');
    const copyBtn = document.getElementById('copyBtn');
    const downloadBtn = document.getElementById('downloadBtn');

    // Generate random numbers
    function generateRandomNumbers(min, max, count, unique, sort) {
        min = parseInt(min);
        max = parseInt(max);
        count = parseInt(count);

        // Validate input
        if (min > max) {
            [min, max] = [max, min]; // Swap values
        }

        // Handle unique numbers request
        if (unique && (max - min + 1) < count) {
            count = max - min + 1;
        }

        let numbers = [];
        if (unique) {
            // Create array of all possible numbers
            let pool = Array.from({length: max - min + 1}, (_, i) => min + i);
            
            // Fisher-Yates shuffle
            for (let i = pool.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [pool[i], pool[j]] = [pool[j], pool[i]];
            }
            
            numbers = pool.slice(0, count);
        } else {
            // Generate random numbers with possible duplicates
            for (let i = 0; i < count; i++) {
                numbers.push(Math.floor(Math.random() * (max - min + 1)) + min);
            }
        }

        // Sort if requested
        if (sort) {
            numbers.sort((a, b) => a - b);
        }

        return numbers;
    }

    // Display results
    function displayResults(numbers) {
        resultsContainer.innerHTML = '';
        resultsCard.style.display = 'block';

        // Create result elements
        const resultsList = document.createElement('div');
        resultsList.className = 'row g-2';

        numbers.forEach(number => {
            const numberElement = document.createElement('div');
            numberElement.className = 'col-auto';
            numberElement.innerHTML = `
                <span class="badge bg-primary p-2 fs-6">${number}</span>
            `;
            resultsList.appendChild(numberElement);
        });

        resultsContainer.appendChild(resultsList);
    }

    // Copy results to clipboard
    function copyResults() {
        const numbers = Array.from(resultsContainer.querySelectorAll('.badge'))
            .map(badge => badge.textContent)
            .join(', ');

        navigator.clipboard.writeText(numbers).then(() => {
            // Show success message
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check me-2"></i>Copied!';
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy numbers:', err);
            alert('Failed to copy numbers to clipboard');
        });
    }

    // Download results as TXT
    function downloadResults() {
        const numbers = Array.from(resultsContainer.querySelectorAll('.badge'))
            .map(badge => badge.textContent)
            .join('\n');

        const blob = new Blob([numbers], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'random-numbers.txt';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }

    // Reset form
    function resetForm() {
        form.reset();
        resultsCard.style.display = 'none';
        minNumber.value = '1';
        maxNumber.value = '100';
        quantity.value = '1';
    }

    // Event listeners
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const numbers = generateRandomNumbers(
            minNumber.value,
            maxNumber.value,
            quantity.value,
            uniqueOnly.checked,
            sortResults.checked
        );
        displayResults(numbers);
    });

    resetBtn.addEventListener('click', resetForm);
    copyBtn.addEventListener('click', copyResults);
    downloadBtn.addEventListener('click', downloadResults);

    // Input validation
    quantity.addEventListener('input', function() {
        const max = uniqueOnly.checked ? 
            Math.max(maxNumber.value - minNumber.value + 1, 100) : 
            100;
        
        if (this.value > max) {
            this.value = max;
        }
        if (this.value < 1) {
            this.value = 1;
        }
    });

    uniqueOnly.addEventListener('change', function() {
        const currentMax = Math.max(maxNumber.value - minNumber.value + 1, 100);
        quantity.max = this.checked ? currentMax : 100;
        if (this.checked && quantity.value > currentMax) {
            quantity.value = currentMax;
        }
    });

    // Range validation
    [minNumber, maxNumber].forEach(input => {
        input.addEventListener('input', function() {
            if (uniqueOnly.checked) {
                const range = maxNumber.value - minNumber.value + 1;
                if (quantity.value > range) {
                    quantity.value = range;
                }
                quantity.max = range;
            }
        });
    });
});