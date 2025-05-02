document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('minifierForm');
    const resultCard = document.getElementById('resultCard');
    const cssInput = document.getElementById('cssInput');
    const removeComments = document.getElementById('removeComments');
    const removeWhitespace = document.getElementById('removeWhitespace');
    const optimizeColors = document.getElementById('optimizeColors');
    const outputFormat = document.getElementById('outputFormat');
    const clearButton = document.getElementById('clearButton');
    const copyButton = document.getElementById('copyButton');
    const copyOutputButton = document.getElementById('copyOutputButton');
    const downloadButton = document.getElementById('downloadButton');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const minificationResults = document.getElementById('minificationResults');
    const minificationStatus = document.getElementById('minificationStatus');
    const minifiedOutput = document.getElementById('minifiedOutput');
    const originalSize = document.getElementById('originalSize');
    const minifiedSize = document.getElementById('minifiedSize');
    const savings = document.getElementById('savings');

    // Check if all required elements exist
    if (!form || !resultCard || !cssInput || !removeComments || !removeWhitespace || !optimizeColors || 
        !outputFormat || !clearButton || !copyButton || !copyOutputButton || !downloadButton || 
        !loadingSpinner || !minificationResults || !minificationStatus || !minifiedOutput || 
        !originalSize || !minifiedSize || !savings) {
        console.error('Required elements not found. Please check the HTML structure.');
        return;
    }

    // Function to minify CSS
    function minifyCSS(css) {
        try {
            const options = {
                level: {
                    1: {
                        all: true,
                        normalizeUrls: false
                    },
                    2: {
                        all: true,
                        mergeAdjacentRules: true,
                        mergeIntoShorthands: true,
                        mergeMedia: true,
                        mergeNonAdjacentRules: true,
                        mergeSemantically: true,
                        overrideProperties: true,
                        removeEmpty: true,
                        reduceNonAdjacentRules: true,
                        removeDuplicateFontRules: true,
                        removeDuplicateMediaBlocks: true,
                        removeDuplicateRules: true,
                        removeUnusedAtRules: true,
                        restructureRules: true,
                        skipProperties: []
                    }
                },
                format: outputFormat.value === 'beautified' ? 'beautify' : 'none',
                inline: false,
                rebase: false,
                sourceMap: false,
                sourceMapInlineSources: false
            };

            // Configure options based on checkboxes
            if (!removeComments.checked) {
                options.level[1].removeComments = false;
            }
            if (!removeWhitespace.checked) {
                options.level[1].removeWhitespace = false;
            }
            if (!optimizeColors.checked) {
                options.level[1].optimizeColors = false;
            }

            const minifier = new CleanCSS(options);
            const result = minifier.minify(css);

            return {
                success: true,
                css: result.styles,
                stats: result.stats
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
        minificationStatus.innerHTML = '';
        minifiedOutput.innerHTML = '';

        if (result.success) {
            // Display success status
            minificationStatus.innerHTML = '<i class="fas fa-check-circle text-success me-2"></i>Minification successful';
            
            // Display minified CSS
            minifiedOutput.textContent = result.css;
            hljs.highlightElement(minifiedOutput);
            
            // Update statistics
            originalSize.textContent = result.stats.originalSize;
            minifiedSize.textContent = result.stats.minifiedSize;
            const savingsPercent = ((result.stats.originalSize - result.stats.minifiedSize) / result.stats.originalSize * 100).toFixed(1);
            savings.textContent = `${savingsPercent}%`;
            
            // Show copy button
            copyOutputButton.style.display = 'block';
        } else {
            // Display error status
            minificationStatus.innerHTML = '<i class="fas fa-times-circle text-danger me-2"></i>Minification failed';
            
            // Display error details
            minifiedOutput.textContent = result.error;
            
            // Reset statistics
            originalSize.textContent = '0';
            minifiedSize.textContent = '0';
            savings.textContent = '0%';
            
            // Hide copy button
            copyOutputButton.style.display = 'none';
        }
    }

    // Function to download CSS
    function downloadCSS(css, filename) {
        const blob = new Blob([css], { type: 'text/css' });
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
        
        const css = cssInput.value.trim();
        if (!css) {
            alert('Please enter CSS code');
            return;
        }

        // Show loading spinner and hide results
        loadingSpinner.style.display = 'block';
        minificationResults.style.display = 'none';
        resultCard.style.display = 'block';

        try {
            // Minify CSS
            const result = minifyCSS(css);
            
            // Hide loading spinner and show results
            loadingSpinner.style.display = 'none';
            minificationResults.style.display = 'block';
            displayResults(result);
        } catch (error) {
            loadingSpinner.style.display = 'none';
            minificationResults.style.display = 'block';
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
        if (cssInput.value.trim()) {
            copyToClipboard(cssInput.value.trim(), this);
        }
    });

    // Copy button handler for output
    copyOutputButton.addEventListener('click', function() {
        if (minifiedOutput.textContent) {
            copyToClipboard(minifiedOutput.textContent, this);
        }
    });

    // Download button handler
    downloadButton.addEventListener('click', function() {
        if (minifiedOutput.textContent) {
            const filename = `minified-${outputFormat.value}-${new Date().toISOString()}.css`;
            downloadCSS(minifiedOutput.textContent, filename);
        }
    });

    // Initialize syntax highlighting
    hljs.configure({
        languages: ['css']
    });
}); 