document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const form = document.getElementById('temperatureConverterForm');
    const fromValue = document.getElementById('fromValue');
    const toValue = document.getElementById('toValue');
    const fromUnit = document.getElementById('fromUnit');
    const toUnit = document.getElementById('toUnit');
    const convertBtn = document.getElementById('convertBtn');
    const swapBtn = document.getElementById('swapBtn');
    const conversionFormula = document.getElementById('conversionFormula');

    // Conversion functions
    const conversions = {
        // Celsius to other units
        celsius: {
            fahrenheit: (c) => (c * 9/5) + 32,
            kelvin: (c) => c + 273.15,
            rankine: (c) => (c + 273.15) * 9/5,
            reaumur: (c) => c * 4/5,
            triple: (c) => c + 273.16,
            planck: (c) => (c + 273.15) / 1.41679e32
        },
        // Fahrenheit to other units
        fahrenheit: {
            celsius: (f) => (f - 32) * 5/9,
            kelvin: (f) => (f - 32) * 5/9 + 273.15,
            rankine: (f) => f + 459.67,
            reaumur: (f) => (f - 32) * 4/9,
            triple: (f) => (f - 32) * 5/9 + 273.16,
            planck: (f) => ((f - 32) * 5/9 + 273.15) / 1.41679e32
        },
        // Kelvin to other units
        kelvin: {
            celsius: (k) => k - 273.15,
            fahrenheit: (k) => (k - 273.15) * 9/5 + 32,
            rankine: (k) => k * 9/5,
            reaumur: (k) => (k - 273.15) * 4/5,
            triple: (k) => k + 0.01,
            planck: (k) => k / 1.41679e32
        },
        // Rankine to other units
        rankine: {
            celsius: (r) => (r - 491.67) * 5/9,
            fahrenheit: (r) => r - 459.67,
            kelvin: (r) => r * 5/9,
            reaumur: (r) => (r - 491.67) * 4/9,
            triple: (r) => r * 5/9 + 0.01,
            planck: (r) => (r * 5/9) / 1.41679e32
        },
        // Réaumur to other units
        reaumur: {
            celsius: (re) => re * 5/4,
            fahrenheit: (re) => re * 9/4 + 32,
            kelvin: (re) => re * 5/4 + 273.15,
            rankine: (re) => re * 9/4 + 491.67,
            triple: (re) => re * 5/4 + 273.16,
            planck: (re) => (re * 5/4 + 273.15) / 1.41679e32
        },
        // Triple point to other units
        triple: {
            celsius: (t) => t - 273.16,
            fahrenheit: (t) => (t - 273.16) * 9/5 + 32,
            kelvin: (t) => t - 0.01,
            rankine: (t) => (t - 0.01) * 9/5,
            reaumur: (t) => (t - 273.16) * 4/5,
            planck: (t) => (t - 0.01) / 1.41679e32
        },
        // Planck temperature to other units
        planck: {
            celsius: (p) => p * 1.41679e32 - 273.15,
            fahrenheit: (p) => p * 1.41679e32 * 9/5 - 459.67,
            kelvin: (p) => p * 1.41679e32,
            rankine: (p) => p * 1.41679e32 * 9/5,
            reaumur: (p) => (p * 1.41679e32 - 273.15) * 4/5,
            triple: (p) => p * 1.41679e32 + 0.01
        }
    };

    // Unit display names for formula
    const unitDisplayNames = {
        celsius: 'Celsius',
        fahrenheit: 'Fahrenheit',
        kelvin: 'Kelvin',
        rankine: 'Rankine',
        reaumur: 'Réaumur',
        triple: 'Triple point',
        planck: 'Planck temperature'
    };

    // Function to validate input
    function validateInput(value) {
        if (value === '' || isNaN(value)) {
            return false;
        }
        return true;
    }

    // Function to convert between units
    function convert(value, fromUnit, toUnit) {
        try {
            if (fromUnit === toUnit) {
                return value;
            }
            return conversions[fromUnit][toUnit](value);
        } catch (error) {
            console.error('Conversion error:', error);
            return null;
        }
    }

    // Function to format number with appropriate decimal places
    function formatNumber(number) {
        if (number === null) return '';
        if (Math.abs(number) >= 1000000) {
            return number.toExponential(6);
        }
        if (Math.abs(number) < 0.000001) {
            return number.toExponential(6);
        }
        return Number(number.toPrecision(10)).toString();
    }

    // Function to update conversion formula display
    function updateFormula(value, fromUnit, toUnit, result) {
        if (result === null) {
            conversionFormula.textContent = 'Invalid conversion';
            conversionFormula.classList.remove('d-none');
            return;
        }
        const formula = `${value}° ${unitDisplayNames[fromUnit]} = ${formatNumber(result)}° ${unitDisplayNames[toUnit]}`;
        conversionFormula.textContent = formula;
        conversionFormula.classList.remove('d-none');
    }

    // Function to perform conversion
    function performConversion() {
        console.log('Performing conversion...'); // Debug log
        const value = parseFloat(fromValue.value);
        console.log('Input value:', value); // Debug log

        if (!validateInput(value)) {
            toValue.value = '';
            conversionFormula.textContent = 'Please enter a valid number';
            conversionFormula.classList.remove('d-none');
            return;
        }

        const result = convert(value, fromUnit.value, toUnit.value);
        console.log('Conversion result:', result); // Debug log

        if (result !== null) {
            toValue.value = formatNumber(result);
            updateFormula(value, fromUnit.value, toUnit.value, result);
        } else {
            toValue.value = '';
            conversionFormula.textContent = 'Conversion failed';
            conversionFormula.classList.remove('d-none');
        }
    }

    // Event listeners
    convertBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Convert button clicked'); // Debug log
        performConversion();
    });

    fromValue.addEventListener('input', function() {
        console.log('Input value changed'); // Debug log
        if (fromValue.value === '') {
            toValue.value = '';
            conversionFormula.classList.add('d-none');
        } else {
            performConversion();
        }
    });

    fromUnit.addEventListener('change', function() {
        console.log('From unit changed'); // Debug log
        performConversion();
    });

    toUnit.addEventListener('change', function() {
        console.log('To unit changed'); // Debug log
        performConversion();
    });

    // Swap button functionality
    swapBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Swap button clicked'); // Debug log
        const tempUnit = fromUnit.value;
        fromUnit.value = toUnit.value;
        toUnit.value = tempUnit;

        const tempValue = fromValue.value;
        fromValue.value = toValue.value;
        toValue.value = tempValue;

        if (fromValue.value !== '') {
            performConversion();
        }
    });

    // Form submission handler
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Form submitted'); // Debug log
        performConversion();
    });

    // Initialize with empty state
    toValue.value = '';
    conversionFormula.classList.add('d-none');
}); 