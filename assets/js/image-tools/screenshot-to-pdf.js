document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const captureBtn = document.getElementById('captureBtn');
    const uploadBtn = document.getElementById('uploadBtn');
    const fileInput = document.getElementById('fileInput');
    const screenshotsContainer = document.getElementById('screenshotsContainer');
    const noScreenshots = document.getElementById('noScreenshots');
    const screenshotsList = document.getElementById('screenshotsList');
    const clearAllBtn = document.getElementById('clearAllBtn');
    const generatePdfBtn = document.getElementById('generatePdfBtn');
    const pdfTitle = document.getElementById('pdfTitle');
    const pdfOrientation = document.getElementById('pdfOrientation');

    // State
    let screenshots = [];

    // Helper Functions
    function showToast(message, type = 'success') {
        const toastContainer = document.querySelector('.toast-container');
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
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        `;
        
        toastContainer.appendChild(toast);
        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();
        
        toast.addEventListener('hidden.bs.toast', function() {
            toast.remove();
        });
    }

    function createScreenshotElement(screenshot, index) {
        const div = document.createElement('div');
        div.className = 'position-relative';
        div.style.width = '150px';
        div.style.height = '100px';
        
        const img = document.createElement('img');
        img.className = 'img-thumbnail';
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        img.src = screenshot;
        
        const removeBtn = document.createElement('button');
        removeBtn.className = 'btn btn-sm btn-danger position-absolute top-0 end-0 m-1';
        removeBtn.innerHTML = '<i class="fas fa-times"></i>';
        removeBtn.onclick = () => removeScreenshot(index);
        
        div.appendChild(img);
        div.appendChild(removeBtn);
        return div;
    }

    function removeScreenshot(index) {
        screenshots.splice(index, 1);
        updateScreenshotsList();
    }

    function updateScreenshotsList() {
        screenshotsList.innerHTML = '';
        screenshots.forEach((screenshot, index) => {
            screenshotsList.appendChild(createScreenshotElement(screenshot, index));
        });
        
        if (screenshots.length === 0) {
            noScreenshots.style.display = 'block';
            clearAllBtn.disabled = true;
            generatePdfBtn.disabled = true;
        } else {
            noScreenshots.style.display = 'none';
            clearAllBtn.disabled = false;
            generatePdfBtn.disabled = false;
        }
    }

    async function captureScreenshot() {
        try {
            // Hide the screenshot button temporarily
            captureBtn.style.display = 'none';
            
            // Capture the screenshot
            const canvas = await html2canvas(document.body, {
                logging: false,
                useCORS: true,
                allowTaint: true
            });
            
            // Convert canvas to data URL
            const screenshot = canvas.toDataURL('image/png');
            screenshots.push(screenshot);
            updateScreenshotsList();
            
            showToast('Screenshot captured successfully');
        } catch (error) {
            console.error('Screenshot capture error:', error);
            showToast('Error capturing screenshot: ' + error.message, 'danger');
        } finally {
            captureBtn.style.display = 'block';
        }
    }

    function handleFiles(files) {
        Array.from(files).forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    screenshots.push(e.target.result);
                    updateScreenshotsList();
                };
                reader.readAsDataURL(file);
            }
        });
    }

    async function generatePDF() {
        try {
            generatePdfBtn.disabled = true;
            generatePdfBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Generating...';
            
            // Initialize jsPDF
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF(pdfOrientation.value === 'portrait' ? 'p' : 'l', 'mm', 'a4');
            
            // Set PDF title if provided
            if (pdfTitle.value.trim()) {
                pdf.setDocumentProperties({
                    title: pdfTitle.value.trim()
                });
            }
            
            // Add each screenshot as a new page
            for (let i = 0; i < screenshots.length; i++) {
                if (i > 0) {
                    pdf.addPage();
                }
                
                const img = new Image();
                await new Promise((resolve) => {
                    img.onload = resolve;
                    img.src = screenshots[i];
                });
                
                // Calculate dimensions to fit the page
                const pageWidth = pdf.internal.pageSize.getWidth();
                const pageHeight = pdf.internal.pageSize.getHeight();
                const imgRatio = img.width / img.height;
                
                let imgWidth = pageWidth;
                let imgHeight = pageWidth / imgRatio;
                
                if (imgHeight > pageHeight) {
                    imgHeight = pageHeight;
                    imgWidth = pageHeight * imgRatio;
                }
                
                // Center the image on the page
                const x = (pageWidth - imgWidth) / 2;
                const y = (pageHeight - imgHeight) / 2;
                
                pdf.addImage(screenshots[i], 'PNG', x, y, imgWidth, imgHeight);
            }
            
            // Save the PDF
            pdf.save('screenshots.pdf');
            showToast('PDF generated successfully');
        } catch (error) {
            console.error('PDF generation error:', error);
            showToast('Error generating PDF: ' + error.message, 'danger');
        } finally {
            generatePdfBtn.disabled = false;
            generatePdfBtn.innerHTML = '<i class="fas fa-file-pdf"></i> Generate PDF';
        }
    }

    // Event Listeners
    captureBtn.addEventListener('click', captureScreenshot);
    
    uploadBtn.addEventListener('click', () => fileInput.click());
    
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFiles(e.target.files);
            showToast('Images uploaded successfully');
        }
    });
    
    screenshotsContainer.addEventListener('dragover', (e) => {
        e.preventDefault();
        screenshotsContainer.classList.add('dragover');
    });
    
    screenshotsContainer.addEventListener('dragleave', () => {
        screenshotsContainer.classList.remove('dragover');
    });
    
    screenshotsContainer.addEventListener('drop', (e) => {
        e.preventDefault();
        screenshotsContainer.classList.remove('dragover');
        
        if (e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
            showToast('Images added successfully');
        }
    });
    
    clearAllBtn.addEventListener('click', () => {
        screenshots = [];
        updateScreenshotsList();
        showToast('All images cleared');
    });
    
    generatePdfBtn.addEventListener('click', generatePDF);
}); 