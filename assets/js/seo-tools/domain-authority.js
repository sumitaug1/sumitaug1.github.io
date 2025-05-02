document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('daCheckForm');
    const resultCard = document.getElementById('resultCard');
    const websiteUrl = document.getElementById('websiteUrl');
    const clearButton = document.getElementById('clearButton');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const daResults = document.getElementById('daResults');
    const daScore = document.getElementById('daScore');
    const domainMetrics = document.getElementById('domainMetrics');
    const domainInsights = document.getElementById('domainInsights');
    const recommendations = document.getElementById('recommendations');

    // Check if all required elements exist
    if (!form || !resultCard || !websiteUrl || !clearButton || !loadingSpinner || 
        !daResults || !daScore || !domainMetrics || !domainInsights || !recommendations) {
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

    // Function to check domain authority
    async function checkDomainAuthority(url) {
        try {
            // Simulate API call with timeout
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Mock data for demonstration
            return {
                daScore: 45,
                metrics: {
                    backlinks: 1250,
                    referringDomains: 85,
                    organicTraffic: '10K-50K',
                    age: '3 years'
                },
                insights: [
                    'Strong backlink profile with diverse referring domains',
                    'Good organic traffic potential',
                    'Established domain age',
                    'Competitive in your industry'
                ],
                recommendations: [
                    'Focus on building more high-quality backlinks',
                    'Improve content quality and depth',
                    'Optimize for long-tail keywords',
                    'Enhance internal linking structure',
                    'Regularly update and maintain content'
                ]
            };
        } catch (error) {
            console.error('Error checking domain authority:', error);
            throw error;
        }
    }

    // Function to display results
    function displayResults(data) {
        // Clear previous results
        daScore.innerHTML = '';
        domainMetrics.innerHTML = '';
        domainInsights.innerHTML = '';
        recommendations.innerHTML = '';

        // Display DA Score
        const scoreColor = data.daScore >= 40 ? 'text-success' : 
                          data.daScore >= 20 ? 'text-warning' : 'text-danger';
        daScore.innerHTML = `
            <div class="display-4 ${scoreColor}">${data.daScore}</div>
            <p class="text-muted">Domain Authority Score</p>
        `;

        // Display Domain Metrics
        const metricsList = document.createElement('ul');
        metricsList.className = 'list-unstyled';
        for (const [key, value] of Object.entries(data.metrics)) {
            const li = document.createElement('li');
            li.className = 'mb-2';
            li.innerHTML = `<strong>${key.replace(/([A-Z])/g, ' $1').trim()}:</strong> ${value}`;
            metricsList.appendChild(li);
        }
        domainMetrics.appendChild(metricsList);

        // Display Domain Insights
        const insightsList = document.createElement('ul');
        insightsList.className = 'list-unstyled';
        data.insights.forEach(insight => {
            const li = document.createElement('li');
            li.className = 'mb-2';
            li.innerHTML = `<i class="fas fa-lightbulb text-warning me-2"></i>${insight}`;
            insightsList.appendChild(li);
        });
        domainInsights.appendChild(insightsList);

        // Display Recommendations
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

    // Form submission handler
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const url = formatUrl(websiteUrl.value.trim());
        if (!isValidUrl(url)) {
            alert('Please enter a valid website URL');
            return;
        }

        // Show loading spinner and hide results
        loadingSpinner.style.display = 'block';
        daResults.style.display = 'none';
        resultCard.style.display = 'block';

        try {
            const data = await checkDomainAuthority(url);

            // Hide loading spinner and show results
            loadingSpinner.style.display = 'none';
            daResults.style.display = 'block';
            displayResults(data);
        } catch (error) {
            loadingSpinner.style.display = 'none';
            alert('An error occurred while checking domain authority. Please try again.');
        }
    });

    // Clear button handler
    clearButton.addEventListener('click', function() {
        form.reset();
        resultCard.style.display = 'none';
    });

    // URL validation
    websiteUrl.addEventListener('input', function() {
        this.value = formatUrl(this.value.trim());
    });
}); 