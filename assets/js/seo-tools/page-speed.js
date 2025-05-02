document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('speedCheckForm');
    const resultCard = document.getElementById('resultCard');
    const websiteUrl = document.getElementById('websiteUrl');
    const deviceType = document.getElementById('deviceType');
    const clearButton = document.getElementById('clearButton');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const speedResults = document.getElementById('speedResults');
    const performanceScore = document.getElementById('performanceScore');
    const loadingTime = document.getElementById('loadingTime');
    const coreWebVitals = document.getElementById('coreWebVitals');
    const performanceMetrics = document.getElementById('performanceMetrics');
    const optimizationOpportunities = document.getElementById('optimizationOpportunities');

    // Check if all required elements exist
    if (!form || !resultCard || !websiteUrl || !deviceType || !clearButton || !loadingSpinner || 
        !speedResults || !performanceScore || !loadingTime || !coreWebVitals || 
        !performanceMetrics || !optimizationOpportunities) {
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

    // Function to check page speed
    async function checkPageSpeed(url, device) {
        try {
            // Simulate API call with timeout
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Mock data for demonstration
            return {
                performanceScore: 85,
                loadingTime: {
                    firstContentfulPaint: 1.2,
                    timeToInteractive: 2.5,
                    totalBlockingTime: 150,
                    speedIndex: 2.1
                },
                coreWebVitals: {
                    lcp: 2.3,
                    fid: 15,
                    cls: 0.1
                },
                metrics: {
                    totalResources: 45,
                    totalSize: '2.5 MB',
                    imageSize: '1.2 MB',
                    scriptSize: '800 KB',
                    cssSize: '300 KB'
                },
                opportunities: [
                    'Optimize images and use next-gen formats',
                    'Minify CSS, JavaScript, and HTML',
                    'Enable text compression',
                    'Implement lazy loading for images',
                    'Reduce server response time'
                ]
            };
        } catch (error) {
            console.error('Error checking page speed:', error);
            throw error;
        }
    }

    // Function to display results
    function displayResults(data) {
        // Clear previous results
        performanceScore.innerHTML = '';
        loadingTime.innerHTML = '';
        coreWebVitals.innerHTML = '';
        performanceMetrics.innerHTML = '';
        optimizationOpportunities.innerHTML = '';

        // Display Performance Score
        const scoreColor = data.performanceScore >= 90 ? 'text-success' : 
                          data.performanceScore >= 50 ? 'text-warning' : 'text-danger';
        performanceScore.innerHTML = `
            <div class="display-4 ${scoreColor}">${data.performanceScore}</div>
            <p class="text-muted">Performance Score</p>
        `;

        // Display Loading Time
        const loadingList = document.createElement('ul');
        loadingList.className = 'list-unstyled';
        for (const [key, value] of Object.entries(data.loadingTime)) {
            const li = document.createElement('li');
            li.className = 'mb-2';
            const icon = key === 'totalBlockingTime' && value > 200 ? 
                'fa-exclamation-triangle text-danger' : 'fa-clock text-primary';
            li.innerHTML = `<i class="fas ${icon} me-2"></i><strong>${key.replace(/([A-Z])/g, ' $1').trim()}:</strong> ${value}${key.includes('Time') ? 'ms' : 's'}`;
            loadingList.appendChild(li);
        }
        loadingTime.appendChild(loadingList);

        // Display Core Web Vitals
        const vitalsList = document.createElement('ul');
        vitalsList.className = 'list-unstyled';
        for (const [key, value] of Object.entries(data.coreWebVitals)) {
            const li = document.createElement('li');
            li.className = 'mb-2';
            const icon = (key === 'lcp' && value > 2.5) || 
                        (key === 'fid' && value > 100) || 
                        (key === 'cls' && value > 0.1) ? 
                'fa-exclamation-triangle text-danger' : 'fa-check-circle text-success';
            li.innerHTML = `<i class="fas ${icon} me-2"></i><strong>${key.toUpperCase()}:</strong> ${value}${key === 'cls' ? '' : 's'}`;
            vitalsList.appendChild(li);
        }
        coreWebVitals.appendChild(vitalsList);

        // Display Performance Metrics
        const metricsList = document.createElement('ul');
        metricsList.className = 'list-unstyled';
        for (const [key, value] of Object.entries(data.metrics)) {
            const li = document.createElement('li');
            li.className = 'mb-2';
            li.innerHTML = `<i class="fas fa-chart-bar text-primary me-2"></i><strong>${key.replace(/([A-Z])/g, ' $1').trim()}:</strong> ${value}`;
            metricsList.appendChild(li);
        }
        performanceMetrics.appendChild(metricsList);

        // Display Optimization Opportunities
        const opportunitiesList = document.createElement('ul');
        opportunitiesList.className = 'list-unstyled';
        data.opportunities.forEach(opp => {
            const li = document.createElement('li');
            li.className = 'mb-2';
            li.innerHTML = `<i class="fas fa-lightbulb text-warning me-2"></i>${opp}`;
            opportunitiesList.appendChild(li);
        });
        optimizationOpportunities.appendChild(opportunitiesList);
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
        speedResults.style.display = 'none';
        resultCard.style.display = 'block';

        try {
            const data = await checkPageSpeed(url, deviceType.value);

            // Hide loading spinner and show results
            loadingSpinner.style.display = 'none';
            speedResults.style.display = 'block';
            displayResults(data);
        } catch (error) {
            loadingSpinner.style.display = 'none';
            alert('An error occurred while checking page speed. Please try again.');
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