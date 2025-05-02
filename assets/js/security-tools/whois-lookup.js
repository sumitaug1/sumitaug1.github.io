document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const domain = document.getElementById('domain');
    const lookupBtn = document.getElementById('lookupBtn');
    const resultsCard = document.getElementById('resultsCard');
    const statusAlert = document.getElementById('statusAlert');
    const statusText = document.getElementById('statusText');

    // Format date
    function formatDate(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleString();
    }

    // Update status alert
    function updateStatusAlert(status, message) {
        statusAlert.className = 'alert mb-4';
        statusAlert.classList.add(`alert-${status}`);
        statusText.textContent = message;
    }

    // Format name servers
    function formatNameServers(nameServers) {
        if (!nameServers || !nameServers.length) return 'N/A';
        return nameServers.join(', ');
    }

    // Lookup domain
    async function lookupDomain() {
        const domainValue = domain.value.trim();

        if (!domainValue) {
            alert('Please enter a domain');
            return;
        }

        // Show work in progress message
        resultsCard.classList.remove('d-none');
        statusAlert.className = 'alert alert-info mb-4';
        statusText.innerHTML = '<i class="fas fa-tools me-2"></i>This feature is currently under maintenance. Please check back later.';
    }

    // Lookup button click handler
    lookupBtn.addEventListener('click', lookupDomain);

    // Form submission handler
    document.getElementById('whoisLookupForm').addEventListener('submit', function(e) {
        e.preventDefault();
        lookupDomain();
    });
}); 