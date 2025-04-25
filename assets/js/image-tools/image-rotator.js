document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const fileInput = document.getElementById('fileInput');
    const dropZone = document.getElementById('dropZone');
    const previewImage = document.getElementById('previewImage');
    const previewPlaceholder = document.getElementById('previewPlaceholder');
    const previewContainer = document.getElementById('previewContainer');
    const resultImage = document.getElementById('resultImage');
    const rotateLeftBtn = document.getElementById('rotateLeft');
    const rotateRightBtn = document.getElementById('rotateRight');
    const rotationSlider = document.getElementById('rotationSlider');
    const rotationValue = document.getElementById('rotationValue');
    const flipHorizontalBtn = document.getElementById('flipHorizontal');
    const flipVerticalBtn = document.getElementById('flipVertical');
    const formatSelect = document.getElementById('format');
    const resetBtn = document.getElementById('resetBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const toastContainer = document.getElementById('toastContainer');
    const originalSize = document.getElementById('originalSize');
    const processedSize = document.getElementById('processedSize');
    const dimensions = document.getElementById('dimensions');

    // Variables
    let originalImage = null;
    let originalFile = null;
    let originalFileSize = 0;
    let currentRotation = 0;
    let isFlippedHorizontal = false;
    let isFlippedVertical = false;

    // Handle file selection
    function handleFileSelect(file) {
        if (!file.type.startsWith('image/')) {
            showToast('Please select an image file', 'error');
            return;
        }

        originalFile = file;
        originalFileSize = file.size;
        originalSize.textContent = formatFileSize(originalFileSize);

        const reader = new FileReader();
        reader.onload = function(e) {
            originalImage = new Image();
            originalImage.onload = function() {
                // Update preview
                previewImage.src = e.target.result;
                previewImage.style.display = 'block';
                previewPlaceholder.style.display = 'none';

                // Initialize result image
                resultImage.src = e.target.result;
                dimensions.textContent = `${this.width}×${this.height}px`;

                // Show preview container
                previewContainer.style.display = 'block';

                // Enable controls
                resetBtn.disabled = false;
                downloadBtn.disabled = false;

                // Reset transformations
                resetTransformations();
            };
            originalImage.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    // Reset all transformations
    function resetTransformations() {
        currentRotation = 0;
        isFlippedHorizontal = false;
        isFlippedVertical = false;
        rotationSlider.value = 0;
        rotationValue.textContent = '0°';
        applyTransformations();
    }

    // Apply all transformations
    function applyTransformations() {
        if (!originalImage) return;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Set canvas size to accommodate rotation
        const angle = currentRotation * Math.PI / 180;
        const sin = Math.abs(Math.sin(angle));
        const cos = Math.abs(Math.cos(angle));
        canvas.width = originalImage.width * cos + originalImage.height * sin;
        canvas.height = originalImage.width * sin + originalImage.height * cos;

        // Center the image
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(angle);

        // Apply flips
        ctx.scale(
            isFlippedHorizontal ? -1 : 1,
            isFlippedVertical ? -1 : 1
        );

        // Draw the image
        ctx.drawImage(
            originalImage,
            -originalImage.width / 2,
            -originalImage.height / 2,
            originalImage.width,
            originalImage.height
        );

        // Update result image
        resultImage.src = canvas.toDataURL();
        dimensions.textContent = `${canvas.width}×${canvas.height}px`;

        // Update processed size
        canvas.toBlob(function(blob) {
            if (blob) {
                processedSize.textContent = formatFileSize(blob.size);
            }
        });
    }

    // Handle rotation buttons
    rotateLeftBtn.addEventListener('click', function() {
        currentRotation = (currentRotation - 90) % 360;
        rotationSlider.value = currentRotation;
        rotationValue.textContent = `${currentRotation}°`;
        applyTransformations();
    });

    rotateRightBtn.addEventListener('click', function() {
        currentRotation = (currentRotation + 90) % 360;
        rotationSlider.value = currentRotation;
        rotationValue.textContent = `${currentRotation}°`;
        applyTransformations();
    });

    // Handle rotation slider
    rotationSlider.addEventListener('input', function() {
        currentRotation = parseInt(this.value);
        rotationValue.textContent = `${currentRotation}°`;
        applyTransformations();
    });

    // Handle flip buttons
    flipHorizontalBtn.addEventListener('click', function() {
        isFlippedHorizontal = !isFlippedHorizontal;
        applyTransformations();
    });

    flipVerticalBtn.addEventListener('click', function() {
        isFlippedVertical = !isFlippedVertical;
        applyTransformations();
    });

    // Handle reset button
    resetBtn.addEventListener('click', resetTransformations);

    // Handle download button
    downloadBtn.addEventListener('click', function() {
        if (!resultImage.src) return;

        const link = document.createElement('a');
        const format = formatSelect.value === 'original' ? 
            originalFile.type.split('/')[1] : 
            formatSelect.value;
        
        link.download = `rotated-image.${format}`;
        link.href = resultImage.src;
        link.click();
    });

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

    // Helper function to format file size
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Show toast notification
    function showToast(message, type = 'info') {
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

        toast.addEventListener('hidden.bs.toast', () => {
            toast.remove();
        });
    }
}); 