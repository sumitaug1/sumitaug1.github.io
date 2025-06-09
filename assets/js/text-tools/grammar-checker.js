document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const textInput = document.getElementById('textInput');
    const languageSelect = document.getElementById('languageSelect');
    const checkBtn = document.getElementById('checkBtn');
    const clearBtn = document.getElementById('clearBtn');
    const copyBtn = document.getElementById('copyBtn');
    const resultsCard = document.getElementById('resultsCard');
    const errorList = document.getElementById('errorList');
    const suggestions = document.getElementById('suggestions');
    const wordCount = document.getElementById('wordCount');
    const charCount = document.getElementById('charCount');
    const errorCount = document.getElementById('errorCount');

    // Initialize variables
    let currentErrors = [];
    let isChecking = false;

    // Update statistics
    function updateStats() {
        const text = textInput.value;
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        const chars = text.length;
        
        wordCount.textContent = `Words: ${words}`;
        charCount.textContent = `Characters: ${chars}`;
        errorCount.textContent = `Errors: ${currentErrors.length}`;
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

    // Check grammar
    async function checkGrammar() {
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

            // Mock grammar check results
            // In a real implementation, this would be replaced with an actual API call
            currentErrors = [
                {
                    type: 'spelling',
                    message: 'Possible spelling mistake',
                    suggestion: 'grammar',
                    context: 'Check your grammer',
                    offset: 10,
                    length: 7
                },
                {
                    type: 'grammar',
                    message: 'Consider using a comma',
                    suggestion: 'Add a comma after "However"',
                    context: 'However the weather was nice',
                    offset: 0,
                    length: 8
                }
            ];

            displayResults();
            showNotification('Grammar check completed', 'success');
        } catch (error) {
            showNotification('Error checking grammar: ' + error.message, 'error');
        } finally {
            isChecking = false;
            checkBtn.disabled = false;
            checkBtn.innerHTML = '<i class="fas fa-check me-2"></i>Check Grammar';
        }
    }

    // Display results
    function displayResults() {
        if (currentErrors.length === 0) {
            errorList.innerHTML = '<div class="alert alert-success mb-0">No errors found!</div>';
            suggestions.innerHTML = '';
        } else {
            errorList.innerHTML = currentErrors.map(error => `
                <div class="alert alert-warning mb-2">
                    <strong>${error.type.charAt(0).toUpperCase() + error.type.slice(1)} Error:</strong> ${error.message}
                    <br>
                    <small class="text-muted">Context: "${error.context}"</small>
                </div>
            `).join('');

            suggestions.innerHTML = `
                <h6>Suggestions:</h6>
                <ul class="list-group">
                    ${currentErrors.map(error => `
                        <li class="list-group-item">
                            <i class="fas fa-lightbulb text-warning me-2"></i>
                            ${error.suggestion}
                        </li>
                    `).join('')}
                </ul>
            `;
        }

        resultsCard.style.display = 'block';
        updateStats();
    }

    // Event listeners
    textInput.addEventListener('input', () => {
        updateStats();
        if (currentErrors.length > 0) {
            resultsCard.style.display = 'none';
            currentErrors = [];
        }
    });

    checkBtn.addEventListener('click', checkGrammar);

    clearBtn.addEventListener('click', () => {
        textInput.value = '';
        resultsCard.style.display = 'none';
        currentErrors = [];
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
        if (currentErrors.length > 0) {
            checkGrammar();
        }
    });

    // Initialize
    updateStats();
}); 