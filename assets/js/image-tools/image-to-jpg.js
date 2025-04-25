// Image to JPG Converter
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const fileInput = document.getElementById('fileInput');
    const dropZone = document.getElementById('dropZone');
    const previewImage = document.getElementById('previewImage');
    const previewPlaceholder = document.getElementById('previewPlaceholder');
    const qualitySlider = document.getElementById('qualitySlider');
    const qualityValue = document.getElementById('qualityValue');
    const widthInput = document.getElementById('widthInput');
    const heightInput = document.getElementById('heightInput');
    const maintainAspect = document.getElementById('maintainAspect');
    const convertBtn = document.getElementById('convertBtn');
    const downloadBtn = document.getElementById('downloadBtn');

    // Initialize variables
    let currentImage = null;
    let originalWidth = 0;
    let originalHeight = 0;

    // Set up event listeners
    if (fileInput) {
        fileInput.addEventListener('change', handleFileSelect);
    }

    if (dropZone) {
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
            if (file) handleFile(file);
        });
    }

    if (qualitySlider && qualityValue) {
        qualitySlider.addEventListener('input', () => {
            qualityValue.textContent = qualitySlider.value + '%';
        });
    }

    if (widthInput && heightInput && maintainAspect) {
        widthInput.addEventListener('input', updateDimensions);
        heightInput.addEventListener('input', updateDimensions);
        maintainAspect.addEventListener('change', updateDimensions);
    }

    if (convertBtn) {
        convertBtn.addEventListener('click', convertToJPG);
    }

    if (downloadBtn) {
        downloadBtn.addEventListener('click', downloadImage);
    }

    // Handle file selection
    function handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) handleFile(file);
    }

    // Process selected file
    function handleFile(file) {
        // Check if file is an image
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                // Store original dimensions
                originalWidth = img.width;
                originalHeight = img.height;

                // Update preview
                previewImage.src = e.target.result;
                previewImage.style.display = 'block';
                previewPlaceholder.style.display = 'none';

                // Set initial dimensions
                widthInput.value = originalWidth;
                heightInput.value = originalHeight;

                // Store current image
                currentImage = img;

                // Enable convert button
                convertBtn.disabled = false;
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    // Update dimensions while maintaining aspect ratio
    function updateDimensions() {
        if (!maintainAspect.checked || !currentImage) return;

        if (this === widthInput) {
            const newHeight = Math.round(widthInput.value * (originalHeight / originalWidth));
            heightInput.value = newHeight;
        } else if (this === heightInput) {
            const newWidth = Math.round(heightInput.value * (originalWidth / originalHeight));
            widthInput.value = newWidth;
        }
    }

    // Convert image to JPG
    function convertToJPG() {
        if (!currentImage) {
            alert('Please select an image first');
            return;
        }

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Set canvas dimensions
        const width = parseInt(widthInput.value) || currentImage.width;
        const height = parseInt(heightInput.value) || currentImage.height;
        canvas.width = width;
        canvas.height = height;

        // Draw image
        ctx.drawImage(currentImage, 0, 0, width, height);

        // Convert to JPG
        const quality = parseInt(qualitySlider.value) / 100;
        const jpgData = canvas.toDataURL('image/jpeg', quality);

        // Update preview
        previewImage.src = jpgData;
        currentImage = new Image();
        currentImage.src = jpgData;

        // Enable download button
        downloadBtn.disabled = false;
    }

    // Download converted image
    function downloadImage() {
        if (!currentImage) {
            alert('Please convert an image first');
            return;
        }

        const link = document.createElement('a');
        link.download = 'converted-image.jpg';
        link.href = currentImage.src;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}); 