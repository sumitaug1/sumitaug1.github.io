document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const categoryOptions = document.querySelectorAll('.category-option');
    const authorType = document.getElementById('authorType');
    const quoteLength = document.getElementById('quoteLength');
    const generateBtn = document.getElementById('generateBtn');
    const quoteCard = document.getElementById('quoteCard');
    const quoteText = document.getElementById('quoteText');
    const quoteAuthor = document.getElementById('quoteAuthor');
    const copyBtn = document.getElementById('copyBtn');
    const saveBtn = document.getElementById('saveBtn');
    const regenerateBtn = document.getElementById('regenerateBtn');
    const savedQuotes = document.getElementById('savedQuotes');

    // Quote database
    const quotes = {
        inspirational: [
            {
                text: "The only way to do great work is to love what you do.",
                author: "Steve Jobs",
                type: "modern",
                length: "short"
            },
            {
                text: "Believe you can and you're halfway there.",
                author: "Theodore Roosevelt",
                type: "historical",
                length: "short"
            },
            {
                text: "The future belongs to those who believe in the beauty of their dreams.",
                author: "Eleanor Roosevelt",
                type: "historical",
                length: "medium"
            }
        ],
        motivational: [
            {
                text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
                author: "Winston Churchill",
                type: "historical",
                length: "medium"
            },
            {
                text: "Don't watch the clock; do what it does. Keep going.",
                author: "Sam Levenson",
                type: "modern",
                length: "short"
            },
            {
                text: "The only limit to our realization of tomorrow will be our doubts of today.",
                author: "Franklin D. Roosevelt",
                type: "historical",
                length: "medium"
            }
        ],
        success: [
            {
                text: "Success is walking from failure to failure with no loss of enthusiasm.",
                author: "Winston Churchill",
                type: "historical",
                length: "medium"
            },
            {
                text: "The road to success and the road to failure are almost exactly the same.",
                author: "Colin R. Davis",
                type: "modern",
                length: "medium"
            },
            {
                text: "Success is not the key to happiness. Happiness is the key to success.",
                author: "Albert Schweitzer",
                type: "philosophers",
                length: "short"
            }
        ],
        leadership: [
            {
                text: "A leader is one who knows the way, goes the way, and shows the way.",
                author: "John C. Maxwell",
                type: "modern",
                length: "medium"
            },
            {
                text: "Leadership is not about being in charge. It's about taking care of those in your charge.",
                author: "Simon Sinek",
                type: "modern",
                length: "medium"
            },
            {
                text: "The greatest leader is not necessarily the one who does the greatest things. He is the one that gets people to do the greatest things.",
                author: "Ronald Reagan",
                type: "historical",
                length: "long"
            }
        ],
        wisdom: [
            {
                text: "The only true wisdom is in knowing you know nothing.",
                author: "Socrates",
                type: "philosophers",
                length: "short"
            },
            {
                text: "The journey of a thousand miles begins with one step.",
                author: "Lao Tzu",
                type: "philosophers",
                length: "short"
            },
            {
                text: "Wisdom comes from experience, and experience comes from mistakes.",
                author: "Unknown",
                type: "modern",
                length: "medium"
            }
        ],
        humor: [
            {
                text: "I'm not lazy, I'm on energy-saving mode.",
                author: "Unknown",
                type: "modern",
                length: "short"
            },
            {
                text: "I used to think I was indecisive, but now I'm not so sure.",
                author: "Tommy Cooper",
                type: "modern",
                length: "short"
            },
            {
                text: "I'm not arguing, I'm just explaining why I'm right.",
                author: "Unknown",
                type: "modern",
                length: "short"
            }
        ]
    };

    // Current selections
    let selectedCategories = new Set(['inspirational']);
    let savedQuotesList = JSON.parse(localStorage.getItem('savedQuotes') || '[]');

    // Category selection
    categoryOptions.forEach(option => {
        option.addEventListener('click', function() {
            this.classList.toggle('active');
            const category = this.dataset.category;
            if (selectedCategories.has(category)) {
                selectedCategories.delete(category);
            } else {
                selectedCategories.add(category);
            }
        });
    });

    // Generate quote
    function generateQuote() {
        const authorTypeValue = authorType.value;
        const quoteLengthValue = quoteLength.value;

        // Get quotes from selected categories
        let availableQuotes = [];
        selectedCategories.forEach(category => {
            availableQuotes = availableQuotes.concat(quotes[category]);
        });

        // Filter by author type if not 'all'
        if (authorTypeValue !== 'all') {
            availableQuotes = availableQuotes.filter(quote => quote.type === authorTypeValue);
        }

        // Filter by length if not 'any'
        if (quoteLengthValue !== 'any') {
            availableQuotes = availableQuotes.filter(quote => quote.length === quoteLengthValue);
        }

        // If no quotes available, show message
        if (availableQuotes.length === 0) {
            quoteText.textContent = "No quotes available for the selected criteria. Please try different options.";
            quoteAuthor.textContent = "";
        } else {
            // Get random quote
            const randomQuote = getRandomElement(availableQuotes);
            quoteText.textContent = randomQuote.text;
            quoteAuthor.textContent = `- ${randomQuote.author}`;
        }

        // Show quote card
        quoteCard.style.display = 'block';
    }

    // Get random element from array
    function getRandomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    // Copy quote to clipboard
    function copyQuote() {
        const text = `${quoteText.textContent} - ${quoteAuthor.textContent}`;
        navigator.clipboard.writeText(text).then(() => {
            copyBtn.innerHTML = '<i class="fas fa-check me-2"></i>Copied!';
            setTimeout(() => {
                copyBtn.innerHTML = '<i class="fas fa-copy me-2"></i>Copy Quote';
            }, 2000);
        });
    }

    // Save quote
    function saveQuote() {
        const quote = {
            id: Date.now(),
            text: quoteText.textContent,
            author: quoteAuthor.textContent,
            categories: Array.from(selectedCategories),
            date: new Date().toLocaleString()
        };

        savedQuotesList.unshift(quote);
        if (savedQuotesList.length > 10) savedQuotesList.pop();
        
        localStorage.setItem('savedQuotes', JSON.stringify(savedQuotesList));
        loadSavedQuotes();
    }

    // Load saved quotes
    function loadSavedQuotes() {
        savedQuotes.innerHTML = '';
        savedQuotesList.forEach(quote => {
            const quoteElement = document.createElement('div');
            quoteElement.className = 'saved-quote mb-3';
            quoteElement.innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <div class="quote-content">
                            <p class="mb-2">${quote.text}</p>
                            <p class="text-muted mb-2">${quote.author}</p>
                            <div class="d-flex gap-2">
                                <button class="btn btn-sm btn-outline-primary copy-saved" data-id="${quote.id}">
                                    <i class="fas fa-copy"></i>
                                </button>
                                <button class="btn btn-sm btn-outline-danger delete-saved" data-id="${quote.id}">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            savedQuotes.appendChild(quoteElement);
        });

        // Add event listeners for saved quote buttons
        document.querySelectorAll('.copy-saved').forEach(btn => {
            btn.addEventListener('click', function() {
                const quote = savedQuotesList.find(q => q.id === parseInt(this.dataset.id));
                navigator.clipboard.writeText(`${quote.text} ${quote.author}`);
                this.innerHTML = '<i class="fas fa-check"></i>';
                setTimeout(() => {
                    this.innerHTML = '<i class="fas fa-copy"></i>';
                }, 2000);
            });
        });

        document.querySelectorAll('.delete-saved').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.dataset.id);
                savedQuotesList = savedQuotesList.filter(q => q.id !== id);
                localStorage.setItem('savedQuotes', JSON.stringify(savedQuotesList));
                loadSavedQuotes();
            });
        });
    }

    // Event listeners
    generateBtn.addEventListener('click', generateQuote);
    copyBtn.addEventListener('click', copyQuote);
    saveBtn.addEventListener('click', saveQuote);
    regenerateBtn.addEventListener('click', generateQuote);

    // Initialize
    loadSavedQuotes();
}); 