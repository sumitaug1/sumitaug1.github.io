document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const searchInput = document.getElementById('searchInput');
    const clearSearchBtn = document.getElementById('clearSearch');
    const categoryButtons = document.getElementById('categoryButtons');
    const emojiGrid = document.getElementById('emojiGrid');
    const recentEmojis = document.getElementById('recentEmojis');
    const clearRecentBtn = document.getElementById('clearRecent');
    const viewButtons = document.querySelectorAll('[data-view]');

    // Emoji data
    const emojiData = {
        smileys: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳'],
        people: ['👶', '👧', '🧒', '👦', '👩', '🧑', '👨', '👵', '🧓', '👴', '👮', '🕵️', '👷', '👸', '🤴', '👳', '👲', '🧕', '🤵', '👰', '🤰', '🤱', '👼', '🎅', '🤶', '🧙', '🧚', '🧛', '🧜', '🧝'],
        animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐽', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇'],
        food: ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶️', '🌽', '🥕', '🧄', '🧅', '🥔', '🍠', '🥐', '🥯'],
        travel: ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🚚', '🚛', '🚜', '🛴', '🚲', '🛵', '🏍️', '🚨', '🚔', '🚍', '🚘', '🚖', '🚡', '🚠', '🚟', '🚃', '🚋', '🚞', '🚝', '🚄'],
        activities: ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🎱', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🥊', '🥋', '🥅', '⛳', '⛸️', '🎣', '🤿', '🎽', '🛹', '🛷', '⛷️', '🏂', '🏋️', '🤼', '🤸'],
        objects: ['⌚', '📱', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '🖲️', '🕹️', '🗜️', '💽', '💾', '💿', '📀', '📼', '📷', '📸', '📹', '🎥', '📽️', '🎞️', '📞', '☎️', '📟', '📠', '📺', '📻', '🎙️', '🎚️', '🎛️'],
        symbols: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '💯', '💢', '💥', '💫', '💦', '💨', '🕳️', '💣', '💬', '👁️‍🗨️', '🗨️', '🗯️', '💭', '💤', '💢', '💥', '💫', '💦', '💨', '🕳️'],
        flags: ['🏳️', '🏴', '🏁', '🚩', '🏳️‍🌈', '🏴‍☠️', '🇦🇫', '🇦🇽', '🇦🇱', '🇩🇿', '🇦🇸', '🇦🇩', '🇦🇴', '🇦🇮', '🇦🇶', '🇦🇬', '🇦🇷', '🇦🇲', '🇦🇼', '🇦🇺', '🇦🇹', '🇦🇿', '🇧🇸', '🇧🇭', '🇧🇩', '🇧🇪', '🇧🇿', '🇧🇯', '🇧🇲', '🇧🇹']
    };

    // Current state
    let currentCategory = 'all';
    let currentView = 'grid';
    let recentEmojisList = JSON.parse(localStorage.getItem('recentEmojis')) || [];

    // Initialize the emoji grid
    function initializeEmojiGrid() {
        // Add all emojis to the grid
        const allEmojis = Object.values(emojiData).flat();
        renderEmojis(allEmojis);

        // Set up category buttons
        categoryButtons.addEventListener('click', function(e) {
            if (e.target.matches('button')) {
                // Update active button
                categoryButtons.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');

                // Update current category
                currentCategory = e.target.dataset.category;

                // Filter and render emojis
                const filteredEmojis = currentCategory === 'all' 
                    ? Object.values(emojiData).flat()
                    : emojiData[currentCategory];
                renderEmojis(filteredEmojis);
            }
        });

        // Set up view buttons
        viewButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                viewButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                currentView = this.dataset.view;
                emojiGrid.className = `emoji-${currentView}`;
            });
        });

        // Set up search
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const allEmojis = Object.values(emojiData).flat();
            const filteredEmojis = allEmojis.filter(emoji => {
                const emojiName = getEmojiName(emoji);
                return emojiName.toLowerCase().includes(searchTerm);
            });
            renderEmojis(filteredEmojis);
        });

        // Set up clear search
        clearSearchBtn.addEventListener('click', function() {
            searchInput.value = '';
            const allEmojis = Object.values(emojiData).flat();
            renderEmojis(allEmojis);
        });

        // Set up clear recent
        clearRecentBtn.addEventListener('click', function() {
            recentEmojisList = [];
            localStorage.setItem('recentEmojis', JSON.stringify(recentEmojisList));
            updateRecentEmojis();
        });

        // Load recent emojis
        updateRecentEmojis();
    }

    // Render emojis in the grid
    function renderEmojis(emojis) {
        emojiGrid.innerHTML = '';
        emojis.forEach(emoji => {
            const emojiElement = document.createElement('div');
            emojiElement.className = 'emoji-item';
            emojiElement.textContent = emoji;
            emojiElement.title = getEmojiName(emoji);
            emojiElement.addEventListener('click', () => copyEmoji(emoji));
            emojiGrid.appendChild(emojiElement);
        });
    }

    // Update recent emojis
    function updateRecentEmojis() {
        recentEmojis.innerHTML = '';
        recentEmojisList.forEach(emoji => {
            const emojiElement = document.createElement('div');
            emojiElement.className = 'emoji-item';
            emojiElement.textContent = emoji;
            emojiElement.title = getEmojiName(emoji);
            emojiElement.addEventListener('click', () => copyEmoji(emoji));
            recentEmojis.appendChild(emojiElement);
        });
    }

    // Copy emoji to clipboard
    function copyEmoji(emoji) {
        navigator.clipboard.writeText(emoji)
            .then(() => {
                // Add to recent emojis
                if (!recentEmojisList.includes(emoji)) {
                    recentEmojisList.unshift(emoji);
                    if (recentEmojisList.length > 20) {
                        recentEmojisList.pop();
                    }
                    localStorage.setItem('recentEmojis', JSON.stringify(recentEmojisList));
                    updateRecentEmojis();
                }

                // Show success message
                showAlert('Emoji copied to clipboard!', 'success');
            })
            .catch(err => {
                showAlert('Failed to copy emoji', 'danger');
                console.error('Failed to copy emoji: ', err);
            });
    }

    // Get emoji name (placeholder - in a real app, you'd have a mapping of emoji to names)
    function getEmojiName(emoji) {
        // This is a simplified version. In a real app, you'd have a proper mapping
        return emoji;
    }

    // Show alert message
    function showAlert(message, type) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        
        const container = document.querySelector('.container');
        container.insertBefore(alertDiv, container.firstChild);

        // Auto dismiss after 3 seconds
        setTimeout(() => {
            alertDiv.remove();
        }, 3000);
    }

    // Initialize the emoji keyboard
    initializeEmojiGrid();
}); 