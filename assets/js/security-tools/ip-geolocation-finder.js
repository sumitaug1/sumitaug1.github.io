document.addEventListener('DOMContentLoaded', function() {
    console.log('IP Geolocation Finder starting...');
    
    // Get DOM elements
    const ipAddress = document.getElementById('ipAddress');
    const myIpBtn = document.getElementById('myIpBtn');
    const lookupBtn = document.getElementById('lookupBtn');
    const clearBtn = document.getElementById('clearBtn');
    const resultsCard = document.getElementById('resultsCard');

    console.log('DOM elements found:', {
        ipAddress: !!ipAddress,
        myIpBtn: !!myIpBtn,
        lookupBtn: !!lookupBtn,
        clearBtn: !!clearBtn,
        resultsCard: !!resultsCard
    });

    // Validate IP address
    function isValidIpAddress(ip) {
        // IPv4 validation
        const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
        // IPv6 validation
        const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
        
        if (ipv4Regex.test(ip)) {
            const parts = ip.split('.');
            return parts.every(part => parseInt(part) >= 0 && parseInt(part) <= 255);
        }
        return ipv6Regex.test(ip);
    }

    // Get current IP address
    async function getCurrentIp() {
        try {
            console.log('Fetching current IP...');
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            console.log('Current IP:', data.ip);
            return data.ip;
        } catch (error) {
            console.error('Error getting current IP:', error);
            return null;
        }
    }

    // Get geolocation data
    async function getGeolocationData(ip) {
        try {
            console.log('Fetching geolocation data for:', ip);
            const response = await fetch(`https://ip-api.com/json/${ip}`);
            const data = await response.json();
            console.log('Geolocation response:', data);
            
            if (data.status === 'success') {
                return {
                    country_name: data.country,
                    region: data.regionName,
                    city: data.city,
                    postal: data.zip,
                    timezone: data.timezone,
                    latitude: data.lat,
                    longitude: data.lon,
                    org: data.isp,
                    asn: data.as,
                    hostname: data.query
                };
            } else {
                throw new Error(data.message || 'Failed to get geolocation data');
            }
        } catch (error) {
            console.error('Error getting geolocation data:', error);
            return null;
        }
    }

    // Update results (without map)
    function updateResults(data) {
        console.log('Updating results with data:', data);
        
        // Update location details
        document.getElementById('country').textContent = data.country_name || 'N/A';
        document.getElementById('region').textContent = data.region || 'N/A';
        document.getElementById('city').textContent = data.city || 'N/A';
        document.getElementById('postal').textContent = data.postal || 'N/A';
        document.getElementById('timezone').textContent = data.timezone || 'N/A';

        // Update network information
        document.getElementById('isp').textContent = data.org || 'N/A';
        document.getElementById('org').textContent = data.org || 'N/A';
        document.getElementById('asn').textContent = data.asn || 'N/A';
        document.getElementById('hostname').textContent = data.hostname || 'N/A';

        // Show results card
        resultsCard.classList.remove('d-none');
        
        // Hide map section temporarily
        const mapSection = document.querySelector('#map').closest('.mt-4');
        if (mapSection) {
            mapSection.style.display = 'none';
        }
        
        console.log('Results updated successfully');
    }

    // Lookup IP
    async function lookupIp() {
        console.log('Starting IP lookup...');
        
        const ip = ipAddress.value.trim();

        if (!ip) {
            alert('Please enter an IP address');
            return;
        }

        if (!isValidIpAddress(ip)) {
            alert('Please enter a valid IP address');
            return;
        }

        console.log('Looking up IP:', ip);
        const data = await getGeolocationData(ip);
        if (data) {
            updateResults(data);
        } else {
            alert('Error getting geolocation data');
        }
    }

    // My IP button click handler
    myIpBtn.addEventListener('click', async function() {
        console.log('My IP button clicked');
        const currentIp = await getCurrentIp();
        if (currentIp) {
            ipAddress.value = currentIp;
            lookupIp();
        } else {
            alert('Error getting current IP address');
        }
    });

    // Lookup button click handler
    lookupBtn.addEventListener('click', lookupIp);

    // Clear button click handler
    clearBtn.addEventListener('click', function() {
        console.log('Clear button clicked');
        ipAddress.value = '';
        resultsCard.classList.add('d-none');
        
        // Show map section again
        const mapSection = document.querySelector('#map').closest('.mt-4');
        if (mapSection) {
            mapSection.style.display = 'block';
        }
    });

    // Form submission handler
    document.getElementById('ipGeolocationForm').addEventListener('submit', function(e) {
        e.preventDefault();
        lookupIp();
    });

    console.log('IP Geolocation Finder initialized successfully');
}); 