document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const bookTitle = document.getElementById('bookTitle');
    const authorName = document.getElementById('authorName');
    const bookDescription = document.getElementById('bookDescription');
    const coverImage = document.getElementById('coverImage');
    const chaptersList = document.getElementById('chaptersList');
    const addChapterBtn = document.getElementById('addChapterBtn');
    const format = document.getElementById('format');
    const font = document.getElementById('font');
    const generateBtn = document.getElementById('generateBtn');
    const previewCard = document.getElementById('previewCard');
    const previewContent = document.getElementById('previewContent');
    const downloadBtn = document.getElementById('downloadBtn');
    const editBtn = document.getElementById('editBtn');

    // Chapter counter
    let chapterCount = 0;

    // Add chapter
    function addChapter() {
        chapterCount++;
        const chapterElement = document.createElement('div');
        chapterElement.className = 'chapter-item mb-3';
        chapterElement.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h6 class="mb-0">Chapter ${chapterCount}</h6>
                        <button type="button" class="btn btn-sm btn-outline-danger remove-chapter">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Chapter Title</label>
                        <input type="text" class="form-control chapter-title" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Chapter Content</label>
                        <textarea class="form-control chapter-content" rows="5" required></textarea>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Chapter Image (Optional)</label>
                        <input type="file" class="form-control chapter-image" accept="image/*">
                    </div>
                </div>
            </div>
        `;
        chaptersList.appendChild(chapterElement);

        // Add event listener for remove button
        const removeBtn = chapterElement.querySelector('.remove-chapter');
        removeBtn.addEventListener('click', function() {
            chapterElement.remove();
            updateChapterNumbers();
        });
    }

    // Update chapter numbers
    function updateChapterNumbers() {
        const chapters = chaptersList.querySelectorAll('.chapter-item');
        chapters.forEach((chapter, index) => {
            const title = chapter.querySelector('h6');
            title.textContent = `Chapter ${index + 1}`;
        });
        chapterCount = chapters.length;
    }

    // Generate e-book
    function generateEbook() {
        // Validate form
        if (!bookTitle.value || !authorName.value) {
            alert('Please fill in all required fields');
            return;
        }

        // Get all chapters
        const chapters = [];
        chaptersList.querySelectorAll('.chapter-item').forEach(chapter => {
            const title = chapter.querySelector('.chapter-title').value;
            const content = chapter.querySelector('.chapter-content').value;
            const image = chapter.querySelector('.chapter-image').files[0];

            if (title && content) {
                chapters.push({
                    title,
                    content,
                    image
                });
            }
        });

        if (chapters.length === 0) {
            alert('Please add at least one chapter');
            return;
        }

        // Create preview
        const preview = `
            <div class="ebook-preview">
                <h3 class="text-center mb-4">${bookTitle.value}</h3>
                <p class="text-center mb-4">by ${authorName.value}</p>
                ${bookDescription.value ? `<p class="mb-4">${bookDescription.value}</p>` : ''}
                <div class="chapters-preview">
                    ${chapters.map(chapter => `
                        <div class="chapter-preview mb-4">
                            <h4>${chapter.title}</h4>
                            <p>${chapter.content}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        previewContent.innerHTML = preview;
        previewCard.style.display = 'block';
    }

    // Download e-book
    function downloadEbook() {
        // Create e-book content
        const ebookContent = {
            title: bookTitle.value,
            author: authorName.value,
            description: bookDescription.value,
            format: format.value,
            font: font.value,
            chapters: []
        };

        // Add chapters
        chaptersList.querySelectorAll('.chapter-item').forEach(chapter => {
            const title = chapter.querySelector('.chapter-title').value;
            const content = chapter.querySelector('.chapter-content').value;
            const image = chapter.querySelector('.chapter-image').files[0];

            if (title && content) {
                ebookContent.chapters.push({
                    title,
                    content,
                    image
                });
            }
        });

        // Convert to appropriate format
        let fileContent;
        let fileType;
        let fileName;

        switch (format.value) {
            case 'epub':
                fileContent = generateEPUB(ebookContent);
                fileType = 'application/epub+zip';
                fileName = `${bookTitle.value}.epub`;
                break;
            case 'mobi':
                fileContent = generateMOBI(ebookContent);
                fileType = 'application/x-mobipocket-ebook';
                fileName = `${bookTitle.value}.mobi`;
                break;
            case 'pdf':
                fileContent = generatePDF(ebookContent);
                fileType = 'application/pdf';
                fileName = `${bookTitle.value}.pdf`;
                break;
        }

        // Create download link
        const blob = new Blob([fileContent], { type: fileType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Generate EPUB format
    function generateEPUB(content) {
        // This is a placeholder for actual EPUB generation
        // In a real implementation, you would use a library like epub.js
        return `EPUB content for ${content.title}`;
    }

    // Generate MOBI format
    function generateMOBI(content) {
        // This is a placeholder for actual MOBI generation
        // In a real implementation, you would use a library like calibre
        return `MOBI content for ${content.title}`;
    }

    // Generate PDF format
    function generatePDF(content) {
        // This is a placeholder for actual PDF generation
        // In a real implementation, you would use a library like jsPDF
        return `PDF content for ${content.title}`;
    }

    // Event listeners
    addChapterBtn.addEventListener('click', addChapter);
    generateBtn.addEventListener('click', generateEbook);
    downloadBtn.addEventListener('click', downloadEbook);
    editBtn.addEventListener('click', function() {
        previewCard.style.display = 'none';
    });

    // Initialize
    addChapter();
}); 