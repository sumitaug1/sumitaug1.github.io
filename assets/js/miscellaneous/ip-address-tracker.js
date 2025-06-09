document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const ipInput = document.getElementById('ipInput');
    const trackBtn = document.getElementById('trackBtn');
    const errorMessage = document.getElementById('errorMessage');
    const loading = document.getElementById('loading');
    const ipDetails = document.getElementById('ipDetails');
    const ipAddress = document.getElementById('ipAddress');
    const location = document.getElementById('location');
    const isp = document.getElementById('isp');
    const timezone = document.getElementById('timezone');
    const latitude = document.getElementById('latitude');
    const longitude = document.getElementById('longitude');

    // Initialize map
    let map = L.map('map').setView([0, 0], 2);
    let marker = null;

    // Add tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Function to validate IP address
    function isValidIP(ip) {
        const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
        const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
        return ipv4Regex.test(ip) || ipv6Regex.test(ip);
    }

    // Function to show error message
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 3000);
    }

    // Function to update map marker
    function updateMapMarker(lat, lng, locationName) {
        if (marker) {
            map.removeLayer(marker);
        }
        marker = L.marker([lat, lng]).addTo(map);
        marker.bindPopup(locationName).openPopup();
        map.setView([lat, lng], 13);
    }

    // Function to fetch IP details
    async function fetchIPDetails(ip) {
        try {
            loading.style.display = 'block';
            ipDetails.style.display = 'none';
            errorMessage.style.display = 'none';

            const response = await fetch(`https://ipapi.co/${ip}/json/`);
            const data = await response.json();

            if (data.error) {
                throw new Error(data.reason || 'Failed to fetch IP details');
            }

            // Update IP details
            ipAddress.textContent = data.ip;
            location.textContent = `${data.city}, ${data.region}, ${data.country_name}`;
            isp.textContent = data.org || 'Unknown';
            timezone.textContent = data.timezone;
            latitude.textContent = data.latitude;
            longitude.textContent = data.longitude;

            // Update map
            updateMapMarker(data.latitude, data.longitude, `${data.city}, ${data.country_name}`);

            // Show details
            ipDetails.style.display = 'block';
        } catch (error) {
            showError(error.message || 'Failed to fetch IP details');
        } finally {
            loading.style.display = 'none';
        }
    }

    // Event Listeners
    trackBtn.addEventListener('click', () => {
        const ip = ipInput.value.trim();
        if (!ip) {
            showError('Please enter an IP address');
            return;
        }
        if (!isValidIP(ip)) {
            showError('Please enter a valid IP address');
            return;
        }
        fetchIPDetails(ip);
    });

    ipInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            trackBtn.click();
        }
    });

    // Fetch user's own IP on page load
    fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
            ipInput.value = data.ip;
            fetchIPDetails(data.ip);
        })
        .catch(error => {
            console.error('Failed to fetch user IP:', error);
            showError('Failed to fetch your IP address');
        });
}); 