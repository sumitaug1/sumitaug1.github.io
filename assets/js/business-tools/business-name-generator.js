document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    let selectedNames = new Set();
    let generatedNames = [];

    // Form elements
    const nameGeneratorForm = document.getElementById('nameGeneratorForm');
    const resetBtn = document.getElementById('resetBtn');
    const saveBtn = document.getElementById('saveBtn');
    const resultsSection = document.getElementById('resultsSection');
    const nameResults = document.getElementById('nameResults');

    // Industry-specific word lists
    const industryWords = {
        technology: ['Tech', 'Digital', 'Cyber', 'Smart', 'Innovate', 'Code', 'Byte', 'Pixel', 'Logic', 'Data'],
        retail: ['Shop', 'Store', 'Market', 'Boutique', 'Emporium', 'Mart', 'Goods', 'Trade', 'Retail', 'Shop'],
        food: ['Taste', 'Flavor', 'Cuisine', 'Kitchen', 'Dining', 'Eats', 'Bites', 'Cafe', 'Restaurant', 'Food'],
        health: ['Wellness', 'Health', 'Vital', 'Care', 'Life', 'Med', 'Heal', 'Well', 'Fit', 'Health'],
        education: ['Learn', 'Teach', 'Edu', 'School', 'Academy', 'Study', 'Learn', 'Knowledge', 'Edu', 'School'],
        finance: ['Wealth', 'Money', 'Finance', 'Capital', 'Invest', 'Bank', 'Fund', 'Wealth', 'Money', 'Finance'],
        'real-estate': ['Home', 'Property', 'Estate', 'Realty', 'House', 'Home', 'Property', 'Estate', 'Realty'],
        creative: ['Creative', 'Design', 'Art', 'Studio', 'Craft', 'Create', 'Design', 'Art', 'Studio', 'Craft'],
        consulting: ['Consult', 'Advisor', 'Expert', 'Guide', 'Consult', 'Advisor', 'Expert', 'Guide', 'Consult'],
        other: ['Global', 'World', 'United', 'International', 'National', 'Global', 'World', 'United', 'International']
    };

    // Business type suffixes
    const businessTypeSuffixes = {
        startup: ['Labs', 'Tech', 'Innovations', 'Solutions', 'Ventures'],
        'small-business': ['Co', 'Company', 'Enterprises', 'Group', 'Partners'],
        enterprise: ['Corporation', 'International', 'Global', 'Systems', 'Technologies'],
        freelance: ['Studio', 'Works', 'Designs', 'Services', 'Solutions'],
        agency: ['Agency', 'Group', 'Partners', 'Collective', 'Team']
    };

    // Name style modifiers
    const nameStyles = {
        modern: ['Nova', 'Pulse', 'Spark', 'Flux', 'Nexus'],
        professional: ['Associates', 'Partners', 'Group', 'International', 'Global'],
        creative: ['Creative', 'Design', 'Studio', 'Works', 'Craft']
    };

    // Generate business name
    function generateBusinessName(industry, businessType, styles, keywords, length) {
        const industryWord = industryWords[industry][Math.floor(Math.random() * industryWords[industry].length)];
        const suffix = businessTypeSuffixes[businessType][Math.floor(Math.random() * businessTypeSuffixes[businessType].length)];
        
        let styleModifier = '';
        if (styles.length > 0) {
            const randomStyle = styles[Math.floor(Math.random() * styles.length)];
            styleModifier = nameStyles[randomStyle][Math.floor(Math.random() * nameStyles[randomStyle].length)];
        }

        let keyword = '';
        if (keywords && keywords.length > 0) {
            keyword = keywords[Math.floor(Math.random() * keywords.length)];
        }

        // Combine elements based on length preference
        let name = '';
        switch (length) {
            case 'short':
                name = `${industryWord} ${suffix}`;
                break;
            case 'medium':
                name = keyword ? `${industryWord} ${keyword} ${suffix}` : `${industryWord} ${styleModifier} ${suffix}`;
                break;
            case 'long':
                name = `${industryWord} ${keyword} ${styleModifier} ${suffix}`;
                break;
            default:
                name = Math.random() < 0.5 ? `${industryWord} ${suffix}` : `${industryWord} ${styleModifier} ${suffix}`;
        }

        return {
            name: name.trim(),
            style: styles[Math.floor(Math.random() * styles.length)],
            length: length
        };
    }

    // Generate multiple names
    function generateNames(count = 10) {
        const industry = document.getElementById('industry').value;
        const businessType = document.getElementById('businessType').value;
        const keywords = document.getElementById('keywords').value.split(',').map(k => k.trim()).filter(k => k);
        const length = document.getElementById('nameLength').value;

        // Get selected styles
        const styles = [];
        if (document.getElementById('styleModern').checked) styles.push('modern');
        if (document.getElementById('styleProfessional').checked) styles.push('professional');
        if (document.getElementById('styleCreative').checked) styles.push('creative');

        generatedNames = [];
        for (let i = 0; i < count; i++) {
            generatedNames.push(generateBusinessName(industry, businessType, styles, keywords, length));
        }

        renderNames();
    }

    // Render generated names
    function renderNames() {
        nameResults.innerHTML = '';
        generatedNames.forEach((name, index) => {
            const nameCard = document.createElement('div');
            nameCard.className = `col-md-6 col-lg-4 mb-3`;
            nameCard.innerHTML = `
                <div class="name-card ${selectedNames.has(index) ? 'selected' : ''}" data-index="${index}">
                    <h5>${name.name}</h5>
                    <div class="name-style">Style: ${name.style}</div>
                    <div class="name-length">Length: ${name.length}</div>
                </div>
            `;
            nameResults.appendChild(nameCard);
        });

        // Add click handlers
        document.querySelectorAll('.name-card').forEach(card => {
            card.addEventListener('click', () => {
                const index = parseInt(card.dataset.index);
                if (selectedNames.has(index)) {
                    selectedNames.delete(index);
                    card.classList.remove('selected');
                } else {
                    selectedNames.add(index);
                    card.classList.add('selected');
                }
            });
        });

        resultsSection.style.display = 'block';
    }

    // Save selected names
    function saveSelectedNames() {
        const selectedNameList = Array.from(selectedNames).map(index => generatedNames[index]);
        const text = selectedNameList.map(name => name.name).join('\n');
        
        // Create blob and download
        const blob = new Blob([text], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'business-names.txt';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }

    // Form submission
    nameGeneratorForm.addEventListener('submit', function(e) {
        e.preventDefault();
        generateNames();
    });

    // Reset form
    resetBtn.addEventListener('click', function() {
        nameGeneratorForm.reset();
        selectedNames.clear();
        generatedNames = [];
        resultsSection.style.display = 'none';
    });

    // Save button
    saveBtn.addEventListener('click', function() {
        if (selectedNames.size > 0) {
            saveSelectedNames();
        } else {
            alert('Please select at least one name to save.');
        }
    });
}); 