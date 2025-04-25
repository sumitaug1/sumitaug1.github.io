// Tool categories and their tools
const toolCategories = {
    'Image Tools': [
        {
            name: 'Image to PNG Converter',
            path: 'tools/image-tools/image-to-png.html',
            icon: 'fa-image',
            description: 'Convert any image format to PNG with quality control and resizing options.',
            category: 'Converters',
            popularity: 95
        },
        {
            name: 'Image to JPG Converter',
            path: 'tools/image-tools/image-to-jpg.html',
            icon: 'fa-image',
            description: 'Convert images to JPG format with customizable quality settings.',
            category: 'Converters',
            popularity: 90
        },
        {
            name: 'Image Resizer',
            path: 'tools/image-tools/image-resizer.html',
            icon: 'fa-expand',
            description: 'Resize images while maintaining aspect ratio or custom dimensions.',
            category: 'Editing',
            popularity: 85
        },
        {
            name: 'Image Compressor',
            path: 'tools/image-tools/image-compressor.html',
            icon: 'fa-compress',
            description: 'Reduce image file size without significant quality loss.',
            category: 'Optimization',
            popularity: 88
        },
        {
            name: 'Image Cropper',
            path: 'tools/image-tools/image-cropper.html',
            icon: 'fa-crop',
            description: 'Crop images to specific dimensions or aspect ratios.',
            category: 'Editing',
            popularity: 82
        },
        {
            name: 'Base64 Image Converter',
            path: 'tools/image-tools/base64-image.html',
            icon: 'fa-code',
            description: 'Convert images to Base64 format and vice versa.',
            category: 'Converters',
            popularity: 75
        },
        {
            name: 'WebP to PNG Converter',
            path: 'tools/image-tools/webp-to-png.html',
            icon: 'fa-image',
            description: 'Convert WebP images to PNG format with high quality.',
            category: 'Converters',
            popularity: 80
        },
        {
            name: 'GIF Maker',
            path: 'tools/image-tools/gif-maker.html',
            icon: 'fa-film',
            description: 'Create animated GIFs from images or videos.',
            category: 'Animation',
            popularity: 78
        },
        {
            name: 'QR Code Generator',
            path: 'tools/image-tools/qr-code-generator.html',
            icon: 'fa-qrcode',
            description: 'Generate QR codes from text, URLs, or contact information.',
            category: 'Generation',
            popularity: 92
        },
        {
            name: 'Screenshot to PDF',
            path: 'tools/image-tools/screenshot-to-pdf.html',
            icon: 'fa-file-pdf',
            description: 'Convert screenshots to PDF documents.',
            category: 'Converters',
            popularity: 85
        },
        {
            name: 'Image Rotator',
            path: 'tools/image-tools/image-rotator.html',
            icon: 'fa-sync-alt',
            description: 'Rotate and flip your images with ease.',
            category: 'Editing',
            popularity: 80
        }
    ],
    'SEO Tools': [
        { name: 'Meta Tag Generator', path: '/tools/meta-tag-generator.html', icon: 'fa-tags' },
        { name: 'Keyword Density Checker', path: '/tools/keyword-density.html', icon: 'fa-chart-bar' },
        { name: 'Sitemap Generator', path: '/tools/sitemap-generator.html', icon: 'fa-sitemap' },
        { name: 'Robots.txt Generator', path: '/tools/robots-txt.html', icon: 'fa-robot' },
        { name: 'Google Index Checker', path: '/tools/google-index.html', icon: 'fa-google' },
        { name: 'Domain Authority Checker', path: '/tools/domain-authority.html', icon: 'fa-globe' },
        { name: 'Backlink Checker', path: '/tools/backlink-checker.html', icon: 'fa-link' },
        { name: 'Page Speed Checker', path: '/tools/page-speed.html', icon: 'fa-tachometer-alt' },
        { name: 'XML Sitemap Validator', path: '/tools/xml-sitemap.html', icon: 'fa-check-circle' },
        { name: 'Mobile-Friendly Test', path: '/tools/mobile-friendly.html', icon: 'fa-mobile-alt' }
    ],
    'Text Tools': [
        { name: 'Word Counter', path: '/tools/word-counter.html', icon: 'fa-calculator' },
        { name: 'Character Counter', path: '/tools/character-counter.html', icon: 'fa-text-width' },
        { name: 'Case Converter', path: '/tools/case-converter.html', icon: 'fa-font' },
        { name: 'Plagiarism Checker', path: '/tools/plagiarism-checker.html', icon: 'fa-copy' },
        { name: 'Grammar Checker', path: '/tools/grammar-checker.html', icon: 'fa-spell-check' },
        { name: 'Text to Speech', path: '/tools/text-to-speech.html', icon: 'fa-volume-up' },
        { name: 'Speech to Text', path: '/tools/speech-to-text.html', icon: 'fa-microphone' },
        { name: 'URL Encoder/Decoder', path: '/tools/url-encoder.html', icon: 'fa-link' },
        { name: 'Fancy Text Generator', path: '/tools/fancy-text.html', icon: 'fa-magic' },
        { name: 'Random Text Generator', path: '/tools/random-text.html', icon: 'fa-random' }
    ],
    'Developer Tools': [
        { name: 'JSON Formatter', path: '/tools/json-formatter.html', icon: 'fa-code' },
        { name: 'HTML to Markdown', path: '/tools/html-to-markdown.html', icon: 'fa-file-code' },
        { name: 'CSS Minifier', path: '/tools/css-minifier.html', icon: 'fa-css3' },
        { name: 'JavaScript Minifier', path: '/tools/js-minifier.html', icon: 'fa-js' },
        { name: 'SQL Formatter', path: '/tools/sql-formatter.html', icon: 'fa-database' },
        { name: 'HTACCESS Generator', path: '/tools/htaccess-generator.html', icon: 'fa-server' },
        { name: 'Markdown to HTML', path: '/tools/markdown-to-html.html', icon: 'fa-file-code' },
        { name: 'Color Picker', path: '/tools/color-picker.html', icon: 'fa-palette' },
        { name: 'Base64 Encoder/Decoder', path: '/tools/base64.html', icon: 'fa-code' },
        { name: 'IP Address Lookup', path: '/tools/ip-lookup.html', icon: 'fa-network-wired' }
    ],
    'Calculators': [
        { name: 'Percentage Calculator', path: '/tools/percentage-calculator.html', icon: 'fa-percent' },
        { name: 'Age Calculator', path: '/tools/age-calculator.html', icon: 'fa-birthday-cake' },
        { name: 'BMI Calculator', path: '/tools/bmi-calculator.html', icon: 'fa-weight' },
        { name: 'Loan EMI Calculator', path: '/tools/loan-emi.html', icon: 'fa-calculator' },
        { name: 'Scientific Calculator', path: '/tools/scientific-calculator.html', icon: 'fa-square-root-alt' },
        { name: 'Discount Calculator', path: '/tools/discount-calculator.html', icon: 'fa-tag' },
        { name: 'Currency Converter', path: '/tools/currency-converter.html', icon: 'fa-money-bill-wave' },
        { name: 'Time Zone Converter', path: '/tools/time-zone.html', icon: 'fa-clock' },
        { name: 'Binary to Decimal', path: '/tools/binary-decimal.html', icon: 'fa-hashtag' },
        { name: 'Tip Calculator', path: '/tools/tip-calculator.html', icon: 'fa-coins' }
    ],
    'Unit Converters': [
        { name: 'Length Converter', path: '/tools/length-converter.html', icon: 'fa-ruler' },
        { name: 'Weight Converter', path: '/tools/weight-converter.html', icon: 'fa-balance-scale' },
        { name: 'Speed Converter', path: '/tools/speed-converter.html', icon: 'fa-tachometer-alt' },
        { name: 'Temperature Converter', path: '/tools/temperature-converter.html', icon: 'fa-thermometer-half' },
        { name: 'Volume Converter', path: '/tools/volume-converter.html', icon: 'fa-flask' },
        { name: 'Data Storage Converter', path: '/tools/data-storage.html', icon: 'fa-hdd' },
        { name: 'Energy Converter', path: '/tools/energy-converter.html', icon: 'fa-bolt' },
        { name: 'Pressure Converter', path: '/tools/pressure-converter.html', icon: 'fa-compress-arrows-alt' },
        { name: 'Fuel Efficiency Converter', path: '/tools/fuel-efficiency.html', icon: 'fa-gas-pump' },
        { name: 'Angle Converter', path: '/tools/angle-converter.html', icon: 'fa-angle-double-right' }
    ],
    'Security Tools': [
        { name: 'MD5 Hash Generator', path: '/tools/md5-generator.html', icon: 'fa-hashtag' },
        { name: 'SHA256 Hash Generator', path: '/tools/sha256-generator.html', icon: 'fa-hashtag' },
        { name: 'Password Generator', path: '/tools/password-generator.html', icon: 'fa-key' },
        { name: 'Random String Generator', path: '/tools/random-string.html', icon: 'fa-random' },
        { name: 'URL Shortener', path: '/tools/url-shortener.html', icon: 'fa-link' },
        { name: 'IP Geolocation', path: '/tools/ip-geolocation.html', icon: 'fa-map-marker-alt' },
        { name: 'SSL Certificate Checker', path: '/tools/ssl-checker.html', icon: 'fa-shield-alt' },
        { name: 'Whois Lookup', path: '/tools/whois.html', icon: 'fa-search' },
        { name: 'HTTP Headers Checker', path: '/tools/http-headers.html', icon: 'fa-heading' },
        { name: 'Privacy Policy Generator', path: '/tools/privacy-policy.html', icon: 'fa-file-contract' }
    ],
    'Social Media Tools': [
        { name: 'YouTube Thumbnail Downloader', path: '/tools/youtube-thumbnail.html', icon: 'fa-youtube' },
        { name: 'Instagram Photo Downloader', path: '/tools/instagram-downloader.html', icon: 'fa-instagram' },
        { name: 'Twitter Video Downloader', path: '/tools/twitter-downloader.html', icon: 'fa-twitter' },
        { name: 'Facebook Video Downloader', path: '/tools/facebook-downloader.html', icon: 'fa-facebook' },
        { name: 'TikTok Video Downloader', path: '/tools/tiktok-downloader.html', icon: 'fa-music' },
        { name: 'YouTube Tags Extractor', path: '/tools/youtube-tags.html', icon: 'fa-tags' },
        { name: 'Hashtag Generator', path: '/tools/hashtag-generator.html', icon: 'fa-hashtag' },
        { name: 'Social Media Post Generator', path: '/tools/social-post.html', icon: 'fa-share-alt' },
        { name: 'Emoji Keyboard', path: '/tools/emoji-keyboard.html', icon: 'fa-smile' },
        { name: 'Twitter Character Counter', path: '/tools/twitter-counter.html', icon: 'fa-twitter' }
    ],
    'Miscellaneous': [
        { name: 'Barcode Generator', path: '/tools/barcode-generator.html', icon: 'fa-barcode' },
        { name: 'Meme Generator', path: '/tools/meme-generator.html', icon: 'fa-laugh' },
        { name: 'Resume Builder', path: '/tools/resume-builder.html', icon: 'fa-file-alt' },
        { name: 'Invoice Generator', path: '/tools/invoice-generator.html', icon: 'fa-file-invoice' },
        { name: 'Business Name Generator', path: '/tools/business-name.html', icon: 'fa-building' },
        { name: 'Lottery Number Generator', path: '/tools/lottery-generator.html', icon: 'fa-ticket-alt' },
        { name: 'Flip a Coin', path: '/tools/flip-coin.html', icon: 'fa-coins' },
        { name: 'Random Number Generator', path: '/tools/random-number.html', icon: 'fa-dice' },
        { name: 'Dice Roller', path: '/tools/dice-roller.html', icon: 'fa-dice' },
        { name: 'Internet Speed Test', path: '/tools/speed-test.html', icon: 'fa-tachometer-alt' }
    ]
};

