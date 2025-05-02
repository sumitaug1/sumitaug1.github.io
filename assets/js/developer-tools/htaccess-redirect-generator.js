document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('redirectForm');
    const resultCard = document.getElementById('resultCard');
    const redirectType = document.getElementById('redirectType');
    const domainFields = document.getElementById('domainFields');
    const urlFields = document.getElementById('urlFields');
    const sourceDomain = document.getElementById('sourceDomain');
    const targetDomain = document.getElementById('targetDomain');
    const sourceUrl = document.getElementById('sourceUrl');
    const targetUrl = document.getElementById('targetUrl');
    const redirectCode = document.getElementById('redirectCode');
    const preserveQueryString = document.getElementById('preserveQueryString');
    const forceRedirect = document.getElementById('forceRedirect');
    const clearButton = document.getElementById('clearButton');
    const copyButton = document.getElementById('copyButton');
    const downloadButton = document.getElementById('downloadButton');
    const redirectOutput = document.getElementById('redirectOutput');
    const redirectExplanation = document.getElementById('redirectExplanation');

    // Check if all required elements exist
    if (!form || !resultCard || !redirectType || !domainFields || !urlFields || !sourceDomain || !targetDomain || 
        !sourceUrl || !targetUrl || !redirectCode || !preserveQueryString || !forceRedirect || !clearButton || 
        !copyButton || !downloadButton || !redirectOutput || !redirectExplanation) {
        console.error('Required elements not found. Please check the HTML structure.');
        return;
    }

    // Function to show/hide fields based on redirect type
    function updateFields() {
        const type = redirectType.value;
        domainFields.style.display = type === 'domain' ? 'block' : 'none';
        urlFields.style.display = type === 'url' ? 'block' : 'none';
    }

    // Function to generate redirect rules
    function generateRedirectRules() {
        const type = redirectType.value;
        const code = redirectCode.value;
        const preserveQS = preserveQueryString.checked;
        const force = forceRedirect.checked;
        let rules = '';
        let explanation = '';

        switch (type) {
            case 'domain':
                if (!sourceDomain.value || !targetDomain.value) {
                    throw new Error('Please enter both source and target domains');
                }
                rules = `RewriteEngine On\nRewriteCond %{HTTP_HOST} ^${sourceDomain.value}$ [OR]\nRewriteCond %{HTTP_HOST} ^www\\.${sourceDomain.value}$\nRewriteRule ^(.*)$ http${force ? 's' : ''}://${targetDomain.value}/$1 [R=${code},L${preserveQS ? ',QSA' : ''}]`;
                explanation = `This rule redirects all traffic from ${sourceDomain.value} to ${targetDomain.value} with a ${code} status code.`;
                break;

            case 'url':
                if (!sourceUrl.value || !targetUrl.value) {
                    throw new Error('Please enter both source and target URLs');
                }
                rules = `RewriteEngine On\nRewriteRule ^${sourceUrl.value}$ ${targetUrl.value} [R=${code},L${preserveQS ? ',QSA' : ''}]`;
                explanation = `This rule redirects ${sourceUrl.value} to ${targetUrl.value} with a ${code} status code.`;
                break;

            case 'www':
                rules = `RewriteEngine On\nRewriteCond %{HTTP_HOST} ^www\\.(.+)$ [NC]\nRewriteRule ^(.*)$ http${force ? 's' : ''}://%1/$1 [R=${code},L${preserveQS ? ',QSA' : ''}]`;
                explanation = 'This rule redirects www to non-www version of your domain.';
                break;

            case 'nonwww':
                rules = `RewriteEngine On\nRewriteCond %{HTTP_HOST} !^www\\. [NC]\nRewriteRule ^(.*)$ http${force ? 's' : ''}://www.%{HTTP_HOST}/$1 [R=${code},L${preserveQS ? ',QSA' : ''}]`;
                explanation = 'This rule redirects non-www to www version of your domain.';
                break;

            case 'https':
                rules = `RewriteEngine On\nRewriteCond %{HTTPS} off\nRewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [R=${code},L${preserveQS ? ',QSA' : ''}]`;
                explanation = 'This rule redirects HTTP to HTTPS.';
                break;

            case 'custom':
                rules = `RewriteEngine On\n# Add your custom redirect rules here\n# Example: RewriteRule ^old-path$ /new-path [R=${code},L${preserveQS ? ',QSA' : ''}]`;
                explanation = 'Add your custom redirect rules following the example format.';
                break;

            default:
                throw new Error('Invalid redirect type');
        }

        return {
            rules: rules,
            explanation: explanation
        };
    }

    // Function to display results
    function displayResults(result) {
        // Clear previous results
        redirectOutput.innerHTML = '';
        redirectExplanation.innerHTML = '';

        // Display redirect rules
        redirectOutput.textContent = result.rules;
        hljs.highlightElement(redirectOutput);
        
        // Display explanation
        redirectExplanation.textContent = result.explanation;
    }

    // Function to download .htaccess
    function downloadHtaccess(content, filename) {
        const blob = new Blob([content], { type: 'text/plain' });
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

    // Redirect type change handler
    redirectType.addEventListener('change', updateFields);

    // Form submission handler
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        try {
            // Generate redirect rules
            const result = generateRedirectRules();
            
            // Display results
            resultCard.style.display = 'block';
            displayResults(result);
        } catch (error) {
            alert(error.message);
        }
    });

    // Clear button handler
    clearButton.addEventListener('click', function() {
        form.reset();
        resultCard.style.display = 'none';
        updateFields();
    });

    // Copy button handler
    copyButton.addEventListener('click', function() {
        if (redirectOutput.textContent) {
            copyToClipboard(redirectOutput.textContent, this);
        }
    });

    // Download button handler
    downloadButton.addEventListener('click', function() {
        if (redirectOutput.textContent) {
            const filename = `.htaccess-${new Date().toISOString()}`;
            downloadHtaccess(redirectOutput.textContent, filename);
        }
    });

    // Initialize fields
    updateFields();

    // Initialize syntax highlighting
    hljs.configure({
        languages: ['apache']
    });
}); 