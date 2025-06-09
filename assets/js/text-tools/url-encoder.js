document.addEventListener('DOMContentLoaded', function() {
    const inputUrl = document.getElementById('inputUrl');
    const encodedUrl = document.getElementById('encodedUrl');
    const encodeBtn = document.getElementById('encodeBtn');
    const clearBtn = document.getElementById('clearBtn');
    const copyBtn = document.getElementById('copyBtn');

    function encodeURL(text) {
        try {
            return encodeURIComponent(text);
        } catch (e) {
            utils.showNotification('Error encoding URL', 'danger');
            return '';
        }
    }

    function updateEncodedUrl() {
        const text = inputUrl.value;
        if (text) {
            encodedUrl.value = encodeURL(text);
        } else {
            encodedUrl.value = '';
        }
    }

    // Event Listeners
    inputUrl.addEventListener('input', utils.debounce(updateEncodedUrl, 100));

    encodeBtn.addEventListener('click', () => {
        updateEncodedUrl();
        utils.showNotification('URL encoded successfully');
    });

    clearBtn.addEventListener('click', () => {
        inputUrl.value = '';
        encodedUrl.value = '';
        utils.showNotification('Fields cleared successfully');
    });

    copyBtn.addEventListener('click', () => {
        if (encodedUrl.value) {
            utils.copyToClipboard(encodedUrl.value)
                .then(() => {
                    utils.showNotification('Encoded URL copied to clipboard');
                })
                .catch(() => {
                    utils.showNotification('Failed to copy URL', 'danger');
                });
        } else {
            utils.showNotification('No URL to copy', 'warning');
        }
    });

    // Initialize
    updateEncodedUrl();
}); 