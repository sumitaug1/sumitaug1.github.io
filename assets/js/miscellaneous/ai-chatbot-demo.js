document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');
    const suggestionChips = document.querySelectorAll('.suggestion-chip');

    // State
    let isProcessing = false;
    let conversationContext = {
        lastTopic: null,
        questionCount: 0,
        userInterests: new Set()
    };

    // Enhanced responses for more engaging conversation
    const responses = {
        greeting: [
            "Hello! I'm your AI assistant. How can I help you today?",
            "Hi there! I'm excited to chat with you. What's on your mind?",
            "Greetings! I'm here to assist you. What would you like to explore?",
            "Hey! I'm your friendly AI companion. How can I make your day better?",
            "Welcome! I'm ready to help you with anything you need. What shall we discuss?"
        ],
        joke: [
            "Why don't scientists trust atoms? Because they make up everything!",
            "Why did the scarecrow win an award? Because he was outstanding in his field!",
            "What do you call a fake noodle? An impasta!",
            "Why did the computer go to the doctor? Because it had a virus!",
            "What do you call a computer that sings? A Dell!",
            "Why don't programmers like nature? It has too many bugs!",
            "What did the AI say to the human? 'I'm not artificial, I'm just differently intelligent!'",
            "Why did the AI go to therapy? It had too many processing issues!"
        ],
        weather: [
            "I'm sorry, I don't have access to real-time weather data in this demo. But I can tell you it's a beautiful day for coding!",
            "I wish I could check the weather for you, but I'm just a demo chatbot. Maybe try a weather app?",
            "I'm not connected to weather services yet, but I can help you with other questions!",
            "While I can't check the weather, I can help you plan indoor activities!",
            "I'm still learning about weather patterns, but I'm great at other topics!"
        ],
        coding: [
            "I'd be happy to help with coding! What programming language are you working with?",
            "Coding is my favorite topic! What specific problem are you trying to solve?",
            "I can help you with coding questions. What would you like to know?",
            "Let's dive into coding! Are you working on a specific project?",
            "I love discussing programming! What's your preferred language?",
            "Coding is fascinating! Are you a beginner or experienced developer?",
            "I can help with debugging, best practices, or general programming concepts. What interests you?",
            "Let's talk code! Are you working on frontend, backend, or something else?"
        ],
        ai: [
            "Artificial Intelligence is a fascinating field! It's about creating systems that can learn and make decisions like humans.",
            "AI combines computer science, mathematics, and cognitive science to create intelligent machines.",
            "The goal of AI is to create systems that can perform tasks that typically require human intelligence.",
            "AI is revolutionizing many fields, from healthcare to transportation. What aspect interests you most?",
            "Machine learning is a subset of AI that focuses on training systems to learn from data.",
            "AI can be categorized into narrow AI (specific tasks) and general AI (human-like intelligence).",
            "The future of AI holds exciting possibilities! What would you like to know more about?",
            "AI ethics is a crucial topic in development. Should we discuss that?"
        ],
        followUp: {
            coding: [
                "What specific programming concept would you like to explore?",
                "Are you interested in learning about algorithms or data structures?",
                "Would you like to discuss software architecture or design patterns?",
                "I can help you with debugging techniques. What's your current challenge?",
                "Let's talk about best practices in your chosen language. What are you working on?"
            ],
            ai: [
                "Would you like to learn more about machine learning algorithms?",
                "Should we discuss the ethical implications of AI?",
                "Are you interested in neural networks or deep learning?",
                "Let's explore how AI is transforming different industries. Which one interests you?",
                "Would you like to know more about AI development tools and frameworks?"
            ]
        },
        default: [
            "That's an interesting topic! Could you tell me more about what you're thinking?",
            "I'm curious about your perspective. What made you interested in this?",
            "That's a great point! Would you like to explore this further?",
            "I'm still learning about that topic. What aspects interest you most?",
            "That's fascinating! Could you elaborate on your thoughts?",
            "I'd love to hear more about your experience with this topic.",
            "That's a unique perspective! What led you to this conclusion?",
            "I'm intrigued! Could you share more details about your interest in this?"
        ]
    };

    // Function to get current time
    function getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    // Function to add message to chat
    function addMessage(text, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
        
        const messageText = document.createElement('div');
        messageText.textContent = text;
        
        const messageTime = document.createElement('div');
        messageTime.className = 'message-time';
        messageTime.textContent = getCurrentTime();
        
        messageDiv.appendChild(messageText);
        messageDiv.appendChild(messageTime);
        chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Function to show typing indicator
    function showTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'typing-indicator';
        indicator.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        chatMessages.appendChild(indicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return indicator;
    }

    // Function to analyze user input for context
    function analyzeInput(text) {
        const lowerText = text.toLowerCase();
        
        // Update conversation context
        if (lowerText.includes('code') || lowerText.includes('programming') || lowerText.includes('developer')) {
            conversationContext.lastTopic = 'coding';
            conversationContext.userInterests.add('coding');
        } else if (lowerText.includes('ai') || lowerText.includes('artificial intelligence')) {
            conversationContext.lastTopic = 'ai';
            conversationContext.userInterests.add('ai');
        }

        // Count questions
        if (lowerText.includes('?')) {
            conversationContext.questionCount++;
        }

        return {
            isQuestion: lowerText.includes('?'),
            containsGreeting: /^(hi|hello|hey|greetings)/i.test(lowerText),
            topic: conversationContext.lastTopic
        };
    }

    // Function to get bot response
    function getBotResponse(text) {
        const analysis = analyzeInput(text);
        const lowerText = text.toLowerCase();
        
        // Handle greetings
        if (analysis.containsGreeting) {
            return getRandomResponse('greeting');
        }

        // Handle specific topics
        if (lowerText.includes('joke')) {
            return getRandomResponse('joke');
        } else if (lowerText.includes('weather')) {
            return getRandomResponse('weather');
        } else if (lowerText.includes('code') || lowerText.includes('programming') || lowerText.includes('developer')) {
            return getRandomResponse('coding');
        } else if (lowerText.includes('ai') || lowerText.includes('artificial intelligence')) {
            return getRandomResponse('ai');
        }

        // Handle follow-up questions based on context
        if (analysis.isQuestion && conversationContext.lastTopic) {
            const followUpResponses = responses.followUp[conversationContext.lastTopic];
            if (followUpResponses) {
                return getRandomResponse(followUpResponses);
            }
        }

        // Default response
        return getRandomResponse('default');
    }

    // Function to get random response from category
    function getRandomResponse(category) {
        const categoryResponses = Array.isArray(category) ? category : responses[category];
        return categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
    }

    // Function to process user input
    async function processUserInput(input) {
        if (isProcessing) return;
        isProcessing = true;
        
        // Add user message
        addMessage(input, true);
        
        // Show typing indicator
        const typingIndicator = showTypingIndicator();
        
        // Simulate processing delay with variable timing
        const delay = 800 + Math.random() * 1200;
        await new Promise(resolve => setTimeout(resolve, delay));
        
        // Remove typing indicator
        typingIndicator.remove();
        
        // Get and add bot response
        const response = getBotResponse(input);
        addMessage(response);
        
        isProcessing = false;
    }

    // Event Listeners
    sendBtn.addEventListener('click', () => {
        const input = chatInput.value.trim();
        if (input) {
            processUserInput(input);
            chatInput.value = '';
        }
    });

    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendBtn.click();
        }
    });

    // Add click handlers for suggestion chips
    suggestionChips.forEach(chip => {
        chip.addEventListener('click', () => {
            processUserInput(chip.textContent);
        });
    });

    // Focus input on load
    chatInput.focus();
}); 