document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const nameInput = document.getElementById('nameInput');
    const calculateBtn = document.getElementById('calculateBtn');
    const resultsSection = document.getElementById('resultsSection');
    const resultIcon = document.getElementById('resultIcon');
    const resultTitle = document.getElementById('resultTitle');
    const resultDescription = document.getElementById('resultDescription');
    const expressionNumber = document.getElementById('expressionNumber');
    const expressionMeaning = document.getElementById('expressionMeaning');
    const soulUrgeNumber = document.getElementById('soulUrgeNumber');
    const soulUrgeMeaning = document.getElementById('soulUrgeMeaning');
    const personalityNumber = document.getElementById('personalityNumber');
    const personalityMeaning = document.getElementById('personalityMeaning');
    const lifePathNumber = document.getElementById('lifePathNumber');
    const lifePathMeaning = document.getElementById('lifePathMeaning');

    // Numerology Data
    const numerologyMeanings = {
        1: {
            expression: "Natural leader, independent, creative",
            soulUrge: "Desire for independence and achievement",
            personality: "Confident, ambitious, pioneering",
            lifePath: "Leadership, independence, creativity"
        },
        2: {
            expression: "Diplomatic, cooperative, peaceful",
            soulUrge: "Desire for harmony and partnership",
            personality: "Gentle, supportive, diplomatic",
            lifePath: "Cooperation, balance, harmony"
        },
        3: {
            expression: "Expressive, creative, optimistic",
            soulUrge: "Desire for self-expression and joy",
            personality: "Charismatic, artistic, enthusiastic",
            lifePath: "Creativity, self-expression, joy"
        },
        4: {
            expression: "Practical, organized, reliable",
            soulUrge: "Desire for stability and security",
            personality: "Dependable, hardworking, methodical",
            lifePath: "Stability, order, foundation"
        },
        5: {
            expression: "Adventurous, freedom-loving, versatile",
            soulUrge: "Desire for freedom and change",
            personality: "Dynamic, adaptable, curious",
            lifePath: "Freedom, change, adventure"
        },
        6: {
            expression: "Nurturing, responsible, harmonious",
            soulUrge: "Desire for love and family",
            personality: "Caring, protective, supportive",
            lifePath: "Love, responsibility, harmony"
        },
        7: {
            expression: "Analytical, spiritual, introspective",
            soulUrge: "Desire for knowledge and wisdom",
            personality: "Mysterious, intellectual, spiritual",
            lifePath: "Spirituality, wisdom, analysis"
        },
        8: {
            expression: "Ambitious, powerful, materialistic",
            soulUrge: "Desire for success and abundance",
            personality: "Authoritative, business-minded, confident",
            lifePath: "Power, success, abundance"
        },
        9: {
            expression: "Humanitarian, compassionate, idealistic",
            soulUrge: "Desire for universal love and service",
            personality: "Generous, compassionate, idealistic",
            lifePath: "Humanitarianism, compassion, service"
        }
    };

    // Helper Functions
    function getLetterValue(letter) {
        const values = {
            'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8, 'I': 9,
            'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'O': 6, 'P': 7, 'Q': 8, 'R': 9,
            'S': 1, 'T': 2, 'U': 3, 'V': 4, 'W': 5, 'X': 6, 'Y': 7, 'Z': 8
        };
        return values[letter.toUpperCase()] || 0;
    }

    function reduceNumber(num) {
        while (num > 9) {
            num = num.toString().split('').reduce((a, b) => parseInt(a) + parseInt(b), 0);
        }
        return num;
    }

    function calculateExpressionNumber(name) {
        const letters = name.replace(/[^A-Za-z]/g, '').split('');
        const sum = letters.reduce((acc, letter) => acc + getLetterValue(letter), 0);
        return reduceNumber(sum);
    }

    function calculateSoulUrgeNumber(name) {
        const vowels = name.replace(/[^AEIOUaeiou]/g, '').split('');
        const sum = vowels.reduce((acc, letter) => acc + getLetterValue(letter), 0);
        return reduceNumber(sum);
    }

    function calculatePersonalityNumber(name) {
        const consonants = name.replace(/[AEIOUaeiou\s]/g, '').split('');
        const sum = consonants.reduce((acc, letter) => acc + getLetterValue(letter), 0);
        return reduceNumber(sum);
    }

    function calculateLifePathNumber(name) {
        const words = name.split(' ');
        const sum = words.reduce((acc, word) => {
            const wordSum = word.split('').reduce((a, b) => a + getLetterValue(b), 0);
            return acc + reduceNumber(wordSum);
        }, 0);
        return reduceNumber(sum);
    }

    function displayResults(name) {
        const expNum = calculateExpressionNumber(name);
        const soulNum = calculateSoulUrgeNumber(name);
        const persNum = calculatePersonalityNumber(name);
        const lifeNum = calculateLifePathNumber(name);

        // Set main result
        resultIcon.innerHTML = '<i class="fas fa-star fa-3x text-primary"></i>';
        resultTitle.textContent = `Numerology Analysis for ${name}`;
        resultDescription.textContent = `Your name reveals important insights about your personality and life path.`;

        // Set individual numbers and meanings
        expressionNumber.textContent = expNum;
        expressionMeaning.textContent = numerologyMeanings[expNum].expression;

        soulUrgeNumber.textContent = soulNum;
        soulUrgeMeaning.textContent = numerologyMeanings[soulNum].soulUrge;

        personalityNumber.textContent = persNum;
        personalityMeaning.textContent = numerologyMeanings[persNum].personality;

        lifePathNumber.textContent = lifeNum;
        lifePathMeaning.textContent = numerologyMeanings[lifeNum].lifePath;
    }

    // Event Listeners
    calculateBtn.addEventListener('click', function() {
        const name = nameInput.value.trim();
        
        if (!name) {
            alert('Please enter your name');
            return;
        }

        displayResults(name);
        resultsSection.style.display = 'block';
    });

    nameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            calculateBtn.click();
        }
    });
}); 