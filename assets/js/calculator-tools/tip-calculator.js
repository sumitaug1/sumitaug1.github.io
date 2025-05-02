document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const billAmount = document.getElementById('billAmount');
    const tipButtons = document.querySelectorAll('.tip-btn');
    const customTip = document.getElementById('customTip');
    const roundTotal = document.getElementById('roundTotal');
    const splitAmount = document.getElementById('splitAmount');
    const tipAmount = document.getElementById('tipAmount');
    const totalAmount = document.getElementById('totalAmount');
    const splitAmountDisplay = document.getElementById('splitAmountDisplay');

    // Event listeners
    [billAmount, customTip].forEach(element => {
        element.addEventListener('input', calculateTip);
    });

    tipButtons.forEach(button => {
        button.addEventListener('click', function() {
            tipButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            customTip.value = '';
            calculateTip();
        });
    });

    roundTotal.addEventListener('change', calculateTip);

    // Global function for split control
    window.updateSplit = function(change) {
        const current = parseInt(splitAmount.textContent);
        const newValue = Math.max(1, current + change);
        splitAmount.textContent = newValue;
        calculateTip();
    };

    function calculateTip() {
        const bill = parseFloat(billAmount.value) || 0;
        let tip;
        
        // Get tip percentage from active button or custom input
        const activeButton = document.querySelector('.tip-btn.active');
        if (customTip.value) {
            tip = parseFloat(customTip.value);
        } else if (activeButton) {
            tip = parseFloat(activeButton.dataset.tip);
        } else {
            tip = 20; // Default tip
        }

        const split = parseInt(splitAmount.textContent) || 1;

        // Calculate tip amount
        const tipValue = (bill * tip) / 100;
        let total = bill + tipValue;

        // Round total if option is checked
        if (roundTotal.checked) {
            total = Math.round(total);
        }

        const perPerson = total / split;

        // Update displays
        tipAmount.textContent = `$${tipValue.toFixed(2)}`;
        totalAmount.textContent = `$${total.toFixed(2)}`;
        splitAmountDisplay.textContent = `$${perPerson.toFixed(2)}`;
    }

    // Initialize
    calculateTip();
}); 