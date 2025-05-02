document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('mobileTestForm');
    const resultCard = document.getElementById('resultCard');
    const websiteUrl = document.getElementById('websiteUrl');
    const deviceType = document.getElementById('deviceType');
    const clearButton = document.getElementById('clearButton');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const testResults = document.getElementById('testResults');
    const mobileScore = document.getElementById('mobileScore');
    const viewportAnalysis = document.getElementById('viewportAnalysis');
    const contentAnalysis = document.getElementById('contentAnalysis');
    const usabilityIssues = document.getElementById('usabilityIssues');
    const recommendations = document.getElementById('recommendations');

    // Check if all required elements exist
    if (!form || !resultCard || !websiteUrl || !deviceType || !clearButton || !loadingSpinner || 
        !testResults || !mobileScore || !viewportAnalysis || !contentAnalysis || 
        !usabilityIssues || !recommendations) {
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

    // Function to test mobile-friendliness
    async function testMobileFriendliness(url, device) {
        try {
            // Simulate API call with timeout
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Mock data for demonstration
            return {
                score: 85,
                viewport: {
                    hasViewportMeta: true,
                    viewportWidth: 'device-width',
                    initialScale: '1.0',
                    maximumScale: '5.0',
                    userScalable: true
                },
                content: {
                    textSize: 'readable',
                    tapTargets: 'adequate',
                    contentWidth: 'responsive',
                    images: 'responsive',
                    fonts: 'readable'
                },
                issues: [
                    {
                        type: 'error',
                        message: 'Small tap targets detected',
                        details: 'Some buttons are too small to tap easily on mobile devices'
                    },
                    {
                        type: 'warning',
                        message: 'Non-responsive images found',
                        details: 'Some images may not scale properly on mobile devices'
                    }
                ],
                recommendations: [
                    'Increase tap target sizes to at least 44x44 pixels',
                    'Make images responsive using max-width: 100%',
                    'Use relative units (em, rem) for font sizes',
                    'Implement a mobile-first design approach',
                    'Test on various mobile devices and screen sizes'
                ]
            };
        } catch (error) {
            console.error('Error testing mobile-friendliness:', error);
            throw error;
        }
    }

    // Function to display results
    function displayResults(data) {
        // Clear previous results
        mobileScore.innerHTML = '';
        viewportAnalysis.innerHTML = '';
        contentAnalysis.innerHTML = '';
        usabilityIssues.innerHTML = '';
        recommendations.innerHTML = '';

        // Display Mobile Score
        const scoreColor = data.score >= 90 ? 'text-success' : 
                          data.score >= 70 ? 'text-warning' : 'text-danger';
        mobileScore.innerHTML = `
            <div class="display-4 ${scoreColor}">${data.score}</div>
            <p class="text-muted">Mobile-Friendliness Score</p>
        `;

        // Display Viewport Analysis
        const viewportList = document.createElement('ul');
        viewportList.className = 'list-unstyled';
        for (const [key, value] of Object.entries(data.viewport)) {
            const li = document.createElement('li');
            li.className = 'mb-2';
            const icon = key === 'hasViewportMeta' && value ? 
                'fa-check-circle text-success' : 
                'fa-exclamation-circle text-danger';
            li.innerHTML = `<i class="fas ${icon} me-2"></i><strong>${key.replace(/([A-Z])/g, ' $1').trim()}:</strong> ${value}`;
            viewportList.appendChild(li);
        }
        viewportAnalysis.appendChild(viewportList);

        // Display Content Analysis
        const contentList = document.createElement('ul');
        contentList.className = 'list-unstyled';
        for (const [key, value] of Object.entries(data.content)) {
            const li = document.createElement('li');
            li.className = 'mb-2';
            const icon = value === 'responsive' || value === 'readable' || value === 'adequate' ? 
                'fa-check-circle text-success' : 
                'fa-exclamation-circle text-danger';
            li.innerHTML = `<i class="fas ${icon} me-2"></i><strong>${key.replace(/([A-Z])/g, ' $1').trim()}:</strong> ${value}`;
            contentList.appendChild(li);
        }
        contentAnalysis.appendChild(contentList);

        // Display Usability Issues
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
                <p class="text-muted ms-4 mb-0">${issue.details}</p>
            `;
            issuesList.appendChild(li);
        });
        usabilityIssues.appendChild(issuesList);

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
        
        const url = formatUrl(websiteUrl.value.trim());
        if (!isValidUrl(url)) {
            alert('Please enter a valid website URL');
            return;
        }

        // Show loading spinner and hide results
        loadingSpinner.style.display = 'block';
        testResults.style.display = 'none';
        resultCard.style.display = 'block';

        try {
            const data = await testMobileFriendliness(url, deviceType.value);

            // Hide loading spinner and show results
            loadingSpinner.style.display = 'none';
            testResults.style.display = 'block';
            displayResults(data);
        } catch (error) {
            loadingSpinner.style.display = 'none';
            alert('An error occurred while testing mobile-friendliness. Please try again.');
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