// Popular tools (first 10 tools from each category)
const popularTools = [
    ...toolCategories['Image Tools'].slice(0, 2),
    ...toolCategories['SEO Tools'].slice(0, 2),
    ...toolCategories['Text Tools'].slice(0, 2),
    ...toolCategories['Developer Tools'].slice(0, 2),
    ...toolCategories['Calculators'].slice(0, 2)
];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're running locally
    const isLocal = window.location.protocol === 'file:';
    
    if (!isLocal) {
        // Load header and footer only if not running locally
        loadHeader();
        loadFooter();
    } else {
        // Provide local fallback content
        const headerContainer = document.getElementById('header-container');
        if (headerContainer) {
            headerContainer.innerHTML = `
                <nav class="navbar navbar-expand-lg navbar-light bg-light">
                    <div class="container">
                        <a class="navbar-brand" href="/">Multi-Tools Hub</a>
                        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                            <span class="navbar-toggler-icon"></span>
                        </button>
                        <div class="collapse navbar-collapse" id="navbarNav">
                            <ul class="navbar-nav">
                                <li class="nav-item">
                                    <a class="nav-link" href="/">Home</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            `;
        }
        
        const footerContainer = document.getElementById('footer-container');
        if (footerContainer) {
            footerContainer.innerHTML = `
                <footer class="bg-light py-3 mt-5">
                    <div class="container text-center">
                        <p class="mb-0">&copy; ${new Date().getFullYear()} Multi-Tools Hub. All rights reserved.</p>
                    </div>
                </footer>
            `;
        }
    }
    
    // Always load categories and tools, regardless of local or server
    loadCategories();
    loadPopularTools();
    loadAllTools();
    setupSearch();
});

