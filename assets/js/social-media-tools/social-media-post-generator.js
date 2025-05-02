document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const postForm = document.getElementById('postForm');
    const platformSelect = document.getElementById('platform');
    const postTypeSelect = document.getElementById('postType');
    const keywordsInput = document.getElementById('keywords');
    const toneSelect = document.getElementById('tone');
    const callToActionSelect = document.getElementById('callToAction');
    const resultsCard = document.getElementById('resultsCard');
    const postContent = document.getElementById('postContent');
    const hashtagsContainer = document.getElementById('hashtagsContainer');
    const copyBtn = document.getElementById('copyBtn');
    const exportBtn = document.getElementById('exportBtn');

    // Handle form submission
    postForm.addEventListener('submit', function(e) {
        e.preventDefault();
        generatePost();
    });

    // Handle copy button click
    copyBtn.addEventListener('click', function() {
        copyPost();
    });

    // Handle export button click
    exportBtn.addEventListener('click', function() {
        exportPost();
    });

    // Generate post based on input
    function generatePost() {
        const platform = platformSelect.value;
        const postType = postTypeSelect.value;
        const keywords = keywordsInput.value.trim();
        const tone = toneSelect.value;
        const callToAction = callToActionSelect.value;

        if (!platform || !postType || !tone) {
            showAlert('Please fill in all required fields', 'danger');
            return;
        }

        // Generate post content
        const content = generatePostContent(platform, postType, keywords, tone, callToAction);
        
        // Generate hashtags
        const hashtags = generateHashtags(platform, postType, keywords);
        
        // Display results
        displayResults(content, hashtags);
        
        // Show results card
        resultsCard.classList.remove('d-none');
    }

    // Generate post content based on inputs
    function generatePostContent(platform, postType, keywords, tone, callToAction) {
        const keywordArray = keywords.split(/[,\s]+/).filter(k => k.trim());
        let content = '';

        // Platform-specific content
        switch (platform) {
            case 'instagram':
                content = generateInstagramPost(postType, keywordArray, tone, callToAction);
                break;
            case 'twitter':
                content = generateTwitterPost(postType, keywordArray, tone, callToAction);
                break;
            case 'facebook':
                content = generateFacebookPost(postType, keywordArray, tone, callToAction);
                break;
        }

        return content;
    }

    // Generate Instagram post
    function generateInstagramPost(postType, keywords, tone, callToAction) {
        let content = '';
        const emoji = getToneEmoji(tone);

        switch (postType) {
            case 'promotional':
                content = `${emoji} Exciting news! We're launching something special...\n\n`;
                content += `✨ ${keywords.join(' ')}\n\n`;
                content += `Don't miss out on this amazing opportunity! ${getCallToAction(callToAction)}`;
                break;
            case 'informative':
                content = `${emoji} Did you know?\n\n`;
                content += `📚 ${keywords.join(' ')}\n\n`;
                content += `Stay tuned for more interesting facts! ${getCallToAction(callToAction)}`;
                break;
            case 'engagement':
                content = `${emoji} We want to hear from you!\n\n`;
                content += `💭 ${keywords.join(' ')}\n\n`;
                content += `Share your thoughts in the comments below! ${getCallToAction(callToAction)}`;
                break;
            case 'story':
                content = `${emoji} Behind the scenes...\n\n`;
                content += `🎬 ${keywords.join(' ')}\n\n`;
                content += `Swipe up to learn more! ${getCallToAction(callToAction)}`;
                break;
        }

        return content;
    }

    // Generate Twitter post
    function generateTwitterPost(postType, keywords, tone, callToAction) {
        let content = '';
        const emoji = getToneEmoji(tone);

        switch (postType) {
            case 'promotional':
                content = `${emoji} Breaking: ${keywords.join(' ')}! ${getCallToAction(callToAction)}`;
                break;
            case 'informative':
                content = `${emoji} Quick tip: ${keywords.join(' ')}. ${getCallToAction(callToAction)}`;
                break;
            case 'engagement':
                content = `${emoji} Question: ${keywords.join(' ')}? ${getCallToAction(callToAction)}`;
                break;
            case 'story':
                content = `${emoji} Thread: ${keywords.join(' ')}. ${getCallToAction(callToAction)}`;
                break;
        }

        return content;
    }

    // Generate Facebook post
    function generateFacebookPost(postType, keywords, tone, callToAction) {
        let content = '';
        const emoji = getToneEmoji(tone);

        switch (postType) {
            case 'promotional':
                content = `${emoji} We're thrilled to announce...\n\n`;
                content += `${keywords.join(' ')}\n\n`;
                content += `Join us in celebrating this milestone! ${getCallToAction(callToAction)}`;
                break;
            case 'informative':
                content = `${emoji} Important update:\n\n`;
                content += `${keywords.join(' ')}\n\n`;
                content += `Stay informed and share with your network! ${getCallToAction(callToAction)}`;
                break;
            case 'engagement':
                content = `${emoji} Let's discuss...\n\n`;
                content += `${keywords.join(' ')}\n\n`;
                content += `Share your thoughts in the comments! ${getCallToAction(callToAction)}`;
                break;
            case 'story':
                content = `${emoji} Our journey continues...\n\n`;
                content += `${keywords.join(' ')}\n\n`;
                content += `Follow along for more updates! ${getCallToAction(callToAction)}`;
                break;
        }

        return content;
    }

    // Get tone emoji
    function getToneEmoji(tone) {
        switch (tone) {
            case 'professional':
                return '👔';
            case 'casual':
                return '😊';
            case 'friendly':
                return '🤗';
            case 'humorous':
                return '😄';
            default:
                return '✨';
        }
    }

    // Get call to action text
    function getCallToAction(callToAction) {
        switch (callToAction) {
            case 'shop':
                return 'Shop now!';
            case 'learn':
                return 'Learn more!';
            case 'follow':
                return 'Follow us!';
            case 'share':
                return 'Share this!';
            default:
                return '';
        }
    }

    // Generate hashtags
    function generateHashtags(platform, postType, keywords) {
        const hashtags = new Set();
        const keywordArray = keywords.split(/[,\s]+/).filter(k => k.trim());

        // Add keyword-based hashtags
        keywordArray.forEach(keyword => {
            const cleanKeyword = keyword.toLowerCase().trim();
            hashtags.add(`#${cleanKeyword}`);
            hashtags.add(`#${cleanKeyword}s`);
        });

        // Add platform-specific hashtags
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
            case 'facebook':
                hashtags.add('#facebook');
                hashtags.add('#socialmedia');
                hashtags.add('#community');
                break;
        }

        // Add post type hashtags
        switch (postType) {
            case 'promotional':
                hashtags.add('#promotion');
                hashtags.add('#specialoffer');
                break;
            case 'informative':
                hashtags.add('#information');
                hashtags.add('#knowledge');
                break;
            case 'engagement':
                hashtags.add('#engagement');
                hashtags.add('#community');
                break;
            case 'story':
                hashtags.add('#story');
                hashtags.add('#behindthescenes');
                break;
        }

        return Array.from(hashtags);
    }

    // Display results in the UI
    function displayResults(content, hashtags) {
        // Set post content
        postContent.value = content;

        // Clear previous hashtags
        hashtagsContainer.innerHTML = '';

        // Create hashtag badges
        hashtags.forEach(hashtag => {
            const badge = document.createElement('span');
            badge.className = 'badge bg-primary me-2 mb-2';
            badge.textContent = hashtag;
            hashtagsContainer.appendChild(badge);
        });
    }

    // Copy post to clipboard
    function copyPost() {
        const text = postContent.value;
        if (!text) {
            showAlert('No post to copy', 'warning');
            return;
        }

        navigator.clipboard.writeText(text)
            .then(() => {
                showAlert('Post copied to clipboard!', 'success');
            })
            .catch(err => {
                showAlert('Failed to copy post', 'danger');
                console.error('Failed to copy text: ', err);
            });
    }

    // Export post to file
    function exportPost() {
        const text = postContent.value;
        if (!text) {
            showAlert('No post to export', 'warning');
            return;
        }

        const blob = new Blob([text], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'social-media-post.txt';
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