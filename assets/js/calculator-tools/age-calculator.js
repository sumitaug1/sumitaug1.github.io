document.addEventListener('DOMContentLoaded', function() {
    const dobInput = document.getElementById('dob');
    const ageResult = document.getElementById('age-result');
    const nextBirthday = document.getElementById('next-birthday');
    const milestones = document.getElementById('milestones');

    dobInput.addEventListener('change', calculateAge);

    function calculateAge() {
        const dob = new Date(dobInput.value);
        const today = new Date();

        if (isNaN(dob.getTime())) {
            ageResult.innerHTML = '<div class="alert alert-danger">Please enter a valid date of birth</div>';
            nextBirthday.innerHTML = '';
            milestones.innerHTML = '';
            return;
        }

        if (dob > today) {
            ageResult.innerHTML = '<div class="alert alert-danger">Date of birth cannot be in the future</div>';
            nextBirthday.innerHTML = '';
            milestones.innerHTML = '';
            return;
        }

        const age = getAge(dob, today);
        const nextBday = getNextBirthday(dob, today);
        const ageMilestones = getAgeMilestones(dob, today);

        // Display age in different units
        ageResult.innerHTML = `
            <div class="row">
                <div class="col-md-3">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Years</h5>
                            <p class="card-text display-4">${age.years}</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Months</h5>
                            <p class="card-text display-4">${age.months}</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Days</h5>
                            <p class="card-text display-4">${age.days}</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Weeks</h5>
                            <p class="card-text display-4">${age.weeks}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Display next birthday
        nextBirthday.innerHTML = `
            <div class="alert alert-info">
                <h4>Next Birthday</h4>
                <p>${nextBday.days} days until your next birthday</p>
                <p>It will be on ${nextBday.date.toLocaleDateString()}</p>
            </div>
        `;

        // Display age milestones
        milestones.innerHTML = `
            <h4>Age Milestones</h4>
            <div class="list-group">
                ${ageMilestones.map(milestone => `
                    <div class="list-group-item ${milestone.reached ? 'list-group-item-success' : 'list-group-item-light'}">
                        <div class="d-flex justify-content-between align-items-center">
                            <h5 class="mb-1">${milestone.age} years</h5>
                            <span class="badge bg-${milestone.reached ? 'success' : 'secondary'}">
                                ${milestone.reached ? 'Reached' : 'Upcoming'}
                            </span>
                        </div>
                        <p class="mb-1">${milestone.description}</p>
                        ${!milestone.reached ? `<small>In ${milestone.daysUntil} days</small>` : ''}
                    </div>
                `).join('')}
            </div>
        `;
    }

    function getAge(dob, today) {
        let years = today.getFullYear() - dob.getFullYear();
        let months = today.getMonth() - dob.getMonth();
        let days = today.getDate() - dob.getDate();

        if (days < 0) {
            months--;
            const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
            days += lastMonth.getDate();
        }

        if (months < 0) {
            years--;
            months += 12;
        }

        const totalDays = Math.floor((today - dob) / (1000 * 60 * 60 * 24));
        const weeks = Math.floor(totalDays / 7);

        return { years, months, days: totalDays, weeks };
    }

    function getNextBirthday(dob, today) {
        const nextBirthday = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());
        
        if (nextBirthday < today) {
            nextBirthday.setFullYear(today.getFullYear() + 1);
        }

        const daysUntil = Math.ceil((nextBirthday - today) / (1000 * 60 * 60 * 24));
        
        return {
            date: nextBirthday,
            days: daysUntil
        };
    }

    function getAgeMilestones(dob, today) {
        const milestones = [
            { age: 13, description: 'Teenager' },
            { age: 16, description: 'Driving Age (in most countries)' },
            { age: 18, description: 'Adult' },
            { age: 21, description: 'Legal Drinking Age (in most countries)' },
            { age: 30, description: 'Thirty' },
            { age: 40, description: 'Forty' },
            { age: 50, description: 'Fifty' },
            { age: 60, description: 'Sixty' },
            { age: 65, description: 'Retirement Age' },
            { age: 70, description: 'Seventy' },
            { age: 80, description: 'Eighty' },
            { age: 90, description: 'Ninety' },
            { age: 100, description: 'Century' }
        ];

        const age = getAge(dob, today).years;

        return milestones.map(milestone => {
            const milestoneDate = new Date(dob.getFullYear() + milestone.age, dob.getMonth(), dob.getDate());
            const daysUntil = Math.ceil((milestoneDate - today) / (1000 * 60 * 60 * 24));
            
            return {
                ...milestone,
                reached: age >= milestone.age,
                daysUntil: daysUntil
            };
        });
    }
}); 