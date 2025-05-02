document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const videoUrl = document.getElementById('videoUrl');
    const extractBtn = document.getElementById('extractBtn');
    const resultsCard = document.getElementById('resultsCard');
    const statusAlert = document.getElementById('statusAlert');
    const statusText = document.getElementById('statusText');
    const tagsContainer = document.getElementById('tagsContainer');
    const tagsText = document.getElementById('tagsText');
    const copyBtn = document.getElementById('copyBtn');
    const exportBtn = document.getElementById('exportBtn');

    // Update status alert
    function updateStatusAlert(status, message) {
        statusAlert.className = 'alert mb-4';
        statusAlert.classList.add(`alert-${status}`);
        statusText.textContent = message;
    }

    // Extract video ID from URL
    function extractVideoId(url) {
        const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const match = url.match(regExp);
        return match ? match[1] : null;
    }

    // Create tag badge
    function createTagBadge(tag) {
        const badge = document.createElement('span');
        badge.className = 'badge bg-primary';
        badge.textContent = tag;
        return badge;
    }

    // Extract tags
    async function extractTags() {
        const url = videoUrl.value.trim();

        if (!url) {
            alert('Please enter a YouTube video URL');
            return;
        }

        // Show loading state
        updateStatusAlert('info', 'Extracting tags...');
        resultsCard.classList.remove('d-none');
        tagsContainer.innerHTML = '';
        tagsText.value = '';

        try {
            const videoId = extractVideoId(url);
            
            if (!videoId) {
                updateStatusAlert('danger', 'Invalid YouTube video URL');
                return;
            }

            // Note: Due to YouTube's API restrictions, we'll show a message about the limitation
            updateStatusAlert('warning', 'Due to YouTube\'s API restrictions, we cannot directly access the tags. Please use YouTube\'s official app or website to view tags.');

            // Show a message about the limitation
            const messageDiv = document.createElement('div');
            messageDiv.className = 'col-12';
            messageDiv.innerHTML = `
                <div class="alert alert-info">
                    <i class="fas fa-info-circle me-2"></i>
                    <strong>Note:</strong> Due to YouTube's API restrictions, we cannot directly access the tags. To view YouTube video tags, you can:
                    <ul class="mt-2">
                        <li>Use YouTube's official app</li>
                        <li>Use YouTube's website</li>
                        <li>Use YouTube's built-in tag viewer</li>
                    </ul>
                </div>
            `;
            tagsContainer.appendChild(messageDiv);

        } catch (error) {
            console.error('Error extracting tags:', error);
            updateStatusAlert('danger', 'Error extracting tags. Please make sure the URL is valid.');
        }
    }

    // Copy tags to clipboard
    function copyTags() {
        const text = tagsText.value;
        navigator.clipboard.writeText(text).then(() => {
            // Show success message
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check me-2"></i>Copied!';
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    }

    // Export tags to file
    function exportTags() {
        const text = tagsText.value;
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'youtube-tags.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Extract button click handler
    extractBtn.addEventListener('click', extractTags);

    // Copy button click handler
    copyBtn.addEventListener('click', copyTags);

    // Export button click handler
    exportBtn.addEventListener('click', exportTags);

    // Form submission handler
    document.getElementById('tagsForm').addEventListener('submit', function(e) {
        e.preventDefault();
        extractTags();
    });
}); 