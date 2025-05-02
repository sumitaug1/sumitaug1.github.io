document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const genreCards = document.querySelectorAll('.genre-card');
    const themeOptions = document.querySelectorAll('.theme-option');
    const plotLength = document.getElementById('plotLength');
    const includeTwist = document.getElementById('includeTwist');
    const includeConflict = document.getElementById('includeConflict');
    const includeMoral = document.getElementById('includeMoral');
    const generateBtn = document.getElementById('generateBtn');
    const plotCard = document.getElementById('plotCard');
    const plotContent = document.getElementById('plotContent');
    const copyBtn = document.getElementById('copyBtn');
    const saveBtn = document.getElementById('saveBtn');
    const regenerateBtn = document.getElementById('regenerateBtn');
    const savedPlots = document.getElementById('savedPlots');

    // Genre-specific elements
    const genreElements = {
        fantasy: {
            protagonists: [
                'A young wizard', 'A dragon rider', 'A magical knight',
                'A forest elf', 'A royal sorcerer', 'A magical creature tamer'
            ],
            antagonists: [
                'A dark wizard', 'An ancient dragon', 'A corrupted king',
                'A magical beast', 'A cursed entity', 'A power-hungry sorcerer'
            ],
            locations: [
                'A magical kingdom', 'An enchanted forest', 'A mystical castle',
                'A dragon\'s lair', 'A wizard\'s tower', 'A magical realm'
            ],
            conflicts: [
                'A magical curse', 'An ancient prophecy', 'A magical artifact',
                'A magical war', 'A magical tournament', 'A magical quest'
            ]
        },
        mystery: {
            protagonists: [
                'A detective', 'A private investigator', 'A journalist',
                'A police officer', 'A curious student', 'A mystery writer'
            ],
            antagonists: [
                'A criminal mastermind', 'A corrupt official', 'A mysterious figure',
                'A secret organization', 'A serial killer', 'A blackmailer'
            ],
            locations: [
                'A crime scene', 'A detective\'s office', 'A mysterious mansion',
                'A police station', 'A dark alley', 'A secret hideout'
            ],
            conflicts: [
                'A mysterious disappearance', 'A murder investigation', 'A stolen artifact',
                'A conspiracy', 'A secret plot', 'A mysterious message'
            ]
        },
        romance: {
            protagonists: [
                'A young lover', 'A romantic writer', 'A hopeless romantic',
                'A love-struck artist', 'A romantic musician', 'A love-seeking traveler'
            ],
            antagonists: [
                'A jealous ex', 'A disapproving family', 'A rival suitor',
                'A love triangle', 'A cultural barrier', 'A past relationship'
            ],
            locations: [
                'A romantic cafe', 'A beautiful garden', 'A seaside town',
                'A charming bookstore', 'A romantic city', 'A cozy cottage'
            ],
            conflicts: [
                'A forbidden love', 'A long-distance relationship', 'A love triangle',
                'A cultural difference', 'A family feud', 'A past heartbreak'
            ]
        },
        scifi: {
            protagonists: [
                'A space explorer', 'A scientist', 'A robot engineer',
                'A space pilot', 'A time traveler', 'An alien researcher'
            ],
            antagonists: [
                'An artificial intelligence', 'An alien race', 'A corrupt corporation',
                'A rogue robot', 'A time paradox', 'A space pirate'
            ],
            locations: [
                'A space station', 'A futuristic city', 'An alien planet',
                'A time machine', 'A research facility', 'A space colony'
            ],
            conflicts: [
                'A technological threat', 'An alien invasion', 'A time paradox',
                'A robot uprising', 'A space war', 'A scientific discovery'
            ]
        },
        horror: {
            protagonists: [
                'A paranormal investigator', 'A horror writer', 'A survivor',
                'A ghost hunter', 'A cursed individual', 'A supernatural expert'
            ],
            antagonists: [
                'A vengeful spirit', 'A supernatural entity', 'A cursed being',
                'A demon', 'A haunted object', 'A dark force'
            ],
            locations: [
                'A haunted house', 'A dark forest', 'An abandoned asylum',
                'A cursed town', 'A supernatural realm', 'A dark dimension'
            ],
            conflicts: [
                'A supernatural curse', 'A haunting', 'A demonic possession',
                'A paranormal investigation', 'A supernatural threat', 'A dark ritual'
            ]
        },
        adventure: {
            protagonists: [
                'An explorer', 'A treasure hunter', 'A world traveler',
                'An adventurer', 'A survival expert', 'A daring hero'
            ],
            antagonists: [
                'A rival explorer', 'A dangerous creature', 'A treacherous guide',
                'A natural disaster', 'A hostile environment', 'A competing team'
            ],
            locations: [
                'An ancient temple', 'A dense jungle', 'A mountain range',
                'A desert oasis', 'A mysterious island', 'An underground cave'
            ],
            conflicts: [
                'A dangerous quest', 'A treasure hunt', 'A survival challenge',
                'A natural disaster', 'A rival competition', 'An ancient mystery'
            ]
        }
    };

    // Theme-specific elements
    const themeElements = {
        redemption: {
            plot: 'seeks redemption for past mistakes',
            moral: 'the power of forgiveness and second chances'
        },
        betrayal: {
            plot: 'faces betrayal from a trusted ally',
            moral: 'the importance of trust and loyalty'
        },
        love: {
            plot: 'discovers the true meaning of love',
            moral: 'the transformative power of love'
        },
        revenge: {
            plot: 'seeks revenge for a past wrong',
            moral: 'the consequences of seeking vengeance'
        },
        power: {
            plot: 'struggles with the corrupting influence of power',
            moral: 'the responsibility that comes with power'
        },
        identity: {
            plot: 'discovers their true identity',
            moral: 'the importance of self-discovery'
        },
        survival: {
            plot: 'fights for survival against overwhelming odds',
            moral: 'the strength of the human spirit'
        },
        justice: {
            plot: 'seeks justice for an injustice',
            moral: 'the importance of standing up for what\'s right'
        }
    };

    // Current selections
    let currentGenre = 'fantasy';
    let selectedThemes = new Set();
    let savedPlotsList = JSON.parse(localStorage.getItem('savedPlots') || '[]');

    // Genre selection
    genreCards.forEach(card => {
        card.addEventListener('click', function() {
            genreCards.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            currentGenre = this.dataset.genre;
        });
    });

    // Theme selection
    themeOptions.forEach(option => {
        option.addEventListener('click', function() {
            this.classList.toggle('active');
            const theme = this.dataset.theme;
            if (selectedThemes.has(theme)) {
                selectedThemes.delete(theme);
            } else {
                selectedThemes.add(theme);
            }
        });
    });

    // Generate plot
    function generatePlot() {
        const length = plotLength.value;
        const hasTwist = includeTwist.checked;
        const hasConflict = includeConflict.checked;
        const hasMoral = includeMoral.checked;

        // Get genre-specific elements
        const genre = genreElements[currentGenre];
        const protagonist = getRandomElement(genre.protagonists);
        const antagonist = getRandomElement(genre.antagonists);
        const location = getRandomElement(genre.locations);
        const conflict = hasConflict ? getRandomElement(genre.conflicts) : '';

        // Get theme-specific elements
        let themePlot = '';
        let themeMoral = '';
        if (selectedThemes.size > 0) {
            const randomTheme = getRandomElement(Array.from(selectedThemes));
            themePlot = themeElements[randomTheme].plot;
            themeMoral = themeElements[randomTheme].moral;
        }

        // Generate plot based on length
        let plot = '';
        switch(length) {
            case 'short':
                plot = generateShortPlot(protagonist, antagonist, location, conflict, themePlot, themeMoral);
                break;
            case 'novella':
                plot = generateNovellaPlot(protagonist, antagonist, location, conflict, themePlot, themeMoral);
                break;
            case 'novel':
                plot = generateNovelPlot(protagonist, antagonist, location, conflict, themePlot, themeMoral);
                break;
            case 'series':
                plot = generateSeriesPlot(protagonist, antagonist, location, conflict, themePlot, themeMoral);
                break;
        }

        // Display plot
        plotContent.innerHTML = plot;
        plotCard.style.display = 'block';
    }

    // Generate short story plot
    function generateShortPlot(protagonist, antagonist, location, conflict, themePlot, themeMoral) {
        return `
            <h4>Short Story Plot</h4>
            <p>${protagonist} finds themselves in ${location} facing ${conflict}. 
            As they struggle to overcome this challenge, they encounter ${antagonist} who ${themePlot || 'complicates their journey'}. 
            Through this experience, they learn ${themeMoral || 'valuable lessons about life'}.</p>
        `;
    }

    // Generate novella plot
    function generateNovellaPlot(protagonist, antagonist, location, conflict, themePlot, themeMoral) {
        return `
            <h4>Novella Plot</h4>
            <p>${protagonist} lives in ${location} where ${conflict} disrupts their peaceful life. 
            As they ${themePlot || 'face their challenges'}, they must confront ${antagonist}. 
            Along the way, they discover that ${themePlot || 'things are not as they seem'}. 
            This journey teaches them ${themeMoral || 'important life lessons'}.</p>
        `;
    }

    // Generate novel plot
    function generateNovelPlot(protagonist, antagonist, location, conflict, themePlot, themeMoral) {
        return `
            <h4>Novel Plot</h4>
            <p>In ${location}, ${protagonist} leads a normal life until ${conflict} changes everything. 
            As they ${themePlot || 'embark on their journey'}, they must face ${antagonist}. 
            Through their struggles and triumphs, they learn ${themeMoral || 'profound lessons about life and themselves'}.</p>
        `;
    }

    // Generate series plot
    function generateSeriesPlot(protagonist, antagonist, location, conflict, themePlot, themeMoral) {
        return `
            <h4>Series Plot</h4>
            <p>${location} is home to ${protagonist}, who becomes entangled in ${conflict}. 
            As they ${themePlot || 'begin their journey'}, they must confront ${antagonist}. 
            Each installment reveals more about their true nature and the discovery that ${themePlot || 'the world is not what it seems'}. 
            Throughout the series, they learn ${themeMoral || 'valuable lessons that shape their character'}.</p>
        `;
    }

    // Get random element from array
    function getRandomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    // Copy plot to clipboard
    function copyPlot() {
        const text = plotContent.textContent;
        navigator.clipboard.writeText(text).then(() => {
            copyBtn.innerHTML = '<i class="fas fa-check me-2"></i>Copied!';
            setTimeout(() => {
                copyBtn.innerHTML = '<i class="fas fa-copy me-2"></i>Copy Plot';
            }, 2000);
        });
    }

    // Save plot
    function savePlot() {
        const plot = {
            id: Date.now(),
            genre: currentGenre,
            themes: Array.from(selectedThemes),
            length: plotLength.value,
            content: plotContent.innerHTML,
            date: new Date().toLocaleString()
        };

        savedPlotsList.unshift(plot);
        if (savedPlotsList.length > 10) savedPlotsList.pop();
        
        localStorage.setItem('savedPlots', JSON.stringify(savedPlotsList));
        loadSavedPlots();
    }

    // Load saved plots
    function loadSavedPlots() {
        savedPlots.innerHTML = '';
        savedPlotsList.forEach(plot => {
            const plotElement = document.createElement('div');
            plotElement.className = 'saved-plot mb-3';
            plotElement.innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <h6 class="mb-0">${plot.genre.charAt(0).toUpperCase() + plot.genre.slice(1)} - ${plot.length}</h6>
                            <small class="text-muted">${plot.date}</small>
                        </div>
                        <div class="plot-preview">${plot.content}</div>
                        <div class="d-flex gap-2 mt-2">
                            <button class="btn btn-sm btn-outline-primary copy-saved" data-id="${plot.id}">
                                <i class="fas fa-copy"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger delete-saved" data-id="${plot.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
            savedPlots.appendChild(plotElement);
        });

        // Add event listeners for saved plot buttons
        document.querySelectorAll('.copy-saved').forEach(btn => {
            btn.addEventListener('click', function() {
                const plot = savedPlotsList.find(p => p.id === parseInt(this.dataset.id));
                navigator.clipboard.writeText(plot.content);
                this.innerHTML = '<i class="fas fa-check"></i>';
                setTimeout(() => {
                    this.innerHTML = '<i class="fas fa-copy"></i>';
                }, 2000);
            });
        });

        document.querySelectorAll('.delete-saved').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.dataset.id);
                savedPlotsList = savedPlotsList.filter(p => p.id !== id);
                localStorage.setItem('savedPlots', JSON.stringify(savedPlotsList));
                loadSavedPlots();
            });
        });
    }

    // Event listeners
    generateBtn.addEventListener('click', generatePlot);
    copyBtn.addEventListener('click', copyPlot);
    saveBtn.addEventListener('click', savePlot);
    regenerateBtn.addEventListener('click', generatePlot);

    // Initialize
    loadSavedPlots();
}); 