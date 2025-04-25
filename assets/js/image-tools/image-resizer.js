document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const fileInput = document.getElementById('fileInput');
    const dropZone = document.getElementById('dropZone');
    const previewImage = document.getElementById('previewImage');
    const previewPlaceholder = document.getElementById('previewPlaceholder');
    const widthInput = document.getElementById('widthInput');
    const heightInput = document.getElementById('heightInput');
    const maintainAspect = document.getElementById('maintainAspect');
    const presetSizes = document.getElementById('presetSizes');
    const resizeBtn = document.getElementById('resizeBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const toastContainer = document.getElementById('toastContainer');

    // Variables
    let originalImage = null;
    let originalWidth = 0;
    let originalHeight = 0;
    let aspectRatio = 0;

    // Preset sizes
    const presets = {
        'Social Media': {
            'Facebook Post': { width: 1200, height: 630 },
            'Instagram Post': { width: 1080, height: 1080 },
            'Twitter Post': { width: 1200, height: 675 },
            'LinkedIn Post': { width: 1200, height: 627 }
        },
        'Print': {
            'A4': { width: 2480, height: 3508 },
            'A5': { width: 1748, height: 2480 },
            'Business Card': { width: 1050, height: 600 }
        },
        'Web': {
            'HD': { width: 1280, height: 720 },
            'Full HD': { width: 1920, height: 1080 },
            '4K': { width: 3840, height: 2160 }
        }
    };

    // Initialize preset sizes dropdown
    function initPresetSizes() {
        Object.entries(presets).forEach(([category, sizes]) => {
            const optgroup = document.createElement('optgroup');
            optgroup.label = category;
            
            Object.entries(sizes).forEach(([name, dimensions]) => {
                const option = document.createElement('option');
                option.value = `${dimensions.width}x${dimensions.height}`;
                option.textContent = `${name} (${dimensions.width}×${dimensions.height})`;
                optgroup.appendChild(option);
            });
            
            presetSizes.appendChild(optgroup);
        });
    }

    // Handle file selection
    function handleFileSelect(file) {
        if (!file.type.startsWith('image/')) {
            showToast('Please select an image file', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            originalImage = new Image();
            originalImage.onload = function() {
                originalWidth = this.width;
                originalHeight = this.height;
                aspectRatio = originalWidth / originalHeight;

                // Update preview
                previewImage.src = e.target.result;
                previewImage.style.display = 'block';
                previewPlaceholder.style.display = 'none';

                // Update dimensions
                widthInput.value = originalWidth;
                heightInput.value = originalHeight;

                // Enable buttons
                resizeBtn.disabled = false;
                downloadBtn.disabled = true;
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

    // Handle dimension changes
    function updateDimensions() {
        if (!originalImage) return;

        if (maintainAspect.checked) {
            if (this === widthInput) {
                heightInput.value = Math.round(widthInput.value / aspectRatio);
            } else {
                widthInput.value = Math.round(heightInput.value * aspectRatio);
            }
        }
    }

    widthInput.addEventListener('input', updateDimensions);
    heightInput.addEventListener('input', updateDimensions);

    // Handle preset size selection
    presetSizes.addEventListener('change', function() {
        if (!this.value) return;

        const [width, height] = this.value.split('x').map(Number);
        widthInput.value = width;
        heightInput.value = height;
    });

    // Handle resize button click
    resizeBtn.addEventListener('click', function() {
        if (!originalImage) return;

        const width = parseInt(widthInput.value);
        const height = parseInt(heightInput.value);

        if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
            showToast('Please enter valid dimensions', 'error');
            return;
        }

        // Create canvas and resize image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(originalImage, 0, 0, width, height);

        // Update preview
        previewImage.src = canvas.toDataURL('image/jpeg', 0.9);
        downloadBtn.disabled = false;

        showToast('Image resized successfully', 'success');
    });

    // Handle download button click
    downloadBtn.addEventListener('click', function() {
        const link = document.createElement('a');
        link.download = `resized-image-${widthInput.value}x${heightInput.value}.jpg`;
        link.href = previewImage.src;
        link.click();
    });

    // Show toast notification
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

    // Initialize the tool
    initPresetSizes();
}); 