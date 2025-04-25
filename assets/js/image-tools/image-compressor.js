document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const fileInput = document.getElementById('fileInput');
    const dropZone = document.getElementById('dropZone');
    const previewImage = document.getElementById('previewImage');
    const previewPlaceholder = document.getElementById('previewPlaceholder');
    const qualitySlider = document.getElementById('qualitySlider');
    const qualityValue = document.getElementById('qualityValue');
    const maxWidth = document.getElementById('maxWidth');
    const maxHeight = document.getElementById('maxHeight');
    const formatSelect = document.getElementById('formatSelect');
    const compressBtn = document.getElementById('compressBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const toastContainer = document.getElementById('toastContainer');
    const originalSize = document.getElementById('originalSize');
    const originalDimensions = document.getElementById('originalDimensions');
    const compressedSize = document.getElementById('compressedSize');
    const compressedDimensions = document.getElementById('compressedDimensions');

    // Variables
    let originalImage = null;
    let compressedImage = null;
    let originalFileSize = 0;
    let originalWidth = 0;
    let originalHeight = 0;

    // Update quality value display
    qualitySlider.addEventListener('input', function() {
        qualityValue.textContent = this.value + '%';
    });

    // Handle file selection
    function handleFileSelect(file) {
        if (!file.type.startsWith('image/')) {
            showToast('Please select an image file', 'error');
            return;
        }

        originalFileSize = file.size;
        originalSize.textContent = formatFileSize(originalFileSize);

        const reader = new FileReader();
        reader.onload = function(e) {
            originalImage = new Image();
            originalImage.onload = function() {
                originalWidth = this.width;
                originalHeight = this.height;
                originalDimensions.textContent = `${originalWidth}×${originalHeight}px`;

                // Update preview
                previewImage.src = e.target.result;
                previewImage.style.display = 'block';
                previewPlaceholder.style.display = 'none';

                // Enable compress button
                compressBtn.disabled = false;
                downloadBtn.disabled = true;

                // Reset compressed info
                compressedSize.textContent = '-';
                compressedDimensions.textContent = '-';
            };
            originalImage.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    // Handle drag and drop
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
        if (file) handleFileSelect(file);
    });

    // Handle file input
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) handleFileSelect(file);
    });

    // Helper function to update compressed image display
    function updateCompressedImage(compressedData, compressedFileSize, width, height) {
        // Update preview
        previewImage.src = compressedData;
        compressedDimensions.textContent = `${width}×${height}px`;

        // Calculate compressed size
        compressedSize.textContent = formatFileSize(compressedFileSize);

        // Enable download button
        downloadBtn.disabled = false;

        // Calculate and show compression details
        const compressionRatio = ((originalFileSize - compressedFileSize) / originalFileSize * 100).toFixed(2);
        const sizeReduction = formatFileSize(originalFileSize - compressedFileSize);
        const quality = qualitySlider.value;
        const format = formatSelect.value;

        // Create detailed message
        const message = `
            Compression successful!<br>
            Quality: ${quality}%<br>
            Format: ${format.toUpperCase()}<br>
            Original Size: ${formatFileSize(originalFileSize)}<br>
            Compressed Size: ${formatFileSize(compressedFileSize)}<br>
            Size Reduction: ${sizeReduction} (${compressionRatio}%)
        `;

        showToast(message, 'success');
    }

    // Handle compression button click
    compressBtn.addEventListener('click', function() {
        if (!originalImage) {
            showToast('Please select an image first', 'error');
            return;
        }

        const quality = parseInt(qualitySlider.value);
        if (isNaN(quality) || quality < 0 || quality > 100) {
            showToast('Please select a valid quality value', 'error');
            return;
        }

        // Get target dimensions from inputs (optional)
        const targetWidth = maxWidth.value ? parseInt(maxWidth.value) : originalWidth;
        const targetHeight = maxHeight.value ? parseInt(maxHeight.value) : originalHeight;

        // Validate dimensions if provided
        if (maxWidth.value && (isNaN(targetWidth) || targetWidth <= 0)) {
            showToast('Please enter a valid Max Width', 'error');
            return;
        }

        if (maxHeight.value && (isNaN(targetHeight) || targetHeight <= 0)) {
            showToast('Please enter a valid Max Height', 'error');
            return;
        }

        // Calculate dimensions while maintaining aspect ratio
        let newWidth = targetWidth;
        let newHeight = targetHeight;

        const widthRatio = targetWidth / originalWidth;
        const heightRatio = targetHeight / originalHeight;
        const ratio = Math.min(widthRatio, heightRatio);
        newWidth = Math.round(originalWidth * ratio);
        newHeight = Math.round(originalHeight * ratio);

        try {
            // Create canvas and compress image
            const canvas = document.createElement('canvas');
            canvas.width = newWidth;
            canvas.height = newHeight;

            const ctx = canvas.getContext('2d');
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(originalImage, 0, 0, newWidth, newHeight);

            // Set mime type and quality based on format
            let mimeType;
            let qualitySetting = Math.max(0.1, Math.min(1, quality / 100));
            
            switch(formatSelect.value) {
                case 'png':
                    mimeType = 'image/png';
                    qualitySetting = Math.max(0.1, qualitySetting * 0.5);
                    break;
                case 'webp':
                    mimeType = 'image/webp';
                    qualitySetting = Math.max(0.1, qualitySetting * 0.4);
                    break;
                default:
                    mimeType = 'image/jpeg';
                    qualitySetting = Math.max(0.1, qualitySetting * 0.3);
            }

            // Convert to blob with the specified quality
            canvas.toBlob(function(blob) {
                if (!blob) {
                    showToast('Failed to compress image', 'error');
                    return;
                }

                const compressedData = URL.createObjectURL(blob);
                compressedImage = new Image();
                compressedImage.onload = function() {
                    updateCompressedImage(compressedData, blob.size, newWidth, newHeight);
                };
                compressedImage.src = compressedData;
            }, mimeType, qualitySetting);

        } catch (error) {
            console.error('Compression error:', error);
            showToast('Failed to compress image', 'error');
        }
    });

    // Handle dimension changes
    maxWidth.addEventListener('change', function() {
        // Only update the display, don't compress
        if (originalImage) {
            const targetWidth = maxWidth.value ? parseInt(maxWidth.value) : originalWidth;
            const targetHeight = maxHeight.value ? parseInt(maxHeight.value) : originalHeight;
            
            // Calculate dimensions while maintaining aspect ratio
            const widthRatio = targetWidth / originalWidth;
            const heightRatio = targetHeight / originalHeight;
            const ratio = Math.min(widthRatio, heightRatio);
            const newWidth = Math.round(originalWidth * ratio);
            const newHeight = Math.round(originalHeight * ratio);
            
            // Update preview dimensions
            previewImage.style.width = `${newWidth}px`;
            previewImage.style.height = `${newHeight}px`;
        }
    });

    maxHeight.addEventListener('change', function() {
        // Only update the display, don't compress
        if (originalImage) {
            const targetWidth = maxWidth.value ? parseInt(maxWidth.value) : originalWidth;
            const targetHeight = maxHeight.value ? parseInt(maxHeight.value) : originalHeight;
            
            // Calculate dimensions while maintaining aspect ratio
            const widthRatio = targetWidth / originalWidth;
            const heightRatio = targetHeight / originalHeight;
            const ratio = Math.min(widthRatio, heightRatio);
            const newWidth = Math.round(originalWidth * ratio);
            const newHeight = Math.round(originalHeight * ratio);
            
            // Update preview dimensions
            previewImage.style.width = `${newWidth}px`;
            previewImage.style.height = `${newHeight}px`;
        }
    });

    // Handle format change
    formatSelect.addEventListener('change', function() {
        // Only update the display, don't compress
        if (originalImage) {
            // Update format display if needed
        }
    });

    // Handle download
    downloadBtn.addEventListener('click', function() {
        if (!compressedImage) return;

        const format = formatSelect.value === 'auto' ? getImageFormat(originalImage.src) : formatSelect.value;
        const link = document.createElement('a');
        link.download = `compressed-image.${format}`;
        link.href = compressedImage.src;
        link.click();
    });

    // Helper function to format file size
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Helper function to get image format from data URL
    function getImageFormat(dataUrl) {
        const mimeType = dataUrl.split(',')[0].split(':')[1].split(';')[0];
        return mimeType.split('/')[1];
    }

    // Show toast notification
    function showToast(message, type = 'info') {
        // Remove any existing toasts
        while (toastContainer.firstChild) {
            toastContainer.removeChild(toastContainer.firstChild);
        }

        const toast = document.createElement('div');
        toast.className = `toast align-items-center text-white bg-${type} border-0`;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'assertive');
        toast.setAttribute('aria-atomic', 'true');
        toast.style.minWidth = '300px';
        toast.style.maxWidth = '100%';
        toast.style.margin = '10px';

        toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body" style="padding: 15px;">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        `;

        toastContainer.appendChild(toast);
        const bsToast = new bootstrap.Toast(toast, {
            autohide: true,
            delay: 5000
        });
        bsToast.show();

        // Remove toast after it's hidden
        toast.addEventListener('hidden.bs.toast', () => {
            toast.remove();
        });
    }
}); 