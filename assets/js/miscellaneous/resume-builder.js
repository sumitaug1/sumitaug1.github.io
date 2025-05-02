document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    let selectedTemplate = 'modern';
    let experienceItems = [];
    let educationItems = [];
    let additionalSections = [];

    // Template selection
    const templateItems = document.querySelectorAll('.template-item');
    templateItems.forEach(item => {
        item.addEventListener('click', () => {
            templateItems.forEach(t => t.classList.remove('active'));
            item.classList.add('active');
            selectedTemplate = item.dataset.template;
        });
    });

    // Form elements
    const resumeForm = document.getElementById('resumeForm');
    const addExperienceBtn = document.getElementById('addExperienceBtn');
    const addEducationBtn = document.getElementById('addEducationBtn');
    const addSectionBtn = document.getElementById('addSectionBtn');
    const resetBtn = document.getElementById('resetBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const previewModal = new bootstrap.Modal(document.getElementById('previewModal'));

    // Add experience item
    addExperienceBtn.addEventListener('click', () => {
        const experienceItem = {
            id: Date.now(),
            company: '',
            position: '',
            startDate: '',
            endDate: '',
            description: ''
        };
        experienceItems.push(experienceItem);
        renderExperienceItems();
    });

    // Add education item
    addEducationBtn.addEventListener('click', () => {
        const educationItem = {
            id: Date.now(),
            school: '',
            degree: '',
            field: '',
            startDate: '',
            endDate: '',
            description: ''
        };
        educationItems.push(educationItem);
        renderEducationItems();
    });

    // Add custom section
    addSectionBtn.addEventListener('click', () => {
        const sectionName = prompt('Enter section name:');
        if (sectionName) {
            const section = {
                id: Date.now(),
                name: sectionName,
                content: ''
            };
            additionalSections.push(section);
            renderAdditionalSections();
        }
    });

    // Render experience items
    function renderExperienceItems() {
        const container = document.getElementById('experienceContainer');
        container.innerHTML = experienceItems.map((item, index) => `
            <div class="experience-item mb-3 p-3 border rounded">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <h6 class="mb-0">Experience #${index + 1}</h6>
                    <button type="button" class="btn btn-sm btn-outline-danger" onclick="removeExperience(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="row">
                    <div class="col-md-6 mb-2">
                        <input type="text" class="form-control" placeholder="Company" 
                            onchange="updateExperience(${item.id}, 'company', this.value)">
                    </div>
                    <div class="col-md-6 mb-2">
                        <input type="text" class="form-control" placeholder="Position" 
                            onchange="updateExperience(${item.id}, 'position', this.value)">
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6 mb-2">
                        <input type="text" class="form-control" placeholder="Start Date" 
                            onchange="updateExperience(${item.id}, 'startDate', this.value)">
                    </div>
                    <div class="col-md-6 mb-2">
                        <input type="text" class="form-control" placeholder="End Date" 
                            onchange="updateExperience(${item.id}, 'endDate', this.value)">
                    </div>
                </div>
                <textarea class="form-control" placeholder="Description" rows="2" 
                    onchange="updateExperience(${item.id}, 'description', this.value)"></textarea>
            </div>
        `).join('');
    }

    // Render education items
    function renderEducationItems() {
        const container = document.getElementById('educationContainer');
        container.innerHTML = educationItems.map((item, index) => `
            <div class="education-item mb-3 p-3 border rounded">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <h6 class="mb-0">Education #${index + 1}</h6>
                    <button type="button" class="btn btn-sm btn-outline-danger" onclick="removeEducation(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="row">
                    <div class="col-md-6 mb-2">
                        <input type="text" class="form-control" placeholder="School" 
                            onchange="updateEducation(${item.id}, 'school', this.value)">
                    </div>
                    <div class="col-md-6 mb-2">
                        <input type="text" class="form-control" placeholder="Degree" 
                            onchange="updateEducation(${item.id}, 'degree', this.value)">
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6 mb-2">
                        <input type="text" class="form-control" placeholder="Field of Study" 
                            onchange="updateEducation(${item.id}, 'field', this.value)">
                    </div>
                    <div class="col-md-6 mb-2">
                        <input type="text" class="form-control" placeholder="Start Date" 
                            onchange="updateEducation(${item.id}, 'startDate', this.value)">
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6 mb-2">
                        <input type="text" class="form-control" placeholder="End Date" 
                            onchange="updateEducation(${item.id}, 'endDate', this.value)">
                    </div>
                </div>
                <textarea class="form-control" placeholder="Description" rows="2" 
                    onchange="updateEducation(${item.id}, 'description', this.value)"></textarea>
            </div>
        `).join('');
    }

    // Render additional sections
    function renderAdditionalSections() {
        const container = document.getElementById('additionalSections');
        container.innerHTML = additionalSections.map((section, index) => `
            <div class="section mb-4">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <h5 class="section-title mb-0">${section.name}</h5>
                    <button type="button" class="btn btn-sm btn-outline-danger" onclick="removeSection(${section.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <textarea class="form-control" rows="3" placeholder="Enter content for ${section.name}" 
                    onchange="updateSection(${section.id}, 'content', this.value)"></textarea>
            </div>
        `).join('');
    }

    // Update experience item
    window.updateExperience = function(id, field, value) {
        const item = experienceItems.find(item => item.id === id);
        if (item) {
            item[field] = value;
        }
    };

    // Update education item
    window.updateEducation = function(id, field, value) {
        const item = educationItems.find(item => item.id === id);
        if (item) {
            item[field] = value;
        }
    };

    // Update section
    window.updateSection = function(id, field, value) {
        const section = additionalSections.find(section => section.id === id);
        if (section) {
            section[field] = value;
        }
    };

    // Remove experience item
    window.removeExperience = function(id) {
        experienceItems = experienceItems.filter(item => item.id !== id);
        renderExperienceItems();
    };

    // Remove education item
    window.removeEducation = function(id) {
        educationItems = educationItems.filter(item => item.id !== id);
        renderEducationItems();
    };

    // Remove section
    window.removeSection = function(id) {
        additionalSections = additionalSections.filter(section => section.id !== id);
        renderAdditionalSections();
    };

    // Form submission
    resumeForm.addEventListener('submit', function(e) {
        e.preventDefault();
        generateResume();
        previewModal.show();
    });

    // Generate resume
    function generateResume() {
        const personalInfo = {
            fullName: document.getElementById('fullName').value,
            jobTitle: document.getElementById('jobTitle').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            location: document.getElementById('location').value,
            summary: document.getElementById('summary').value,
            skills: document.getElementById('skills').value.split(',').map(skill => skill.trim())
        };

        const resumeData = {
            template: selectedTemplate,
            personalInfo,
            experience: experienceItems,
            education: educationItems,
            additionalSections
        };

        renderResumePreview(resumeData);
    }

    // Render resume preview
    function renderResumePreview(data) {
        const preview = document.getElementById('resumePreview');
        preview.innerHTML = `
            <div class="resume ${data.template}">
                <div class="resume-header">
                    <h1>${data.personalInfo.fullName}</h1>
                    <h2>${data.personalInfo.jobTitle}</h2>
                    <div class="contact-info">
                        <p><i class="fas fa-envelope"></i> ${data.personalInfo.email}</p>
                        <p><i class="fas fa-phone"></i> ${data.personalInfo.phone}</p>
                        <p><i class="fas fa-map-marker-alt"></i> ${data.personalInfo.location}</p>
                    </div>
                </div>

                <div class="resume-section">
                    <h3>Professional Summary</h3>
                    <p>${data.personalInfo.summary}</p>
                </div>

                <div class="resume-section">
                    <h3>Work Experience</h3>
                    ${data.experience.map(exp => `
                        <div class="experience-item">
                            <h4>${exp.position}</h4>
                            <h5>${exp.company}</h5>
                            <p class="date">${exp.startDate} - ${exp.endDate}</p>
                            <p>${exp.description}</p>
                        </div>
                    `).join('')}
                </div>

                <div class="resume-section">
                    <h3>Education</h3>
                    ${data.education.map(edu => `
                        <div class="education-item">
                            <h4>${edu.degree} in ${edu.field}</h4>
                            <h5>${edu.school}</h5>
                            <p class="date">${edu.startDate} - ${edu.endDate}</p>
                            <p>${edu.description}</p>
                        </div>
                    `).join('')}
                </div>

                <div class="resume-section">
                    <h3>Skills</h3>
                    <div class="skills-list">
                        ${data.personalInfo.skills.map(skill => `
                            <span class="skill-tag">${skill}</span>
                        `).join('')}
                    </div>
                </div>

                ${data.additionalSections.map(section => `
                    <div class="resume-section">
                        <h3>${section.name}</h3>
                        <p>${section.content}</p>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // Download PDF
    downloadBtn.addEventListener('click', function() {
        const element = document.getElementById('resumePreview');
        const opt = {
            margin: 1,
            filename: 'resume.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save();
    });

    // Reset form
    resetBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to reset the form? All data will be lost.')) {
            resumeForm.reset();
            experienceItems = [];
            educationItems = [];
            additionalSections = [];
            renderExperienceItems();
            renderEducationItems();
            renderAdditionalSections();
        }
    });

    // Initialize sections
    renderExperienceItems();
    renderEducationItems();
    renderAdditionalSections();
}); 