// Load header
function loadHeader() {
    const headerContainer = document.getElementById('header-container');
    if (!headerContainer) return;

    fetch('/components/header.html')
        .then(response => response.text())
        .then(html => {
            headerContainer.innerHTML = html;
        })
        .catch(error => {
            console.warn('Error loading header:', error);
            // Provide fallback header content
            headerContainer.innerHTML = `
                <nav class="navbar navbar-expand-lg navbar-light bg-light">
                    <div class="container">
                        <a class="navbar-brand" href="/">Multi-Tools Hub</a>
                        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                            <span class="navbar-toggler-icon"></span>
                        </button>
                        <div class="collapse navbar-collapse" id="navbarNav">
                            <ul class="navbar-nav">
                                <li class="nav-item">
                                    <a class="nav-link" href="/">Home</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            `;
        });
}

// Load footer
function loadFooter() {
    const footerContainer = document.getElementById('footer-container');
    if (!footerContainer) return;

    fetch('/components/footer.html')
        .then(response => response.text())
        .then(html => {
            footerContainer.innerHTML = html;
        })
        .catch(error => {
            console.warn('Error loading footer:', error);
            // Provide fallback footer content
            footerContainer.innerHTML = `
                <footer class="bg-light py-3 mt-5">
                    <div class="container text-center">
                        <p class="mb-0">&copy; ${new Date().getFullYear()} Multi-Tools Hub. All rights reserved.</p>
                    </div>
                </footer>
            `;
        });
}

