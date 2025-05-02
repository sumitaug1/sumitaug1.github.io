document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const coin = document.getElementById('coin');
    const flipBtn = document.getElementById('flipBtn');
    const resetBtn = document.getElementById('resetBtn');
    const resultDisplay = document.getElementById('resultDisplay');
    const resultText = document.getElementById('resultText');
    const totalFlips = document.getElementById('totalFlips');
    const headsCount = document.getElementById('headsCount');
    const tailsCount = document.getElementById('tailsCount');

    // Statistics
    let stats = {
        total: 0,
        heads: 0,
        tails: 0
    };

    // Load statistics from localStorage
    function loadStats() {
        const savedStats = localStorage.getItem('coinFlipStats');
        if (savedStats) {
            stats = JSON.parse(savedStats);
            updateStatsDisplay();
        }
    }

    // Save statistics to localStorage
    function saveStats() {
        localStorage.setItem('coinFlipStats', JSON.stringify(stats));
    }

    // Update statistics display
    function updateStatsDisplay() {
        totalFlips.textContent = stats.total;
        headsCount.textContent = stats.heads;
        tailsCount.textContent = stats.tails;
    }

    // Flip coin animation
    function flipCoin() {
        // Disable button during animation
        flipBtn.disabled = true;

        // Random result
        const result = Math.random() < 0.5 ? 'heads' : 'tails';
        
        // Update statistics
        stats.total++;
        if (result === 'heads') {
            stats.heads++;
        } else {
            stats.tails++;
        }
        saveStats();
        updateStatsDisplay();

        // Animation
        let flips = 0;
        const maxFlips = 10;
        const flipInterval = setInterval(() => {
            flips++;
            coin.style.transform = `rotateY(${flips * 180}deg)`;
            
            if (flips >= maxFlips) {
                clearInterval(flipInterval);
                showResult(result);
                flipBtn.disabled = false;
            }
        }, 100);
    }

    // Show result
    function showResult(result) {
        resultDisplay.style.display = 'block';
        resultText.textContent = result.charAt(0).toUpperCase() + result.slice(1);
        resultText.className = `mb-0 text-${result === 'heads' ? 'success' : 'danger'}`;
    }

    // Reset statistics
    function resetStats() {
        if (confirm('Are you sure you want to reset the statistics?')) {
            stats = {
                total: 0,
                heads: 0,
                tails: 0
            };
            saveStats();
            updateStatsDisplay();
            resultDisplay.style.display = 'none';
        }
    }

    // Event listeners
    flipBtn.addEventListener('click', flipCoin);
    resetBtn.addEventListener('click', resetStats);

    // Initialize
    loadStats();
}); 