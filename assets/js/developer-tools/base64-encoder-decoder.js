document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('base64Form');
    const inputText = document.getElementById('inputText');
    const outputText = document.getElementById('outputText');
    const inputType = document.getElementById('inputType');
    const outputType = document.getElementById('outputType');
    const urlSafe = document.getElementById('urlSafe');
    const addPadding = document.getElementById('addPadding');
    const lineBreaks = document.getElementById('lineBreaks');
    const autoConvert = document.getElementById('autoConvert');
    const convertButton = document.getElementById('convertButton');
    const clearButton = document.getElementById('clearButton');
    const copyButton = document.getElementById('copyButton');

    // Check if all required elements exist
    if (!form || !inputText || !outputText || !inputType || !outputType || !urlSafe || 
        !addPadding || !lineBreaks || !autoConvert || !convertButton || !clearButton || !copyButton) {
        console.error('Required elements not found. Please check the HTML structure.');
        return;
    }

    // Function to check if a string is valid Base64
    function isValidBase64(str) {
        try {
            return btoa(atob(str)) === str;
        } catch (err) {
            return false;
        }
    }

    // Function to convert Base64 to URL-safe Base64
    function toUrlSafe(base64) {
        return base64.replace(/\+/g, '-').replace(/\//g, '_');
    }

    // Function to convert URL-safe Base64 to standard Base64
    function fromUrlSafe(base64) {
        return base64.replace(/-/g, '+').replace(/_/g, '/');
    }

    // Function to add line breaks to Base64
    function addLineBreaks(base64) {
        return base64.replace(/(.{76})/g, '$1\n');
    }

    // Function to remove line breaks from Base64
    function removeLineBreaks(base64) {
        return base64.replace(/\n/g, '');
    }

    // Function to add padding to Base64
    function addPadding(base64) {
        const pad = base64.length % 4;
        if (pad) {
            base64 += '='.repeat(4 - pad);
        }
        return base64;
    }

    // Function to remove padding from Base64
    function removePadding(base64) {
        return base64.replace(/=+$/, '');
    }

    // Function to encode text to Base64
    function encodeToBase64(text) {
        let base64 = btoa(unescape(encodeURIComponent(text)));
        
        if (urlSafe.checked) {
            base64 = toUrlSafe(base64);
        }
        
        if (addPadding.checked) {
            base64 = addPadding(base64);
        } else {
            base64 = removePadding(base64);
        }
        
        if (lineBreaks.checked) {
            base64 = addLineBreaks(base64);
        }
        
        return base64;
    }

    // Function to decode Base64 to text
    function decodeFromBase64(base64) {
        try {
            // Remove line breaks and padding
            base64 = removeLineBreaks(base64);
            
            // Convert URL-safe to standard Base64
            if (urlSafe.checked) {
                base64 = fromUrlSafe(base64);
            }
            
            // Add padding if needed
            if (addPadding.checked) {
                base64 = addPadding(base64);
            }
            
            // Decode
            return decodeURIComponent(escape(atob(base64)));
        } catch (error) {
            throw new Error('Invalid Base64 string');
        }
    }

    // Function to auto-detect and convert
    function autoDetectAndConvert(text) {
        const isBase64 = isValidBase64(text);
        if (isBase64) {
            inputType.value = 'base64';
            outputType.value = 'text';
            return decodeFromBase64(text);
        } else {
            inputType.value = 'text';
            outputType.value = 'base64';
            return encodeToBase64(text);
        }
    }

    // Function to convert based on input and output types
    function convert() {
        const text = inputText.value.trim();
        if (!text) {
            alert('Please enter text to convert');
            return;
        }

        try {
            let result;
            if (autoConvert.checked) {
                result = autoDetectAndConvert(text);
            } else {
                if (inputType.value === 'text' && outputType.value === 'base64') {
                    result = encodeToBase64(text);
                } else if (inputType.value === 'base64' && outputType.value === 'text') {
                    result = decodeFromBase64(text);
                } else {
                    result = text; // No conversion needed
                }
            }
            outputText.value = result;
        } catch (error) {
            alert(error.message);
        }
    }

    // Function to copy text to clipboard
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text)
            .then(() => {
                const originalText = copyButton.innerHTML;
                copyButton.innerHTML = '<i class="fas fa-check me-1"></i>Copied!';
                setTimeout(() => {
                    copyButton.innerHTML = originalText;
                }, 2000);
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
                alert('Failed to copy to clipboard');
            });
    }

    // Convert button handler
    convertButton.addEventListener('click', convert);

    // Clear button handler
    clearButton.addEventListener('click', function() {
        inputText.value = '';
        outputText.value = '';
    });

    // Copy button handler
    copyButton.addEventListener('click', function() {
        if (outputText.value) {
            copyToClipboard(outputText.value);
        }
    });

    // Input type change handler
    inputType.addEventListener('change', function() {
        if (this.value === 'base64') {
            outputType.value = 'text';
        } else {
            outputType.value = 'base64';
        }
    });

    // Output type change handler
    outputType.addEventListener('change', function() {
        if (this.value === 'text') {
            inputType.value = 'base64';
        } else {
            inputType.value = 'text';
        }
    });

    // Auto-convert change handler
    autoConvert.addEventListener('change', function() {
        if (this.checked) {
            inputType.disabled = true;
            outputType.disabled = true;
        } else {
            inputType.disabled = false;
            outputType.disabled = false;
        }
    });
}); 