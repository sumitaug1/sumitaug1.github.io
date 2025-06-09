document.addEventListener('DOMContentLoaded', function() {
    const textInput = document.getElementById('textInput');
    const charCount = document.getElementById('charCount');
    const wordCount = document.getElementById('wordCount');
    const sentenceCount = document.getElementById('sentenceCount');
    const paragraphCount = document.getElementById('paragraphCount');
    const clearBtn = document.getElementById('clearBtn');
    const copyBtn = document.getElementById('copyBtn');

    function updateCounts() {
        const text = textInput.value;
        
        // Character count
        charCount.textContent = text.length;
        
        // Word count
        const words = text.trim().split(/\s+/);
        wordCount.textContent = text.trim() ? words.length : 0;
        
        // Sentence count
        const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
        sentenceCount.textContent = sentences.length;
        
        // Paragraph count
        const paragraphs = text.split(/\n\s*\n/).filter(paragraph => paragraph.trim().length > 0);
        paragraphCount.textContent = paragraphs.length;
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