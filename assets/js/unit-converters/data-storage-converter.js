document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const form = document.getElementById('dataStorageConverterForm');
    const fromValue = document.getElementById('fromValue');
    const toValue = document.getElementById('toValue');
    const fromUnit = document.getElementById('fromUnit');
    const toUnit = document.getElementById('toUnit');
    const convertBtn = document.getElementById('convertBtn');
    const swapBtn = document.getElementById('swapBtn');
    const conversionFormula = document.getElementById('conversionFormula');

    // Base unit conversion factors (to bytes)
    const conversionFactors = {
        // Binary units (powers of 1024)
        bytes: 1,
        kilobytes: 1024,
        megabytes: 1024 * 1024,
        gigabytes: 1024 * 1024 * 1024,
        terabytes: 1024 * 1024 * 1024 * 1024,
        petabytes: 1024 * 1024 * 1024 * 1024 * 1024,
        exabytes: 1024 * 1024 * 1024 * 1024 * 1024 * 1024,
        zettabytes: 1024 * 1024 * 1024 * 1024 * 1024 * 1024 * 1024,
        yottabytes: 1024 * 1024 * 1024 * 1024 * 1024 * 1024 * 1024 * 1024,
        // Binary units (powers of 1024) with binary prefixes
        kibibytes: 1024,
        mebibytes: 1024 * 1024,
        gibibytes: 1024 * 1024 * 1024,
        tebibytes: 1024 * 1024 * 1024 * 1024
    };

    // Unit display names for formula
    const unitDisplayNames = {
        bytes: 'bytes',
        kilobytes: 'kilobytes',
        megabytes: 'megabytes',
        gigabytes: 'gigabytes',
        terabytes: 'terabytes',
        petabytes: 'petabytes',
        exabytes: 'exabytes',
        zettabytes: 'zettabytes',
        yottabytes: 'yottabytes',
        kibibytes: 'kibibytes',
        mebibytes: 'mebibytes',
        gibibytes: 'gibibytes',
        tebibytes: 'tebibytes'
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
            // Convert to base unit (bytes)
            const valueInBytes = value * conversionFactors[fromUnit];
            // Convert from base unit to target unit
            return valueInBytes / conversionFactors[toUnit];
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
        const formula = `${value} ${unitDisplayNames[fromUnit]} = ${formatNumber(result)} ${unitDisplayNames[toUnit]}`;
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