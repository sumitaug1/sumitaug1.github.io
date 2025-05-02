document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const postUrl = document.getElementById('postUrl');
    const extractBtn = document.getElementById('extractBtn');
    const resultsCard = document.getElementById('resultsCard');
    const statusAlert = document.getElementById('statusAlert');
    const statusText = document.getElementById('statusText');
    const photosGrid = document.getElementById('photosGrid');

    // Update status alert
    function updateStatusAlert(status, message) {
        statusAlert.className = 'alert mb-4';
        statusAlert.classList.add(`alert-${status}`);
        statusText.textContent = message;
    }

    // Extract post ID from URL
    function extractPostId(url) {
        const regExp = /instagram.com\/p\/([^/?]+)/;
        const match = url.match(regExp);
        return match ? match[1] : null;
    }

    // Create photo card
    function createPhotoCard(url, index) {
        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-4';
        
        col.innerHTML = `
            <div class="card h-100">
                <img src="${url}" class="card-img-top" alt="Instagram photo ${index + 1}" onerror="this.src='../../assets/images/placeholder.jpg'">
                <div class="card-body">
                    <h6 class="card-title">Photo ${index + 1}</h6>
                    <a href="${url}" class="btn btn-primary btn-sm w-100" download="instagram-photo-${index + 1}.jpg">
                        <i class="fas fa-download me-2"></i>Download
                    </a>
                </div>
            </div>
        `;
        
        return col;
    }

    // Extract photos
    async function extractPhotos() {
        const url = postUrl.value.trim();

        if (!url) {
            alert('Please enter an Instagram post URL');
            return;
        }

        // Show loading state
        updateStatusAlert('info', 'Extracting photos...');
        resultsCard.classList.remove('d-none');
        photosGrid.innerHTML = '';

        try {
            const postId = extractPostId(url);
            
            if (!postId) {
                updateStatusAlert('danger', 'Invalid Instagram post URL');
                return;
            }

            // Note: Due to Instagram's API restrictions, we'll show a message about the limitation
            updateStatusAlert('warning', 'Due to Instagram\'s API restrictions, we cannot directly access the photos. Please use Instagram\'s official app or website to download photos.');

            // Show a message about the limitation
            const messageDiv = document.createElement('div');
            messageDiv.className = 'col-12';
            messageDiv.innerHTML = `
                <div class="alert alert-info">
                    <i class="fas fa-info-circle me-2"></i>
                    <strong>Note:</strong> Due to Instagram's API restrictions, we cannot directly access the photos. To download Instagram photos, you can:
                    <ul class="mt-2">
                        <li>Use Instagram's official app</li>
                        <li>Use Instagram's website</li>
                        <li>Use Instagram's built-in download feature</li>
                    </ul>
                </div>
            `;
            photosGrid.appendChild(messageDiv);

        } catch (error) {
            console.error('Error extracting photos:', error);
            updateStatusAlert('danger', 'Error extracting photos. Please make sure the URL is valid.');
        }
    }

    // Extract button click handler
    extractBtn.addEventListener('click', extractPhotos);

    // Form submission handler
    document.getElementById('photoForm').addEventListener('submit', function(e) {
        e.preventDefault();
        extractPhotos();
    });
}); 