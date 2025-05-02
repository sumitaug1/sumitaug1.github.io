document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const form = document.getElementById('invitationForm');
    const templateCards = document.querySelectorAll('.template-card');
    const colorOptions = document.querySelectorAll('.color-option');
    const fontSelect = document.getElementById('fontSelect');
    const previewBtn = document.getElementById('previewBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const downloadFromPreview = document.getElementById('downloadFromPreview');
    const previewModal = new bootstrap.Modal(document.getElementById('previewModal'));
    const invitationPreview = document.getElementById('invitationPreview');

    // Template configurations
    const templates = {
        elegant: {
            name: 'Elegant',
            class: 'template-elegant',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            accent: '#D4AF37'
        },
        modern: {
            name: 'Modern',
            class: 'template-modern',
            background: 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
            accent: '#000000'
        },
        classic: {
            name: 'Classic',
            class: 'template-classic',
            background: 'linear-gradient(135deg, #f3e7e9 0%, #e3eeff 100%)',
            accent: '#800020'
        }
    };

    // Color schemes
    const colorSchemes = {
        gold: {
            primary: '#D4AF37',
            secondary: '#B8860B',
            text: '#2C3E50'
        },
        rose: {
            primary: '#FFB6C1',
            secondary: '#FF69B4',
            text: '#4A4A4A'
        },
        sage: {
            primary: '#9CAF88',
            secondary: '#7D8B74',
            text: '#2C3E50'
        },
        navy: {
            primary: '#000080',
            secondary: '#0000CD',
            text: '#FFFFFF'
        },
        burgundy: {
            primary: '#800020',
            secondary: '#A52A2A',
            text: '#FFFFFF'
        }
    };

    // Font families
    const fonts = {
        playfair: "'Playfair Display', serif",
        montserrat: "'Montserrat', sans-serif",
        cursive: "'Dancing Script', cursive",
        serif: "'Times New Roman', serif"
    };

    // Current selections
    let currentTemplate = 'elegant';
    let currentColor = 'gold';
    let currentFont = 'playfair';

    // Template selection
    templateCards.forEach(card => {
        card.addEventListener('click', function() {
            templateCards.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            currentTemplate = this.dataset.template;
            updatePreview();
        });
    });

    // Color selection
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            colorOptions.forEach(o => o.classList.remove('active'));
            this.classList.add('active');
            currentColor = this.dataset.color;
            updatePreview();
        });
    });

    // Font selection
    fontSelect.addEventListener('change', function() {
        currentFont = this.value;
        updatePreview();
    });

    // Preview button
    previewBtn.addEventListener('click', function() {
        if (!validateForm()) return;
        updatePreview();
        previewModal.show();
    });

    // Download buttons
    downloadBtn.addEventListener('click', function() {
        if (!validateForm()) return;
        generatePDF();
    });

    downloadFromPreview.addEventListener('click', function() {
        generatePDF();
    });

    // Form validation
    function validateForm() {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('is-invalid');
                isValid = false;
            } else {
                field.classList.remove('is-invalid');
            }
        });

        return isValid;
    }

    // Update preview
    function updatePreview() {
        const template = templates[currentTemplate];
        const colors = colorSchemes[currentColor];
        const font = fonts[currentFont];

        const brideName = document.getElementById('brideName').value;
        const groomName = document.getElementById('groomName').value;
        const weddingDate = new Date(document.getElementById('weddingDate').value).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        const weddingTime = document.getElementById('weddingTime').value;
        const venue = document.getElementById('venue').value;
        const address = document.getElementById('address').value;
        const additionalInfo = document.getElementById('additionalInfo').value;

        invitationPreview.innerHTML = `
            <div class="invitation ${template.class}" style="background: ${template.background}; color: ${colors.text}; font-family: ${font};">
                <div class="invitation-content">
                    <h1 class="couple-names" style="color: ${colors.primary};">
                        ${brideName} & ${groomName}
                    </h1>
                    <div class="wedding-date" style="color: ${colors.secondary};">
                        ${weddingDate}
                    </div>
                    <div class="wedding-time">
                        ${weddingTime}
                    </div>
                    <div class="venue">
                        ${venue}
                    </div>
                    <div class="address">
                        ${address}
                    </div>
                    ${additionalInfo ? `
                        <div class="additional-info">
                            ${additionalInfo}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    // Generate PDF
    function generatePDF() {
        const element = invitationPreview;
        const opt = {
            margin: 1,
            filename: 'wedding-invitation.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save();
    }

    // Initialize
    updatePreview();
}); 