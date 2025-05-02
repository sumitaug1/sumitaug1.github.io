document.addEventListener('DOMContentLoaded', function() {
    // Get all required elements
    const form = document.getElementById('metaTagForm');
    const resultCard = document.getElementById('resultCard');
    const generatedCode = document.getElementById('generatedCode');
    const copyButton = document.getElementById('copyButton');
    const pageTitle = document.getElementById('pageTitle');
    const metaDescription = document.getElementById('metaDescription');
    const metaKeywords = document.getElementById('metaKeywords');

    // Check if all required elements exist
    if (!form || !resultCard || !generatedCode || !copyButton || !pageTitle || !metaDescription || !metaKeywords) {
        console.error('Required elements not found. Please check the HTML structure.');
        return;
    }

    // Character count validation
    function updateCharCount(element, maxLength) {
        if (!element) return;
        
        const currentLength = element.value.length;
        const feedbackElement = element.nextElementSibling;
        if (!feedbackElement) return;
        
        const remainingChars = maxLength - currentLength;
        
        if (currentLength > maxLength) {
            feedbackElement.classList.add('text-danger');
            feedbackElement.classList.remove('text-success');
        } else {
            feedbackElement.classList.add('text-success');
            feedbackElement.classList.remove('text-danger');
        }
        
        feedbackElement.textContent = `Characters: ${currentLength}/${maxLength} (${remainingChars} remaining)`;
    }

    // Add character count listeners
    if (pageTitle) {
        pageTitle.addEventListener('input', () => updateCharCount(pageTitle, 60));
    }
    
    if (metaDescription) {
        metaDescription.addEventListener('input', () => updateCharCount(metaDescription, 160));
    }
    
    if (metaKeywords) {
        metaKeywords.addEventListener('input', () => {
            const keywords = metaKeywords.value.split(',').filter(k => k.trim());
            const feedbackElement = metaKeywords.nextElementSibling;
            if (feedbackElement) {
                feedbackElement.textContent = `Keywords: ${keywords.length}/7`;
            }
        });
    }

    // Form validation
    function validateForm() {
        if (!pageTitle || !metaDescription || !metaKeywords) return false;
        
        const titleLength = pageTitle.value.length;
        const descLength = metaDescription.value.length;
        const keywords = metaKeywords.value.split(',').filter(k => k.trim());
        
        if (titleLength < 30 || titleLength > 60) {
            alert('Title should be between 30 and 60 characters');
            return false;
        }
        
        if (descLength < 120 || descLength > 160) {
            alert('Description should be between 120 and 160 characters');
            return false;
        }
        
        if (keywords.length > 7) {
            alert('Please enter maximum 7 keywords');
            return false;
        }
        
        return true;
    }

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (!validateForm()) {
                return;
            }

            const title = pageTitle.value;
            const description = metaDescription.value;
            const keywords = metaKeywords.value;
            const author = document.getElementById('author')?.value || '';
            const robots = document.getElementById('robots')?.value || 'index,follow';
            const canonicalUrl = document.getElementById('canonicalUrl')?.value || '';

            let metaTags = `<!-- Primary Meta Tags -->
<title>${title}</title>
<meta name="title" content="${title}">
<meta name="description" content="${description}">`;

            if (keywords) {
                metaTags += `\n<meta name="keywords" content="${keywords}">`;
            }

            if (author) {
                metaTags += `\n<meta name="author" content="${author}">`;
            }

            metaTags += `\n<meta name="robots" content="${robots}">`;

            if (canonicalUrl) {
                metaTags += `\n<link rel="canonical" href="${canonicalUrl}">`;
            }

            // Add Open Graph tags
            metaTags += `\n\n<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="${canonicalUrl || window.location.href}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">`;

            // Add Twitter Card tags
            metaTags += `\n\n<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="${canonicalUrl || window.location.href}">
<meta property="twitter:title" content="${title}">
<meta property="twitter:description" content="${description}">`;

            if (generatedCode) {
                generatedCode.textContent = metaTags;
            }
            
            if (resultCard) {
                resultCard.style.display = 'block';
            }
        });
    }

    if (copyButton) {
        copyButton.addEventListener('click', function() {
            if (!generatedCode || !generatedCode.textContent) {
                alert('Please generate meta tags first');
                return;
            }

            const text = generatedCode.textContent;
            navigator.clipboard.writeText(text).then(() => {
                const originalText = copyButton.textContent;
                copyButton.textContent = 'Copied!';
                setTimeout(() => {
                    copyButton.textContent = originalText;
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
                alert('Failed to copy to clipboard. Please try again.');
            });
        });
    }

    // Initialize character counts
    if (pageTitle) updateCharCount(pageTitle, 60);
    if (metaDescription) updateCharCount(metaDescription, 160);
    if (metaKeywords) metaKeywords.dispatchEvent(new Event('input'));
}); 