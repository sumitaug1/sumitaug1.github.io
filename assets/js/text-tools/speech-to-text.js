document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const textOutput = document.getElementById('textOutput');
    const languageSelect = document.getElementById('languageSelect');
    const toggleBtn = document.getElementById('toggleBtn');
    const clearBtn = document.getElementById('clearBtn');
    const copyBtn = document.getElementById('copyBtn');
    const statusIndicator = document.getElementById('statusIndicator');
    const statusText = document.getElementById('statusText');

    // Initialize speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        showNotification('Speech recognition is not supported in your browser. Please try Chrome or Edge.', 'error');
        toggleBtn.disabled = true;
        return;
    }

    const recognition = new SpeechRecognition();
    let isListening = false;

    // Configure recognition
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = languageSelect.value;

    // Update status
    function updateStatus(listening) {
        isListening = listening;
        if (listening) {
            statusIndicator.innerHTML = '<i class="fas fa-circle text-success"></i>';
            statusText.textContent = 'Listening...';
            toggleBtn.innerHTML = '<i class="fas fa-stop me-2"></i>Stop Listening';
            toggleBtn.classList.remove('btn-primary');
            toggleBtn.classList.add('btn-danger');
        } else {
            statusIndicator.innerHTML = '<i class="fas fa-circle text-danger"></i>';
            statusText.textContent = 'Not listening';
            toggleBtn.innerHTML = '<i class="fas fa-microphone me-2"></i>Start Listening';
            toggleBtn.classList.remove('btn-danger');
            toggleBtn.classList.add('btn-primary');
        }
    }

    // Show notification
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`;
        notification.style.zIndex = '1050';
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        document.body.appendChild(notification);

        // Auto-dismiss after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Event handlers
    recognition.onstart = () => {
        updateStatus(true);
    };

    recognition.onend = () => {
        updateStatus(false);
    };

    recognition.onerror = (event) => {
        updateStatus(false);
        showNotification(`Error: ${event.error}`, 'error');
    };

    recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcript + ' ';
            } else {
                interimTranscript += transcript;
            }
        }

        // Update the text output
        textOutput.value = finalTranscript + interimTranscript;
    };

    // Event listeners
    toggleBtn.addEventListener('click', () => {
        if (isListening) {
            recognition.stop();
        } else {
            recognition.start();
        }
    });

    clearBtn.addEventListener('click', () => {
        textOutput.value = '';
        showNotification('Text cleared', 'info');
    });

    copyBtn.addEventListener('click', () => {
        if (textOutput.value.trim()) {
            navigator.clipboard.writeText(textOutput.value)
                .then(() => {
                    showNotification('Text copied to clipboard', 'success');
                })
                .catch(() => {
                    showNotification('Failed to copy text', 'error');
                });
        } else {
            showNotification('No text to copy', 'warning');
        }
    });

    languageSelect.addEventListener('change', () => {
        recognition.lang = languageSelect.value;
        if (isListening) {
            recognition.stop();
            recognition.start();
        }
    });

    // Initialize
    updateStatus(false);
}); 