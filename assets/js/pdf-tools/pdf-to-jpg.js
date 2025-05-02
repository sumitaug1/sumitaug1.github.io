document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const selectFileBtn = document.getElementById('selectFileBtn');
    const toolControls = document.getElementById('toolControls');
    const previewContainer = document.getElementById('previewContainer');
    const previewGrid = document.getElementById('previewGrid');
    const qualitySelect = document.getElementById('qualitySelect');
    const startPage = document.getElementById('startPage');
    const endPage = document.getElementById('endPage');
    const convertBtn = document.getElementById('convertBtn');
    const toastContainer = document.getElementById('toastContainer');

    // Variables
    let pdfDoc = null;
    let totalPages = 0;

    // Initialize PDF.js worker
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.worker.min.js';

    // Helper Functions
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        toastContainer.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    function handleFile(file) {
        if (file.type !== 'application/pdf') {
            showToast('Please select a PDF file', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            const typedarray = new Uint8Array(e.target.result);
            
            pdfjsLib.getDocument(typedarray).promise.then(function(pdf) {
                pdfDoc = pdf;
                totalPages = pdf.numPages;
                
                // Update page range inputs
                startPage.max = totalPages;
                endPage.max = totalPages;
                endPage.value = totalPages;
                
                // Show controls
                toolControls.style.display = 'block';
                showToast('PDF loaded successfully', 'success');
            }).catch(function(error) {
                showToast('Error loading PDF: ' + error.message, 'error');
            });
        };
        reader.readAsArrayBuffer(file);
    }

    function renderPage(pageNumber) {
        return pdfDoc.getPage(pageNumber).then(function(page) {
            const viewport = page.getViewport({ scale: 2.0 });
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            return page.render({
                canvasContext: context,
                viewport: viewport
            }).promise.then(function() {
                return canvas.toDataURL('image/jpeg', qualitySelect.value / 3);
            });
        });
    }

    function convertToJPG() {
        const start = parseInt(startPage.value);
        const end = parseInt(endPage.value);
        
        if (start > end || start < 1 || end > totalPages) {
            showToast('Invalid page range', 'error');
            return;
        }

        convertBtn.disabled = true;
        convertBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Converting...';

        const promises = [];
        for (let i = start; i <= end; i++) {
            promises.push(renderPage(i));
        }

        Promise.all(promises).then(function(images) {
            previewContainer.style.display = 'block';
            previewGrid.innerHTML = '';
            
            images.forEach((imageData, index) => {
                const col = document.createElement('div');
                col.className = 'col-md-4 mb-3';
                
                const card = document.createElement('div');
                card.className = 'card';
                
                const img = document.createElement('img');
                img.className = 'card-img-top';
                img.src = imageData;
                
                const cardBody = document.createElement('div');
                cardBody.className = 'card-body';
                
                const downloadBtn = document.createElement('a');
                downloadBtn.className = 'btn btn-primary w-100';
                downloadBtn.href = imageData;
                downloadBtn.download = `page_${start + index}.jpg`;
                downloadBtn.textContent = 'Download';
                
                cardBody.appendChild(downloadBtn);
                card.appendChild(img);
                card.appendChild(cardBody);
                col.appendChild(card);
                previewGrid.appendChild(col);
            });
            
            convertBtn.disabled = false;
            convertBtn.textContent = 'Convert to JPG';
            showToast('Conversion completed', 'success');
        }).catch(function(error) {
            showToast('Error converting PDF: ' + error.message, 'error');
            convertBtn.disabled = false;
            convertBtn.textContent = 'Convert to JPG';
        });
    }

    // Event Listeners
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    });

    selectFileBtn.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) handleFile(file);
    });

    convertBtn.addEventListener('click', convertToJPG);
}); 