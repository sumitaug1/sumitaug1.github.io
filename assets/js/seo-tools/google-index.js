document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('indexCheckForm');
    const resultCard = document.getElementById('resultCard');
    const websiteUrl = document.getElementById('websiteUrl');
    const checkType = document.getElementById('checkType');
    const specificUrlContainer = document.getElementById('specificUrlContainer');
    const specificUrl = document.getElementById('specificUrl');
    const clearButton = document.getElementById('clearButton');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const indexResults = document.getElementById('indexResults');
    const indexStatus = document.getElementById('indexStatus');
    const indexedPages = document.getElementById('indexedPages');
    const recommendations = document.getElementById('recommendations');

    // Check if all required elements exist
    if (!form || !resultCard || !websiteUrl || !checkType || !specificUrlContainer || 
        !specificUrl || !clearButton || !loadingSpinner || !indexResults || 
        !indexStatus || !indexedPages || !recommendations) {
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

    // Function to check site indexing
    async function checkSiteIndexing(url) {
        try {
            // Simulate API call with timeout
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Mock data for demonstration
            return {
                isIndexed: true,
                indexedPages: 150,
                lastCrawled: '2024-03-15',
                recommendations: [
                    'Submit your sitemap to Google Search Console',
                    'Ensure your robots.txt allows crawling',
                    'Check for any manual actions in Search Console',
                    'Monitor crawl stats in Search Console'
                ]
            };
        } catch (error) {
            console.error('Error checking site indexing:', error);
            throw error;
        }
    }

    // Function to check specific URL indexing
    async function checkUrlIndexing(url) {
        try {
            // Simulate API call with timeout
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Mock data for demonstration
            return {
                isIndexed: true,
                lastCrawled: '2024-03-15',
                recommendations: [
                    'Ensure the page is accessible to search engines',
                    'Check for any noindex meta tags',
                    'Verify the page is linked from other indexed pages',
                    'Submit the URL directly to Google Search Console'
                ]
            };
        } catch (error) {
            console.error('Error checking URL indexing:', error);
            throw error;
        }
    }

    // Function to display results
    function displayResults(data, isSiteCheck) {
        // Clear previous results
        indexStatus.innerHTML = '';
        indexedPages.innerHTML = '';
        recommendations.innerHTML = '';

        // Display indexing status
        const statusIcon = data.isIndexed ? 
            '<i class="fas fa-check-circle text-success me-2"></i>' : 
            '<i class="fas fa-times-circle text-danger me-2"></i>';
        const statusText = data.isIndexed ? 'Indexed' : 'Not Indexed';
        indexStatus.innerHTML = `${statusIcon}${statusText}`;

        // Display indexed pages count for site check
        if (isSiteCheck) {
            indexedPages.innerHTML = `
                <p class="mb-1">Total Indexed Pages: ${data.indexedPages}</p>
                <p class="mb-1">Last Crawled: ${data.lastCrawled}</p>
            `;
        } else {
            indexedPages.innerHTML = `
                <p class="mb-1">Last Crawled: ${data.lastCrawled}</p>
            `;
        }

        // Display recommendations
        const recommendationsList = document.createElement('ul');
        recommendationsList.className = 'list-unstyled';
        data.recommendations.forEach(rec => {
            const li = document.createElement('li');
            li.className = 'mb-2';
            li.innerHTML = `<i class="fas fa-arrow-right text-primary me-2"></i>${rec}`;
            recommendationsList.appendChild(li);
        });
        recommendations.appendChild(recommendationsList);
    }

    // Check type change handler
    checkType.addEventListener('change', function() {
        specificUrlContainer.style.display = this.value === 'url' ? 'block' : 'none';
        if (this.value === 'url') {
            specificUrl.required = true;
        } else {
            specificUrl.required = false;
        }
    });

    // Form submission handler
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const baseUrl = formatUrl(websiteUrl.value.trim());
        if (!isValidUrl(baseUrl)) {
            alert('Please enter a valid website URL');
            return;
        }

        if (checkType.value === 'url') {
            const url = formatUrl(specificUrl.value.trim());
            if (!isValidUrl(url)) {
                alert('Please enter a valid URL to check');
                return;
            }
        }

        // Show loading spinner and hide results
        loadingSpinner.style.display = 'block';
        indexResults.style.display = 'none';
        resultCard.style.display = 'block';

        try {
            let data;
            if (checkType.value === 'site') {
                data = await checkSiteIndexing(baseUrl);
            } else {
                data = await checkUrlIndexing(specificUrl.value.trim());
            }

            // Hide loading spinner and show results
            loadingSpinner.style.display = 'none';
            indexResults.style.display = 'block';
            displayResults(data, checkType.value === 'site');
        } catch (error) {
            loadingSpinner.style.display = 'none';
            alert('An error occurred while checking indexing status. Please try again.');
        }
    });

    // Clear button handler
    clearButton.addEventListener('click', function() {
        form.reset();
        resultCard.style.display = 'none';
        specificUrlContainer.style.display = 'none';
        specificUrl.required = false;
    });

    // URL validation
    websiteUrl.addEventListener('input', function() {
        this.value = formatUrl(this.value.trim());
    });

    specificUrl.addEventListener('input', function() {
        this.value = formatUrl(this.value.trim());
    });
}); 