document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const textInput = document.getElementById('textInput');
    const voiceSelect = document.getElementById('voiceSelect');
    const rateSelect = document.getElementById('rateSelect');
    const speakBtn = document.getElementById('speakBtn');
    const clearBtn = document.getElementById('clearBtn');

    // Initialize speech synthesis
    const speechSynthesis = window.speechSynthesis;
    let voices = [];

    // Load available voices
    function loadVoices() {
        voices = speechSynthesis.getVoices();
        voiceSelect.innerHTML = '';
        
        // Sort voices by language and name
        voices.sort((a, b) => {
            if (a.lang === b.lang) {
                return a.name.localeCompare(b.name);
            }
            return a.lang.localeCompare(b.lang);
        });

        // Group voices by language
        const languageGroups = {};
        voices.forEach(voice => {
            if (!languageGroups[voice.lang]) {
                languageGroups[voice.lang] = [];
            }
            languageGroups[voice.lang].push(voice);
        });

        // Create optgroups for each language
        Object.keys(languageGroups).sort().forEach(lang => {
            const optgroup = document.createElement('optgroup');
            optgroup.label = lang;
            
            languageGroups[lang].forEach(voice => {
                const option = document.createElement('option');
                option.value = voice.name;
                option.textContent = voice.name;
                optgroup.appendChild(option);
            });
            
            voiceSelect.appendChild(optgroup);
        });
    }

    // Speak the text
    function speak() {
        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
        }

        const text = textInput.value.trim();
        if (!text) {
            showNotification('Please enter some text to speak', 'warning');
            return;
        }

        const utterance = new SpeechSynthesisUtterance(text);
        
        // Set voice
        const selectedVoice = voices.find(voice => voice.name === voiceSelect.value);
        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }

        // Set properties
        utterance.rate = parseFloat(rateSelect.value);

        // Event handlers
        utterance.onstart = () => {
            speakBtn.innerHTML = '<i class="fas fa-stop me-2"></i>Stop';
            speakBtn.classList.remove('btn-primary');
            speakBtn.classList.add('btn-danger');
        };

        utterance.onend = () => {
            speakBtn.innerHTML = '<i class="fas fa-play me-2"></i>Speak';
            speakBtn.classList.remove('btn-danger');
            speakBtn.classList.add('btn-primary');
        };

        utterance.onerror = (event) => {
            speakBtn.innerHTML = '<i class="fas fa-play me-2"></i>Speak';
            speakBtn.classList.remove('btn-danger');
            speakBtn.classList.add('btn-primary');
            showNotification(`Error: ${event.error}`, 'error');
        };

        speechSynthesis.speak(utterance);
    }

    // Stop speaking
    function stopSpeaking() {
        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
            speakBtn.innerHTML = '<i class="fas fa-play me-2"></i>Speak';
            speakBtn.classList.remove('btn-danger');
            speakBtn.classList.add('btn-primary');
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

    // Event listeners
    speechSynthesis.onvoiceschanged = loadVoices;

    speakBtn.addEventListener('click', () => {
        if (speechSynthesis.speaking) {
            stopSpeaking();
        } else {
            speak();
        }
    });

    clearBtn.addEventListener('click', () => {
        textInput.value = '';
        if (speechSynthesis.speaking) {
            stopSpeaking();
        }
        showNotification('Text cleared', 'info');
    });

    // Initialize
    loadVoices();
}); 