document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const barcodeForm = document.getElementById('barcodeForm');
    const barcodeType = document.getElementById('barcodeType');
    const barcodeData = document.getElementById('barcodeData');
    const barcodeSize = document.getElementById('barcodeSize');
    const showText = document.getElementById('showText');
    const resultsCard = document.getElementById('resultsCard');
    const barcodeContainer = document.getElementById('barcodeContainer');
    const barcodeText = document.getElementById('barcodeText');
    const downloadBtn = document.getElementById('downloadBtn');
    const printBtn = document.getElementById('printBtn');

    // Size configurations
    const sizeConfigs = {
        small: { width: 2, height: 50 },
        medium: { width: 2.5, height: 75 },
        large: { width: 3, height: 100 }
    };

    // Handle form submission
    barcodeForm.addEventListener('submit', function(e) {
        e.preventDefault();
        generateBarcode();
    });

    // Handle download button click
    downloadBtn.addEventListener('click', function() {
        downloadBarcode();
    });

    // Handle print button click
    printBtn.addEventListener('click', function() {
        printBarcode();
    });

    // Generate barcode
    function generateBarcode() {
        const type = barcodeType.value;
        const data = barcodeData.value.trim();
        const size = barcodeSize.value;
        const displayText = showText.checked;

        if (!type || !data) {
            showAlert('Please fill in all required fields', 'danger');
            return;
        }

        // Validate data based on barcode type
        if (!validateBarcodeData(type, data)) {
            return;
        }

        // Clear previous barcode
        barcodeContainer.innerHTML = '';
        barcodeText.innerHTML = '';

        // Create canvas element
        const canvas = document.createElement('canvas');
        barcodeContainer.appendChild(canvas);

        try {
            // Generate barcode
            JsBarcode(canvas, data, {
                format: type,
                width: sizeConfigs[size].width,
                height: sizeConfigs[size].height,
                displayValue: displayText,
                fontSize: 12,
                margin: 10
            });

            // Show barcode text if enabled
            if (displayText) {
                barcodeText.textContent = data;
            }

            // Show results card
            resultsCard.classList.remove('d-none');
        } catch (error) {
            showAlert('Failed to generate barcode: ' + error.message, 'danger');
        }
    }

    // Validate barcode data based on type
    function validateBarcodeData(type, data) {
        switch (type) {
            case 'EAN13':
                if (!/^\d{13}$/.test(data)) {
                    showAlert('EAN-13 barcodes must be exactly 13 digits', 'danger');
                    return false;
                }
                break;
            case 'UPCA':
                if (!/^\d{12}$/.test(data)) {
                    showAlert('UPC-A barcodes must be exactly 12 digits', 'danger');
                    return false;
                }
                break;
            case 'ITF14':
                if (!/^\d{14}$/.test(data)) {
                    showAlert('ITF-14 barcodes must be exactly 14 digits', 'danger');
                    return false;
                }
                break;
            case 'CODE39':
                if (!/^[0-9A-Z\-\.\s\$\/\+\%]+$/.test(data)) {
                    showAlert('Code 39 barcodes can only contain uppercase letters, numbers, and special characters (-. $/+%)', 'danger');
                    return false;
                }
                break;
        }
        return true;
    }

    // Download barcode as image
    function downloadBarcode() {
        const canvas = barcodeContainer.querySelector('canvas');
        if (!canvas) {
            showAlert('No barcode to download', 'warning');
            return;
        }

        try {
            const link = document.createElement('a');
            link.download = `barcode-${barcodeType.value}-${barcodeData.value}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (error) {
            showAlert('Failed to download barcode', 'danger');
            console.error('Download error:', error);
        }
    }

    // Print barcode
    function printBarcode() {
        const canvas = barcodeContainer.querySelector('canvas');
        if (!canvas) {
            showAlert('No barcode to print', 'warning');
            return;
        }

        try {
            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                <html>
                    <head>
                        <title>Print Barcode</title>
                        <style>
                            body { text-align: center; margin: 20px; }
                            img { max-width: 100%; }
                        </style>
                    </head>
                    <body>
                        <img src="${canvas.toDataURL('image/png')}" alt="Barcode">
                        <script>
                            window.onload = function() {
                                window.print();
                                window.close();
                            };
                        </script>
                    </body>
                </html>
            `);
            printWindow.document.close();
        } catch (error) {
            showAlert('Failed to print barcode', 'danger');
            console.error('Print error:', error);
        }
    }

    // Show alert message
    function showAlert(message, type) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        
        const container = document.querySelector('.container');
        container.insertBefore(alertDiv, container.firstChild);

        // Auto dismiss after 3 seconds
        setTimeout(() => {
            alertDiv.remove();
        }, 3000);
    }
}); 