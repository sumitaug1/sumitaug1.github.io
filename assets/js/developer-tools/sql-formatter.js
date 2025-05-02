document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('formatterForm');
    const resultCard = document.getElementById('resultCard');
    const sqlInput = document.getElementById('sqlInput');
    const uppercaseKeywords = document.getElementById('uppercaseKeywords');
    const indentWithSpaces = document.getElementById('indentWithSpaces');
    const alignClauses = document.getElementById('alignClauses');
    const indentSize = document.getElementById('indentSize');
    const clearButton = document.getElementById('clearButton');
    const copyButton = document.getElementById('copyButton');
    const copyOutputButton = document.getElementById('copyOutputButton');
    const downloadButton = document.getElementById('downloadButton');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const formattingResults = document.getElementById('formattingResults');
    const formattingStatus = document.getElementById('formattingStatus');
    const formattedOutput = document.getElementById('formattedOutput');

    // Check if all required elements exist
    if (!form || !resultCard || !sqlInput || !uppercaseKeywords || !indentWithSpaces || !alignClauses || 
        !indentSize || !clearButton || !copyButton || !copyOutputButton || !downloadButton || 
        !loadingSpinner || !formattingResults || !formattingStatus || !formattedOutput) {
        console.error('Required elements not found. Please check the HTML structure.');
        return;
    }

    // Function to format SQL
    function formatSQL(sql) {
        try {
            const options = {
                uppercase: uppercaseKeywords.checked,
                indent: indentWithSpaces.checked ? ' '.repeat(parseInt(indentSize.value)) : '\t',
                linesBetweenQueries: 2,
                language: 'sql',
                keywordCase: uppercaseKeywords.checked ? 'upper' : 'lower',
                indentStyle: indentWithSpaces.checked ? 'standard' : 'tabular',
                alignClauses: alignClauses.checked
            };

            const formatted = sqlFormatter.format(sql, options);
            return {
                success: true,
                sql: formatted
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Function to display results
    function displayResults(result) {
        // Clear previous results
        formattingStatus.innerHTML = '';
        formattedOutput.innerHTML = '';

        if (result.success) {
            // Display success status
            formattingStatus.innerHTML = '<i class="fas fa-check-circle text-success me-2"></i>Formatting successful';
            
            // Display formatted SQL
            formattedOutput.textContent = result.sql;
            hljs.highlightElement(formattedOutput);
            
            // Show copy button
            copyOutputButton.style.display = 'block';
        } else {
            // Display error status
            formattingStatus.innerHTML = '<i class="fas fa-times-circle text-danger me-2"></i>Formatting failed';
            
            // Display error details
            formattedOutput.textContent = result.error;
            
            // Hide copy button
            copyOutputButton.style.display = 'none';
        }
    }

    // Function to download SQL
    function downloadSQL(sql, filename) {
        const blob = new Blob([sql], { type: 'text/sql' });
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
        
        const sql = sqlInput.value.trim();
        if (!sql) {
            alert('Please enter SQL query');
            return;
        }

        // Show loading spinner and hide results
        loadingSpinner.style.display = 'block';
        formattingResults.style.display = 'none';
        resultCard.style.display = 'block';

        try {
            // Format SQL
            const result = formatSQL(sql);
            
            // Hide loading spinner and show results
            loadingSpinner.style.display = 'none';
            formattingResults.style.display = 'block';
            displayResults(result);
        } catch (error) {
            loadingSpinner.style.display = 'none';
            formattingResults.style.display = 'block';
            displayResults({
                success: false,
                error: error.message
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
        if (sqlInput.value.trim()) {
            copyToClipboard(sqlInput.value.trim(), this);
        }
    });

    // Copy button handler for output
    copyOutputButton.addEventListener('click', function() {
        if (formattedOutput.textContent) {
            copyToClipboard(formattedOutput.textContent, this);
        }
    });

    // Download button handler
    downloadButton.addEventListener('click', function() {
        if (formattedOutput.textContent) {
            const filename = `formatted-${new Date().toISOString()}.sql`;
            downloadSQL(formattedOutput.textContent, filename);
        }
    });

    // Initialize syntax highlighting
    hljs.configure({
        languages: ['sql']
    });
}); 