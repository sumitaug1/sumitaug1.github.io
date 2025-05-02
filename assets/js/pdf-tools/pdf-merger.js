document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const pdfDropZone = document.getElementById('pdfDropZone');
    const pdfInput = document.getElementById('pdfInput');
    const selectPdfBtn = document.getElementById('selectPdfBtn');
    const pdfFilesList = document.getElementById('pdfFilesList');
    const mergeBtn = document.getElementById('mergeBtn');
    const clearBtn = document.getElementById('clearBtn');
    const pageOrder = document.getElementById('pageOrder');
    const quality = document.getElementById('quality');

    // State
    let pdfFiles = [];

    // Helper function to show toast message
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast align-items-center text-white bg-${type} border-0`;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'assertive');
        toast.setAttribute('aria-atomic', 'true');
        
        toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        `;
        
        const toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        toastContainer.appendChild(toast);
        document.body.appendChild(toastContainer);
        
        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();
        
        toast.addEventListener('hidden.bs.toast', () => {
            toastContainer.remove();
        });
    }

    // Helper function to format file size
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Helper function to create PDF file item
    function createPdfFileItem(file, index) {
        const item = document.createElement('div');
        item.className = 'list-group-item d-flex justify-content-between align-items-center';
        item.innerHTML = `
            <div>
                <i class="fas fa-file-pdf text-danger me-2"></i>
                <span>${file.name}</span>
                <small class="text-muted ms-2">(${formatFileSize(file.size)})</small>
            </div>
            <div>
                <button class="btn btn-sm btn-outline-danger" data-index="${index}">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        return item;
    }

    // Update PDF files list
    function updatePdfFilesList() {
        pdfFilesList.innerHTML = '';
        if (pdfFiles.length === 0) {
            pdfFilesList.innerHTML = '<div class="list-group-item text-center text-muted">No files selected</div>';
            return;
        }
        
        pdfFiles.forEach((file, index) => {
            const item = createPdfFileItem(file, index);
            pdfFilesList.appendChild(item);
        });

        // Add remove button event listeners
        pdfFilesList.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = parseInt(e.target.closest('button').dataset.index);
                pdfFiles.splice(index, 1);
                updatePdfFilesList();
            });
        });
    }

    // Handle file selection
    function handleFiles(files) {
        const newPdfFiles = Array.from(files).filter(file => {
            // Check if file is a PDF
            return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
        });
        
        if (newPdfFiles.length === 0) {
            showToast('Please select PDF files only', 'warning');
            return;
        }

        pdfFiles.push(...newPdfFiles);
        updatePdfFilesList();
        showToast(`${newPdfFiles.length} PDF file(s) added`, 'success');
    }

    // Drag and drop handlers
    pdfDropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();
        pdfDropZone.classList.add('dragover');
    });

    pdfDropZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        e.stopPropagation();
        pdfDropZone.classList.remove('dragover');
    });

    pdfDropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        pdfDropZone.classList.remove('dragover');
        handleFiles(e.dataTransfer.files);
    });

    // File input handler
    selectPdfBtn.addEventListener('click', () => {
        pdfInput.click();
    });

    pdfInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
        pdfInput.value = ''; // Reset input
    });

    // Merge PDFs
    async function mergePdfs() {
        if (pdfFiles.length === 0) {
            showToast('Please select at least one PDF file', 'warning');
            return;
        }

        try {
            mergeBtn.disabled = true;
            mergeBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Merging...';

            // Create a new PDF document
            const mergedPdf = await PDFLib.PDFDocument.create();

            // Load and copy pages from each PDF
            for (const file of pdfFiles) {
                const arrayBuffer = await file.arrayBuffer();
                const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);
                const pages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
                pages.forEach(page => mergedPdf.addPage(page));
            }

            // Save the merged PDF
            const mergedPdfBytes = await mergedPdf.save();

            // Create download link
            const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'merged.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            showToast('PDFs merged successfully!', 'success');
        } catch (error) {
            console.error('Error merging PDFs:', error);
            showToast('Error merging PDFs. Please try again.', 'danger');
        } finally {
            mergeBtn.disabled = false;
            mergeBtn.innerHTML = '<i class="fas fa-compress-arrows-alt me-2"></i>Merge PDFs';
        }
    }

    // Clear all files
    function clearAll() {
        pdfFiles = [];
        updatePdfFilesList();
        showToast('All files cleared', 'success');
    }

    // Event listeners
    mergeBtn.addEventListener('click', mergePdfs);
    clearBtn.addEventListener('click', clearAll);

    // Initialize empty state
    updatePdfFilesList();
}); 