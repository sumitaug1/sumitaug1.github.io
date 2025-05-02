document.addEventListener('DOMContentLoaded', function() {
    const colorPicker = document.getElementById('colorPicker');
    const colorInput = document.getElementById('colorInput');
    const colorPreview = document.getElementById('colorPreview');
    const hexCode = document.getElementById('hexCode');
    const rgbCode = document.getElementById('rgbCode');
    const hslCode = document.getElementById('hslCode');
    const colorName = document.getElementById('colorName');
    const luminance = document.getElementById('luminance');
    const contrastRatio = document.getElementById('contrastRatio');
    const copyButtons = document.querySelectorAll('[data-copy]');

    // Check if all required elements exist
    if (!colorPicker || !colorInput || !colorPreview || !hexCode || !rgbCode || !hslCode || 
        !colorName || !luminance || !contrastRatio) {
        console.error('Required elements not found. Please check the HTML structure.');
        return;
    }

    // Function to convert HEX to RGB
    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    // Function to convert RGB to HSL
    function rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }

            h /= 6;
        }

        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100)
        };
    }

    // Function to calculate relative luminance
    function calculateLuminance(r, g, b) {
        const [rs, gs, bs] = [r, g, b].map(c => {
            c = c / 255;
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    }

    // Function to calculate contrast ratio
    function calculateContrastRatio(l1, l2) {
        const lighter = Math.max(l1, l2);
        const darker = Math.min(l1, l2);
        return (lighter + 0.05) / (darker + 0.05);
    }

    // Function to get color name
    function getColorName(hex) {
        // This is a simplified version. In a real application, you would use a more comprehensive color name database
        const colorMap = {
            '#000000': 'Black',
            '#FFFFFF': 'White',
            '#FF0000': 'Red',
            '#00FF00': 'Green',
            '#0000FF': 'Blue',
            '#FFFF00': 'Yellow',
            '#FF00FF': 'Magenta',
            '#00FFFF': 'Cyan'
        };
        return colorMap[hex.toUpperCase()] || 'Custom Color';
    }

    // Function to update color information
    function updateColorInfo(hex) {
        const rgb = hexToRgb(hex);
        if (!rgb) return;

        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        const lum = calculateLuminance(rgb.r, rgb.g, rgb.b);
        const contrast = calculateContrastRatio(lum, 1); // Contrast with white

        // Update color preview
        colorPreview.style.backgroundColor = hex;
        colorPreview.style.color = lum > 0.5 ? '#000000' : '#FFFFFF';

        // Update color codes
        hexCode.value = hex.toUpperCase();
        rgbCode.value = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        hslCode.value = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;

        // Update color information
        colorName.value = getColorName(hex);
        luminance.value = lum.toFixed(4);
        contrastRatio.value = contrast.toFixed(2);
    }

    // Color picker change handler
    colorPicker.addEventListener('input', function() {
        const hex = this.value;
        colorInput.value = hex;
        updateColorInfo(hex);
    });

    // Color input change handler
    colorInput.addEventListener('input', function() {
        let hex = this.value;
        
        // Handle different color formats
        if (hex.startsWith('rgb')) {
            const rgb = hex.match(/\d+/g);
            if (rgb && rgb.length === 3) {
                hex = '#' + rgb.map(x => {
                    const hex = parseInt(x).toString(16);
                    return hex.length === 1 ? '0' + hex : hex;
                }).join('');
            }
        } else if (hex.startsWith('hsl')) {
            const hsl = hex.match(/\d+/g);
            if (hsl && hsl.length === 3) {
                // Convert HSL to RGB (simplified version)
                const h = parseInt(hsl[0]) / 360;
                const s = parseInt(hsl[1]) / 100;
                const l = parseInt(hsl[2]) / 100;
                
                let r, g, b;
                
                if (s === 0) {
                    r = g = b = l;
                } else {
                    const hue2rgb = (p, q, t) => {
                        if (t < 0) t += 1;
                        if (t > 1) t -= 1;
                        if (t < 1/6) return p + (q - p) * 6 * t;
                        if (t < 1/2) return q;
                        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                        return p;
                    };
                    
                    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                    const p = 2 * l - q;
                    
                    r = hue2rgb(p, q, h + 1/3);
                    g = hue2rgb(p, q, h);
                    b = hue2rgb(p, q, h - 1/3);
                }
                
                hex = '#' + [r, g, b].map(x => {
                    const hex = Math.round(x * 255).toString(16);
                    return hex.length === 1 ? '0' + hex : hex;
                }).join('');
            }
        }
        
        // Ensure hex is valid
        if (/^#[0-9A-F]{6}$/i.test(hex)) {
            colorPicker.value = hex;
            updateColorInfo(hex);
        }
    });

    // Copy button handlers
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-copy');
            const targetInput = document.getElementById(targetId);
            if (targetInput) {
                navigator.clipboard.writeText(targetInput.value)
                    .then(() => {
                        const originalText = this.innerHTML;
                        this.innerHTML = '<i class="fas fa-check"></i>';
                        setTimeout(() => {
                            this.innerHTML = originalText;
                        }, 2000);
                    })
                    .catch(err => {
                        console.error('Failed to copy text: ', err);
                        alert('Failed to copy to clipboard');
                    });
            }
        });
    });

    // Initialize with default color
    updateColorInfo(colorPicker.value);
}); 