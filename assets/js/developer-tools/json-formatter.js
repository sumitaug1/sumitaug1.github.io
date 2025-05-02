document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('jsonFormatterForm');
    const resultCard = document.getElementById('resultCard');
    const jsonInput = document.getElementById('jsonInput');
    const formatType = document.getElementById('formatType');
    const indentSize = document.getElementById('indentSize');
    const clearButton = document.getElementById('clearButton');
    const copyButton = document.getElementById('copyButton');
    const copyFormattedButton = document.getElementById('copyFormattedButton');
    const downloadButton = document.getElementById('downloadButton');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const formatResults = document.getElementById('formatResults');
    const validationStatus = document.getElementById('validationStatus');
    const formattedOutput = document.getElementById('formattedOutput');
    const errorDetails = document.getElementById('errorDetails');
    const errorMessage = document.getElementById('errorMessage');

    // Check if all required elements exist
    if (!form || !resultCard || !jsonInput || !formatType || !indentSize || !clearButton || 
        !copyButton || !copyFormattedButton || !downloadButton || !loadingSpinner || !formatResults || 
        !validationStatus || !formattedOutput || !errorDetails || !errorMessage) {
        console.error('Required elements not found. Please check the HTML structure.');
        return;
    }

    // Function to format JSON
    function formatJSON(json, type, indent) {
        try {
            // Parse the JSON to validate it
            const parsed = JSON.parse(json);
            
            // Format based on type
            if (type === 'minify') {
                return JSON.stringify(parsed);
            } else {
                return JSON.stringify(parsed, null, parseInt(indent));
            }
        } catch (error) {
            throw error;
        }
    }

    // Function to validate JSON
    function validateJSON(json) {
        try {
            JSON.parse(json);
            return {
                isValid: true,
                message: 'Valid JSON'
            };
        } catch (error) {
            return {
                isValid: false,
                message: error.message
            };
        }
    }

    // Function to display results
    function displayResults(formatted, validation) {
        // Clear previous results
        validationStatus.innerHTML = '';
        formattedOutput.innerHTML = '';
        errorDetails.style.display = 'none';

        // Display validation status
        const statusIcon = validation.isValid ? 
            '<i class="fas fa-check-circle text-success me-2"></i>' : 
            '<i class="fas fa-times-circle text-danger me-2"></i>';
        validationStatus.innerHTML = `${statusIcon}${validation.message}`;

        if (validation.isValid) {
            // Display formatted output
            formattedOutput.textContent = formatted;
            hljs.highlightElement(formattedOutput);
            // Show copy button only when there's valid formatted output
            copyFormattedButton.style.display = 'block';
        } else {
            // Display error details
            errorDetails.style.display = 'block';
            errorMessage.textContent = validation.message;
            // Hide copy button when there's an error
            copyFormattedButton.style.display = 'none';
        }
    }

    // Function to download JSON
    function downloadJSON(json, filename) {
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Function to copy text to clipboard
    function copyToClipboard(text, button) {
        navigator.clipboard.writeText(text)
            .then(() => {
                const originalText = button.innerHTML;
                button.innerHTML = '<i class="fas fa-check me-1"></i>Copied!';
                setTimeout(() => {
                    button.innerHTML = originalText;
                }, 2000);
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
                alert('Failed to copy to clipboard');
            });
    }

    // Form submission handler
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const json = jsonInput.value.trim();
        if (!json) {
            alert('Please enter JSON data');
            return;
        }

        // Show loading spinner and hide results
        loadingSpinner.style.display = 'block';
        formatResults.style.display = 'none';
        resultCard.style.display = 'block';

        try {
            // Validate JSON
            const validation = validateJSON(json);
            
            if (validation.isValid) {
                // Format JSON
                const formatted = formatJSON(json, formatType.value, indentSize.value);
                
                // Hide loading spinner and show results
                loadingSpinner.style.display = 'none';
                formatResults.style.display = 'block';
                displayResults(formatted, validation);
            } else {
                // Hide loading spinner and show error
                loadingSpinner.style.display = 'none';
                formatResults.style.display = 'block';
                displayResults('', validation);
            }
        } catch (error) {
            loadingSpinner.style.display = 'none';
            formatResults.style.display = 'block';
            displayResults('', {
                isValid: false,
                message: error.message
            });
        }
    });

    // Clear button handler
    clearButton.addEventListener('click', function() {
        form.reset();
        resultCard.style.display = 'none';
    });

    // Copy button handler for input
    copyButton.addEventListener('click', function() {
        if (jsonInput.value.trim()) {
            copyToClipboard(jsonInput.value.trim(), this);
        }
    });

    // Copy button handler for formatted output
    copyFormattedButton.addEventListener('click', function() {
        if (formattedOutput.textContent) {
            copyToClipboard(formattedOutput.textContent, this);
        }
    });

    // Download button handler
    downloadButton.addEventListener('click', function() {
        if (formattedOutput.textContent) {
            const filename = `formatted-${formatType.value}-${new Date().toISOString()}.json`;
            downloadJSON(formattedOutput.textContent, filename);
        }
    });

    // Initialize syntax highlighting
    hljs.configure({
        languages: ['json']
    });
}); 