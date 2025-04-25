document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const previewArea = document.getElementById('previewArea');
    const conversionOptions = document.getElementById('conversionOptions');
    const originalPreview = document.getElementById('originalPreview');
    const pngPreview = document.getElementById('pngPreview');
    const originalInfo = document.getElementById('originalInfo');
    const pngInfo = document.getElementById('pngInfo');
    const qualityRange = document.getElementById('qualityRange');
    const qualityValue = document.getElementById('qualityValue');
    const widthInput = document.getElementById('widthInput');
    const heightInput = document.getElementById('heightInput');
    const lockAspectRatio = document.getElementById('lockAspectRatio');
    const convertBtn = document.getElementById('convertBtn');
    const downloadBtn = document.getElementById('downloadBtn');

    // Variables
    let originalImage = null;
    let convertedImage = null;
    let aspectRatio = 1;
    let isAspectRatioLocked = true;

    // Event Listeners
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleFileSelect(file);
        } else {
            showToast('Please select a valid image file', 'error');
        }
    });

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            handleFileSelect(file);
        }
    });

    qualityRange.addEventListener('input', () => {
        qualityValue.textContent = `${qualityRange.value}%`;
        if (originalImage) {
            convertToPNG();
        }
    });

    widthInput.addEventListener('input', () => {
        if (isAspectRatioLocked && widthInput.value) {
            heightInput.value = Math.round(widthInput.value / aspectRatio);
        }
        if (originalImage) {
            convertToPNG();
        }
    });

    heightInput.addEventListener('input', () => {
        if (isAspectRatioLocked && heightInput.value) {
            widthInput.value = Math.round(heightInput.value * aspectRatio);
        }
        if (originalImage) {
            convertToPNG();
        }
    });

    lockAspectRatio.addEventListener('click', () => {
        isAspectRatioLocked = !isAspectRatioLocked;
        lockAspectRatio.innerHTML = isAspectRatioLocked ? '<i class="fas fa-lock"></i>' : '<i class="fas fa-lock-open"></i>';
    });

    convertBtn.addEventListener('click', convertToPNG);
    downloadBtn.addEventListener('click', downloadPNG);

    // Functions
    function handleFileSelect(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            originalImage = new Image();
            originalImage.onload = () => {
                // Set aspect ratio
                aspectRatio = originalImage.width / originalImage.height;
                
                // Update UI
                originalPreview.src = e.target.result;
                previewArea.classList.remove('d-none');
                conversionOptions.classList.remove('d-none');
                convertBtn.disabled = false;
                
                // Set initial dimensions
                widthInput.value = originalImage.width;
                heightInput.value = originalImage.height;
                
                // Update image info
                updateImageInfo(originalImage, originalInfo);
                
                // Convert to PNG
                convertToPNG();
            };
            originalImage.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    function convertToPNG() {
        if (!originalImage) return;
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Get dimensions
        let width = parseInt(widthInput.value) || originalImage.width;
        let height = parseInt(heightInput.value) || originalImage.height;
        
        // Set canvas size
        canvas.width = width;
        canvas.height = height;
        
        // Draw image
        ctx.drawImage(originalImage, 0, 0, width, height);
        
        // Convert to PNG
        const pngData = canvas.toDataURL('image/png', qualityRange.value / 100);
        
        // Update preview
        pngPreview.src = pngData;
        convertedImage = pngData;
        downloadBtn.disabled = false;
        
        // Update image info
        const tempImg = new Image();
        tempImg.onload = () => {
            updateImageInfo(tempImg, pngInfo);
        };
        tempImg.src = pngData;
    }

    function downloadPNG() {
        if (!convertedImage) return;
        
        const link = document.createElement('a');
        link.href = convertedImage;
        link.download = 'converted-image.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showToast('Image downloaded successfully!', 'success');
    }

    function updateImageInfo(img, element) {
        const size = formatFileSize(calculateFileSize(img));
        element.textContent = `${img.width} x ${img.height} pixels | ${size}`;
    }

    function calculateFileSize(img) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/png');
        return Math.round((dataURL.length - dataURL.indexOf(',') - 1) * 0.75);
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

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
        
        document.body.appendChild(toast);
        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();
        
        toast.addEventListener('hidden.bs.toast', () => {
            document.body.removeChild(toast);
        });
    }
}); 