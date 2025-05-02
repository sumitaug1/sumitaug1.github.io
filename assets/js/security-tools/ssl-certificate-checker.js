document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const domain = document.getElementById('domain');
    const checkBtn = document.getElementById('checkBtn');
    const resultsCard = document.getElementById('resultsCard');
    const statusAlert = document.getElementById('statusAlert');
    const statusText = document.getElementById('statusText');

    // Format date
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString();
    }

    // Update status alert
    function updateStatusAlert(status, message) {
        statusAlert.className = 'alert mb-4';
        statusAlert.classList.add(`alert-${status}`);
        statusText.textContent = message;
    }

    // Check SSL certificate
    async function checkCertificate() {
        const domainValue = domain.value.trim();

        if (!domainValue) {
            alert('Please enter a domain');
            return;
        }

        // Show loading state
        updateStatusAlert('info', 'Checking certificate...');
        resultsCard.classList.remove('d-none');

        try {
            const response = await fetch(`https://api.certspotter.com/v1/issuances?domain=${domainValue}&include_subdomains=true&expand=dns_names&expand=issuer`);
            const data = await response.json();

            if (data && data.length > 0) {
                const cert = data[0];
                const now = new Date();
                const validFrom = new Date(cert.valid_from);
                const validUntil = new Date(cert.valid_until);

                // Update certificate details
                document.getElementById('commonName').textContent = cert.dns_names[0] || 'N/A';
                document.getElementById('issuer').textContent = cert.issuer.name || 'N/A';
                document.getElementById('validFrom').textContent = formatDate(cert.valid_from);
                document.getElementById('validUntil').textContent = formatDate(cert.valid_until);
                document.getElementById('serialNumber').textContent = cert.serial_number || 'N/A';

                // Update additional information
                document.getElementById('protocol').textContent = 'TLS';
                document.getElementById('cipher').textContent = 'N/A';
                document.getElementById('keySize').textContent = cert.key_size || 'N/A';
                document.getElementById('signatureAlgorithm').textContent = cert.signature_algorithm || 'N/A';

                // Update certificate chain
                document.getElementById('chainText').textContent = cert.chain || 'N/A';

                // Update status
                if (now < validFrom) {
                    updateStatusAlert('warning', 'Certificate is not yet valid');
                } else if (now > validUntil) {
                    updateStatusAlert('danger', 'Certificate has expired');
                } else {
                    updateStatusAlert('success', 'Certificate is valid');
                }
            } else {
                updateStatusAlert('danger', 'No SSL certificate found');
            }
        } catch (error) {
            console.error('Error checking certificate:', error);
            updateStatusAlert('danger', 'Error checking certificate');
        }
    }

    // Check button click handler
    checkBtn.addEventListener('click', checkCertificate);

    // Form submission handler
    document.getElementById('sslCheckerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        checkCertificate();
    });
}); 