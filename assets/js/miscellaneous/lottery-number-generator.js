document.addEventListener('DOMContentLoaded', function() {
    // Form elements
    const generatorForm = document.getElementById('generatorForm');
    const lotteryTypeSelect = document.getElementById('lotteryType');
    const customSettings = document.getElementById('customSettings');
    const resetBtn = document.getElementById('resetBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const resultsCard = document.getElementById('resultsCard');

    // Lottery type configurations
    const lotteryConfigs = {
        powerball: {
            min: 1,
            max: 69,
            count: 5,
            specialMin: 1,
            specialMax: 26,
            specialName: 'Powerball'
        },
        megaMillions: {
            min: 1,
            max: 70,
            count: 5,
            specialMin: 1,
            specialMax: 25,
            specialName: 'Mega Ball'
        },
        euroMillions: {
            min: 1,
            max: 50,
            count: 5,
            specialMin: 1,
            specialMax: 12,
            specialName: 'Lucky Stars'
        },
        lotto: {
            min: 1,
            max: 59,
            count: 6,
            specialMin: 1,
            specialMax: 1,
            specialName: 'Bonus Ball'
        }
    };

    // Show/hide custom settings
    lotteryTypeSelect.addEventListener('change', function() {
        if (this.value === 'custom') {
            customSettings.style.display = 'block';
        } else {
            customSettings.style.display = 'none';
            updateCustomSettings(this.value);
        }
    });

    // Update custom settings based on lottery type
    function updateCustomSettings(type) {
        const config = lotteryConfigs[type];
        if (config) {
            document.getElementById('minNumber').value = config.min;
            document.getElementById('maxNumber').value = config.max;
            document.getElementById('numberCount').value = config.count;
            document.getElementById('specialNumber').value = config.specialMin;
        }
    }

    // Generate random number between min and max
    function getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Generate unique random numbers
    function generateUniqueNumbers(min, max, count) {
        const numbers = new Set();
        while (numbers.size < count) {
            numbers.add(getRandomNumber(min, max));
        }
        return Array.from(numbers).sort((a, b) => a - b);
    }

    // Generate lottery numbers
    function generateNumbers(type, setCount) {
        const results = [];
        const config = type === 'custom' ? {
            min: parseInt(document.getElementById('minNumber').value),
            max: parseInt(document.getElementById('maxNumber').value),
            count: parseInt(document.getElementById('numberCount').value),
            specialMin: parseInt(document.getElementById('specialNumber').value),
            specialMax: parseInt(document.getElementById('specialNumber').value),
            specialName: 'Special Number'
        } : lotteryConfigs[type];

        for (let i = 0; i < setCount; i++) {
            const mainNumbers = generateUniqueNumbers(config.min, config.max, config.count);
            const specialNumber = getRandomNumber(config.specialMin, config.specialMax);
            results.push({
                mainNumbers,
                specialNumber,
                specialName: config.specialName
            });
        }

        return results;
    }

    // Render results
    function renderResults(results) {
        const container = document.getElementById('resultsContainer');
        container.innerHTML = results.map((set, index) => `
            <div class="number-set mb-4 p-3 border rounded">
                <h6 class="mb-3">Set #${index + 1}</h6>
                <div class="d-flex flex-wrap gap-2 mb-2">
                    ${set.mainNumbers.map(number => `
                        <span class="badge bg-primary p-2">${number}</span>
                    `).join('')}
                </div>
                <div class="mt-2">
                    <span class="badge bg-danger p-2">${set.specialName}: ${set.specialNumber}</span>
                </div>
            </div>
        `).join('');
    }

    // Form submission
    generatorForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const type = lotteryTypeSelect.value;
        const setCount = parseInt(document.getElementById('setCount').value);
        const results = generateNumbers(type, setCount);
        renderResults(results);
        resultsCard.style.display = 'block';
    });

    // Download results
    downloadBtn.addEventListener('click', function() {
        const element = document.getElementById('resultsCard');
        const opt = {
            margin: 1,
            filename: 'lottery-numbers.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save();
    });

    // Reset form
    resetBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to reset the form? All data will be lost.')) {
            generatorForm.reset();
            customSettings.style.display = 'none';
            resultsCard.style.display = 'none';
        }
    });

    // Initialize
    updateCustomSettings(lotteryTypeSelect.value);
}); 