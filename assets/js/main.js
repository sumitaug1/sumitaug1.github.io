// Tool categories and their tools
const toolCategories = {
    'Image Tools': [
        {
            name: 'Image to PNG Converter',
            path: 'tools/image-tools/image-to-png.html',
            icon: 'fa-image',
            description: 'Convert any image format to PNG with quality control and resizing options.',
            category: 'Converters',
            keywords: ['convert', 'png', 'image converter', 'format', 'picture', 'photo'],
            popularity: 95
        },
        {
            name: 'Image to JPG Converter',
            path: 'tools/image-tools/image-to-jpg.html',
            icon: 'fa-image',
            description: 'Convert images to JPG format with customizable quality settings.',
            category: 'Converters',
            keywords: ['convert', 'jpg', 'jpeg', 'image converter', 'format', 'picture', 'photo'],
            popularity: 90
        },
        {
            name: 'Image Resizer',
            path: 'tools/image-tools/image-resizer.html',
            icon: 'fa-expand',
            description: 'Resize images while maintaining aspect ratio or custom dimensions.',
            category: 'Editing',
            keywords: ['resize', 'dimensions', 'size', 'scale', 'picture size', 'photo size'],
            popularity: 85
        },
        {
            name: 'Image Compressor',
            path: 'tools/image-tools/image-compressor.html',
            icon: 'fa-compress',
            description: 'Reduce image file size without significant quality loss.',
            category: 'Optimization',
            keywords: ['compress', 'optimize', 'reduce size', 'shrink', 'file size', 'optimization'],
            popularity: 88
        },
        {
            name: 'Image Cropper',
            path: 'tools/image-tools/image-cropper.html',
            icon: 'fa-crop',
            description: 'Crop images to specific dimensions or aspect ratios.',
            category: 'Editing',
            keywords: ['crop', 'trim', 'cut', 'aspect ratio', 'dimensions', 'edit'],
            popularity: 82
        },
        {
            name: 'Base64 Image Converter',
            path: 'tools/image-tools/base64-image.html',
            icon: 'fa-code',
            description: 'Convert images to Base64 format and vice versa.',
            category: 'Converters',
            keywords: ['base64', 'convert', 'image', 'code', 'data', 'binary'],
            popularity: 75
        },
        {
            name: 'WebP to PNG Converter',
            path: 'tools/image-tools/webp-to-png.html',
            icon: 'fa-image',
            description: 'Convert WebP images to PNG format with high quality.',
            category: 'Converters',
            keywords: ['convert', 'webp', 'png', 'image', 'format', 'quality'],
            popularity: 80
        },
        {
            name: 'GIF Maker',
            path: 'tools/image-tools/gif-maker.html',
            icon: 'fa-film',
            description: 'Create animated GIFs from images or videos.',
            category: 'Animation',
            keywords: ['gif', 'animation', 'create', 'images', 'videos', 'animation'],
            popularity: 78
        },
        {
            name: 'QR Code Generator',
            path: 'tools/image-tools/qr-code-generator.html',
            icon: 'fa-qrcode',
            description: 'Generate QR codes from text, URLs, or contact information.',
            category: 'Generation',
            keywords: ['qr', 'code', 'generate', 'text', 'url', 'contact'],
            popularity: 92
        },
        {
            name: 'Screenshot to PDF',
            path: 'tools/image-tools/screenshot-to-pdf.html',
            icon: 'fa-file-pdf',
            description: 'Convert screenshots to PDF documents.',
            category: 'Converters',
            keywords: ['screenshot', 'pdf', 'convert', 'image', 'document', 'screen'],
            popularity: 85
        },
        {
            name: 'Image Rotator',
            path: 'tools/image-tools/image-rotator.html',
            icon: 'fa-sync-alt',
            description: 'Rotate and flip your images with ease.',
            category: 'Editing',
            keywords: ['rotate', 'flip', 'image', 'edit', 'rotate image', 'flip image'],
            popularity: 80
        }
    ],
    'PDF Tools': [
        {
            name: 'JPG to PDF Converter',
            path: 'tools/pdf-tools/jpg-to-pdf.html',
            icon: 'fa-file-pdf',
            description: 'Convert JPG images to high-quality PDF documents with customizable settings.',
            category: 'Converters',
            keywords: ['convert', 'pdf', 'document', 'image to pdf', 'jpg to pdf', 'create pdf'],
            popularity: 90
        },
        {
            name: 'PDF to JPG Converter',
            path: 'tools/pdf-tools/pdf-to-jpg.html',
            icon: 'fa-image',
            description: 'Convert PDF pages to high-quality JPG images with customizable settings.',
            category: 'Converters',
            keywords: ['convert', 'pdf to image', 'extract images', 'pdf to jpg', 'document to image'],
            popularity: 88
        },
        {
            name: 'PDF Merger',
            path: 'tools/pdf-tools/pdf-merger.html',
            icon: 'fa-compress-arrows-alt',
            description: 'Merge multiple PDF files into a single document with customizable page order and quality settings.',
            category: 'Editing',
            keywords: ['merge', 'combine', 'join', 'unite', 'multiple pdf', 'combine pdf'],
            popularity: 95
        }
    ],
    'SEO Tools': [
        {
            name: 'Meta Tag Generator',
            path: 'tools/seo-tools/meta-tag-generator.html',
            icon: 'fa-tags',
            description: 'Generate optimized meta tags for your website.',
            keywords: ['meta', 'tags', 'seo', 'optimization', 'website', 'html meta'],
            category: 'SEO'
        },
        {
            name: 'Keyword Density Checker',
            path: 'tools/seo-tools/keyword-density.html',
            icon: 'fa-chart-bar',
            description: 'Check keyword density in your content.',
            keywords: ['keywords', 'density', 'content', 'analysis', 'seo', 'optimization'],
            category: 'SEO'
        },
        { name: 'Sitemap Generator', path: 'tools/seo-tools/sitemap-generator.html', icon: 'fa-sitemap', keywords: ['sitemap', 'generate', 'seo', 'website', 'xml'], category: 'SEO' },
        { name: 'Robots.txt Generator', path: 'tools/seo-tools/robots-txt.html', icon: 'fa-robot', keywords: ['robots', 'txt', 'seo', 'website', 'xml'], category: 'SEO' },
        { name: 'Google Index Checker', path: 'tools/seo-tools/google-index.html', icon: 'fa-google', keywords: ['google', 'index', 'seo', 'website', 'search'], category: 'SEO' },
        { name: 'Domain Authority Checker', path: 'tools/seo-tools/domain-authority.html', icon: 'fa-globe', keywords: ['domain', 'authority', 'seo', 'website', 'search'], category: 'SEO' },
        { name: 'Backlink Checker', path: 'tools/seo-tools/backlink-checker.html', icon: 'fa-link', keywords: ['backlink', 'check', 'seo', 'website', 'search'], category: 'SEO' },
        { name: 'Page Speed Checker', path: 'tools/seo-tools/page-speed.html', icon: 'fa-tachometer-alt', keywords: ['page', 'speed', 'seo', 'website', 'performance'], category: 'SEO' },
        { name: 'XML Sitemap Validator', path: 'tools/seo-tools/sitemap-validator.html', icon: 'fa-check-circle', keywords: ['xml', 'sitemap', 'validate', 'seo', 'website'], category: 'SEO' },
        { name: 'Mobile-Friendly Test', path: 'tools/seo-tools/mobile-friendly.html', icon: 'fa-mobile-alt', keywords: ['mobile', 'friendly', 'seo', 'website', 'responsive'], category: 'SEO' }
    ],
    'Text Tools': [
        {
            name: 'Word Counter',
            path: 'tools/text-tools/word-counter.html',
            icon: 'fa-calculator',
            description: 'Count words, characters, and paragraphs in your text.',
            keywords: ['count', 'words', 'characters', 'text', 'paragraphs', 'length'],
            category: 'Text'
        },
        {
            name: 'Character Counter',
            path: 'tools/text-tools/character-counter.html',
            icon: 'fa-text-width',
            description: 'Count the number of characters in your text.',
            keywords: ['count', 'characters', 'text', 'length'],
            category: 'Text'
        },
        {
            name: 'Case Converter',
            path: 'tools/text-tools/case-converter.html',
            icon: 'fa-font',
            description: 'Convert text between different cases (uppercase, lowercase, title case).',
            keywords: ['case', 'uppercase', 'lowercase', 'title case', 'text case', 'convert'],
            category: 'Text'
        },
        {
            name: 'Plagiarism Checker',
            path: 'tools/text-tools/plagiarism-checker.html',
            icon: 'fa-copy',
            description: 'Check for plagiarism in your text.',
            keywords: ['plagiarism', 'check', 'text', 'copyright', 'duplicate'],
            category: 'Text'
        },
        {
            name: 'Grammar Checker',
            path: 'tools/text-tools/grammar-checker.html',
            icon: 'fa-spell-check',
            description: 'Check your text for grammar and spelling errors.',
            keywords: ['grammar', 'check', 'spelling', 'text', 'error', 'correct'],
            category: 'Text'
        },
        {
            name: 'Text to Speech',
            path: 'tools/text-tools/text-to-speech.html',
            icon: 'fa-volume-up',
            description: 'Convert text to speech.',
            keywords: ['text', 'speech', 'convert', 'voice', 'text to speech', 'speech synthesis'],
            category: 'Text'
        },
        {
            name: 'Speech to Text',
            path: 'tools/text-tools/speech-to-text.html',
            icon: 'fa-microphone',
            description: 'Convert speech to text.',
            keywords: ['speech', 'text', 'convert', 'voice', 'speech to text', 'voice recognition'],
            category: 'Text'
        },
        {
            name: 'URL Encoder/Decoder',
            path: 'tools/text-tools/url-encoder.html',
            icon: 'fa-link',
            description: 'Encode or decode URLs.',
            keywords: ['url', 'encode', 'decode', 'encode url', 'decode url'],
            category: 'Text'
        },
        {
            name: 'Fancy Text Generator',
            path: 'tools/text-tools/fancy-text.html',
            icon: 'fa-magic',
            description: 'Create fancy text effects.',
            keywords: ['fancy', 'text', 'generate', 'effect', 'style', 'text'],
            category: 'Text'
        },
        {
            name: 'Random Text Generator',
            path: 'tools/text-tools/random-text.html',
            icon: 'fa-random',
            description: 'Generate random text.',
            keywords: ['random', 'text', 'generate', 'lorem ipsum', 'placeholder'],
            category: 'Text'
        }
    ],
    'Developer Tools': [
        { name: 'JSON Formatter', path: 'tools/developer-tools/json-formatter.html', icon: 'fa-code', keywords: ['json', 'format', 'developer', 'code', 'json formatter'], category: 'Developer' },
        { name: 'HTML to Markdown', path: 'tools/developer-tools/html-to-markdown.html', icon: 'fa-file-code', keywords: ['html', 'markdown', 'convert', 'developer', 'code'], category: 'Developer' },
        { name: 'CSS Minifier', path: 'tools/developer-tools/css-minifier.html', icon: 'fa-css3', keywords: ['css', 'minify', 'compress', 'developer', 'code'], category: 'Developer' },
        { name: 'JavaScript Minifier', path: 'tools/developer-tools/javascript-minifier.html', icon: 'fa-js', keywords: ['javascript', 'minify', 'compress', 'developer', 'code'], category: 'Developer' },
        { name: 'SQL Formatter', path: 'tools/developer-tools/sql-formatter.html', icon: 'fa-database', keywords: ['sql', 'format', 'developer', 'code', 'database'], category: 'Developer' },
        { name: 'HTACCESS Redirect Generator', path: 'tools/developer-tools/htaccess-redirect-generator.html', icon: 'fa-server', keywords: ['htaccess', 'redirect', 'generator', 'developer', 'server'], category: 'Developer' },
        { name: 'Markdown to HTML', path: 'tools/developer-tools/markdown-to-html.html', icon: 'fa-file-code', keywords: ['markdown', 'html', 'convert', 'developer', 'code'], category: 'Developer' },
        { name: 'Color Picker', path: 'tools/developer-tools/color-code-picker.html', icon: 'fa-palette', keywords: ['color', 'picker', 'developer', 'code', 'color picker'], category: 'Developer' },
        { name: 'Base64 Encoder/Decoder', path: 'tools/developer-tools/base64-encoder-decoder.html', icon: 'fa-code', keywords: ['base64', 'encode', 'decode', 'developer', 'code'], category: 'Developer' },
        { 
            name: 'File Comparison Tool', 
            path: 'tools/developer-tools/file-comparison.html', 
            icon: 'fa-code-compare', 
            description: 'Compare two files and highlight the differences with syntax highlighting.',
            keywords: ['file', 'compare', 'diff', 'difference', 'developer', 'code', 'comparison'],
            category: 'Developer',
            popularity: 85
        },
        { name: 'IP Address Lookup', path: 'tools/developer-tools/ip-address-lookup.html', icon: 'fa-network-wired', keywords: ['ip', 'address', 'lookup', 'developer', 'network'], category: 'Developer' }
    ],
    'Calculators': [
        { name: 'Percentage Calculator', path: 'tools/calculator-tools/percentage-calculator.html', icon: 'fa-percent', keywords: ['percentage', 'calculate', 'calculator', 'math', 'percentage calculator'], category: 'Calculator' },
        { name: 'Age Calculator', path: 'tools/calculator-tools/age-calculator.html', icon: 'fa-birthday-cake', keywords: ['age', 'calculate', 'calculator', 'birthday', 'age calculator'], category: 'Calculator' },
        { name: 'BMI Calculator', path: 'tools/calculator-tools/bmi-calculator.html', icon: 'fa-weight', keywords: ['bmi', 'calculate', 'calculator', 'health', 'bmi calculator'], category: 'Calculator' },
        { name: 'Loan EMI Calculator', path: 'tools/calculator-tools/loan-emi-calculator.html', icon: 'fa-calculator', keywords: ['loan', 'emi', 'calculate', 'finance', 'loan emi calculator'], category: 'Calculator' },
        { name: 'Scientific Calculator', path: 'tools/calculator-tools/scientific-calculator.html', icon: 'fa-square-root-alt', keywords: ['scientific', 'calculate', 'calculator', 'math', 'scientific calculator'], category: 'Calculator' },
        { name: 'Discount Calculator', path: 'tools/calculator-tools/discount-calculator.html', icon: 'fa-tag', keywords: ['discount', 'calculate', 'calculator', 'finance', 'discount calculator'], category: 'Calculator' },
        { name: 'Currency Converter', path: 'tools/calculator-tools/currency-converter.html', icon: 'fa-money-bill-wave', keywords: ['currency', 'convert', 'calculator', 'finance', 'currency converter'], category: 'Calculator' },
        { name: 'Time Zone Converter', path: 'tools/calculator-tools/time-zone-converter.html', icon: 'fa-clock', keywords: ['time', 'zone', 'convert', 'timezone', 'timezone converter'], category: 'Calculator' },
        { name: 'Binary to Decimal', path: 'tools/calculator-tools/binary-decimal.html', icon: 'fa-hashtag', keywords: ['binary', 'decimal', 'convert', 'math', 'binary to decimal'], category: 'Calculator' },
        { name: 'Tip Calculator', path: 'tools/calculator-tools/tip-calculator.html', icon: 'fa-coins', keywords: ['tip', 'calculate', 'calculator', 'finance', 'tip calculator'], category: 'Calculator' }
    ],
    'Unit Converters': [
        { name: 'Length Converter', path: 'tools/unit-converters/length-converter.html', icon: 'fa-ruler', keywords: ['length', 'convert', 'converter', 'measurement', 'length converter'], category: 'Converter' },
        { name: 'Weight Converter', path: 'tools/unit-converters/weight-converter.html', icon: 'fa-balance-scale', keywords: ['weight', 'convert', 'converter', 'measurement', 'weight converter'], category: 'Converter' },
        { name: 'Speed Converter', path: 'tools/unit-converters/speed-converter.html', icon: 'fa-tachometer-alt', keywords: ['speed', 'convert', 'converter', 'measurement', 'speed converter'], category: 'Converter' },
        { name: 'Temperature Converter', path: 'tools/unit-converters/temperature-converter.html', icon: 'fa-thermometer-half', keywords: ['temperature', 'convert', 'converter', 'measurement', 'temperature converter'], category: 'Converter' },
        { name: 'Volume Converter', path: 'tools/unit-converters/volume-converter.html', icon: 'fa-flask', keywords: ['volume', 'convert', 'converter', 'measurement', 'volume converter'], category: 'Converter' },
        { name: 'Data Storage Converter', path: 'tools/unit-converters/data-storage-converter.html', icon: 'fa-hdd', keywords: ['data', 'storage', 'convert', 'converter', 'data storage converter'], category: 'Converter' },
        { name: 'Energy Converter', path: 'tools/unit-converters/energy-converter.html', icon: 'fa-bolt', keywords: ['energy', 'convert', 'converter', 'measurement', 'energy converter'], category: 'Converter' },
        { name: 'Pressure Converter', path: 'tools/unit-converters/pressure-converter.html', icon: 'fa-compress-arrows-alt', keywords: ['pressure', 'convert', 'converter', 'measurement', 'pressure converter'], category: 'Converter' },
        { name: 'Fuel Efficiency Converter', path: 'tools/unit-converters/fuel-efficiency-converter.html', icon: 'fa-gas-pump', keywords: ['fuel', 'efficiency', 'convert', 'converter', 'fuel efficiency converter'], category: 'Converter' },
        { name: 'Angle Converter', path: 'tools/unit-converters/angle-converter.html', icon: 'fa-angle-double-right', keywords: ['angle', 'convert', 'converter', 'measurement', 'angle converter'], category: 'Converter' }
    ],
    'Security Tools': [
        { name: 'MD5 Hash Generator', path: 'tools/security-tools/md5-hash-generator.html', icon: 'fa-hashtag', keywords: ['md5', 'hash', 'generate', 'security', 'encryption'], category: 'Security' },
        { name: 'SHA256 Hash Generator', path: 'tools/security-tools/sha256-hash-generator.html', icon: 'fa-hashtag', keywords: ['sha256', 'hash', 'generate', 'security', 'encryption'], category: 'Security' },
        { name: 'Password Generator', path: 'tools/security-tools/password-generator.html', icon: 'fa-key', keywords: ['password', 'generate', 'security', 'encryption', 'password generator'], category: 'Security' },
        { name: 'Random String Generator', path: 'tools/security-tools/random-string-generator.html', icon: 'fa-random', keywords: ['random', 'string', 'generate', 'security', 'encryption'], category: 'Security' },
        { name: 'URL Shortener', path: 'tools/security-tools/url-shortener.html', icon: 'fa-link', keywords: ['url', 'shorten', 'shortener', 'security', 'url shortener'], category: 'Security' },
        { name: 'IP Geolocation', path: 'tools/security-tools/ip-geolocation-finder.html', icon: 'fa-map-marker-alt', keywords: ['ip', 'geolocation', 'finder', 'security', 'ip geolocation'], category: 'Security' },
        { name: 'SSL Certificate Checker', path: 'tools/security-tools/ssl-certificate-checker.html', icon: 'fa-shield-alt', keywords: ['ssl', 'certificate', 'check', 'security', 'ssl certificate'], category: 'Security' },
        { name: 'Whois Lookup', path: 'tools/security-tools/whois-lookup.html', icon: 'fa-search', keywords: ['whois', 'lookup', 'check', 'security', 'whois lookup'], category: 'Security' },
        { name: 'HTTP Headers Checker', path: 'tools/security-tools/http-headers-checker.html', icon: 'fa-heading', keywords: ['http', 'headers', 'check', 'security', 'http headers'], category: 'Security' },
        { name: 'Privacy Policy Generator', path: 'tools/security-tools/privacy-policy-generator.html', icon: 'fa-file-contract', keywords: ['privacy', 'policy', 'generate', 'security', 'privacy policy'], category: 'Security' }
    ],
    'Social Media Tools': [
        { name: 'YouTube Thumbnail Downloader', path: 'tools/social-media-tools/youtube-thumbnail-downloader.html', icon: 'fa-youtube', keywords: ['youtube', 'thumbnail', 'download', 'social media', 'video'], category: 'Social Media' },
        { name: 'Instagram Photo Downloader', path: 'tools/social-media-tools/instagram-photo-downloader.html', icon: 'fa-instagram', keywords: ['instagram', 'photo', 'download', 'social media', 'photo'], category: 'Social Media' },
        { name: 'Twitter Video Downloader', path: 'tools/social-media-tools/twitter-video-downloader.html', icon: 'fa-twitter', keywords: ['twitter', 'video', 'download', 'social media', 'video'], category: 'Social Media' },
        { name: 'Facebook Video Downloader', path: 'tools/social-media-tools/facebook-video-downloader.html', icon: 'fa-facebook', keywords: ['facebook', 'video', 'download', 'social media', 'video'], category: 'Social Media' },
        { name: 'TikTok Video Downloader', path: 'tools/social-media-tools/tiktok-video-downloader.html', icon: 'fa-music', keywords: ['tiktok', 'video', 'download', 'social media', 'video'], category: 'Social Media' },
        { name: 'YouTube Tags Extractor', path: 'tools/social-media-tools/youtube-tags-extractor.html', icon: 'fa-tags', keywords: ['youtube', 'tags', 'extract', 'social media', 'video'], category: 'Social Media' },
        { name: 'Hashtag Generator', path: 'tools/social-media-tools/hashtag-generator.html', icon: 'fa-hashtag', keywords: ['hashtag', 'generate', 'social media', 'marketing', 'hashtag generator'], category: 'Social Media' },
        { name: 'Social Media Post Generator', path: 'tools/social-media-tools/social-media-post-generator.html', icon: 'fa-share-alt', keywords: ['social', 'media', 'post', 'generate', 'social media post'], category: 'Social Media' },
        { name: 'Emoji Keyboard', path: 'tools/social-media-tools/emoji-keyboard.html', icon: 'fa-smile', keywords: ['emoji', 'keyboard', 'social media', 'communication', 'emoji keyboard'], category: 'Social Media' },
        { name: 'Twitter Character Counter', path: 'tools/social-media-tools/twitter-character-counter.html', icon: 'fa-twitter', keywords: ['twitter', 'character', 'count', 'social media', 'twitter character'], category: 'Social Media' }
    ],
    'Business Tools': [
        { name: 'Invoice Generator', path: 'tools/business-tools/invoice-generator.html', icon: 'fa-file-invoice', keywords: ['invoice', 'generate', 'business', 'finance', 'invoice generator'], category: 'Business' },
        { name: 'Business Name Generator', path: 'tools/business-tools/business-name-generator.html', icon: 'fa-building', keywords: ['business', 'name', 'generate', 'business', 'business name'], category: 'Business' },
        { name: 'Daily Planner Creator', path: 'tools/business-tools/daily-planner-creator.html', icon: 'fa-calendar', keywords: ['daily', 'planner', 'create', 'business', 'daily planner'], category: 'Business' },
        { name: 'Calculator for Electric Bills', path: 'tools/business-tools/electric-bill-calculator.html', icon: 'fa-bolt', keywords: ['electric', 'bill', 'calculate', 'business', 'electric bill'], category: 'Business' }
    ],
    'Miscellaneous': [
        { name: 'Barcode Generator', path: 'tools/miscellaneous/barcode-generator.html', icon: 'fa-barcode', keywords: ['barcode', 'generate', 'miscellaneous', 'code', 'barcode generator'], category: 'Miscellaneous' },
        { name: 'Meme Generator', path: 'tools/miscellaneous/meme-generator.html', icon: 'fa-laugh', keywords: ['meme', 'generate', 'miscellaneous', 'humor', 'meme generator'], category: 'Miscellaneous' },
        { name: 'Resume Builder', path: 'tools/miscellaneous/resume-builder.html', icon: 'fa-file-alt', keywords: ['resume', 'build', 'miscellaneous', 'job', 'resume builder'], category: 'Miscellaneous' },
        { name: 'Lottery Number Generator', path: 'tools/miscellaneous/lottery-number-generator.html', icon: 'fa-ticket-alt', keywords: ['lottery', 'number', 'generate', 'miscellaneous', 'lottery number'], category: 'Miscellaneous' },
        { name: 'Flip a Coin Simulator', path: 'tools/miscellaneous/flip-coin-simulator.html', icon: 'fa-coins', keywords: ['flip', 'coin', 'simulate', 'miscellaneous', 'coin flip'], category: 'Miscellaneous' },
        { name: 'Random Number Generator', path: 'tools/miscellaneous/random-number-generator.html', icon: 'fa-dice', keywords: ['random', 'number', 'generate', 'miscellaneous', 'random number'], category: 'Miscellaneous' },
        { name: 'Dice Roller Simulator', path: 'tools/miscellaneous/dice-roller.html', icon: 'fa-dice', keywords: ['dice', 'roller', 'simulate', 'miscellaneous', 'dice roller'], category: 'Miscellaneous' },
        { name: 'Internet Speed Test', path: 'tools/miscellaneous/internet-speed-test.html', icon: 'fa-tachometer-alt', keywords: ['internet', 'speed', 'test', 'miscellaneous', 'internet speed'], category: 'Miscellaneous' },
        { name: 'Wedding Invitation Generator', path: 'tools/miscellaneous/wedding-invitation-generator.html', icon: 'fa-envelope', keywords: ['wedding', 'invitation', 'generate', 'miscellaneous', 'wedding invitation'], category: 'Miscellaneous' },
        { name: 'Story Plot Generator', path: 'tools/miscellaneous/story-plot-generator.html', icon: 'fa-book', keywords: ['story', 'plot', 'generate', 'miscellaneous', 'story plot'], category: 'Miscellaneous' },
        { name: 'E-book Creator', path: 'tools/miscellaneous/ebook-creator.html', icon: 'fa-book-open', keywords: ['ebook', 'create', 'miscellaneous', 'book', 'ebook creator'], category: 'Miscellaneous' },
        { name: 'AI Chatbot Demo', path: 'tools/miscellaneous/ai-chatbot-demo.html', icon: 'fa-robot', keywords: ['ai', 'chatbot', 'demo', 'miscellaneous', 'ai chatbot'], category: 'Miscellaneous' },
        { name: 'IP Address Tracker', path: 'tools/miscellaneous/ip-address-tracker.html', icon: 'fa-map-marker-alt', keywords: ['ip', 'address', 'track', 'miscellaneous', 'ip address'], category: 'Miscellaneous' },
        { name: 'Fake Address Generator', path: 'tools/miscellaneous/fake-address-generator.html', icon: 'fa-map', keywords: ['fake', 'address', 'generate', 'miscellaneous', 'fake address'], category: 'Miscellaneous' },
        { name: 'Leap Year Checker', path: 'tools/miscellaneous/leap-year-checker.html', icon: 'fa-calendar-check', keywords: ['leap', 'year', 'check', 'miscellaneous', 'leap year'], category: 'Miscellaneous' },
        { name: 'Name to Numerology Calculator', path: 'tools/miscellaneous/name-numerology-calculator.html', icon: 'fa-calculator', keywords: ['name', 'numerology', 'calculate', 'miscellaneous', 'name numerology'], category: 'Miscellaneous' },
        { name: 'Random Quote Generator', path: 'tools/miscellaneous/random-quote-generator.html', icon: 'fa-quote-right', keywords: ['random', 'quote', 'generate', 'miscellaneous', 'random quote'], category: 'Miscellaneous' },
        { name: 'Birthday Invitation Generator', path: 'tools/miscellaneous/birthday-invitation-generator.html', icon: 'fa-birthday-cake', keywords: ['birthday', 'invitation', 'generate', 'miscellaneous', 'birthday invitation'], category: 'Miscellaneous' }
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
    // Load header
    fetch('../../components/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-container').innerHTML = data;
        })
        .catch(error => console.error('Error loading header:', error));

    // Load footer
    fetch('../../components/footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-container').innerHTML = data;
        })
        .catch(error => console.error('Error loading footer:', error));
    
    // Load other content
    loadCategories();
    loadPopularTools();
    loadAllTools();
    setupSearch();

    // Handle contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                from_name: document.getElementById('name').value,
                reply_to: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: `From: ${document.getElementById('name').value} (${document.getElementById('email').value})\nSubject: ${document.getElementById('subject').value}\n\n${document.getElementById('message').value}`
            };

            // Show loading state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            submitButton.disabled = true;
            submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...';

            // Send email using EmailJS
            emailjs.send('service_7mljgys', 'template_lwttk9c', formData)
                .then(function(response) {
                    console.log('SUCCESS!', response.status, response.text);
                    // Show success message
                    const alertDiv = document.createElement('div');
                    alertDiv.className = 'alert alert-success mt-3';
                    alertDiv.innerHTML = 'Thank you for your message! We will get back to you soon.';
                    contactForm.appendChild(alertDiv);

                    // Reset form
                    contactForm.reset();

                    // Remove success message after 5 seconds
                    setTimeout(() => {
                        alertDiv.remove();
                    }, 5000);
                })
                .catch(function(error) {
                    console.log('FAILED...', error);
                    // Show error message with more details
                    const alertDiv = document.createElement('div');
                    alertDiv.className = 'alert alert-danger mt-3';
                    alertDiv.innerHTML = `Error sending message: ${error.text}. Please try again later.`;
                    contactForm.appendChild(alertDiv);

                    // Remove error message after 5 seconds
                    setTimeout(() => {
                        alertDiv.remove();
                    }, 5000);
                })
                .finally(function() {
                    // Reset button state
                    submitButton.disabled = false;
                    submitButton.innerHTML = originalButtonText;
                });
        });
    }
});

