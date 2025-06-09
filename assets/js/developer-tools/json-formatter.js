document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('jsonFormatterForm');
    const resultCard = document.getElementById('resultCard');
    const jsonInput = document.getElementById('jsonInput');
    const formatType = document.getElementById('formatType');
    const indentSize = document.getElementById('indentSize');
    const clearButton = document.getElementById('clearButton');
    const copyButton = document.getElementById('copyButton');
    const copyFormattedButton = document.getElementById('copyFormattedButton');
    const downloadButton = document.getElementById('downloadButton');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const formatResults = document.getElementById('formatResults');
    const validationStatus = document.getElementById('validationStatus');
    const formattedOutput = document.getElementById('formattedOutput');
    const errorDetails = document.getElementById('errorDetails');
    const errorMessage = document.getElementById('errorMessage');

    // State variables
    let currentTheme = 'light';
    let pasteTimeout = null;
    let isTreeView = false;
    let searchIndex = -1;
    let searchMatches = [];
    let ajv = null;

    // Initialize Ajv if available
    try {
        if (typeof Ajv !== 'undefined') {
            ajv = new Ajv({ allErrors: true });
            console.log('Ajv initialized successfully');
        } else {
            console.warn('Ajv not available - schema validation will be disabled');
        }
    } catch (error) {
        console.error('Error initializing Ajv:', error);
    }

    // Check if all required elements exist
    if (!form || !resultCard || !jsonInput || !formatType || !indentSize || !clearButton || 
        !copyButton || !copyFormattedButton || !downloadButton || !loadingSpinner || !formatResults || 
        !validationStatus || !formattedOutput || !errorDetails || !errorMessage) {
        console.error('Required elements not found. Please check the HTML structure.');
        return;
    }

    // Function to format JSON
    function formatJSON(json, type, indent) {
        try {
            // Parse the JSON to validate it
            const parsed = JSON.parse(json);
            
            // Format based on type
            if (type === 'minify') {
                return JSON.stringify(parsed);
            } else {
                return JSON.stringify(parsed, null, parseInt(indent));
            }
        } catch (error) {
            throw error;
        }
    }

    // Function to validate JSON
    function validateJSON(json) {
        try {
            const parsed = JSON.parse(json);
            return {
                isValid: true,
                message: 'Valid JSON',
                data: parsed
            };
        } catch (error) {
            return {
                isValid: false,
                message: error.message,
                position: error.message.match(/position (\d+)/)?.[1]
            };
        }
    }

    // Function to validate against JSON Schema
    function validateSchema(json, schemaType) {
        if (!ajv || schemaType === 'none') {
            return { isValid: true };
        }

        try {
            const parsed = JSON.parse(json);
            const schema = getSchema(schemaType);
            const validate = ajv.compile(schema);
            const valid = validate(parsed);

            return {
                isValid: valid,
                errors: validate.errors || []
            };
        } catch (error) {
            return {
                isValid: false,
                errors: [{ message: error.message }]
            };
        }
    }

    // Function to get JSON Schema
    function getSchema(type) {
        const schemas = {
            'draft-07': {
                $schema: 'http://json-schema.org/draft-07/schema#',
                type: 'object',
                properties: {
                    name: { type: 'string' },
                    age: { type: 'number', minimum: 0 },
                    email: { type: 'string', format: 'email' },
                    address: {
                        type: 'object',
                        properties: {
                            street: { type: 'string' },
                            city: { type: 'string' },
                            country: { type: 'string' }
                        },
                        required: ['street', 'city', 'country']
                    },
                    tags: {
                        type: 'array',
                        items: { type: 'string' }
                    }
                },
                required: ['name', 'age', 'email']
            }
        };
        return schemas[type] || {};
    }

    // Function to create tree view
    function createTreeView(obj, path = '') {
        if (typeof obj !== 'object' || obj === null) {
            return `<span class="json-value">${JSON.stringify(obj)}</span>`;
        }

        const isArray = Array.isArray(obj);
        const items = Object.entries(obj);
        const content = items.map(([key, value], index) => {
            const currentPath = path ? `${path}.${key}` : key;
            const isObject = typeof value === 'object' && value !== null;
            const toggle = isObject ? '<span class="tree-toggle">▶</span>' : '';
            const keyStr = isArray ? `[${key}]` : `"${key}"`;
            const pathDisplay = `<span class="json-path" title="Click to copy path">${currentPath}</span>`;
            const valueType = `<span class="json-type">${isArray ? 'array' : typeof value}</span>`;
            
            return `
                <div class="tree-node">
                    ${toggle}${pathDisplay}${keyStr}: ${valueType}${isObject ? '' : createTreeView(value)}
                    ${isObject ? `<div class="tree-content">${createTreeView(value, currentPath)}</div>` : ''}
                </div>
            `;
        }).join('');

        return isArray ? `[${content}]` : `{${content}}`;
    }

    // Function to display results
    function displayResults(formatted, validation) {
        // Clear previous results
        validationStatus.innerHTML = '';
        formattedOutput.innerHTML = '';
        errorDetails.style.display = 'none';

        // Display validation status
        const statusIcon = validation.isValid ? 
            '<i class="fas fa-check-circle text-success me-2"></i>' : 
            '<i class="fas fa-times-circle text-danger me-2"></i>';
        validationStatus.innerHTML = `${statusIcon}${validation.message}`;

        if (validation.isValid) {
            if (isTreeView) {
                formattedOutput.innerHTML = createTreeView(JSON.parse(formatted));
                formattedOutput.classList.add('tree-view');
            } else {
                formattedOutput.textContent = formatted;
                formattedOutput.classList.remove('tree-view');
                hljs.highlightElement(formattedOutput);
            }
            copyFormattedButton.style.display = 'block';
        } else {
            errorDetails.style.display = 'block';
            errorMessage.textContent = validation.message;
            copyFormattedButton.style.display = 'none';
            
            if (validation.position) {
                highlightError(validation.position);
            }
        }
    }

    // Function to highlight error position
    function highlightError(position) {
        const text = jsonInput.value;
        const lines = text.substring(0, position).split('\n');
        const line = lines.length;
        const column = lines[lines.length - 1].length;
        
        jsonInput.focus();
        jsonInput.setSelectionRange(position - 1, position);

        const errorIndicator = document.createElement('div');
        errorIndicator.className = 'error-indicator';
        errorIndicator.style.top = `${(line - 1) * 20}px`;
        errorIndicator.style.left = `${column * 8}px`;
        errorIndicator.title = `Error at line ${line}, column ${column}`;
        jsonInput.parentElement.appendChild(errorIndicator);

        setTimeout(() => {
            errorIndicator.remove();
        }, 3000);
    }

    // Function to search JSON
    function searchJSON() {
        const searchText = searchInput.value.toLowerCase();
        if (!searchText) {
            searchMatches = [];
            searchIndex = -1;
            searchResults.textContent = '';
            return;
        }

        const text = jsonInput.value;
        searchMatches = [];
        let match;
        const regex = new RegExp(searchText, 'gi');
        while ((match = regex.exec(text)) !== null) {
            searchMatches.push({
                index: match.index,
                length: match[0].length,
                text: match[0]
            });
        }

        if (searchMatches.length > 0) {
            searchIndex = (searchIndex + 1) % searchMatches.length;
            const currentMatch = searchMatches[searchIndex];
            searchResults.textContent = `${searchIndex + 1}/${searchMatches.length}`;
            
            const line = text.substring(0, currentMatch.index).split('\n').length;
            jsonInput.scrollTop = (line - 1) * 20;
            jsonInput.setSelectionRange(currentMatch.index, currentMatch.index + currentMatch.length);
        } else {
            searchResults.textContent = 'No matches';
        }
    }

    // Function to download JSON
    function downloadJSON(json, filename) {
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Function to copy text to clipboard
    function copyToClipboard(text, button) {
        navigator.clipboard.writeText(text)
            .then(() => {
                const originalText = button.innerHTML;
                button.innerHTML = '<i class="fas fa-check me-1"></i>Copied!';
                setTimeout(() => {
                    button.innerHTML = originalText;
                }, 2000);
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
                alert('Failed to copy to clipboard');
            });
    }

    // Function to toggle theme
    function toggleTheme() {
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.body.setAttribute('data-theme', currentTheme);
        localStorage.setItem('jsonFormatterTheme', currentTheme);
    }

    // Function to toggle tree view
    function toggleTreeView() {
        isTreeView = !isTreeView;
        if (formattedOutput.textContent) {
            displayResults(formattedOutput.textContent, { isValid: true, message: 'Valid JSON' });
        }
    }

    // Form submission handler
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const json = jsonInput.value.trim();
        if (!json) {
            alert('Please enter JSON data');
            return;
        }

        loadingSpinner.style.display = 'block';
        formatResults.style.display = 'none';
        resultCard.style.display = 'block';

        try {
            const validation = validateJSON(json);
            
            if (validation.isValid) {
                const formatted = formatJSON(json, formatType.value, indentSize.value);
                loadingSpinner.style.display = 'none';
                formatResults.style.display = 'block';
                displayResults(formatted, validation);
            } else {
                loadingSpinner.style.display = 'none';
                formatResults.style.display = 'block';
                displayResults('', validation);
            }
        } catch (error) {
            loadingSpinner.style.display = 'none';
            formatResults.style.display = 'block';
            displayResults('', {
                isValid: false,
                message: error.message
            });
        }
    });

    // Clear button handler
    clearButton.addEventListener('click', function() {
        form.reset();
        resultCard.style.display = 'none';
    });

    // Copy button handlers
    copyButton.addEventListener('click', function() {
        if (jsonInput.value.trim()) {
            copyToClipboard(jsonInput.value.trim(), this);
        }
    });

    copyFormattedButton.addEventListener('click', function() {
        if (formattedOutput.textContent) {
            copyToClipboard(formattedOutput.textContent, this);
        }
    });

    // Download button handler
    downloadButton.addEventListener('click', function() {
        if (formattedOutput.textContent) {
            const filename = `formatted-${formatType.value}-${new Date().toISOString()}.json`;
            downloadJSON(formattedOutput.textContent, filename);
        }
    });

    // Auto-format on paste
    jsonInput.addEventListener('paste', (e) => {
        clearTimeout(pasteTimeout);
        pasteTimeout = setTimeout(() => {
            const formatted = formatJSON(e.target.value, 'beautify', indentSize.value);
            if (formatted) {
                e.target.value = formatted;
            }
        }, 100);
    });

    // Tree view click handlers
    formattedOutput.addEventListener('click', (e) => {
        if (e.target.classList.contains('tree-toggle')) {
            const content = e.target.nextElementSibling.nextElementSibling;
            content.classList.toggle('expanded');
            e.target.textContent = content.classList.contains('expanded') ? '▼' : '▶';
        } else if (e.target.classList.contains('json-path')) {
            navigator.clipboard.writeText(e.target.textContent)
                .then(() => {
                    const originalText = e.target.textContent;
                    e.target.textContent = 'Copied!';
                    setTimeout(() => {
                        e.target.textContent = originalText;
                    }, 1000);
                })
                .catch(err => {
                    console.error('Failed to copy path: ', err);
                });
        }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey) {
            switch (e.key.toLowerCase()) {
                case 'enter':
                    e.preventDefault();
                    form.dispatchEvent(new Event('submit'));
                    break;
                case 'm':
                    e.preventDefault();
                    formatType.value = 'minify';
                    form.dispatchEvent(new Event('submit'));
                    break;
                case 'b':
                    e.preventDefault();
                    formatType.value = 'beautify';
                    form.dispatchEvent(new Event('submit'));
                    break;
                case 'c':
                    e.preventDefault();
                    if (formattedOutput.textContent) {
                        copyToClipboard(formattedOutput.textContent, copyFormattedButton);
                    }
                    break;
                case 'd':
                    e.preventDefault();
                    toggleTheme();
                    break;
                case 's':
                    e.preventDefault();
                    if (formattedOutput.textContent) {
                        const filename = `formatted-${formatType.value}-${new Date().toISOString()}.json`;
                        downloadJSON(formattedOutput.textContent, filename);
                    }
                    break;
                case 't':
                    e.preventDefault();
                    toggleTreeView();
                    break;
                case 'f':
                    e.preventDefault();
                    searchInput.focus();
                    break;
            }
        }
    });

    // Initialize syntax highlighting
    hljs.configure({
        languages: ['json']
    });

    // Load saved theme
    const savedTheme = localStorage.getItem('jsonFormatterTheme');
    if (savedTheme) {
        currentTheme = savedTheme;
        document.body.setAttribute('data-theme', currentTheme);
    }

    // Add custom styles
    const style = document.createElement('style');
    style.textContent = `
        .error-indicator {
            position: absolute;
            width: 2px;
            height: 20px;
            background-color: #dc3545;
            pointer-events: none;
        }
        .tree-view {
            font-family: monospace;
            white-space: pre;
        }
        .tree-node {
            margin-left: 20px;
        }
        .tree-toggle {
            cursor: pointer;
            margin-right: 5px;
            user-select: none;
        }
        .tree-content {
            display: none;
            margin-left: 20px;
        }
        .tree-content.expanded {
            display: block;
        }
        .json-path {
            cursor: pointer;
            color: #0d6efd;
            margin-right: 5px;
        }
        .json-type {
            color: #6c757d;
            font-size: 0.8em;
            margin-left: 5px;
        }
        .json-value {
            color: #198754;
        }
        .search-highlight {
            background-color: yellow;
            color: black;
        }
        [data-theme="dark"] {
            background-color: #1a1a1a;
            color: #ffffff;
        }
        [data-theme="dark"] .form-control,
        [data-theme="dark"] .form-select {
            background-color: #2d2d2d;
            color: #ffffff;
            border-color: #404040;
        }
        [data-theme="dark"] .card {
            background-color: #2d2d2d;
            border-color: #404040;
        }
        [data-theme="dark"] .btn-outline-secondary {
            color: #ffffff;
            border-color: #404040;
        }
        [data-theme="dark"] .btn-outline-secondary:hover {
            background-color: #404040;
            color: #ffffff;
        }
        [data-theme="dark"] .json-path {
            color: #6ea8fe;
        }
        [data-theme="dark"] .json-type {
            color: #adb5bd;
        }
        [data-theme="dark"] .json-value {
            color: #75b798;
        }
        [data-theme="dark"] .search-highlight {
            background-color: #ffd700;
            color: #000000;
        }
    `;
    document.head.appendChild(style);
}); 