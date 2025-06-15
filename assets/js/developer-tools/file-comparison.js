document.addEventListener('DOMContentLoaded', () => {
    // Cache DOM elements
    const file1Input = document.getElementById('file1');
    const file2Input = document.getElementById('file2');
    const compareBtn = document.getElementById('compareBtn');
    const clearBtn = document.getElementById('clearBtn');
    const exportBtn = document.getElementById('exportBtn');
    const helpBtn = document.getElementById('helpBtn');
    const file1Content = document.getElementById('file1Content');
    const file2Content = document.getElementById('file2Content');
    const diffStats = document.getElementById('diffStats');
    const searchInput = document.getElementById('searchInput');
    const prevMatchBtn = document.getElementById('prevMatch');
    const nextMatchBtn = document.getElementById('nextMatch');
    const wordWrapToggle = document.getElementById('wordWrapToggle');
    const syncScrollToggle = document.getElementById('syncScrollToggle');
    const highlightToggle = document.getElementById('highlightToggle');
    const themeToggle = document.getElementById('themeToggle');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const keyboardShortcuts = document.getElementById('keyboardShortcuts');
    const dropZone1 = document.getElementById('dropZone1');
    const dropZone2 = document.getElementById('dropZone2');
    const file1Info = document.getElementById('file1Info');
    const file2Info = document.getElementById('file2Info');

    // Initialize theme
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', currentTheme);
    themeToggle.innerHTML = currentTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';

    // Initialize tooltips
    const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltips.forEach(tooltip => new bootstrap.Tooltip(tooltip));

    // Debounce function for search
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Throttle function for scroll events
    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // File handling functions
    function handleFileSelect(file, fileInfo, dropZone) {
        if (file) {
            const fileSize = (file.size / 1024).toFixed(2);
            const fileType = file.name.split('.').pop().toUpperCase();
            fileInfo.innerHTML = `
                <span class="badge bg-primary">${fileType}</span>
                <span class="text-muted">${file.name} (${fileSize} KB)</span>
            `;
            dropZone.classList.add('border-success');
        }
    }

    function handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.add('dragover');
    }

    function handleDragLeave(e) {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.remove('dragover');
    }

    function handleDrop(e, input) {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.remove('dragover');
        
        const file = e.dataTransfer.files[0];
        if (file) {
            input.files = e.dataTransfer.files;
            handleFileSelect(file, input.id === 'file1' ? file1Info : file2Info, e.currentTarget);
        }
    }

    // Set up drag and drop
    [dropZone1, dropZone2].forEach((zone, index) => {
        const input = index === 0 ? file1Input : file2Input;
        const fileInfo = index === 0 ? file1Info : file2Info;

        zone.addEventListener('dragover', handleDragOver);
        zone.addEventListener('dragleave', handleDragLeave);
        zone.addEventListener('drop', (e) => handleDrop(e, input));
        zone.addEventListener('click', () => input.click());

        input.addEventListener('change', (e) => {
            handleFileSelect(e.target.files[0], fileInfo, zone);
        });
    });

    // Compare button click handler
    compareBtn.addEventListener('click', async () => {
        if (!file1Input.files[0] || !file2Input.files[0]) {
            alert('Please select both files to compare');
            return;
        }

        loadingOverlay.style.display = 'flex';
        try {
            const [text1, text2] = await Promise.all([
                file1Input.files[0].text(),
                file2Input.files[0].text()
            ]);

            const lines1 = text1.split('\n');
            const lines2 = text2.split('\n');

            // Clear previous content
            file1Content.innerHTML = '';
            file2Content.innerHTML = '';

            // Find differences using a more sophisticated algorithm
            const differences = findDifferences(lines1, lines2);
            let added = 0;
            let removed = 0;
            let unchanged = 0;
            let modified = 0;

            // Group differences into chunks
            const chunks = groupDifferencesIntoChunks(differences);

            // Display differences
            chunks.forEach(chunk => {
                // Add chunk content
                chunk.differences.forEach(diff => {
                    const line1 = createLineElement(diff, 'left');
                    const line2 = createLineElement(diff, 'right');
                    file1Content.appendChild(line1);
                    file2Content.appendChild(line2);

                    switch (diff.type) {
                        case 'unchanged':
                            unchanged++;
                            break;
                        case 'added':
                            added++;
                            break;
                        case 'removed':
                            removed++;
                            break;
                        case 'modified':
                            modified++;
                            break;
                    }
                });
            });

            // Update statistics with more detailed information
            const total = Math.max(lines1.length, lines2.length);
            const similarity = total > 0 ? Math.round((unchanged / total) * 100) : 100;

            diffStats.innerHTML = `
                <div class="diff-stats">
                    <div class="diff-stat">
                        <div class="diff-stat-value">${added}</div>
                        <div class="diff-stat-label">Added</div>
                        <div class="progress">
                            <div class="progress-bar bg-success" style="width: ${(added / total) * 100}%"></div>
                        </div>
                    </div>
                    <div class="diff-stat">
                        <div class="diff-stat-value">${removed}</div>
                        <div class="diff-stat-label">Removed</div>
                        <div class="progress">
                            <div class="progress-bar bg-danger" style="width: ${(removed / total) * 100}%"></div>
                        </div>
                    </div>
                    <div class="diff-stat">
                        <div class="diff-stat-value">${modified}</div>
                        <div class="diff-stat-label">Modified</div>
                        <div class="progress">
                            <div class="progress-bar bg-warning" style="width: ${(modified / total) * 100}%"></div>
                        </div>
                    </div>
                    <div class="diff-stat">
                        <div class="diff-stat-value">${unchanged}</div>
                        <div class="diff-stat-label">Unchanged</div>
                        <div class="progress">
                            <div class="progress-bar bg-info" style="width: ${(unchanged / total) * 100}%"></div>
                        </div>
                    </div>
                    <div class="diff-stat">
                        <div class="diff-stat-value">${similarity}%</div>
                        <div class="diff-stat-label">Similarity</div>
                        <div class="progress">
                            <div class="progress-bar bg-primary" style="width: ${similarity}%"></div>
                        </div>
                    </div>
                </div>
            `;

            // Apply syntax highlighting if enabled
            if (highlightToggle.checked) {
                applySyntaxHighlighting();
            }

            exportBtn.disabled = false;
            file1Content.scrollTop = 0;
            file2Content.scrollTop = 0;

        } catch (error) {
            console.error('Error comparing files:', error);
            alert('Error comparing files. Please try again.');
        } finally {
            loadingOverlay.style.display = 'none';
        }
    });

    // Create line element with actions
    function createLineElement(diff, side) {
        const line = document.createElement('div');
        line.className = `line ${diff.type === 'unchanged' ? '' : `line-${diff.type}`}`;
        
        const lineNumber = document.createElement('span');
        lineNumber.className = 'line-number';
        lineNumber.textContent = side === 'left' ? diff.line1Index + 1 : diff.line2Index + 1;
        
        const content = document.createElement('span');
        content.className = 'line-content';
        content.textContent = side === 'left' ? diff.line1Content : diff.line2Content;
        
        const actions = document.createElement('div');
        actions.className = 'line-actions';
        actions.innerHTML = `
            <button class="copy-line" title="Copy line">
                <i class="fas fa-copy"></i>
            </button>
            <button class="copy-chunk" title="Copy chunk">
                <i class="fas fa-copy"></i>
            </button>
        `;
        
        line.appendChild(lineNumber);
        line.appendChild(content);
        line.appendChild(actions);
        
        return line;
    }

    // Group differences into chunks
    function groupDifferencesIntoChunks(differences) {
        const chunks = [];
        let currentChunk = null;
        const chunkSize = 3; // Number of unchanged lines to start a new chunk

        differences.forEach((diff, index) => {
            if (!currentChunk || (diff.type === 'unchanged' && 
                index > 0 && differences[index - 1].type === 'unchanged' && 
                index > 1 && differences[index - 2].type === 'unchanged')) {
                currentChunk = {
                    startLine1: diff.line1Index,
                    startLine2: diff.line2Index,
                    differences: []
                };
                chunks.push(currentChunk);
            }
            
            currentChunk.differences.push(diff);
            currentChunk.endLine1 = diff.line1Index;
            currentChunk.endLine2 = diff.line2Index;
        });

        return chunks;
    }

    // Apply syntax highlighting
    function applySyntaxHighlighting() {
        const fileType = file1Input.files[0].name.split('.').pop().toLowerCase();
        const language = getLanguageFromExtension(fileType);
        
        if (language) {
            document.querySelectorAll('.line-content').forEach(element => {
                element.innerHTML = hljs.highlight(element.textContent, { language }).value;
            });
        }
    }

    // Get language from file extension
    function getLanguageFromExtension(extension) {
        const languageMap = {
            'js': 'javascript',
            'py': 'python',
            'java': 'java',
            'cpp': 'cpp',
            'c': 'c',
            'cs': 'csharp',
            'php': 'php',
            'rb': 'ruby',
            'go': 'go',
            'rs': 'rust',
            'swift': 'swift',
            'kt': 'kotlin',
            'ts': 'typescript',
            'html': 'html',
            'css': 'css',
            'scss': 'scss',
            'json': 'json',
            'xml': 'xml',
            'md': 'markdown',
            'sql': 'sql'
        };
        return languageMap[extension] || null;
    }

    // Improved diff algorithm
    function findDifferences(lines1, lines2) {
        const result = [];
        let i = 0, j = 0;
        
        while (i < lines1.length || j < lines2.length) {
            if (i >= lines1.length) {
                // Remaining lines in file2 are additions
                result.push({ 
                    type: 'added', 
                    line1Content: '', 
                    line2Content: lines2[j],
                    line1Index: i, 
                    line2Index: j 
                });
                j++;
            } else if (j >= lines2.length) {
                // Remaining lines in file1 are removals
                result.push({ 
                    type: 'removed', 
                    line1Content: lines1[i], 
                    line2Content: '',
                    line1Index: i, 
                    line2Index: j 
                });
                i++;
            } else if (lines1[i] === lines2[j]) {
                // Lines are identical
                result.push({ 
                    type: 'unchanged', 
                    line1Content: lines1[i], 
                    line2Content: lines2[j],
                    line1Index: i, 
                    line2Index: j 
                });
                i++;
                j++;
            } else {
                // Lines are different, look ahead to determine if it's an addition, removal, or modification
                const lookAhead = 3; // Number of lines to look ahead
                let foundMatch = false;
                
                // Check for additions
                for (let k = 1; k <= lookAhead && j + k < lines2.length; k++) {
                    if (lines1[i] === lines2[j + k]) {
                        // Add the lines in between as additions
                        for (let l = 0; l < k; l++) {
                            result.push({ 
                                type: 'added', 
                                line1Content: '', 
                                line2Content: lines2[j + l],
                                line1Index: i, 
                                line2Index: j + l 
                            });
                        }
                        j += k;
                        foundMatch = true;
                        break;
                    }
                }
                
                // Check for removals
                if (!foundMatch) {
                    for (let k = 1; k <= lookAhead && i + k < lines1.length; k++) {
                        if (lines1[i + k] === lines2[j]) {
                            // Add the lines in between as removals
                            for (let l = 0; l < k; l++) {
                                result.push({ 
                                    type: 'removed', 
                                    line1Content: lines1[i + l], 
                                    line2Content: '',
                                    line1Index: i + l, 
                                    line2Index: j 
                                });
                            }
                            i += k;
                            foundMatch = true;
                            break;
                        }
                    }
                }
                
                // If no match found, it's a modification
                if (!foundMatch) {
                    result.push({ 
                        type: 'modified', 
                        line1Content: lines1[i], 
                        line2Content: lines2[j],
                        line1Index: i, 
                        line2Index: j 
                    });
                    i++;
                    j++;
                }
            }
        }
        
        return result;
    }

    // Search functionality
    let currentMatchIndex = -1;
    let matches = [];

    const searchFiles = debounce(() => {
        const searchText = searchInput.value.toLowerCase();
        if (!searchText) {
            clearSearch();
            return;
        }

        matches = [];
        const lines1 = file1Content.querySelectorAll('.line');
        const lines2 = file2Content.querySelectorAll('.line');

        lines1.forEach((line, index) => {
            if (line.textContent.toLowerCase().includes(searchText)) {
                matches.push({ element: line, side: 'left', index });
            }
        });

        lines2.forEach((line, index) => {
            if (line.textContent.toLowerCase().includes(searchText)) {
                matches.push({ element: line, side: 'right', index });
            }
        });

        if (matches.length > 0) {
            currentMatchIndex = 0;
            highlightMatch();
        } else {
            clearSearch();
        }
    }, 300);

    function highlightMatch() {
        clearSearch();
        if (matches.length === 0) return;

        const match = matches[currentMatchIndex];
        match.element.classList.add('bg-warning');
        match.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function clearSearch() {
        document.querySelectorAll('.bg-warning').forEach(el => el.classList.remove('bg-warning'));
        currentMatchIndex = -1;
    }

    searchInput.addEventListener('input', searchFiles);
    prevMatchBtn.addEventListener('click', () => {
        if (matches.length === 0) return;
        currentMatchIndex = (currentMatchIndex - 1 + matches.length) % matches.length;
        highlightMatch();
    });
    nextMatchBtn.addEventListener('click', () => {
        if (matches.length === 0) return;
        currentMatchIndex = (currentMatchIndex + 1) % matches.length;
        highlightMatch();
    });

    // Toggle event listeners
    wordWrapToggle.addEventListener('change', () => {
        const style = wordWrapToggle.checked ? 'pre-wrap' : 'pre';
        file1Content.style.whiteSpace = style;
        file2Content.style.whiteSpace = style;
    });

    syncScrollToggle.addEventListener('change', () => {
        if (syncScrollToggle.checked) {
            file1Content.addEventListener('scroll', syncScroll);
            file2Content.addEventListener('scroll', syncScroll);
        } else {
            file1Content.removeEventListener('scroll', syncScroll);
            file2Content.removeEventListener('scroll', syncScroll);
        }
    });

    highlightToggle.addEventListener('change', () => {
        if (highlightToggle.checked) {
            applySyntaxHighlighting();
        } else {
            document.querySelectorAll('.line-content').forEach(element => {
                element.innerHTML = element.textContent;
            });
        }
    });

    const syncScroll = throttle((e) => {
        const source = e.target;
        const target = source === file1Content ? file2Content : file1Content;
        target.scrollTop = source.scrollTop;
    }, 50);

    // Theme toggle
    themeToggle.addEventListener('click', () => {
        const newTheme = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.body.setAttribute('data-theme', newTheme);
        themeToggle.innerHTML = newTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        localStorage.setItem('theme', newTheme);
    });

    // Help dialog
    helpBtn.addEventListener('click', () => {
        keyboardShortcuts.classList.toggle('show');
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey) {
            switch (e.key.toLowerCase()) {
                case 'f':
                    e.preventDefault();
                    searchInput.focus();
                    break;
                case 'arrowup':
                    e.preventDefault();
                    prevMatchBtn.click();
                    break;
                case 'arrowdown':
                    e.preventDefault();
                    nextMatchBtn.click();
                    break;
                case 'd':
                    e.preventDefault();
                    themeToggle.click();
                    break;
                case 'w':
                    e.preventDefault();
                    wordWrapToggle.click();
                    break;
                case 's':
                    e.preventDefault();
                    syncScrollToggle.click();
                    break;
                case 'h':
                    e.preventDefault();
                    helpBtn.click();
                    break;
            }
        }
    });

    // Clear button
    clearBtn.addEventListener('click', () => {
        file1Input.value = '';
        file2Input.value = '';
        file1Content.innerHTML = '';
        file2Content.innerHTML = '';
        diffStats.innerHTML = '';
        exportBtn.disabled = true;
        file1Info.innerHTML = '';
        file2Info.innerHTML = '';
        dropZone1.classList.remove('border-success');
        dropZone2.classList.remove('border-success');
        clearSearch();
    });

    // Export functionality
    exportBtn.addEventListener('click', () => {
        const content = `File Comparison Results\n\n` +
            `File 1: ${file1Input.files[0].name}\n` +
            `File 2: ${file2Input.files[0].name}\n\n` +
            diffStats.textContent;

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'comparison-results.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    // Copy functionality
    document.addEventListener('click', (e) => {
        if (e.target.closest('.copy-line')) {
            const line = e.target.closest('.line');
            const content = line.querySelector('.line-content').textContent;
            navigator.clipboard.writeText(content);
        } else if (e.target.closest('.copy-chunk')) {
            const chunk = e.target.closest('.diff-chunk');
            const content = Array.from(chunk.querySelectorAll('.line-content'))
                .map(el => el.textContent)
                .join('\n');
            navigator.clipboard.writeText(content);
        }
    });

    // Close keyboard shortcuts when clicking outside
    document.addEventListener('click', (e) => {
        if (!keyboardShortcuts.contains(e.target) && e.target !== helpBtn) {
            keyboardShortcuts.classList.remove('show');
        }
    });
}); 