// Load categories
function loadCategories() {
    const container = document.getElementById('categories-container');
    if (!container) return;

    container.innerHTML = '';

    // Map category names to their file paths
    const categoryPaths = {
        'Image Tools': 'tools/image-tools.html',
        'PDF Tools': 'tools/pdf-tools.html',
        'SEO Tools': 'tools/seo-tools.html',
        'Text Tools': 'tools/text-tools.html',
        'Developer Tools': 'tools/developer-tools.html',
        'Calculators': 'tools/calculator-tools.html',
        'Unit Converters': 'tools/unit-converters.html',
        'Security Tools': 'tools/security-tools.html',
        'Social Media Tools': 'tools/social-media-tools.html',
        'Business Tools': 'tools/business-tools.html',
        'Miscellaneous': 'tools/miscellaneous.html'
    };

    Object.entries(toolCategories).forEach(([category, tools]) => {
        // Handle both array and object structures
        const toolList = Array.isArray(tools) ? tools : (tools.tools || []);
        const categoryName = tools.name || category;
        const categoryPath = categoryPaths[category] || `tools/${category.toLowerCase().replace(/\s+/g, '-')}.html`;
        
        const categoryCard = document.createElement('div');
        categoryCard.className = 'col-md-6 col-lg-4';
        
        categoryCard.innerHTML = `
            <div class="card h-100">
                <div class="card-body">
                    <h5 class="card-title">
                        <a href="${categoryPath}" class="text-decoration-none text-dark">
                            ${categoryName}
                        </a>
                    </h5>
                    <ul class="list-unstyled">
                        ${toolList.slice(0, 5).map(tool => `
                            <li>
                                <a href="${tool.path}" class="text-decoration-none">
                                    <i class="fas ${tool.icon} me-2"></i>
                                    ${tool.name}
                                </a>
                            </li>
                        `).join('')}
                    </ul>
                    ${category === 'PDF Tools' || toolList.length > 5 ? `
                        <a href="${categoryPath}" class="btn btn-sm btn-outline-primary mt-2">
                            View All ${toolList.length} Tools
                        </a>
                    ` : ''}
                </div>
            </div>
        `;
        
        container.appendChild(categoryCard);
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

function createToolCard(tool) {
    return `
        <div class="col-md-4 col-lg-3 mb-4">
            <div class="card h-100">
                <div class="card-body">
                    <h5 class="card-title">
                        <i class="fas ${tool.icon} me-2"></i>
                        ${tool.name}
                    </h5>
                    ${tool.description ? `
                        <p class="card-text small text-muted">${tool.description}</p>
                    ` : ''}
                    <a href="${tool.path}" class="btn btn-primary btn-sm">Use Tool</a>
                </div>
            </div>
        </div>
    `;
}

function loadAllTools() {
    // Load tools into their respective category sections
    Object.entries(toolCategories).forEach(([category, tools]) => {
        const containerId = `${category.toLowerCase().replace(/\s+/g, '-')}-container`;
        const container = document.getElementById(containerId);
        
        if (container) {
            container.innerHTML = `
                <div class="row">
                    ${tools.map(tool => createToolCard(tool)).join('')}
                </div>
            `;
        }
    });
}

// Setup search functionality
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchForm = document.getElementById('searchForm');
    let searchTimeout = null;

    function performSearch(query) {
        query = query.toLowerCase().trim();
        
        // Show loading state
        const containers = document.querySelectorAll('[id$="-container"]');
        containers.forEach(container => {
            container.innerHTML = `
                <div class="col-12 text-center">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
            `;
        });

        // If query is empty, show all tools
        if (!query) {
            loadAllTools();
            return;
        }

        // Search through all tools
        const results = [];
        Object.entries(toolCategories).forEach(([category, tools]) => {
            tools.forEach(tool => {
                const searchText = `${tool.name} ${category} ${tool.description || ''} ${(tool.keywords || []).join(' ')}`.toLowerCase();
                if (searchText.includes(query)) {
                    results.push({
                        ...tool,
                        category,
                        matchScore: calculateMatchScore(tool, query)
                    });
                }
            });
        });

        // Sort results by match score
        results.sort((a, b) => b.matchScore - a.matchScore);

        // Group results by category
        const groupedResults = {};
        results.forEach(result => {
            if (!groupedResults[result.category]) {
                groupedResults[result.category] = [];
            }
            groupedResults[result.category].push(result);
        });

        // Display results
        Object.entries(groupedResults).forEach(([category, tools]) => {
            const containerId = `${category.toLowerCase().replace(/\s+/g, '-')}-container`;
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = `
                    <div class="row">
                        ${tools.map(tool => createToolCard(tool)).join('')}
                    </div>
                `;
            }
        });

        // Hide empty sections and show sections with results
        document.querySelectorAll('section').forEach(section => {
            const container = section.querySelector('[id$="-container"]');
            if (container) {
                if (container.children.length === 0 || !container.querySelector('.card')) {
                    section.style.display = 'none';
                } else {
                    section.style.display = 'block';
                }
            }
        });

        // If no results found, show message
        if (results.length === 0) {
            const allToolsContainer = document.getElementById('all-tools-container');
            if (allToolsContainer) {
                allToolsContainer.innerHTML = `
                    <div class="col-12 text-center">
                        <p class="lead">No tools found matching "${query}"</p>
                        <p>Try searching with different keywords or browse our categories.</p>
                    </div>
                `;
            }
        }
    }

    function calculateMatchScore(tool, query) {
        let score = 0;
        const searchText = `${tool.name} ${tool.category} ${tool.description || ''} ${(tool.keywords || []).join(' ')}`.toLowerCase();
        
        // Exact name match
        if (tool.name.toLowerCase() === query) {
            score += 100;
        }
        // Name contains query
        else if (tool.name.toLowerCase().includes(query)) {
            score += 50;
        }
        
        // Category match
        if (tool.category.toLowerCase().includes(query)) {
            score += 30;
        }
        
        // Description match
        if (tool.description && tool.description.toLowerCase().includes(query)) {
            score += 20;
        }
        
        // Keywords match
        if (tool.keywords) {
            tool.keywords.forEach(keyword => {
                if (keyword.toLowerCase().includes(query)) {
                    score += 10;
                }
            });
        }
        
        // Popularity bonus
        if (tool.popularity) {
            score += tool.popularity * 0.1;
        }
        
        return score;
    }

    function handleSearch(input) {
        const query = input.value.trim();
        
        // Clear previous timeout
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }
        
        // Debounce the search
        searchTimeout = setTimeout(() => {
            performSearch(query);
        }, 300);
    }

    // Handle main search
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            handleSearch(searchInput);
        });
    }

    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleSearch(searchInput);
        });
    }
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

