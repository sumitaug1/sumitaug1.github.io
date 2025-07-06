// Global variables
let timeZones = {
    'America/New_York': { name: 'New York', flag: 'us' },
    'America/Los_Angeles': { name: 'Los Angeles', flag: 'us' },
    'Europe/London': { name: 'London', flag: 'gb' },
    'Europe/Paris': { name: 'Paris', flag: 'fr' },
    'Asia/Tokyo': { name: 'Tokyo', flag: 'jp' },
    'Asia/Dubai': { name: 'Dubai', flag: 'ae' },
    'Australia/Sydney': { name: 'Sydney', flag: 'au' },
    'Asia/Singapore': { name: 'Singapore', flag: 'sg' },
    'Asia/Shanghai': { name: 'Shanghai', flag: 'cn' },
    'Asia/Kolkata': { name: 'Mumbai', flag: 'in' }
};

let favorites = JSON.parse(localStorage.getItem('timeZoneFavorites')) || [];

// Get display elements
const fromTimeZone = document.getElementById('fromTimeZone');
const toTimeZone = document.getElementById('toTimeZone');
const fromTime = document.getElementById('fromTime');
const toTime = document.getElementById('toTime');
const fromDate = document.getElementById('fromDate');
const toDate = document.getElementById('toDate');
const fromAmPm = document.getElementById('fromAmPm');
const toAmPm = document.getElementById('toAmPm');
const fromFlag = document.getElementById('fromFlag');
const toFlag = document.getElementById('toFlag');
const timeDisplay = document.getElementById('timeDisplay');
const favoritesList = document.getElementById('favoritesList');
const timeSlots = document.getElementById('timeSlots');

// --- Travel Planner Logic ---
const departureCity = document.getElementById('departureCity');
const arrivalCity = document.getElementById('arrivalCity');
const departureTime = document.getElementById('departureTime');
const flightDuration = document.getElementById('flightDuration');
const arrivalTime = document.getElementById('arrivalTime');
const calculateTravelBtn = document.getElementById('calculateTravelBtn');

// --- World Clock Logic ---
const worldClockGrid = document.getElementById('worldClockGrid');
const addWorldClockBtn = document.getElementById('addWorldClockBtn');

function getDefaultWorldClockTimeZones() {
    // Always return at least 4 major time zones
    return [
        'America/New_York',
        'Europe/London',
        'Asia/Tokyo',
        'Australia/Sydney'
    ];
}

let worldClockTimeZones = [];
try {
    worldClockTimeZones = JSON.parse(localStorage.getItem('worldClockTimeZones'));
    if (!Array.isArray(worldClockTimeZones) || worldClockTimeZones.length === 0) {
        worldClockTimeZones = getDefaultWorldClockTimeZones();
    }
} catch (e) {
    worldClockTimeZones = getDefaultWorldClockTimeZones();
}

// --- AI Suggestions & Smart Features ---
const aiSuggestion = document.getElementById('aiSuggestion');
const aiSuggestionText = document.getElementById('aiSuggestionText');

function generateAISuggestion() {
    const fromZone = fromTimeZone.value;
    const toZone = toTimeZone.value;
    const time = fromTime.value;
    
    if (!fromZone || !toZone || !time) return;
    
    const suggestions = [
        `💡 **Smart Tip:** The best time for meetings between ${timeZones[fromZone].name} and ${timeZones[toZone].name} is usually 9-11 AM in both time zones.`,
        `🌍 **Travel Tip:** When traveling from ${timeZones[fromZone].name} to ${timeZones[toZone].name}, consider jet lag and plan accordingly.`,
        `📅 **Meeting Suggestion:** For international calls, try scheduling between 2-4 PM in ${timeZones[fromZone].name} and 9-11 AM in ${timeZones[toZone].name}.`,
        `⏰ **Time Zone Tip:** ${timeZones[fromZone].name} and ${timeZones[toZone].name} have different daylight saving schedules.`,
        `🎯 **Best Practice:** Always confirm meeting times in both time zones to avoid confusion.`
    ];
    
    const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
    aiSuggestionText.innerHTML = randomSuggestion;
    aiSuggestion.style.display = 'block';
    
    // Hide after 10 seconds
    setTimeout(() => {
        aiSuggestion.style.display = 'none';
    }, 10000);
}

