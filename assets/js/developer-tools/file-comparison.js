// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const file1Input = document.getElementById('file1');
    const file2Input = document.getElementById('file2');
    const file1Name = document.getElementById('file1Name');
    const file2Name = document.getElementById('file2Name');
    const compareBtn = document.getElementById('compareBtn');
    const clearBtn = document.getElementById('clearBtn');
    const toggleThemeBtn = document.getElementById('toggleThemeBtn');
    const comparisonContainer = document.getElementById('comparisonContainer');
    const file1Content = document.getElementById('file1Content');
    const file2Content = document.getElementById('file2Content');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const keyboardShortcuts = document.querySelector('.keyboard-shortcuts');
    const searchInput = document.getElementById('searchInput');
    const clearSearch = document.getElementById('clearSearch');
    const prevMatch = document.getElementById('prevMatch');
    const nextMatch = document.getElementById('nextMatch');
    const wordWrapToggle = document.getElementById('wordWrapToggle');
    const syncScrollToggle = document.getElementById('syncScrollToggle');
    const diffStats = document.getElementById('diffStats');
    const addedCount = document.getElementById('addedCount');
    const removedCount = document.getElementById('removedCount');

    // State variables
    let currentTheme = localStorage.getItem('theme') || 'light';
    let file1Data = null;
    let file2Data = null;
    let searchMatches = [];
    let currentMatchIndex = -1;
    let isWordWrapEnabled = localStorage.getItem('wordWrap') === 'true';
    let isSyncScrollEnabled = localStorage.getItem('syncScroll') !== 'false';

    // Initialize theme and settings
    document.body.setAttribute('data-theme', currentTheme);
    wordWrapToggle.checked = isWordWrapEnabled;
    syncScrollToggle.checked = isSyncScrollEnabled;
    updateWordWrap();

    // Event Listeners
    file1Input.addEventListener('change', handleFileSelect);
    file2Input.addEventListener('change', handleFileSelect);
    compareBtn.addEventListener('click', compareFiles);
    clearBtn.addEventListener('click', clearFiles);
    toggleThemeBtn.addEventListener('click', toggleTheme);
    searchInput.addEventListener('input', handleSearch);
    clearSearch.addEventListener('click', clearSearchInput);
    prevMatch.addEventListener('click', () => navigateSearch(-1));
    nextMatch.addEventListener('click', () => navigateSearch(1));
    wordWrapToggle.addEventListener('change', toggleWordWrap);
    syncScrollToggle.addEventListener('change', toggleSyncScroll);

    // Handle file selection
    function handleFileSelect(event) {
        const file = event.target.files[0];
        if (!file) return;

        const fileNameElement = event.target.id === 'file1' ? file1Name : file2Name;
        fileNameElement.textContent = file.name;

        const reader = new FileReader();
        reader.onload = function(e) {
            if (event.target.id === 'file1') {
                file1Data = e.target.result;
            } else {
                file2Data = e.target.result;
            }
            updateCompareButton();
        };
        reader.readAsText(file);
    }

    // Update compare button state
    function updateCompareButton() {
        compareBtn.disabled = !(file1Data && file2Data);
    }

    // Compare files
    async function compareFiles() {
        if (!file1Data || !file2Data) {
            alert('Please select both files to compare');
            return;
        }

        try {
            const spinner = document.getElementById('loadingSpinner');
            const container = document.querySelector('.comparison-container');
            const file1Content = document.getElementById('file1Content');
            const file2Content = document.getElementById('file2Content');
            const diffStats = document.getElementById('diffStats');

            if (spinner) spinner.style.display = 'block';
            if (container) container.style.display = 'block';
            if (file1Content) file1Content.innerHTML = '';
            if (file2Content) file2Content.innerHTML = '';
            if (diffStats) diffStats.style.display = 'none';

            const diff = Diff.createTwoFilesPatch(
                'file1',
                'file2',
                file1Data,
                file2Data,
                undefined,
                undefined,
                { context: 3 }
            );

            const diffLines = diff.split('\n');
            let lineNumber1 = 1;
            let lineNumber2 = 1;
            let addedLines = 0;
            let removedLines = 0;
            let changedLines = 0;

            let file1Html = '';
            let file2Html = '';

            for (let i = 0; i < diffLines.length; i++) {
                const line = diffLines[i];
                
                if (line.startsWith('@@')) {
                    // Skip the diff header
                    continue;
                } else if (line.startsWith('+') && !line.startsWith('+++')) {
                    file2Html += `<div class="diff-added">${lineNumber2}: ${escapeHtml(line.substring(1))}</div>`;
                    lineNumber2++;
                    addedLines++;
                } else if (line.startsWith('-') && !line.startsWith('---')) {
                    file1Html += `<div class="diff-removed">${lineNumber1}: ${escapeHtml(line.substring(1))}</div>`;
                    lineNumber1++;
                    removedLines++;
                } else if (line.startsWith(' ')) {
                    const content = line.substring(1);
                    file1Html += `<div>${lineNumber1}: ${escapeHtml(content)}</div>`;
                    file2Html += `<div>${lineNumber2}: ${escapeHtml(content)}</div>`;
                    lineNumber1++;
                    lineNumber2++;
                }
            }

            if (file1Content) file1Content.innerHTML = file1Html;
            if (file2Content) file2Content.innerHTML = file2Html;

            if (diffStats) {
                diffStats.innerHTML = `
                    <div class="row">
                        <div class="col">
                            <strong>Added:</strong> ${addedLines} lines
                        </div>
                        <div class="col">
                            <strong>Removed:</strong> ${removedLines} lines
                        </div>
                        <div class="col">
                            <strong>Changed:</strong> ${changedLines} lines
                        </div>
                    </div>
                `;
                diffStats.style.display = 'block';
            }

            if (spinner) spinner.style.display = 'none';
        } catch (error) {
            console.error('Error comparing files:', error);
            alert('Error comparing files. Please try again.');
            const spinner = document.getElementById('loadingSpinner');
            if (spinner) spinner.style.display = 'none';
        }
    }

    // Clear files
    function clearFiles() {
        file1Input.value = '';
        file2Input.value = '';
        file1Name.textContent = 'No file selected';
        file2Name.textContent = 'No file selected';
        file1Data = null;
        file2Data = null;
        comparisonContainer.style.display = 'none';
        diffStats.style.display = 'none';
        clearSearchInput();
        updateCompareButton();
    }

    // Toggle theme
    function toggleTheme() {
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.body.setAttribute('data-theme', currentTheme);
        localStorage.setItem('theme', currentTheme);
    }

    // Handle search
    function handleSearch() {
        const searchText = searchInput.value.toLowerCase();
        if (!searchText) {
            clearSearchInput();
            return;
        }

        // Clear previous highlights
        document.querySelectorAll('.search-highlight').forEach(el => {
            const parent = el.parentNode;
            parent.replaceChild(document.createTextNode(el.textContent), el);
            parent.normalize();
        });

        // Find matches
        searchMatches = [];
        const content1 = file1Content.querySelector('pre code');
        const content2 = file2Content.querySelector('pre code');

        [content1, content2].forEach((content, fileIndex) => {
            const text = content.textContent;
            let match;
            const regex = new RegExp(escapeRegExp(searchText), 'gi');
            
            while ((match = regex.exec(text)) !== null) {
                searchMatches.push({
                    fileIndex,
                    start: match.index,
                    end: match.index + match[0].length
                });
            }
        });

        // Highlight matches
        searchMatches.forEach(match => {
            const content = match.fileIndex === 0 ? content1 : content2;
            const text = content.textContent;
            const before = text.substring(0, match.start);
            const highlight = text.substring(match.start, match.end);
            const after = text.substring(match.end);
            
            content.innerHTML = escapeHtml(before) +
                `<span class="search-highlight">${escapeHtml(highlight)}</span>` +
                escapeHtml(after);
        });

        // Navigate to first match
        if (searchMatches.length > 0) {
            currentMatchIndex = 0;
            navigateToMatch(currentMatchIndex);
        }
    }

    // Navigate search
    function navigateSearch(direction) {
        if (searchMatches.length === 0) return;
        
        currentMatchIndex = (currentMatchIndex + direction + searchMatches.length) % searchMatches.length;
        navigateToMatch(currentMatchIndex);
    }

    // Navigate to match
    function navigateToMatch(index) {
        const match = searchMatches[index];
        const content = match.fileIndex === 0 ? file1Content : file2Content;
        const element = content.querySelector('.search-highlight');
        
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.style.backgroundColor = '#ffeb3b';
            setTimeout(() => {
                element.style.backgroundColor = '#ffd700';
            }, 1000);
        }
    }

    // Clear search
    function clearSearchInput() {
        searchInput.value = '';
        document.querySelectorAll('.search-highlight').forEach(el => {
            const parent = el.parentNode;
            parent.replaceChild(document.createTextNode(el.textContent), el);
            parent.normalize();
        });
        searchMatches = [];
        currentMatchIndex = -1;
    }

    // Toggle word wrap
    function toggleWordWrap() {
        isWordWrapEnabled = wordWrapToggle.checked;
        localStorage.setItem('wordWrap', isWordWrapEnabled);
        updateWordWrap();
    }

    // Update word wrap
    function updateWordWrap() {
        const style = isWordWrapEnabled ? 'pre-wrap' : 'pre';
        document.querySelectorAll('.file-content pre').forEach(pre => {
            pre.style.whiteSpace = style;
        });
    }

    // Toggle sync scroll
    function toggleSyncScroll() {
        isSyncScrollEnabled = syncScrollToggle.checked;
        localStorage.setItem('syncScroll', isSyncScrollEnabled);
        if (isSyncScrollEnabled) {
            setupSyncScroll();
        } else {
            removeSyncScroll();
        }
    }

    // Setup sync scroll
    function setupSyncScroll() {
        const content1 = file1Content.querySelector('pre');
        const content2 = file2Content.querySelector('pre');
        
        content1.addEventListener('scroll', () => {
            if (isSyncScrollEnabled) {
                content2.scrollTop = content1.scrollTop;
                content2.scrollLeft = content1.scrollLeft;
            }
        });
        
        content2.addEventListener('scroll', () => {
            if (isSyncScrollEnabled) {
                content1.scrollTop = content2.scrollTop;
                content1.scrollLeft = content2.scrollLeft;
            }
        });
    }

    // Remove sync scroll
    function removeSyncScroll() {
        const content1 = file1Content.querySelector('pre');
        const content2 = file2Content.querySelector('pre');
        
        content1.removeEventListener('scroll', () => {});
        content2.removeEventListener('scroll', () => {});
    }

    // Helper function to escape HTML
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Helper function to escape RegExp
    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey) {
            switch(e.key.toLowerCase()) {
                case 'd':
                    e.preventDefault();
                    toggleTheme();
                    break;
                case 'c':
                    e.preventDefault();
                    clearFiles();
                    break;
                case 'f':
                    e.preventDefault();
                    searchInput.focus();
                    break;
                case 'w':
                    e.preventDefault();
                    wordWrapToggle.checked = !wordWrapToggle.checked;
                    toggleWordWrap();
                    break;
                case 's':
                    e.preventDefault();
                    syncScrollToggle.checked = !syncScrollToggle.checked;
                    toggleSyncScroll();
                    break;
            }
        } else if (e.key === 'F3') {
            e.preventDefault();
            if (e.shiftKey) {
                navigateSearch(-1);
            } else {
                navigateSearch(1);
            }
        }
    });

    // Show keyboard shortcuts on Ctrl + K
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            keyboardShortcuts.style.display = 'block';
            setTimeout(() => {
                keyboardShortcuts.style.display = 'none';
            }, 3000);
        }
    });
});
