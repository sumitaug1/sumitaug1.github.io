document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const passwordLength = document.getElementById('passwordLength');
    const lengthValue = document.getElementById('lengthValue');
    const includeUppercase = document.getElementById('includeUppercase');
    const includeLowercase = document.getElementById('includeLowercase');
    const includeNumbers = document.getElementById('includeNumbers');
    const includeSpecial = document.getElementById('includeSpecial');
    const generatedPassword = document.getElementById('generatedPassword');
    const generateBtn = document.getElementById('generateBtn');
    const clearBtn = document.getElementById('clearBtn');
    const copyBtn = document.getElementById('copyBtn');
    const strengthBar = document.getElementById('strengthBar');
    const strengthText = document.getElementById('strengthText');

    // Character sets
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    // Update length value display
    passwordLength.addEventListener('input', function() {
        lengthValue.textContent = this.value;
    });

    // Generate password
    function generatePassword() {
        let chars = '';
        if (includeUppercase.checked) chars += uppercaseChars;
        if (includeLowercase.checked) chars += lowercaseChars;
        if (includeNumbers.checked) chars += numberChars;
        if (includeSpecial.checked) chars += specialChars;

        if (chars === '') {
            alert('Please select at least one character type');
            return;
        }

        let password = '';
        const length = parseInt(passwordLength.value);

        // Ensure at least one character from each selected type
        if (includeUppercase.checked) password += uppercaseChars.charAt(Math.floor(Math.random() * uppercaseChars.length));
        if (includeLowercase.checked) password += lowercaseChars.charAt(Math.floor(Math.random() * lowercaseChars.length));
        if (includeNumbers.checked) password += numberChars.charAt(Math.floor(Math.random() * numberChars.length));
        if (includeSpecial.checked) password += specialChars.charAt(Math.floor(Math.random() * specialChars.length));

        // Fill the rest of the password
        for (let i = password.length; i < length; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        // Shuffle the password
        password = password.split('').sort(() => Math.random() - 0.5).join('');

        return password;
    }

    // Calculate password strength
    function calculateStrength(password) {
        let strength = 0;
        
        // Length contribution
        strength += Math.min(password.length * 4, 40);
        
        // Character type contribution
        if (includeUppercase.checked) strength += 10;
        if (includeLowercase.checked) strength += 10;
        if (includeNumbers.checked) strength += 10;
        if (includeSpecial.checked) strength += 10;

        // Normalize to 0-100
        strength = Math.min(strength, 100);

        return strength;
    }

    // Update strength indicator
    function updateStrengthIndicator(strength) {
        strengthBar.style.width = strength + '%';
        
        if (strength < 40) {
            strengthBar.className = 'progress-bar bg-danger';
            strengthText.textContent = 'Weak Password';
        } else if (strength < 70) {
            strengthBar.className = 'progress-bar bg-warning';
            strengthText.textContent = 'Moderate Password';
        } else if (strength < 90) {
            strengthBar.className = 'progress-bar bg-info';
            strengthText.textContent = 'Strong Password';
        } else {
            strengthBar.className = 'progress-bar bg-success';
            strengthText.textContent = 'Very Strong Password';
        }
    }

    // Generate button click handler
    generateBtn.addEventListener('click', function() {
        const password = generatePassword();
        generatedPassword.value = password;
        updateStrengthIndicator(calculateStrength(password));
    });

    // Clear button click handler
    clearBtn.addEventListener('click', function() {
        generatedPassword.value = '';
        strengthBar.style.width = '0%';
        strengthBar.className = 'progress-bar';
        strengthText.textContent = 'Password strength will be shown here';
    });

    // Copy button click handler
    copyBtn.addEventListener('click', function() {
        if (generatedPassword.value) {
            generatedPassword.select();
            document.execCommand('copy');
            alert('Password copied to clipboard!');
        }
    });

    // Character type change handler
    [includeUppercase, includeLowercase, includeNumbers, includeSpecial].forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (generatedPassword.value) {
                updateStrengthIndicator(calculateStrength(generatedPassword.value));
            }
        });
    });
}); 