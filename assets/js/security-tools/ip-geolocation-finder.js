document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const ipAddress = document.getElementById('ipAddress');
    const myIpBtn = document.getElementById('myIpBtn');
    const lookupBtn = document.getElementById('lookupBtn');
    const clearBtn = document.getElementById('clearBtn');
    const resultsCard = document.getElementById('resultsCard');
    const map = document.getElementById('map');

    // Initialize map
    let leafletMap = null;
    let marker = null;

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
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch (error) {
            console.error('Error getting current IP:', error);
            return null;
        }
    }

    // Get geolocation data
    async function getGeolocationData(ip) {
        try {
            const response = await fetch(`http://ip-api.com/json/${ip}`);
            const data = await response.json();
            
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

    // Initialize map
    function initMap() {
        if (leafletMap) {
            leafletMap.remove();
        }

        // Create map instance
        leafletMap = L.map('map', {
            center: [0, 0],
            zoom: 2,
            zoomControl: true,
            attributionControl: true
        });

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(leafletMap);

        // Add zoom control
        L.control.zoom({
            position: 'bottomright'
        }).addTo(leafletMap);
    }

    // Update map
    function updateMap(latitude, longitude) {
        if (!leafletMap) {
            initMap();
        }

        // Set view to new coordinates
        leafletMap.setView([latitude, longitude], 13);

        // Remove existing marker if any
        if (marker) {
            leafletMap.removeLayer(marker);
        }

        // Add new marker
        marker = L.marker([latitude, longitude]).addTo(leafletMap);

        // Add popup to marker
        marker.bindPopup(`Location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`).openPopup();

        // Trigger resize to ensure proper rendering
        setTimeout(() => {
            leafletMap.invalidateSize();
        }, 100);
    }

    // Update results
    function updateResults(data) {
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

        // Update map
        if (data.latitude && data.longitude) {
            updateMap(data.latitude, data.longitude);
        }

        // Show results card
        resultsCard.classList.remove('d-none');
    }

    // Lookup IP
    async function lookupIp() {
        const ip = ipAddress.value.trim();

        if (!ip) {
            alert('Please enter an IP address');
            return;
        }

        if (!isValidIpAddress(ip)) {
            alert('Please enter a valid IP address');
            return;
        }

        const data = await getGeolocationData(ip);
        if (data) {
            updateResults(data);
        } else {
            alert('Error getting geolocation data');
        }
    }

    // My IP button click handler
    myIpBtn.addEventListener('click', async function() {
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
        ipAddress.value = '';
        resultsCard.classList.add('d-none');
        if (leafletMap) {
            leafletMap.remove();
            leafletMap = null;
        }
    });

    // Form submission handler
    document.getElementById('ipGeolocationForm').addEventListener('submit', function(e) {
        e.preventDefault();
        lookupIp();
    });

    // Initialize map on page load
    initMap();
}); 