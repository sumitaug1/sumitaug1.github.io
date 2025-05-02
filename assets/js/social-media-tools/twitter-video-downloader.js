document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const tweetUrl = document.getElementById('tweetUrl');
    const extractBtn = document.getElementById('extractBtn');
    const resultsCard = document.getElementById('resultsCard');
    const statusAlert = document.getElementById('statusAlert');
    const statusText = document.getElementById('statusText');
    const videoPreview = document.getElementById('videoPreview');
    const downloadOptions = document.getElementById('downloadOptions');

    // Update status alert
    function updateStatusAlert(status, message) {
        statusAlert.className = 'alert mb-4';
        statusAlert.classList.add(`alert-${status}`);
        statusText.textContent = message;
    }

    // Extract tweet ID from URL
    function extractTweetId(url) {
        const regExp = /twitter.com\/\w+\/status\/(\d+)/;
        const match = url.match(regExp);
        return match ? match[1] : null;
    }

    // Create download option card
    function createDownloadOption(quality, url, tweetId) {
        const col = document.createElement('div');
        col.className = 'col-md-6';
        
        col.innerHTML = `
            <div class="card h-100">
                <div class="card-body">
                    <h6 class="card-title">${quality} Quality</h6>
                    <a href="${url}" class="btn btn-primary btn-sm w-100" download="twitter-video-${tweetId}-${quality}.mp4">
                        <i class="fas fa-download me-2"></i>Download
                    </a>
                </div>
            </div>
        `;
        
        return col;
    }

    // Extract video
    async function extractVideo() {
        const url = tweetUrl.value.trim();

        if (!url) {
            alert('Please enter a Twitter post URL');
            return;
        }

        // Show loading state
        updateStatusAlert('info', 'Extracting video...');
        resultsCard.classList.remove('d-none');
        videoPreview.innerHTML = '';
        downloadOptions.innerHTML = '';

        try {
            const tweetId = extractTweetId(url);
            
            if (!tweetId) {
                updateStatusAlert('danger', 'Invalid Twitter post URL');
                return;
            }

            // Note: Due to Twitter's API restrictions, we'll show a message about the limitation
            updateStatusAlert('warning', 'Due to Twitter\'s API restrictions, we cannot directly access the videos. Please use Twitter\'s official app or website to download videos.');

            // Show a message about the limitation
            const messageDiv = document.createElement('div');
            messageDiv.className = 'col-12';
            messageDiv.innerHTML = `
                <div class="alert alert-info">
                    <i class="fas fa-info-circle me-2"></i>
                    <strong>Note:</strong> Due to Twitter's API restrictions, we cannot directly access the videos. To download Twitter videos, you can:
                    <ul class="mt-2">
                        <li>Use Twitter's official app</li>
                        <li>Use Twitter's website</li>
                        <li>Use Twitter's built-in download feature</li>
                    </ul>
                </div>
            `;
            downloadOptions.appendChild(messageDiv);

        } catch (error) {
            console.error('Error extracting video:', error);
            updateStatusAlert('danger', 'Error extracting video. Please make sure the URL is valid.');
        }
    }

    // Extract button click handler
    extractBtn.addEventListener('click', extractVideo);

    // Form submission handler
    document.getElementById('videoForm').addEventListener('submit', function(e) {
        e.preventDefault();
        extractVideo();
    });
}); 