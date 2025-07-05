document.addEventListener('DOMContentLoaded', function() {
    // Global variables
    let currentTemplate = 'elegant';
    let currentColor = 'gold';
    let currentFont = 'playfair';
    let isRecording = false;
    let currentAudioContext = null;
    let currentAudioSource = null;
    let rsvpData = { totalInvites: 0, confirmed: 0, pending: 0, declined: 0 };
    let whatsappInvites = [];
    let currentInvitationImageBlob = null;
    let isParticlesActive = false;
    let is3DActive = false;
    let isMusicPlaying = false;
    let previewModal = null;

    // Elements with error handling
    const form = document.getElementById('invitationForm');
    const templateCards = document.querySelectorAll('.template-card');
    const colorOptions = document.querySelectorAll('.color-option');
    const fontSelect = document.getElementById('fontSelect');
    const previewBtn = document.getElementById('previewBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const downloadFromPreview = document.getElementById('downloadFromPreview');
    const invitationPreview = document.getElementById('invitationPreview');

    // Initialize Bootstrap Modal safely
    const modalElement = document.getElementById('previewModal');
    if (modalElement && typeof bootstrap !== 'undefined') {
        previewModal = new bootstrap.Modal(modalElement);
    }

    // Template configurations
    const templates = {
        elegant: {
            name: 'Elegant',
            class: 'template-elegant',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%), radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%)',
            accent: '#D4AF37',
            pattern: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(212, 175, 55, 0.1) 10px, rgba(212, 175, 55, 0.1) 20px)'
        },
        modern: {
            name: 'Modern',
            class: 'template-modern',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%), linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%), linear-gradient(-45deg, rgba(255,255,255,0.1) 25%, transparent 25%)',
            accent: '#000000',
            pattern: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)'
        },
        classic: {
            name: 'Classic',
            class: 'template-classic',
            background: 'linear-gradient(135deg, #f3e7e9 0%, #e3eeff 100%), url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23800020\' fill-opacity=\'0.1\'%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'2\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            accent: '#800020',
            pattern: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(128, 0, 32, 0.05) 2px, rgba(128, 0, 32, 0.05) 4px)'
        },
        romantic: {
            name: 'Romantic',
            class: 'template-romantic',
            background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%), radial-gradient(circle at 25% 25%, rgba(255, 182, 193, 0.4) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(255, 105, 180, 0.4) 0%, transparent 50%)',
            accent: '#FF69B4',
            pattern: 'radial-gradient(circle at 20% 80%, rgba(255, 105, 180, 0.2) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 182, 193, 0.2) 0%, transparent 50%)'
        },
        vintage: {
            name: 'Vintage',
            class: 'template-vintage',
            background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%), url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%238B4513\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M20 20c0-11.046-8.954-20-20-20v40c11.046 0 20-8.954 20-20z\'/%3E%3C/g%3E%3C/svg%3E")',
            accent: '#8B4513',
            pattern: 'repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(139, 69, 19, 0.1) 5px, rgba(139, 69, 19, 0.1) 10px)'
        },
        minimalist: {
            name: 'Minimalist',
            class: 'template-minimalist',
            background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%), linear-gradient(90deg, transparent 98%, rgba(51, 51, 51, 0.1) 98%), linear-gradient(0deg, transparent 98%, rgba(51, 51, 51, 0.1) 98%)',
            accent: '#333333',
            pattern: 'radial-gradient(circle at 50% 50%, rgba(51, 51, 51, 0.05) 0%, transparent 50%)'
        }
    };

    // Color schemes
    const colorSchemes = {
        gold: {
            primary: '#D4AF37',
            secondary: '#B8860B',
            text: '#2C3E50'
        },
        rose: {
            primary: '#FFB6C1',
            secondary: '#FF69B4',
            text: '#4A4A4A'
        },
        sage: {
            primary: '#9CAF88',
            secondary: '#7D8B74',
            text: '#2C3E50'
        },
        navy: {
            primary: '#000080',
            secondary: '#0000CD',
            text: '#FFFFFF'
        },
        burgundy: {
            primary: '#800020',
            secondary: '#A52A2A',
            text: '#FFFFFF'
        },
        lavender: {
            primary: '#E6E6FA',
            secondary: '#9370DB',
            text: '#2C3E50'
        },
        coral: {
            primary: '#FF7F50',
            secondary: '#FF6347',
            text: '#FFFFFF'
        },
        emerald: {
            primary: '#50C878',
            secondary: '#228B22',
            text: '#FFFFFF'
        }
    };

    // Font families
    const fonts = {
        playfair: "'Playfair Display', serif",
        montserrat: "'Montserrat', sans-serif",
        dancing: "'Dancing Script', cursive",
        greatvibes: "'Great Vibes', cursive",
        cormorant: "'Cormorant Garamond', serif",
        serif: "'Times New Roman', serif"
    };

    // AI Suggestions
    const aiSuggestions = {
        romantic: [
            "Together with their families, [Bride] and [Groom] joyfully invite you to share in their celebration of love and commitment.",
            "With hearts full of love and excitement, [Bride] and [Groom] request the honor of your presence at their wedding celebration.",
            "Love is in the air as [Bride] and [Groom] invite you to witness their special day of unity and joy."
        ],
        formal: [
            "The honor of your presence is requested at the marriage of [Bride] and [Groom].",
            "You are cordially invited to attend the wedding ceremony of [Bride] and [Groom].",
            "Please join us in celebrating the marriage of [Bride] and [Groom]."
        ],
        casual: [
            "Come celebrate with us! [Bride] and [Groom] are getting married!",
            "We're tying the knot! [Bride] and [Groom] would love for you to be there.",
            "Join us for a day of love, laughter, and celebration as [Bride] and [Groom] say 'I do'!"
        ]
    };

    // Initialize functions with error handling
    try {
        initializeEventListeners();
        initializeQRCode();
        initializeAnalytics();
        initializeMusic();
        initializeLiveCollaboration();
        updatePreview();
    } catch (error) {
        console.error('Initialization error:', error);
    }

    // Event Listeners
    function initializeEventListeners() {
        if (!form) return;

        // Template selection
        templateCards.forEach(card => {
            card.addEventListener('click', function() {
                templateCards.forEach(c => c.classList.remove('active'));
                this.classList.add('active');
                currentTemplate = this.dataset.template;
                updatePreview();
                showNotification('Template updated!', 'success');
            });
        });

        // Color selection
        colorOptions.forEach(option => {
            option.addEventListener('click', function() {
                colorOptions.forEach(o => o.classList.remove('active'));
                this.classList.add('active');
                currentColor = this.dataset.color;
                updatePreview();
                showNotification('Color scheme updated!', 'success');
            });
        });

        // Font selection
        if (fontSelect) {
            fontSelect.addEventListener('change', function() {
                currentFont = this.value;
                updatePreview();
                showNotification('Font style updated!', 'success');
            });
        }

        // Preview button
        if (previewBtn) {
            previewBtn.addEventListener('click', function() {
                if (!validateForm()) return;
                updatePreview();
                if (previewModal) {
                    previewModal.show();
                }
                initializePreviewControls();
            });
        }

        // Download buttons
        if (downloadBtn) {
            downloadBtn.addEventListener('click', function() {
                if (!validateForm()) return;
                downloadInvitation('pdf');
            });
        }

        if (downloadFromPreview) {
            downloadFromPreview.addEventListener('click', function() {
                downloadInvitation('pdf');
            });
        }

        // Form validation
        form.addEventListener('input', function() {
            updatePreview();
        });

        // Auto-save
        setInterval(autoSave, 30000);
    }

    // Make functions globally accessible
    window.generateAISuggestions = function() {
        const brideName = document.getElementById('brideName')?.value || '[Bride]';
        const groomName = document.getElementById('groomName')?.value || '[Groom]';
        
        const suggestions = [
            ...aiSuggestions.romantic,
            ...aiSuggestions.formal,
            ...aiSuggestions.casual
        ];
        
        const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)]
            .replace('[Bride]', brideName)
            .replace('[Groom]', groomName);
        
        const additionalInfo = document.getElementById('additionalInfo');
        if (additionalInfo) {
            additionalInfo.value = randomSuggestion;
            updatePreview();
            showNotification('AI suggestion applied!', 'success');
        }
    };

    window.startVoiceInput = function(targetId) {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            showNotification('Voice input not supported in this browser', 'error');
            return;
        }

        const targetInput = document.getElementById(targetId);
        if (!targetInput) {
            showNotification('Target input not found', 'error');
            return;
        }

        const voiceBtn = targetInput.parentNode.querySelector('.voice-input-btn');
        
        if (isRecording) {
            stopVoiceInput();
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = function() {
            isRecording = true;
            if (voiceBtn) {
                voiceBtn.classList.add('recording');
                voiceBtn.innerHTML = '<i class="fas fa-stop"></i>';
            }
            showNotification('Listening... Speak now!', 'info');
        };

        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            targetInput.value = transcript;
            updatePreview();
            showNotification('Voice input captured!', 'success');
        };

        recognition.onerror = function(event) {
            showNotification('Voice input error: ' + event.error, 'error');
        };

        recognition.onend = function() {
            isRecording = false;
            if (voiceBtn) {
                voiceBtn.classList.remove('recording');
                voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
            }
        };

        recognition.start();
    };

    function stopVoiceInput() {
        isRecording = false;
        const voiceBtn = document.querySelector('.voice-input-btn.recording');
        if (voiceBtn) {
            voiceBtn.classList.remove('recording');
            voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
        }
    }

    // QR Code Generation
    function initializeQRCode() {
        const qrContainer = document.getElementById('qrCode');
        if (!qrContainer || typeof QRCode === 'undefined') return;

        try {
            const qrData = {
                type: 'wedding_rsvp',
                url: window.location.href,
                timestamp: new Date().toISOString()
            };

            QRCode.toCanvas(qrContainer, JSON.stringify(qrData), {
                width: 128,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                }
            }, function(error) {
                if (error) {
                    console.error('QR Code generation error:', error);
                }
            });
        } catch (error) {
            console.error('QR Code initialization error:', error);
        }
    }

    // Social Media Sharing
    window.shareToSocialMedia = function(platform) {
        const brideName = document.getElementById('brideName')?.value || 'Bride';
        const groomName = document.getElementById('groomName')?.value || 'Groom';
        const weddingDate = document.getElementById('weddingDate')?.value;
        
        const text = `${brideName} & ${groomName} are getting married! 🎉💍`;
        const url = window.location.href;
        
        let shareUrl = '';
        
        switch(platform) {
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
                break;
            case 'instagram':
                showNotification('To share on Instagram: 1. Take a screenshot 2. Open Instagram 3. Post the image with your message', 'info');
                return;
            case 'whatsapp':
                shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
                break;
        }
        
        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400');
            showNotification(`Sharing to ${platform}!`, 'success');
        }
    };

    // Music Integration
    function initializeMusic() {
        const musicSelect = document.getElementById('musicSelect');
        if (!musicSelect) return;

        musicSelect.addEventListener('change', function() {
            if (isMusicPlaying) {
                stopMusic();
            }
        });
    }

    window.playMusic = function() {
        const musicSelect = document.getElementById('musicSelect');
        if (!musicSelect) return;

        const musicType = musicSelect.value;
        if (musicType === 'none') {
            showNotification('No music selected', 'info');
            return;
        }

        try {
            if (!currentAudioContext) {
                currentAudioContext = new (window.AudioContext || window.webkitAudioContext)();
            }

            if (isMusicPlaying) {
                stopMusic();
                return;
            }

            const audioContext = currentAudioContext;
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            switch(musicType) {
                case 'romantic':
                    oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
                    break;
                case 'classical':
                    oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
                    break;
                case 'jazz':
                    oscillator.frequency.setValueAtTime(349.23, audioContext.currentTime);
                    break;
            }

            oscillator.type = 'sine';
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);

            oscillator.start();
            currentAudioSource = oscillator;
            isMusicPlaying = true;

            showNotification('Music playing!', 'success');
        } catch (error) {
            showNotification('Music playback not supported', 'error');
        }
    };

    window.pauseMusic = function() {
        if (currentAudioSource && isMusicPlaying) {
            currentAudioSource.stop();
            currentAudioSource = null;
            isMusicPlaying = false;
            showNotification('Music paused', 'info');
        }
    };

    function stopMusic() {
        if (currentAudioSource) {
            currentAudioSource.stop();
            currentAudioSource = null;
        }
        isMusicPlaying = false;
    }

    // RSVP Analytics
    function initializeAnalytics() {
        updateAnalyticsDisplay();
    }

    window.simulateRSVPData = function() {
        rsvpData.totalInvites = Math.floor(Math.random() * 50) + 20;
        rsvpData.confirmed = Math.floor(rsvpData.totalInvites * 0.7);
        rsvpData.pending = Math.floor(rsvpData.totalInvites * 0.2);
        rsvpData.declined = rsvpData.totalInvites - rsvpData.confirmed - rsvpData.pending;
        
        updateAnalyticsDisplay();
        showNotification('RSVP data simulated!', 'success');
    };

    function updateAnalyticsDisplay() {
        const totalElement = document.getElementById('totalInvites');
        const confirmedElement = document.getElementById('confirmedRSVP');
        const pendingElement = document.getElementById('pendingRSVP');
        const declinedElement = document.getElementById('declinedRSVP');
        const progressElement = document.getElementById('rsvpProgress');

        if (totalElement) totalElement.textContent = rsvpData.totalInvites;
        if (confirmedElement) confirmedElement.textContent = rsvpData.confirmed;
        if (pendingElement) pendingElement.textContent = rsvpData.pending;
        if (declinedElement) declinedElement.textContent = rsvpData.declined;
        
        if (progressElement) {
            const progressPercentage = rsvpData.totalInvites > 0 ? 
                ((rsvpData.confirmed + rsvpData.declined) / rsvpData.totalInvites) * 100 : 0;
            progressElement.style.width = progressPercentage + '%';
        }
    }

    // WhatsApp Integration
    window.sendWhatsAppInvites = function() {
        const phoneNumbersElement = document.getElementById('guestPhoneNumbers');
        const messageElement = document.getElementById('whatsappMessage');
        
        if (!phoneNumbersElement || !messageElement) {
            showNotification('WhatsApp integration not initialized properly', 'error');
            return;
        }
        
        const phoneNumbers = phoneNumbersElement.value
            .split('\n')
            .map(num => num.trim())
            .filter(num => num.length > 0);
        
        if (phoneNumbers.length === 0) {
            showNotification('Please enter at least one phone number', 'error');
            return;
        }

        const brideName = document.getElementById('brideName')?.value || 'our';
        const groomName = document.getElementById('groomName')?.value || 'our';
        const customMessage = messageElement.value || 
            `You're invited to ${brideName} and ${groomName} wedding! Please respond with YES, NO, or MAYBE`;

        whatsappInvites = phoneNumbers.map(phone => ({
            phone: phone,
            status: 'pending',
            sentAt: new Date().toISOString()
        }));

        rsvpData.totalInvites = phoneNumbers.length;
        rsvpData.pending = phoneNumbers.length;
        rsvpData.confirmed = 0;
        rsvpData.declined = 0;
        updateAnalyticsDisplay();

        const statusDiv = document.getElementById('whatsappStatus');
        if (statusDiv) {
            statusDiv.innerHTML = '<div class="alert alert-info">Generating WhatsApp links...</div>';
            
            let linksHtml = '<div class="mt-3"><h6>WhatsApp Invite Links:</h6>';
            phoneNumbers.forEach((phone, index) => {
                const cleanPhone = phone.replace(/\D/g, '');
                const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(customMessage)}`;
                linksHtml += `
                    <div class="mb-3 p-3 border rounded">
                        <h6>Send to ${phone}:</h6>
                        <a href="${whatsappUrl}" target="_blank" class="btn btn-success btn-sm">
                            <i class="fab fa-whatsapp"></i> Open WhatsApp Chat
                        </a>
                    </div>
                `;
            });
            linksHtml += '</div>';
            statusDiv.innerHTML = linksHtml;
        }

        showNotification(`Generated ${phoneNumbers.length} WhatsApp invite links!`, 'success');
    };

    // AR Preview
    window.launchARPreview = function() {
        showNotification('AR Preview: Point your camera at a flat surface to see your invitation in 3D space!', 'info');
        
        setTimeout(() => {
            showNotification('AR Preview launched! (Simulation)', 'success');
        }, 2000);
    };

    // Preview Controls
    function initializePreviewControls() {
        if (!isParticlesActive) {
            createParticleSystem();
        }
    }

    window.toggleParticles = function() {
        if (isParticlesActive) {
            removeParticleSystem();
        } else {
            createParticleSystem();
        }
        isParticlesActive = !isParticlesActive;
    };

    window.toggle3D = function() {
        const preview = document.getElementById('invitationPreview');
        if (!preview) return;

        if (is3DActive) {
            preview.style.transform = 'rotateX(0deg) rotateY(0deg)';
        } else {
            preview.style.transform = 'rotateX(15deg) rotateY(15deg)';
        }
        is3DActive = !is3DActive;
    };

    window.toggleMusic = function() {
        if (isMusicPlaying) {
            pauseMusic();
        } else {
            playMusic();
        }
    };

    window.rotatePreview = function() {
        const preview = document.getElementById('invitationPreview');
        if (!preview) return;

        const currentRotation = preview.style.transform || 'rotate(0deg)';
        const currentAngle = parseInt(currentRotation.match(/rotate\((\d+)deg\)/)?.[1] || 0);
        preview.style.transform = `rotate(${currentAngle + 90}deg)`;
    };

    function createParticleSystem() {
        const container = document.getElementById('invitationPreview');
        if (!container) return;

        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.width = Math.random() * 4 + 2 + 'px';
            particle.style.height = particle.style.width;
            particle.style.animationDelay = Math.random() * 3 + 's';
            container.appendChild(particle);
        }
    }

    function removeParticleSystem() {
        const particles = document.querySelectorAll('.particle');
        particles.forEach(particle => particle.remove());
    }

    // Live Collaboration
    function initializeLiveCollaboration() {
        setInterval(() => {
            if (Math.random() > 0.8) {
                showCollaborationIndicator();
                setTimeout(hideCollaborationIndicator, 3000);
            }
        }, 10000);
    }

    function showCollaborationIndicator() {
        const indicator = document.getElementById('collaborationIndicator');
        if (indicator) {
            indicator.style.display = 'block';
        }
    }

    function hideCollaborationIndicator() {
        const indicator = document.getElementById('collaborationIndicator');
        if (indicator) {
            indicator.style.display = 'none';
        }
    }

    // Form validation
    function validateForm() {
        if (!form) return false;

        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('is-invalid');
                isValid = false;
            } else {
                field.classList.remove('is-invalid');
            }
        });

        if (!isValid) {
            showNotification('Please fill in all required fields', 'error');
        }

        return isValid;
    }

    // Update preview
    function updatePreview() {
        if (!invitationPreview) return;

        const template = templates[currentTemplate] || templates.elegant;
        const colors = colorSchemes[currentColor] || colorSchemes.gold;
        const font = fonts[currentFont] || fonts.playfair;

        const brideName = document.getElementById('brideName')?.value || 'Bride\'s Name';
        const groomName = document.getElementById('groomName')?.value || 'Groom\'s Name';
        const weddingDate = document.getElementById('weddingDate')?.value ? 
            new Date(document.getElementById('weddingDate').value).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }) : 'Date TBD';
        const weddingTime = document.getElementById('weddingTime')?.value || 'Time TBD';
        const venue = document.getElementById('venue')?.value || 'Venue TBD';
        const address = document.getElementById('address')?.value || 'Address TBD';
        const additionalInfo = document.getElementById('additionalInfo')?.value || '';

        // Enhanced invitation HTML with sophisticated design
        invitationPreview.innerHTML = `
            <div class="invitation ${template.class}" style="
                background: ${template.background}; 
                color: ${colors.text}; 
                font-family: ${font};
                position: relative;
                min-height: 700px;
                padding: 60px;
                border-radius: 25px;
                box-shadow: 0 30px 100px rgba(0,0,0,0.15), 0 10px 30px rgba(0,0,0,0.1);
                overflow: hidden;
                border: 3px solid ${colors.primary};
                margin: 20px;
            ">
                <!-- Premium Pattern Overlay -->
                <div class="pattern-overlay" style="
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: ${template.pattern || 'none'};
                    pointer-events: none;
                    opacity: 0.2;
                "></div>
                
                <!-- Luxury Border Frame -->
                <div class="luxury-border" style="
                    position: absolute;
                    top: 15px;
                    left: 15px;
                    right: 15px;
                    bottom: 15px;
                    border: 2px solid ${colors.primary};
                    border-radius: 20px;
                    pointer-events: none;
                "></div>
                
                <!-- Inner Decorative Border -->
                <div class="inner-border" style="
                    position: absolute;
                    top: 25px;
                    left: 25px;
                    right: 25px;
                    bottom: 25px;
                    border: 1px solid ${colors.primary}60;
                    border-radius: 15px;
                    pointer-events: none;
                "></div>
                
                <!-- Corner Flourishes -->
                <div class="corner-flourish top-left" style="
                    position: absolute;
                    top: 30px;
                    left: 30px;
                    width: 50px;
                    height: 50px;
                    border-top: 3px solid ${colors.primary};
                    border-left: 3px solid ${colors.primary};
                    border-radius: 15px 0 0 0;
                "></div>
                <div class="corner-flourish top-right" style="
                    position: absolute;
                    top: 30px;
                    right: 30px;
                    width: 50px;
                    height: 50px;
                    border-top: 3px solid ${colors.primary};
                    border-right: 3px solid ${colors.primary};
                    border-radius: 0 15px 0 0;
                "></div>
                <div class="corner-flourish bottom-left" style="
                    position: absolute;
                    bottom: 30px;
                    left: 30px;
                    width: 50px;
                    height: 50px;
                    border-bottom: 3px solid ${colors.primary};
                    border-left: 3px solid ${colors.primary};
                    border-radius: 0 0 0 15px;
                "></div>
                <div class="corner-flourish bottom-right" style="
                    position: absolute;
                    bottom: 30px;
                    right: 30px;
                    width: 50px;
                    height: 50px;
                    border-bottom: 3px solid ${colors.primary};
                    border-right: 3px solid ${colors.primary};
                    border-radius: 0 0 15px 0;
                "></div>

                <!-- Premium Header Section -->
                <div class="premium-header" style="
                    text-align: center;
                    margin-bottom: 50px;
                    position: relative;
                ">
                    <div class="ornate-divider top" style="
                        height: 3px;
                        background: linear-gradient(90deg, transparent, ${colors.primary}, transparent);
                        margin: 30px 0;
                        position: relative;
                    ">
                        <div style="
                            position: absolute;
                            top: -10px;
                            left: 50%;
                            transform: translateX(-50%);
                            width: 20px;
                            height: 20px;
                            background: ${colors.primary};
                            border-radius: 50%;
                            box-shadow: 0 0 10px ${colors.primary}40;
                        "></div>
                    </div>
                    <div style="
                        font-size: 1.4rem;
                        color: ${colors.secondary};
                        font-weight: 300;
                        letter-spacing: 4px;
                        text-transform: uppercase;
                        margin-bottom: 15px;
                        text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
                    ">The Wedding of</div>
                </div>

                <!-- Elegant Couple Names -->
                <div class="couple-names-elegant" style="
                    text-align: center;
                    margin: 60px 0;
                    position: relative;
                ">
                    <h1 class="bride-name" style="
                        color: ${colors.primary};
                        font-size: 4.5rem;
                        font-weight: 700;
                        margin: 0;
                        line-height: 1.1;
                        text-shadow: 3px 3px 6px rgba(0,0,0,0.15);
                        letter-spacing: 3px;
                        font-family: 'Great Vibes', cursive;
                    ">
                        ${brideName}
                    </h1>
                    <div style="
                        font-size: 2.5rem;
                        color: ${colors.secondary};
                        margin: 20px 0;
                        font-weight: 300;
                        font-family: 'Dancing Script', cursive;
                    ">&</div>
                    <h1 class="groom-name" style="
                        color: ${colors.primary};
                        font-size: 4.5rem;
                        font-weight: 700;
                        margin: 0;
                        line-height: 1.1;
                        text-shadow: 3px 3px 6px rgba(0,0,0,0.15);
                        letter-spacing: 3px;
                        font-family: 'Great Vibes', cursive;
                    ">
                        ${groomName}
                    </h1>
                </div>

                <!-- Middle Ornate Section -->
                <div class="middle-ornate" style="
                    text-align: center;
                    margin: 50px 0;
                ">
                    <div class="ornate-divider middle" style="
                        height: 3px;
                        background: linear-gradient(90deg, transparent, ${colors.primary}, transparent);
                        margin: 30px 0;
                        position: relative;
                    ">
                        <div style="
                            position: absolute;
                            top: -10px;
                            left: 50%;
                            transform: translateX(-50%);
                            width: 20px;
                            height: 20px;
                            background: ${colors.primary};
                            border-radius: 50%;
                            box-shadow: 0 0 10px ${colors.primary}40;
                        "></div>
                    </div>
                    <div style="
                        font-size: 1.3rem;
                        color: ${colors.secondary};
                        font-weight: 400;
                        letter-spacing: 3px;
                        text-transform: uppercase;
                        margin: 15px 0;
                        text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
                    ">Request the honor of your presence</div>
                </div>

                <!-- Premium Event Details -->
                <div class="premium-event-details" style="
                    text-align: center;
                    margin: 60px 0;
                ">
                    <div class="wedding-date-elegant" style="
                        color: ${colors.secondary};
                        font-size: 2.2rem;
                        font-weight: 600;
                        margin-bottom: 20px;
                        letter-spacing: 2px;
                        text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
                    ">
                        ${weddingDate}
                    </div>
                    <div class="wedding-time-elegant" style="
                        font-size: 1.8rem;
                        color: ${colors.text};
                        margin-bottom: 40px;
                        font-weight: 500;
                        letter-spacing: 1px;
                    ">
                        ${weddingTime}
                    </div>
                    
                    <div class="venue-premium" style="
                        margin: 40px 0;
                        padding: 30px;
                        background: rgba(255,255,255,0.15);
                        border-radius: 20px;
                        border: 2px solid ${colors.primary}30;
                        backdrop-filter: blur(15px);
                        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                    ">
                        <div class="venue-name" style="
                            font-size: 2rem;
                            margin-bottom: 15px;
                            font-weight: 700;
                            color: ${colors.primary};
                            text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
                        ">
                            ${venue}
                        </div>
                        <div class="venue-address" style="
                            font-size: 1.3rem;
                            line-height: 1.8;
                            color: ${colors.text};
                            font-weight: 400;
                            letter-spacing: 0.5px;
                        ">
                            ${address}
                        </div>
                    </div>
                </div>

                <!-- Additional Information Premium -->
                ${additionalInfo ? `
                    <div class="additional-info-premium" style="
                        margin: 40px 0;
                        padding: 25px;
                        background: rgba(255,255,255,0.1);
                        border-radius: 20px;
                        border-left: 5px solid ${colors.primary};
                        backdrop-filter: blur(10px);
                        box-shadow: 0 8px 25px rgba(0,0,0,0.1);
                    ">
                        <div class="additional-info-text" style="
                            font-size: 1.1rem;
                            line-height: 1.8;
                            color: ${colors.text};
                            font-style: italic;
                            letter-spacing: 0.5px;
                        ">
                            ${additionalInfo}
                        </div>
                    </div>
                ` : ''}

                <!-- Premium Footer -->
                <div class="premium-footer" style="
                    text-align: center;
                    margin-top: 60px;
                    position: relative;
                ">
                    <div class="ornate-divider bottom" style="
                        height: 3px;
                        background: linear-gradient(90deg, transparent, ${colors.primary}, transparent);
                        margin: 30px 0;
                        position: relative;
                    ">
                        <div style="
                            position: absolute;
                            top: -10px;
                            left: 50%;
                            transform: translateX(-50%);
                            width: 20px;
                            height: 20px;
                            background: ${colors.primary};
                            border-radius: 50%;
                            box-shadow: 0 0 10px ${colors.primary}40;
                        "></div>
                    </div>
                    <div style="
                        font-size: 1.2rem;
                        color: ${colors.secondary};
                        font-weight: 300;
                        letter-spacing: 3px;
                        text-transform: uppercase;
                        margin-top: 15px;
                        text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
                    ">Celebrating Love & Unity</div>
                </div>

                <!-- Luxury Floating Elements -->
                <div class="luxury-floating-elements" style="
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    pointer-events: none;
                    overflow: hidden;
                ">
                    <div style="
                        position: absolute;
                        top: 15%;
                        left: 15%;
                        width: 25px;
                        height: 25px;
                        background: ${colors.primary}25;
                        border-radius: 50%;
                        animation: luxuryFloat 8s ease-in-out infinite;
                        box-shadow: 0 0 15px ${colors.primary}30;
                    "></div>
                    <div style="
                        position: absolute;
                        top: 25%;
                        right: 20%;
                        width: 20px;
                        height: 20px;
                        background: ${colors.secondary}35;
                        border-radius: 50%;
                        animation: luxuryFloat 10s ease-in-out infinite reverse;
                        box-shadow: 0 0 12px ${colors.secondary}40;
                    "></div>
                    <div style="
                        position: absolute;
                        bottom: 35%;
                        left: 25%;
                        width: 18px;
                        height: 18px;
                        background: ${colors.primary}30;
                        border-radius: 50%;
                        animation: luxuryFloat 9s ease-in-out infinite;
                        box-shadow: 0 0 10px ${colors.primary}25;
                    "></div>
                    <div style="
                        position: absolute;
                        bottom: 25%;
                        right: 15%;
                        width: 22px;
                        height: 22px;
                        background: ${colors.secondary}25;
                        border-radius: 50%;
                        animation: luxuryFloat 11s ease-in-out infinite reverse;
                        box-shadow: 0 0 18px ${colors.secondary}30;
                    "></div>
                </div>

                <style>
                    @keyframes luxuryFloat {
                        0%, 100% { 
                            transform: translateY(0px) rotate(0deg) scale(1); 
                            opacity: 0.7;
                        }
                        50% { 
                            transform: translateY(-25px) rotate(180deg) scale(1.1); 
                            opacity: 1;
                        }
                    }
                    
                    .invitation {
                        transition: all 0.5s ease;
                        transform-style: preserve-3d;
                    }
                    
                    .invitation:hover {
                        transform: scale(1.03) rotateY(2deg);
                        box-shadow: 0 40px 120px rgba(0,0,0,0.2), 0 15px 40px rgba(0,0,0,0.15);
                    }
                    
                    .corner-flourish {
                        transition: all 0.4s ease;
                    }
                    
                    .corner-flourish:hover {
                        transform: scale(1.2);
                        background: ${colors.primary}30;
                        box-shadow: 0 0 20px ${colors.primary}50;
                    }
                    
                    .bride-name, .groom-name {
                        transition: all 0.3s ease;
                    }
                    
                    .bride-name:hover, .groom-name:hover {
                        transform: scale(1.05);
                        text-shadow: 4px 4px 8px rgba(0,0,0,0.2);
                    }
                </style>
            </div>
        `;
    }

    // Download functions
    window.downloadInvitation = function(format) {
        if (!validateForm()) return;

        const element = invitationPreview;
        if (!element) {
            showNotification('Preview not available', 'error');
            return;
        }
        
        switch(format) {
            case 'pdf':
                downloadAsPDF(element);
                break;
            case 'png':
                downloadAsImage(element, 'png');
                break;
            case 'jpg':
                downloadAsImage(element, 'jpg');
                break;
            case 'social':
                downloadForSocialMedia(element);
                break;
            default:
                downloadAsPDF(element);
        }
    };

    function downloadAsPDF(element) {
        if (typeof html2pdf === 'undefined') {
            showNotification('PDF generation library not loaded', 'error');
            return;
        }

        const opt = {
            margin: 1,
            filename: 'wedding-invitation.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save();
        showNotification('PDF downloaded successfully!', 'success');
    }

    async function downloadAsImage(element, format) {
        if (typeof html2canvas === 'undefined') {
            showNotification('Image generation library not loaded', 'error');
            return;
        }

        try {
            const canvas = await html2canvas(element, {
                scale: 2,
                backgroundColor: '#ffffff',
                useCORS: true,
                allowTaint: true
            });

            const link = document.createElement('a');
            link.download = `wedding-invitation.${format}`;
            
            if (format === 'png') {
                link.href = canvas.toDataURL('image/png');
            } else {
                link.href = canvas.toDataURL('image/jpeg', 0.9);
            }
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            showNotification(`${format.toUpperCase()} image downloaded successfully!`, 'success');
        } catch (error) {
            showNotification('Error generating image: ' + error.message, 'error');
        }
    }

    function downloadForSocialMedia(element) {
        const socialElement = element.cloneNode(true);
        socialElement.style.width = '1080px';
        socialElement.style.height = '1080px';
        socialElement.style.transform = 'scale(1.5)';
        
        downloadAsImage(socialElement, 'jpg');
    }

    // Auto-save functionality
    function autoSave() {
        if (!form) return;

        const formData = {
            brideName: document.getElementById('brideName')?.value || '',
            groomName: document.getElementById('groomName')?.value || '',
            weddingDate: document.getElementById('weddingDate')?.value || '',
            weddingTime: document.getElementById('weddingTime')?.value || '',
            venue: document.getElementById('venue')?.value || '',
            address: document.getElementById('address')?.value || '',
            additionalInfo: document.getElementById('additionalInfo')?.value || '',
            template: currentTemplate,
            color: currentColor,
            font: currentFont
        };

        localStorage.setItem('weddingInvitationData', JSON.stringify(formData));
    }

    // Load saved data
    function loadSavedData() {
        const savedData = localStorage.getItem('weddingInvitationData');
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                
                const brideName = document.getElementById('brideName');
                const groomName = document.getElementById('groomName');
                const weddingDate = document.getElementById('weddingDate');
                const weddingTime = document.getElementById('weddingTime');
                const venue = document.getElementById('venue');
                const address = document.getElementById('address');
                const additionalInfo = document.getElementById('additionalInfo');
                
                if (brideName) brideName.value = data.brideName || '';
                if (groomName) groomName.value = data.groomName || '';
                if (weddingDate) weddingDate.value = data.weddingDate || '';
                if (weddingTime) weddingTime.value = data.weddingTime || '';
                if (venue) venue.value = data.venue || '';
                if (address) address.value = data.address || '';
                if (additionalInfo) additionalInfo.value = data.additionalInfo || '';
                
                if (data.template) {
                    currentTemplate = data.template;
                    templateCards.forEach(card => {
                        card.classList.toggle('active', card.dataset.template === data.template);
                    });
                }
                
                if (data.color) {
                    currentColor = data.color;
                    colorOptions.forEach(option => {
                        option.classList.toggle('active', option.dataset.color === data.color);
                    });
                }
                
                if (data.font && fontSelect) {
                    currentFont = data.font;
                    fontSelect.value = data.font;
                }
                
                updatePreview();
            } catch (error) {
                console.error('Error loading saved data:', error);
            }
        }
    }

    // Notification system
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'} me-2"></i>
            ${message}
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Load saved data on page load
    loadSavedData();
}); 
