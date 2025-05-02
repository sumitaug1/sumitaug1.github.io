document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const hashtagForm = document.getElementById('hashtagForm');
    const keywordsInput = document.getElementById('keywords');
    const hashtagCount = document.getElementById('hashtagCount');
    const hashtagCountValue = document.getElementById('hashtagCountValue');
    const resultsCard = document.getElementById('resultsCard');
    const hashtagsContainer = document.getElementById('hashtagsContainer');
    const hashtagsText = document.getElementById('hashtagsText');
    const copyBtn = document.getElementById('copyBtn');
    const exportBtn = document.getElementById('exportBtn');

    // Update hashtag count value display
    hashtagCount.addEventListener('input', function() {
        hashtagCountValue.textContent = this.value;
    });

    // Handle form submission
    hashtagForm.addEventListener('submit', function(e) {
        e.preventDefault();
        generateHashtags();
    });

    // Handle copy button click
    copyBtn.addEventListener('click', function() {
        copyHashtags();
    });

    // Handle export button click
    exportBtn.addEventListener('click', function() {
        exportHashtags();
    });

    // Generate hashtags based on input
    function generateHashtags() {
        const keywords = keywordsInput.value.trim();
        if (!keywords) {
            showAlert('Please enter keywords', 'danger');
            return;
        }

        // Get selected platforms
        const platforms = [];
        if (document.getElementById('instagram').checked) platforms.push('instagram');
        if (document.getElementById('twitter').checked) platforms.push('twitter');
        if (document.getElementById('tiktok').checked) platforms.push('tiktok');

        if (platforms.length === 0) {
            showAlert('Please select at least one platform', 'danger');
            return;
        }

        // Generate hashtags
        const hashtags = generateHashtagsFromKeywords(keywords, platforms, parseInt(hashtagCount.value));
        
        // Display hashtags
        displayHashtags(hashtags);
        
        // Show results card
        resultsCard.classList.remove('d-none');
    }

    // Generate hashtags from keywords
    function generateHashtagsFromKeywords(keywords, platforms, count) {
        const keywordArray = keywords.split(/[,\s]+/).filter(k => k.trim());
        const hashtags = new Set();

        // Add keyword-based hashtags
        keywordArray.forEach(keyword => {
            const cleanKeyword = keyword.toLowerCase().trim();
            hashtags.add(`#${cleanKeyword}`);
            hashtags.add(`#${cleanKeyword}s`);
            hashtags.add(`#${cleanKeyword}life`);
            hashtags.add(`#${cleanKeyword}lover`);
        });

        // Add platform-specific hashtags
        platforms.forEach(platform => {
            switch (platform) {
                case 'instagram':
                    hashtags.add('#instagram');
                    hashtags.add('#instagood');
                    hashtags.add('#instadaily');
                    break;
                case 'twitter':
                    hashtags.add('#twitter');
                    hashtags.add('#tweet');
                    hashtags.add('#followme');
                    break;
                case 'tiktok':
                    hashtags.add('#tiktok');
                    hashtags.add('#tiktokviral');
                    hashtags.add('#tiktoktrend');
                    break;
            }
        });

        // Add trending hashtags
        hashtags.add('#trending');
        hashtags.add('#viral');
        hashtags.add('#fyp');
        hashtags.add('#explore');

        // Convert to array and limit to requested count
        return Array.from(hashtags).slice(0, count);
    }

    // Display hashtags in the UI
    function displayHashtags(hashtags) {
        // Clear previous hashtags
        hashtagsContainer.innerHTML = '';
        hashtagsText.value = hashtags.join(' ');

        // Create hashtag badges
        hashtags.forEach(hashtag => {
            const badge = document.createElement('span');
            badge.className = 'badge bg-primary me-2 mb-2';
            badge.textContent = hashtag;
            hashtagsContainer.appendChild(badge);
        });
    }

    // Copy hashtags to clipboard
    function copyHashtags() {
        const text = hashtagsText.value;
        if (!text) {
            showAlert('No hashtags to copy', 'warning');
            return;
        }

        navigator.clipboard.writeText(text)
            .then(() => {
                showAlert('Hashtags copied to clipboard!', 'success');
            })
            .catch(err => {
                showAlert('Failed to copy hashtags', 'danger');
                console.error('Failed to copy text: ', err);
            });
    }

    // Export hashtags to file
    function exportHashtags() {
        const text = hashtagsText.value;
        if (!text) {
            showAlert('No hashtags to export', 'warning');
            return;
        }

        const blob = new Blob([text], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'hashtags.txt';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }

    // Show alert message
    function showAlert(message, type) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        
        const container = document.querySelector('.container');
        container.insertBefore(alertDiv, container.firstChild);

        // Auto dismiss after 3 seconds
        setTimeout(() => {
            alertDiv.remove();
        }, 3000);
    }
}); 