// Load categories
function loadCategories() {
    const container = document.getElementById('categories-container');
    if (!container) return;

    container.innerHTML = '';

    Object.entries(toolCategories).forEach(([category, tools]) => {
        const categoryCard = document.createElement('div');
        categoryCard.className = 'col-md-6 col-lg-4';
        
        categoryCard.innerHTML = `
            <div class="card h-100">
                <div class="card-body">
                    <h5 class="card-title">${category}</h5>
                    <ul class="list-unstyled">
                        ${tools.slice(0, 5).map(tool => `
                            <li>
                                <a href="${tool.path}" class="text-decoration-none">
                                    <i class="fas ${tool.icon} me-2"></i>
                                    ${tool.name}
                                </a>
                            </li>
                        `).join('')}
                    </ul>
                    ${tools.length > 5 ? `
                        <a href="#" class="btn btn-sm btn-outline-primary mt-2" data-category="${category}">
                            View All ${tools.length} Tools
                        </a>
                    ` : ''}
                </div>
            </div>
        `;
        
        container.appendChild(categoryCard);
    });

    // Add click handler for "View All" buttons
    document.querySelectorAll('[data-category]').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const category = e.target.dataset.category;
            const tools = toolCategories[category];
            
            // Create modal content
            const modalContent = `
                <div class="modal fade" id="toolsModal" tabindex="-1">
                    <div class="modal-dialog modal-lg">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">${category} Tools</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div class="modal-body">
                                <div class="row g-3">
                                    ${tools.map(tool => `
                                        <div class="col-md-6">
                                            <div class="card h-100">
                                                <div class="card-body">
                                                    <h6 class="card-title">
                                                        <i class="fas ${tool.icon} me-2"></i>
                                                        ${tool.name}
                                                    </h6>
                                                    <p class="card-text small text-muted">${tool.description || ''}</p>
                                                    <a href="${tool.path}" class="btn btn-primary btn-sm">Use Tool</a>
                                                </div>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            // Add modal to body and show it
            document.body.insertAdjacentHTML('beforeend', modalContent);
            const modal = new bootstrap.Modal(document.getElementById('toolsModal'));
            modal.show();
            
            // Remove modal from DOM after it's hidden
            document.getElementById('toolsModal').addEventListener('hidden.bs.modal', function () {
                this.remove();
            });
        });
    });
}

