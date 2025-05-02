document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const countrySelect = document.getElementById('country');
    const addressCountSelect = document.getElementById('addressCount');
    const generateBtn = document.getElementById('generateBtn');
    const resultsSection = document.getElementById('resultsSection');
    const addressesContainer = document.getElementById('addressesContainer');
    const copyBtn = document.getElementById('copyBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const clearBtn = document.getElementById('clearBtn');

    // Address Components Data
    const addressData = {
        US: {
            streets: ['Main', 'Oak', 'Maple', 'Cedar', 'Pine', 'Elm', 'Washington', 'Lake', 'Hill', 'Park'],
            streetTypes: ['Street', 'Avenue', 'Road', 'Boulevard', 'Lane', 'Drive', 'Way', 'Court', 'Circle', 'Place'],
            cities: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'],
            states: ['NY', 'CA', 'IL', 'TX', 'AZ', 'PA', 'FL', 'OH', 'GA', 'NC'],
            zipFormat: '#####'
        },
        UK: {
            streets: ['High', 'Church', 'Station', 'Victoria', 'Green', 'Manor', 'Kings', 'Queens', 'Mill', 'Castle'],
            streetTypes: ['Street', 'Road', 'Lane', 'Avenue', 'Way', 'Close', 'Drive', 'Place', 'Court', 'Terrace'],
            cities: ['London', 'Manchester', 'Birmingham', 'Liverpool', 'Leeds', 'Glasgow', 'Edinburgh', 'Bristol', 'Cardiff', 'Belfast'],
            counties: ['Greater London', 'West Midlands', 'Greater Manchester', 'West Yorkshire', 'Merseyside'],
            postcodeFormat: '## ### or ### ###'
        },
        CA: {
            streets: ['King', 'Queen', 'Main', 'Maple', 'Oak', 'Cedar', 'Pine', 'Elm', 'Victoria', 'Bay'],
            streetTypes: ['Street', 'Avenue', 'Road', 'Boulevard', 'Drive', 'Way', 'Trail', 'Crescent', 'Court', 'Lane'],
            cities: ['Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Edmonton', 'Ottawa', 'Winnipeg', 'Quebec City', 'Hamilton', 'Halifax'],
            provinces: ['ON', 'QC', 'BC', 'AB', 'MB', 'SK', 'NS', 'NB', 'NL', 'PE'],
            postalFormat: '#?# #?#'
        },
        AU: {
            streets: ['High', 'Station', 'Church', 'Victoria', 'George', 'King', 'Queen', 'William', 'Beach', 'River'],
            streetTypes: ['Street', 'Road', 'Avenue', 'Drive', 'Way', 'Lane', 'Circuit', 'Close', 'Court', 'Parade'],
            cities: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Gold Coast', 'Newcastle', 'Canberra', 'Wollongong', 'Logan City'],
            states: ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'],
            postcodeFormat: '####'
        }
    };

    // Helper Functions
    function getRandomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    function getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function generatePostalCode(format) {
        return format.replace(/#/g, () => getRandomNumber(0, 9))
                    .replace(/\?/g, () => String.fromCharCode(65 + getRandomNumber(0, 25)));
    }

    function generateAddress(country) {
        const data = addressData[country];
        const streetNumber = getRandomNumber(1, 9999);
        const street = getRandomElement(data.streets);
        const streetType = getRandomElement(data.streetTypes);

        let address = {
            streetLine: `${streetNumber} ${street} ${streetType}`,
            city: getRandomElement(data.cities)
        };

        switch(country) {
            case 'US':
                address.state = getRandomElement(data.states);
                address.postalCode = generatePostalCode(data.zipFormat);
                address.formatted = `${address.streetLine}, ${address.city}, ${address.state} ${address.postalCode}`;
                break;
            case 'UK':
                address.county = getRandomElement(data.counties);
                address.postalCode = generatePostalCode(data.postcodeFormat);
                address.formatted = `${address.streetLine}, ${address.city}, ${address.county}, ${address.postalCode}`;
                break;
            case 'CA':
                address.province = getRandomElement(data.provinces);
                address.postalCode = generatePostalCode(data.postalFormat);
                address.formatted = `${address.streetLine}, ${address.city}, ${address.province} ${address.postalCode}`;
                break;
            case 'AU':
                address.state = getRandomElement(data.states);
                address.postalCode = generatePostalCode(data.postcodeFormat);
                address.formatted = `${address.streetLine}, ${address.city}, ${address.state} ${address.postalCode}`;
                break;
        }

        return address;
    }

    function displayAddresses(addresses) {
        addressesContainer.innerHTML = addresses.map(address => `
            <div class="card mb-2">
                <div class="card-body">
                    <p class="mb-0">${address.formatted}</p>
                </div>
            </div>
        `).join('');
    }

    function generateCSV(addresses) {
        const headers = ['Street Address', 'City', 'State/Province', 'Postal Code'];
        const rows = addresses.map(addr => [
            addr.streetLine,
            addr.city,
            addr.state || addr.province || addr.county,
            addr.postalCode
        ]);
        
        return [headers, ...rows]
            .map(row => row.map(cell => `"${cell}"`).join(','))
            .join('\n');
    }

    // Event Listeners
    generateBtn.addEventListener('click', function() {
        const country = countrySelect.value;
        const count = parseInt(addressCountSelect.value);
        const addresses = Array.from({ length: count }, () => generateAddress(country));
        
        displayAddresses(addresses);
        resultsSection.style.display = 'block';
        
        // Store addresses for copy and download
        resultsSection.dataset.addresses = JSON.stringify(addresses);
    });

    copyBtn.addEventListener('click', function() {
        const addresses = JSON.parse(resultsSection.dataset.addresses);
        const text = addresses.map(addr => addr.formatted).join('\n');
        
        navigator.clipboard.writeText(text).then(() => {
            alert('Addresses copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy addresses:', err);
            alert('Failed to copy addresses. Please try again.');
        });
    });

    downloadBtn.addEventListener('click', function() {
        const addresses = JSON.parse(resultsSection.dataset.addresses);
        const csv = generateCSV(addresses);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', 'generated_addresses.csv');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });

    clearBtn.addEventListener('click', function() {
        addressesContainer.innerHTML = '';
        resultsSection.style.display = 'none';
        delete resultsSection.dataset.addresses;
    });
}); 