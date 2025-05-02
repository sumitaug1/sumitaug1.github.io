document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('converterForm');
    const resultCard = document.getElementById('resultCard');
    const htmlInput = document.getElementById('htmlInput');
    const preserveLinks = document.getElementById('preserveLinks');
    const preserveImages = document.getElementById('preserveImages');
    const preserveTables = document.getElementById('preserveTables');
    const outputFormat = document.getElementById('outputFormat');
    const clearButton = document.getElementById('clearButton');
    const copyButton = document.getElementById('copyButton');
    const copyOutputButton = document.getElementById('copyOutputButton');
    const downloadButton = document.getElementById('downloadButton');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const conversionResults = document.getElementById('conversionResults');
    const conversionStatus = document.getElementById('conversionStatus');
    const markdownOutput = document.getElementById('markdownOutput');
    const errorDetails = document.getElementById('errorDetails');
    const errorMessage = document.getElementById('errorMessage');

    // Check if all required elements exist
    if (!form || !resultCard || !htmlInput || !preserveLinks || !preserveImages || !preserveTables || 
        !outputFormat || !clearButton || !copyButton || !copyOutputButton || !downloadButton || 
        !loadingSpinner || !conversionResults || !conversionStatus || !markdownOutput || 
        !errorDetails || !errorMessage) {
        console.error('Required elements not found. Please check the HTML structure.');
        return;
    }

    // Initialize Turndown service
    const turndownService = new TurndownService({
        headingStyle: 'atx',
        hr: '---',
        bulletListMarker: '-',
        codeBlockStyle: 'fenced',
        emDelimiter: '*'
    });

    // Configure Turndown based on options
    function configureTurndown() {
        // Reset all rules
        turndownService.removeRule('heading');
        turndownService.removeRule('hr');
        turndownService.removeRule('bulletList');
        turndownService.removeRule('codeBlock');
        turndownService.removeRule('em');

        // Add rules based on output format
        switch (outputFormat.value) {
            case 'github':
                turndownService.addRule('heading', {
                    filter: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
                    replacement: function(content, node) {
                        const hLevel = node.tagName.charAt(1);
                        return '#'.repeat(hLevel) + ' ' + content + '\n\n';
                    }
                });
                break;
            case 'commonmark':
                turndownService.addRule('heading', {
                    filter: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
                    replacement: function(content, node) {
                        const hLevel = node.tagName.charAt(1);
                        return '#'.repeat(hLevel) + ' ' + content + '\n\n';
                    }
                });
                break;
            default: // standard
                turndownService.addRule('heading', {
                    filter: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
                    replacement: function(content, node) {
                        const hLevel = node.tagName.charAt(1);
                        return '#'.repeat(hLevel) + ' ' + content + '\n\n';
                    }
                });
        }
    }

    // Function to convert HTML to Markdown
    function convertToMarkdown(html) {
        try {
            configureTurndown();
            
            // Set options based on checkboxes
            turndownService.keep(['a', 'img', 'table']);
            
            // Convert HTML to Markdown
            const markdown = turndownService.turndown(html);
            
            return {
                success: true,
                markdown: markdown
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
        conversionStatus.innerHTML = '';
        markdownOutput.innerHTML = '';
        errorDetails.style.display = 'none';

        if (result.success) {
            // Display success status
            conversionStatus.innerHTML = '<i class="fas fa-check-circle text-success me-2"></i>Conversion successful';
            
            // Display markdown output
            markdownOutput.textContent = result.markdown;
            hljs.highlightElement(markdownOutput);
            
            // Show copy button
            copyOutputButton.style.display = 'block';
        } else {
            // Display error status
            conversionStatus.innerHTML = '<i class="fas fa-times-circle text-danger me-2"></i>Conversion failed';
            
            // Display error details
            errorDetails.style.display = 'block';
            errorMessage.textContent = result.error;
            
            // Hide copy button
            copyOutputButton.style.display = 'none';
        }
    }

    // Function to download markdown
    function downloadMarkdown(markdown, filename) {
        const blob = new Blob([markdown], { type: 'text/markdown' });
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
        
        const html = htmlInput.value.trim();
        if (!html) {
            alert('Please enter HTML content');
            return;
        }

        // Show loading spinner and hide results
        loadingSpinner.style.display = 'block';
        conversionResults.style.display = 'none';
        resultCard.style.display = 'block';

        try {
            // Convert HTML to Markdown
            const result = convertToMarkdown(html);
            
            // Hide loading spinner and show results
            loadingSpinner.style.display = 'none';
            conversionResults.style.display = 'block';
            displayResults(result);
        } catch (error) {
            loadingSpinner.style.display = 'none';
            conversionResults.style.display = 'block';
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
        if (htmlInput.value.trim()) {
            copyToClipboard(htmlInput.value.trim(), this);
        }
    });

    // Copy button handler for output
    copyOutputButton.addEventListener('click', function() {
        if (markdownOutput.textContent) {
            copyToClipboard(markdownOutput.textContent, this);
        }
    });

    // Download button handler
    downloadButton.addEventListener('click', function() {
        if (markdownOutput.textContent) {
            const filename = `converted-${outputFormat.value}-${new Date().toISOString()}.md`;
            downloadMarkdown(markdownOutput.textContent, filename);
        }
    });

    // Initialize syntax highlighting
    hljs.configure({
        languages: ['markdown']
    });
}); 