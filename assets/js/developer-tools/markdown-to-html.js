document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('converterForm');
    const resultCard = document.getElementById('resultCard');
    const markdownInput = document.getElementById('markdownInput');
    const sanitizeHtml = document.getElementById('sanitizeHtml');
    const highlightCode = document.getElementById('highlightCode');
    const addTableClass = document.getElementById('addTableClass');
    const outputFormat = document.getElementById('outputFormat');
    const clearButton = document.getElementById('clearButton');
    const copyButton = document.getElementById('copyButton');
    const copyOutputButton = document.getElementById('copyOutputButton');
    const downloadButton = document.getElementById('downloadButton');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const conversionResults = document.getElementById('conversionResults');
    const conversionStatus = document.getElementById('conversionStatus');
    const htmlOutput = document.getElementById('htmlOutput');
    const previewOutput = document.getElementById('previewOutput');

    // Check if all required elements exist
    if (!form || !resultCard || !markdownInput || !sanitizeHtml || !highlightCode || !addTableClass || 
        !outputFormat || !clearButton || !copyButton || !copyOutputButton || !downloadButton || 
        !loadingSpinner || !conversionResults || !conversionStatus || !htmlOutput || !previewOutput) {
        console.error('Required elements not found. Please check the HTML structure.');
        return;
    }

    // Configure Marked options
    marked.setOptions({
        gfm: true, // GitHub Flavored Markdown
        breaks: true, // Convert line breaks to <br>
        headerIds: true, // Add IDs to headers
        mangle: false, // Don't escape HTML
        sanitize: false, // Don't sanitize HTML
        smartLists: true, // Use smarter list behavior
        smartypants: true, // Use "smart" typographic punctuation
        xhtml: outputFormat.value === 'xhtml' // Use XHTML self-closing tags
    });

    // Function to convert Markdown to HTML
    function convertMarkdownToHtml(markdown) {
        try {
            // Convert Markdown to HTML
            let html = marked.parse(markdown);

            // Apply additional formatting based on options
            if (addTableClass.checked) {
                html = html.replace(/<table>/g, '<table class="table table-bordered">');
            }

            if (highlightCode.checked) {
                // Apply syntax highlighting to code blocks
                const codeBlocks = html.match(/<pre><code class="language-(\w+)">([\s\S]*?)<\/code><\/pre>/g);
                if (codeBlocks) {
                    codeBlocks.forEach(block => {
                        const language = block.match(/language-(\w+)/)[1];
                        const code = block.match(/<code[^>]*>([\s\S]*?)<\/code>/)[1];
                        const highlighted = hljs.highlight(code, { language }).value;
                        html = html.replace(block, `<pre><code class="language-${language}">${highlighted}</code></pre>`);
                    });
                }
            }

            if (sanitizeHtml.checked) {
                // Sanitize HTML to prevent XSS
                html = DOMPurify.sanitize(html);
            }

            // Format HTML based on output format
            switch (outputFormat.value) {
                case 'xhtml':
                    html = html.replace(/<br>/g, '<br />');
                    html = html.replace(/<img([^>]*)>/g, '<img$1 />');
                    break;
                case 'html5':
                    html = `<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n<title>Converted Markdown</title>\n</head>\n<body>\n${html}\n</body>\n</html>`;
                    break;
            }

            return {
                success: true,
                html: html
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
        htmlOutput.innerHTML = '';
        previewOutput.innerHTML = '';

        if (result.success) {
            // Display success status
            conversionStatus.innerHTML = '<i class="fas fa-check-circle text-success me-2"></i>Conversion successful';
            
            // Display HTML output
            htmlOutput.textContent = result.html;
            hljs.highlightElement(htmlOutput);
            
            // Display preview
            previewOutput.innerHTML = result.html;
            
            // Show copy button
            copyOutputButton.style.display = 'block';
        } else {
            // Display error status
            conversionStatus.innerHTML = '<i class="fas fa-times-circle text-danger me-2"></i>Conversion failed';
            
            // Display error details
            htmlOutput.textContent = result.error;
            
            // Hide copy button
            copyOutputButton.style.display = 'none';
        }
    }

    // Function to download HTML
    function downloadHTML(html, filename) {
        const blob = new Blob([html], { type: 'text/html' });
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
        
        const markdown = markdownInput.value.trim();
        if (!markdown) {
            alert('Please enter Markdown content');
            return;
        }

        // Show loading spinner and hide results
        loadingSpinner.style.display = 'block';
        conversionResults.style.display = 'none';
        resultCard.style.display = 'block';

        try {
            // Convert Markdown to HTML
            const result = convertMarkdownToHtml(markdown);
            
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
        if (markdownInput.value.trim()) {
            copyToClipboard(markdownInput.value.trim(), this);
        }
    });

    // Copy button handler for output
    copyOutputButton.addEventListener('click', function() {
        if (htmlOutput.textContent) {
            copyToClipboard(htmlOutput.textContent, this);
        }
    });

    // Download button handler
    downloadButton.addEventListener('click', function() {
        if (htmlOutput.textContent) {
            const filename = `converted-${outputFormat.value}-${new Date().toISOString()}.html`;
            downloadHTML(htmlOutput.textContent, filename);
        }
    });

    // Output format change handler
    outputFormat.addEventListener('change', function() {
        marked.setOptions({
            xhtml: this.value === 'xhtml'
        });
    });

    // Initialize syntax highlighting
    hljs.configure({
        languages: ['html', 'css', 'javascript', 'markdown']
    });
}); 