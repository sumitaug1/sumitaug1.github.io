document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const imageDropZone = document.getElementById('imageDropZone');
    const imageInput = document.getElementById('imageInput');
    const selectImageBtn = document.getElementById('selectImageBtn');
    const imagePreview = document.getElementById('imagePreview');
    const previewImage = document.getElementById('previewImage');
    const imageInfo = document.getElementById('imageInfo');
    const removeImageBtn = document.getElementById('removeImageBtn');
    const base64Output = document.getElementById('base64Output');
    const copyBase64Btn = document.getElementById('copyBase64Btn');
    const downloadBase64Btn = document.getElementById('downloadBase64Btn');
    const base64Input = document.getElementById('base64Input');
    const convertBase64Btn = document.getElementById('convertBase64Btn');
    const clearBase64Btn = document.getElementById('clearBase64Btn');
    const base64Preview = document.getElementById('base64Preview');
    const previewBase64Image = document.getElementById('previewBase64Image');
    const base64ImageInfo = document.getElementById('base64ImageInfo');
    const downloadImageBtn = document.getElementById('downloadImageBtn');

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

    // Image to Base64 Conversion
    function handleImageFile(file) {
        if (!file.type.startsWith('image/')) {
            showToast('Please select an image file', 'danger');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            previewImage.src = e.target.result;
            imagePreview.classList.remove('d-none');
            imageInfo.textContent = `${file.name} (${formatFileSize(file.size)})`;
            
            // Convert to Base64
            const base64String = e.target.result.split(',')[1];
            base64Output.value = base64String;
            copyBase64Btn.disabled = false;
            downloadBase64Btn.disabled = false;
        };
        reader.readAsDataURL(file);
    }

    // Event Listeners for Image to Base64
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

    removeImageBtn.addEventListener('click', () => {
        imagePreview.classList.add('d-none');
        base64Output.value = '';
        copyBase64Btn.disabled = true;
        downloadBase64Btn.disabled = true;
        imageInput.value = '';
    });

    copyBase64Btn.addEventListener('click', () => {
        base64Output.select();
        document.execCommand('copy');
        showToast('Base64 string copied to clipboard');
    });

    downloadBase64Btn.addEventListener('click', () => {
        const blob = new Blob([base64Output.value], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'base64.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('Base64 string downloaded');
    });

    // Base64 to Image Conversion
    convertBase64Btn.addEventListener('click', () => {
        const base64String = base64Input.value.trim();
        if (!base64String) {
            showToast('Please enter a Base64 string', 'danger');
            return;
        }

        try {
            // Check if the string is a valid Base64 image
            if (!base64String.match(/^data:image\/(png|jpeg|jpg|gif|webp);base64,/)) {
                // If not, add the data URL prefix
                const mimeType = 'image/png'; // Default to PNG
                previewBase64Image.src = `data:${mimeType};base64,${base64String}`;
            } else {
                previewBase64Image.src = base64String;
            }

            previewBase64Image.onload = function() {
                base64Preview.classList.remove('d-none');
                base64ImageInfo.textContent = `${this.width} × ${this.height} pixels`;
                downloadImageBtn.disabled = false;
            };

            previewBase64Image.onerror = function() {
                showToast('Invalid Base64 image string', 'danger');
            };
        } catch (error) {
            showToast('Error converting Base64 to image', 'danger');
        }
    });

    clearBase64Btn.addEventListener('click', () => {
        base64Input.value = '';
        base64Preview.classList.add('d-none');
        downloadImageBtn.disabled = true;
    });

    downloadImageBtn.addEventListener('click', () => {
        const a = document.createElement('a');
        a.href = previewBase64Image.src;
        a.download = 'converted-image.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        showToast('Image downloaded');
    });
}); 