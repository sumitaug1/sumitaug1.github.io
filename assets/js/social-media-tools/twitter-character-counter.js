document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const tweetInput = document.getElementById('tweetInput');
    const charCount = document.getElementById('charCount');
    const remainingCount = document.getElementById('remainingCount');
    const wordCount = document.getElementById('wordCount');
    const urlCount = document.getElementById('urlCount');
    const hashtagCount = document.getElementById('hashtagCount');
    const includeUrls = document.getElementById('includeUrls');
    const includeMentions = document.getElementById('includeMentions');
    const includeHashtags = document.getElementById('includeHashtags');
    const copyBtn = document.getElementById('copyBtn');
    const clearBtn = document.getElementById('clearBtn');

    // Constants
    const MAX_CHARS = 280;
    const URL_LENGTH = 23;

    // Initialize counters
    updateCounters();

    // Add event listeners
    tweetInput.addEventListener('input', updateCounters);
    includeUrls.addEventListener('change', updateCounters);
    includeMentions.addEventListener('change', updateCounters);
    includeHashtags.addEventListener('change', updateCounters);
    copyBtn.addEventListener('click', copyTweet);
    clearBtn.addEventListener('click', clearTweet);

    // Update all counters
    function updateCounters() {
        const text = tweetInput.value;
        const stats = analyzeTweet(text);
        
        // Update character count
        const totalChars = calculateTotalChars(text, stats);
        charCount.textContent = totalChars;
        
        // Update remaining characters
        const remaining = MAX_CHARS - totalChars;
        remainingCount.textContent = remaining;
        
        // Update statistics
        wordCount.textContent = stats.words;
        urlCount.textContent = stats.urls;
        hashtagCount.textContent = stats.hashtags;

        // Update UI based on character count
        updateUI(totalChars);
    }

    // Analyze tweet content
    function analyzeTweet(text) {
        const stats = {
            words: 0,
            urls: 0,
            hashtags: 0,
            mentions: 0
        };

        // Count words
        stats.words = text.trim().split(/\s+/).filter(word => word.length > 0).length;

        // Count URLs
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        stats.urls = (text.match(urlRegex) || []).length;

        // Count hashtags
        const hashtagRegex = /#\w+/g;
        stats.hashtags = (text.match(hashtagRegex) || []).length;

        // Count mentions
        const mentionRegex = /@\w+/g;
        stats.mentions = (text.match(mentionRegex) || []).length;

        return stats;
    }

    // Calculate total characters according to Twitter's rules
    function calculateTotalChars(text, stats) {
        let total = text.length;

        // Adjust for URLs if enabled
        if (includeUrls.checked) {
            const urlRegex = /(https?:\/\/[^\s]+)/g;
            const urls = text.match(urlRegex) || [];
            urls.forEach(url => {
                total = total - url.length + URL_LENGTH;
            });
        }

        // Adjust for mentions if disabled
        if (!includeMentions.checked) {
            const mentionRegex = /@\w+/g;
            const mentions = text.match(mentionRegex) || [];
            mentions.forEach(mention => {
                total -= mention.length;
            });
        }

        // Adjust for hashtags if disabled
        if (!includeHashtags.checked) {
            const hashtagRegex = /#\w+/g;
            const hashtags = text.match(hashtagRegex) || [];
            hashtags.forEach(hashtag => {
                total -= hashtag.length;
            });
        }

        return total;
    }

    // Update UI based on character count
    function updateUI(totalChars) {
        // Update character count color
        if (totalChars > MAX_CHARS) {
            charCount.classList.add('text-danger');
            remainingCount.classList.add('text-danger');
        } else {
            charCount.classList.remove('text-danger');
            remainingCount.classList.remove('text-danger');
        }

        // Update copy button state
        copyBtn.disabled = totalChars > MAX_CHARS;
    }

    // Copy tweet to clipboard
    function copyTweet() {
        const text = tweetInput.value;
        if (!text) {
            showAlert('No tweet to copy', 'warning');
            return;
        }

        navigator.clipboard.writeText(text)
            .then(() => {
                showAlert('Tweet copied to clipboard!', 'success');
            })
            .catch(err => {
                showAlert('Failed to copy tweet', 'danger');
                console.error('Failed to copy text: ', err);
            });
    }

    // Clear tweet input
    function clearTweet() {
        tweetInput.value = '';
        updateCounters();
        showAlert('Tweet cleared', 'info');
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