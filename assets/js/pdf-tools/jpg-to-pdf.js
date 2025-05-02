document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const selectFileBtn = document.getElementById('selectFileBtn');
    const toolControls = document.getElementById('toolControls');
    const previewContainer = document.getElementById('previewContainer');
    const previewGrid = document.getElementById('previewGrid');
    const convertBtn = document.getElementById('convertBtn');
    const qualitySelect = document.getElementById('qualitySelect');
    const pageSizeSelect = document.getElementById('pageSizeSelect');
    const orientationSelect = document.getElementById('orientationSelect');

    // Page size dimensions (in mm)
    const pageSizes = {
        a4: { width: 210, height: 297 },
        letter: { width: 216, height: 279 },
        legal: { width: 216, height: 356 }
    };

    // Store selected images
    let selectedImages = [];

    // Helper Functions
    function showToast(message, type = 'success') {
        const toastContainer = document.getElementById('toastContainer');
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
        
        toast.addEventListener('hidden.bs.toast', () => {
            toast.remove();
        });
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    function createImagePreview(file, index) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const col = document.createElement('div');
            col.className = 'col-md-4 mb-3';
            
            col.innerHTML = `
                <div class="card">
                    <img src="${e.target.result}" class="card-img-top" alt="Preview">
                    <div class="card-body">
                        <h6 class="card-title">${file.name}</h6>
                        <p class="card-text small">
                            Size: ${formatFileSize(file.size)}<br>
                            Dimensions: Loading...
                        </p>
                        <button class="btn btn-danger btn-sm w-100" onclick="removeImage(${index})">
                            <i class="fas fa-trash"></i> Remove
                        </button>
                    </div>
                </div>
            `;
            
            previewGrid.appendChild(col);
            
            // Get image dimensions
            const img = new Image();
            img.onload = function() {
                col.querySelector('.card-text small').innerHTML = `
                    Size: ${formatFileSize(file.size)}<br>
                    Dimensions: ${img.width} × ${img.height}px
                `;
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    function removeImage(index) {
        selectedImages.splice(index, 1);
        previewGrid.innerHTML = '';
        selectedImages.forEach((file, i) => createImagePreview(file, i));
        
        if (selectedImages.length === 0) {
            toolControls.style.display = 'none';
            previewContainer.style.display = 'none';
        }
    }

    // Event Listeners
    selectFileBtn.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });

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
        handleFiles(e.dataTransfer.files);
    });

    convertBtn.addEventListener('click', convertToPDF);

    // Functions
    function handleFiles(files) {
        const validFiles = Array.from(files).filter(file => 
            file.type === 'image/jpeg' || file.type === 'image/jpg'
        );

        if (validFiles.length === 0) {
            showToast('Please select valid JPG images only', 'danger');
            return;
        }

        selectedImages = [...selectedImages, ...validFiles];
        previewGrid.innerHTML = '';
        selectedImages.forEach((file, index) => createImagePreview(file, index));

        toolControls.style.display = 'block';
        previewContainer.style.display = 'block';
        showToast(`${validFiles.length} image(s) added successfully`);
    }

    function convertToPDF() {
        if (selectedImages.length === 0) {
            showToast('Please select at least one image', 'warning');
            return;
        }

        convertBtn.disabled = true;
        convertBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Converting...';

        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            orientation: orientationSelect.value === 'portrait' ? 'portrait' : 'landscape',
            unit: 'mm',
            format: pageSizeSelect.value === 'auto' ? 'a4' : pageSizeSelect.value
        });

        const pageSize = pageSizeSelect.value;
        const orientation = orientationSelect.value;

        // Define vertical padding in millimeters (20mm top and bottom)
        const verticalPadding = 20;

        let currentPage = 0;
        let processedImages = 0;

        function processNextImage() {
            if (processedImages >= selectedImages.length) {
                convertBtn.disabled = false;
                convertBtn.innerHTML = 'Convert to PDF';
                const pdfBlob = pdf.output('blob');
                const url = URL.createObjectURL(pdfBlob);
                
                const a = document.createElement('a');
                a.href = url;
                a.download = 'converted_images.pdf';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                
                showToast('PDF created successfully!');
                return;
            }

            const file = selectedImages[processedImages];
            const reader = new FileReader();

            reader.onload = function(e) {
                const img = new Image();
                img.onload = function() {
                    // Get PDF page dimensions in mm
                    let pageWidth, pageHeight;
                    if (pageSize === 'auto') {
                        // Use A4 dimensions for auto size
                        pageWidth = 210; // A4 width in mm
                        pageHeight = 297; // A4 height in mm
                    } else {
                        const size = pageSizes[pageSize];
                        pageWidth = size.width;
                        pageHeight = size.height;
                    }

                    // Calculate available height after vertical padding
                    const availableHeight = pageHeight - (verticalPadding * 2);

                    // Calculate scaling to fit the available height while maintaining aspect ratio
                    const scale = availableHeight / img.height;
                    const scaledWidth = img.width * scale;
                    const scaledHeight = img.height * scale;

                    // Create a high-resolution canvas for better quality
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    // Set canvas dimensions to match the scaled size
                    canvas.width = scaledWidth;
                    canvas.height = scaledHeight;

                    // Configure high-quality image rendering
                    ctx.imageSmoothingEnabled = true;
                    ctx.imageSmoothingQuality = 'high';
                    ctx.drawImage(img, 0, 0, scaledWidth, scaledHeight);

                    // Convert canvas to blob with maximum quality
                    canvas.toBlob(function(blob) {
                        if (!blob) {
                            showToast('Failed to process image', 'error');
                            return;
                        }

                        // Create a new FileReader to read the blob
                        const blobReader = new FileReader();
                        blobReader.onload = function() {
                            const imageData = blobReader.result;

                            if (currentPage > 0) {
                                pdf.addPage();
                            }

                            // Calculate the position to center the image vertically with equal padding
                            const x = 0; // Start from left edge
                            const y = verticalPadding; // Fixed top padding

                            // Add the image to PDF with maximum quality settings
                            pdf.addImage(
                                imageData,
                                'PNG', // Use PNG format to maintain original quality
                                x,
                                y,
                                scaledWidth,
                                scaledHeight,
                                '',
                                'NONE' // Use NONE for maximum quality
                            );

                            currentPage++;
                            processedImages++;
                            processNextImage();
                        };
                        blobReader.readAsDataURL(blob);
                    }, 'image/png', 1.0); // Use PNG format with maximum quality
                };
                img.src = e.target.result;
            };

            reader.readAsDataURL(file);
        }

        processNextImage();
    }

    // Make removeImage function available globally
    window.removeImage = removeImage;
}); 