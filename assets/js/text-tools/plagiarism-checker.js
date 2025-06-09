document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const textInput = document.getElementById('textInput');
    const languageSelect = document.getElementById('languageSelect');
    const checkBtn = document.getElementById('checkBtn');
    const clearBtn = document.getElementById('clearBtn');
    const copyBtn = document.getElementById('copyBtn');
    const resultsCard = document.getElementById('resultsCard');
    const similarityBar = document.getElementById('similarityBar');
    const matchList = document.getElementById('matchList');
    const suggestions = document.getElementById('suggestions');
    const wordCount = document.getElementById('wordCount');
    const charCount = document.getElementById('charCount');
    const similarityScore = document.getElementById('similarityScore');

    // Initialize variables
    let currentMatches = [];
    let isChecking = false;

    // Common phrases and sentences for comparison
    const commonPhrases = [
        "In today's world",
        "As we all know",
        "It is important to note that",
        "In conclusion",
        "The purpose of this",
        "This paper will discuss",
        "According to research",
        "Studies have shown",
        "It can be argued that",
        "In recent years",
        "The main objective",
        "This essay will explore",
        "It is evident that",
        "The results indicate",
        "Based on the findings",
        "In order to",
        "The following section",
        "This chapter will",
        "The research suggests",
        "It is clear that"
    ];

    // Update statistics
    function updateStats() {
        const text = textInput.value;
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        const chars = text.length;
        
        wordCount.textContent = `Words: ${words}`;
        charCount.textContent = `Characters: ${chars}`;
        similarityScore.textContent = `Similarity: ${calculateSimilarity(text, currentMatches)}%`;
    }

    // Show notification
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`;
        notification.style.zIndex = '1050';
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        document.body.appendChild(notification);

        // Auto-dismiss after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Find matches in text
    function findMatches(text) {
        const matches = [];
        let highlightedText = text;

        commonPhrases.forEach(phrase => {
            const regex = new RegExp(phrase, 'gi');
            const matchesFound = [...text.matchAll(regex)];

            matchesFound.forEach(match => {
                const startIndex = match.index;
                const endIndex = startIndex + phrase.length;
                const matchedText = text.substring(startIndex, endIndex);

                matches.push({
                    phrase: matchedText,
                    startIndex,
                    endIndex,
                    source: 'Common phrase'
                });

                // Add highlight to the matched text
                highlightedText = highlightedText.substring(0, startIndex) +
                    `<span class="highlight">${matchedText}</span>` +
                    highlightedText.substring(endIndex);
            });
        });

        return { matches, highlightedText };
    }

    // Calculate similarity percentage
    function calculateSimilarity(text, matches) {
        if (!text.trim()) return 0;

        const totalWords = text.trim().split(/\s+/).filter(word => word.length > 0).length;
        if (totalWords === 0) return 0;

        const matchedWords = matches.reduce((count, match) => {
            return count + match.phrase.trim().split(/\s+/).length;
        }, 0);

        return Math.round((matchedWords / totalWords) * 100);
    }

    // Check for plagiarism
    async function checkPlagiarism() {
        const text = textInput.value.trim();
        if (!text) {
            showNotification('Please enter some text to check', 'warning');
            return;
        }

        isChecking = true;
        checkBtn.disabled = true;
        checkBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Checking...';

        try {
            // Simulate API call with timeout
            await new Promise(resolve => setTimeout(resolve, 1000));

            const { matches, highlightedText } = findMatches(text);
            currentMatches = matches;
            const similarity = calculateSimilarity(text, matches);

            // Update similarity bar
            similarityBar.style.width = `${similarity}%`;
            similarityBar.className = `progress-bar ${similarity > 50 ? 'bg-danger' : similarity > 20 ? 'bg-warning' : 'bg-success'}`;

            // Display matches
            if (matches.length === 0) {
                matchList.innerHTML = '<div class="alert alert-success mb-0">No matches found!</div>';
                suggestions.innerHTML = '';
            } else {
                matchList.innerHTML = matches.map((match, index) => `
                    <div class="alert alert-warning mb-2">
                        <strong>Match ${index + 1}:</strong> ${match.phrase}
                        <br>
                        <small class="text-muted">Source: ${match.source}</small>
                    </div>
                `).join('');

                suggestions.innerHTML = `
                    <h6>Suggestions:</h6>
                    <ul class="list-group">
                        <li class="list-group-item">
                            <i class="fas fa-lightbulb text-warning me-2"></i>
                            Consider rephrasing common phrases to make your content more unique
                        </li>
                        <li class="list-group-item">
                            <i class="fas fa-lightbulb text-warning me-2"></i>
                            Add your own insights and analysis to the content
                        </li>
                        <li class="list-group-item">
                            <i class="fas fa-lightbulb text-warning me-2"></i>
                            Use different sentence structures and vocabulary
                        </li>
                    </ul>
                `;
            }

            resultsCard.style.display = 'block';
            updateStats();
            showNotification('Plagiarism check completed', 'success');
        } catch (error) {
            showNotification('Error checking plagiarism: ' + error.message, 'error');
        } finally {
            isChecking = false;
            checkBtn.disabled = false;
            checkBtn.innerHTML = '<i class="fas fa-search me-2"></i>Check Plagiarism';
        }
    }

    // Event listeners
    textInput.addEventListener('input', () => {
        updateStats();
        if (currentMatches.length > 0) {
            resultsCard.style.display = 'none';
            currentMatches = [];
        }
    });

    checkBtn.addEventListener('click', checkPlagiarism);

    clearBtn.addEventListener('click', () => {
        textInput.value = '';
        resultsCard.style.display = 'none';
        currentMatches = [];
        updateStats();
        showNotification('Text cleared', 'info');
    });

    copyBtn.addEventListener('click', () => {
        if (textInput.value.trim()) {
            navigator.clipboard.writeText(textInput.value)
                .then(() => {
                    showNotification('Text copied to clipboard', 'success');
                })
                .catch(() => {
                    showNotification('Failed to copy text', 'error');
                });
        } else {
            showNotification('No text to copy', 'warning');
        }
    });

    languageSelect.addEventListener('change', () => {
        if (currentMatches.length > 0) {
            checkPlagiarism();
        }
    });

    // Initialize
    updateStats();
}); 