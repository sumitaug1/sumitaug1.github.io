document.addEventListener('DOMContentLoaded', function() {
    const ipInput = document.getElementById('ipInput');
    const trackBtn = document.getElementById('trackBtn');
    const loading = document.getElementById('loading');
    const ipDetails = document.getElementById('ipDetails');
    const errorMessage = document.getElementById('errorMessage');

    // Function to validate IP address
    function isValidIP(ip) {
        const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
        const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
        return ipv4Regex.test(ip) || ipv6Regex.test(ip);
    }

    // Function to fetch IP details
    async function fetchIPDetails(ip) {
        try {
            const response = await fetch(`https://ipapi.co/${ip}/json/`);
            if (!response.ok) {
                throw new Error('Failed to fetch IP details');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            throw new Error('Error fetching IP details: ' + error.message);
        }
    }

    // Function to update UI with IP details
    function updateIPDetails(data) {
        document.getElementById('ipAddress').textContent = data.ip || '-';
        document.getElementById('location').textContent = `${data.city || '-'}, ${data.country_name || '-'}`;
        document.getElementById('isp').textContent = data.org || '-';
        document.getElementById('timezone').textContent = data.timezone || '-';
        document.getElementById('latitude').textContent = data.latitude || '-';
        document.getElementById('longitude').textContent = data.longitude || '-';
    }

    // Event listener for track button
    trackBtn.addEventListener('click', async function() {
        const ip = ipInput.value.trim();
        
        if (!ip) {
            errorMessage.textContent = 'Please enter an IP address';
            errorMessage.style.display = 'block';
            return;
        }

        if (!isValidIP(ip)) {
            errorMessage.textContent = 'Please enter a valid IP address';
            errorMessage.style.display = 'block';
            return;
        }

        errorMessage.style.display = 'none';
        loading.style.display = 'block';
        ipDetails.style.display = 'none';

        try {
            const data = await fetchIPDetails(ip);
            updateIPDetails(data);
            ipDetails.style.display = 'grid';
        } catch (error) {
            errorMessage.textContent = error.message;
            errorMessage.style.display = 'block';
        } finally {
            loading.style.display = 'none';
        }
    });

    // Event listener for Enter key
    ipInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            trackBtn.click();
        }
    });
}); 