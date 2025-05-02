document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const form = document.getElementById('diceForm');
    const diceType = document.getElementById('diceType');
    const diceCount = document.getElementById('diceCount');
    const diceContainer = document.getElementById('diceContainer');
    const resultsCard = document.getElementById('resultsCard');
    const resultsList = document.getElementById('resultsList');
    const copyBtn = document.getElementById('copyBtn');
    const resetBtn = document.getElementById('resetBtn');

    // Dice faces for different types
    const diceFaces = {
        d4: ['1', '2', '3', '4'],
        d6: ['1', '2', '3', '4', '5', '6'],
        d8: ['1', '2', '3', '4', '5', '6', '7', '8'],
        d10: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        d12: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
        d20: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'],
        d100: Array.from({length: 100}, (_, i) => (i + 1).toString())
    };

    // Roll a single die
    function rollDie(type) {
        const faces = diceFaces[type];
        return faces[Math.floor(Math.random() * faces.length)];
    }

    // Create dice element
    function createDiceElement(value, type) {
        const dice = document.createElement('div');
        dice.className = 'dice';
        dice.innerHTML = `
            <div class="dice-inner">
                <div class="dice-face">
                    <span>${value}</span>
                </div>
            </div>
        `;
        return dice;
    }

    // Animate dice roll
    function animateDice(dice) {
        // Add rolling class
        dice.classList.add('rolling');
        
        // Add sound effect
        const rollSound = new Audio('../../assets/sounds/dice-roll.mp3');
        rollSound.volume = 0.3;
        rollSound.play().catch(() => {}); // Ignore if sound fails to play
        
        // Remove rolling class after animation
        setTimeout(() => {
            dice.classList.remove('rolling');
        }, 1500);
    }

    // Display results
    function displayResults(results, type) {
        resultsList.innerHTML = '';
        const total = results.reduce((sum, val) => sum + parseInt(val), 0);
        
        // Add individual results
        results.forEach((result, index) => {
            const resultItem = document.createElement('div');
            resultItem.className = 'result-item';
            resultItem.innerHTML = `
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <span class="badge bg-primary me-2">Dice ${index + 1}</span>
                        <span class="fw-bold">${result}</span>
                    </div>
                    <div class="text-muted small">
                        <i class="fas fa-dice-d20"></i>
                    </div>
                </div>
            `;
            resultsList.appendChild(resultItem);
        });

        // Add total
        const totalItem = document.createElement('div');
        totalItem.className = 'result-item mt-3 pt-3 border-top';
        totalItem.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <span class="badge bg-success me-2">Total</span>
                    <span class="fw-bold">${total}</span>
                </div>
                <div class="text-success">
                    <i class="fas fa-calculator"></i>
                </div>
            </div>
        `;
        resultsList.appendChild(totalItem);

        // Show results card with animation
        resultsCard.style.display = 'block';
        resultsCard.style.opacity = '0';
        resultsCard.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            resultsCard.style.opacity = '1';
            resultsCard.style.transform = 'translateY(0)';
        }, 100);
    }

    // Copy results to clipboard
    function copyResults() {
        const results = Array.from(resultsList.querySelectorAll('.fw-bold'))
            .map(el => el.textContent)
            .join('\n');

        navigator.clipboard.writeText(results).then(() => {
            // Show success message
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check me-2"></i>Copied!';
            copyBtn.classList.add('btn-success');
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
                copyBtn.classList.remove('btn-success');
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy results:', err);
            alert('Failed to copy results to clipboard');
        });
    }

    // Reset form and results
    function resetForm() {
        form.reset();
        diceContainer.innerHTML = '';
        resultsCard.style.display = 'none';
        
        // Add reset animation
        const resetSound = new Audio('../../assets/sounds/reset.mp3');
        resetSound.volume = 0.2;
        resetSound.play().catch(() => {}); // Ignore if sound fails to play
    }

    // Event listeners
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const type = diceType.value;
        const count = parseInt(diceCount.value);
        const results = [];

        // Clear previous dice
        diceContainer.innerHTML = '';

        // Roll dice and create elements
        for (let i = 0; i < count; i++) {
            const value = rollDie(type);
            results.push(value);
            const dice = createDiceElement(value, type);
            diceContainer.appendChild(dice);
            
            // Stagger the animation
            setTimeout(() => {
                animateDice(dice);
            }, i * 200);
        }

        // Display results after all dice have rolled
        setTimeout(() => {
            displayResults(results, type);
        }, count * 200 + 1500);
    });

    copyBtn.addEventListener('click', copyResults);
    resetBtn.addEventListener('click', resetForm);

    // Input validation
    diceCount.addEventListener('input', function() {
        if (this.value < 1) this.value = 1;
        if (this.value > 10) this.value = 10;
    });
}); 