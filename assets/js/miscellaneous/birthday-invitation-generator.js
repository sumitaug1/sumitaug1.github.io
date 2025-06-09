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

    // Template Gallery
    const templateCards = document.querySelectorAll('.template-card');
    if (templateCards.length > 0) {
        templateCards.forEach(card => {
            card.addEventListener('click', () => {
                // Remove selected class from all cards
                templateCards.forEach(c => c.classList.remove('selected'));
                // Add selected class to clicked card
                card.classList.add('selected');
                // Update theme select
                if (themeSelect) {
                    themeSelect.value = card.dataset.theme;
                }
                // Update preview
                updatePreview();
            });
        });
    }

    // Export Options
    const downloadPDF = document.getElementById('downloadPDF');
    const downloadPNG = document.getElementById('downloadPNG');
    const downloadJPG = document.getElementById('downloadJPG');
    const downloadSocial = document.getElementById('downloadSocial');

    if (downloadPDF) {
        downloadPDF.addEventListener('click', async (e) => {
            e.preventDefault();
            await exportInvitation('pdf');
        });
    }

    if (downloadPNG) {
        downloadPNG.addEventListener('click', async (e) => {
            e.preventDefault();
            await exportInvitation('png');
        });
    }

    if (downloadJPG) {
        downloadJPG.addEventListener('click', async (e) => {
            e.preventDefault();
            await exportInvitation('jpg');
        });
    }

    if (downloadSocial) {
        downloadSocial.addEventListener('click', async (e) => {
            e.preventDefault();
            await exportInvitation('social');
        });
    }

    async function exportInvitation(format) {
        const invitationElement = document.getElementById('invitationPreview');
        const loadingSpinner = document.getElementById('loadingSpinner');
        
        if (!invitationElement) {
            console.error('Invitation preview element not found');
            return;
        }

        try {
            if (loadingSpinner) loadingSpinner.style.display = 'block';

            switch(format) {
                case 'pdf':
                    await exportToPDF(invitationElement);
                    break;
                case 'png':
                    await exportToImage(invitationElement, 'png');
                    break;
                case 'jpg':
                    await exportToImage(invitationElement, 'jpg');
                    break;
                case 'social':
                    await exportToSocialMedia(invitationElement);
                    break;
            }
        } catch (error) {
            console.error('Export error:', error);
            alert('Error exporting invitation. Please try again.');
        } finally {
            if (loadingSpinner) loadingSpinner.style.display = 'none';
        }
    }

    async function exportToPDF(element) {
        if (!window.jspdf) {
            console.error('jsPDF library not loaded');
            return;
        }

        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        const canvas = await html2canvas(element);
        const imgData = canvas.toDataURL('image/png');
        
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('birthday-invitation.pdf');
    }

    async function exportToImage(element, format) {
        if (!window.html2canvas) {
            console.error('html2canvas library not loaded');
            return;
        }

        const canvas = await html2canvas(element);
        const link = document.createElement('a');
        link.download = `birthday-invitation.${format}`;
        link.href = canvas.toDataURL(`image/${format}`);
        link.click();
    }

    async function exportToSocialMedia(element) {
        if (!window.html2canvas) {
            console.error('html2canvas library not loaded');
            return;
        }

        const socialSizes = {
            facebook: { width: 1200, height: 630 },
            instagram: { width: 1080, height: 1080 },
            twitter: { width: 1200, height: 675 }
        };

        const canvas = await html2canvas(element, {
            width: socialSizes.facebook.width,
            height: socialSizes.facebook.height
        });

        const link = document.createElement('a');
        link.download = 'birthday-invitation-social.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    }

    // Countdown Timer
    let countdownInterval = null;

    function initializeCountdown() {
        if (!eventDate || !eventTime) return;

        const eventDateTime = new Date(`${eventDate.value}T${eventTime.value}`);
        const countdownTimer = document.getElementById('countdownTimer');
        
        if (!countdownTimer) return;

        // Clear any existing interval
        if (countdownInterval) {
            clearInterval(countdownInterval);
        }
        
        function updateCountdown() {
            const now = new Date();
            const diff = eventDateTime - now;
            
            if (diff <= 0) {
                countdownTimer.innerHTML = '<p class="text-center">Event has started!</p>';
                clearInterval(countdownInterval);
                return;
            }
            
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            
            const daysElement = document.getElementById('days');
            const hoursElement = document.getElementById('hours');
            const minutesElement = document.getElementById('minutes');
            const secondsElement = document.getElementById('seconds');

            if (daysElement) daysElement.textContent = String(days).padStart(2, '0');
            if (hoursElement) hoursElement.textContent = String(hours).padStart(2, '0');
            if (minutesElement) minutesElement.textContent = String(minutes).padStart(2, '0');
            if (secondsElement) secondsElement.textContent = String(seconds).padStart(2, '0');
        }
        
        updateCountdown();
        countdownInterval = setInterval(updateCountdown, 1000);
    }

    // Venue Map
    let map = null;
    let marker = null;

    function initializeMap() {
        if (!venue || !window.google) {
            const mapContainer = document.getElementById('venueMap');
            if (mapContainer) {
                mapContainer.innerHTML = '<div class="map-error">Google Maps is not available. Please check your internet connection.</div>';
            }
            return;
        }
        
        const mapContainer = document.getElementById('venueMap');
        if (!mapContainer) return;

        // Clear existing map
        if (map) {
            map = null;
            marker = null;
        }

        // Initialize map
        map = new google.maps.Map(mapContainer, {
            zoom: 15,
            center: { lat: 0, lng: 0 },
            mapTypeControl: true,
            streetViewControl: true,
            fullscreenControl: true
        });

        // Geocode the address
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: venue.value }, (results, status) => {
            if (status === 'OK' && results[0]) {
                // Center map on the location
                map.setCenter(results[0].geometry.location);

                // Add marker
                marker = new google.maps.Marker({
                    map: map,
                    position: results[0].geometry.location,
                    title: venue.value,
                    animation: google.maps.Animation.DROP
                });

                // Add info window
                const infoWindow = new google.maps.InfoWindow({
                    content: `<div class="p-2"><strong>${venue.value}</strong></div>`
                });

                marker.addListener('click', () => {
                    infoWindow.open(map, marker);
                });

                // Open info window by default
                infoWindow.open(map, marker);
            } else {
                mapContainer.innerHTML = '<div class="map-error">Could not find the location. Please check the address.</div>';
            }
        });
    }

    // Initialize interactive elements when preview is shown
    if (generateBtn) {
        generateBtn.addEventListener('click', () => {
            // Clear existing intervals and maps
            if (countdownInterval) {
                clearInterval(countdownInterval);
            }
            if (map) {
                map = null;
                marker = null;
            }

            // Initialize new elements
            initializeCountdown();
            initializeWeather();
            initializeMap();
        });
    }

    // Update interactive elements when date/time changes
    if (eventDate) {
        eventDate.addEventListener('change', () => {
            if (previewSection && previewSection.style.display !== 'none') {
                initializeCountdown();
                initializeWeather();
            }
        });
    }

    if (eventTime) {
        eventTime.addEventListener('change', () => {
            if (previewSection && previewSection.style.display !== 'none') {
                initializeCountdown();
            }
        });
    }

    if (venue) {
        venue.addEventListener('change', () => {
            if (previewSection && previewSection.style.display !== 'none') {
                initializeWeather();
                initializeMap();
            }
        });
    }

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        if (countdownInterval) {
            clearInterval(countdownInterval);
        }
    });

    async function initializeWeather() {
        if (!eventDate || !venue) return;
        
        const weatherForecast = document.getElementById('weatherForecast');
        if (!weatherForecast) return;

        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(venue.value)}&appid=YOUR_API_KEY&units=metric`);
            const data = await response.json();
            
            const eventDateObj = new Date(eventDate.value);
            const weatherData = data.list.find(item => {
                const itemDate = new Date(item.dt * 1000);
                return itemDate.getDate() === eventDateObj.getDate();
            });
            
            if (weatherData) {
                const weatherTemp = document.getElementById('weatherTemp');
                const weatherDesc = document.getElementById('weatherDesc');
                const weatherIcon = document.querySelector('.weather-icon i');

                if (weatherTemp) weatherTemp.textContent = `${Math.round(weatherData.main.temp)}°C`;
                if (weatherDesc) weatherDesc.textContent = weatherData.weather[0].description;
                if (weatherIcon) weatherIcon.className = getWeatherIcon(weatherData.weather[0].id);
            }
        } catch (error) {
            console.error('Weather API error:', error);
            weatherForecast.innerHTML = '<p>Weather data unavailable</p>';
        }
    }

    function getWeatherIcon(weatherId) {
        if (weatherId >= 200 && weatherId < 300) return 'fas fa-bolt';
        if (weatherId >= 300 && weatherId < 400) return 'fas fa-cloud-rain';
        if (weatherId >= 500 && weatherId < 600) return 'fas fa-cloud-showers-heavy';
        if (weatherId >= 600 && weatherId < 700) return 'fas fa-snowflake';
        if (weatherId >= 700 && weatherId < 800) return 'fas fa-smog';
        if (weatherId === 800) return 'fas fa-sun';
        if (weatherId > 800) return 'fas fa-cloud';
        return 'fas fa-cloud-sun';
    }
}); 