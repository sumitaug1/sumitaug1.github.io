// DOM Elements
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const previewArea = document.getElementById('previewArea');
const originalPreview = document.getElementById('originalPreview');
const pngPreview = document.getElementById('pngPreview');
const originalInfo = document.getElementById('originalInfo');
const pngInfo = document.getElementById('pngInfo');
const conversionOptions = document.getElementById('conversionOptions');
const convertBtn = document.getElementById('convertBtn');
const downloadBtn = document.getElementById('downloadBtn');
const qualityRange = document.getElementById('qualityRange');
const qualityValue = document.getElementById('qualityValue');
const widthInput = document.getElementById('widthInput');
const heightInput = document.getElementById('heightInput');
const lockAspectRatio = document.getElementById('lockAspectRatio');

// Variables
let originalImage = null;
let convertedImage = null;
let aspectRatio = 1;
let isAspectRatioLocked = true;

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Drag and drop events
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleDrop);
    
    // File input change
    fileInput.addEventListener('change', handleFileSelect);
    
    // Quality range change
    qualityRange.addEventListener('input', updateQualityValue);
    
    // Resize inputs change
    widthInput.addEventListener('input', handleWidthChange);
    heightInput.addEventListener('input', handleHeightChange);
    
    // Aspect ratio lock toggle
    lockAspectRatio.addEventListener('click', toggleAspectRatio);
    
    // Convert and download buttons
    convertBtn.addEventListener('click', convertToPNG);
    downloadBtn.addEventListener('click', downloadPNG);
});

// Drag and Drop Handlers
function handleDragOver(e) {
    e.preventDefault();
    uploadArea.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        handleImageFile(file);
    } else {
        showToast('Please drop an image file', 'error');
    }
}

// File Selection Handler
function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
        handleImageFile(file);
    }
}

// Image File Handler
function handleImageFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        originalImage = new Image();
        originalImage.onload = () => {
            // Update UI
            uploadArea.classList.add('d-none');
            previewArea.classList.remove('d-none');
            conversionOptions.classList.remove('d-none');
            convertBtn.disabled = false;
            
            // Set original preview
            originalPreview.src = e.target.result;
            
            // Calculate aspect ratio
            aspectRatio = originalImage.width / originalImage.height;
            
            // Set initial dimensions
            widthInput.value = originalImage.width;
            heightInput.value = originalImage.height;
            
            // Update info
            updateImageInfo(originalImage, originalInfo);
        };
        originalImage.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// Quality Update Handler
function updateQualityValue() {
    qualityValue.textContent = `${qualityRange.value}%`;
}

// Resize Handlers
function handleWidthChange() {
    if (isAspectRatioLocked) {
        heightInput.value = Math.round(widthInput.value / aspectRatio);
    }
}

function handleHeightChange() {
    if (isAspectRatioLocked) {
        widthInput.value = Math.round(heightInput.value * aspectRatio);
    }
}

function toggleAspectRatio() {
    isAspectRatioLocked = !isAspectRatioLocked;
    lockAspectRatio.innerHTML = isAspectRatioLocked ? 
        '<i class="fas fa-lock"></i>' : 
        '<i class="fas fa-lock-open"></i>';
}

// Image Conversion
function convertToPNG() {
    if (!originalImage) return;
    
    // Create canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set dimensions
    const width = parseInt(widthInput.value) || originalImage.width;
    const height = parseInt(heightInput.value) || originalImage.height;
    canvas.width = width;
    canvas.height = height;
    
    // Draw image
    ctx.drawImage(originalImage, 0, 0, width, height);
    
    // Convert to PNG
    const pngData = canvas.toDataURL('image/png', qualityRange.value / 100);
    
    // Update preview
    pngPreview.src = pngData;
    convertedImage = pngData;
    
    // Update info
    const tempImg = new Image();
    tempImg.onload = () => {
        updateImageInfo(tempImg, pngInfo);
        downloadBtn.disabled = false;
    };
    tempImg.src = pngData;
    
    showToast('Image converted successfully!', 'success');
}

// Download Handler
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

// Helper Functions
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
    return Math.round((dataURL.length - 'data:image/png;base64,'.length) * 0.75);
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    const container = document.querySelector('.toast-container') || createToastContainer();
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

function createToastContainer() {
    const container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
    return container;
} 