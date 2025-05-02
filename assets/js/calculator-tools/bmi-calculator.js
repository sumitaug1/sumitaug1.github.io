document.addEventListener('DOMContentLoaded', function() {
    const unitToggle = document.getElementById('unit-toggle');
    const metricInputs = document.getElementById('metric-inputs');
    const imperialInputs = document.getElementById('imperial-inputs');
    const calculateBtn = document.getElementById('calculate');
    const resultContainer = document.getElementById('result-container');
    const bmiChart = document.getElementById('bmi-chart');

    // Toggle between metric and imperial units
    unitToggle.addEventListener('change', function() {
        if (this.checked) {
            metricInputs.style.display = 'none';
            imperialInputs.style.display = 'block';
        } else {
            metricInputs.style.display = 'block';
            imperialInputs.style.display = 'none';
        }
    });

    // Calculate BMI
    calculateBtn.addEventListener('click', calculateBMI);

    function calculateBMI() {
        let height, weight;

        if (unitToggle.checked) {
            // Imperial units
            const feet = parseFloat(document.getElementById('feet').value) || 0;
            const inches = parseFloat(document.getElementById('inches').value) || 0;
            const pounds = parseFloat(document.getElementById('pounds').value) || 0;

            if (feet === 0 && inches === 0) {
                showError('Please enter a valid height');
                return;
            }

            if (pounds === 0) {
                showError('Please enter a valid weight');
                return;
            }

            // Convert to metric
            height = (feet * 12 + inches) * 0.0254; // Convert to meters
            weight = pounds * 0.453592; // Convert to kg
        } else {
            // Metric units
            height = parseFloat(document.getElementById('cm').value) / 100; // Convert to meters
            weight = parseFloat(document.getElementById('kg').value);

            if (isNaN(height) || height <= 0) {
                showError('Please enter a valid height');
                return;
            }

            if (isNaN(weight) || weight <= 0) {
                showError('Please enter a valid weight');
                return;
            }
        }

        const bmi = weight / (height * height);
        const category = getBMICategory(bmi);
        const idealWeight = calculateIdealWeight(height);

        displayResults(bmi, category, idealWeight);
    }

    function getBMICategory(bmi) {
        if (bmi < 18.5) return { category: 'Underweight', color: '#3498db' };
        if (bmi < 25) return { category: 'Normal weight', color: '#2ecc71' };
        if (bmi < 30) return { category: 'Overweight', color: '#f1c40f' };
        if (bmi < 35) return { category: 'Obesity Class I', color: '#e67e22' };
        if (bmi < 40) return { category: 'Obesity Class II', color: '#e74c3c' };
        return { category: 'Obesity Class III', color: '#c0392b' };
    }

    function calculateIdealWeight(height) {
        const lowerBMI = 18.5;
        const upperBMI = 24.9;
        const lowerWeight = lowerBMI * height * height;
        const upperWeight = upperBMI * height * height;

        return {
            lower: lowerWeight.toFixed(1),
            upper: upperWeight.toFixed(1)
        };
    }

    function displayResults(bmi, category, idealWeight) {
        const bmiValue = bmi.toFixed(1);
        
        resultContainer.innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Your BMI</h5>
                            <p class="display-4">${bmiValue}</p>
                            <p class="card-text">
                                <span class="badge bg-${getCategoryColor(category.category)}">
                                    ${category.category}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Ideal Weight Range</h5>
                            <p class="display-4">${idealWeight.lower} - ${idealWeight.upper} kg</p>
                            <p class="card-text">Based on a healthy BMI range of 18.5 - 24.9</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="mt-4">
                <h4>Health Information</h4>
                <div class="alert alert-${getCategoryAlert(category.category)}">
                    ${getHealthInfo(category.category)}
                </div>
            </div>
        `;

        updateChart(bmi);
    }

    function getCategoryColor(category) {
        switch(category) {
            case 'Underweight': return 'primary';
            case 'Normal weight': return 'success';
            case 'Overweight': return 'warning';
            case 'Obesity Class I': return 'danger';
            case 'Obesity Class II': return 'danger';
            case 'Obesity Class III': return 'danger';
            default: return 'secondary';
        }
    }

    function getCategoryAlert(category) {
        switch(category) {
            case 'Underweight': return 'info';
            case 'Normal weight': return 'success';
            case 'Overweight': return 'warning';
            case 'Obesity Class I': return 'danger';
            case 'Obesity Class II': return 'danger';
            case 'Obesity Class III': return 'danger';
            default: return 'secondary';
        }
    }

    function getHealthInfo(category) {
        switch(category) {
            case 'Underweight':
                return 'You may be at risk for nutritional deficiencies and osteoporosis. Consider consulting a healthcare provider.';
            case 'Normal weight':
                return 'Your weight is within a healthy range. Maintain a balanced diet and regular exercise.';
            case 'Overweight':
                return 'You may be at increased risk for health problems. Consider lifestyle changes to achieve a healthier weight.';
            case 'Obesity Class I':
                return 'You are at high risk for health problems. Consider consulting a healthcare provider for weight management.';
            case 'Obesity Class II':
                return 'You are at very high risk for health problems. Medical intervention may be necessary.';
            case 'Obesity Class III':
                return 'You are at extremely high risk for health problems. Immediate medical attention is recommended.';
            default:
                return '';
        }
    }

    function updateChart(bmi) {
        const categories = [
            { min: 0, max: 18.5, label: 'Underweight', color: '#3498db' },
            { min: 18.5, max: 25, label: 'Normal', color: '#2ecc71' },
            { min: 25, max: 30, label: 'Overweight', color: '#f1c40f' },
            { min: 30, max: 35, label: 'Obese I', color: '#e67e22' },
            { min: 35, max: 40, label: 'Obese II', color: '#e74c3c' },
            { min: 40, max: 50, label: 'Obese III', color: '#c0392b' }
        ];

        bmiChart.innerHTML = `
            <div class="bmi-scale">
                ${categories.map(cat => `
                    <div class="bmi-range" style="background-color: ${cat.color}">
                        <span class="bmi-label">${cat.label}</span>
                        <span class="bmi-values">${cat.min} - ${cat.max}</span>
                    </div>
                `).join('')}
            </div>
            <div class="bmi-marker" style="left: ${(bmi / 50) * 100}%">
                <div class="marker-line"></div>
                <div class="marker-value">${bmi.toFixed(1)}</div>
            </div>
        `;
    }

    function showError(message) {
        resultContainer.innerHTML = `
            <div class="alert alert-danger">
                ${message}
            </div>
        `;
    }
}); 