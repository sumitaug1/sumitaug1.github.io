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
                        ${formatDate(eventDate.value)}
                    </p>
                    <p style="font-size: 1.3rem; margin-bottom: 0.5rem;">
                        ${formatTime(eventTime.value)}
                    </p>
                    <p style="font-size: 1.3rem;">
                        ${venue.value}
                    </p>
                </div>
                
                ${message.value ? `
                    <div style="
                        margin: 2rem 0;
                        padding: 1rem;
                        border-left: 3px solid ${colors.primary};
                        text-align: left;
                    ">
                        <p style="font-style: italic;">${message.value}</p>
                    </div>
                ` : ''}
                
                <div style="margin: 2rem 0;">
                    <p style="font-size: 1.2rem; margin-bottom: 0.5rem;">
                        RSVP by ${formatDate(rsvpDate.value)}
                    </p>
                    <p style="font-size: 1.2rem;">
                        ${rsvpContact.value}
                    </p>
                </div>
            </div>
        `;
    }

    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes borderDots {
            0% { border-style: dotted; }
            50% { border-style: dashed; }
            100% { border-style: dotted; }
        }
        
        @keyframes borderDashed {
            0% { border-style: dashed; }
            50% { border-style: solid; }
            100% { border-style: dashed; }
        }
        
        @keyframes borderGradient {
            0% { border-image: linear-gradient(0deg, ${colorSchemes.blue.primary}, ${colorSchemes.blue.accent}) 1; }
            50% { border-image: linear-gradient(180deg, ${colorSchemes.blue.primary}, ${colorSchemes.blue.accent}) 1; }
            100% { border-image: linear-gradient(360deg, ${colorSchemes.blue.primary}, ${colorSchemes.blue.accent}) 1; }
        }
        
        @keyframes shine {
            0% { left: -100%; }
            100% { left: 200%; }
        }
    `;
    document.head.appendChild(style);

    // Event Listeners
    generateBtn.addEventListener('click', function() {
        if (!eventName.value || !hostName.value || !eventDate.value || !eventTime.value || !venue.value) {
            alert('Please fill in all required fields');
            return;
        }

        invitationPreview.innerHTML = generateInvitationHTML();
        previewSection.style.display = 'block';
    });

    downloadBtn.addEventListener('click', async function() {
        try {
            // Show loading message
            const loadingMsg = document.createElement('div');
            loadingMsg.style.position = 'fixed';
            loadingMsg.style.top = '50%';
            loadingMsg.style.left = '50%';
            loadingMsg.style.transform = 'translate(-50%, -50%)';
            loadingMsg.style.padding = '20px';
            loadingMsg.style.background = 'rgba(0,0,0,0.8)';
            loadingMsg.style.color = 'white';
            loadingMsg.style.borderRadius = '10px';
            loadingMsg.style.zIndex = '1000';
            loadingMsg.textContent = 'Generating PDF...';
            document.body.appendChild(loadingMsg);

            // Create a static version of the invitation
            const staticInvitation = invitationPreview.cloneNode(true);
            
            // Remove all animations and convert to static styles
            const animatedElements = staticInvitation.querySelectorAll('[style*="animation"]');
            animatedElements.forEach(el => {
                el.style.animation = 'none';
                el.style.transition = 'none';
            });

            // Create a temporary container for PDF generation
            const tempContainer = document.createElement('div');
            tempContainer.style.position = 'absolute';
            tempContainer.style.left = '-9999px';
            tempContainer.style.top = '-9999px';
            tempContainer.appendChild(staticInvitation);
            document.body.appendChild(tempContainer);

            // Configure PDF options
            const opt = {
                margin: 0.5,
                filename: `${eventName.value.replace(/\s+/g, '-')}-invitation.pdf`,
                image: { type: 'jpeg', quality: 0.8 },
                html2canvas: { 
                    scale: 1,
                    useCORS: true,
                    allowTaint: true,
                    backgroundColor: '#ffffff',
                    windowWidth: 800,
                    windowHeight: 1200
                },
                jsPDF: { 
                    unit: 'in', 
                    format: 'a4', 
                    orientation: 'portrait'
                }
            };

            // Generate PDF
            await new Promise((resolve, reject) => {
                html2pdf().set(opt).from(tempContainer).save().then(() => {
                    resolve();
                }).catch(err => {
                    reject(err);
                });
            });

            // Clean up
            document.body.removeChild(tempContainer);
            document.body.removeChild(loadingMsg);
        } catch (err) {
            console.error('PDF generation failed:', err);
            
            // Try alternative method if the first one fails
            try {
                const loadingMsg = document.querySelector('div[style*="position: fixed"]');
                if (loadingMsg) {
                    loadingMsg.textContent = 'Trying alternative method...';
                }

                const opt = {
                    margin: 0.5,
                    filename: `${eventName.value.replace(/\s+/g, '-')}-invitation.pdf`,
                    image: { type: 'jpeg', quality: 0.8 },
                    html2canvas: { 
                        scale: 1,
                        useCORS: true,
                        allowTaint: true,
                        backgroundColor: '#ffffff'
                    },
                    jsPDF: { 
                        unit: 'in', 
                        format: 'a4', 
                        orientation: 'portrait'
                    }
                };

                await html2pdf().set(opt).from(invitationPreview).save();
                
                if (loadingMsg) {
                    document.body.removeChild(loadingMsg);
                }
            } catch (secondErr) {
                console.error('Alternative PDF generation failed:', secondErr);
                alert('Failed to generate PDF. Please try the following:\n1. Remove any images from the invitation\n2. Try a different browser\n3. Make sure all required fields are filled out');
                
                const loadingMsg = document.querySelector('div[style*="position: fixed"]');
                if (loadingMsg) {
                    document.body.removeChild(loadingMsg);
                }
            }
        }
    });

    shareBtn.addEventListener('click', async function() {
        try {
            // Create a temporary link for sharing
            const invitationData = {
                title: eventName.value,
                text: `You're invited to ${eventName.value}! Join us for a celebration.`,
                url: window.location.href
            };

            if (navigator.share) {
                await navigator.share(invitationData);
            } else {
                // Fallback for browsers that don't support Web Share API
                const shareUrl = `mailto:?subject=${encodeURIComponent(invitationData.title)}&body=${encodeURIComponent(invitationData.text)}`;
                window.open(shareUrl, '_blank');
            }
        } catch (err) {
            console.error('Sharing failed:', err);
            alert('Failed to share invitation. Please try copying the link manually.');
        }
    });

    editBtn.addEventListener('click', function() {
        previewSection.style.display = 'none';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Set default date to next month
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    eventDate.value = nextMonth.toISOString().split('T')[0];
    
    // Set default RSVP date to 1 week before event
    const rsvpDateValue = new Date(nextMonth);
    rsvpDateValue.setDate(rsvpDateValue.getDate() - 7);
    rsvpDate.value = rsvpDateValue.toISOString().split('T')[0];
}); 