document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const imageDropZone = document.getElementById('imageDropZone');
    const imageInput = document.getElementById('imageInput');
    const selectImageBtn = document.getElementById('selectImageBtn');
    const imagePreview = document.getElementById('imagePreview');
    const previewImage = document.getElementById('previewImage');
    const convertedImage = document.getElementById('convertedImage');
    const imageInfo = document.getElementById('imageInfo');
    const convertedImageInfo = document.getElementById('convertedImageInfo');
    const removeImageBtn = document.getElementById('removeImageBtn');
    const downloadImageBtn = document.getElementById('downloadImageBtn');
    const qualitySlider = document.getElementById('qualitySlider');
    const qualityValue = document.getElementById('qualityValue');

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

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    function convertWebPtoPNG(webpImage, quality) {
        return new Promise((resolve, reject) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            canvas.width = webpImage.width;
            canvas.height = webpImage.height;
            
            ctx.drawImage(webpImage, 0, 0);
            
            try {
                const pngDataUrl = canvas.toDataURL('image/png', quality / 100);
                resolve(pngDataUrl);
            } catch (error) {
                reject(error);
            }
        });
    }

    // Event Listeners
    selectImageBtn.addEventListener('click', () => imageInput.click());
    
    imageInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleImageFile(e.target.files[0]);
        }
    });

    imageDropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        imageDropZone.classList.add('dragover');
    });

    imageDropZone.addEventListener('dragleave', () => {
        imageDropZone.classList.remove('dragover');
    });

    imageDropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        imageDropZone.classList.remove('dragover');
        
        if (e.dataTransfer.files.length > 0) {
            handleImageFile(e.dataTransfer.files[0]);
        }
    });

    qualitySlider.addEventListener('input', () => {
        qualityValue.textContent = `${qualitySlider.value}%`;
        if (previewImage.src) {
            convertAndUpdateImage();
        }
    });

    removeImageBtn.addEventListener('click', () => {
        imagePreview.classList.add('d-none');
        previewImage.src = '';
        convertedImage.src = '';
        convertedImage.classList.add('d-none');
        downloadImageBtn.disabled = true;
        imageInput.value = '';
    });

    downloadImageBtn.addEventListener('click', () => {
        const a = document.createElement('a');
        a.href = convertedImage.src;
        a.download = 'converted-image.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        showToast('PNG image downloaded');
    });

    // Main Functions
    async function handleImageFile(file) {
        if (!file.type.includes('webp')) {
            showToast('Please select a WebP image file', 'danger');
            return;
        }

        const reader = new FileReader();
        reader.onload = async function(e) {
            previewImage.src = e.target.result;
            imagePreview.classList.remove('d-none');
            imageInfo.textContent = `${file.name} (${formatFileSize(file.size)})`;
            
            await convertAndUpdateImage();
        };
        reader.readAsDataURL(file);
    }

    async function convertAndUpdateImage() {
        try {
            const quality = parseInt(qualitySlider.value);
            const pngDataUrl = await convertWebPtoPNG(previewImage, quality);
            
            convertedImage.src = pngDataUrl;
            convertedImage.classList.remove('d-none');
            downloadImageBtn.disabled = false;
            
            // Calculate and display converted image size
            const base64String = pngDataUrl.split(',')[1];
            const binaryString = atob(base64String);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            const blob = new Blob([bytes], { type: 'image/png' });
            convertedImageInfo.textContent = `PNG (${formatFileSize(blob.size)})`;
            
        } catch (error) {
            showToast('Error converting image', 'danger');
            console.error('Conversion error:', error);
        }
    }
}); 