// --- Voice Input Features ---
const fromVoiceBtn = document.getElementById('fromVoiceBtn');
const toVoiceBtn = document.getElementById('toVoiceBtn');

function initializeVoiceInput() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        function setupVoiceRecognition(button, targetSelect) {
            button.addEventListener('click', () => {
                button.classList.add('recording');
                button.innerHTML = '<i class="fas fa-stop"></i>';
                
                const recognition = new SpeechRecognition();
                recognition.continuous = false;
                recognition.interimResults = false;
                recognition.lang = 'en-US';
                
                recognition.onresult = (event) => {
                    const transcript = event.results[0][0].transcript.toLowerCase();
                    searchTimeZone(transcript, targetSelect);
                };
                
                recognition.onend = () => {
                    button.classList.remove('recording');
                    button.innerHTML = '<i class="fas fa-microphone"></i>';
                };
                
                recognition.start();
            });
        }
        
        if (fromVoiceBtn) setupVoiceRecognition(fromVoiceBtn, fromTimeZone);
        if (toVoiceBtn) setupVoiceRecognition(toVoiceBtn, toTimeZone);
    } else {
        // Hide voice buttons if not supported
        if (fromVoiceBtn) fromVoiceBtn.style.display = 'none';
        if (toVoiceBtn) toVoiceBtn.style.display = 'none';
    }
}

function searchTimeZone(query, targetSelect) {
    const matchingZones = Object.entries(timeZones).filter(([id, data]) => 
        data.name.toLowerCase().includes(query) || 
        id.toLowerCase().includes(query)
    );
    
    if (matchingZones.length > 0) {
        targetSelect.value = matchingZones[0][0];
        updateFlags();
        convertTime();
        showNotification(`Found: ${matchingZones[0][1].name}`, 'success');
    } else {
        showNotification('No matching time zone found. Try saying "New York" or "London".', 'warning');
    }
}

// --- Social Sharing & Quick Actions ---
const swapBtn = document.getElementById('swapBtn');
const copyBtn = document.getElementById('copyBtn');
const shareBtn = document.getElementById('shareBtn');
const calendarBtn = document.getElementById('calendarBtn');

