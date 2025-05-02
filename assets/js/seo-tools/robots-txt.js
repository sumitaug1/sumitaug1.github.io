document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('robotsTxtForm');
    const resultCard = document.getElementById('resultCard');
    const websiteUrl = document.getElementById('websiteUrl');
    const sitemapUrl = document.getElementById('sitemapUrl');
    const allowAll = document.getElementById('allowAll');
    const disallowPaths = document.getElementById('disallowPaths');
    const addPathButton = document.getElementById('addPath');
    const crawlDelay = document.getElementById('crawlDelay');
    const crawlDelayValue = document.getElementById('crawlDelayValue');
    const clearButton = document.getElementById('clearButton');
    const downloadButton = document.getElementById('downloadButton');
    const generatedRobotsTxt = document.getElementById('generatedRobotsTxt');

    // Check if all required elements exist
    if (!form || !resultCard || !websiteUrl || !sitemapUrl || !allowAll || 
        !disallowPaths || !addPathButton || !crawlDelay || !crawlDelayValue || 
        !clearButton || !downloadButton || !generatedRobotsTxt) {
        console.error('Required elements not found. Please check the HTML structure.');
        return;
    }

    // Function to add a new path input
    function addPathInput() {
        const inputGroup = document.createElement('div');
        inputGroup.className = 'input-group mb-2';
        inputGroup.innerHTML = `
            <input type="text" class="form-control" placeholder="/path/">
            <button type="button" class="btn btn-outline-danger remove-path">
                <i class="fas fa-times"></i>
            </button>
        `;
        disallowPaths.insertBefore(inputGroup, addPathButton);
    }

    // Function to remove a path input
    function removePathInput(button) {
        button.closest('.input-group').remove();
    }

    // Function to get all disallow paths
    function getDisallowPaths() {
        return Array.from(disallowPaths.querySelectorAll('input[type="text"]'))
            .map(input => input.value.trim())
            .filter(path => path.length > 0);
    }

    // Function to generate robots.txt content
    function generateRobotsTxt(baseUrl, sitemap, allowAllCrawlers, paths, delay) {
        let content = `# robots.txt for ${baseUrl}\n\n`;

        // Add user-agent rules
        content += `User-agent: *\n`;
        
        if (allowAllCrawlers) {
            content += `Allow: /\n`;
        }

        // Add disallow paths
        paths.forEach(path => {
            content += `Disallow: ${path}\n`;
        });

        // Add crawl delay if set
        if (delay) {
            content += `Crawl-delay: ${delay}\n`;
        }

        // Add sitemap if provided
        if (sitemap) {
            content += `\nSitemap: ${sitemap}\n`;
        }

        return content;
    }

    // Function to download robots.txt file
    function downloadRobotsTxt(content, filename) {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }

    // Add path button handler
    addPathButton.addEventListener('click', addPathInput);

    // Remove path button handlers
    disallowPaths.addEventListener('click', function(e) {
        if (e.target.closest('.remove-path')) {
            removePathInput(e.target.closest('.remove-path'));
        }
    });

    // Crawl delay checkbox handler
    crawlDelay.addEventListener('change', function() {
        crawlDelayValue.style.display = this.checked ? 'block' : 'none';
    });

    // Form submission handler
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const baseUrl = websiteUrl.value.trim();
        if (!baseUrl) {
            alert('Please enter your website URL');
            return;
        }

        const sitemap = sitemapUrl.value.trim();
        const allowAllCrawlers = allowAll.checked;
        const paths = getDisallowPaths();
        const delay = crawlDelay.checked ? crawlDelayValue.querySelector('input').value : null;

        const robotsTxt = generateRobotsTxt(baseUrl, sitemap, allowAllCrawlers, paths, delay);
        generatedRobotsTxt.textContent = robotsTxt;
        resultCard.style.display = 'block';
    });

    // Clear button handler
    clearButton.addEventListener('click', function() {
        form.reset();
        resultCard.style.display = 'none';
        crawlDelayValue.style.display = 'none';
        
        // Reset disallow paths to default
        const defaultPaths = ['/admin/', '/private/'];
        const pathInputs = disallowPaths.querySelectorAll('.input-group');
        pathInputs.forEach((group, index) => {
            if (index < defaultPaths.length) {
                group.querySelector('input').value = defaultPaths[index];
            } else {
                group.remove();
            }
        });
    });

    // Download button handler
    downloadButton.addEventListener('click', function() {
        if (!generatedRobotsTxt.textContent) {
            alert('Please generate a robots.txt file first');
            return;
        }

        const domain = new URL(websiteUrl.value).hostname;
        const filename = `robots-${domain}.txt`;
        downloadRobotsTxt(generatedRobotsTxt.textContent, filename);
    });

    // URL validation
    websiteUrl.addEventListener('input', function() {
        const url = this.value.trim();
        if (url && !url.startsWith('http')) {
            this.value = 'https://' + url;
        }
    });

    sitemapUrl.addEventListener('input', function() {
        const url = this.value.trim();
        if (url && !url.startsWith('http')) {
            this.value = 'https://' + url;
        }
    });
}); 