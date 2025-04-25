document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const qrForm = document.getElementById('qrForm');
    const qrContent = document.getElementById('qrContent');
    const qrSize = document.getElementById('qrSize');
    const qrErrorLevel = document.getElementById('qrErrorLevel');
    const qrColor = document.getElementById('qrColor');
    const qrBgColor = document.getElementById('qrBgColor');
    const qrPreview = document.getElementById('qrPreview');
    const qrCodeContainer = document.getElementById('qrCodeContainer');
    const qrInfo = document.getElementById('qrInfo');
    const downloadQrBtn = document.getElementById('downloadQrBtn');

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

    function generateQRCode() {
        const content = qrContent.value.trim();
        if (!content) {
            showToast('Please enter content for the QR code', 'warning');
            return;
        }

        try {
            // Clear previous QR code
            qrCodeContainer.innerHTML = '';

            // Create a canvas element
            const canvas = document.createElement('canvas');
            qrCodeContainer.appendChild(canvas);

            // Generate new QR code
            QRCode.toCanvas(canvas, content, {
                width: parseInt(qrSize.value),
                color: {
                    dark: qrColor.value,
                    light: qrBgColor.value
                },
                errorCorrectionLevel: qrErrorLevel.value,
                margin: 1
            }, function(error) {
                if (error) {
                    console.error('QR Code generation error:', error);
                    showToast('Error generating QR code: ' + error.message, 'danger');
                } else {
                    qrPreview.style.display = 'block';
                    qrInfo.textContent = `Size: ${qrSize.value}px, Error Correction: ${qrErrorLevel.value}`;
                    showToast('QR code generated successfully');
                }
            });
        } catch (error) {
            console.error('QR Code generation error:', error);
            showToast('Error generating QR code: ' + error.message, 'danger');
        }
    }

    // Event Listeners
    qrForm.addEventListener('submit', function(e) {
        e.preventDefault();
        generateQRCode();
    });

    downloadQrBtn.addEventListener('click', function() {
        const canvas = qrCodeContainer.querySelector('canvas');
        if (canvas) {
            const link = document.createElement('a');
            link.download = 'qr-code.png';
            link.href = canvas.toDataURL('image/png');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            showToast('QR code downloaded');
        } else {
            showToast('Please generate a QR code first', 'warning');
        }
    });

    // Input validation
    qrSize.addEventListener('input', function() {
        const value = parseInt(this.value);
        if (value < 100) this.value = 100;
        if (value > 1000) this.value = 1000;
    });
}); 