function initializeQuickActions() {
    // Swap time zones
    if (swapBtn) {
        swapBtn.addEventListener('click', () => {
            const tempZone = fromTimeZone.value;
            const tempTime = fromTime.value;
            const tempDate = fromDate.value;
            const tempAmPm = fromAmPm.value;
            
            fromTimeZone.value = toTimeZone.value;
            fromTime.value = toTime.value;
            fromDate.value = toDate.value;
            fromAmPm.value = toAmPm.value;
            
            toTimeZone.value = tempZone;
            toTime.value = tempTime;
            toDate.value = tempDate;
            toAmPm.value = tempAmPm;
            
            updateFlags();
            convertTime();
            showNotification('Time zones swapped!', 'success');
        });
    }
    
    // Copy conversion
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const conversionText = `${timeZones[fromTimeZone.value].name} ${fromTime.value} ${fromAmPm.value} = ${timeZones[toTimeZone.value].name} ${toTime.value} ${toAmPm.value}`;
            navigator.clipboard.writeText(conversionText);
            showNotification('Conversion copied to clipboard!', 'success');
        });
    }
    
    // Share conversion
    if (shareBtn) {
        shareBtn.addEventListener('click', () => {
            const conversionText = `${timeZones[fromTimeZone.value].name} ${fromTime.value} ${fromAmPm.value} = ${timeZones[toTimeZone.value].name} ${toTime.value} ${toAmPm.value}`;
            const shareUrl = `https://wa.me/?text=${encodeURIComponent(`Check out this time conversion: ${conversionText}`)}`;
            window.open(shareUrl, '_blank');
        });
    }
    
    // Add to calendar
    if (calendarBtn) {
        calendarBtn.addEventListener('click', () => {
            const event = {
                title: `Meeting: ${timeZones[fromTimeZone.value].name} to ${timeZones[toTimeZone.value].name}`,
                description: `Time conversion: ${fromTime.value} ${fromAmPm.value} = ${toTime.value} ${toAmPm.value}`,
                start: new Date(`${fromDate.value}T${fromTime.value}`).toISOString(),
                end: new Date(`${fromDate.value}T${fromTime.value}`).toISOString()
            };
            
            const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&details=${encodeURIComponent(event.description)}&dates=${event.start.replace(/[-:]/g, '').split('.')[0]}/${event.end.replace(/[-:]/g, '').split('.')[0]}`;
            window.open(googleUrl, '_blank');
        });
    }
}

// --- Notification System ---
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'} me-2"></i>
            <span>${message}</span>
            <button class="btn btn-sm btn-outline-secondary ms-auto" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.getElementById('notificationContainer').appendChild(notification);
    
    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// --- PWA Features ---
function initializePWA() {
    let deferredPrompt;
    
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        
        const installPrompt = document.getElementById('pwaInstallPrompt');
        if (installPrompt) {
            installPrompt.style.display = 'block';
        }
    });
    
    const installBtn = document.getElementById('installBtn');
    const dismissInstall = document.getElementById('dismissInstall');
    
    if (installBtn) {
        installBtn.addEventListener('click', async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                if (outcome === 'accepted') {
                    showNotification('App installed successfully!', 'success');
                }
                deferredPrompt = null;
            }
            document.getElementById('pwaInstallPrompt').style.display = 'none';
        });
    }
    
    if (dismissInstall) {
        dismissInstall.addEventListener('click', () => {
            document.getElementById('pwaInstallPrompt').style.display = 'none';
        });
    }
}

// --- Multilingual Support ---
const languageSelector = document.getElementById('languageSelector');
const translations = {
    en: {
        title: 'Global Time Zone Converter',
        mainConverter: 'Main Converter',
        worldClock: 'World Clock',
        meetingPlanner: 'Meeting Planner',
        travelPlanner: 'Travel Planner',
        favorites: 'Favorites',
        about: 'About Time Zone Converter'
    },
    es: {
        title: 'Convertidor Global de Zonas Horarias',
        mainConverter: 'Convertidor Principal',
        worldClock: 'Reloj Mundial',
        meetingPlanner: 'Planificador de Reuniones',
        travelPlanner: 'Planificador de Viajes',
        favorites: 'Favoritos',
        about: 'Acerca del Convertidor de Zonas Horarias'
    },
    fr: {
        title: 'Convertisseur de Fuseaux Horaires Global',
        mainConverter: 'Convertisseur Principal',
        worldClock: 'Horloge Mondiale',
        meetingPlanner: 'Planificateur de Réunions',
        travelPlanner: 'Planificateur de Voyages',
        favorites: 'Favoris',
        about: 'À Propos du Convertisseur de Fuseaux Horaires'
    },
    hi: {
        title: 'वैश्विक समय क्षेत्र कनवर्टर',
        mainConverter: 'मुख्य कनवर्टर',
        worldClock: 'विश्व घड़ी',
        meetingPlanner: 'बैठक योजनाकार',
        travelPlanner: 'यात्रा योजनाकार',
        favorites: 'पसंदीदा',
        about: 'समय क्षेत्र कनवर्टर के बारे में'
    },
    zh: {
        title: '全球时区转换器',
        mainConverter: '主转换器',
        worldClock: '世界时钟',
        meetingPlanner: '会议规划器',
        travelPlanner: '旅行规划器',
        favorites: '收藏夹',
        about: '关于时区转换器'
    }
};

function initializeMultilingual() {
    if (languageSelector) {
        languageSelector.addEventListener('change', (e) => {
            const lang = e.target.value;
            updateLanguage(lang);
            localStorage.setItem('preferredLanguage', lang);
        });
        
        // Load saved language preference
        const savedLang = localStorage.getItem('preferredLanguage') || 'en';
        languageSelector.value = savedLang;
        updateLanguage(savedLang);
    }
}

function updateLanguage(lang) {
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
}

// --- Accessibility Features ---
const accessibilityToggle = document.getElementById('accessibilityToggle');

function initializeAccessibility() {
    if (accessibilityToggle) {
        accessibilityToggle.addEventListener('click', () => {
            document.body.classList.toggle('high-contrast');
            const isEnabled = document.body.classList.contains('high-contrast');
            showNotification(`High contrast mode ${isEnabled ? 'enabled' : 'disabled'}`, 'info');
        });
    }
}

// --- Enhanced Meeting Planner ---
const findBestTimeBtn = document.getElementById('findBestTimeBtn');

function findBestMeetingTime() {
    const fromZone = fromTimeZone.value;
    const toZone = toTimeZone.value;
    const workStart = document.getElementById('workStart').value;
    const workEnd = document.getElementById('workEnd').value;
    const duration = parseInt(document.getElementById('meetingDuration').value);
    
    if (!fromZone || !toZone) {
        showNotification('Please select both time zones first', 'warning');
        return;
    }
    
    // Find overlapping working hours
    const today = new Date();
    const fromStart = new Date(`${today.toISOString().split('T')[0]}T${workStart}`);
    const fromEnd = new Date(`${today.toISOString().split('T')[0]}T${workEnd}`);
    
    // Convert to target timezone
    const toStart = new Date(fromStart.toLocaleString('en-US', { timeZone: toZone }));
    const toEnd = new Date(fromEnd.toLocaleString('en-US', { timeZone: toZone }));
    
    const bestTime = new Date((toStart.getTime() + toEnd.getTime()) / 2);
    const bestTimeStr = bestTime.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
    });
    
    showNotification(`Best meeting time: ${bestTimeStr} in ${timeZones[toZone].name}`, 'success');
}

function initializeTimeZones() {
    Object.entries(timeZones).forEach(([id, data]) => {
        const option1 = document.createElement('option');
        const option2 = document.createElement('option');
        
        option1.value = id;
        option1.textContent = `${data.name} (${id})`;
        
        option2.value = id;
        option2.textContent = `${data.name} (${id})`;
        
        fromTimeZone.appendChild(option1);
        toTimeZone.appendChild(option2);
    });

    // Set default values
    fromTimeZone.value = 'America/New_York';
    toTimeZone.value = 'Europe/London';
    updateFlags();
    
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    fromDate.value = today;
    toDate.value = today;
}

function convertTime() {
    const fromZone = fromTimeZone.value;
    const toZone = toTimeZone.value;
    const time = fromTime.value;
    const date = fromDate.value;
    const amPm = fromAmPm.value;

    if (!time || !date) {
        showError('Please enter a valid time and date');
        return;
    }

    // Parse the input time
    let [hours, minutes] = time.split(':').map(Number);
    if (amPm === 'PM' && hours < 12) hours += 12;
    if (amPm === 'AM' && hours === 12) hours = 0;

    // Create date object in source timezone
    const sourceDate = new Date(`${date}T${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`);
    
    // Convert to target timezone
    const targetDate = new Date(sourceDate.toLocaleString('en-US', { timeZone: toZone }));
    
    // Update display
    const targetHours = targetDate.getHours();
    const targetMinutes = targetDate.getMinutes();
    const targetAmPm = targetHours >= 12 ? 'PM' : 'AM';
    const displayHours = targetHours % 12 || 12;
    
    toTime.value = `${targetHours.toString().padStart(2, '0')}:${targetMinutes.toString().padStart(2, '0')}`;
    toAmPm.value = targetAmPm;
    toDate.value = targetDate.toISOString().split('T')[0];
    
    timeDisplay.textContent = `${displayHours}:${targetMinutes.toString().padStart(2, '0')} ${targetAmPm}`;
    
    // Update meeting planner
    updateMeetingPlanner();
}

function updateFlags() {
    const fromZone = timeZones[fromTimeZone.value];
    const toZone = timeZones[toTimeZone.value];
    
    fromFlag.src = `https://flagcdn.com/w20/${fromZone.flag}.png`;
    toFlag.src = `https://flagcdn.com/w20/${toZone.flag}.png`;
}

function toggleFavorite(type) {
    const zone = type === 'from' ? fromTimeZone.value : toTimeZone.value;
    const index = favorites.indexOf(zone);
    
    if (index === -1) {
        favorites.push(zone);
    } else {
        favorites.splice(index, 1);
    }
    
    localStorage.setItem('timeZoneFavorites', JSON.stringify(favorites));
    updateFavorites();
}

function updateFavorites() {
    favoritesList.innerHTML = favorites.map(zone => `
        <div class="favorite-item" onclick="selectFavorite('${zone}')">
            <img src="https://flagcdn.com/w20/${timeZones[zone].flag}.png" class="time-zone-flag">
            <span>${timeZones[zone].name}</span>
            <button class="btn btn-sm btn-danger" onclick="removeFavorite('${zone}')">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
}

function selectFavorite(zone) {
    fromTimeZone.value = zone;
    updateFlags();
    convertTime();
}

function removeFavorite(zone) {
    favorites = favorites.filter(f => f !== zone);
    localStorage.setItem('timeZoneFavorites', JSON.stringify(favorites));
    updateFavorites();
}

function updateMeetingPlanner() {
    const fromZone = fromTimeZone.value;
    const toZone = toTimeZone.value;
    const date = fromDate.value;
    
    timeSlots.innerHTML = '';
    
    // Generate time slots for the next 24 hours
    for (let i = 0; i < 24; i++) {
        const hour = i;
        const sourceDate = new Date(`${date}T${hour.toString().padStart(2, '0')}:00:00`);
        
        // Convert to target timezone
        const targetDate = new Date(sourceDate.toLocaleString('en-US', { timeZone: toZone }));
        const targetHour = targetDate.getHours();
        
        const slot = document.createElement('div');
        slot.className = 'time-slot';
        
        // Check if it's working hours (9 AM to 5 PM)
        const isWorkingHour = targetHour >= 9 && targetHour < 17;
        if (isWorkingHour) {
            slot.classList.add('working');
        } else {
            slot.classList.add('non-working');
        }
        
        const displayHour = hour % 12 || 12;
        const amPm = hour >= 12 ? 'PM' : 'AM';
        slot.textContent = `${displayHour}:00 ${amPm}`;
        
        timeSlots.appendChild(slot);
    }
}

function showError(message) {
    alert(message);
}

// Initialize converter when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeTimeZones();
    updateFavorites();
    
    // Add event listeners
    fromTimeZone.addEventListener('change', function() {
        updateFlags();
        convertTime();
    });
    
    toTimeZone.addEventListener('change', function() {
        updateFlags();
        convertTime();
    });
    
    fromTime.addEventListener('input', convertTime);
    fromDate.addEventListener('input', convertTime);
    fromAmPm.addEventListener('change', convertTime);
    
    initializeVoiceInput();
    initializeQuickActions();
    initializePWA();
    initializeMultilingual();
    initializeAccessibility();
    
    // Add AI suggestions on conversion
    if (fromTimeZone && toTimeZone && fromTime) {
        fromTime.addEventListener('input', () => {
            setTimeout(generateAISuggestion, 1000);
        });
    }
    
    // Enhanced meeting planner
    if (findBestTimeBtn) {
        findBestTimeBtn.addEventListener('click', findBestMeetingTime);
    }
    
    // Show welcome notification
    setTimeout(() => {
        showNotification('Welcome to the Global Time Zone Converter! 🌍', 'info');
    }, 2000);
});

function populateTravelCities() {
    departureCity.innerHTML = '<option value="">Select departure city</option>';
    arrivalCity.innerHTML = '<option value="">Select arrival city</option>';
    Object.entries(timeZones).forEach(([id, data]) => {
        const option1 = document.createElement('option');
        option1.value = id;
        option1.textContent = `${data.name} (${id})`;
        departureCity.appendChild(option1);
        const option2 = document.createElement('option');
        option2.value = id;
        option2.textContent = `${data.name} (${id})`;
        arrivalCity.appendChild(option2);
    });
}

function parseFlightDuration(durationStr) {
    // Accepts formats like "8h 30m", "2h", "45m"
    let hours = 0, minutes = 0;
    const hMatch = durationStr.match(/(\d+)\s*h/);
    const mMatch = durationStr.match(/(\d+)\s*m/);
    if (hMatch) hours = parseInt(hMatch[1]);
    if (mMatch) minutes = parseInt(mMatch[1]);
    return { hours, minutes };
}

function calculateArrivalTime() {
    const depZone = departureCity.value;
    const arrZone = arrivalCity.value;
    const depDateTime = departureTime.value;
    const durationStr = flightDuration.value;
    if (!depZone || !arrZone || !depDateTime || !durationStr) {
        arrivalTime.value = '';
        return;
    }
    const { hours, minutes } = parseFlightDuration(durationStr);
    if (isNaN(hours) && isNaN(minutes)) {
        arrivalTime.value = '';
        return;
    }
    // Parse departure time as local to departure city
    const depDate = new Date(depDateTime);
    // Add flight duration in departure time zone
    depDate.setHours(depDate.getHours() + (hours || 0));
    depDate.setMinutes(depDate.getMinutes() + (minutes || 0));
    // Convert to arrival city time zone
    const arrDate = new Date(depDate.toLocaleString('en-US', { timeZone: arrZone }));
    // Format as yyyy-MM-ddTHH:mm for datetime-local input
    const pad = n => n.toString().padStart(2, '0');
    const formatted = `${arrDate.getFullYear()}-${pad(arrDate.getMonth()+1)}-${pad(arrDate.getDate())}T${pad(arrDate.getHours())}:${pad(arrDate.getMinutes())}`;
    arrivalTime.value = formatted;
}

if (departureCity && arrivalCity && departureTime && flightDuration && arrivalTime && calculateTravelBtn) {
    populateTravelCities();
    calculateTravelBtn.addEventListener('click', calculateArrivalTime);
    // Auto-calculate on input change
    departureCity.addEventListener('change', calculateArrivalTime);
    arrivalCity.addEventListener('change', calculateArrivalTime);
    departureTime.addEventListener('input', calculateArrivalTime);
    flightDuration.addEventListener('input', calculateArrivalTime);
}

function updateWorldClock() {
    if (!worldClockGrid) return;
    worldClockGrid.innerHTML = '';
    if (!worldClockTimeZones || worldClockTimeZones.length === 0) {
        worldClockGrid.innerHTML = '<div class="text-muted">No time zones to display. Please add one.</div>';
        showNotification('No time zones in World Clock. Adding defaults.', 'info');
        worldClockTimeZones = getDefaultWorldClockTimeZones();
        localStorage.setItem('worldClockTimeZones', JSON.stringify(worldClockTimeZones));
    }
    worldClockTimeZones.forEach(zoneId => {
        const zoneData = timeZones[zoneId];
        if (!zoneData) return;
        const now = new Date();
        const zoneTime = new Date(now.toLocaleString('en-US', { timeZone: zoneId }));
        const clockItem = document.createElement('div');
        clockItem.className = 'world-clock-item';
        clockItem.innerHTML = `
            <div class="d-flex align-items-center justify-content-between mb-2">
                <img src="https://flagcdn.com/w20/${zoneData.flag}.png" class="time-zone-flag">
                <span class="fw-bold">${zoneData.name}</span>
                <button class="btn btn-sm btn-outline-danger" onclick="removeWorldClock('${zoneId}')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="h4 mb-1">${zoneTime.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: true 
            })}</div>
            <div class="small text-muted">${zoneTime.toLocaleDateString('en-US', { 
                weekday: 'short',
                month: 'short',
                day: 'numeric'
            })}</div>
            <div class="small text-muted">${zoneId}</div>
        `;
        worldClockGrid.appendChild(clockItem);
    });
}

function addWorldClock() {
    const availableZones = Object.keys(timeZones).filter(zone => 
        !worldClockTimeZones.includes(zone)
    );
    
    if (availableZones.length === 0) {
        showNotification('All time zones are already added to the world clock!', 'info');
        return;
    }
    
    // Create a simple modal for selection
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Add Time Zone to World Clock</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <select class="form-select" id="worldClockSelect">
                        ${availableZones.map(zone => 
                            `<option value="${zone}">${timeZones[zone].name} (${zone})</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary" onclick="confirmAddWorldClock()">Add</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    new bootstrap.Modal(modal).show();
    modal.addEventListener('hidden.bs.modal', () => modal.remove());
}

function confirmAddWorldClock() {
    const select = document.getElementById('worldClockSelect');
    const selectedZone = select.value;
    
    if (selectedZone && !worldClockTimeZones.includes(selectedZone)) {
        worldClockTimeZones.push(selectedZone);
        localStorage.setItem('worldClockTimeZones', JSON.stringify(worldClockTimeZones));
        updateWorldClock();
        showNotification('Time zone added to world clock!', 'success');
    }
    
    // Close modal
    const modal = document.querySelector('.modal');
    if (modal) {
        bootstrap.Modal.getInstance(modal).hide();
    }
}

function removeWorldClock(zoneId) {
    worldClockTimeZones = worldClockTimeZones.filter(zone => zone !== zoneId);
    localStorage.setItem('worldClockTimeZones', JSON.stringify(worldClockTimeZones));
    updateWorldClock();
    showNotification('Time zone removed from world clock!', 'success');
}

// Robust initialization
function initializeWorldClock() {
    updateWorldClock();
    if (addWorldClockBtn) {
        addWorldClockBtn.addEventListener('click', addWorldClock);
    }
    setInterval(updateWorldClock, 60000);
}

// Ensure initialization on DOMContentLoaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeWorldClock);
} else {
    initializeWorldClock();
} 