// Load popular tools
function loadPopularTools() {
    const container = document.getElementById('popular-tools-container');
    if (!container) return;

    container.innerHTML = '';

    // Get all tools and sort by popularity
    const allTools = Object.values(toolCategories).flat();
    const popularTools = allTools
        .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
        .slice(0, 6);

    popularTools.forEach(tool => {
        const toolCard = document.createElement('div');
        toolCard.className = 'col-md-6 col-lg-4';
        
        toolCard.innerHTML = `
            <div class="card h-100">
                <div class="card-body">
                    <h5 class="card-title">
                        <i class="fas ${tool.icon} me-2"></i>
                        ${tool.name}
                    </h5>
                    <p class="card-text">${tool.description || ''}</p>
                    <a href="${tool.path}" class="btn btn-primary">Use Tool</a>
                </div>
            </div>
        `;
        
        container.appendChild(toolCard);
    });
}

// Load all tools
function loadAllTools() {
    const allTools = [
        // Image Tools
        {
            name: 'Image Compressor',
            description: 'Compress your images to reduce file size while maintaining quality.',
            icon: 'fas fa-compress-alt',
            url: 'tools/image-tools/image-compressor.html',
            category: 'Image Tools',
            popularity: 90
        },
        {
            name: 'Image Cropper',
            description: 'Crop your images to the perfect size and aspect ratio.',
            icon: 'fas fa-crop-alt',
            url: 'tools/image-tools/image-cropper.html',
            category: 'Image Tools',
            popularity: 85
        },
        {
            name: 'Image Rotator',
            description: 'Rotate and flip your images with ease.',
            icon: 'fas fa-sync-alt',
            url: 'tools/image-tools/image-rotator.html',
            category: 'Image Tools',
            popularity: 80
        },
        // ... existing tools ...
    ];

    const toolsContainer = document.getElementById('all-tools-container');
    const imageToolsContainer = document.getElementById('image-tools-container');
    
    if (toolsContainer) {
        toolsContainer.innerHTML = allTools.map(tool => `
            <div class="col-md-4 col-lg-3">
                <div class="tool-card">
                    <div class="tool-icon">
                        <i class="${tool.icon}"></i>
                    </div>
                    <div class="tool-info">
                        <h3>${tool.name}</h3>
                        <p>${tool.description}</p>
                        <span class="tool-category">${tool.category}</span>
                    </div>
                    <a href="${tool.url}" class="btn btn-primary">Use Tool</a>
                </div>
            </div>
        `).join('');
    }

    if (imageToolsContainer) {
        const imageTools = allTools.filter(tool => tool.category === 'Image Tools');
        imageToolsContainer.innerHTML = imageTools.map(tool => `
            <div class="col-md-4 col-lg-3">
                <div class="tool-card">
                    <div class="tool-icon">
                        <i class="${tool.icon}"></i>
                    </div>
                    <div class="tool-info">
                        <h3>${tool.name}</h3>
                        <p>${tool.description}</p>
                    </div>
                    <a href="${tool.url}" class="btn btn-primary">Use Tool</a>
                </div>
            </div>
        `).join('');
    }
}

