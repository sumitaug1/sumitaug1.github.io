document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const chatStyle = document.getElementById('chatStyle');
    const responseSpeed = document.getElementById('responseSpeed');
    const chatMessages = document.getElementById('chatMessages');
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');
    const clearBtn = document.getElementById('clearBtn');
    const saveBtn = document.getElementById('saveBtn');
    const suggestBtn = document.getElementById('suggestBtn');

    // Chat styles and their responses
    const chatStyles = {
        friendly: {
            greeting: "Hello! I'm your friendly AI assistant. How can I help you today?",
            responses: [
                "That's interesting! Tell me more about it.",
                "I understand how you feel. Let's explore that together.",
                "That's a great question! Here's what I think...",
                "I'm here to help and support you.",
                "Let's work together to find a solution."
            ]
        },
        professional: {
            greeting: "Good day. I am your professional AI assistant. How may I assist you?",
            responses: [
                "Based on the information provided, I would recommend...",
                "From a professional standpoint, the best approach would be...",
                "Let me analyze that for you.",
                "I can provide you with detailed information on that topic.",
                "Here's a comprehensive solution to your query."
            ]
        },
        casual: {
            greeting: "Hey there! What's up? I'm your AI buddy, ready to chat!",
            responses: [
                "Cool! Tell me more about that.",
                "That's pretty interesting, dude!",
                "No worries, I got you covered!",
                "Let's figure this out together!",
                "That's awesome! Here's what I think..."
            ]
        },
        humorous: {
            greeting: "Well, well, well... look who we have here! Your AI assistant, at your service!",
            responses: [
                "That's a good one! Let me add my two cents...",
                "Hold on to your hats, here comes the wisdom!",
                "Let me put on my thinking cap... *adjusts imaginary cap*",
                "In the words of a wise AI: 'Beep boop, here's the scoop!'",
                "Time to drop some knowledge bombs! 💣"
            ]
        }
    };

    // Response templates
    const responseTemplates = {
        greeting: [
            "Hello! How can I help you today?",
            "Hi there! What can I do for you?",
            "Greetings! How may I assist you?",
            "Hey! What's on your mind?",
            "Welcome! How can I be of service?"
        ],
        question: [
            "That's an interesting question. Let me think about it...",
            "I'm glad you asked that. Here's what I know...",
            "Let me help you understand that better...",
            "That's a great question! Here's what I can tell you...",
            "I'd be happy to explain that to you..."
        ],
        statement: [
            "I understand what you're saying.",
            "That's interesting! Tell me more.",
            "I see your point.",
            "That makes sense.",
            "I agree with you on that."
        ],
        farewell: [
            "Goodbye! Have a great day!",
            "See you later! Take care!",
            "Bye for now! Come back soon!",
            "Farewell! It was nice chatting with you!",
            "Until next time! Stay awesome!"
        ]
    };

    // Add message to chat
    function addMessage(message, isUser = false) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${isUser ? 'user' : 'bot'}`;
        messageElement.innerHTML = `
            <div class="message-content">
                <p>${message}</p>
            </div>
        `;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Generate AI response
    function generateResponse(userMessage) {
        const style = chatStyles[chatStyle.value];
        let response;

        // Check for specific patterns in user message
        if (userMessage.toLowerCase().includes('hello') || userMessage.toLowerCase().includes('hi')) {
            response = style.greeting;
        } else if (userMessage.includes('?')) {
            response = getRandomResponse(responseTemplates.question);
        } else if (userMessage.toLowerCase().includes('bye') || userMessage.toLowerCase().includes('goodbye')) {
            response = getRandomResponse(responseTemplates.farewell);
        } else {
            response = getRandomResponse(style.responses);
        }

        return response;
    }

    // Get random response from array
    function getRandomResponse(responses) {
        return responses[Math.floor(Math.random() * responses.length)];
    }

    // Handle user input
    function handleUserInput() {
        const message = userInput.value.trim();
        if (message) {
            // Add user message
            addMessage(message, true);
            userInput.value = '';

            // Simulate typing delay based on response speed
            const delay = responseSpeed.value === 'fast' ? 500 : 
                         responseSpeed.value === 'normal' ? 1000 : 2000;

            // Show typing indicator
            const typingElement = document.createElement('div');
            typingElement.className = 'message bot typing';
            typingElement.innerHTML = `
                <div class="message-content">
                    <p>Typing...</p>
                </div>
            `;
            chatMessages.appendChild(typingElement);
            chatMessages.scrollTop = chatMessages.scrollHeight;

            // Generate and show response after delay
            setTimeout(() => {
                typingElement.remove();
                const response = generateResponse(message);
                addMessage(response);
            }, delay);
        }
    }

    // Clear chat
    function clearChat() {
        chatMessages.innerHTML = `
            <div class="message bot">
                <div class="message-content">
                    <p>${chatStyles[chatStyle.value].greeting}</p>
                </div>
            </div>
        `;
    }

    // Save conversation
    function saveConversation() {
        const messages = Array.from(chatMessages.querySelectorAll('.message')).map(message => {
            const isUser = message.classList.contains('user');
            const content = message.querySelector('p').textContent;
            return {
                type: isUser ? 'user' : 'bot',
                content
            };
        });

        const conversation = {
            date: new Date().toLocaleString(),
            style: chatStyle.value,
            messages
        };

        // Save to localStorage
        const savedConversations = JSON.parse(localStorage.getItem('chatbotConversations') || '[]');
        savedConversations.unshift(conversation);
        if (savedConversations.length > 10) savedConversations.pop();
        localStorage.setItem('chatbotConversations', JSON.stringify(savedConversations));

        alert('Conversation saved successfully!');
    }

    // Get conversation suggestions
    function getSuggestions() {
        const suggestions = [
            "Tell me about yourself",
            "What can you do?",
            "How does AI work?",
            "What's the weather like?",
            "Tell me a joke",
            "What's your favorite book?",
            "How do you learn?",
            "What's the meaning of life?",
            "Can you help me with a problem?",
            "What's your opinion on AI?"
        ];

        const suggestionElement = document.createElement('div');
        suggestionElement.className = 'message bot suggestions';
        suggestionElement.innerHTML = `
            <div class="message-content">
                <p>Here are some things you can ask me:</p>
                <ul class="suggestion-list">
                    ${suggestions.map(suggestion => `
                        <li><button class="btn btn-link suggestion-btn">${suggestion}</button></li>
                    `).join('')}
                </ul>
            </div>
        `;
        chatMessages.appendChild(suggestionElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Add click handlers for suggestion buttons
        suggestionElement.querySelectorAll('.suggestion-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                userInput.value = this.textContent;
                handleUserInput();
                suggestionElement.remove();
            });
        });
    }

    // Event listeners
    sendBtn.addEventListener('click', handleUserInput);
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleUserInput();
        }
    });
    clearBtn.addEventListener('click', clearChat);
    saveBtn.addEventListener('click', saveConversation);
    suggestBtn.addEventListener('click', getSuggestions);
    chatStyle.addEventListener('change', clearChat);

    // Initialize
    clearChat();
}); 