document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const themeSelect = document.getElementById('themeSelect');
    const colorScheme = document.getElementById('colorScheme');
    const borderStyle = document.getElementById('borderStyle');
    const eventName = document.getElementById('eventName');
    const hostName = document.getElementById('hostName');
    const eventDate = document.getElementById('eventDate');
    const eventTime = document.getElementById('eventTime');
    const venue = document.getElementById('venue');
    const message = document.getElementById('message');
    const rsvpContact = document.getElementById('rsvpContact');
    const rsvpDate = document.getElementById('rsvpDate');
    const generateBtn = document.getElementById('generateBtn');
    const previewSection = document.getElementById('previewSection');
    const invitationPreview = document.getElementById('invitationPreview');
    const downloadBtn = document.getElementById('downloadBtn');
    const shareBtn = document.getElementById('shareBtn');
    const editBtn = document.getElementById('editBtn');

    // New trendy features elements
    const aiThemeBtn = document.getElementById('aiThemeBtn');
    const aiMessageBtn = document.getElementById('aiMessageBtn');
    const aiDesignBtn = document.getElementById('aiDesignBtn');
    const aiPartyBtn = document.getElementById('aiPartyBtn');
    const voiceEventBtn = document.getElementById('voiceEventBtn');
    const voiceHostBtn = document.getElementById('voiceHostBtn');
    const voiceVenueBtn = document.getElementById('voiceVenueBtn');
    const voiceMessageBtn = document.getElementById('voiceMessageBtn');
    const includeQR = document.getElementById('includeQR');
    const includeMapQR = document.getElementById('includeMapQR');
    const qrCodeBtn = document.getElementById('qrCodeBtn');
    const shareFacebook = document.getElementById('shareFacebook');
    const shareTwitter = document.getElementById('shareTwitter');
    const shareInstagram = document.getElementById('shareInstagram');
    const shareWhatsApp = document.getElementById('shareWhatsApp');

    // Advanced features elements
    const enable3D = document.getElementById('enable3D');
    const enableMusic = document.getElementById('enableMusic');
    const enableParticles = document.getElementById('enableParticles');
    const enableAR = document.getElementById('enableAR');
    const enableLive = document.getElementById('enableLive');
    const enableAnalytics = document.getElementById('enableAnalytics');
    const previewControls = document.getElementById('previewControls');
    const rotationSlider = document.getElementById('rotationSlider');
    const scaleSlider = document.getElementById('scaleSlider');
    const brightnessSlider = document.getElementById('brightnessSlider');
    const resetPreview = document.getElementById('resetPreview');
    const savePreset = document.getElementById('savePreset');
    const playMusic = document.getElementById('playMusic');
    const pauseMusic = document.getElementById('pauseMusic');
    const nextTrack = document.getElementById('nextTrack');
    const rotate3D = document.getElementById('rotate3D');
    const flip3D = document.getElementById('flip3D');
    const startAR = document.getElementById('startAR');

    // Music and Analytics Data
    const partyMusic = [
        { 
            title: "Happy Birthday (Choir)", 
            artist: "Public Domain", 
            url: "https://vole.wtf/audio/happy-birthday-choir.mp3",
            audio: null
        },
        { 
            title: "Celebration", 
            artist: "Kool & The Gang", 
            url: null,
            audio: null
        },
        { 
            title: "Party Rock Anthem", 
            artist: "LMFAO", 
            url: null,
            audio: null
        }
    ];

    let currentMusicIndex = 0;
    let isPlaying = false;
    let currentAudio = null;
    let progressInterval = null;

    // RSVP Analytics Data
    let rsvpData = {
        totalInvites: 0,
        confirmed: 0,
        pending: 0,
        declined: 0
    };

    // WhatsApp Integration Data
    let whatsappInvites = [];
    let whatsappResponses = {};
    let webhookEndpoint = null;
    let currentInvitationImageBlob = null; // Store the generated image blob

    // 3D State
    let currentRotation = { x: 0, y: 0 };
    let is3DEnabled = false;

    // Particle System
    let particles = [];
    let particleSystem = null;

    // Voice Recognition Setup
    let recognition;
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
    }

    // AI Suggestions Data
    const aiThemeSuggestions = {
        'birthday': ['fun', 'celebration', 'modern'],
        'anniversary': ['elegant', 'vintage', 'minimal'],
        'graduation': ['modern', 'elegant', 'celebration'],
        'wedding': ['elegant', 'vintage', 'minimal'],
        'corporate': ['modern', 'minimal', 'elegant']
    };

    const aiMessageTemplates = {
        'fun': [
            "🎉 Get ready for the most EPIC birthday celebration ever! 🎂",
            "🎈 It's time to party like there's no tomorrow! 🎊",
            "🎁 Join us for a birthday bash that will be talked about for years! 🎉"
        ],
        'elegant': [
            "We cordially invite you to celebrate this special occasion with us.",
            "Please join us for an elegant celebration of this milestone birthday.",
            "We would be honored by your presence at this birthday celebration."
        ],
        'modern': [
            "Join us for a modern celebration of life and friendship.",
            "Let's create unforgettable memories together at this birthday party.",
            "Celebrate with us in style at this contemporary birthday gathering."
        ]
    };

    // Theme Styles
    const themeStyles = {
        elegant: {
            font: 'Playfair Display',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            border: '2px solid #D4AF37',
            textColor: '#2c3e50'
        },
        fun: {
            font: 'Comic Sans MS',
            background: 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)',
            border: '2px solid #FF6B6B',
            textColor: '#2c3e50'
        },
        modern: {
            font: 'Montserrat',
            background: 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
            border: '2px solid #000000',
            textColor: '#2c3e50'
        },
        vintage: {
            font: 'Playfair Display',
            background: 'linear-gradient(135deg, #f3e7e9 0%, #e3eeff 100%)',
            border: '2px solid #800020',
            textColor: '#2c3e50'
        },
        minimal: {
            font: 'Montserrat',
            background: '#ffffff',
            border: '1px solid #e0e0e0',
            textColor: '#2c3e50'
        },
        celebration: {
            font: 'Montserrat',
            background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
            border: '2px solid #FF6B6B',
            textColor: '#2c3e50'
        }
    };

    // Color Schemes
    const colorSchemes = {
        blue: {
            primary: '#4a6bff',
            secondary: '#ffffff',
            accent: '#6a11cb'
        },
        pink: {
            primary: '#ff69b4',
            secondary: '#ffffff',
            accent: '#ffd700'
        },
        green: {
            primary: '#28a745',
            secondary: '#ffffff',
            accent: '#c0c0c0'
        },
        purple: {
            primary: '#6f42c1',
            secondary: '#ffffff',
            accent: '#ffd700'
        },
        rainbow: {
            primary: 'linear-gradient(45deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #8b00ff)',
            secondary: '#ffffff',
            accent: '#000000'
        }
    };

    // Helper Functions
    function formatDate(date) {
        return new Date(date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    function formatTime(time) {
        return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    }

    // AI Theme Suggestion
    function suggestTheme() {
        const eventText = eventName.value.toLowerCase();
        let suggestedTheme = 'fun'; // default

        for (const [keyword, themes] of Object.entries(aiThemeSuggestions)) {
            if (eventText.includes(keyword)) {
                suggestedTheme = themes[Math.floor(Math.random() * themes.length)];
                break;
            }
        }

        // Update theme selection
        document.querySelector(`[data-theme="${suggestedTheme}"]`).click();
        themeSelect.value = suggestedTheme;

        // Show success message
        showNotification(`AI suggested theme: ${suggestedTheme.charAt(0).toUpperCase() + suggestedTheme.slice(1)}`, 'success');
    }

    // AI Message Generator
    function generateAIMessage() {
        const currentTheme = themeSelect.value;
        const messages = aiMessageTemplates[currentTheme] || aiMessageTemplates['fun'];
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        
        message.value = randomMessage;
        showNotification('AI generated message added!', 'success');
    }

    // Voice Input Functions
    function setupVoiceInput(button, targetInput) {
        button.addEventListener('click', function() {
            if (!recognition) {
                showNotification('Voice recognition not supported in this browser', 'error');
                return;
            }

            button.classList.add('voice-active');
            recognition.start();

            recognition.onresult = function(event) {
                const transcript = event.results[0][0].transcript;
                targetInput.value = transcript;
                button.classList.remove('voice-active');
                showNotification('Voice input captured!', 'success');
            };

            recognition.onerror = function(event) {
                button.classList.remove('voice-active');
                showNotification('Voice input error: ' + event.error, 'error');
            };

            recognition.onend = function() {
                button.classList.remove('voice-active');
            };
        });
    }

    // QR Code Generation
    function generateQRCode(text, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = '';
        QRCode.toCanvas(container, text, {
            width: 200,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        }, function(error) {
            if (error) {
                console.error('QR Code generation error:', error);
                container.innerHTML = '<p class="text-danger">QR Code generation failed</p>';
            }
        });
    }

    // Social Media Sharing
    function shareToSocialMedia(platform) {
        const invitationData = {
            title: eventName.value || 'Birthday Invitation',
            text: message.value || 'Join us for a birthday celebration!',
            url: window.location.href
        };

        let shareUrl = '';
        switch(platform) {
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(invitationData.url)}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(invitationData.text)}&url=${encodeURIComponent(invitationData.url)}`;
                break;
            case 'whatsapp':
                shareUrl = `https://wa.me/?text=${encodeURIComponent(invitationData.text + ' ' + invitationData.url)}`;
                break;
            case 'instagram':
                // Instagram doesn't support direct sharing via URL, so we'll copy to clipboard
                navigator.clipboard.writeText(invitationData.text + ' ' + invitationData.url);
                showNotification('Text copied to clipboard for Instagram sharing!', 'success');
                return;
        }

        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400');
        }
    }

    // Notification System
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    function generateInvitationHTML() {
        const theme = themeStyles[themeSelect.value];
        const colors = colorSchemes[colorScheme.value];
        const invitationImage = document.getElementById('invitationImage').files[0];
        const selectedBorderStyle = borderStyle.value;
        
        let imageHtml = '';
        if (invitationImage) {
            const imageUrl = URL.createObjectURL(invitationImage);
            imageHtml = `
                <div class="invitation-image" style="margin: 20px 0;">
                    <img src="${imageUrl}" alt="Birthday Invitation Image" style="max-width: 100%; max-height: 300px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
                </div>
            `;
        }

        // Handle animated borders
        let borderStyleCSS = '';
        switch(selectedBorderStyle) {
            case 'animated-dots':
                borderStyleCSS = `
                    border: 3px solid ${colors.primary};
                    position: relative;
                    animation: borderDots 2s linear infinite;
                `;
                break;
            case 'animated-dashed':
                borderStyleCSS = `
                    border: 3px dashed ${colors.primary};
                    animation: borderDashed 2s linear infinite;
                `;
                break;
            case 'animated-gradient':
                borderStyleCSS = `
                    border: 3px solid;
                    border-image: linear-gradient(45deg, ${colors.primary}, ${colors.accent}) 1;
                    animation: borderGradient 3s linear infinite;
                `;
                break;
            case 'animated-shine':
                borderStyleCSS = `
                    border: 3px solid ${colors.primary};
                    position: relative;
                    overflow: hidden;
                `;
                break;
            default:
                borderStyleCSS = `border: 3px ${selectedBorderStyle} ${colors.primary};`;
        }

        // QR Code HTML
        let qrCodeHtml = '';
        if (includeQR.checked) {
            qrCodeHtml = `
                <div class="qr-code-section" style="margin: 20px 0; text-align: center;">
                    <h6 style="color: ${colors.primary}; margin-bottom: 10px;">Scan to RSVP</h6>
                    <div id="rsvpQRCode" style="display: inline-block;"></div>
                </div>
            `;
        }

        if (includeMapQR.checked && venue.value) {
            qrCodeHtml += `
                <div class="qr-code-section" style="margin: 20px 0; text-align: center;">
                    <h6 style="color: ${colors.primary}; margin-bottom: 10px;">Scan for Directions</h6>
                    <div id="mapQRCode" style="display: inline-block;"></div>
                </div>
            `;
        }
        
        return `
            <div class="invitation" style="
                font-family: ${theme.font}, serif;
                background: ${theme.background};
                ${borderStyleCSS}
                color: ${theme.textColor};
                padding: 2rem;
                border-radius: 15px;
                text-align: center;
                max-width: 600px;
                margin: 0 auto;
            ">
                ${selectedBorderStyle === 'animated-shine' ? `
                    <div class="shine-effect" style="
                        position: absolute;
                        top: 0;
                        left: -100%;
                        width: 50%;
                        height: 100%;
                        background: linear-gradient(
                            to right,
                            rgba(255,255,255,0) 0%,
                            rgba(255,255,255,0.3) 50%,
                            rgba(255,255,255,0) 100%
                        );
                        animation: shine 3s infinite;
                    "></div>
                ` : ''}
                
                <h2 style="
                    color: ${colors.primary};
                    font-size: 2.5rem;
                    margin-bottom: 1.5rem;
                ">${eventName.value}</h2>
                
                ${imageHtml}
                
                <p style="font-size: 1.2rem; margin-bottom: 1rem;">
                    You're invited to celebrate with
                </p>
                
                <h3 style="
                    color: ${colors.accent};
                    font-size: 1.8rem;
                    margin-bottom: 1.5rem;
                ">${hostName.value}</h3>
                
                <div style="margin: 2rem 0;">
                    <p style="font-size: 1.3rem; margin-bottom: 0.5rem;">
                        <strong>Date:</strong> ${formatDate(eventDate.value)}
                    </p>
                    <p style="font-size: 1.3rem; margin-bottom: 0.5rem;">
                        <strong>Time:</strong> ${formatTime(eventTime.value)}
                    </p>
                    <p style="font-size: 1.3rem; margin-bottom: 0.5rem;">
                        <strong>Venue:</strong> ${venue.value}
                    </p>
                </div>
                
                ${message.value ? `
                    <div style="margin: 2rem 0; padding: 1rem; background: rgba(255,255,255,0.1); border-radius: 10px;">
                        <p style="font-style: italic; font-size: 1.1rem;">"${message.value}"</p>
                    </div>
                ` : ''}
                
                <div style="margin: 2rem 0;">
                    <p style="font-size: 1.2rem; margin-bottom: 0.5rem;">
                        <strong>RSVP:</strong> ${rsvpContact.value}
                    </p>
                    ${rsvpDate.value ? `
                        <p style="font-size: 1.2rem;">
                            <strong>Please respond by:</strong> ${formatDate(rsvpDate.value)}
                        </p>
                    ` : ''}
                </div>
                
                ${qrCodeHtml}
            </div>
        `;
    }

    // Event Listeners
    generateBtn.addEventListener('click', function() {
        if (!eventName.value || !hostName.value || !eventDate.value || !eventTime.value || !venue.value) {
            showNotification('Please fill in all required fields', 'warning');
            return;
        }

        invitationPreview.innerHTML = generateInvitationHTML();
        previewSection.style.display = 'block';
        
        // Generate QR codes after preview is created
        setTimeout(() => {
            if (includeQR.checked) {
                const rsvpData = `RSVP for ${eventName.value}: ${rsvpContact.value}`;
                generateQRCode(rsvpData, 'rsvpQRCode');
            }
            
            if (includeMapQR.checked && venue.value) {
                const mapData = `https://maps.google.com/?q=${encodeURIComponent(venue.value)}`;
                generateQRCode(mapData, 'mapQRCode');
            }
        }, 100);

        showNotification('Invitation generated successfully!', 'success');
    });

    // AI Feature Event Listeners
    aiThemeBtn.addEventListener('click', suggestTheme);
    aiMessageBtn.addEventListener('click', generateAIMessage);
    aiDesignBtn.addEventListener('click', suggestDesign);
    aiPartyBtn.addEventListener('click', getPartyTips);

    // Voice Input Setup
    setupVoiceInput(voiceEventBtn, eventName);
    setupVoiceInput(voiceHostBtn, hostName);
    setupVoiceInput(voiceVenueBtn, venue);
    setupVoiceInput(voiceMessageBtn, message);

    // Social Media Sharing
    shareFacebook.addEventListener('click', () => shareToSocialMedia('facebook'));
    shareTwitter.addEventListener('click', () => shareToSocialMedia('twitter'));
    shareInstagram.addEventListener('click', () => shareToSocialMedia('instagram'));
    shareWhatsApp.addEventListener('click', () => shareToSocialMedia('whatsapp'));

    // QR Code Button
    qrCodeBtn.addEventListener('click', function() {
        const qrModal = document.createElement('div');
        qrModal.className = 'modal fade';
        qrModal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">QR Codes</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body text-center">
                        <div class="row">
                            <div class="col-md-6">
                                <h6>RSVP QR Code</h6>
                                <div id="modalRSVPQR"></div>
                            </div>
                            <div class="col-md-6">
                                <h6>Venue Map QR Code</h6>
                                <div id="modalMapQR"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(qrModal);
        const modal = new bootstrap.Modal(qrModal);
        modal.show();
        
        setTimeout(() => {
            if (includeQR.checked) {
                const rsvpData = `RSVP for ${eventName.value}: ${rsvpContact.value}`;
                generateQRCode(rsvpData, 'modalRSVPQR');
            }
            
            if (includeMapQR.checked && venue.value) {
                const mapData = `https://maps.google.com/?q=${encodeURIComponent(venue.value)}`;
                generateQRCode(mapData, 'modalMapQR');
            }
        }, 300);
        
        qrModal.addEventListener('hidden.bs.modal', () => {
            qrModal.remove();
        });
    });

    // Template Selection
    document.querySelectorAll('.template-card').forEach(card => {
        card.addEventListener('click', function() {
            document.querySelectorAll('.template-card').forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
            themeSelect.value = this.dataset.theme;
        });
    });

    // Initialize Advanced Features
    initialize3D();
    initializeParticles();
    initializeMusic();
    initializeAnalytics();
    initializeAR();
    initializeLiveCollaboration();

    // Export Functions
    async function exportInvitation(format) {
        const element = invitationPreview.querySelector('.invitation');
        if (!element) {
            showNotification('Please generate an invitation first', 'warning');
            return;
        }

        try {
            switch(format) {
                case 'pdf':
                    await exportToPDF(element);
                    break;
                case 'png':
                    await exportToImage(element, 'png');
                    break;
                case 'jpg':
                    await exportToImage(element, 'jpg');
                    break;
                case 'social':
                    await exportToSocialMedia(element);
                    break;
            }
        } catch (error) {
            console.error('Export error:', error);
            // Fallback to text-based download
            fallbackDownload();
        }
    }

    // Fallback download method
    function fallbackDownload() {
        const invitationText = `
BIRTHDAY INVITATION

Event: ${eventName.value}
Host: ${hostName.value}
Date: ${formatDate(eventDate.value)}
Time: ${formatTime(eventTime.value)}
Venue: ${venue.value}

${message.value ? `Message: ${message.value}` : ''}

RSVP: ${rsvpContact.value}
${rsvpDate.value ? `Please respond by: ${formatDate(rsvpDate.value)}` : ''}

---
Generated by Multi-Tools Hub Birthday Invitation Generator
        `.trim();

        const blob = new Blob([invitationText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'birthday-invitation.txt';
        link.click();
        URL.revokeObjectURL(url);
        
        showNotification('Text invitation downloaded as fallback', 'info');
    }

    async function exportToPDF(element) {
        try {
            // Check if jsPDF is available
            if (typeof window.jspdf === 'undefined') {
                showNotification('PDF library not loaded. Please refresh the page.', 'error');
                return;
            }

            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4');
            
            // Create a temporary container for better rendering
            const tempContainer = document.createElement('div');
            tempContainer.style.position = 'absolute';
            tempContainer.style.left = '-9999px';
            tempContainer.style.top = '0';
            tempContainer.style.width = '600px';
            tempContainer.style.backgroundColor = 'white';
            tempContainer.style.padding = '20px';
            tempContainer.appendChild(element.cloneNode(true));
            document.body.appendChild(tempContainer);

            const canvas = await html2canvas(tempContainer, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff'
            });

            document.body.removeChild(tempContainer);
            
            const imgData = canvas.toDataURL('image/png');
            
            const imgWidth = 190; // A4 width minus margins
            const pageHeight = 277; // A4 height minus margins
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;
            
            let position = 10; // Top margin
            
            pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
            
            while (heightLeft >= 0) {
                position = heightLeft - imgHeight + 10;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }
            
            pdf.save('birthday-invitation.pdf');
            showNotification('PDF downloaded successfully!', 'success');
        } catch (error) {
            console.error('PDF export error:', error);
            showNotification('PDF generation failed. Please try again.', 'error');
        }
    }

    async function exportToImage(element, format) {
        try {
            // Create a temporary container for better rendering
            const tempContainer = document.createElement('div');
            tempContainer.style.position = 'absolute';
            tempContainer.style.left = '-9999px';
            tempContainer.style.top = '0';
            tempContainer.style.width = '600px';
            tempContainer.style.backgroundColor = 'white';
            tempContainer.style.padding = '20px';
            tempContainer.appendChild(element.cloneNode(true));
            document.body.appendChild(tempContainer);

            const canvas = await html2canvas(tempContainer, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff'
            });

            document.body.removeChild(tempContainer);
            
            const link = document.createElement('a');
            link.download = `birthday-invitation.${format}`;
            link.href = canvas.toDataURL(`image/${format}`, 0.9);
            link.click();
            showNotification(`${format.toUpperCase()} downloaded successfully!`, 'success');
        } catch (error) {
            console.error('Image export error:', error);
            showNotification('Image export failed. Please try again.', 'error');
        }
    }

    async function exportToSocialMedia(element) {
        try {
            // Create a temporary container for social media size
            const tempContainer = document.createElement('div');
            tempContainer.style.position = 'absolute';
            tempContainer.style.left = '-9999px';
            tempContainer.style.top = '0';
            tempContainer.style.width = '1080px';
            tempContainer.style.height = '1080px';
            tempContainer.style.backgroundColor = 'white';
            tempContainer.style.padding = '40px';
            tempContainer.style.display = 'flex';
            tempContainer.style.alignItems = 'center';
            tempContainer.style.justifyContent = 'center';
            
            const clonedElement = element.cloneNode(true);
            clonedElement.style.maxWidth = '1000px';
            clonedElement.style.maxHeight = '1000px';
            tempContainer.appendChild(clonedElement);
            document.body.appendChild(tempContainer);

            const canvas = await html2canvas(tempContainer, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff',
                width: 1080,
                height: 1080
            });

            document.body.removeChild(tempContainer);
            
            const link = document.createElement('a');
            link.download = 'birthday-invitation-social.png';
            link.href = canvas.toDataURL('image/png', 0.9);
            link.click();
            showNotification('Social media image downloaded!', 'success');
        } catch (error) {
            console.error('Social media export error:', error);
            showNotification('Social media export failed. Please try again.', 'error');
        }
    }

    // Download Event Listeners
    document.getElementById('downloadPDF').addEventListener('click', () => exportInvitation('pdf'));
    document.getElementById('downloadPNG').addEventListener('click', () => exportInvitation('png'));
    document.getElementById('downloadJPG').addEventListener('click', () => exportInvitation('jpg'));
    document.getElementById('downloadSocial').addEventListener('click', () => exportInvitation('social'));

    // Share Button
    shareBtn.addEventListener('click', function() {
        if (navigator.share) {
            navigator.share({
                title: eventName.value || 'Birthday Invitation',
                text: message.value || 'Join us for a birthday celebration!',
                url: window.location.href
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            showNotification('Link copied to clipboard!', 'success');
        }
    });

    // Edit Button
    editBtn.addEventListener('click', function() {
        previewSection.style.display = 'none';
        document.getElementById('invitationForm').scrollIntoView({ behavior: 'smooth' });
    });

    // Countdown Timer
    function initializeCountdown() {
        if (!eventDate.value || !eventTime.value) return;

        const eventDateTime = new Date(`${eventDate.value}T${eventTime.value}`);
        
        function updateCountdown() {
            const now = new Date();
            const distance = eventDateTime - now;
            
            if (distance < 0) {
                document.getElementById('countdownTimer').innerHTML = '<p class="text-center">Event has passed!</p>';
                return;
            }
            
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            document.getElementById('days').textContent = days.toString().padStart(2, '0');
            document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
            document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
            document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
        }
        
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

    // Weather Forecast
    async function initializeWeather() {
        if (!venue.value) return;

        try {
            // Simulate weather API call (replace with actual API)
            const weatherData = {
                temp: Math.floor(Math.random() * 30) + 10,
                description: ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain'][Math.floor(Math.random() * 4)],
                icon: 'cloud-sun'
            };

            document.getElementById('weatherTemp').textContent = `${weatherData.temp}°C`;
            document.getElementById('weatherDesc').textContent = weatherData.description;
            document.querySelector('.weather-icon i').className = `fas fa-${weatherData.icon} fa-2x`;
        } catch (error) {
            console.error('Weather API error:', error);
            document.getElementById('weatherForecast').innerHTML = '<p class="text-muted">Weather unavailable</p>';
        }
    }

    // Map Integration
    function initializeMap() {
        if (!venue.value) return;

        const mapContainer = document.getElementById('venueMap');
        if (!mapContainer) return;

        // Create a placeholder map (replace with actual Google Maps integration)
        mapContainer.innerHTML = `
            <div style="
                width: 100%;
                height: 100%;
                background: #f8f9fa;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 8px;
            ">
                <div class="text-center">
                    <i class="fas fa-map-marker-alt fa-3x text-muted mb-3"></i>
                    <p class="text-muted">Map for: ${venue.value}</p>
                    <button class="btn btn-sm btn-primary" onclick="window.open('https://maps.google.com/?q=${encodeURIComponent(venue.value)}', '_blank')">
                        Open in Google Maps
                    </button>
                </div>
            </div>
        `;
    }

    // Initialize features when preview is shown
    generateBtn.addEventListener('click', function() {
        setTimeout(() => {
            initializeCountdown();
            initializeWeather();
            initializeMap();
            initializePreviewControls();
            previewControls.style.display = 'block';
        }, 500);
    });

    // Auto-save functionality
    function autoSave() {
        const formData = {
            eventName: eventName.value,
            hostName: hostName.value,
            eventDate: eventDate.value,
            eventTime: eventTime.value,
            venue: venue.value,
            message: message.value,
            rsvpContact: rsvpContact.value,
            rsvpDate: rsvpDate.value,
            theme: themeSelect.value,
            colorScheme: colorScheme.value,
            borderStyle: borderStyle.value
        };
        
        localStorage.setItem('birthdayInvitationData', JSON.stringify(formData));
    }

    // Load saved data
    function loadSavedData() {
        const savedData = localStorage.getItem('birthdayInvitationData');
        if (savedData) {
            const data = JSON.parse(savedData);
            Object.keys(data).forEach(key => {
                const element = document.getElementById(key);
                if (element) {
                    element.value = data[key];
                }
            });
            
            // Update theme selection
            if (data.theme) {
                document.querySelector(`[data-theme="${data.theme}"]`)?.click();
            }
        }
    }

    // Auto-save on input changes
    [eventName, hostName, eventDate, eventTime, venue, message, rsvpContact, rsvpDate].forEach(element => {
        element.addEventListener('input', autoSave);
    });

    // Load saved data on page load
    loadSavedData();

    // Show welcome message
    showNotification('Welcome to the enhanced Birthday Invitation Generator! Try the new AI features and voice input!', 'info');

    // AI Design Suggestions
    function suggestDesign() {
        const eventText = eventName.value.toLowerCase();
        const suggestions = [];

        if (eventText.includes('birthday')) {
            suggestions.push({
                theme: 'fun',
                colorScheme: 'rainbow',
                borderStyle: 'animated-gradient',
                message: '🎉 Time to celebrate! 🎂'
            });
        } else if (eventText.includes('anniversary')) {
            suggestions.push({
                theme: 'elegant',
                colorScheme: 'purple',
                borderStyle: 'double',
                message: 'Celebrating love and commitment 💕'
            });
        } else if (eventText.includes('graduation')) {
            suggestions.push({
                theme: 'modern',
                colorScheme: 'blue',
                borderStyle: 'solid',
                message: 'Congratulations on your achievement! 🎓'
            });
        }

        if (suggestions.length > 0) {
            const suggestion = suggestions[0];
            
            // Apply suggestions
            document.querySelector(`[data-theme="${suggestion.theme}"]`).click();
            colorScheme.value = suggestion.colorScheme;
            borderStyle.value = suggestion.borderStyle;
            message.value = suggestion.message;

            showNotification('AI design suggestions applied!', 'success');
        } else {
            showNotification('No specific design suggestions for this event type', 'info');
        }
    }

    // AI Party Planning Tips
    function getPartyTips() {
        const eventText = eventName.value.toLowerCase();
        const tips = [];

        if (eventText.includes('birthday')) {
            tips.push(
                '🎂 Consider a themed birthday party',
                '🎈 Plan activities for different age groups',
                '🎁 Set up a gift table with cards',
                '📸 Hire a photographer for memories',
                '🎵 Create a party playlist'
            );
        } else if (eventText.includes('anniversary')) {
            tips.push(
                '💕 Plan a romantic dinner setup',
                '🍷 Include champagne toast',
                '📸 Display wedding photos',
                '🎵 Choose romantic background music',
                '💐 Decorate with fresh flowers'
            );
        }

        if (tips.length > 0) {
            const tipsModal = document.createElement('div');
            tipsModal.className = 'modal fade';
            tipsModal.innerHTML = `
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">🎉 AI Party Planning Tips</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <ul class="list-group list-group-flush">
                                ${tips.map(tip => `<li class="list-group-item">${tip}</li>`).join('')}
                            </ul>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Got it!</button>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(tipsModal);
            const modal = new bootstrap.Modal(tipsModal);
            modal.show();
            
            tipsModal.addEventListener('hidden.bs.modal', () => {
                tipsModal.remove();
            });
        }
    }

    // 3D Effects
    function initialize3D() {
        const invitation3D = document.getElementById('3dInvitation');
        if (!invitation3D) return;

        rotate3D.addEventListener('click', () => {
            currentRotation.y += 90;
            invitation3D.style.transform = `rotateY(${currentRotation.y}deg) rotateX(${currentRotation.x}deg)`;
        });

        flip3D.addEventListener('click', () => {
            currentRotation.x += 180;
            invitation3D.style.transform = `rotateY(${currentRotation.y}deg) rotateX(${currentRotation.x}deg)`;
        });

        enable3D.addEventListener('change', () => {
            is3DEnabled = enable3D.checked;
            if (is3DEnabled) {
                invitation3D.style.transform = 'rotateY(15deg) rotateX(5deg)';
                showNotification('3D effects enabled!', 'success');
            } else {
                invitation3D.style.transform = 'rotateY(0deg) rotateX(0deg)';
                currentRotation = { x: 0, y: 0 };
            }
        });
    }

    // Particle System
    function initializeParticles() {
        const previewContainer = invitationPreview;
        if (!previewContainer) return;

        enableParticles.addEventListener('change', () => {
            if (enableParticles.checked) {
                createParticleSystem(previewContainer);
                showNotification('Particle effects enabled!', 'success');
            } else {
                removeParticleSystem();
            }
        });
    }

    function createParticleSystem(container) {
        const particleContainer = document.createElement('div');
        particleContainer.className = 'particles';
        container.appendChild(particleContainer);

        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 3 + 's';
            particle.style.animationDuration = (Math.random() * 2 + 2) + 's';
            particleContainer.appendChild(particle);
        }

        particleSystem = particleContainer;
    }

    function removeParticleSystem() {
        if (particleSystem) {
            particleSystem.remove();
            particleSystem = null;
        }
    }

    // Music Integration
    function initializeMusic() {
        // Preload audio files
        preloadAudioFiles();
        
        enableMusic.addEventListener('change', () => {
            if (enableMusic.checked) {
                showNotification('Music feature enabled!', 'success');
                updateMusicInfo();
            } else {
                stopCurrentTrack();
            }
        });

        playMusic.addEventListener('click', () => {
            if (!isPlaying) {
                playCurrentTrack();
            } else {
                pauseCurrentTrack();
            }
        });

        pauseMusic.addEventListener('click', () => {
            if (isPlaying) {
                pauseCurrentTrack();
            }
        });

        nextTrack.addEventListener('click', () => {
            nextMusicTrack();
        });
    }

    function preloadAudioFiles() {
        partyMusic.forEach((track, index) => {
            if (index === 0) {
                // Create synthesized Happy Birthday song for the first track
                track.audio = createFallbackAudio();
                console.log(`Loaded: ${track.title}`);
            } else {
                // For other tracks, try to load external audio files
                const audio = new Audio();
                audio.src = track.url;
                audio.preload = 'metadata';
                
                audio.addEventListener('canplaythrough', () => {
                    track.audio = audio;
                    console.log(`Loaded: ${track.title}`);
                });
                
                audio.addEventListener('error', (e) => {
                    console.error(`Error loading ${track.title}:`, e);
                    // Fallback to synthesized version
                    if (index === 1) {
                        track.audio = createCelebrationAudio();
                    } else if (index === 2) {
                        track.audio = createPartyRockAudio();
                    } else {
                        track.audio = createFallbackAudio();
                    }
                });
            }
        });
    }

    function createFallbackAudio() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        return {
            play: () => {
                playHappyBirthdaySong(audioContext);
            },
            pause: () => {
                if (audioContext.state === 'running') {
                    audioContext.suspend();
                }
            },
            currentTime: 0,
            duration: 15
        };
    }

    function playHappyBirthdaySong(audioContext) {
        // Happy Birthday song melody with proper timing
        const melody = [
            // "Happy Birthday to you"
            { note: 'C4', duration: 0.5 },
            { note: 'C4', duration: 0.5 },
            { note: 'D4', duration: 1.0 },
            { note: 'C4', duration: 1.0 },
            { note: 'F4', duration: 1.0 },
            { note: 'E4', duration: 2.0 },
            
            // "Happy Birthday to you"
            { note: 'C4', duration: 0.5 },
            { note: 'C4', duration: 0.5 },
            { note: 'D4', duration: 1.0 },
            { note: 'C4', duration: 1.0 },
            { note: 'G4', duration: 1.0 },
            { note: 'F4', duration: 2.0 },
            
            // "Happy Birthday dear [Name]"
            { note: 'C4', duration: 0.5 },
            { note: 'C4', duration: 0.5 },
            { note: 'C5', duration: 1.0 },
            { note: 'A4', duration: 1.0 },
            { note: 'F4', duration: 1.0 },
            { note: 'E4', duration: 2.0 },
            
            // "Happy Birthday to you"
            { note: 'A4', duration: 0.5 },
            { note: 'A4', duration: 0.5 },
            { note: 'G4', duration: 1.0 },
            { note: 'F4', duration: 1.0 },
            { note: 'E4', duration: 1.0 },
            { note: 'C5', duration: 2.0 }
        ];

        const noteFrequencies = {
            'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'A4': 440.00, 'C5': 523.25
        };

        let currentTime = audioContext.currentTime;
        
        melody.forEach((noteData, index) => {
            const frequency = noteFrequencies[noteData.note];
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(frequency, currentTime);
            oscillator.type = 'sine';
            
            // Create a more musical envelope
            gainNode.gain.setValueAtTime(0, currentTime);
            gainNode.gain.linearRampToValueAtTime(0.3, currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + noteData.duration);
            
            oscillator.start(currentTime);
            oscillator.stop(currentTime + noteData.duration);
            
            currentTime += noteData.duration;
        });
    }

    function createCelebrationAudio() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        return {
            play: () => {
                playCelebrationMelody(audioContext);
            },
            pause: () => {
                if (audioContext.state === 'running') {
                    audioContext.suspend();
                }
            },
            currentTime: 0,
            duration: 6
        };
    }

    function playCelebrationMelody(audioContext) {
        // Celebration melody (upbeat)
        const notes = [
            { freq: 523.25, duration: 0.3 }, // C5
            { freq: 659.25, duration: 0.3 }, // E5
            { freq: 783.99, duration: 0.3 }, // G5
            { freq: 1046.50, duration: 0.6 }, // C6
            { freq: 783.99, duration: 0.3 }, // G5
            { freq: 659.25, duration: 0.3 }, // E5
            { freq: 523.25, duration: 0.3 }, // C5
            { freq: 659.25, duration: 0.3 }, // E5
            { freq: 783.99, duration: 0.3 }, // G5
            { freq: 1046.50, duration: 0.6 }, // C6
        ];

        let currentTime = audioContext.currentTime;
        
        notes.forEach((note, index) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(note.freq, currentTime);
            oscillator.type = 'square';
            
            gainNode.gain.setValueAtTime(0, currentTime);
            gainNode.gain.linearRampToValueAtTime(0.05, currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + note.duration);
            
            oscillator.start(currentTime);
            oscillator.stop(currentTime + note.duration);
            
            currentTime += note.duration;
        });
    }

    function createPartyRockAudio() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        return {
            play: () => {
                playPartyRockMelody(audioContext);
            },
            pause: () => {
                if (audioContext.state === 'running') {
                    audioContext.suspend();
                }
            },
            currentTime: 0,
            duration: 4
        };
    }

    function playPartyRockMelody(audioContext) {
        // Party Rock Anthem style (electronic)
        const notes = [
            { freq: 220, duration: 0.2 }, // A3
            { freq: 220, duration: 0.2 }, // A3
            { freq: 220, duration: 0.2 }, // A3
            { freq: 220, duration: 0.2 }, // A3
            { freq: 440, duration: 0.4 }, // A4
            { freq: 330, duration: 0.2 }, // E4
            { freq: 330, duration: 0.2 }, // E4
            { freq: 330, duration: 0.2 }, // E4
            { freq: 330, duration: 0.2 }, // E4
            { freq: 660, duration: 0.4 }, // E5
        ];

        let currentTime = audioContext.currentTime;
        
        notes.forEach((note, index) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(note.freq, currentTime);
            oscillator.type = 'sawtooth';
            
            gainNode.gain.setValueAtTime(0, currentTime);
            gainNode.gain.linearRampToValueAtTime(0.03, currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + note.duration);
            
            oscillator.start(currentTime);
            oscillator.stop(currentTime + note.duration);
            
            currentTime += note.duration;
        });
    }

    function playCurrentTrack() {
        const currentTrack = partyMusic[currentMusicIndex];
        
        if (currentTrack.generateAudio) {
            // Use the new generateAudio method
            try {
                // Stop any currently playing audio
                if (currentAudio) {
                    currentAudio.pause();
                    currentAudio.currentTime = 0;
                }

                // Generate and play the audio
                currentTrack.generateAudio(document.getElementById('hostName').value || 'Friend');
                isPlaying = true;
                
                // Update UI
                playMusic.innerHTML = '<i class="fas fa-pause"></i>';
                showNotification(`Now playing: ${currentTrack.title}`, 'success');
                
                // Show progress bar
                document.getElementById('musicProgress').style.display = 'block';
                
                // Start progress tracking for generated audio
                startProgressTracking();
                
                // Set a timeout to simulate track ending
                setTimeout(() => {
                    isPlaying = false;
                    playMusic.innerHTML = '<i class="fas fa-play"></i>';
                    showNotification('Track finished', 'info');
                    stopProgressTracking();
                    document.getElementById('musicProgress').style.display = 'none';
                }, 8000); // 8 seconds for the generated melody
                
            } catch (error) {
                console.error('Error generating audio:', error);
                showNotification('Could not generate audio. Please try again.', 'error');
            }
        } else if (currentTrack.audio) {
            // Use the existing audio method
            try {
                // Stop any currently playing audio
                if (currentAudio) {
                    currentAudio.pause();
                    currentAudio.currentTime = 0;
                }

                currentAudio = currentTrack.audio;
                currentAudio.play();
                isPlaying = true;
                
                // Update UI
                playMusic.innerHTML = '<i class="fas fa-pause"></i>';
                showNotification(`Now playing: ${currentTrack.title}`, 'success');
                
                // Show progress bar
                document.getElementById('musicProgress').style.display = 'block';
                
                // Start progress tracking
                startProgressTracking();
                
                // Add event listeners for audio controls
                currentAudio.addEventListener('ended', () => {
                    isPlaying = false;
                    playMusic.innerHTML = '<i class="fas fa-play"></i>';
                    showNotification('Track finished', 'info');
                    stopProgressTracking();
                    document.getElementById('musicProgress').style.display = 'none';
                });
                
                currentAudio.addEventListener('error', (e) => {
                    console.error('Audio playback error:', e);
                    isPlaying = false;
                    playMusic.innerHTML = '<i class="fas fa-play"></i>';
                    showNotification('Audio playback error', 'error');
                    stopProgressTracking();
                });
                
            } catch (error) {
                console.error('Error playing audio:', error);
                showNotification('Could not play audio. Please try again.', 'error');
            }
        } else {
            showNotification('Audio not loaded yet. Please wait...', 'warning');
        }
    }

    function pauseCurrentTrack() {
        if (currentAudio) {
            currentAudio.pause();
        }
        isPlaying = false;
        playMusic.innerHTML = '<i class="fas fa-play"></i>';
        showNotification('Music paused', 'info');
        stopProgressTracking();
    }

    function stopCurrentTrack() {
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
        }
        isPlaying = false;
        playMusic.innerHTML = '<i class="fas fa-play"></i>';
        stopProgressTracking();
        document.getElementById('musicProgress').style.display = 'none';
    }

    function startProgressTracking() {
        if (progressInterval) {
            clearInterval(progressInterval);
        }
        
        progressInterval = setInterval(() => {
            if (currentAudio && !currentAudio.paused) {
                const progress = (currentAudio.currentTime / currentAudio.duration) * 100;
                document.getElementById('musicProgressBar').style.width = progress + '%';
                
                const currentTime = formatTime(currentAudio.currentTime);
                const duration = formatTime(currentAudio.duration);
                document.getElementById('musicTime').textContent = `${currentTime} / ${duration}`;
            }
        }, 100);
    }

    function stopProgressTracking() {
        if (progressInterval) {
            clearInterval(progressInterval);
            progressInterval = null;
        }
    }

    function formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    function nextMusicTrack() {
        // Stop current track
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
        }
        
        // Move to next track
        currentMusicIndex = (currentMusicIndex + 1) % partyMusic.length;
        updateMusicInfo();
        
        // Auto-play if music was playing
        if (isPlaying) {
            setTimeout(() => {
                playCurrentTrack();
            }, 100);
        } else {
            showNotification(`Now ready: ${partyMusic[currentMusicIndex].title}`, 'info');
        }
    }

    function updateMusicInfo() {
        const currentTrack = document.getElementById('currentTrack');
        if (currentTrack) {
            const track = partyMusic[currentMusicIndex];
            currentTrack.textContent = `${track.title} - ${track.artist}`;
        }
    }

    // RSVP Analytics
    function initializeAnalytics() {
        enableAnalytics.addEventListener('change', () => {
            if (enableAnalytics.checked) {
                simulateRSVPData();
                initializeWhatsAppIntegration();
                showNotification('Analytics enabled!', 'success');
            }
        });
    }

    function simulateRSVPData() {
        // Simulate RSVP data
        rsvpData.totalInvites = Math.floor(Math.random() * 50) + 20;
        rsvpData.confirmed = Math.floor(rsvpData.totalInvites * 0.6);
        rsvpData.pending = Math.floor(rsvpData.totalInvites * 0.3);
        rsvpData.declined = rsvpData.totalInvites - rsvpData.confirmed - rsvpData.pending;

        updateAnalyticsDisplay();
    }

    function updateAnalyticsDisplay() {
        document.getElementById('totalInvites').textContent = rsvpData.totalInvites;
        document.getElementById('confirmedRSVP').textContent = rsvpData.confirmed;
        document.getElementById('pendingRSVP').textContent = rsvpData.pending;

        const progressPercentage = (rsvpData.confirmed / rsvpData.totalInvites) * 100;
        document.getElementById('rsvpProgress').style.width = progressPercentage + '%';
    }

    // Interactive Preview Controls
    function initializePreviewControls() {
        const invitationElement = invitationPreview.querySelector('.invitation');
        if (!invitationElement) return;

        rotationSlider.addEventListener('input', (e) => {
            invitationElement.style.transform = `rotate(${e.target.value}deg)`;
        });

        scaleSlider.addEventListener('input', (e) => {
            invitationElement.style.transform = `scale(${e.target.value})`;
        });

        brightnessSlider.addEventListener('input', (e) => {
            invitationElement.style.filter = `brightness(${e.target.value})`;
        });

        resetPreview.addEventListener('click', () => {
            rotationSlider.value = 0;
            scaleSlider.value = 1;
            brightnessSlider.value = 1;
            invitationElement.style.transform = '';
            invitationElement.style.filter = '';
        });

        savePreset.addEventListener('click', () => {
            const preset = {
                rotation: rotationSlider.value,
                scale: scaleSlider.value,
                brightness: brightnessSlider.value
            };
            localStorage.setItem('invitationPreset', JSON.stringify(preset));
            showNotification('Preset saved!', 'success');
        });
    }

    // AR Preview (Simulated)
    function initializeAR() {
        enableAR.addEventListener('change', () => {
            if (enableAR.checked) {
                showNotification('AR preview enabled! (Simulated)', 'success');
            }
        });

        startAR.addEventListener('click', () => {
            showNotification('AR camera activated! Point at your invitation.', 'info');
        });
    }

    // Live Collaboration (Simulated)
    function initializeLiveCollaboration() {
        enableLive.addEventListener('change', () => {
            if (enableLive.checked) {
                showCollaborationIndicator();
                showNotification('Live collaboration enabled!', 'success');
            } else {
                hideCollaborationIndicator();
            }
        });
    }

    function showCollaborationIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'collaboration-indicator';
        indicator.innerHTML = '<i class="fas fa-users me-2"></i>Live Collaboration Active';
        document.body.appendChild(indicator);
    }

    function hideCollaborationIndicator() {
        const indicator = document.querySelector('.collaboration-indicator');
        if (indicator) {
            indicator.remove();
        }
    }

    // WhatsApp Integration Functions
    function initializeWhatsAppIntegration() {
        // Add WhatsApp integration UI
        const rsvpSection = document.querySelector('#rsvpAnalytics').parentElement;
        const whatsappCard = document.createElement('div');
        whatsappCard.className = 'card mb-3';
        whatsappCard.innerHTML = `
            <div class="card-body">
                <h6 class="card-title">
                    <i class="fab fa-whatsapp me-2"></i>WhatsApp RSVP Integration
                </h6>
                <div class="whatsapp-controls">
                    <div class="mb-3">
                        <label class="form-label">Guest Phone Numbers (one per line)</label>
                        <textarea class="form-control" id="guestPhoneNumbers" rows="3" 
                            placeholder="+1234567890&#10;+0987654321&#10;+1122334455"></textarea>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Custom Message</label>
                        <textarea class="form-control" id="whatsappMessage" rows="2"
                            placeholder="You're invited to my birthday party! Please respond with YES, NO, or MAYBE"></textarea>
                    </div>
                    <button class="btn btn-success btn-sm" id="sendWhatsAppBtn">
                        <i class="fab fa-whatsapp"></i> Send Invites via WhatsApp
                    </button>
                    <button class="btn btn-info btn-sm ms-2" id="generateWhatsAppBtn">
                        <i class="fas fa-link"></i> Generate WhatsApp Link
                    </button>
                    <button class="btn btn-primary btn-sm ms-2" id="sendWhatsAppImageBtn">
                        <i class="fab fa-whatsapp"></i> Send Invitation Image via WhatsApp
                    </button>
                </div>
                <div class="whatsapp-status mt-3" id="whatsappStatus"></div>
            </div>
        `;
        rsvpSection.appendChild(whatsappCard);
        
        // Add event listeners
        document.getElementById('sendWhatsAppBtn').addEventListener('click', sendWhatsAppInvites);
        document.getElementById('generateWhatsAppBtn').addEventListener('click', generateWhatsAppLink);
        document.getElementById('sendWhatsAppImageBtn').addEventListener('click', sendInvitationImageViaWhatsApp);
        

    }

    function sendWhatsAppInvites() {
        try {
            console.log('sendWhatsAppInvites function called');
            
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
            
            const customMessage = messageElement.value || 
                `You're invited to ${eventName.value || 'my birthday party'}! Please respond with YES, NO, or MAYBE`;
            
            if (phoneNumbers.length === 0) {
                showNotification('Please enter at least one phone number', 'error');
                return;
            }

            console.log('Phone numbers:', phoneNumbers);
            console.log('Custom message:', customMessage);

            // Store invite data
            whatsappInvites = phoneNumbers.map(phone => ({
                phone: phone,
                status: 'pending',
                sentAt: new Date().toISOString()
            }));

            // Update RSVP data
            rsvpData.totalInvites = phoneNumbers.length;
            rsvpData.pending = phoneNumbers.length;
            rsvpData.confirmed = 0;
            rsvpData.declined = 0;
            updateAnalyticsDisplay();

            // Generate WhatsApp links for each number
            const invitationText = encodeURIComponent(customMessage);
            const statusDiv = document.getElementById('whatsappStatus');
            statusDiv.innerHTML = '<div class="alert alert-info">Sending invitations...</div>';
            
            let linksHtml = '<div class="mt-3"><h6>WhatsApp Links:</h6>';
            phoneNumbers.forEach((phone, index) => {
                const cleanPhone = phone.replace(/\D/g, '');
                const whatsappUrl = `https://wa.me/${cleanPhone}?text=${invitationText}`;
                linksHtml += `
                    <div class="mb-2">
                        <a href="${whatsappUrl}" target="_blank" class="btn btn-success btn-sm">
                            <i class="fab fa-whatsapp"></i> Send to ${phone}
                        </a>
                    </div>
                `;
            });
            linksHtml += '</div>';
            statusDiv.innerHTML = linksHtml;

            showNotification(`Generated ${phoneNumbers.length} WhatsApp invitation links!`, 'success');
            
        } catch (error) {
            console.error('Error in sendWhatsAppInvites:', error);
            showNotification('Error generating WhatsApp links: ' + error.message, 'error');
        }
    }

    function generateWhatsAppLink() {
        try {
            console.log('generateWhatsAppLink function called');
            
            const messageElement = document.getElementById('whatsappMessage');
            
            if (!messageElement) {
                showNotification('WhatsApp integration not initialized properly', 'error');
                return;
            }
            
            const customMessage = messageElement.value || 
                `You're invited to ${eventName.value || 'my birthday party'}! Please respond with YES, NO, or MAYBE`;
            
            const invitationText = encodeURIComponent(customMessage);
            const whatsappUrl = `https://wa.me/?text=${invitationText}`;
            
            console.log('Generated WhatsApp URL:', whatsappUrl);
            
            // Copy to clipboard
            navigator.clipboard.writeText(whatsappUrl).then(() => {
                showNotification('WhatsApp link copied to clipboard!', 'success');
            }).catch(err => {
                console.error('Failed to copy to clipboard:', err);
                showNotification('Link generated but could not copy to clipboard', 'warning');
            });

            // Show the link
            const statusDiv = document.getElementById('whatsappStatus');
            statusDiv.innerHTML = `
                <div class="alert alert-success">
                    <h6>WhatsApp Link Generated:</h6>
                    <input type="text" class="form-control" value="${whatsappUrl}" readonly>
                    <small class="text-muted">Share this link with your guests</small>
                    <button class="btn btn-sm btn-outline-primary mt-2" onclick="navigator.clipboard.writeText('${whatsappUrl}')">
                        <i class="fas fa-copy"></i> Copy Link
                    </button>
                </div>
            `;
            
        } catch (error) {
            console.error('Error in generateWhatsAppLink:', error);
            showNotification('Error generating WhatsApp link: ' + error.message, 'error');
        }
    }

    function handleWhatsAppResponse(phone, response) {
        const invite = whatsappInvites.find(inv => inv.phone === phone);
        if (invite) {
            invite.status = response.toLowerCase();
            invite.respondedAt = new Date().toISOString();
            
            // Update RSVP data
            if (response.toLowerCase() === 'yes') {
                rsvpData.confirmed++;
                rsvpData.pending--;
            } else if (response.toLowerCase() === 'no') {
                rsvpData.declined++;
                rsvpData.pending--;
            } else if (response.toLowerCase() === 'maybe') {
                rsvpData.pending--; // Keep as pending but mark as responded
            }
            
            updateAnalyticsDisplay();
            updateWhatsAppStatus();
        }
    }

    function updateWhatsAppStatus() {
        const statusDiv = document.getElementById('whatsappStatus');
        if (whatsappInvites.length > 0) {
            const confirmed = whatsappInvites.filter(inv => inv.status === 'yes').length;
            const declined = whatsappInvites.filter(inv => inv.status === 'no').length;
            const pending = whatsappInvites.filter(inv => inv.status === 'pending').length;
            
            statusDiv.innerHTML = `
                <div class="alert alert-info">
                    <h6>WhatsApp RSVP Status:</h6>
                    <div class="row">
                        <div class="col-4">
                            <strong>${confirmed}</strong><br>
                            <small>Confirmed</small>
                        </div>
                        <div class="col-4">
                            <strong>${declined}</strong><br>
                            <small>Declined</small>
                        </div>
                        <div class="col-4">
                            <strong>${pending}</strong><br>
                            <small>Pending</small>
                        </div>
                    </div>
                </div>
            `;
        }
    }







    // Show WhatsApp sharing instructions
    function showSharingInstructions() {
        const instructionsHtml = `
            <div class="alert alert-info mt-3">
                <h6><i class="fab fa-whatsapp me-2"></i>How to Share via WhatsApp:</h6>
                <ol class="mb-0">
                    <li>Open WhatsApp on your phone</li>
                    <li>Go to the chat where you want to share</li>
                    <li>Tap the attachment icon (📎)</li>
                    <li>Select "Document" or "Image"</li>
                    <li>Choose the downloaded JPG file</li>
                    <li>Add a message and send!</li>
                </ol>
                <small class="text-muted">The image is optimized for WhatsApp sharing</small>
            </div>
        `;
        
        const statusDiv = document.getElementById('whatsappStatus');
        if (statusDiv) {
            statusDiv.innerHTML = instructionsHtml;
        }
    }

    // Send invitation image via WhatsApp with custom message
    async function sendInvitationImageViaWhatsApp() {
        try {
            showNotification('Generating invitation image and WhatsApp links...', 'info');
            
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

            // Generate the invitation image first
            const invitationHTML = generateInvitationHTML();
            const tempContainer = document.createElement('div');
            tempContainer.innerHTML = invitationHTML;
            tempContainer.style.position = 'absolute';
            tempContainer.style.left = '-9999px';
            tempContainer.style.top = '-9999px';
            tempContainer.style.width = '600px';
            tempContainer.style.height = '800px';
            tempContainer.style.backgroundColor = 'white';
            tempContainer.style.padding = '20px';
            tempContainer.style.boxSizing = 'border-box';
            
            document.body.appendChild(tempContainer);
            
            const canvas = await html2canvas(tempContainer, {
                width: 600,
                height: 800,
                scale: 2,
                backgroundColor: '#ffffff',
                useCORS: true,
                allowTaint: true
            });
            
            document.body.removeChild(tempContainer);
            
            // Convert canvas to blob
            canvas.toBlob(async (blob) => {
                if (blob) {
                    // Store the blob globally for download functions
                    currentInvitationImageBlob = blob;
                    
                    // Create a temporary URL for the image
                    const imageUrl = URL.createObjectURL(blob);
                    
                    // Generate custom message
                    const customMessage = messageElement.value || 
                        `You're invited to ${eventName.value || 'my birthday party'}! Please respond with YES, NO, or MAYBE`;
                    
                    // Store invite data
                    whatsappInvites = phoneNumbers.map(phone => ({
                        phone: phone,
                        status: 'pending',
                        sentAt: new Date().toISOString()
                    }));

                    // Update RSVP data
                    rsvpData.totalInvites = phoneNumbers.length;
                    rsvpData.pending = phoneNumbers.length;
                    rsvpData.confirmed = 0;
                    rsvpData.declined = 0;
                    updateAnalyticsDisplay();

                    // Generate WhatsApp links with image attachment
                    const statusDiv = document.getElementById('whatsappStatus');
                    statusDiv.innerHTML = '<div class="alert alert-info">Generating WhatsApp links with image...</div>';
                    
                    let linksHtml = '<div class="mt-3"><h6>WhatsApp Links with Invitation Image:</h6>';
                    phoneNumbers.forEach((phone, index) => {
                        const cleanPhone = phone.replace(/\D/g, '');
                        // Note: WhatsApp doesn't support direct image attachment via URL, so we provide instructions
                        const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(customMessage)}`;
                        linksHtml += `
                            <div class="mb-3 p-3 border rounded">
                                <h6>Send to ${phone}:</h6>
                                <div class="row">
                                    <div class="col-md-8">
                                        <a href="${whatsappUrl}" target="_blank" class="btn btn-success btn-sm mb-2">
                                            <i class="fab fa-whatsapp"></i> Open WhatsApp Chat
                                        </a>
                                        <br>
                                        <small class="text-muted">Click the link above, then attach the downloaded image</small>
                                    </div>
                                    <div class="col-md-4">
                                        <button class="btn btn-outline-primary btn-sm download-image-btn" data-phone="${phone}">
                                            <i class="fas fa-download"></i> Download Image
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `;
                    });
                    linksHtml += `
                        <div class="alert alert-warning">
                            <h6><i class="fas fa-info-circle"></i> How to send with image:</h6>
                            <ol class="mb-0">
                                <li>Click "Open WhatsApp Chat" for each guest</li>
                                <li>Click "Download Image" to save the invitation</li>
                                <li>In WhatsApp, tap the attachment icon (📎)</li>
                                <li>Select "Image" and choose the downloaded file</li>
                                <li>Add the custom message and send!</li>
                            </ol>
                        </div>
                    `;
                    statusDiv.innerHTML = linksHtml;

                    // Add event listeners for download buttons
                    setTimeout(() => {
                        const downloadButtons = document.querySelectorAll('.download-image-btn');
                        downloadButtons.forEach(button => {
                            button.addEventListener('click', function() {
                                const phone = this.getAttribute('data-phone');
                                downloadImageForPhone(phone);
                            });
                        });
                    }, 100);

                    // Download the image automatically
                    const link = document.createElement('a');
                    link.href = imageUrl;
                    link.download = `birthday-invitation-${Date.now()}.jpg`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    
                    // Clean up
                    setTimeout(() => URL.revokeObjectURL(imageUrl), 1000);
                    
                    showNotification(`Generated ${phoneNumbers.length} WhatsApp links with invitation image!`, 'success');
                    
                } else {
                    showNotification('Failed to generate invitation image', 'error');
                }
            }, 'image/jpeg', 0.9);
            
        } catch (error) {
            console.error('Error sending invitation image via WhatsApp:', error);
            showNotification('Error: ' + error.message, 'error');
        }
    }

    // Download image for specific phone number
    function downloadImageForPhone(phoneNumber) {
        if (!currentInvitationImageBlob) {
            showNotification('No invitation image available. Please generate the invitation first.', 'error');
            return;
        }
        
        try {
            // Create a URL for the stored blob
            const imageUrl = URL.createObjectURL(currentInvitationImageBlob);
            
            // Create download link with phone-specific filename
            const cleanPhone = phoneNumber.replace(/\D/g, '');
            const link = document.createElement('a');
            link.href = imageUrl;
            link.download = `birthday-invitation-${cleanPhone}-${Date.now()}.jpg`;
            
            // Trigger download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Clean up
            setTimeout(() => URL.revokeObjectURL(imageUrl), 1000);
            
            showNotification(`Invitation image downloaded for ${phoneNumber}!`, 'success');
            
        } catch (error) {
            console.error('Error downloading image for phone:', error);
            showNotification('Error downloading image: ' + error.message, 'error');
        }
    }

    // Make function globally accessible
    window.downloadImageForPhone = downloadImageForPhone;
}); 
