// Global variables
let currentMode = 'percentage';

// Get display elements
const originalPriceInput = document.getElementById('originalPrice');
const discountInput = document.getElementById('discount');
const originalPriceDisplay = document.getElementById('originalPriceDisplay');
const finalPriceDisplay = document.getElementById('finalPriceDisplay');
const discountBadge = document.getElementById('discountBadge');
const savingsDisplay = document.getElementById('savingsDisplay');
const priceBar = document.getElementById('priceBar');
const summaryOriginal = document.getElementById('summaryOriginal');
const summaryDiscount = document.getElementById('summaryDiscount');
const summaryFinal = document.getElementById('summaryFinal');
const discountInputGroup = document.getElementById('discountInputGroup');

// Set the initial mode
setMode('percentage');

function setMode(mode) {
    currentMode = mode;
    const percentageModeBtn = document.getElementById('percentageMode');
    const amountModeBtn = document.getElementById('amountMode');
    
    // Update button styles
    percentageModeBtn.classList.remove('btn-primary');
    percentageModeBtn.classList.add('btn-outline-primary');
    amountModeBtn.classList.remove('btn-primary');
    amountModeBtn.classList.add('btn-outline-secondary');
    
    if (mode === 'percentage') {
        percentageModeBtn.classList.remove('btn-outline-primary');
        percentageModeBtn.classList.add('btn-primary');
        discountInput.placeholder = 'Enter percentage';
        discountInputGroup.querySelector('.input-group-text:last-child').textContent = '%';
    } else {
        amountModeBtn.classList.remove('btn-outline-secondary');
        amountModeBtn.classList.add('btn-primary');
        discountInput.placeholder = 'Enter amount';
        discountInputGroup.querySelector('.input-group-text:last-child').textContent = '$';
    }
}

function calculateDiscount() {
    const price = parseFloat(originalPriceInput.value);
    const discountValue = parseFloat(discountInput.value);

    if (isNaN(price) || isNaN(discountValue)) {
        showError('Please enter valid numbers');
        return;
    }

    if (currentMode === 'percentage' && (discountValue < 0 || discountValue > 100)) {
        showError('Percentage must be between 0 and 100');
        return;
    }

    if (currentMode === 'amount' && discountValue > price) {
        showError('Discount amount cannot be greater than original price');
        return;
    }

    const discount = currentMode === 'percentage' ? (price * discountValue / 100) : discountValue;
    const finalPrice = price - discount;
    const discountPercentage = (discount / price) * 100;

    // Update displays
    originalPriceDisplay.textContent = `$${price.toFixed(2)}`;
    finalPriceDisplay.textContent = `$${finalPrice.toFixed(2)}`;
    discountBadge.textContent = `${discountPercentage.toFixed(1)}% OFF`;
    savingsDisplay.textContent = `You Save: $${discount.toFixed(2)}`;
    
    // Update summary
    summaryOriginal.textContent = `$${price.toFixed(2)}`;
    summaryDiscount.textContent = currentMode === 'percentage' ? 
        `${discountValue}%` : 
        `$${discountValue.toFixed(2)}`;
    summaryFinal.textContent = `$${finalPrice.toFixed(2)}`;

    // Update price bar
    updatePriceBar(price, finalPrice);
}

function updatePriceBar(price, finalPrice) {
    const discountPercentage = ((price - finalPrice) / price) * 100;
    priceBar.style.setProperty('--discount-percent', `${discountPercentage}%`);
}

function showError(message) {
    // You can implement a more sophisticated error display if needed
    alert(message);
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize displays
    originalPriceDisplay.textContent = '$0.00';
    finalPriceDisplay.textContent = '$0.00';
    discountBadge.textContent = '0% OFF';
    savingsDisplay.textContent = 'You Save: $0.00';
    summaryOriginal.textContent = '$0.00';
    summaryDiscount.textContent = '0%';
    summaryFinal.textContent = '$0.00';
}); 