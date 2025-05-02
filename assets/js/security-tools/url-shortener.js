document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const longUrl = document.getElementById('longUrl');
    const customAlias = document.getElementById('customAlias');
    const shortenedUrl = document.getElementById('shortenedUrl');
    const shortenBtn = document.getElementById('shortenBtn');
    const clearBtn = document.getElementById('clearBtn');
    const copyBtn = document.getElementById('copyBtn');
    const qrcode = document.getElementById('qrcode');
    const downloadQrBtn = document.getElementById('downloadQrBtn');

    // Base URL for shortened links
    const baseUrl = 'https://yourdomain.com/';

    // Generate random string for URL alias
    function generateRandomAlias(length = 6) {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    // Validate URL
    function isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch (e) {
            return false;
        }
    }

    // Generate QR code
    function generateQRCode(url) {
        // Clear previous QR code
        qrcode.innerHTML = '';
        
        // Generate new QR code
        new QRCode(qrcode, {
            text: url,
            width: 200,
            height: 200,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
        });

        // Enable download button
        downloadQrBtn.disabled = false;
    }

    // Shorten URL
    function shortenUrl() {
        const url = longUrl.value.trim();
        const alias = customAlias.value.trim();

        if (!url) {
            alert('Please enter a URL to shorten');
            return;
        }

        if (!isValidUrl(url)) {
            alert('Please enter a valid URL');
            return;
        }

        // Generate shortened URL
        const shortenedAlias = alias || generateRandomAlias();
        const shortened = baseUrl + shortenedAlias;
        
        // Update UI
        shortenedUrl.value = shortened;
        generateQRCode(shortened);

        // Here you would typically make an API call to save the URL mapping
        // For now, we'll just simulate it
        console.log('URL mapping:', {
            original: url,
            shortened: shortened,
            alias: shortenedAlias
        });
    }

    // Shorten button click handler
    shortenBtn.addEventListener('click', shortenUrl);

    // Clear button click handler
    clearBtn.addEventListener('click', function() {
        longUrl.value = '';
        customAlias.value = '';
        shortenedUrl.value = '';
        qrcode.innerHTML = '';
        downloadQrBtn.disabled = true;
    });

    // Copy button click handler
    copyBtn.addEventListener('click', function() {
        if (shortenedUrl.value) {
            shortenedUrl.select();
            document.execCommand('copy');
            alert('URL copied to clipboard!');
        }
    });

    // Download QR code button click handler
    downloadQrBtn.addEventListener('click', function() {
        const canvas = qrcode.querySelector('canvas');
        if (canvas) {
            const link = document.createElement('a');
            link.download = 'qrcode.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        }
    });

    // Form submission handler
    document.getElementById('urlShortenerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        shortenUrl();
    });
}); 