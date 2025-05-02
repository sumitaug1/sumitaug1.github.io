document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('ipLookupForm');
    const ipAddress = document.getElementById('ipAddress');
    const lookupButton = document.getElementById('lookupButton');
    const autoLookup = document.getElementById('autoLookup');
    const resultCard = document.getElementById('resultCard');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const lookupResults = document.getElementById('lookupResults');
    const map = document.getElementById('map');
    let mapInstance = null;

    // Check if all required elements exist
    if (!form || !ipAddress || !lookupButton || !autoLookup || !resultCard || 
        !loadingSpinner || !lookupResults || !map) {
        console.error('Required elements not found. Please check the HTML structure.');
        return;
    }

    // Function to validate IP address
    function isValidIP(ip) {
        // IPv4 validation
        const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
        // IPv6 validation (simplified)
        const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
        
        if (ipv4Regex.test(ip)) {
            const parts = ip.split('.');
            return parts.every(part => parseInt(part) >= 0 && parseInt(part) <= 255);
        }
        return ipv6Regex.test(ip);
    }

    // Function to initialize map
    function initMap(lat, lng) {
        if (mapInstance) {
            mapInstance.remove();
        }
        
        mapInstance = L.map(map).setView([lat, lng], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(mapInstance);
        
        L.marker([lat, lng]).addTo(mapInstance)
            .bindPopup('IP Location')
            .openPopup();
    }

    // Function to update result fields
    function updateResults(data) {
        // Basic Information
        document.getElementById('ipAddressResult').textContent = data.ip;
        document.getElementById('ipType').textContent = data.type;
        document.getElementById('hostname').textContent = data.hostname || 'N/A';

        // Location
        document.getElementById('country').textContent = data.country || 'N/A';
        document.getElementById('region').textContent = data.region || 'N/A';
        document.getElementById('city').textContent = data.city || 'N/A';
        document.getElementById('coordinates').textContent = 
            data.latitude && data.longitude ? `${data.latitude}, ${data.longitude}` : 'N/A';

        // Network Information
        document.getElementById('isp').textContent = data.isp || 'N/A';
        document.getElementById('organization').textContent = data.organization || 'N/A';
        document.getElementById('asn').textContent = data.asn || 'N/A';

        // Additional Information
        document.getElementById('timezone').textContent = data.timezone || 'N/A';
        document.getElementById('postalCode').textContent = data.postalCode || 'N/A';
        document.getElementById('continent').textContent = data.continent || 'N/A';

        // Update map if coordinates are available
        if (data.latitude && data.longitude) {
            initMap(data.latitude, data.longitude);
        }
    }

    // Function to perform IP lookup
    async function lookupIP(ip) {
        if (!isValidIP(ip)) {
            alert('Please enter a valid IP address');
            return;
        }

        // Show loading spinner and hide results
        loadingSpinner.style.display = 'block';
        lookupResults.style.display = 'none';
        resultCard.style.display = 'block';

        try {
            // Using ipapi.co for IP lookup (free tier)
            const response = await fetch(`https://ipapi.co/${ip}/json/`);
            const data = await response.json();

            if (data.error) {
                throw new Error(data.reason || 'Failed to lookup IP address');
            }

            // Hide loading spinner and show results
            loadingSpinner.style.display = 'none';
            lookupResults.style.display = 'block';
            updateResults(data);
        } catch (error) {
            loadingSpinner.style.display = 'none';
            alert(error.message);
        }
    }

    // Function to get user's IP address
    async function getMyIP() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            ipAddress.value = data.ip;
            lookupIP(data.ip);
        } catch (error) {
            console.error('Failed to get IP address:', error);
        }
    }

    // Lookup button handler
    lookupButton.addEventListener('click', function() {
        const ip = ipAddress.value.trim();
        if (ip) {
            lookupIP(ip);
        }
    });

    // Form submission handler
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const ip = ipAddress.value.trim();
        if (ip) {
            lookupIP(ip);
        }
    });

    // Auto-lookup handler
    autoLookup.addEventListener('change', function() {
        if (this.checked) {
            getMyIP();
        }
    });

    // Initialize with user's IP if auto-lookup is enabled
    if (autoLookup.checked) {
        getMyIP();
    }
}); 