// Setup search functionality
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    const headerSearchInput = document.getElementById('headerSearchInput');
    const searchForm = document.getElementById('searchForm');
    const headerSearchForm = document.getElementById('headerSearchForm');
    let searchTimeout = null;
    const searchHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    const searchAnalytics = JSON.parse(localStorage.getItem('searchAnalytics') || '{}');
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Focus search on Ctrl/Cmd + K
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            if (searchInput) searchInput.focus();
            if (headerSearchInput) headerSearchInput.focus();
        }
        // Clear search on Escape
        if (e.key === 'Escape') {
            if (searchInput) {
                searchInput.value = '';
                loadAllTools();
            }
            if (headerSearchInput) {
                headerSearchInput.value = '';
                loadAllTools();
            }
        }
    });
    
    function performSearch(query) {
        query = query.toLowerCase().trim();
        const results = [];
        const seenTools = new Set(); // Track seen tool names
        
        // Track search analytics
        if (query) {
            searchAnalytics[query] = (searchAnalytics[query] || 0) + 1;
            localStorage.setItem('searchAnalytics', JSON.stringify(searchAnalytics));
        }
        
        // Add to search history if not empty
        if (query && !searchHistory.includes(query)) {
            searchHistory.unshift(query);
            if (searchHistory.length > 5) searchHistory.pop();
            localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
        }
        
        Object.entries(toolCategories).forEach(([category, tools]) => {
            tools.forEach(tool => {
                // Skip if we've already seen this tool
                if (seenTools.has(tool.name)) return;
                
                // Search in name, category, and description
                const searchText = `${tool.name} ${category} ${tool.description || ''}`.toLowerCase();
                if (searchText.includes(query)) {
                    // Calculate match score
                    const nameMatch = tool.name.toLowerCase().includes(query) ? 3 : 0;
                    const categoryMatch = category.toLowerCase().includes(query) ? 2 : 0;
                    const descriptionMatch = (tool.description || '').toLowerCase().includes(query) ? 1 : 0;
                    const popularity = searchAnalytics[tool.name] || 0;
                    const matchScore = nameMatch + categoryMatch + descriptionMatch + (popularity * 0.1);
                    
                    results.push({ 
                        ...tool, 
                        category,
                        matchScore,
                        popularity
                    });
                    
                    // Mark this tool as seen
                    seenTools.add(tool.name);
                }
            });
        });
        
        // Sort results by match score and popularity
        return results.sort((a, b) => b.matchScore - a.matchScore);
    }
    
    function showLoading() {
        const container = document.getElementById('all-tools-container');
        container.innerHTML = `
            <div class="col-12 text-center">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-2">Searching tools...</p>
            </div>
        `;
    }
    
    function highlightText(text, query) {
        if (!query) return text;
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }
    
    function displaySearchResults(results) {
        const container = document.getElementById('all-tools-container');
        container.innerHTML = '';
        
        if (results.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center">
                    <p class="lead">No tools found matching your search.</p>
                    ${searchHistory.length > 0 ? `
                        <div class="mt-3">
                            <p>Recent searches:</p>
                            <div class="d-flex flex-wrap justify-content-center gap-2">
                                ${searchHistory.map(term => `
                                    <button class="btn btn-outline-primary btn-sm" onclick="handleRecentSearch('${term}')">
                                        ${term}
                                    </button>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>
            `;
            return;
        }
        
        // Group results by category
        const groupedResults = {};
        results.forEach(result => {
            if (!groupedResults[result.category]) {
                groupedResults[result.category] = [];
            }
            groupedResults[result.category].push(result);
        });
        
        // Display results by category
        Object.entries(groupedResults).forEach(([category, tools]) => {
            const categoryHeader = document.createElement('div');
            categoryHeader.className = 'col-12';
            categoryHeader.innerHTML = `<h3 class="mt-4 mb-3">${highlightText(category, searchInput.value)}</h3>`;
            container.appendChild(categoryHeader);
            
            tools.forEach(tool => {
                const col = document.createElement('div');
                col.className = 'col-md-4 col-lg-3 mb-4';
                
                // Calculate popularity indicator
                const popularity = tool.popularity || 0;
                const popularityStars = Math.min(Math.floor(popularity / 10), 5);
                const stars = '★'.repeat(popularityStars) + '☆'.repeat(5 - popularityStars);
                
                col.innerHTML = `
                    <div class="card h-100">
                        <div class="card-body">
                            <h5 class="card-title">
                                <i class="fas ${tool.icon} me-2"></i>
                                ${highlightText(tool.name, searchInput.value)}
                            </h5>
                            ${tool.description ? `
                                <p class="card-text small text-muted">
                                    ${highlightText(tool.description, searchInput.value)}
                                </p>
                            ` : ''}
                            <div class="d-flex justify-content-between align-items-center mt-2">
                                <div class="text-warning small">${stars}</div>
                                <a href="${tool.path}" class="btn btn-primary">Use Tool</a>
                            </div>
                        </div>
                    </div>
                `;
                
                container.appendChild(col);
            });
        });
    }
    
    function showSuggestions(input) {
        const query = input.value.toLowerCase().trim();
        if (query.length < 2) return;
        
        const suggestions = [];
        Object.entries(toolCategories).forEach(([category, tools]) => {
            tools.forEach(tool => {
                const searchText = `${tool.name} ${category} ${tool.description || ''}`.toLowerCase();
                if (searchText.includes(query)) {
                    suggestions.push({
                        name: tool.name,
                        category: category,
                        path: tool.path
                    });
                }
            });
        });
        
        // Limit suggestions to 5
        suggestions.splice(5);
        
        // Create or update suggestions dropdown
        let dropdown = input.parentElement.querySelector('.suggestions-dropdown');
        if (!dropdown) {
            dropdown = document.createElement('div');
            dropdown.className = 'suggestions-dropdown position-absolute w-100 bg-white border rounded shadow-sm';
            dropdown.style.top = '100%';
            dropdown.style.zIndex = '1000';
            input.parentElement.appendChild(dropdown);
        }
        
        if (suggestions.length > 0) {
            dropdown.innerHTML = suggestions.map(suggestion => `
                <div class="suggestion-item p-2 border-bottom" 
                     onclick="handleSuggestionClick('${suggestion.path}')"
                     style="cursor: pointer;">
                    <div class="fw-bold">${highlightText(suggestion.name, query)}</div>
                    <div class="small text-muted">${suggestion.category}</div>
                </div>
            `).join('');
            dropdown.style.display = 'block';
        } else {
            dropdown.style.display = 'none';
        }
    }
    
    function handleSearch(input) {
        const query = input.value.trim();
        
        // Clear previous timeout
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }
        
        // Show loading state
        showLoading();
        
        // Debounce the search
        searchTimeout = setTimeout(() => {
            if (query.length >= 2) {
                const results = performSearch(query);
                displaySearchResults(results);
            } else {
                loadAllTools();
            }
        }, 300);
    }
    
    // Handle input events with debouncing
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            handleSearch(searchInput);
            showSuggestions(searchInput);
        });
        
        // Add clear button
        const clearButton = document.createElement('button');
        clearButton.className = 'btn btn-link position-absolute end-0 top-50 translate-middle-y';
        clearButton.innerHTML = '<i class="fas fa-times"></i>';
        clearButton.style.display = 'none';
        clearButton.onclick = () => {
            searchInput.value = '';
            clearButton.style.display = 'none';
            loadAllTools();
            const dropdown = searchInput.parentElement.querySelector('.suggestions-dropdown');
            if (dropdown) dropdown.style.display = 'none';
        };
        searchInput.parentElement.style.position = 'relative';
        searchInput.parentElement.appendChild(clearButton);
        
        searchInput.addEventListener('input', () => {
            clearButton.style.display = searchInput.value ? 'block' : 'none';
        });
    }
    
    if (headerSearchInput) {
        headerSearchInput.addEventListener('input', () => {
            handleSearch(headerSearchInput);
            showSuggestions(headerSearchInput);
        });
        
        // Add clear button for header search
        const clearButton = document.createElement('button');
        clearButton.className = 'btn btn-link position-absolute end-0 top-50 translate-middle-y';
        clearButton.innerHTML = '<i class="fas fa-times"></i>';
        clearButton.style.display = 'none';
        clearButton.onclick = () => {
            headerSearchInput.value = '';
            clearButton.style.display = 'none';
            loadAllTools();
            const dropdown = headerSearchInput.parentElement.querySelector('.suggestions-dropdown');
            if (dropdown) dropdown.style.display = 'none';
        };
        headerSearchInput.parentElement.style.position = 'relative';
        headerSearchInput.parentElement.appendChild(clearButton);
        
        headerSearchInput.addEventListener('input', () => {
            clearButton.style.display = headerSearchInput.value ? 'block' : 'none';
        });
    }
    
    // Handle form submissions
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleSearch(searchInput);
        });
    }
    
    if (headerSearchForm) {
        headerSearchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleSearch(headerSearchInput);
        });
    }
    
    // Handle recent search clicks
    window.handleRecentSearch = (term) => {
        if (searchInput) {
            searchInput.value = term;
            handleSearch(searchInput);
        }
        if (headerSearchInput) {
            headerSearchInput.value = term;
            handleSearch(headerSearchInput);
        }
    };
    
    // Handle suggestion clicks
    window.handleSuggestionClick = (path) => {
        window.location.href = path;
    };
}

function loadImageTools() {
    const imageTools = [
        {
            name: 'Image Compressor',
            description: 'Compress your images to reduce file size while maintaining quality.',
            icon: 'fas fa-compress-alt',
            url: 'tools/image-tools/image-compressor.html'
        },
        {
            name: 'Image Cropper',
            description: 'Crop your images to the perfect size and aspect ratio.',
            icon: 'fas fa-crop-alt',
            url: 'tools/image-tools/image-cropper.html'
        },
        {
            name: 'Image Rotator',
            description: 'Rotate and flip your images with ease.',
            icon: 'fas fa-sync-alt',
            url: 'tools/image-tools/image-rotator.html'
        }
    ];

    const toolsContainer = document.getElementById('imageTools');
    if (toolsContainer) {
        toolsContainer.innerHTML = imageTools.map(tool => `
            <div class="tool-card">
                <div class="tool-icon">
                    <i class="${tool.icon}"></i>
                </div>
                <div class="tool-info">
                    <h3>${tool.name}</h3>
                    <p>${tool.description}</p>
                </div>
                <a href="${tool.url}" class="btn btn-primary">Use Tool</a>
            </div>
        `).join('');
    }
} 