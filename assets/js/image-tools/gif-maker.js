document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const imageDropZone = document.getElementById('imageDropZone');
    const imageInput = document.getElementById('imageInput');
    const selectImageBtn = document.getElementById('selectImageBtn');
    const imagePreview = document.getElementById('imagePreview');
    const previewContainer = document.getElementById('previewContainer');
    const removeAllBtn = document.getElementById('removeAllBtn');
    const generateGifBtn = document.getElementById('generateGifBtn');
    const gifPreview = document.getElementById('gifPreview');
    const previewGif = document.getElementById('previewGif');
    const downloadGifBtn = document.getElementById('downloadGifBtn');
    const gifInfo = document.getElementById('gifInfo');
    const frameDuration = document.getElementById('frameDuration');
    const maxSize = document.getElementById('maxSize');
    const loopCount = document.getElementById('loopCount');
    const quality = document.getElementById('quality');
    const qualityValue = document.getElementById('qualityValue');

    // State
    let selectedImages = [];
    let generatedGif = null;

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

    function createImagePreview(file, index) {
        const div = document.createElement('div');
        div.className = 'position-relative';
        div.style.width = '100px';
        div.style.height = '100px';
        
        const img = document.createElement('img');
        img.className = 'img-thumbnail';
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        
        const removeBtn = document.createElement('button');
        removeBtn.className = 'btn btn-sm btn-danger position-absolute top-0 end-0 m-1';
        removeBtn.innerHTML = '<i class="fas fa-times"></i>';
        removeBtn.onclick = () => removeImage(index);
        
        const reader = new FileReader();
        reader.onload = function(e) {
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
        
        div.appendChild(img);
        div.appendChild(removeBtn);
        return div;
    }

    function removeImage(index) {
        selectedImages.splice(index, 1);
        updatePreview();
    }

    function updatePreview() {
        previewContainer.innerHTML = '';
        selectedImages.forEach((file, index) => {
            previewContainer.appendChild(createImagePreview(file, index));
        });
        
        if (selectedImages.length === 0) {
            imagePreview.classList.add('d-none');
            gifPreview.style.display = 'none';
        }
    }

    async function generateGif() {
        if (selectedImages.length < 2) {
            showToast('Please select at least 2 images', 'warning');
            return;
        }

        try {
            generateGifBtn.disabled = true;
            generateGifBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Generating...';
            
            // Convert selected images to data URLs
            const imageUrls = await Promise.all(selectedImages.map(file => {
                return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = (e) => resolve(e.target.result);
                    reader.readAsDataURL(file);
                });
            }));

            // Create GIF using gifshot
            gifshot.createGIF({
                images: imageUrls,
                gifWidth: parseInt(maxSize.value),
                gifHeight: parseInt(maxSize.value),
                interval: parseInt(frameDuration.value) / 1000, // Convert to seconds
                numFrames: imageUrls.length,
                frameDuration: parseInt(frameDuration.value),
                numWorkers: 1,
                sampleInterval: 10,
                progressCallback: function(captureProgress) {
                    console.log('Progress:', captureProgress);
                }
            }, function(obj) {
                if (!obj.error) {
                    const image = obj.image;
                    previewGif.src = image;
                    gifPreview.style.display = 'block';
                    gifInfo.textContent = `${selectedImages.length} frames`;
                    generatedGif = image;
                    showToast('GIF generated successfully');
                } else {
                    console.error('Error:', obj.error);
                    showToast('Error generating GIF: ' + obj.error, 'danger');
                }
                generateGifBtn.disabled = false;
                generateGifBtn.innerHTML = '<i class="fas fa-magic"></i> Generate GIF';
            });
        } catch (error) {
            console.error('GIF generation error:', error);
            showToast('Error generating GIF: ' + error.message, 'danger');
            generateGifBtn.disabled = false;
            generateGifBtn.innerHTML = '<i class="fas fa-magic"></i> Generate GIF';
        }
    }

    // Event Listeners
    selectImageBtn.addEventListener('click', () => imageInput.click());
    
    imageInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            selectedImages = [...selectedImages, ...Array.from(e.target.files)];
            imagePreview.classList.remove('d-none');
            updatePreview();
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
            selectedImages = [...selectedImages, ...Array.from(e.dataTransfer.files)];
            imagePreview.classList.remove('d-none');
            updatePreview();
        }
    });

    quality.addEventListener('input', () => {
        qualityValue.textContent = quality.value;
    });

    removeAllBtn.addEventListener('click', () => {
        selectedImages = [];
        updatePreview();
        gifPreview.style.display = 'none';
    });

    generateGifBtn.addEventListener('click', generateGif);

    downloadGifBtn.addEventListener('click', () => {
        if (generatedGif) {
            const a = document.createElement('a');
            a.href = generatedGif;
            a.download = 'animated.gif';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            showToast('GIF downloaded');
        }
    });
}); 