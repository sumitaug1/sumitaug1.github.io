document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('sitemapForm');
    const resultCard = document.getElementById('resultCard');
    const websiteUrl = document.getElementById('websiteUrl');
    const urls = document.getElementById('urls');
    const defaultPriority = document.getElementById('defaultPriority');
    const defaultChangeFreq = document.getElementById('defaultChangeFreq');
    const includeLastMod = document.getElementById('includeLastMod');
    const clearButton = document.getElementById('clearButton');
    const downloadButton = document.getElementById('downloadButton');
    const generatedSitemap = document.getElementById('generatedSitemap');

    // Check if all required elements exist
    if (!form || !resultCard || !websiteUrl || !urls || !defaultPriority || 
        !defaultChangeFreq || !includeLastMod || !clearButton || !downloadButton || 
        !generatedSitemap) {
        console.error('Required elements not found. Please check the HTML structure.');
        return;
    }

    // Function to clean and validate URLs
    function cleanUrls(urlList, baseUrl) {
        return urlList
            .split('\n')
            .map(url => url.trim())
            .filter(url => url.length > 0)
            .map(url => {
                // If URL is relative, make it absolute
                if (url.startsWith('/')) {
                    return baseUrl.replace(/\/$/, '') + url;
                }
                // If URL is already absolute, return as is
                if (url.startsWith('http')) {
                    return url;
                }
                // Otherwise, append to base URL
                return baseUrl.replace(/\/$/, '') + '/' + url;
            });
    }

    // Function to generate XML sitemap
    function generateSitemap(urls, baseUrl, priority, changeFreq, includeLastMod) {
        const today = new Date().toISOString().split('T')[0];
        
        let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

        urls.forEach(url => {
            xml += `
  <url>
    <loc>${url}</loc>
    <priority>${priority}</priority>
    <changefreq>${changeFreq}</changefreq>`;
            
            if (includeLastMod) {
                xml += `
    <lastmod>${today}</lastmod>`;
            }
            
            xml += `
  </url>`;
        });

        xml += `
</urlset>`;

        return xml;
    }

    // Function to download XML file
    function downloadXML(xml, filename) {
        const blob = new Blob([xml], { type: 'application/xml' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }

    // Form submission handler
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const baseUrl = websiteUrl.value.trim();
        if (!baseUrl) {
            alert('Please enter your website URL');
            return;
        }

        const urlList = cleanUrls(urls.value, baseUrl);
        if (urlList.length === 0) {
            alert('Please enter at least one URL');
            return;
        }

        const priority = defaultPriority.value;
        const changeFreq = defaultChangeFreq.value;
        const lastMod = includeLastMod.checked;

        const sitemap = generateSitemap(urlList, baseUrl, priority, changeFreq, lastMod);
        generatedSitemap.textContent = sitemap;
        resultCard.style.display = 'block';
    });

    // Clear button handler
    clearButton.addEventListener('click', function() {
        form.reset();
        resultCard.style.display = 'none';
    });

    // Download button handler
    downloadButton.addEventListener('click', function() {
        if (!generatedSitemap.textContent) {
            alert('Please generate a sitemap first');
            return;
        }

        const domain = new URL(websiteUrl.value).hostname;
        const filename = `sitemap-${domain}.xml`;
        downloadXML(generatedSitemap.textContent, filename);
    });

    // URL validation
    websiteUrl.addEventListener('input', function() {
        const url = this.value.trim();
        if (url && !url.startsWith('http')) {
            this.value = 'https://' + url;
        }
    });
}); 