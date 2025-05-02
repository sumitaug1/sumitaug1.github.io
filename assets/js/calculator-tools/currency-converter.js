// Global variables
let exchangeRates = {
    USD: { rate: 1, flag: '🇺🇸' },
    EUR: { rate: 0.85, flag: '🇪🇺' },
    GBP: { rate: 0.72, flag: '🇬🇧' },
    JPY: { rate: 110.25, flag: '🇯🇵' },
    AUD: { rate: 1.35, flag: '🇦🇺' },
    CAD: { rate: 1.25, flag: '🇨🇦' },
    CHF: { rate: 0.92, flag: '🇨🇭' },
    CNY: { rate: 6.45, flag: '🇨🇳' },
    INR: { rate: 74.50, flag: '🇮🇳' },
    BRL: { rate: 5.25, flag: '🇧🇷' }
};

let favorites = JSON.parse(localStorage.getItem('currencyFavorites')) || [];
let conversionHistory = JSON.parse(localStorage.getItem('conversionHistory')) || [];
let lastRateUpdate = localStorage.getItem('lastRateUpdate');

// Get display elements
const amountInput = document.getElementById('amount');
const fromCurrency = document.getElementById('fromCurrency');
const toCurrency = document.getElementById('toCurrency');
const convertedInput = document.getElementById('converted');
const fromFlag = document.getElementById('fromFlag');
const toFlag = document.getElementById('toFlag');
const exchangeRate = document.getElementById('exchangeRate');
const favoritesList = document.getElementById('favoritesList');
const conversionHistoryTable = document.getElementById('conversionHistory');
const customRateInput = document.getElementById('customRate');
const lastUpdateTime = document.getElementById('lastUpdateTime');

async function fetchExchangeRates() {
    try {
        // Check if we need to update rates (once per day)
        const today = new Date().toDateString();
        if (lastRateUpdate === today) {
            return; // Rates are up to date
        }

        // Using ExchangeRate-API (free tier)
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await response.json();

        // Update rates
        Object.keys(exchangeRates).forEach(code => {
            if (data.rates[code]) {
                exchangeRates[code].rate = data.rates[code];
            }
        });

        // Update last update time
        lastRateUpdate = today;
        localStorage.setItem('lastRateUpdate', today);
        localStorage.setItem('exchangeRates', JSON.stringify(exchangeRates));

        // Update display
        updateLastUpdateTime();
        showSuccess('Exchange rates updated successfully');
    } catch (error) {
        console.error('Error fetching exchange rates:', error);
        showError('Failed to update exchange rates. Using cached rates.');
    }
}

function updateLastUpdateTime() {
    if (lastUpdateTime) {
        const date = new Date();
        lastUpdateTime.textContent = `Last updated: ${date.toLocaleString()}`;
    }
}

function initializeCurrencies() {
    // Load cached rates if available
    const cachedRates = localStorage.getItem('exchangeRates');
    if (cachedRates) {
        const parsedRates = JSON.parse(cachedRates);
        Object.keys(parsedRates).forEach(code => {
            if (exchangeRates[code]) {
                exchangeRates[code].rate = parsedRates[code].rate;
            }
        });
    }

    Object.entries(exchangeRates).forEach(([code, data]) => {
        const option1 = document.createElement('option');
        const option2 = document.createElement('option');
        
        option1.value = code;
        option1.textContent = `${data.flag} ${code}`;
        
        option2.value = code;
        option2.textContent = `${data.flag} ${code}`;
        
        fromCurrency.appendChild(option1);
        toCurrency.appendChild(option2);
    });

    // Set default values
    fromCurrency.value = 'USD';
    toCurrency.value = 'EUR';
    updateFlags();
}

function convertCurrency() {
    const amount = parseFloat(amountInput.value);
    const fromCode = fromCurrency.value;
    const toCode = toCurrency.value;

    if (isNaN(amount)) {
        showError('Please enter a valid amount');
        return;
    }

    const fromRate = exchangeRates[fromCode].rate;
    const toRate = exchangeRates[toCode].rate;
    const convertedAmount = (amount / fromRate) * toRate;

    // Update display
    convertedInput.value = convertedAmount.toFixed(2);
    exchangeRate.textContent = `1 ${fromCode} = ${(toRate / fromRate).toFixed(4)} ${toCode}`;

    // Add to history
    const conversion = {
        from: { code: fromCode, amount },
        to: { code: toCode, amount: convertedAmount },
        rate: toRate / fromRate,
        timestamp: new Date().toISOString()
    };

    conversionHistory.unshift(conversion);
    if (conversionHistory.length > 10) {
        conversionHistory.pop();
    }

    localStorage.setItem('conversionHistory', JSON.stringify(conversionHistory));
    updateHistory();
}

function updateExchangeRate() {
    const customRate = parseFloat(customRateInput.value);
    if (isNaN(customRate)) {
        showError('Please enter a valid exchange rate');
        return;
    }

    const fromCode = fromCurrency.value;
    const toCode = toCurrency.value;
    exchangeRates[toCode].rate = customRate * exchangeRates[fromCode].rate;
    
    showSuccess('Exchange rate updated');
    convertCurrency();
}

function updateFlags() {
    fromFlag.src = `https://flagcdn.com/w20/${fromCurrency.value.toLowerCase()}.png`;
    toFlag.src = `https://flagcdn.com/w20/${toCurrency.value.toLowerCase()}.png`;
}

function toggleFavorite(type) {
    const code = type === 'from' ? fromCurrency.value : toCurrency.value;
    const index = favorites.indexOf(code);
    
    if (index === -1) {
        favorites.push(code);
    } else {
        favorites.splice(index, 1);
    }
    
    localStorage.setItem('currencyFavorites', JSON.stringify(favorites));
    updateFavorites();
}

function updateFavorites() {
    favoritesList.innerHTML = favorites.map(code => `
        <div class="favorite-item" onclick="selectFavorite('${code}')">
            <span class="flag">${exchangeRates[code].flag}</span>
            <span class="code">${code}</span>
            <button class="btn btn-sm btn-danger" onclick="removeFavorite('${code}')">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
}

function selectFavorite(code) {
    fromCurrency.value = code;
    updateFlags();
    convertCurrency();
}

function removeFavorite(code) {
    favorites = favorites.filter(f => f !== code);
    localStorage.setItem('currencyFavorites', JSON.stringify(favorites));
    updateFavorites();
}

function updateHistory() {
    conversionHistoryTable.innerHTML = conversionHistory.map(conv => `
        <tr>
            <td>${conv.from.code}</td>
            <td>${conv.to.code}</td>
            <td>${conv.from.amount.toFixed(2)}</td>
            <td>${conv.to.amount.toFixed(2)}</td>
            <td>${conv.rate.toFixed(4)}</td>
            <td>${new Date(conv.timestamp).toLocaleTimeString()}</td>
        </tr>
    `).join('');
}

function showError(message) {
    alert(message);
}

function showSuccess(message) {
    alert(message);
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', async function() {
    initializeCurrencies();
    updateFavorites();
    updateHistory();
    updateLastUpdateTime();
    
    // Fetch latest exchange rates
    await fetchExchangeRates();
    
    // Add event listeners
    fromCurrency.addEventListener('change', function() {
        updateFlags();
        convertCurrency();
    });
    
    toCurrency.addEventListener('change', function() {
        updateFlags();
        convertCurrency();
    });
    
    amountInput.addEventListener('input', convertCurrency);
}); 