// Common utility functions
const utils = {
    // Copy text to clipboard
    copyToClipboard: function(text) {
        return navigator.clipboard.writeText(text)
            .then(() => true)
            .catch(() => false);
    },

    // Show notification
    showNotification: function(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} notification fade-in`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    },

    // Format number with commas
    formatNumber: function(number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },

    // Debounce function
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Validate input
    validateInput: function(input, type) {
        switch(type) {
            case 'number':
                return !isNaN(input) && isFinite(input);
            case 'email':
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
            case 'url':
                try {
                    new URL(input);
                    return true;
                } catch {
                    return false;
                }
            default:
                return true;
        }
    },

    // Generate random string
    generateRandomString: function(length = 8) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    },

    // Format date
    formatDate: function(date, format = 'YYYY-MM-DD') {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        
        return format
            .replace('YYYY', year)
            .replace('MM', month)
            .replace('DD', day);
    },

    // File size formatter
    formatFileSize: function(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
};

// Add global error handler
window.addEventListener('error', function(event) {
    console.error('Global error:', event.error);
    utils.showNotification('An error occurred. Please try again.', 'danger');
});

// Add global unhandled promise rejection handler
window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
    utils.showNotification('An error occurred. Please try again.', 'danger');
});

// Function to load header and footer
async function loadComponents() {
    try {
        // Determine the correct path prefix based on current location
        const currentPath = window.location.pathname;
        const pathParts = currentPath.split('/').filter(Boolean);
        const isInToolsDirectory = pathParts.includes('tools');
        const toolsIndex = pathParts.indexOf('tools');
        const depth = pathParts.length - (toolsIndex + 1);
        
        // Calculate the correct prefix based on depth
        let prefix = '';
        if (isInToolsDirectory) {
            prefix = '../'.repeat(depth);
        }

        // Load header
        const headerContainer = document.getElementById('header-container');
        if (headerContainer) {
            const headerResponse = await fetch(prefix + 'components/header.html');
            if (headerResponse.ok) {
                const headerContent = await headerResponse.text();
                headerContainer.innerHTML = headerContent;
                
                // Update navigation links based on current location
                const currentPath = window.location.pathname;
                const isInToolsDirectory = currentPath.includes('/tools/');
                const prefix = isInToolsDirectory ? '../' : '';

                // Update all navigation links
                document.querySelectorAll('.nav-link').forEach(link => {
                    const href = link.getAttribute('href');
                    if (href && !href.startsWith('#')) {
                        if (href === 'about.html') {
                            link.href = prefix + 'tools/about.html';
                        } else if (href === 'contact.html') {
                            link.href = prefix + 'tools/contact.html';
                        } else {
                            link.href = prefix + href;
                        }
                    }
                });

                // Update dropdown links
                document.querySelectorAll('.dropdown-item').forEach(link => {
                    const href = link.getAttribute('href');
                    if (href) {
                        link.href = prefix + href;
                    }
                });
            }
        }

        // Load footer
        const footerContainer = document.getElementById('footer-container');
        if (footerContainer) {
            const footerResponse = await fetch(prefix + 'components/footer.html');
            if (footerResponse.ok) {
                const footerContent = await footerResponse.text();
                footerContainer.innerHTML = footerContent;
                
                // Update footer links
                const currentPath = window.location.pathname;
                const isInToolsDirectory = currentPath.includes('/tools/');
                const prefix = isInToolsDirectory ? '../' : '';

                document.querySelectorAll('.footer-links a').forEach(link => {
                    const href = link.getAttribute('href');
                    if (href && !href.startsWith('#')) {
                        if (href === 'about.html') {
                            link.href = prefix + 'tools/about.html';
                        } else if (href === 'contact.html') {
                            link.href = prefix + 'tools/contact.html';
                        } else {
                            link.href = prefix + href;
                        }
                    }
                });
            }
        }
    } catch (error) {
        console.error('Error loading components:', error);
        // Add fallback content if components fail to load
        const headerContainer = document.getElementById('header-container');
        const footerContainer = document.getElementById('footer-container');
        
        if (headerContainer) {
            headerContainer.innerHTML = `
                <nav class="navbar navbar-expand-lg navbar-light bg-light">
                    <div class="container">
                        <a class="navbar-brand" href="/">Multi-Tools Hub</a>
                    </div>
                </nav>
            `;
        }
        
        if (footerContainer) {
            footerContainer.innerHTML = `
                <footer class="footer mt-5 py-3 bg-light">
                    <div class="container text-center">
                        <p class="mb-0">&copy; 2024 Multi-Tools Hub. All rights reserved.</p>
                    </div>
                </footer>
            `;
        }
    }
}

// Load components when the DOM is ready
document.addEventListener('DOMContentLoaded', loadComponents); 
