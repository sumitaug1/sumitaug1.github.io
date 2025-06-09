document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const searchInput = document.getElementById('searchInput');
    const clearSearchBtn = document.getElementById('clearSearch');
    const categoryButtons = document.getElementById('categoryButtons');
    const emojiGrid = document.getElementById('emojiGrid');
    const emojiList = document.getElementById('emojiList');
    const recentEmojis = document.getElementById('recentEmojis');
    const favoriteEmojis = document.getElementById('favoriteEmojis');
    const clearRecentBtn = document.getElementById('clearRecent');
    const clearFavoritesBtn = document.getElementById('clearFavorites');
    const viewButtons = document.querySelectorAll('[data-view]');
    const emojiPreview = document.getElementById('emojiPreview');
    const emojiCombinations = document.getElementById('emojiCombinations');

    // Emoji data
    const emojiData = {
        smileys: {
            name: 'Smileys & Emotion',
            emojis: {
                '😀': 'grinning face',
                '😃': 'grinning face with big eyes',
                '😄': 'grinning face with smiling eyes',
                '😁': 'beaming face with smiling eyes',
                '😅': 'grinning face with sweat',
                '😂': 'face with tears of joy',
                '🤣': 'rolling on the floor laughing',
                '😊': 'smiling face with smiling eyes',
                '😇': 'smiling face with halo',
                '🙂': 'slightly smiling face',
                '🙃': 'upside-down face',
                '😉': 'winking face',
                '😌': 'relieved face',
                '😍': 'smiling face with heart-eyes',
                '🥰': 'smiling face with hearts',
                '😘': 'face blowing a kiss',
                '😗': 'kissing face',
                '😙': 'kissing face with smiling eyes',
                '😚': 'kissing face with closed eyes',
                '😋': 'face savoring food'
            }
        },
        people: {
            name: 'People & Body',
            emojis: {
                '👋': 'waving hand',
                '🤚': 'raised back of hand',
                '🖐️': 'hand with fingers splayed',
                '✋': 'raised hand',
                '🖖': 'vulcan salute',
                '👌': 'ok hand',
                '🤌': 'pinched fingers',
                '🤏': 'pinching hand',
                '✌️': 'victory hand',
                '🤞': 'crossed fingers',
                '🤟': 'love-you gesture',
                '🤘': 'rock on',
                '👈': 'backhand index pointing left',
                '👉': 'backhand index pointing right',
                '👆': 'backhand index pointing up',
                '🖕': 'middle finger',
                '👇': 'backhand index pointing down',
                '👍': 'thumbs up',
                '👎': 'thumbs down',
                '✊': 'raised fist'
            }
        },
        animals: {
            name: 'Animals & Nature',
            emojis: {
                '🐶': 'dog face',
                '🐱': 'cat face',
                '🐭': 'mouse face',
                '🐹': 'hamster face',
                '🐰': 'rabbit face',
                '🦊': 'fox face',
                '🐻': 'bear face',
                '🐼': 'panda face',
                '🐨': 'koala face',
                '🐯': 'tiger face',
                '🦁': 'lion face',
                '🐮': 'cow face',
                '🐷': 'pig face',
                '🐸': 'frog face',
                '🐵': 'monkey face',
                '🐔': 'chicken',
                '🐧': 'penguin',
                '🐦': 'bird',
                '🐤': 'baby chick',
                '🦆': 'duck'
            }
        },
        food: {
            name: 'Food & Drink',
            emojis: {
                '🍎': 'red apple',
                '🍐': 'pear',
                '🍊': 'tangerine',
                '🍋': 'lemon',
                '🍌': 'banana',
                '🍉': 'watermelon',
                '🍇': 'grapes',
                '🍓': 'strawberry',
                '🫐': 'blueberries',
                '🍈': 'melon',
                '🍒': 'cherries',
                '🍑': 'peach',
                '🥭': 'mango',
                '🍍': 'pineapple',
                '🥥': 'coconut',
                '🥝': 'kiwi fruit',
                '🍅': 'tomato',
                '🍆': 'eggplant',
                '🥑': 'avocado',
                '🥦': 'broccoli'
            }
        },
        travel: {
            name: 'Travel & Places',
            emojis: {
                '🚗': 'car',
                '🚕': 'taxi',
                '🚙': 'sport utility vehicle',
                '🚌': 'bus',
                '🚎': 'trolleybus',
                '🏎️': 'racing car',
                '🚓': 'police car',
                '🚑': 'ambulance',
                '🚒': 'fire engine',
                '🚐': 'minibus',
                '🚚': 'delivery truck',
                '🚛': 'articulated lorry',
                '🚜': 'tractor',
                '🛴': 'kick scooter',
                '🚲': 'bicycle',
                '🛵': 'motor scooter',
                '🏍️': 'motorcycle',
                '🚨': 'rotating light',
                '🚔': 'oncoming police car',
                '🚍': 'oncoming bus'
            }
        },
        activities: {
            name: 'Activities',
            emojis: {
                '⚽': 'soccer ball',
                '🏀': 'basketball',
                '🏈': 'american football',
                '⚾': 'baseball',
                '🥎': 'softball',
                '🎾': 'tennis',
                '🏐': 'volleyball',
                '🏉': 'rugby football',
                '🎱': 'pool 8 ball',
                '🏓': 'ping pong',
                '🏸': 'badminton',
                '🏒': 'ice hockey',
                '🏑': 'field hockey',
                '🥍': 'lacrosse',
                '🏏': 'cricket game',
                '🥊': 'boxing glove',
                '🥋': 'martial arts uniform',
                '🥅': 'goal net',
                '⛳': 'flag in hole',
                '⛸️': 'ice skate'
            }
        },
        objects: {
            name: 'Objects',
            emojis: {
                '⌚': 'watch',
                '📱': 'mobile phone',
                '💻': 'laptop',
                '⌨️': 'keyboard',
                '🖥️': 'desktop computer',
                '🖨️': 'printer',
                '🖱️': 'computer mouse',
                '🖲️': 'trackball',
                '🕹️': 'joystick',
                '🗜️': 'clamp',
                '💽': 'computer disk',
                '💾': 'floppy disk',
                '💿': 'optical disk',
                '📀': 'dvd',
                '🧮': 'abacus',
                '🎥': 'movie camera',
                '🎞️': 'film frames',
                '📽️': 'film projector',
                '🎬': 'clapper board',
                '📺': 'television'
            }
        },
        symbols: {
            name: 'Symbols',
            emojis: {
                '❤️': 'red heart',
                '🧡': 'orange heart',
                '💛': 'yellow heart',
                '💚': 'green heart',
                '💙': 'blue heart',
                '💜': 'purple heart',
                '🖤': 'black heart',
                '🤍': 'white heart',
                '🤎': 'brown heart',
                '💔': 'broken heart',
                '❤️‍🔥': 'heart on fire',
                '❤️‍🩹': 'mending heart',
                '💖': 'sparkling heart',
                '💗': 'growing heart',
                '💓': 'beating heart',
                '💞': 'revolving hearts',
                '💕': 'two hearts',
                '💟': 'heart decoration',
                '❣️': 'heart exclamation',
                '💘': 'heart with arrow'
            }
        },
        flags: {
            name: 'Flags',
            emojis: {
                '🏳️': 'white flag',
                '🏴': 'black flag',
                '🏁': 'chequered flag',
                '🚩': 'triangular flag',
                '🎌': 'crossed flags',
                '🏴‍☠️': 'pirate flag',
                '🏳️‍🌈': 'rainbow flag',
                '🏳️‍⚧️': 'transgender flag',
                '🏴‍☠️': 'pirate flag',
                '🇦🇫': 'flag: Afghanistan',
                '🇦🇽': 'flag: Åland Islands',
                '🇦🇱': 'flag: Albania',
                '🇩🇿': 'flag: Algeria',
                '🇦🇸': 'flag: American Samoa',
                '🇦🇩': 'flag: Andorra',
                '🇦🇴': 'flag: Angola',
                '🇦🇮': 'flag: Anguilla',
                '🇦🇶': 'flag: Antarctica',
                '🇦🇬': 'flag: Antigua & Barbuda',
                '🇦🇷': 'flag: Argentina'
            }
        }
    };

    // Current state
    let currentCategory = 'all';
    let currentView = 'grid';
    let favorites = JSON.parse(localStorage.getItem('favoriteEmojis')) || [];
    let recent = JSON.parse(localStorage.getItem('recentEmojis')) || [];

    // Additional state
    let selectedEmojis = new Set();
    let customCombinations = JSON.parse(localStorage.getItem('customCombinations')) || [];
    let emojiStats = JSON.parse(localStorage.getItem('emojiStats')) || {
        totalUsed: 0,
        favorites: 0,
        combinations: 0
    };

    // Popular emoji combinations
    const popularCombinations = [
        '👋 Hello!',
        '❤️ Love you!',
        '🎉 Congratulations!',
        '🙏 Thank you!',
        '👍 Great job!',
        '🎂 Happy Birthday!',
        '🎄 Merry Christmas!',
        '🎃 Happy Halloween!',
        '🌹 I love you!',
        '✨ Magical!'
    ];

    // Initialize
    function init() {
        // Set initial view
        emojiGrid.style.display = 'grid';
        emojiList.style.display = 'none';
        
        renderEmojis();
        renderRecentEmojis();
        renderFavoriteEmojis();
        renderPopularCombinations();
        renderCustomCombinations();
        updateStats();
        setupEventListeners();
    }

    // Render emojis based on current category and view
    function renderEmojis() {
        emojiGrid.innerHTML = '';
        emojiList.innerHTML = '';

        const emojis = currentCategory === 'all' 
            ? Object.values(emojiData).flatMap(category => 
                Object.entries(category.emojis).map(([emoji, name]) => ({
                    emoji,
                    name,
                    category: category.name
                }))
            )
            : Object.entries(emojiData[currentCategory].emojis).map(([emoji, name]) => ({
                emoji,
                name,
                category: emojiData[currentCategory].name
            }));

        if (currentView === 'grid') {
            emojis.forEach(({ emoji, name }) => {
                const emojiItem = document.createElement('div');
                emojiItem.className = 'emoji-item';
                emojiItem.innerHTML = `
                    <span class="emoji">${emoji}</span>
                    <span class="emoji-name">${name}</span>
                    <button class="favorite-btn ${favorites.includes(emoji) ? 'active' : ''}" data-emoji="${emoji}">
                        <i class="fas fa-star"></i>
                    </button>
                `;
                emojiGrid.appendChild(emojiItem);
            });
        } else {
            emojis.forEach(({ emoji, name, category }) => {
                const emojiItem = document.createElement('div');
                emojiItem.className = 'emoji-list-item';
                emojiItem.innerHTML = `
                    <span class="emoji">${emoji}</span>
                    <div class="emoji-info">
                        <div class="emoji-name">${name}</div>
                        <div class="emoji-category">${category}</div>
                    </div>
                    <button class="favorite-btn ${favorites.includes(emoji) ? 'active' : ''}" data-emoji="${emoji}">
                        <i class="fas fa-star"></i>
                    </button>
                `;
                emojiList.appendChild(emojiItem);
            });
        }
    }

    // Render recent emojis
    function renderRecentEmojis() {
        recentEmojis.innerHTML = '';
        recent.slice(0, 20).forEach(emoji => {
            const emojiItem = document.createElement('div');
            emojiItem.className = 'emoji-item';
            emojiItem.innerHTML = `
                <span class="emoji">${emoji}</span>
                <button class="favorite-btn ${favorites.includes(emoji) ? 'active' : ''}" data-emoji="${emoji}">
                    <i class="fas fa-star"></i>
                </button>
            `;
            recentEmojis.appendChild(emojiItem);
        });
    }

    // Render favorite emojis
    function renderFavoriteEmojis() {
        favoriteEmojis.innerHTML = '';
        favorites.forEach(emoji => {
            const emojiItem = document.createElement('div');
            emojiItem.className = 'emoji-item';
            emojiItem.innerHTML = `
                <span class="emoji">${emoji}</span>
                <button class="favorite-btn active" data-emoji="${emoji}">
                    <i class="fas fa-star"></i>
                </button>
            `;
            favoriteEmojis.appendChild(emojiItem);
        });
    }

    // Render popular combinations
    function renderPopularCombinations() {
        emojiCombinations.innerHTML = '';
        popularCombinations.forEach(combination => {
            const combinationItem = document.createElement('div');
            combinationItem.className = 'combination-item';
            combinationItem.textContent = combination;
            emojiCombinations.appendChild(combinationItem);
        });
    }

    // Render custom combinations
    function renderCustomCombinations() {
        const container = document.getElementById('customCombinations');
        container.innerHTML = '';
        
        customCombinations.forEach(combination => {
            const combinationItem = document.createElement('div');
            combinationItem.className = 'combination-item';
            combinationItem.innerHTML = `
                <div class="combination-content">
                    <span class="combination-name">${combination.name}</span>
                    <span class="combination-emojis">${combination.emojis}</span>
                </div>
                <div class="combination-actions">
                    <button class="btn btn-sm btn-outline-secondary copy-combination" data-combination="${combination.emojis}">
                        <i class="fas fa-copy"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-primary share-combination" data-combination="${combination.emojis}">
                        <i class="fas fa-share"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger delete-combination" data-id="${combination.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            container.appendChild(combinationItem);
        });
    }

    // Update statistics
    function updateStats() {
        document.getElementById('totalUsed').textContent = emojiStats.totalUsed;
        document.getElementById('favoritesCount').textContent = emojiStats.favorites;
        document.getElementById('combinationsCount').textContent = emojiStats.combinations;
    }

    // Setup event listeners
    function setupEventListeners() {
        // Category buttons
        categoryButtons.addEventListener('click', (e) => {
            const button = e.target.closest('.category-button');
            if (button) {
                categoryButtons.querySelectorAll('.category-button').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                currentCategory = button.dataset.category;
                renderEmojis();
            }
        });

        // View toggle
        viewButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                viewButtons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                currentView = e.target.dataset.view;
                emojiGrid.style.display = currentView === 'grid' ? 'grid' : 'none';
                emojiList.style.display = currentView === 'list' ? 'flex' : 'none';
                renderEmojis();
            });
        });

        // Search
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const emojiItems = document.querySelectorAll('.emoji-item, .emoji-list-item');
            
            emojiItems.forEach(item => {
                const emojiName = item.querySelector('.emoji-name')?.textContent.toLowerCase() || '';
                const shouldShow = emojiName.includes(searchTerm);
                item.style.display = shouldShow ? '' : 'none';
            });
        });

        // Clear search
        clearSearchBtn.addEventListener('click', () => {
            searchInput.value = '';
            document.querySelectorAll('.emoji-item, .emoji-list-item').forEach(item => {
                item.style.display = '';
            });
        });

        // Emoji click
        emojiGrid.addEventListener('click', handleEmojiClick);
        emojiList.addEventListener('click', handleEmojiClick);
        recentEmojis.addEventListener('click', handleEmojiClick);
        favoriteEmojis.addEventListener('click', handleEmojiClick);
        emojiCombinations.addEventListener('click', handleEmojiClick);

        // Clear recent
        clearRecentBtn.addEventListener('click', () => {
            recent = [];
            localStorage.setItem('recentEmojis', JSON.stringify(recent));
            renderRecentEmojis();
        });

        // Clear favorites
        clearFavoritesBtn.addEventListener('click', () => {
            favorites = [];
            localStorage.setItem('favoriteEmojis', JSON.stringify(favorites));
            renderFavoriteEmojis();
            renderEmojis();
        });

        // Copy multiple emojis
        document.getElementById('copyMultiple').addEventListener('click', () => {
            if (selectedEmojis.size > 0) {
                const emojis = Array.from(selectedEmojis).join('');
                navigator.clipboard.writeText(emojis).then(() => {
                    showEmojiPreview(emojis);
                    selectedEmojis.clear();
                    updateSelectionUI();
                });
            }
        });

        // Create combination
        document.getElementById('createCombination').addEventListener('click', () => {
            const modal = new bootstrap.Modal(document.getElementById('createCombinationModal'));
            modal.show();
        });

        // Save combination
        document.getElementById('saveCombinationBtn').addEventListener('click', () => {
            const name = document.getElementById('combinationName').value;
            const emojis = Array.from(selectedEmojis).join('');
            
            if (name && emojis) {
                const combination = {
                    id: Date.now(),
                    name,
                    emojis
                };
                
                customCombinations.push(combination);
                localStorage.setItem('customCombinations', JSON.stringify(customCombinations));
                
                emojiStats.combinations++;
                localStorage.setItem('emojiStats', JSON.stringify(emojiStats));
                
                updateStats();
                renderCustomCombinations();
                
                const modal = bootstrap.Modal.getInstance(document.getElementById('createCombinationModal'));
                modal.hide();
                
                selectedEmojis.clear();
                updateSelectionUI();
            }
        });

        // Share combination
        document.getElementById('shareCombination').addEventListener('click', () => {
            const modal = new bootstrap.Modal(document.getElementById('shareCombinationModal'));
            const preview = document.getElementById('shareCombinationPreview');
            const shareUrl = document.getElementById('shareUrl');
            
            const emojis = Array.from(selectedEmojis).join('');
            preview.textContent = emojis;
            shareUrl.value = `${window.location.origin}${window.location.pathname}?share=${encodeURIComponent(emojis)}`;
            
            modal.show();
        });

        // Export favorites
        document.getElementById('exportFavorites').addEventListener('click', () => {
            const data = {
                favorites,
                timestamp: new Date().toISOString()
            };
            
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = 'emoji-favorites.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });

        // Import favorites
        document.getElementById('importFavorites').addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            
            input.onchange = (e) => {
                const file = e.target.files[0];
                const reader = new FileReader();
                
                reader.onload = (event) => {
                    try {
                        const data = JSON.parse(event.target.result);
                        if (data.favorites) {
                            favorites = data.favorites;
                            localStorage.setItem('favoriteEmojis', JSON.stringify(favorites));
                            emojiStats.favorites = favorites.length;
                            localStorage.setItem('emojiStats', JSON.stringify(emojiStats));
                            
                            updateStats();
                            renderFavoriteEmojis();
                            renderEmojis();
                        }
                    } catch (error) {
                        console.error('Error importing favorites:', error);
                    }
                };
                
                reader.readAsText(file);
            };
            
            input.click();
        });

        // Sort recent emojis
        document.getElementById('sortRecent').addEventListener('click', () => {
            recent.sort();
            localStorage.setItem('recentEmojis', JSON.stringify(recent));
            renderRecentEmojis();
        });

        // Sort favorites
        document.getElementById('sortFavorites').addEventListener('click', () => {
            favorites.sort();
            localStorage.setItem('favoriteEmojis', JSON.stringify(favorites));
            renderFavoriteEmojis();
        });

        // Handle emoji selection
        emojiGrid.addEventListener('click', (e) => {
            const emojiItem = e.target.closest('.emoji-item');
            if (!emojiItem) return;

            const emoji = emojiItem.querySelector('.emoji').textContent;
            const favoriteBtn = e.target.closest('.favorite-btn');

            if (favoriteBtn) {
                const index = favorites.indexOf(emoji);
                if (index === -1) {
                    favorites.push(emoji);
                    emojiStats.favorites++;
                } else {
                    favorites.splice(index, 1);
                    emojiStats.favorites--;
                }
                
                localStorage.setItem('favoriteEmojis', JSON.stringify(favorites));
                localStorage.setItem('emojiStats', JSON.stringify(emojiStats));
                
                updateStats();
                renderFavoriteEmojis();
                renderEmojis();
                return;
            }

            if (e.ctrlKey || e.metaKey) {
                if (selectedEmojis.has(emoji)) {
                    selectedEmojis.delete(emoji);
                } else {
                    selectedEmojis.add(emoji);
                }
                updateSelectionUI();
            } else {
                // Copy single emoji
                navigator.clipboard.writeText(emoji).then(() => {
                    showEmojiPreview(emoji);
                    
                    // Add to recent
                    const index = recent.indexOf(emoji);
                    if (index !== -1) {
                        recent.splice(index, 1);
                    }
                    recent.unshift(emoji);
                    recent = recent.slice(0, 20);
                    localStorage.setItem('recentEmojis', JSON.stringify(recent));
                    
                    emojiStats.totalUsed++;
                    localStorage.setItem('emojiStats', JSON.stringify(emojiStats));
                    
                    updateStats();
                    renderRecentEmojis();
                });
            }
        });
    }

    // Update selection UI
    function updateSelectionUI() {
        document.querySelectorAll('.emoji-item').forEach(item => {
            const emoji = item.querySelector('.emoji').textContent;
            item.classList.toggle('selected', selectedEmojis.has(emoji));
        });
    }

    // Handle emoji click
    function handleEmojiClick(e) {
        const emojiItem = e.target.closest('.emoji-item, .emoji-list-item, .combination-item');
        if (!emojiItem) return;

        const favoriteBtn = e.target.closest('.favorite-btn');
        if (favoriteBtn) {
            const emoji = favoriteBtn.dataset.emoji;
            const index = favorites.indexOf(emoji);
            
            if (index === -1) {
                favorites.push(emoji);
                emojiStats.favorites++;
            } else {
                favorites.splice(index, 1);
                emojiStats.favorites--;
            }
            
            localStorage.setItem('favoriteEmojis', JSON.stringify(favorites));
            localStorage.setItem('emojiStats', JSON.stringify(emojiStats));
            
            updateStats();
            renderFavoriteEmojis();
            renderEmojis();
            return;
        }

        // Get emoji from the clicked element
        const emoji = emojiItem.querySelector('.emoji')?.textContent || emojiItem.textContent.trim();

        // Copy emoji to clipboard
        navigator.clipboard.writeText(emoji).then(() => {
            showEmojiPreview(emoji);
            
            // Add to recent
            const index = recent.indexOf(emoji);
            if (index !== -1) {
                recent.splice(index, 1);
            }
            recent.unshift(emoji);
            recent = recent.slice(0, 20);
            localStorage.setItem('recentEmojis', JSON.stringify(recent));
            
            emojiStats.totalUsed++;
            localStorage.setItem('emojiStats', JSON.stringify(emojiStats));
            
            updateStats();
            renderRecentEmojis();
        });
    }

    // Show emoji preview
    function showEmojiPreview(emoji) {
        const preview = emojiPreview.querySelector('.emoji');
        preview.textContent = emoji;
        emojiPreview.style.display = 'flex';
        
        setTimeout(() => {
            emojiPreview.style.display = 'none';
        }, 2000);
    }

    // Initialize on load
    init();
}); 