document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('sitemapValidatorForm');
    const resultCard = document.getElementById('resultCard');
    const sitemapUrl = document.getElementById('sitemapUrl');
    const validationType = document.getElementById('validationType');
    const clearButton = document.getElementById('clearButton');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const validationResults = document.getElementById('validationResults');
    const validationStatus = document.getElementById('validationStatus');
    const sitemapStats = document.getElementById('sitemapStats');
    const urlAnalysis = document.getElementById('urlAnalysis');
    const issuesFound = document.getElementById('issuesFound');
    const recommendations = document.getElementById('recommendations');

    // Check if all required elements exist
    if (!form || !resultCard || !sitemapUrl || !validationType || !clearButton || !loadingSpinner || 
        !validationResults || !validationStatus || !sitemapStats || !urlAnalysis || 
        !issuesFound || !recommendations) {
        console.error('Required elements not found. Please check the HTML structure.');
        return;
    }

    // Function to validate URL
    function isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch (e) {
            return false;
        }
    }

    // Function to format URL
    function formatUrl(url) {
        if (!url.startsWith('http')) {
            return 'https://' + url;
        }
        return url;
    }

    // Function to validate sitemap
    async function validateSitemap(url, type) {
        try {
            // Simulate API call with timeout
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Mock data for demonstration
            return {
                status: 'valid',
                stats: {
                    totalUrls: 150,
                    validUrls: 145,
                    invalidUrls: 5,
                    lastModified: '2024-03-15',
                    sitemapSize: '2.5 MB'
                },
                urlAnalysis: {
                    averagePriority: 0.8,
                    averageChangeFreq: 'weekly',
                    urlTypes: {
                        pages: 120,
                        posts: 25,
                        categories: 5
                    }
                },
                issues: [
                    {
                        type: 'error',
                        message: 'Invalid URL format in 2 URLs',
                        urls: ['https://example.com/page1', 'https://example.com/page2']
                    },
                    {
                        type: 'warning',
                        message: 'Low priority URLs detected',
                        urls: ['https://example.com/page3', 'https://example.com/page4']
                    }
                ],
                recommendations: [
                    'Fix invalid URL formats',
                    'Update low priority URLs',
                    'Add missing lastmod dates',
                    'Optimize sitemap size',
                    'Include image sitemap'
                ]
            };
        } catch (error) {
            console.error('Error validating sitemap:', error);
            throw error;
        }
    }

    // Function to display results
    function displayResults(data) {
        // Clear previous results
        validationStatus.innerHTML = '';
        sitemapStats.innerHTML = '';
        urlAnalysis.innerHTML = '';
        issuesFound.innerHTML = '';
        recommendations.innerHTML = '';

        // Display Validation Status
        const statusIcon = data.status === 'valid' ? 
            '<i class="fas fa-check-circle text-success me-2"></i>' : 
            '<i class="fas fa-times-circle text-danger me-2"></i>';
        validationStatus.innerHTML = `${statusIcon}${data.status.toUpperCase()}`;

        // Display Sitemap Statistics
        const statsList = document.createElement('ul');
        statsList.className = 'list-unstyled';
        for (const [key, value] of Object.entries(data.stats)) {
            const li = document.createElement('li');
            li.className = 'mb-2';
            li.innerHTML = `<strong>${key.replace(/([A-Z])/g, ' $1').trim()}:</strong> ${value}`;
            statsList.appendChild(li);
        }
        sitemapStats.appendChild(statsList);

        // Display URL Analysis
        const analysisList = document.createElement('ul');
        analysisList.className = 'list-unstyled';
        for (const [key, value] of Object.entries(data.urlAnalysis)) {
            const li = document.createElement('li');
            li.className = 'mb-2';
            if (key === 'urlTypes') {
                li.innerHTML = `<strong>URL Types:</strong>`;
                const typesList = document.createElement('ul');
                typesList.className = 'list-unstyled ms-3';
                for (const [type, count] of Object.entries(value)) {
                    const typeLi = document.createElement('li');
                    typeLi.innerHTML = `${type}: ${count}`;
                    typesList.appendChild(typeLi);
                }
                li.appendChild(typesList);
            } else {
                li.innerHTML = `<strong>${key.replace(/([A-Z])/g, ' $1').trim()}:</strong> ${value}`;
            }
            analysisList.appendChild(li);
        }
        urlAnalysis.appendChild(analysisList);

        // Display Issues Found
        const issuesList = document.createElement('ul');
        issuesList.className = 'list-unstyled';
        data.issues.forEach(issue => {
            const li = document.createElement('li');
            li.className = 'mb-3';
            const icon = issue.type === 'error' ? 
                'fa-exclamation-circle text-danger' : 
                'fa-exclamation-triangle text-warning';
            li.innerHTML = `
                <div><i class="fas ${icon} me-2"></i>${issue.message}</div>
                <ul class="list-unstyled ms-4 mt-2">
                    ${issue.urls.map(url => `<li><i class="fas fa-link text-muted me-2"></i>${url}</li>`).join('')}
                </ul>
            `;
            issuesList.appendChild(li);
        });
        issuesFound.appendChild(issuesList);

        // Display Recommendations
        const recommendationsList = document.createElement('ul');
        recommendationsList.className = 'list-unstyled';
        data.recommendations.forEach(rec => {
            const li = document.createElement('li');
            li.className = 'mb-2';
            li.innerHTML = `<i class="fas fa-lightbulb text-warning me-2"></i>${rec}`;
            recommendationsList.appendChild(li);
        });
        recommendations.appendChild(recommendationsList);
    }

    // Form submission handler
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const url = formatUrl(sitemapUrl.value.trim());
        if (!isValidUrl(url)) {
            alert('Please enter a valid sitemap URL');
            return;
        }

        // Show loading spinner and hide results
        loadingSpinner.style.display = 'block';
        validationResults.style.display = 'none';
        resultCard.style.display = 'block';

        try {
            const data = await validateSitemap(url, validationType.value);

            // Hide loading spinner and show results
            loadingSpinner.style.display = 'none';
            validationResults.style.display = 'block';
            displayResults(data);
        } catch (error) {
            loadingSpinner.style.display = 'none';
            alert('An error occurred while validating the sitemap. Please try again.');
        }
    });

    // Clear button handler
    clearButton.addEventListener('click', function() {
        form.reset();
        resultCard.style.display = 'none';
    });

    // URL validation
    sitemapUrl.addEventListener('input', function() {
        this.value = formatUrl(this.value.trim());
    });
}); 