document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const videoUrl = document.getElementById('videoUrl');
    const extractBtn = document.getElementById('extractBtn');
    const resultsCard = document.getElementById('resultsCard');
    const statusAlert = document.getElementById('statusAlert');
    const statusText = document.getElementById('statusText');
    const thumbnailsGrid = document.getElementById('thumbnailsGrid');

    // Update status alert
    function updateStatusAlert(status, message) {
        statusAlert.className = 'alert mb-4';
        statusAlert.classList.add(`alert-${status}`);
        statusText.textContent = message;
    }

    // Extract video ID from URL
    function extractVideoId(url) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }

    // Generate thumbnail URLs
    function generateThumbnailUrls(videoId) {
        return {
            maxres: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
            hq: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
            mq: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
            default: `https://img.youtube.com/vi/${videoId}/default.jpg`
        };
    }

    // Create thumbnail card
    function createThumbnailCard(quality, url, videoId) {
        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-3';
        
        col.innerHTML = `
            <div class="card h-100">
                <img src="${url}" class="card-img-top" alt="YouTube thumbnail ${quality}" onerror="this.src='../../assets/images/placeholder.jpg'">
                <div class="card-body">
                    <h6 class="card-title">${quality.toUpperCase()} Quality</h6>
                    <a href="${url}" class="btn btn-primary btn-sm w-100" download="youtube-thumbnail-${videoId}-${quality}.jpg">
                        <i class="fas fa-download me-2"></i>Download
                    </a>
                </div>
            </div>
        `;
        
        return col;
    }

    // Extract thumbnails
    async function extractThumbnails() {
        const url = videoUrl.value.trim();

        if (!url) {
            alert('Please enter a YouTube video URL');
            return;
        }

        // Show loading state
        updateStatusAlert('info', 'Extracting thumbnails...');
        resultsCard.classList.remove('d-none');
        thumbnailsGrid.innerHTML = '';

        try {
            const videoId = extractVideoId(url);
            
            if (!videoId) {
                updateStatusAlert('danger', 'Invalid YouTube video URL');
                return;
            }

            const thumbnails = generateThumbnailUrls(videoId);
            
            // Create thumbnail cards
            Object.entries(thumbnails).forEach(([quality, url]) => {
                const card = createThumbnailCard(quality, url, videoId);
                thumbnailsGrid.appendChild(card);
            });

            // Update status
            updateStatusAlert('success', 'Thumbnails extracted successfully');

        } catch (error) {
            console.error('Error extracting thumbnails:', error);
            updateStatusAlert('danger', 'Error extracting thumbnails. Please make sure the URL is valid.');
        }
    }

    // Extract button click handler
    extractBtn.addEventListener('click', extractThumbnails);

    // Form submission handler
    document.getElementById('thumbnailForm').addEventListener('submit', function(e) {
        e.preventDefault();
        extractThumbnails();
    });
}); 