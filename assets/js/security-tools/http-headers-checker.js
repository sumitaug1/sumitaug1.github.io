document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const url = document.getElementById('url');
    const checkBtn = document.getElementById('checkBtn');
    const resultsCard = document.getElementById('resultsCard');
    const statusAlert = document.getElementById('statusAlert');
    const statusText = document.getElementById('statusText');
    const headersTableBody = document.getElementById('headersTableBody');
    const securityList = document.getElementById('securityList');

    // Update status alert
    function updateStatusAlert(status, message) {
        statusAlert.className = 'alert mb-4';
        statusAlert.classList.add(`alert-${status}`);
        statusText.textContent = message;
    }

    // Analyze security headers
    function analyzeSecurityHeaders(headers) {
        const securityChecks = [
            {
                name: 'Content-Security-Policy',
                description: 'Content Security Policy',
                icon: 'shield-alt',
                color: 'success'
            },
            {
                name: 'X-Frame-Options',
                description: 'Clickjacking Protection',
                icon: 'shield-alt',
                color: 'success'
            },
            {
                name: 'X-Content-Type-Options',
                description: 'MIME Type Protection',
                icon: 'shield-alt',
                color: 'success'
            },
            {
                name: 'Strict-Transport-Security',
                description: 'HSTS (HTTP Strict Transport Security)',
                icon: 'shield-alt',
                color: 'success'
            },
            {
                name: 'X-XSS-Protection',
                description: 'XSS Protection',
                icon: 'shield-alt',
                color: 'success'
            }
        ];

        securityList.innerHTML = '';
        securityChecks.forEach(check => {
            const header = headers[check.name.toLowerCase()];
            const status = header ? 'success' : 'danger';
            const icon = header ? 'check-circle' : 'times-circle';
            
            const li = document.createElement('li');
            li.className = 'mb-2';
            li.innerHTML = `
                <i class="fas fa-${check.icon} text-${check.color} me-2"></i>
                <strong>${check.description}:</strong>
                <span class="text-${status}">
                    <i class="fas fa-${icon} me-1"></i>
                    ${header || 'Not Set'}
                </span>
            `;
            securityList.appendChild(li);
        });
    }

    // Check headers
    async function checkHeaders() {
        const urlValue = url.value.trim();

        if (!urlValue) {
            alert('Please enter a URL');
            return;
        }

        // Show loading state
        updateStatusAlert('info', 'Checking headers...');
        resultsCard.classList.remove('d-none');
        headersTableBody.innerHTML = '';
        securityList.innerHTML = '';

        try {
            // Use a CORS proxy service
            const proxyUrl = 'https://api.allorigins.win/raw?url=';
            const response = await fetch(proxyUrl + encodeURIComponent(urlValue), {
                method: 'HEAD'
            });

            if (response.ok) {
                // Get all headers
                const headers = {};
                response.headers.forEach((value, key) => {
                    headers[key.toLowerCase()] = value;
                });

                // Display headers in table
                headersTableBody.innerHTML = '';
                Object.entries(headers).forEach(([key, value]) => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td><strong>${key}</strong></td>
                        <td>${value}</td>
                    `;
                    headersTableBody.appendChild(row);
                });

                // Analyze security headers
                analyzeSecurityHeaders(headers);

                // Update status
                updateStatusAlert('success', 'Headers retrieved successfully');
            } else {
                updateStatusAlert('warning', 'Could not retrieve headers. The website might be blocking our request.');
            }
        } catch (error) {
            console.error('Error checking headers:', error);
            updateStatusAlert('danger', 'Error checking headers. Please make sure the URL is valid and accessible.');
        }
    }

    // Check button click handler
    checkBtn.addEventListener('click', checkHeaders);

    // Form submission handler
    document.getElementById('headersCheckForm').addEventListener('submit', function(e) {
        e.preventDefault();
        checkHeaders();
    });
}); 