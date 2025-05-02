document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const inputText = document.getElementById('inputText');
    const fileInput = document.getElementById('fileInput');
    const hashOutput = document.getElementById('hashOutput');
    const generateBtn = document.getElementById('generateBtn');
    const clearBtn = document.getElementById('clearBtn');
    const copyBtn = document.getElementById('copyBtn');

    // Generate hash from text
    function generateHashFromText(text) {
        return CryptoJS.SHA256(text).toString();
    }

    // Generate hash from file
    function generateHashFromFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function(e) {
                const hash = CryptoJS.SHA256(CryptoJS.enc.Latin1.parse(e.target.result)).toString();
                resolve(hash);
            };
            reader.onerror = function() {
                reject(new Error('Error reading file'));
            };
            reader.readAsBinaryString(file);
        });
    }

    // Generate hash button click handler
    generateBtn.addEventListener('click', async function() {
        try {
            let hash;
            if (inputText.value.trim()) {
                hash = generateHashFromText(inputText.value);
            } else if (fileInput.files.length > 0) {
                hash = await generateHashFromFile(fileInput.files[0]);
            } else {
                alert('Please enter text or select a file');
                return;
            }
            hashOutput.value = hash;
        } catch (error) {
            alert('Error generating hash: ' + error.message);
        }
    });

    // Clear button click handler
    clearBtn.addEventListener('click', function() {
        inputText.value = '';
        fileInput.value = '';
        hashOutput.value = '';
    });

    // Copy button click handler
    copyBtn.addEventListener('click', function() {
        if (hashOutput.value) {
            hashOutput.select();
            document.execCommand('copy');
            alert('Hash copied to clipboard!');
        }
    });

    // File input change handler
    fileInput.addEventListener('change', function() {
        if (this.files.length > 0) {
            inputText.value = ''; // Clear text input when file is selected
        }
    });

    // Text input change handler
    inputText.addEventListener('input', function() {
        if (this.value.trim()) {
            fileInput.value = ''; // Clear file input when text is entered
        }
    });
}); 