document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const form = document.getElementById('privacyPolicyForm');
    const resultsCard = document.getElementById('resultsCard');
    const policyText = document.getElementById('policyText');
    const copyBtn = document.getElementById('copyBtn');

    // Set default date to today
    document.getElementById('lastUpdated').valueAsDate = new Date();

    // Generate privacy policy
    function generatePrivacyPolicy(data) {
        const {
            companyName,
            websiteUrl,
            contactEmail,
            collectName,
            collectEmail,
            collectPhone,
            collectAddress,
            useCookies,
            useAnalytics,
            useThirdParty,
            lastUpdated
        } = data;

        // Format date
        const formattedDate = new Date(lastUpdated).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Generate policy text
        let policy = `Privacy Policy for ${companyName}

Last Updated: ${formattedDate}

1. Introduction
Welcome to ${companyName} ("we," "our," or "us"). We are committed to protecting your privacy and personal information. This Privacy Policy explains how we collect, use, and protect your information when you visit our website at ${websiteUrl}.

2. Information We Collect
We collect the following types of information:`;

        // Add data collection details
        const collectedData = [];
        if (collectName) collectedData.push('name');
        if (collectEmail) collectedData.push('email address');
        if (collectPhone) collectedData.push('phone number');
        if (collectAddress) collectedData.push('address');

        if (collectedData.length > 0) {
            policy += `\n\nPersonal Information:
- ${collectedData.join('\n- ')}`;
        }

        // Add cookies section
        if (useCookies) {
            policy += `\n\n3. Cookies
We use cookies to enhance your browsing experience. Cookies are small text files that are stored on your device when you visit our website. They help us remember your preferences and provide a better user experience.`;
        }

        // Add analytics section
        if (useAnalytics) {
            policy += `\n\n4. Analytics
We use analytics tools to understand how visitors interact with our website. This helps us improve our services and user experience.`;
        }

        // Add third-party services section
        if (useThirdParty) {
            policy += `\n\n5. Third-Party Services
We may use third-party services that collect, monitor, and analyze information about your use of our website.`;
        }

        // Add standard sections
        policy += `\n\n6. How We Use Your Information
We use the information we collect to:
- Provide and maintain our services
- Improve user experience
- Communicate with you
- Comply with legal obligations

7. Data Security
We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.

8. Your Rights
You have the right to:
- Access your personal information
- Correct inaccurate information
- Request deletion of your information
- Opt-out of marketing communications

9. Contact Us
If you have any questions about this Privacy Policy, please contact us at:
Email: ${contactEmail}

10. Changes to This Policy
We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.`;

        return policy;
    }

    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form data
        const formData = {
            companyName: document.getElementById('companyName').value,
            websiteUrl: document.getElementById('websiteUrl').value,
            contactEmail: document.getElementById('contactEmail').value,
            collectName: document.getElementById('collectName').checked,
            collectEmail: document.getElementById('collectEmail').checked,
            collectPhone: document.getElementById('collectPhone').checked,
            collectAddress: document.getElementById('collectAddress').checked,
            useCookies: document.getElementById('useCookies').checked,
            useAnalytics: document.getElementById('useAnalytics').checked,
            useThirdParty: document.getElementById('useThirdParty').checked,
            lastUpdated: document.getElementById('lastUpdated').value
        };

        // Generate policy
        const policy = generatePrivacyPolicy(formData);

        // Display policy
        policyText.textContent = policy;
        resultsCard.classList.remove('d-none');

        // Scroll to results
        resultsCard.scrollIntoView({ behavior: 'smooth' });
    });

    // Handle copy button
    copyBtn.addEventListener('click', function() {
        const text = policyText.textContent;
        navigator.clipboard.writeText(text).then(() => {
            // Show success message
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check me-2"></i>Copied!';
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    });
}); 