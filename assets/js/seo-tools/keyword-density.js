document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('keywordDensityForm');
    const resultCard = document.getElementById('resultCard');
    const content = document.getElementById('content');
    const keywords = document.getElementById('keywords');
    const minWordLength = document.getElementById('minWordLength');
    const clearButton = document.getElementById('clearButton');

    // Check if all required elements exist
    if (!form || !resultCard || !content || !keywords || !minWordLength || !clearButton) {
        console.error('Required elements not found. Please check the HTML structure.');
        return;
    }

    // Function to clean and normalize text
    function cleanText(text) {
        return text.toLowerCase()
            .replace(/[^\w\s]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    // Function to count word frequency
    function countWordFrequency(text, minLength) {
        const words = text.split(/\s+/);
        const frequency = {};
        
        words.forEach(word => {
            if (word.length >= minLength) {
                frequency[word] = (frequency[word] || 0) + 1;
            }
        });
        
        return frequency;
    }

    // Function to calculate keyword density
    function calculateDensity(frequency, totalWords) {
        const density = {};
        for (const word in frequency) {
            density[word] = (frequency[word] / totalWords * 100).toFixed(2);
        }
        return density;
    }

    // Function to get SEO recommendations
    function getSEORecommendations(density, targetKeywords) {
        const recommendations = [];
        
        // Check target keywords
        if (targetKeywords.length > 0) {
            targetKeywords.forEach(keyword => {
                const keywordDensity = parseFloat(density[keyword] || 0);
                if (keywordDensity < 0.5) {
                    recommendations.push(`Consider using "${keyword}" more frequently (current density: ${keywordDensity}%)`);
                } else if (keywordDensity > 2.5) {
                    recommendations.push(`Reduce usage of "${keyword}" to avoid keyword stuffing (current density: ${keywordDensity}%)`);
                }
            });
        }

        // Check overall keyword density
        const topKeywords = Object.entries(density)
            .sort((a, b) => parseFloat(b[1]) - parseFloat(a[1]))
            .slice(0, 5);

        topKeywords.forEach(([word, density]) => {
            const densityValue = parseFloat(density);
            if (densityValue > 3) {
                recommendations.push(`High density for "${word}" (${density}%). Consider reducing usage.`);
            }
        });

        return recommendations;
    }

    // Function to display results
    function displayResults(frequency, density, totalWords, uniqueWords, totalChars, targetKeywords) {
        // Update basic statistics
        document.getElementById('totalWords').textContent = totalWords;
        document.getElementById('uniqueWords').textContent = uniqueWords;
        document.getElementById('totalChars').textContent = totalChars;

        // Display keyword density for target keywords
        const densityList = document.getElementById('keywordDensityList');
        densityList.innerHTML = '';
        
        if (targetKeywords.length > 0) {
            const densityTable = document.createElement('table');
            densityTable.className = 'table table-sm';
            densityTable.innerHTML = `
                <thead>
                    <tr>
                        <th>Keyword</th>
                        <th>Frequency</th>
                        <th>Density</th>
                    </tr>
                </thead>
                <tbody>
                    ${targetKeywords.map(keyword => `
                        <tr>
                            <td>${keyword}</td>
                            <td>${frequency[keyword] || 0}</td>
                            <td>${density[keyword] || '0.00'}%</td>
                        </tr>
                    `).join('')}
                </tbody>
            `;
            densityList.appendChild(densityTable);
        }

        // Display top keywords
        const topKeywordsList = document.getElementById('topKeywordsList');
        const topKeywords = Object.entries(frequency)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);

        topKeywordsList.innerHTML = `
            <table class="table table-sm">
                <thead>
                    <tr>
                        <th>Keyword</th>
                        <th>Frequency</th>
                        <th>Density</th>
                    </tr>
                </thead>
                <tbody>
                    ${topKeywords.map(([word, freq]) => `
                        <tr>
                            <td>${word}</td>
                            <td>${freq}</td>
                            <td>${density[word]}%</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        // Display SEO recommendations
        const recommendations = getSEORecommendations(density, targetKeywords);
        const recommendationsDiv = document.getElementById('seoRecommendations');
        
        if (recommendations.length > 0) {
            recommendationsDiv.innerHTML = `
                <ul class="list-unstyled">
                    ${recommendations.map(rec => `
                        <li class="mb-2">
                            <i class="fas fa-info-circle text-info me-2"></i>
                            ${rec}
                        </li>
                    `).join('')}
                </ul>
            `;
        } else {
            recommendationsDiv.innerHTML = `
                <p class="text-success">
                    <i class="fas fa-check-circle me-2"></i>
                    Your content has good keyword distribution!
                </p>
            `;
        }
    }

    // Form submission handler
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const contentText = cleanText(content.value);
        const targetKeywords = keywords.value
            .split(',')
            .map(k => k.trim().toLowerCase())
            .filter(k => k.length > 0);
        
        const minLength = parseInt(minWordLength.value) || 3;
        const frequency = countWordFrequency(contentText, minLength);
        const totalWords = contentText.split(/\s+/).length;
        const uniqueWords = Object.keys(frequency).length;
        const totalChars = content.value.length;
        
        const density = calculateDensity(frequency, totalWords);
        
        displayResults(frequency, density, totalWords, uniqueWords, totalChars, targetKeywords);
        resultCard.style.display = 'block';
    });

    // Clear button handler
    clearButton.addEventListener('click', function() {
        form.reset();
        resultCard.style.display = 'none';
    });
}); 