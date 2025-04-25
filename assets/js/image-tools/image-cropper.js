document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const fileInput = document.getElementById('fileInput');
    const dropZone = document.getElementById('dropZone');
    const previewImage = document.getElementById('previewImage');
    const previewPlaceholder = document.getElementById('previewPlaceholder');
    const cropperContainer = document.getElementById('cropperContainer');
    const cropperImage = document.getElementById('cropperImage');
    const resultContainer = document.getElementById('resultContainer');
    const resultImage = document.getElementById('resultImage');
    const aspectRatio = document.getElementById('aspectRatio');
    const widthInput = document.getElementById('width');
    const heightInput = document.getElementById('height');
    const cropBtn = document.getElementById('cropBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const toastContainer = document.getElementById('toastContainer');
    const originalSize = document.getElementById('originalSize');
    const croppedSize = document.getElementById('croppedSize');
    const croppedDimensions = document.getElementById('croppedDimensions');

    // Variables
    let cropper = null;
    let originalFile = null;
    let originalFileSize = 0;

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
            // Update preview
            previewImage.src = e.target.result;
            previewImage.style.display = 'block';
            previewPlaceholder.style.display = 'none';

            // Initialize cropper
            initializeCropper(e.target.result);

            // Enable crop button
            cropBtn.disabled = false;
            downloadBtn.disabled = true;
        };
        reader.readAsDataURL(file);
    }

    // Initialize cropper
    function initializeCropper(imageSrc) {
        // Destroy existing cropper if any
        if (cropper) {
            cropper.destroy();
        }

        // Update cropper image source
        cropperImage.src = imageSrc;

        // Show cropper container
        cropperContainer.style.display = 'block';
        resultContainer.style.display = 'none';

        // Initialize new cropper
        cropper = new Cropper(cropperImage, {
            aspectRatio: getAspectRatio(),
            viewMode: 2,
            autoCropArea: 1,
            responsive: true,
            restore: false,
            guides: true,
            center: true,
            highlight: true,
            cropBoxMovable: true,
            cropBoxResizable: true,
            toggleDragModeOnDblclick: false,
        });
    }

    // Get aspect ratio from select
    function getAspectRatio() {
        const ratio = aspectRatio.value;
        if (ratio === 'free') return NaN;
        const [w, h] = ratio.split(':').map(Number);
        return w / h;
    }

    // Handle aspect ratio change
    aspectRatio.addEventListener('change', function() {
        if (cropper) {
            cropper.setAspectRatio(getAspectRatio());
        }
    });

    // Handle width input
    widthInput.addEventListener('change', function() {
        if (cropper && this.value) {
            const ratio = cropper.getData().height / cropper.getData().width;
            cropper.setData({ width: parseInt(this.value) });
            heightInput.value = Math.round(parseInt(this.value) * ratio);
        }
    });

    // Handle height input
    heightInput.addEventListener('change', function() {
        if (cropper && this.value) {
            const ratio = cropper.getData().width / cropper.getData().height;
            cropper.setData({ height: parseInt(this.value) });
            widthInput.value = Math.round(parseInt(this.value) * ratio);
        }
    });

    // Handle crop button click
    cropBtn.addEventListener('click', function() {
        if (!cropper) return;

        // Get cropped canvas
        const canvas = cropper.getCroppedCanvas({
            width: widthInput.value ? parseInt(widthInput.value) : undefined,
            height: heightInput.value ? parseInt(heightInput.value) : undefined,
        });

        if (!canvas) {
            showToast('Failed to crop image', 'error');
            return;
        }

        // Convert canvas to blob
        canvas.toBlob(function(blob) {
            if (!blob) {
                showToast('Failed to process image', 'error');
                return;
            }

            // Update result
            const croppedData = URL.createObjectURL(blob);
            resultImage.src = croppedData;
            croppedSize.textContent = formatFileSize(blob.size);
            croppedDimensions.textContent = `${canvas.width}×${canvas.height}px`;

            // Show result container
            cropperContainer.style.display = 'none';
            resultContainer.style.display = 'block';

            // Enable download button
            downloadBtn.disabled = false;

            // Show success message
            const message = `
                Image cropped successfully!<br>
                Original Size: ${formatFileSize(originalFileSize)}<br>
                Cropped Size: ${formatFileSize(blob.size)}<br>
                Dimensions: ${canvas.width}×${canvas.height}px
            `;
            showToast(message, 'success');
        });
    });

    // Handle download button click
    downloadBtn.addEventListener('click', function() {
        if (!resultImage.src) return;

        const link = document.createElement('a');
        link.download = 'cropped-image.png';
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