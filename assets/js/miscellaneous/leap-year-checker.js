document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const yearInput = document.getElementById('yearInput');
    const checkBtn = document.getElementById('checkBtn');
    const resultsSection = document.getElementById('resultsSection');
    const resultIcon = document.getElementById('resultIcon');
    const resultTitle = document.getElementById('resultTitle');
    const resultDescription = document.getElementById('resultDescription');
    const nextLeapYearInfo = document.getElementById('nextLeapYearInfo');

    // Helper Functions
    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    }

    function findNextLeapYear(year) {
        let nextYear = year + 1;
        while (!isLeapYear(nextYear)) {
            nextYear++;
        }
        return nextYear;
    }

    function findPreviousLeapYear(year) {
        let prevYear = year - 1;
        while (!isLeapYear(prevYear)) {
            prevYear--;
        }
        return prevYear;
    }

    function displayResult(year, isLeap) {
        // Set icon
        resultIcon.innerHTML = isLeap 
            ? '<i class="fas fa-calendar-check fa-3x text-success"></i>'
            : '<i class="fas fa-calendar-times fa-3x text-danger"></i>';

        // Set title
        resultTitle.textContent = isLeap 
            ? `${year} is a Leap Year`
            : `${year} is not a Leap Year`;

        // Set description
        if (isLeap) {
            resultDescription.textContent = `The year ${year} has 366 days with February 29th as the leap day.`;
        } else {
            resultDescription.textContent = `The year ${year} has 365 days.`;
        }

        // Show next leap year info
        const nextLeapYear = findNextLeapYear(year);
        const prevLeapYear = findPreviousLeapYear(year);
        
        if (isLeap) {
            nextLeapYearInfo.innerHTML = `
                <i class="fas fa-info-circle me-2"></i>
                The next leap year after ${year} will be ${nextLeapYear}.
            `;
        } else {
            nextLeapYearInfo.innerHTML = `
                <i class="fas fa-info-circle me-2"></i>
                The last leap year was ${prevLeapYear} and the next one will be ${nextLeapYear}.
            `;
        }
        nextLeapYearInfo.style.display = 'block';
    }

    // Event Listeners
    checkBtn.addEventListener('click', function() {
        const year = parseInt(yearInput.value);
        
        if (isNaN(year) || year < 1 || year > 9999) {
            alert('Please enter a valid year between 1 and 9999');
            return;
        }

        const isLeap = isLeapYear(year);
        displayResult(year, isLeap);
        resultsSection.style.display = 'block';
    });

    yearInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            checkBtn.click();
        }
    });

    // Set current year as default
    yearInput.value = new Date().getFullYear();
}); 