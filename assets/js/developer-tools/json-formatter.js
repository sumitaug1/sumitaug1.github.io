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
    const schemaType = document.getElementById('schemaType');
    const customSchemaContainer = document.getElementById('customSchemaContainer');
    const customSchema = document.getElementById('customSchema');
    const themeToggle = document.getElementById('themeToggle');
    const searchButton = document.getElementById('searchButton');
    const statsButton = document.getElementById('statsButton');
    const jsonStats = document.getElementById('jsonStats');
    const totalKeys = document.getElementById('totalKeys');
    const arrayItems = document.getElementById('arrayItems');
    const nestedObjects = document.getElementById('nestedObjects');
    const fileSize = document.getElementById('fileSize');
    const downloadFormattedButton = document.getElementById('downloadFormattedButton');

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
        !validationStatus || !formattedOutput || !errorDetails || !errorMessage || !schemaType || 
        !customSchemaContainer || !customSchema || !themeToggle || !searchButton || !statsButton || 
        !jsonStats || !totalKeys || !arrayItems || !nestedObjects || !fileSize || !downloadFormattedButton) {
        console.error('Required elements not found. Please check the HTML structure.');
        return;
    }

    // Function to get text content from contenteditable div
    function getInputText(element) {
        return element.innerText || element.textContent;
    }

    // Function to set text content in contenteditable div
    function setInputText(element, text) {
        element.innerText = text;
    }

    // Function to format JSON
    function formatJSON(json, type, indent) {
        showLoading();
        
        try {
            const parsed = JSON.parse(json);
            let formatted;
            
            switch (type) {
                case 'beautify':
                    formatted = JSON.stringify(parsed, null, indent);
                    break;
                case 'minify':
                    formatted = JSON.stringify(parsed);
                    break;
                case 'tree':
                    formatted = createTreeView(parsed);
                    break;
                default:
                    formatted = JSON.stringify(parsed, null, indent);
            }
            
            // Display the formatted output
            formattedOutput.textContent = formatted;
            
            // Apply syntax highlighting
            hljs.highlightElement(formattedOutput);
            
            // Show the result card
            document.getElementById('resultCard').style.display = 'block';
            showSuccess();
            
            // Add tree view hover effects if in tree view mode
            if (type === 'tree') {
                addTreeViewHoverEffects();
            }
            
            return formatted;
        } catch (error) {
            showError();
            scrollToError();
            throw error;
        } finally {
            hideLoading();
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
    function searchJSON(term) {
        try {
            const json = JSON.parse(jsonInput.value);
            searchMatches = [];
            searchIndex = -1;

            function searchInObject(obj, path = '') {
                if (Array.isArray(obj)) {
                    obj.forEach((item, index) => {
                        const currentPath = path ? `${path}[${index}]` : `[${index}]`;
                        if (typeof item === 'object' && item !== null) {
                            searchInObject(item, currentPath);
                        } else if (String(item).toLowerCase().includes(term.toLowerCase())) {
                            searchMatches.push({ path: currentPath, value: item });
                        }
                    });
                } else if (typeof obj === 'object' && obj !== null) {
                    Object.entries(obj).forEach(([key, value]) => {
                        const currentPath = path ? `${path}.${key}` : key;
                        if (typeof value === 'object' && value !== null) {
                            searchInObject(value, currentPath);
                        } else if (String(value).toLowerCase().includes(term.toLowerCase())) {
                            searchMatches.push({ path: currentPath, value: value });
                        }
                    });
                }
            }

            searchInObject(json);
            
            if (searchMatches.length > 0) {
                searchIndex = 0;
                highlightSearchResult();
                alert(`Found ${searchMatches.length} matches. Use F3 to navigate through results.`);
            } else {
                alert('No matches found.');
            }
        } catch (error) {
            console.error('Error searching JSON:', error);
        }
    }

    // Function to highlight search results
    function highlightSearchResult() {
        if (searchMatches.length === 0) return;
        
        const match = searchMatches[searchIndex];
        const formatted = formattedOutput.textContent;
        const lines = formatted.split('\n');
        
        // Find the line containing the match
        const lineIndex = lines.findIndex(line => 
            line.includes(match.path) || line.includes(JSON.stringify(match.value))
        );
        
        if (lineIndex !== -1) {
            formattedOutput.scrollTop = lineIndex * 20; // Approximate line height
            // Highlight the line
            const line = lines[lineIndex];
            lines[lineIndex] = `<span class="search-highlight">${line}</span>`;
            formattedOutput.innerHTML = lines.join('\n');
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
                button.classList.add('btn-success');
                button.classList.remove('btn-outline-primary');
                setTimeout(() => {
                    button.innerHTML = originalText;
                    button.classList.remove('btn-success');
                    button.classList.add('btn-outline-primary');
                }, 2000);
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
                alert('Failed to copy to clipboard');
            });
    }

    // Function to toggle theme
    function toggleTheme() {
        const body = document.body;
        body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        body.classList.toggle('dark-theme');
        
        // Update theme icon
        const themeIcon = document.querySelector('#themeToggle i');
        if (body.classList.contains('dark-theme')) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    }

    // Function to toggle tree view
    function toggleTreeView() {
        isTreeView = !isTreeView;
        if (formattedOutput.textContent) {
            displayResults(formattedOutput.textContent, { isValid: true, message: 'Valid JSON' });
        }
    }

    // Function to calculate JSON statistics
    function calculateStats(json) {
        try {
            const parsed = JSON.parse(json);
            let stats = {
                totalKeys: 0,
                arrayItems: 0,
                nestedObjects: 0,
                fileSize: 0
            };

            function traverse(obj, depth = 0) {
                if (Array.isArray(obj)) {
                    stats.arrayItems += obj.length;
                    obj.forEach(item => traverse(item, depth + 1));
                } else if (obj && typeof obj === 'object') {
                    stats.nestedObjects++;
                    Object.keys(obj).forEach(key => {
                        stats.totalKeys++;
                        traverse(obj[key], depth + 1);
                    });
                }
            }

            traverse(parsed);
            stats.fileSize = new Blob([json]).size;
            return stats;
        } catch (error) {
            return null;
        }
    }

    // Function to format file size
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Function to show JSON statistics
    function showStats() {
        const jsonInput = document.getElementById('jsonInput');
        const inputValue = getInputText(jsonInput).trim();
        const stats = calculateStats(inputValue);
        const statsContainer = document.getElementById('jsonStats');

        if (stats) {
            document.getElementById('totalKeys').textContent = stats.totalKeys;
            document.getElementById('arrayItems').textContent = stats.arrayItems;
            document.getElementById('nestedObjects').textContent = stats.nestedObjects;
            document.getElementById('fileSize').textContent = formatFileSize(stats.fileSize);
            statsContainer.style.display = 'block';
        } else {
            // Show error if JSON is invalid
            const errorDetails = document.getElementById('errorDetails');
            const errorMessage = document.getElementById('errorMessage');
            errorDetails.style.display = 'block';
            errorMessage.textContent = 'Invalid JSON: Cannot calculate statistics';
            statsContainer.style.display = 'none';
        }
    }

    // Update the form submission handler
    document.getElementById('jsonFormatterForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const jsonInput = document.getElementById('jsonInput');
        const inputValue = getInputText(jsonInput).trim();
        const formatType = document.getElementById('formatType').value;
        const indentSize = parseInt(document.getElementById('indentSize').value);
        
        try {
            formatJSON(inputValue, formatType, indentSize);
            
            // Hide error details if previously shown
            document.getElementById('errorDetails').style.display = 'none';
            
            // Show validation status
            const validationStatus = document.getElementById('validationStatus');
            validationStatus.innerHTML = '<div class="alert alert-success"><i class="fas fa-check-circle me-2"></i>Valid JSON</div>';
            
            // Show stats
            showStats();
            
        } catch (error) {
            // Show error details
            const errorDetails = document.getElementById('errorDetails');
            const errorMessage = document.getElementById('errorMessage');
            errorDetails.style.display = 'block';
            errorMessage.textContent = error.message;
            
            // Update validation status
            const validationStatus = document.getElementById('validationStatus');
            validationStatus.innerHTML = '<div class="alert alert-danger"><i class="fas fa-times-circle me-2"></i>Invalid JSON</div>';
            
            // Hide stats
            document.getElementById('jsonStats').style.display = 'none';
        }
    });

    // Add input event listener
    document.getElementById('jsonInput').addEventListener('input', function(e) {
        // Get the current text content
        let text = getInputText(this);
        
        // Remove any numbers at the start of lines
        text = text.split('\n').map(line => {
            return line.replace(/^\d+/, '');
        }).join('\n');
        
        // Update the content if it changed
        if (text !== getInputText(this)) {
            setInputText(this, text);
        }
    });

    // Add paste event listener
    document.getElementById('jsonInput').addEventListener('paste', function(e) {
        e.preventDefault();
        const pastedText = (e.clipboardData || window.clipboardData).getData('text');
        const cleanedText = pastedText.split('\n').map(line => {
            return line.replace(/^\d+/, '');
        }).join('\n');
        document.execCommand('insertText', false, cleanedText);
    });

    // Clear button handler
    document.getElementById('clearButton').addEventListener('click', function() {
        const jsonInput = document.getElementById('jsonInput');
        setInputText(jsonInput, '');
        document.getElementById('resultCard').style.display = 'none';
        document.getElementById('errorDetails').style.display = 'none';
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
        document.body.classList.toggle('dark-theme', currentTheme === 'dark');
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

    // Add event listeners for new features
    schemaType.addEventListener('change', function() {
        customSchemaContainer.style.display = this.value === 'custom' ? 'block' : 'none';
    });

    themeToggle.addEventListener('click', function() {
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.body.classList.toggle('dark-theme');
        this.innerHTML = currentTheme === 'light' ? 
            '<i class="fas fa-moon"></i> Toggle Theme' : 
            '<i class="fas fa-sun"></i> Toggle Theme';
    });

    searchButton.addEventListener('click', function() {
        const searchTerm = prompt('Enter search term:');
        if (searchTerm) {
            searchJSON(searchTerm);
        }
    });

    statsButton.addEventListener('click', function() {
        showStats();
    });

    downloadFormattedButton.addEventListener('click', function() {
        const formatted = formattedOutput.textContent;
        if (formatted) {
            downloadJSON(formatted, 'formatted.json');
        }
    });

    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl, {
            trigger: 'hover focus'
        });
    });

    // Add loading animation
    function showLoading() {
        const spinner = document.getElementById('loadingSpinner');
        const results = document.getElementById('formatResults');
        spinner.style.display = 'block';
        results.style.opacity = '0.5';
        results.style.pointerEvents = 'none';
    }

    function hideLoading() {
        const spinner = document.getElementById('loadingSpinner');
        const results = document.getElementById('formatResults');
        spinner.style.display = 'none';
        results.style.opacity = '1';
        results.style.pointerEvents = 'auto';
    }

    // Add success animation
    function showSuccess() {
        const resultCard = document.getElementById('resultCard');
        resultCard.style.display = 'block';
        resultCard.style.opacity = '0';
        resultCard.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            resultCard.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            resultCard.style.opacity = '1';
            resultCard.style.transform = 'translateY(0)';
        }, 100);
    }

    // Add copy feedback
    function showCopyFeedback() {
        const button = document.getElementById('copyButton');
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check me-1"></i> Copied!';
        button.classList.add('btn-success');
        button.classList.remove('btn-outline-primary');
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.classList.remove('btn-success');
            button.classList.add('btn-outline-primary');
        }, 2000);
    }

    // Add error animation
    function showError() {
        const errorDetails = document.getElementById('errorDetails');
        errorDetails.style.display = 'block';
        errorDetails.style.opacity = '0';
        errorDetails.style.transform = 'translateY(-10px)';
        
        setTimeout(() => {
            errorDetails.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            errorDetails.style.opacity = '1';
            errorDetails.style.transform = 'translateY(0)';
        }, 100);
    }

    // Add hover effects for tree view
    function addTreeViewHoverEffects() {
        const treeNodes = document.querySelectorAll('.tree-node');
        treeNodes.forEach(node => {
            node.addEventListener('mouseenter', () => {
                node.style.backgroundColor = 'rgba(13, 110, 253, 0.05)';
            });
            node.addEventListener('mouseleave', () => {
                node.style.backgroundColor = '';
            });
        });
    }

    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // F3 for search
        if (e.key === 'F3') {
            e.preventDefault();
            document.getElementById('searchButton').click();
        }
        
        // Ctrl/Cmd + Enter to format
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            document.getElementById('jsonFormatterForm').dispatchEvent(new Event('submit'));
        }
        
        // Ctrl/Cmd + S to save
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            document.getElementById('downloadButton').click();
        }
    });

    // Add auto-resize for textareas
    function autoResizeTextarea(textarea) {
        // Only resize if the textarea is not empty
        if (textarea.value.trim()) {
            textarea.style.height = 'auto';
            textarea.style.height = textarea.scrollHeight + 'px';
        } else {
            // Reset to default height if empty
            textarea.style.height = 'auto';
        }
    }

    let isProcessingInput = false;
    document.getElementById('jsonInput').addEventListener('input', function(e) {
        if (isProcessingInput) return;
        
        isProcessingInput = true;
        const cleanedValue = getInputText(this).trim();
        if (cleanedValue !== getInputText(this)) {
            setInputText(this, cleanedValue);
        }
        autoResizeTextarea(this);
        isProcessingInput = false;
    });

    document.getElementById('customSchema').addEventListener('input', function() {
        autoResizeTextarea(this);
    });

    // Add smooth scrolling for error messages
    function scrollToError() {
        const errorDetails = document.getElementById('errorDetails');
        if (errorDetails.style.display !== 'none') {
            errorDetails.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    // Add theme transition
    function toggleTheme() {
        const body = document.body;
        body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        body.classList.toggle('dark-theme');
        
        // Update theme icon
        const themeIcon = document.querySelector('#themeToggle i');
        if (body.classList.contains('dark-theme')) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    }

    // Add search highlight animation
    function highlightSearchResult(element) {
        element.classList.add('search-highlight');
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        setTimeout(() => {
            element.classList.remove('search-highlight');
        }, 2000);
    }

    // Update the search function to use the new highlight animation
    function searchJSON() {
        // ... existing searchJSON code ...
        if (currentResult) {
            highlightSearchResult(currentResult);
        }
    }

    // Add file drop support
    function setupFileDrop() {
        const dropZone = document.getElementById('jsonInput');
        
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('border-primary');
        });
        
        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('border-primary');
        });
        
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('border-primary');
            
            const file = e.dataTransfer.files[0];
            if (file && file.type === 'application/json') {
                const reader = new FileReader();
                reader.onload = (e) => {
                    dropZone.value = e.target.result;
                    autoResizeTextarea(dropZone);
                };
                reader.readAsText(file);
            }
        });
    }

    // Initialize all UI enhancements
    document.addEventListener('DOMContentLoaded', function() {
        setupFileDrop();
        autoResizeTextarea(document.getElementById('jsonInput'));
        autoResizeTextarea(document.getElementById('customSchema'));
    });
}); 
