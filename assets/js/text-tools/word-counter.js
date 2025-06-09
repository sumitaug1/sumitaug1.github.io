document.addEventListener('DOMContentLoaded', function() {
    const textInput = document.getElementById('textInput');
    const wordCount = document.getElementById('wordCount');
    const charCount = document.getElementById('charCount');
    const readingTime = document.getElementById('readingTime');
    const clearBtn = document.getElementById('clearBtn');
    const copyBtn = document.getElementById('copyBtn');

    // Average reading speed (words per minute)
    const WORDS_PER_MINUTE = 200;

    function updateCounts() {
        const text = textInput.value;
        
        // Word count
        const words = text.trim().split(/\s+/);
        const wordCountValue = text.trim() ? words.length : 0;
        wordCount.textContent = wordCountValue;
        
        // Character count
        charCount.textContent = text.length;
        
        // Reading time
        const minutes = Math.ceil(wordCountValue / WORDS_PER_MINUTE);
        readingTime.textContent = `${minutes} min`;
    }

    // Event Listeners
    textInput.addEventListener('input', utils.debounce(updateCounts, 100));

    clearBtn.addEventListener('click', () => {
        textInput.value = '';
        updateCounts();
        utils.showNotification('Text cleared successfully');
    });

    copyBtn.addEventListener('click', () => {
        if (textInput.value) {
            utils.copyToClipboard(textInput.value)
                .then(() => {
                    utils.showNotification('Text copied to clipboard');
                })
                .catch(() => {
                    utils.showNotification('Failed to copy text', 'danger');
                });
        } else {
            utils.showNotification('No text to copy', 'warning');
        }
    });

    // Initialize counts
    updateCounts();
}); 