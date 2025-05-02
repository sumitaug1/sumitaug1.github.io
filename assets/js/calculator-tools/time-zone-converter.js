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
}); 