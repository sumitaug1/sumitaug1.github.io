// Initialize chart instance
let chartInstance = null;

document.addEventListener('DOMContentLoaded', () => {
    try {
        // Initialize variables
        let additionalCharges = [];

        // Form elements
        const calculatorForm = document.getElementById('calculatorForm');
        const addChargeBtn = document.getElementById('addChargeBtn');
        const resetBtn = document.getElementById('resetBtn');
        const downloadBtn = document.getElementById('downloadBtn');
        const resultsCard = document.getElementById('resultsCard');
        const energyCost = document.getElementById('energyCost');
        const additionalChargesDisplay = document.getElementById('additionalCharges');
        const totalBill = document.getElementById('totalBill');
        const shareBtn = document.getElementById('shareBtn');
        const addApplianceBtn = document.getElementById('addApplianceBtn');
        const applianceContainer = document.getElementById('applianceContainer');
        const chargesContainer = document.getElementById('chargesContainer');
        const savingsTips = document.getElementById('savingsTips');
        const usageChart = document.getElementById('usageChart');
        const countrySelect = document.getElementById('countrySelect');
        const stateSelect = document.getElementById('stateSelect');
        const utilityProvider = document.getElementById('utilityProvider');

        // Solar and Battery Elements
        const solarProduction = document.getElementById('solarProduction');
        const dailyProduction = document.getElementById('dailyProduction');
        const monthlySavings = document.getElementById('monthlySavings');
        const batteryStorage = document.getElementById('batteryStorage');
        const availableCapacity = document.getElementById('availableCapacity');
        const backupDuration = document.getElementById('backupDuration');
        const co2Saved = document.getElementById('co2Saved');
        const treesEquivalent = document.getElementById('treesEquivalent');

        // Templates
        const applianceTemplate = document.getElementById('applianceTemplate');
        const chargeTemplate = document.getElementById('chargeTemplate');

        // Constants
        const CO2_PER_KWH = 0.92; // kg of CO2 per kWh
        const TREES_PER_KWH = 0.05; // trees equivalent per kWh saved
        const BATTERY_EFFICIENCY = 0.95; // 95% round-trip efficiency

        // Country-specific configurations
        const countryConfigs = {
            US: {
                currency: 'USD',
                currencySymbol: '$',
                usageUnit: 'kWh',
                rateUnit: '/kWh',
                states: [
                    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
                    'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
                    'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
                    'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
                    'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
                    'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
                    'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
                ],
                defaultRate: 0.12,
                vatRate: 0,
                additionalCharges: ['Transmission', 'Distribution', 'System Benefit Charge']
            },
            UK: {
                currency: 'GBP',
                currencySymbol: '£',
                usageUnit: 'kWh',
                rateUnit: '/kWh',
                states: [
                    'England', 'Scotland', 'Wales', 'Northern Ireland'
                ],
                defaultRate: 0.28,
                vatRate: 0.05,
                additionalCharges: ['Standing Charge', 'Climate Change Levy']
            },
            CA: {
                currency: 'CAD',
                currencySymbol: 'C$',
                usageUnit: 'kWh',
                rateUnit: '/kWh',
                states: [
                    'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 'Newfoundland and Labrador',
                    'Nova Scotia', 'Ontario', 'Prince Edward Island', 'Quebec', 'Saskatchewan'
                ],
                defaultRate: 0.15,
                vatRate: 0.05,
                additionalCharges: ['Delivery Charge', 'Regulatory Charge']
            },
            AU: {
                currency: 'AUD',
                currencySymbol: 'A$',
                usageUnit: 'kWh',
                rateUnit: '/kWh',
                states: [
                    'New South Wales', 'Victoria', 'Queensland', 'South Australia', 'Western Australia',
                    'Tasmania', 'Northern Territory', 'Australian Capital Territory'
                ],
                defaultRate: 0.25,
                vatRate: 0.10,
                additionalCharges: ['Supply Charge', 'Network Charge']
            },
            DE: {
                currency: 'EUR',
                currencySymbol: '€',
                usageUnit: 'kWh',
                rateUnit: '/kWh',
                states: [
                    'Baden-Württemberg', 'Bavaria', 'Berlin', 'Brandenburg', 'Bremen', 'Hamburg', 'Hesse',
                    'Lower Saxony', 'Mecklenburg-Vorpommern', 'North Rhine-Westphalia', 'Rhineland-Palatinate',
                    'Saarland', 'Saxony', 'Saxony-Anhalt', 'Schleswig-Holstein', 'Thuringia'
                ],
                defaultRate: 0.30,
                vatRate: 0.19,
                additionalCharges: ['Grid Fee', 'Renewable Energy Surcharge']
            }
        };

        // State/Province Data
        const stateData = {
            US: {
                currency: 'USD',
                units: 'kWh',
                states: [
                    { code: 'AL', name: 'Alabama', region: 'Southeast' },
                    { code: 'AK', name: 'Alaska', region: 'West' },
                    { code: 'AZ', name: 'Arizona', region: 'Southwest' },
                    { code: 'AR', name: 'Arkansas', region: 'Southeast' },
                    { code: 'CA', name: 'California', region: 'West' },
                    { code: 'CO', name: 'Colorado', region: 'West' },
                    { code: 'CT', name: 'Connecticut', region: 'Northeast' },
                    { code: 'DE', name: 'Delaware', region: 'Northeast' },
                    { code: 'FL', name: 'Florida', region: 'Southeast' },
                    { code: 'GA', name: 'Georgia', region: 'Southeast' },
                    { code: 'HI', name: 'Hawaii', region: 'West' },
                    { code: 'ID', name: 'Idaho', region: 'West' },
                    { code: 'IL', name: 'Illinois', region: 'Midwest' },
                    { code: 'IN', name: 'Indiana', region: 'Midwest' },
                    { code: 'IA', name: 'Iowa', region: 'Midwest' },
                    { code: 'KS', name: 'Kansas', region: 'Midwest' },
                    { code: 'KY', name: 'Kentucky', region: 'Southeast' },
                    { code: 'LA', name: 'Louisiana', region: 'Southeast' },
                    { code: 'ME', name: 'Maine', region: 'Northeast' },
                    { code: 'MD', name: 'Maryland', region: 'Northeast' },
                    { code: 'MA', name: 'Massachusetts', region: 'Northeast' },
                    { code: 'MI', name: 'Michigan', region: 'Midwest' },
                    { code: 'MN', name: 'Minnesota', region: 'Midwest' },
                    { code: 'MS', name: 'Mississippi', region: 'Southeast' },
                    { code: 'MO', name: 'Missouri', region: 'Midwest' },
                    { code: 'MT', name: 'Montana', region: 'West' },
                    { code: 'NE', name: 'Nebraska', region: 'Midwest' },
                    { code: 'NV', name: 'Nevada', region: 'West' },
                    { code: 'NH', name: 'New Hampshire', region: 'Northeast' },
                    { code: 'NJ', name: 'New Jersey', region: 'Northeast' },
                    { code: 'NM', name: 'New Mexico', region: 'Southwest' },
                    { code: 'NY', name: 'New York', region: 'Northeast' },
                    { code: 'NC', name: 'North Carolina', region: 'Southeast' },
                    { code: 'ND', name: 'North Dakota', region: 'Midwest' },
                    { code: 'OH', name: 'Ohio', region: 'Midwest' },
                    { code: 'OK', name: 'Oklahoma', region: 'Southwest' },
                    { code: 'OR', name: 'Oregon', region: 'West' },
                    { code: 'PA', name: 'Pennsylvania', region: 'Northeast' },
                    { code: 'RI', name: 'Rhode Island', region: 'Northeast' },
                    { code: 'SC', name: 'South Carolina', region: 'Southeast' },
                    { code: 'SD', name: 'South Dakota', region: 'Midwest' },
                    { code: 'TN', name: 'Tennessee', region: 'Southeast' },
                    { code: 'TX', name: 'Texas', region: 'Southwest' },
                    { code: 'UT', name: 'Utah', region: 'West' },
                    { code: 'VT', name: 'Vermont', region: 'Northeast' },
                    { code: 'VA', name: 'Virginia', region: 'Southeast' },
                    { code: 'WA', name: 'Washington', region: 'West' },
                    { code: 'WV', name: 'West Virginia', region: 'Southeast' },
                    { code: 'WI', name: 'Wisconsin', region: 'Midwest' },
                    { code: 'WY', name: 'Wyoming', region: 'West' }
                ]
            },
            CA: {
                name: "Canada",
                states: [
                    { code: "AB", name: "Alberta", region: "Prairies" },
                    { code: "BC", name: "British Columbia", region: "West" },
                    { code: "MB", name: "Manitoba", region: "Prairies" },
                    { code: "NB", name: "New Brunswick", region: "Atlantic" },
                    { code: "NL", name: "Newfoundland and Labrador", region: "Atlantic" },
                    { code: "NS", name: "Nova Scotia", region: "Atlantic" },
                    { code: "ON", name: "Ontario", region: "Central" },
                    { code: "PE", name: "Prince Edward Island", region: "Atlantic" },
                    { code: "QC", name: "Quebec", region: "Central" },
                    { code: "SK", name: "Saskatchewan", region: "Prairies" },
                    { code: "NT", name: "Northwest Territories", region: "North" },
                    { code: "NU", name: "Nunavut", region: "North" },
                    { code: "YT", name: "Yukon", region: "North" }
                ]
            },
            UK: {
                name: "United Kingdom",
                states: [
                    { code: "ENG", name: "England", region: "Great Britain" },
                    { code: "SCT", name: "Scotland", region: "Great Britain" },
                    { code: "WLS", name: "Wales", region: "Great Britain" },
                    { code: "NIR", name: "Northern Ireland", region: "Northern Ireland" }
                ]
            },
            AU: {
                name: "Australia",
                states: [
                    { code: "NSW", name: "New South Wales", region: "East" },
                    { code: "VIC", name: "Victoria", region: "Southeast" },
                    { code: "QLD", name: "Queensland", region: "Northeast" },
                    { code: "WA", name: "Western Australia", region: "West" },
                    { code: "SA", name: "South Australia", region: "South" },
                    { code: "TAS", name: "Tasmania", region: "Southeast" },
                    { code: "ACT", name: "Australian Capital Territory", region: "East" },
                    { code: "NT", name: "Northern Territory", region: "North" }
                ]
            },
            DE: {
                currency: 'EUR',
                units: 'kWh',
                states: [
                    { code: 'BW', name: 'Baden-Württemberg', region: 'South' },
                    { code: 'BY', name: 'Bavaria', region: 'South' },
                    { code: 'BE', name: 'Berlin', region: 'East' },
                    { code: 'BB', name: 'Brandenburg', region: 'East' },
                    { code: 'HB', name: 'Bremen', region: 'North' },
                    { code: 'HH', name: 'Hamburg', region: 'North' },
                    { code: 'HE', name: 'Hesse', region: 'Central' },
                    { code: 'MV', name: 'Mecklenburg-Vorpommern', region: 'East' },
                    { code: 'NI', name: 'Lower Saxony', region: 'North' },
                    { code: 'NW', name: 'North Rhine-Westphalia', region: 'West' },
                    { code: 'RP', name: 'Rhineland-Palatinate', region: 'West' },
                    { code: 'SL', name: 'Saarland', region: 'West' },
                    { code: 'SN', name: 'Saxony', region: 'East' },
                    { code: 'ST', name: 'Saxony-Anhalt', region: 'East' },
                    { code: 'SH', name: 'Schleswig-Holstein', region: 'North' },
                    { code: 'TH', name: 'Thuringia', region: 'East' }
                ]
            },
            FR: {
                currency: 'EUR',
                units: 'kWh',
                states: [
                    { code: 'ARA', name: 'Auvergne-Rhône-Alpes', region: 'East' },
                    { code: 'BFC', name: 'Bourgogne-Franche-Comté', region: 'East' },
                    { code: 'BRE', name: 'Bretagne', region: 'West' },
                    { code: 'CVL', name: 'Centre-Val de Loire', region: 'Central' },
                    { code: 'COR', name: 'Corse', region: 'Mediterranean' },
                    { code: 'GES', name: 'Grand Est', region: 'East' },
                    { code: 'HDF', name: 'Hauts-de-France', region: 'North' },
                    { code: 'IDF', name: 'Île-de-France', region: 'Central' },
                    { code: 'NOR', name: 'Normandie', region: 'North' },
                    { code: 'NAQ', name: 'Nouvelle-Aquitaine', region: 'Southwest' },
                    { code: 'OCC', name: 'Occitanie', region: 'South' },
                    { code: 'PDL', name: 'Pays de la Loire', region: 'West' },
                    { code: 'PAC', name: 'Provence-Alpes-Côte d\'Azur', region: 'Southeast' }
                ]
            },
            IN: {
                currency: 'INR',
                units: 'kWh',
                states: [
                    { code: 'AN', name: 'Andhra Pradesh', region: 'South' },
                    { code: 'AR', name: 'Arunachal Pradesh', region: 'Northeast' },
                    { code: 'AS', name: 'Assam', region: 'Northeast' },
                    { code: 'BR', name: 'Bihar', region: 'East' },
                    { code: 'CH', name: 'Chhattisgarh', region: 'Central' },
                    { code: 'GA', name: 'Goa', region: 'West' },
                    { code: 'GJ', name: 'Gujarat', region: 'West' },
                    { code: 'HR', name: 'Haryana', region: 'North' },
                    { code: 'HP', name: 'Himachal Pradesh', region: 'North' },
                    { code: 'JK', name: 'Jammu and Kashmir', region: 'North' },
                    { code: 'JH', name: 'Jharkhand', region: 'East' },
                    { code: 'KA', name: 'Karnataka', region: 'South' },
                    { code: 'KL', name: 'Kerala', region: 'South' },
                    { code: 'MP', name: 'Madhya Pradesh', region: 'Central' },
                    { code: 'MH', name: 'Maharashtra', region: 'West' },
                    { code: 'MN', name: 'Manipur', region: 'Northeast' },
                    { code: 'ML', name: 'Meghalaya', region: 'Northeast' },
                    { code: 'MZ', name: 'Mizoram', region: 'Northeast' },
                    { code: 'NL', name: 'Nagaland', region: 'Northeast' },
                    { code: 'OR', name: 'Odisha', region: 'East' },
                    { code: 'PB', name: 'Punjab', region: 'North' },
                    { code: 'RJ', name: 'Rajasthan', region: 'North' },
                    { code: 'SK', name: 'Sikkim', region: 'Northeast' },
                    { code: 'TN', name: 'Tamil Nadu', region: 'South' },
                    { code: 'TS', name: 'Telangana', region: 'South' },
                    { code: 'TR', name: 'Tripura', region: 'Northeast' },
                    { code: 'UP', name: 'Uttar Pradesh', region: 'North' },
                    { code: 'UT', name: 'Uttarakhand', region: 'North' },
                    { code: 'WB', name: 'West Bengal', region: 'East' }
                ]
            },
            JP: {
                currency: 'JPY',
                units: 'kWh',
                states: [
                    { code: 'HOK', name: 'Hokkaido', region: 'North' },
                    { code: 'TOH', name: 'Tohoku', region: 'North' },
                    { code: 'KAN', name: 'Kanto', region: 'East' },
                    { code: 'CHU', name: 'Chubu', region: 'Central' },
                    { code: 'KIN', name: 'Kinki', region: 'West' },
                    { code: 'CHU', name: 'Chugoku', region: 'West' },
                    { code: 'SHI', name: 'Shikoku', region: 'West' },
                    { code: 'KYU', name: 'Kyushu', region: 'South' }
                ]
            },
            BR: {
                currency: 'BRL',
                units: 'kWh',
                states: [
                    { code: 'AC', name: 'Acre', region: 'North' },
                    { code: 'AL', name: 'Alagoas', region: 'Northeast' },
                    { code: 'AP', name: 'Amapá', region: 'North' },
                    { code: 'AM', name: 'Amazonas', region: 'North' },
                    { code: 'BA', name: 'Bahia', region: 'Northeast' },
                    { code: 'CE', name: 'Ceará', region: 'Northeast' },
                    { code: 'DF', name: 'Distrito Federal', region: 'Central-West' },
                    { code: 'ES', name: 'Espírito Santo', region: 'Southeast' },
                    { code: 'GO', name: 'Goiás', region: 'Central-West' },
                    { code: 'MA', name: 'Maranhão', region: 'Northeast' },
                    { code: 'MT', name: 'Mato Grosso', region: 'Central-West' },
                    { code: 'MS', name: 'Mato Grosso do Sul', region: 'Central-West' },
                    { code: 'MG', name: 'Minas Gerais', region: 'Southeast' },
                    { code: 'PA', name: 'Pará', region: 'North' },
                    { code: 'PB', name: 'Paraíba', region: 'Northeast' },
                    { code: 'PR', name: 'Paraná', region: 'South' },
                    { code: 'PE', name: 'Pernambuco', region: 'Northeast' },
                    { code: 'PI', name: 'Piauí', region: 'Northeast' },
                    { code: 'RJ', name: 'Rio de Janeiro', region: 'Southeast' },
                    { code: 'RN', name: 'Rio Grande do Norte', region: 'Northeast' },
                    { code: 'RS', name: 'Rio Grande do Sul', region: 'South' },
                    { code: 'RO', name: 'Rondônia', region: 'North' },
                    { code: 'RR', name: 'Roraima', region: 'North' },
                    { code: 'SC', name: 'Santa Catarina', region: 'South' },
                    { code: 'SP', name: 'São Paulo', region: 'Southeast' },
                    { code: 'SE', name: 'Sergipe', region: 'Northeast' },
                    { code: 'TO', name: 'Tocantins', region: 'North' }
                ]
            },
            ZA: {
                currency: 'ZAR',
                units: 'kWh',
                states: [
                    { code: 'EC', name: 'Eastern Cape', region: 'South' },
                    { code: 'FS', name: 'Free State', region: 'Central' },
                    { code: 'GP', name: 'Gauteng', region: 'North' },
                    { code: 'KZN', name: 'KwaZulu-Natal', region: 'East' },
                    { code: 'LP', name: 'Limpopo', region: 'North' },
                    { code: 'MP', name: 'Mpumalanga', region: 'East' },
                    { code: 'NC', name: 'Northern Cape', region: 'West' },
                    { code: 'NW', name: 'North West', region: 'North' },
                    { code: 'WC', name: 'Western Cape', region: 'South' }
                ]
            }
        };

        // Utility providers data
        const utilityProviders = {
            US: {
                'California': [
                    { id: 'pge', name: 'Pacific Gas and Electric' },
                    { id: 'sce', name: 'Southern California Edison' },
                    { id: 'sdge', name: 'San Diego Gas & Electric' }
                ],
                'New York': [
                    { id: 'coned', name: 'Con Edison' },
                    { id: 'nationalgrid', name: 'National Grid' }
                ],
                'Texas': [
                    { id: 'oncor', name: 'Oncor' },
                    { id: 'centerpoint', name: 'CenterPoint Energy' }
                ]
            },
            UK: {
                'England': [
                    { id: 'britishgas', name: 'British Gas' },
                    { id: 'edf', name: 'EDF Energy' },
                    { id: 'eon', name: 'E.ON' }
                ],
                'Scotland': [
                    { id: 'sse', name: 'SSE' },
                    { id: 'scottishpower', name: 'Scottish Power' }
                ]
            },
            CA: {
                'Ontario': [
                    { id: 'hydroone', name: 'Hydro One' },
                    { id: 'torontohydro', name: 'Toronto Hydro' }
                ],
                'Quebec': [
                    { id: 'hydroquebec', name: 'Hydro-Québec' }
                ]
            }
        };

        // DOM Elements
        const usageUnit = document.getElementById('usageUnit');
        const rateUnit = document.getElementById('rateUnit');
        const currencySymbol = document.getElementById('currencySymbol');
        const additionalChargesSymbol = document.getElementById('additionalChargesSymbol');
        const countrySpecificFeatures = document.getElementById('countrySpecificFeatures');
        const countrySpecificResults = document.getElementById('countrySpecificResults');

        // Initialize country-specific features
        function initializeCountryFeatures() {
            if (countrySelect) {
                countrySelect.addEventListener('change', updateCountrySettings);
            }
            if (stateSelect) {
                stateSelect.addEventListener('change', updateUtilityProviders);
            }
            if (countrySelect && countrySelect.value) {
                updateCountrySettings(countrySelect.value);
            }
        }

        // Update state/province dropdown
        function updateStateSelect(country) {
            console.log('Updating state select for country:', country); // Debug log
            const stateSelect = document.getElementById('stateSelect');
            if (!stateSelect) {
                console.error('State select element not found');
                return;
            }

            // Clear existing options
            stateSelect.innerHTML = '<option value="">Select a state/province</option>';

            // Get states for selected country
            const countryData = stateData[country];
            if (!countryData) {
                console.error('No data found for country:', country);
                return;
            }

            const states = countryData.states;
            console.log('States for country:', states); // Debug log
            
            // Group states by region
            const groupedStates = states.reduce((acc, state) => {
                if (!acc[state.region]) {
                    acc[state.region] = [];
                }
                acc[state.region].push(state);
                return acc;
            }, {});

            // Sort regions alphabetically
            const sortedRegions = Object.keys(groupedStates).sort();

            // Add states to dropdown grouped by region
            sortedRegions.forEach(region => {
                const optgroup = document.createElement('optgroup');
                optgroup.label = region;
                
                // Sort states within region
                groupedStates[region].sort((a, b) => a.name.localeCompare(b.name));
                
                groupedStates[region].forEach(state => {
                    const option = document.createElement('option');
                    option.value = state.code;
                    option.textContent = state.name;
                    optgroup.appendChild(option);
                });
                
                stateSelect.appendChild(optgroup);
            });

            // Enable/disable state select based on country selection
            stateSelect.disabled = !country;

            // Add visual feedback
            if (country) {
                stateSelect.classList.add('is-valid');
                stateSelect.classList.remove('is-invalid');
            } else {
                stateSelect.classList.remove('is-valid');
                stateSelect.classList.remove('is-invalid');
            }
        }

        // Update country settings
        function updateCountrySettings(country) {
            console.log('Updating country settings for:', country); // Debug log
            try {
                // Update state/province dropdown
                updateStateSelect(country);

                // Update utility providers
                updateUtilityProviders(country);

                // Update currency and units based on country
                const currencyMap = {
                    'US': '$',
                    'CA': 'C$',
                    'UK': '£',
                    'AU': 'A$',
                    'DE': '€',
                    'FR': '€',
                    'JP': '¥',
                    'IN': '₹',
                    'BR': 'R$',
                    'ZA': 'R'
                };

                const unitMap = {
                    'US': { energy: 'kWh', power: 'kW', temperature: '°F' },
                    'CA': { energy: 'kWh', power: 'kW', temperature: '°C' },
                    'UK': { energy: 'kWh', power: 'kW', temperature: '°C' },
                    'AU': { energy: 'kWh', power: 'kW', temperature: '°C' },
                    'DE': { energy: 'kWh', power: 'kW', temperature: '°C' },
                    'FR': { energy: 'kWh', power: 'kW', temperature: '°C' },
                    'JP': { energy: 'kWh', power: 'kW', temperature: '°C' },
                    'IN': { energy: 'kWh', power: 'kW', temperature: '°C' },
                    'BR': { energy: 'kWh', power: 'kW', temperature: '°C' },
                    'ZA': { energy: 'kWh', power: 'kW', temperature: '°C' }
                };

                // Update currency symbol
                const currencySymbol = currencyMap[country] || '$';
                document.querySelectorAll('.currency-symbol').forEach(el => {
                    el.textContent = currencySymbol;
                });

                // Update units
                const units = unitMap[country] || unitMap['US'];
                document.querySelectorAll('.energy-unit').forEach(el => {
                    el.textContent = units.energy;
                });
                document.querySelectorAll('.power-unit').forEach(el => {
                    el.textContent = units.power;
                });
                document.querySelectorAll('.temperature-unit').forEach(el => {
                    el.textContent = units.temperature;
                });

                // Update country-specific features
                updateCountrySpecificFeatures(country);

                // Update utility providers
                updateUtilityProviders();
            } catch (error) {
                console.error('Error updating country settings:', error);
            }
        }

        // Update utility providers based on state
        function updateUtilityProviders(country) {
            try {
                const state = stateSelect.value;
                
                const providers = utilityProviders[country]?.[state] || [
                    { id: 'default', name: 'Default Provider' }
                ];
                
                utilityProvider.innerHTML = providers
                    .map(provider => `<option value="${provider.id}">${provider.name}</option>`)
                    .join('');
            } catch (error) {
                console.error('Error updating utility providers:', error);
            }
        }

        // Update country-specific features
        function updateCountrySpecificFeatures(country) {
            const config = countryConfigs[country];
            if (!config) return;

            let featuresHTML = '';

            // Add VAT/GST if applicable
            if (config.vatRate > 0) {
                featuresHTML += `
                    <div class="mb-3">
                        <label class="form-label">VAT/GST Rate</label>
                        <div class="input-group">
                            <input type="number" class="form-control" id="vatRate" value="${config.vatRate * 100}" readonly>
                            <span class="input-group-text">%</span>
                        </div>
                    </div>
                `;
            }

            // Add additional charges
            if (config.additionalCharges) {
                featuresHTML += `
                    <div class="mb-3">
                        <label class="form-label">Additional Charges</label>
                        ${config.additionalCharges.map(charge => `
                            <div class="input-group mb-2">
                                <span class="input-group-text">${config.currencySymbol}</span>
                                <input type="number" class="form-control" id="${charge.toLowerCase().replace(/\s+/g, '')}" placeholder="${charge}">
                            </div>
                        `).join('')}
                    </div>
                `;
            }

            countrySpecificFeatures.innerHTML = featuresHTML;
        }

        // Render additional charges
        function renderCharges() {
            if (!chargesContainer) return; // Exit if container doesn't exist

            try {
                // Clear existing charges
                chargesContainer.innerHTML = '';

                // Add each charge
                additionalCharges.forEach(charge => {
                    const chargeElement = document.createElement('div');
                    chargeElement.className = 'input-group mb-3';
                    chargeElement.innerHTML = `
                        <input type="text" class="form-control" placeholder="Charge Description" value="${charge.description}">
                        <input type="number" class="form-control" placeholder="Amount" value="${charge.amount}" step="0.01">
                        <button class="btn btn-outline-danger remove-charge" type="button">
                            <i class="fas fa-times"></i>
                        </button>
                    `;

                    // Add remove button functionality
                    const removeBtn = chargeElement.querySelector('.remove-charge');
                    if (removeBtn) {
                        removeBtn.addEventListener('click', () => {
                            additionalCharges = additionalCharges.filter(c => c.id !== charge.id);
                            renderCharges();
                        });
                    }

                    chargesContainer.appendChild(chargeElement);
                });
            } catch (error) {
                console.error('Error rendering charges:', error);
            }
        }

        // Add additional charge
        function addCharge() {
            if (!chargesContainer) return; // Exit if container doesn't exist

            try {
                const charge = {
                    id: Date.now(),
                    description: '',
                    amount: 0
                };
                additionalCharges.push(charge);
                renderCharges();
            } catch (error) {
                console.error('Error adding charge:', error);
            }
        }

        // Form submission
        function handleSubmit(e) {
            try {
                e.preventDefault();
                const results = calculateBill();
                displayResults(results);
            } catch (error) {
                console.error('Error handling form submission:', error);
                alert('An error occurred while calculating your bill. Please check your inputs and try again.');
            }
        }

        // Calculate bill
        function calculateBill() {
            try {
                // Get input values
                const usage = parseFloat(document.getElementById('usage').value) || 0;
                const rate = parseFloat(document.getElementById('rate').value) || 0;
                const billingPeriod = document.getElementById('billingPeriod').value;
                const selectedCountry = document.getElementById('countrySelect').value;
                const selectedState = document.getElementById('stateSelect').value;
                const selectedProvider = document.getElementById('utilityProvider').value;

                // Get time of use rates if available
                const offPeakRate = parseFloat(document.getElementById('offPeakRate').value) || rate;
                const midPeakRate = parseFloat(document.getElementById('midPeakRate').value) || rate;
                const peakRate = parseFloat(document.getElementById('peakRate').value) || rate;

                // Calculate base energy cost
                let energyCost = usage * rate;

                // Apply time of use rates if different from base rate
                if (offPeakRate !== rate || midPeakRate !== rate || peakRate !== rate) {
                    const offPeakUsage = usage * 0.4; // 40% of usage during off-peak
                    const midPeakUsage = usage * 0.3; // 30% of usage during mid-peak
                    const peakUsage = usage * 0.3; // 30% of usage during peak

                    energyCost = (offPeakUsage * offPeakRate) +
                                (midPeakUsage * midPeakRate) +
                                (peakUsage * peakRate);
                }

                // Calculate additional charges
                let additionalCharges = 0;
                const chargeItems = document.querySelectorAll('.charge-item');
                chargeItems.forEach(charge => {
                    const amount = parseFloat(charge.querySelector('.charge-amount').value) || 0;
                    additionalCharges += amount;
                });

                // Calculate total bill
                let totalBill = energyCost + additionalCharges;

                // Adjust for billing period
                if (billingPeriod === 'quarterly') {
                    totalBill *= 3;
                    energyCost *= 3;
                    additionalCharges *= 3;
                } else if (billingPeriod === 'annually') {
                    totalBill *= 12;
                    energyCost *= 12;
                    additionalCharges *= 12;
                }

                // Get currency and units based on country
                const countrySettings = getCountrySettings(selectedCountry);
                const currency = countrySettings.currency;
                const units = countrySettings.units;

                // Update results display
                const energyCostElement = document.getElementById('energyCost');
                const additionalChargesElement = document.getElementById('additionalCharges');
                const totalBillElement = document.getElementById('totalBill');
                const billingPeriodElement = document.getElementById('billingPeriodDisplay');

                if (energyCostElement) energyCostElement.textContent = formatCurrency(energyCost, currency);
                if (additionalChargesElement) additionalChargesElement.textContent = formatCurrency(additionalCharges, currency);
                if (totalBillElement) totalBillElement.textContent = formatCurrency(totalBill, currency);
                if (billingPeriodElement) billingPeriodElement.textContent = billingPeriod.charAt(0).toUpperCase() + billingPeriod.slice(1);

                // Show results card
                const resultsCard = document.getElementById('resultsCard');
                if (resultsCard) resultsCard.style.display = 'block';

                // Create usage breakdown chart
                createUsageChart(usage, offPeakRate, midPeakRate, peakRate, currency);

                // Generate energy savings tips
                generateEnergySavingsTips(usage, selectedCountry, selectedState);

                return {
                    energyCost,
                    additionalCharges,
                    totalBill,
                    currency,
                    units,
                    billingPeriod
                };
            } catch (error) {
                console.error('Error calculating bill:', error);
                alert('An error occurred while calculating the bill. Please try again.');
                return null;
            }
        }

        function formatCurrency(amount, currency) {
            try {
                return new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: currency,
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }).format(amount);
            } catch (error) {
                console.error('Error formatting currency:', error);
                return `${currency} ${amount.toFixed(2)}`;
            }
        }

        function getCountrySettings(country) {
            const settings = {
                US: { currency: 'USD', units: 'kWh' },
                GB: { currency: 'GBP', units: 'kWh' },
                CA: { currency: 'CAD', units: 'kWh' },
                AU: { currency: 'AUD', units: 'kWh' },
                DE: { currency: 'EUR', units: 'kWh' },
                FR: { currency: 'EUR', units: 'kWh' },
                JP: { currency: 'JPY', units: 'kWh' },
                IN: { currency: 'INR', units: 'kWh' },
                BR: { currency: 'BRL', units: 'kWh' },
                ZA: { currency: 'ZAR', units: 'kWh' }
            };
            return settings[country] || { currency: 'USD', units: 'kWh' };
        }

        // Calculate solar production
        function calculateSolarProduction() {
            const size = parseFloat(document.getElementById('solarSize').value) || 0;
            const sunHours = parseFloat(document.getElementById('sunHours').value) || 0;
            const efficiency = parseFloat(document.getElementById('solarEfficiency').value) || 80;
            
            if (size > 0 && sunHours > 0) {
                const dailyKWh = size * sunHours * (efficiency / 100);
                const monthlyKWh = dailyKWh * 30;
                return { dailyKWh, monthlyKWh };
            }
            return { dailyKWh: 0, monthlyKWh: 0 };
        }

        // Calculate battery storage
        function calculateBatteryStorage() {
            const capacity = parseFloat(document.getElementById('batteryCapacity').value) || 0;
            const dod = parseFloat(document.getElementById('batteryDOD').value) || 90;
            
            if (capacity > 0) {
                const availableKWh = capacity * (dod / 100) * BATTERY_EFFICIENCY;
                return availableKWh;
            }
            return 0;
        }

        // Calculate efficiency savings
        function calculateEfficiencySavings(baseUsage) {
            let savings = 0;
            
            if (document.getElementById('ledLighting').checked) {
                savings += baseUsage * 0.15; // 15% savings from LED lighting
            }
            if (document.getElementById('smartThermostat').checked) {
                savings += baseUsage * 0.10; // 10% savings from smart thermostat
            }
            if (document.getElementById('energyStar').checked) {
                savings += baseUsage * 0.20; // 20% savings from Energy Star appliances
            }
            if (document.getElementById('insulation').checked) {
                savings += baseUsage * 0.12; // 12% savings from proper insulation
            }
            
            return savings;
        }

        // Calculate weather impact
        function calculateWeatherImpact(baseUsage) {
            const temp = parseFloat(document.getElementById('avgTemperature').value) || 70;
            const climateZone = document.getElementById('climateZone').value;
            
            let impact = 0;
            
            if (climateZone === 'hot') {
                impact = temp > 85 ? baseUsage * 0.15 : baseUsage * 0.05;
            } else if (climateZone === 'cold') {
                impact = temp < 45 ? baseUsage * 0.20 : baseUsage * 0.08;
            }
            
            return impact;
        }

        // Download report
        function handleDownload() {
            try {
                const element = document.createElement('div');
                element.innerHTML = `
                    <h2>Electric Bill Report</h2>
                    <p>Generated on ${new Date().toLocaleDateString()}</p>
                    <h3>Bill Summary</h3>
                    <p>Energy Cost: ${energyCost?.textContent || '$0.00'}</p>
                    <p>Additional Charges: ${additionalCharges?.textContent || '$0.00'}</p>
                    <p>Total Bill: ${totalBill?.textContent || '$0.00'}</p>
                    <h3>Appliance Usage</h3>
                    ${Array.from(applianceContainer?.querySelectorAll('.col-md-6') || []).map(card => `
                        <p>${card.querySelector('input[type="text"]')?.value || 'Unknown'}: 
                           ${card.querySelector('input[placeholder="Power (W)"]')?.value || '0'}W × 
                           ${card.querySelector('input[placeholder="Hours per day"]')?.value || '0'}hrs/day</p>
                    `).join('')}
                    <h3>Additional Charges</h3>
                    ${Array.from(chargesContainer?.querySelectorAll('.input-group') || []).map(group => `
                        <p>${group.querySelector('input[type="text"]')?.value || 'Unknown'}: 
                           ${formatCurrency(parseFloat(group.querySelector('input[type="number"]')?.value) || 0, currency)}</p>
                    `).join('')}
                    <h3>Environmental Impact</h3>
                    <p>CO₂ Emissions Saved: ${co2Saved?.textContent || '0 kg'}</p>
                    <p>Trees Equivalent: ${treesEquivalent?.textContent || '0 trees'}</p>
                `;
                
                const opt = {
                    margin: 1,
                    filename: 'electric-bill-report.pdf',
                    image: { type: 'jpeg', quality: 0.98 },
                    html2canvas: { scale: 2 },
                    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
                };
                
                html2pdf().set(opt).from(element).save();
            } catch (error) {
                console.error('Error handling download:', error);
                alert('An error occurred while generating the report. Please try again.');
            }
        }

        // Share results
        function handleShare() {
            try {
                const shareData = {
                    title: 'My Electric Bill Calculation',
                    text: `My electric bill calculation:\nEnergy Cost: ${energyCost?.textContent || '$0.00'}\nAdditional Charges: ${additionalCharges?.textContent || '$0.00'}\nTotal Bill: ${totalBill?.textContent || '$0.00'}\nEnvironmental Impact: ${co2Saved?.textContent || '0 kg'} CO₂ saved, ${treesEquivalent?.textContent || '0 trees'} trees equivalent`,
                    url: window.location.href
                };
                
                if (navigator.share) {
                    navigator.share(shareData)
                        .catch(error => console.log('Error sharing:', error));
                } else {
                    // Fallback for browsers that don't support Web Share API
                    const textArea = document.createElement('textarea');
                    textArea.value = shareData.text;
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                    alert('Results copied to clipboard!');
                }
            } catch (error) {
                console.error('Error handling share:', error);
                alert('An error occurred while sharing the results. Please try again.');
            }
        }

        // Handle reset
        function handleReset() {
            try {
                if (calculatorForm) calculatorForm.reset();
                if (resultsCard) resultsCard.style.display = 'none';
                if (chartInstance instanceof Chart) {
                    chartInstance.destroy();
                    chartInstance = null;
                }
                if (savingsTips) savingsTips.innerHTML = '';
                if (solarProduction) solarProduction.style.display = 'none';
                if (batteryStorage) batteryStorage.style.display = 'none';
                
                // Reset appliance and charge containers
                if (applianceContainer) {
                    applianceContainer.innerHTML = '';
                    addAppliance();
                }
                if (chargesContainer) {
                    chargesContainer.innerHTML = '';
                    addCharge();
                }

                // Reset new fields
                targetUsage.value = '';
                targetBill.value = '';
                targetDate.value = '';
                previousUsage.value = '';
                previousBill.value = '';
                peakUsageTime.textContent = '-';
                costSavingsPotential.textContent = '$0.00';
                usageProgress.style.width = '0%';
                costProgress.style.width = '0%';
                usageProgressText.textContent = '0% of target';
                costProgressText.textContent = '0% of target';
                rebateTableBody.innerHTML = '';
                recommendations.innerHTML = '';

                // Hide sections
                document.getElementById('goalProgress').style.display = 'none';
                document.getElementById('rebateSummary').style.display = 'none';

                // Reset new fields
                homeSize.value = '';
                occupants.value = '1';
                homeAge.value = 'modern';
                insulationType.value = 'average';
                smartThermostat.checked = false;
                smartLighting.checked = false;
                smartAppliances.checked = false;
                energyMonitoring.checked = false;
                solarSystem.value = 'none';
                batteryStorage.value = 'none';
                windTurbine.value = 'none';
                primaryUsageTime.value = 'evening';
                usagePattern.value = 'consistent';

                // Reset charts
                if (usagePatternChartInstance) {
                    usagePatternChartInstance.destroy();
                    usagePatternChartInstance = null;
                }

                // Reset displays
                efficiencyScore.style.width = '0%';
                efficiencyScoreText.textContent = '0/100';
                potentialSavings.textContent = '$0.00';
                energyGeneration.textContent = '0 kWh';
                carbonReduction.textContent = '0 kg CO₂';
                energyOptimization.textContent = '0%';
                costReduction.textContent = '$0.00';
                recommendations.innerHTML = '';
            } catch (error) {
                console.error('Error handling reset:', error);
                alert('An error occurred while resetting the form. Please refresh the page and try again.');
            }
        }

        // Add new DOM elements
        const targetUsage = document.getElementById('targetUsage');
        const targetBill = document.getElementById('targetBill');
        const targetDate = document.getElementById('targetDate');
        const previousUsage = document.getElementById('previousUsage');
        const previousBill = document.getElementById('previousBill');
        const peakUsageTime = document.getElementById('peakUsageTime');
        const costSavingsPotential = document.getElementById('costSavingsPotential');
        const usageProgress = document.getElementById('usageProgress');
        const costProgress = document.getElementById('costProgress');
        const usageProgressText = document.getElementById('usageProgressText');
        const costProgressText = document.getElementById('costProgressText');
        const rebateTableBody = document.getElementById('rebateTableBody');
        const trendsChart = document.getElementById('trendsChart');
        const recommendations = document.getElementById('recommendations');

        // Initialize trends chart
        let trendsChartInstance = null;

        // Add event listeners for new features
        document.getElementById('solarRebate')?.addEventListener('change', updateRebates);
        document.getElementById('batteryRebate')?.addEventListener('change', updateRebates);
        document.getElementById('efficiencyRebate')?.addEventListener('change', updateRebates);
        document.getElementById('smartHomeRebate')?.addEventListener('change', updateRebates);

        // Calculate time of use costs
        function calculateTimeOfUseCosts(totalUsage, baseRate) {
            try {
                const morningUsage = parseFloat(document.getElementById('morningUsage')?.value || 30) / 100;
                const afternoonUsage = parseFloat(document.getElementById('afternoonUsage')?.value || 40) / 100;
                const eveningUsage = parseFloat(document.getElementById('eveningUsage')?.value || 20) / 100;
                const nightUsage = parseFloat(document.getElementById('nightUsage')?.value || 10) / 100;

                const morningRate = parseFloat(document.getElementById('morningRate')?.value || 1.2);
                const afternoonRate = parseFloat(document.getElementById('afternoonRate')?.value || 1.5);
                const eveningRate = parseFloat(document.getElementById('eveningRate')?.value || 1.0);
                const nightRate = parseFloat(document.getElementById('nightRate')?.value || 0.8);

                const costs = {
                    morning: totalUsage * morningUsage * baseRate * morningRate,
                    afternoon: totalUsage * afternoonUsage * baseRate * afternoonRate,
                    evening: totalUsage * eveningUsage * baseRate * eveningRate,
                    night: totalUsage * nightUsage * baseRate * nightRate
                };

                // Find peak usage time
                const peakTime = Object.entries(costs).reduce((a, b) => a[1] > b[1] ? a : b)[0];
                peakUsageTime.textContent = peakTime.charAt(0).toUpperCase() + peakTime.slice(1);

                // Calculate potential savings
                const currentCost = Object.values(costs).reduce((a, b) => a + b, 0);
                const minCost = totalUsage * baseRate * nightRate; // Minimum possible cost
                const potentialSavings = currentCost - minCost;
                costSavingsPotential.textContent = formatCurrency(potentialSavings, currency);

                return costs;
            } catch (error) {
                console.error('Error calculating time of use costs:', error);
                return {};
            }
        }

        // Calculate rebates
        function calculateRebates() {
            try {
                const rebates = [];
                const solarRebate = document.getElementById('solarRebate')?.checked;
                const batteryRebate = document.getElementById('batteryRebate')?.checked;
                const efficiencyRebate = document.getElementById('efficiencyRebate')?.checked;
                const smartHomeRebate = document.getElementById('smartHomeRebate')?.checked;

                if (solarRebate) {
                    rebates.push({
                        type: 'Solar Panel Rebate',
                        amount: totalBill * 0.30,
                        status: 'Available'
                    });
                }

                if (batteryRebate) {
                    rebates.push({
                        type: 'Battery Storage Rebate',
                        amount: totalBill * 0.20,
                        status: 'Available'
                    });
                }

                if (efficiencyRebate) {
                    rebates.push({
                        type: 'Energy Efficiency Rebate',
                        amount: totalBill * 0.15,
                        status: 'Available'
                    });
                }

                if (smartHomeRebate) {
                    rebates.push({
                        type: 'Smart Home Rebate',
                        amount: totalBill * 0.10,
                        status: 'Available'
                    });
                }

                return rebates;
            } catch (error) {
                console.error('Error calculating rebates:', error);
                return [];
            }
        }

        // Calculate goal progress
        function calculateGoalProgress(currentUsage, currentBill) {
            try {
                const targetUsageValue = parseFloat(targetUsage?.value || 0);
                const targetBillValue = parseFloat(targetBill?.value || 0);

                if (targetUsageValue > 0 || targetBillValue > 0) {
                    const usageProgressValue = targetUsageValue > 0 ? (currentUsage / targetUsageValue) * 100 : 0;
                    const costProgressValue = targetBillValue > 0 ? (currentBill / targetBillValue) * 100 : 0;

                    usageProgress.style.width = `${Math.min(usageProgressValue, 100)}%`;
                    costProgress.style.width = `${Math.min(costProgressValue, 100)}%`;

                    usageProgressText.textContent = `${Math.round(usageProgressValue)}% of target`;
                    costProgressText.textContent = `${Math.round(costProgressValue)}% of target`;

                    document.getElementById('goalProgress').style.display = 'block';
                } else {
                    document.getElementById('goalProgress').style.display = 'none';
                }

                return {
                    usageProgress: usageProgressValue,
                    costProgress: costProgressValue
                };
            } catch (error) {
                console.error('Error calculating goal progress:', error);
                return { usageProgress: 0, costProgress: 0 };
            }
        }

        // Calculate usage trends
        function calculateUsageTrends() {
            try {
                const currentUsage = parseFloat(usageInput?.value || 0);
                const previousUsageValue = parseFloat(previousUsage?.value || 0);

                if (trendsChartInstance) {
                    trendsChartInstance.destroy();
                }

                const ctx = trendsChart.getContext('2d');
                trendsChartInstance = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: ['Previous Month', 'Current Month'],
                        datasets: [{
                            label: 'Energy Usage (kWh)',
                            data: [previousUsageValue, currentUsage],
                            borderColor: 'rgb(75, 192, 192)',
                            tension: 0.1
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            title: {
                                display: true,
                                text: 'Monthly Usage Comparison'
                            }
                        }
                    }
                });

                return {
                    currentUsage,
                    previousUsage: previousUsageValue,
                    change: previousUsageValue > 0 ? ((currentUsage - previousUsageValue) / previousUsageValue) * 100 : 0
                };
            } catch (error) {
                console.error('Error calculating usage trends:', error);
                return { currentUsage: 0, previousUsage: 0, change: 0 };
            }
        }

        // Calculate energy efficiency score
        function calculateEfficiencyScore() {
            try {
                let score = 0;
                const size = parseFloat(homeSize?.value || 0);
                const occupantsCount = parseInt(occupants?.value || 1);
                const age = homeAge?.value || 'modern';
                const insulation = insulationType?.value || 'average';

                // Size-based scoring
                if (size > 0) {
                    const sizePerOccupant = size / occupantsCount;
                    if (sizePerOccupant <= 500) score += 25;
                    else if (sizePerOccupant <= 1000) score += 20;
                    else if (sizePerOccupant <= 1500) score += 15;
                    else score += 10;
                }

                // Age-based scoring
                switch (age) {
                    case 'new': score += 25; break;
                    case 'modern': score += 20; break;
                    case 'older': score += 15; break;
                    case 'historic': score += 10; break;
                }

                // Insulation-based scoring
                switch (insulation) {
                    case 'excellent': score += 25; break;
                    case 'good': score += 20; break;
                    case 'average': score += 15; break;
                    case 'poor': score += 10; break;
                }

                // Smart home features
                if (smartThermostat?.checked) score += 5;
                if (smartLighting?.checked) score += 5;
                if (smartAppliances?.checked) score += 5;
                if (energyMonitoring?.checked) score += 5;

                return Math.min(score, 100);
            } catch (error) {
                console.error('Error calculating efficiency score:', error);
                return 0;
            }
        }

        // Calculate renewable energy impact
        function calculateRenewableImpact() {
            try {
                const solar = solarSystem?.value || 'none';
                const battery = batteryStorage?.value || 'none';
                const wind = windTurbine?.value || 'none';

                let generation = 0;
                let carbonReduction = 0;

                // Solar generation
                switch (solar) {
                    case 'small': generation += 300; break;
                    case 'medium': generation += 500; break;
                    case 'large': generation += 1000; break;
                }

                // Wind generation
                switch (wind) {
                    case 'small': generation += 100; break;
                    case 'medium': generation += 300; break;
                    case 'large': generation += 500; break;
                }

                // Calculate carbon reduction (assuming 0.5 kg CO₂ per kWh)
                carbonReduction = generation * 0.5;

                return { generation, carbonReduction };
            } catch (error) {
                console.error('Error calculating renewable impact:', error);
                return { generation: 0, carbonReduction: 0 };
            }
        }

        // Calculate smart home benefits
        function calculateSmartHomeBenefits() {
            try {
                let optimization = 0;
                let reduction = 0;
                const baseBill = parseFloat(totalBill?.textContent?.replace(/[^0-9.-]+/g, '') || 0);

                if (smartThermostat?.checked) {
                    optimization += 15;
                    reduction += baseBill * 0.15;
                }
                if (smartLighting?.checked) {
                    optimization += 10;
                    reduction += baseBill * 0.10;
                }
                if (smartAppliances?.checked) {
                    optimization += 20;
                    reduction += baseBill * 0.20;
                }
                if (energyMonitoring?.checked) {
                    optimization += 5;
                    reduction += baseBill * 0.05;
                }

                return { optimization, reduction };
            } catch (error) {
                console.error('Error calculating smart home benefits:', error);
                return { optimization: 0, reduction: 0 };
            }
        }

        // Generate usage pattern chart
        function generateUsagePatternChart() {
            try {
                if (usagePatternChartInstance) {
                    usagePatternChartInstance.destroy();
                }

                const ctx = usagePatternChart.getContext('2d');
                const pattern = usagePattern?.value || 'consistent';
                let data;

                switch (pattern) {
                    case 'weekday':
                        data = [30, 40, 20, 10, 25, 35, 15];
                        break;
                    case 'weekend':
                        data = [20, 30, 40, 30, 25, 35, 45];
                        break;
                    case 'seasonal':
                        data = [40, 35, 30, 25, 30, 35, 40];
                        break;
                    default: // consistent
                        data = [30, 30, 30, 30, 30, 30, 30];
                }

                usagePatternChartInstance = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                        datasets: [{
                            label: 'Daily Usage (%)',
                            data: data,
                            borderColor: 'rgb(75, 192, 192)',
                            tension: 0.1
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            title: {
                                display: true,
                                text: 'Weekly Usage Pattern'
                            }
                        }
                    }
                });
            } catch (error) {
                console.error('Error generating usage pattern chart:', error);
            }
        }

        // Generate recommendations
        function generateRecommendations() {
            try {
                const recommendations = [];
                const efficiencyScore = calculateEfficiencyScore();
                const { generation, carbonReduction } = calculateRenewableImpact();
                const { optimization, reduction } = calculateSmartHomeBenefits();

                // Efficiency recommendations
                if (efficiencyScore < 50) {
                    recommendations.push('Consider upgrading your home insulation to improve energy efficiency.');
                }
                if (efficiencyScore < 70) {
                    recommendations.push('Implement smart home features to optimize energy usage.');
                }

                // Renewable energy recommendations
                if (generation === 0) {
                    recommendations.push('Consider installing solar panels to reduce your carbon footprint.');
                }
                if (batteryStorage?.value === 'none') {
                    recommendations.push('Add battery storage to maximize your renewable energy usage.');
                }

                // Smart home recommendations
                if (!smartThermostat?.checked) {
                    recommendations.push('Install a smart thermostat to optimize heating and cooling.');
                }
                if (!smartLighting?.checked) {
                    recommendations.push('Upgrade to smart lighting for better energy control.');
                }

                // Usage pattern recommendations
                const pattern = usagePattern?.value;
                if (pattern === 'weekday' || pattern === 'weekend') {
                    recommendations.push('Consider shifting some energy usage to off-peak hours.');
                }

                return recommendations;
            } catch (error) {
                console.error('Error generating recommendations:', error);
                return [];
            }
        }

        // Update rebates display
        function updateRebates() {
            try {
                const rebates = calculateRebates();
                rebateTableBody.innerHTML = rebates
                    .map(rebate => `
                        <tr>
                            <td>${rebate.type}</td>
                            <td>${formatCurrency(rebate.amount, currency)}</td>
                            <td><span class="badge bg-success">${rebate.status}</span></td>
                        </tr>
                    `)
                    .join('');

                document.getElementById('rebateSummary').style.display = rebates.length > 0 ? 'block' : 'none';
            } catch (error) {
                console.error('Error updating rebates:', error);
            }
        }

        // Add event listener for state selection
        if (stateSelect) {
            stateSelect.addEventListener('change', function(e) {
                const selectedCountry = countrySelect.value;
                const selectedState = this.value;
                const utilityProvider = document.getElementById('utilityProvider');
                
                if (utilityProvider) {
                    // Clear existing options
                    utilityProvider.innerHTML = '<option value="">Select a utility provider</option>';
                    
                    if (selectedCountry && selectedState) {
                        // Get providers for the selected country and state
                        const providers = utilityProviders[selectedCountry]?.[selectedState] || [];
                        
                        if (providers.length > 0) {
                            providers.forEach(provider => {
                                const option = document.createElement('option');
                                option.value = provider.id;
                                option.textContent = provider.name;
                                utilityProvider.appendChild(option);
                            });
                            utilityProvider.disabled = false;
                        } else {
                            // Add default provider if no specific providers found
                            const option = document.createElement('option');
                            option.value = 'default';
                            option.textContent = 'Default Provider';
                            utilityProvider.appendChild(option);
                            utilityProvider.disabled = false;
                        }
                    } else {
                        utilityProvider.disabled = true;
                    }
                }
            });
        }

        // Add event listener for country selection
        if (countrySelect) {
            countrySelect.addEventListener('change', function(e) {
                const selectedCountry = this.value;
                console.log('Country selection changed to:', selectedCountry);

                // Clear and disable state select
                if (stateSelect) {
                    stateSelect.innerHTML = '<option value="">Select a state/province</option>';
                    stateSelect.disabled = !selectedCountry;
                }

                // Clear and disable utility provider
                const utilityProvider = document.getElementById('utilityProvider');
                if (utilityProvider) {
                    utilityProvider.innerHTML = '<option value="">Select a utility provider</option>';
                    utilityProvider.disabled = true;
                }

                if (selectedCountry) {
                    // Update state/province dropdown
                    const countryData = stateData[selectedCountry];
                    if (countryData && countryData.states) {
                        const states = countryData.states;
                        const groupedStates = states.reduce((acc, state) => {
                            if (!acc[state.region]) {
                                acc[state.region] = [];
                            }
                            acc[state.region].push(state);
                            return acc;
                        }, {});

                        const sortedRegions = Object.keys(groupedStates).sort();
                        sortedRegions.forEach(region => {
                            const optgroup = document.createElement('optgroup');
                            optgroup.label = region;
                            
                            groupedStates[region].sort((a, b) => a.name.localeCompare(b.name));
                            groupedStates[region].forEach(state => {
                                const option = document.createElement('option');
                                option.value = state.code;
                                option.textContent = state.name;
                                optgroup.appendChild(option);
                            });
                            
                            stateSelect.appendChild(optgroup);
                        });

                        stateSelect.disabled = false;
                    }
                }
            });
        }

        // Initialize the calculator
        try {
            // Add initial charge if container exists
            if (chargesContainer) {
                addCharge();
            }

            // Initialize country features if country select exists and has a value
            if (countrySelect && countrySelect.value) {
                const selectedCountry = countrySelect.value;
                console.log('Initializing with country:', selectedCountry); // Debug log
                updateStateSelect(selectedCountry);
                updateCountrySettings(selectedCountry);
            }
        } catch (error) {
            console.error('Error initializing calculator:', error);
        }

        // Add event listener for form submission
        if (calculatorForm) {
            calculatorForm.addEventListener('submit', function(e) {
                e.preventDefault();
                console.log('Form submitted');
                
                try {
                    const result = calculateBill();
                    if (result) {
                        console.log('Calculation result:', result);
                        // Enable download and share buttons
                        if (downloadBtn) downloadBtn.disabled = false;
                        if (shareBtn) shareBtn.disabled = false;
                    }
                } catch (error) {
                    console.error('Error in form submission:', error);
                    alert('An error occurred while calculating the bill. Please try again.');
                }
            });
        }

        function createUsageChart(usage, offPeakRate, midPeakRate, peakRate, currency) {
            try {
                const ctx = document.getElementById('usageChart');
                if (!ctx) {
                    console.error('Usage chart canvas not found');
                    return;
                }

                // Destroy existing chart if it exists
                if (chartInstance instanceof Chart) {
                    chartInstance.destroy();
                }

                // Calculate usage distribution
                const offPeakUsage = usage * 0.4; // 40% of usage during off-peak
                const midPeakUsage = usage * 0.3; // 30% of usage during mid-peak
                const peakUsage = usage * 0.3; // 30% of usage during peak

                // Calculate costs
                const offPeakCost = offPeakUsage * offPeakRate;
                const midPeakCost = midPeakUsage * midPeakRate;
                const peakCost = peakUsage * peakRate;

                // Create the chart
                chartInstance = new Chart(ctx, {
                    type: 'pie',
                    data: {
                        labels: [
                            `Off-Peak (${formatCurrency(offPeakCost, currency)})`,
                            `Mid-Peak (${formatCurrency(midPeakCost, currency)})`,
                            `Peak (${formatCurrency(peakCost, currency)})`
                        ],
                        datasets: [{
                            data: [offPeakCost, midPeakCost, peakCost],
                            backgroundColor: [
                                'rgba(75, 192, 192, 0.8)',  // Off-peak - Teal
                                'rgba(255, 206, 86, 0.8)',  // Mid-peak - Yellow
                                'rgba(255, 99, 132, 0.8)'   // Peak - Red
                            ],
                            borderColor: [
                                'rgba(75, 192, 192, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(255, 99, 132, 1)'
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'bottom',
                                labels: {
                                    font: {
                                        size: 12
                                    }
                                }
                            },
                            title: {
                                display: true,
                                text: 'Usage Cost Breakdown',
                                font: {
                                    size: 16
                                }
                            },
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        const label = context.label || '';
                                        const value = context.raw || 0;
                                        const percentage = context.parsed || 0;
                                        return `${label} (${percentage.toFixed(1)}%)`;
                                    }
                                }
                            }
                        }
                    }
                });
            } catch (error) {
                console.error('Error creating usage chart:', error);
            }
        }

        function generateEnergySavingsTips(usage, country, state) {
            try {
                const savingsTips = document.getElementById('savingsTips');
                if (!savingsTips) return;

                // Clear existing tips
                savingsTips.innerHTML = '';

                // Basic tips that apply to all users
                const tips = [
                    'Consider using energy-efficient LED bulbs to reduce lighting costs.',
                    'Unplug electronic devices when not in use to prevent phantom power consumption.',
                    'Set your thermostat a few degrees higher in summer and lower in winter.',
                    'Use power strips to easily turn off multiple devices at once.',
                    'Regularly clean or replace air filters to maintain HVAC efficiency.'
                ];

                // Add country/state specific tips if available
                if (country && state) {
                    const countryData = stateData[country];
                    if (countryData && countryData.states) {
                        const stateInfo = countryData.states.find(s => s.code === state);
                        if (stateInfo && stateInfo.tips) {
                            tips.push(...stateInfo.tips);
                        }
                    }
                }

                // Create tips list
                const tipsList = document.createElement('ul');
                tipsList.className = 'list-unstyled';
                tips.forEach(tip => {
                    const li = document.createElement('li');
                    li.className = 'mb-2 savings-tip';
                    li.innerHTML = `<i class="fas fa-lightbulb text-warning me-2"></i>${tip}`;
                    tipsList.appendChild(li);
                });

                savingsTips.appendChild(tipsList);
            } catch (error) {
                console.error('Error generating energy savings tips:', error);
            }
        }

        // Add event listener for reset button
        if (resetBtn) {
            resetBtn.addEventListener('click', function() {
                try {
                    // Reset form
                    if (calculatorForm) {
                        calculatorForm.reset();
                    }

                    // Clear results
                    const resultsCard = document.getElementById('resultsCard');
                    if (resultsCard) {
                        resultsCard.style.display = 'none';
                    }

                    // Clear chart
                    if (chartInstance instanceof Chart) {
                        chartInstance.destroy();
                        chartInstance = null;
                    }

                    // Clear tips
                    const savingsTips = document.getElementById('savingsTips');
                    if (savingsTips) {
                        savingsTips.innerHTML = '';
                    }

                    // Disable buttons
                    if (downloadBtn) downloadBtn.disabled = true;
                    if (shareBtn) shareBtn.disabled = true;

                    // Reset state/province and utility provider dropdowns
                    const stateSelect = document.getElementById('stateSelect');
                    const utilityProvider = document.getElementById('utilityProvider');
                    if (stateSelect) {
                        stateSelect.innerHTML = '<option value="">Select a state/province</option>';
                        stateSelect.disabled = true;
                    }
                    if (utilityProvider) {
                        utilityProvider.innerHTML = '<option value="">Select a utility provider</option>';
                        utilityProvider.disabled = true;
                    }
                } catch (error) {
                    console.error('Error resetting calculator:', error);
                }
            });
        }

        // Add event listener for adding charges
        if (addChargeBtn) {
            addChargeBtn.addEventListener('click', function() {
                try {
                    const chargeTemplate = document.getElementById('chargeTemplate');
                    if (!chargeTemplate) {
                        console.error('Charge template not found');
                        return;
                    }

                    const chargesContainer = document.getElementById('chargesContainer');
                    if (!chargesContainer) {
                        console.error('Charges container not found');
                        return;
                    }

                    // Clone the template
                    const chargeItem = chargeTemplate.content.cloneNode(true);
                    
                    // Add remove button functionality
                    const removeBtn = chargeItem.querySelector('.remove-charge');
                    if (removeBtn) {
                        removeBtn.addEventListener('click', function() {
                            this.closest('.charge-item').remove();
                            calculateBill(); // Recalculate after removing a charge
                        });
                    }

                    // Add input change listener
                    const chargeAmount = chargeItem.querySelector('.charge-amount');
                    if (chargeAmount) {
                        chargeAmount.addEventListener('change', function() {
                            calculateBill(); // Recalculate when charge amount changes
                        });
                    }

                    chargesContainer.appendChild(chargeItem);
                } catch (error) {
                    console.error('Error adding charge:', error);
                }
            });
        }
    } catch (error) {
        console.error('Error initializing calculator:', error);
    }
}); 