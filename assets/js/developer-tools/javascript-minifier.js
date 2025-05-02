document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('minifierForm');
    const resultCard = document.getElementById('resultCard');
    const jsInput = document.getElementById('jsInput');
    const removeComments = document.getElementById('removeComments');
    const removeWhitespace = document.getElementById('removeWhitespace');
    const mangleNames = document.getElementById('mangleNames');
    const outputFormat = document.getElementById('outputFormat');
    const clearButton = document.getElementById('clearButton');
    const copyButton = document.getElementById('copyButton');
    const copyOutputButton = document.getElementById('copyOutputButton');
    const downloadButton = document.getElementById('downloadButton');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const minificationResults = document.getElementById('minificationResults');
    const minificationStatus = document.getElementById('minificationStatus');
    const minifiedOutput = document.getElementById('minifiedOutput');
    const originalSize = document.getElementById('originalSize');
    const minifiedSize = document.getElementById('minifiedSize');
    const savings = document.getElementById('savings');

    // Check if all required elements exist
    if (!form || !resultCard || !jsInput || !removeComments || !removeWhitespace || !mangleNames || 
        !outputFormat || !clearButton || !copyButton || !copyOutputButton || !downloadButton || 
        !loadingSpinner || !minificationResults || !minificationStatus || !minifiedOutput || 
        !originalSize || !minifiedSize || !savings) {
        console.error('Required elements not found. Please check the HTML structure.');
        return;
    }

    // Function to minify JavaScript
    async function minifyJS(code) {
        try {
            const options = {
                compress: {
                    dead_code: true,
                    drop_console: false,
                    drop_debugger: true,
                    pure_funcs: [],
                    pure_getters: true,
                    unsafe: false,
                    unsafe_arrows: false,
                    unsafe_comps: false,
                    unsafe_Function: false,
                    unsafe_math: false,
                    unsafe_methods: false,
                    unsafe_proto: false,
                    unsafe_regexp: false,
                    unsafe_undefined: false,
                    unused: true
                },
                mangle: {
                    eval: false,
                    keep_classnames: false,
                    keep_fnames: false,
                    module: false,
                    nth_identifier: null,
                    properties: false,
                    reserved: [],
                    safari10: false,
                    toplevel: false
                },
                format: {
                    ascii_only: false,
                    beautify: outputFormat.value === 'beautified',
                    braces: false,
                    comments: !removeComments.checked,
                    ecma: 2020,
                    indent_level: 4,
                    inline_script: false,
                    keep_numbers: false,
                    max_line_len: false,
                    preamble: null,
                    preserve_annotations: false,
                    quote_keys: false,
                    quote_style: 3,
                    semicolons: true,
                    shebang: true,
                    webkit: false,
                    wrap_iife: false,
                    wrap_func_args: true
                },
                sourceMap: false
            };

            // Configure options based on checkboxes
            if (!removeWhitespace.checked) {
                options.format.beautify = true;
            }
            if (!mangleNames.checked) {
                options.mangle = false;
            }

            const result = await Terser.minify(code, options);

            return {
                success: true,
                code: result.code,
                stats: {
                    originalSize: code.length,
                    minifiedSize: result.code.length
                }
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Function to display results
    function displayResults(result) {
        // Clear previous results
        minificationStatus.innerHTML = '';
        minifiedOutput.innerHTML = '';

        if (result.success) {
            // Display success status
            minificationStatus.innerHTML = '<i class="fas fa-check-circle text-success me-2"></i>Minification successful';
            
            // Display minified JavaScript
            minifiedOutput.textContent = result.code;
            hljs.highlightElement(minifiedOutput);
            
            // Update statistics
            originalSize.textContent = result.stats.originalSize;
            minifiedSize.textContent = result.stats.minifiedSize;
            const savingsPercent = ((result.stats.originalSize - result.stats.minifiedSize) / result.stats.originalSize * 100).toFixed(1);
            savings.textContent = `${savingsPercent}%`;
            
            // Show copy button
            copyOutputButton.style.display = 'block';
        } else {
            // Display error status
            minificationStatus.innerHTML = '<i class="fas fa-times-circle text-danger me-2"></i>Minification failed';
            
            // Display error details
            minifiedOutput.textContent = result.error;
            
            // Reset statistics
            originalSize.textContent = '0';
            minifiedSize.textContent = '0';
            savings.textContent = '0%';
            
            // Hide copy button
            copyOutputButton.style.display = 'none';
        }
    }

    // Function to download JavaScript
    function downloadJS(code, filename) {
        const blob = new Blob([code], { type: 'text/javascript' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Function to copy text to clipboard
    function copyToClipboard(text, button) {
        navigator.clipboard.writeText(text)
            .then(() => {
                const originalText = button.innerHTML;
                button.innerHTML = '<i class="fas fa-check me-1"></i>Copied!';
                setTimeout(() => {
                    button.innerHTML = originalText;
                }, 2000);
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
                alert('Failed to copy to clipboard');
            });
    }

    // Form submission handler
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const code = jsInput.value.trim();
        if (!code) {
            alert('Please enter JavaScript code');
            return;
        }

        // Show loading spinner and hide results
        loadingSpinner.style.display = 'block';
        minificationResults.style.display = 'none';
        resultCard.style.display = 'block';

        try {
            // Minify JavaScript
            const result = await minifyJS(code);
            
            // Hide loading spinner and show results
            loadingSpinner.style.display = 'none';
            minificationResults.style.display = 'block';
            displayResults(result);
        } catch (error) {
            loadingSpinner.style.display = 'none';
            minificationResults.style.display = 'block';
            displayResults({
                success: false,
                error: error.message
            });
        }
    });

    // Clear button handler
    clearButton.addEventListener('click', function() {
        form.reset();
        resultCard.style.display = 'none';
    });

    // Copy button handler for input
    copyButton.addEventListener('click', function() {
        if (jsInput.value.trim()) {
            copyToClipboard(jsInput.value.trim(), this);
        }
    });

    // Copy button handler for output
    copyOutputButton.addEventListener('click', function() {
        if (minifiedOutput.textContent) {
            copyToClipboard(minifiedOutput.textContent, this);
        }
    });

    // Download button handler
    downloadButton.addEventListener('click', function() {
        if (minifiedOutput.textContent) {
            const filename = `minified-${outputFormat.value}-${new Date().toISOString()}.js`;
            downloadJS(minifiedOutput.textContent, filename);
        }
    });

    // Initialize syntax highlighting
    hljs.configure({
        languages: ['javascript']
    });
}); 